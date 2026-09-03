import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mapProfileFromDB } from '../lib/mappers';
import type { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (data: {
    email: string;
    pass: string;
    fullName: string;
    role: UserRole;
    organizationName?: string;
    district?: string;
  }) => Promise<{ requiresConfirmation?: boolean }>;
  logout: () => Promise<void>;
  loginAsDemoAccount: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  citizen: {
    id: 'usr-citizen-01',
    authUserId: 'auth-citizen-01',
    email: 'citizen@gati.in',
    fullName: 'Ramesh Singh (Citizen Lead)',
    role: 'citizen',
    district: 'Palamu',
    createdAt: new Date().toISOString()
  },
  university: {
    id: 'usr-uni-01',
    authUserId: 'auth-uni-01',
    email: 'university@gati.in',
    fullName: 'Dr. Pankaj Rai (BIT Sindri Faculty)',
    role: 'university',
    organizationName: 'BIT Sindri',
    district: 'Dhanbad',
    createdAt: new Date().toISOString()
  },
  industry: {
    id: 'usr-ind-01',
    authUserId: 'auth-ind-01',
    email: 'industry@gati.in',
    fullName: 'Vikram Sharma (Tata Steel / CSR Lead)',
    role: 'industry',
    organizationName: 'Tata Steel CSR',
    district: 'Jamshedpur/East Singhbhum',
    createdAt: new Date().toISOString()
  },
  admin: {
    id: 'usr-admin-01',
    authUserId: 'auth-admin-01',
    email: 'admin@gati.in',
    fullName: 'Shri R. K. Verma (Govt Admin)',
    role: 'admin',
    organizationName: 'Jharkhand Innovation Council',
    district: 'Ranchi',
    createdAt: new Date().toISOString()
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchOrCreateProfile = async (authUser: any): Promise<UserProfile> => {
    const authUserId = authUser.id;
    const email = authUser.email || '';
    const userMeta = authUser.user_metadata || {};

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', authUserId)
          .maybeSingle();

        if (dbProfile && !error) {
          const loadedProfile = mapProfileFromDB(dbProfile);
          setProfile(loadedProfile);
          return loadedProfile;
        }

        const derivedRole: UserRole = userMeta.role || 
          (email.includes('admin') ? 'admin' :
           email.includes('university') ? 'university' :
           email.includes('industry') ? 'industry' : 'citizen');

        const newProfileData = {
          auth_user_id: authUserId,
          email,
          full_name: userMeta.full_name || email.split('@')[0],
          role: derivedRole,
          organization_name: userMeta.organization_name || null,
          district: userMeta.district || 'Ranchi'
        };

        const { data: inserted, error: insertErr } = await supabase
          .from('profiles')
          .insert(newProfileData)
          .select()
          .single();

        if (inserted && !insertErr) {
          const createdProfile = mapProfileFromDB(inserted);
          setProfile(createdProfile);
          return createdProfile;
        }
      } catch (err) {
        console.warn('Supabase profile query fallback:', err);
      }
    }

    const fallbackRole: UserRole = userMeta.role || 
      (email.includes('admin') ? 'admin' :
       email.includes('university') ? 'university' :
       email.includes('industry') ? 'industry' : 'citizen');

    const fallbackProfile: UserProfile = {
      id: `usr-${authUserId.substring(0, 8)}`,
      authUserId,
      email,
      fullName: userMeta.full_name || email.split('@')[0],
      role: fallbackRole,
      organizationName: userMeta.organization_name,
      district: userMeta.district || 'Ranchi',
      createdAt: new Date().toISOString()
    };
    setProfile(fallbackProfile);
    return fallbackProfile;
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            setUser(session.user);
            await fetchOrCreateProfile(session.user);
          } else if (mounted) {
            const cachedRole = localStorage.getItem('gati_active_demo_role') as UserRole;
            if (cachedRole && DEMO_PROFILES[cachedRole]) {
              setProfile(DEMO_PROFILES[cachedRole]);
            }
          }
        } catch (e) {
          console.warn('Supabase getSession error:', e);
        } finally {
          if (mounted) setIsLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!mounted) return;
          if (session?.user) {
            setUser(session.user);
            await fetchOrCreateProfile(session.user);
          } else {
            setUser(null);
            const cachedRole = localStorage.getItem('gati_active_demo_role') as UserRole;
            if (cachedRole && DEMO_PROFILES[cachedRole]) {
              setProfile(DEMO_PROFILES[cachedRole]);
            } else {
              setProfile(null);
            }
          }
          setIsLoading(false);
        });

        return () => {
          subscription.unsubscribe();
        };
      } else {
        const cachedRole = (localStorage.getItem('gati_active_demo_role') as UserRole) || 'citizen';
        if (mounted) {
          setProfile(DEMO_PROFILES[cachedRole] || DEMO_PROFILES.citizen);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass
        });

        if (!error && data.user) {
          setUser(data.user);
          await fetchOrCreateProfile(data.user);
          localStorage.removeItem('gati_active_demo_role');
          return;
        }

        if (error && error.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('Email not confirmed. Please check your email inbox to verify your account before logging in.');
        }

        const matchedDemoRole = (Object.keys(DEMO_PROFILES) as UserRole[]).find(
          r => DEMO_PROFILES[r].email.toLowerCase() === cleanEmail
        );

        if (matchedDemoRole) {
          await loginAsDemoAccount(matchedDemoRole);
          return;
        }

        if (error) {
          throw new Error(error.message);
        }
      } else {
        const matchedRole = (Object.keys(DEMO_PROFILES) as UserRole[]).find(
          r => DEMO_PROFILES[r].email.toLowerCase() === cleanEmail
        );

        if (matchedRole) {
          await loginAsDemoAccount(matchedRole);
        } else {
          const customProfile: UserProfile = {
            id: `usr-${Date.now()}`,
            authUserId: `auth-${Date.now()}`,
            email: cleanEmail,
            fullName: cleanEmail.split('@')[0],
            role: 'citizen',
            district: 'Ranchi',
            createdAt: new Date().toISOString()
          };
          setProfile(customProfile);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: {
    email: string;
    pass: string;
    fullName: string;
    role: UserRole;
    organizationName?: string;
    district?: string;
  }): Promise<{ requiresConfirmation?: boolean }> => {
    setIsLoading(true);
    try {
      const cleanEmail = data.email.trim().toLowerCase();

      if (isSupabaseConfigured && supabase) {
        const { data: authData, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: data.pass,
          options: {
            data: {
              full_name: data.fullName,
              role: data.role,
              organization_name: data.organizationName,
              district: data.district || 'Ranchi'
            }
          }
        });

        if (error) throw new Error(error.message);

        if (authData.user) {
          setUser(authData.user);
          await fetchOrCreateProfile(authData.user);

          if (!authData.session) {
            return { requiresConfirmation: true };
          }
        }
      } else {
        const newProfile: UserProfile = {
          id: `usr-${Date.now()}`,
          authUserId: `auth-${Date.now()}`,
          email: cleanEmail,
          fullName: data.fullName,
          role: data.role,
          organizationName: data.organizationName,
          district: data.district || 'Ranchi',
          createdAt: new Date().toISOString()
        };
        setProfile(newProfile);
      }
      return { requiresConfirmation: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('SignOut error:', err);
    } finally {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('gati_active_demo_role');
      setIsLoading(false);
    }
  };

  const loginAsDemoAccount = async (role: UserRole) => {
    localStorage.setItem('gati_active_demo_role', role);
    setProfile(DEMO_PROFILES[role]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAuthenticated: Boolean(profile),
      isLoading,
      login,
      signup,
      logout,
      loginAsDemoAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
