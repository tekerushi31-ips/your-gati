import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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
  }) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDemoAccount: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Built-in Demo Accounts for SIH Presentations across the SAME database
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
    fullName: 'Vikram Sharma (Tata Steel / IoT Lead)',
    role: 'industry',
    organizationName: 'IoT Solutions & Tata Steel CSR',
    district: 'Jamshedpur/East Singhbhum',
    createdAt: new Date().toISOString()
  },
  admin: {
    id: 'usr-admin-01',
    authUserId: 'auth-admin-01',
    email: 'admin@gati.in',
    fullName: 'Shri R. K. Verma (Jharkhand Govt Admin)',
    role: 'admin',
    organizationName: 'Jharkhand Innovation Council',
    district: 'Ranchi',
    createdAt: new Date().toISOString()
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(DEMO_PROFILES.citizen);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync Supabase Auth session if configured
  useEffect(() => {
    let mounted = true;

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const getInitialSession = async () => {
        try {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user && mounted) {
            setUser(session.user);
            await fetchProfile(session.user.id, session.user.email || '');
          }
        } catch (e) {
          console.warn('Supabase session fetch error:', e);
        } finally {
          if (mounted) setIsLoading(false);
        }
      };

      getInitialSession();

      const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          const cachedDemo = localStorage.getItem('gati_active_demo_role') as UserRole;
          if (cachedDemo && DEMO_PROFILES[cachedDemo]) {
            setProfile(DEMO_PROFILES[cachedDemo]);
          } else {
            setProfile(null);
          }
        }
        setIsLoading(false);
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } else {
      const cachedDemo = (localStorage.getItem('gati_active_demo_role') as UserRole) || 'citizen';
      setProfile(DEMO_PROFILES[cachedDemo] || DEMO_PROFILES.citizen);
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async (authUserId: string, email: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', authUserId)
          .single();

        if (dbProfile) {
          setProfile({
            id: dbProfile.id,
            authUserId: dbProfile.auth_user_id,
            email: dbProfile.email,
            fullName: dbProfile.full_name,
            role: dbProfile.role as UserRole,
            organizationName: dbProfile.organization_name,
            district: dbProfile.district,
            createdAt: dbProfile.created_at
          });
          return;
        }
      } catch (err) {
        console.warn('Profile fetch fallback:', err);
      }
    }

    setProfile({
      id: `usr-${authUserId.substring(0, 8)}`,
      authUserId,
      email,
      fullName: email.split('@')[0],
      role: 'citizen',
      createdAt: new Date().toISOString()
    });
  };

  const login = async (email: string, pass: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user.email || '');
      }
    } else {
      const matchedKey = (Object.keys(DEMO_PROFILES) as UserRole[]).find(r => DEMO_PROFILES[r].email.toLowerCase() === email.toLowerCase());
      if (matchedKey) {
        await loginAsDemoAccount(matchedKey);
      } else {
        const customProfile: UserProfile = {
          id: `usr-${Date.now()}`,
          authUserId: `auth-${Date.now()}`,
          email,
          fullName: email.split('@')[0],
          role: 'citizen',
          createdAt: new Date().toISOString()
        };
        setProfile(customProfile);
      }
    }
  };

  const signup = async (data: {
    email: string;
    pass: string;
    fullName: string;
    role: UserRole;
    organizationName?: string;
    district?: string;
  }) => {
    if (isSupabaseConfigured && supabase) {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
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
      if (error) throw error;
      if (authData.user) {
        setUser(authData.user);
        await fetchProfile(authData.user.id, authData.user.email || '');
      }
    } else {
      const newProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        authUserId: `auth-${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        organizationName: data.organizationName,
        district: data.district || 'Ranchi',
        createdAt: new Date().toISOString()
      };
      setProfile(newProfile);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('gati_active_demo_role');
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
