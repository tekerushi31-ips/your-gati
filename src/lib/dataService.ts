import { supabase, isSupabaseConfigured } from './supabase';
import type { 
  Challenge, 
  Project, 
  NotificationItem, 
  Domain, 
  JharkhandDistrict, 
  Urgency, 
  SupportType, 
  ProjectStatus, 
  AIAnalysis,
  UserProfile,
  ChallengeStatus,
  MilestoneStatus
} from '../types';
import { 
  MOCK_CHALLENGES, 
  MOCK_PROJECTS, 
  MOCK_NOTIFICATIONS
} from '../data/mockData';
import {
  mapChallengeFromDB,
  mapChallengeToDB,
  mapAIAnalysisToDB,
  mapProjectFromDB,
  mapNotificationFromDB,
  mapNotificationToDB
} from './mappers';

const STORAGE_KEYS = {
  CHALLENGES: 'yg_challenges_v1',
  PROJECTS: 'yg_projects_v1',
  NOTIFICATIONS: 'yg_notifications_v1',
  USER_PROFILE: 'yg_user_profile_v1'
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const dataService = {
  resetDemoData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CHALLENGES);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },

  // -------------------------------------------------------------
  // CHALLENGES — Supabase DB Queries & Mutations
  // -------------------------------------------------------------
  getChallenges: async (): Promise<Challenge[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbChallenges, error } = await supabase
          .from('challenges')
          .select(`
            *,
            challenge_evidence(*),
            challenge_ai_analysis(*)
          `)
          .order('created_at', { ascending: false });

        if (!error && dbChallenges && dbChallenges.length > 0) {
          const mapped = dbChallenges.map(row => {
            const evidence = row.challenge_evidence || [];
            const aiRow = Array.isArray(row.challenge_ai_analysis) 
              ? row.challenge_ai_analysis[0] 
              : row.challenge_ai_analysis;
            return mapChallengeFromDB(row, evidence, aiRow);
          });
          saveToStorage(STORAGE_KEYS.CHALLENGES, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getChallenges fetch error, using cache/fallback:', err);
      }
    }
    return loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, MOCK_CHALLENGES);
  },

  getChallengeByCode: async (code: string): Promise<Challenge | null> => {
    const cleanCode = code.trim().toUpperCase();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbChallenges, error } = await supabase
          .from('challenges')
          .select(`
            *,
            challenge_evidence(*),
            challenge_ai_analysis(*)
          `)
          .ilike('challenge_code', cleanCode)
          .limit(1);

        if (!error && dbChallenges && dbChallenges.length > 0) {
          const row = dbChallenges[0];
          const evidence = row.challenge_evidence || [];
          const aiRow = Array.isArray(row.challenge_ai_analysis) ? row.challenge_ai_analysis[0] : row.challenge_ai_analysis;
          return mapChallengeFromDB(row, evidence, aiRow);
        }
      } catch (err) {
        console.warn('Supabase getChallengeByCode error:', err);
      }
    }

    const localList = loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, MOCK_CHALLENGES);
    return localList.find(c => c.challengeCode.toUpperCase() === cleanCode) || null;
  },

  submitChallenge: async (data: {
    title: string;
    description: string;
    domain: Domain;
    district: JharkhandDistrict;
    block: string;
    villageCity: string;
    location: string;
    affectedCount: number;
    urgency: Urgency;
    expectedSolution: string;
    contactInfo: string;
    evidenceFiles?: { url: string; name: string; type: 'image' | 'video' | 'document'; base64Data?: string }[];
    aiAnalysisResult?: AIAnalysis | null;
    createdBy?: string;
  }): Promise<Challenge> => {
    const existing = loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, MOCK_CHALLENGES);
    const nextNum = existing.length + 126;
    const challengeCode = `YG-2026-00${nextNum}`;
    const newId = `ch-${Date.now()}`;

    let savedChallenge: Challenge;

    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = {
          challenge_code: challengeCode,
          title: data.title,
          description: data.description,
          domain: data.domain,
          district: data.district,
          block: data.block || null,
          village_city: data.villageCity || null,
          location: data.location || null,
          affected_count: data.affectedCount || 100,
          urgency: data.urgency || 'MEDIUM',
          expected_solution: data.expectedSolution || null,
          contact_info: data.contactInfo || null,
          status: 'SUBMITTED',
          created_by: data.createdBy || null
        };

        const { data: inserted, error: insertErr } = await supabase
          .from('challenges')
          .insert(dbPayload)
          .select()
          .single();

        if (inserted && !insertErr) {
          const insertedId = inserted.id;

          // 1. Insert Evidence Files if present
          if (data.evidenceFiles && data.evidenceFiles.length > 0) {
            const evidenceRecords = data.evidenceFiles.map(f => ({
              challenge_id: insertedId,
              file_url: f.url,
              file_type: f.type,
              file_name: f.name
            }));
            await supabase.from('challenge_evidence').insert(evidenceRecords);
          }

          // 2. Insert Gemini AI Analysis if present
          let savedAI: AIAnalysis | undefined = undefined;
          if (data.aiAnalysisResult) {
            const aiDbPayload = mapAIAnalysisToDB(data.aiAnalysisResult, insertedId);
            const { data: insertedAI } = await supabase
              .from('challenge_ai_analysis')
              .insert(aiDbPayload)
              .select()
              .single();
            if (insertedAI) {
              savedAI = data.aiAnalysisResult;
            }
          }

          savedChallenge = mapChallengeFromDB(
            inserted, 
            data.evidenceFiles?.map(f => ({ file_url: f.url, file_type: f.type, file_name: f.name })) || [],
            savedAI
          );
        } else {
          throw new Error(insertErr?.message || 'Database insert failed');
        }
      } catch (err: any) {
        console.warn('Supabase submitChallenge failed, using local storage fallback:', err?.message);
        savedChallenge = dataService.createLocalChallengeFallback(data, challengeCode, newId);
      }
    } else {
      savedChallenge = dataService.createLocalChallengeFallback(data, challengeCode, newId);
    }

    // Save updated state to local cache & generate notification
    const currentList = loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, MOCK_CHALLENGES);
    dataService.saveChallenges([savedChallenge, ...currentList]);

    // Send Notification to DB
    await dataService.createNotification({
      role: 'all',
      title: 'New Challenge Reported',
      message: `${data.title} (${savedChallenge.challengeCode}) in ${data.district}`,
      relatedChallengeId: savedChallenge.id
    });

    return savedChallenge;
  },

  createLocalChallengeFallback: (data: any, challengeCode: string, newId: string): Challenge => {
    return {
      id: newId,
      challengeCode,
      title: data.title,
      description: data.description,
      domain: data.domain,
      district: data.district,
      block: data.block,
      villageCity: data.villageCity,
      location: data.location,
      affectedCount: data.affectedCount,
      urgency: data.urgency,
      expectedSolution: data.expectedSolution,
      contactInfo: data.contactInfo,
      status: 'SUBMITTED',
      evidence: data.evidenceFiles ? data.evidenceFiles.map((f: any, idx: number) => ({
        id: `ev-${idx}-${Date.now()}`,
        url: f.url,
        type: f.type,
        name: f.name
      })) : [],
      aiAnalysis: data.aiAnalysisResult || undefined,
      createdAt: new Date().toISOString()
    };
  },

  saveChallenges: (challenges: Challenge[]): void => {
    saveToStorage(STORAGE_KEYS.CHALLENGES, challenges);
  },

  validateChallenge: async (challengeId: string): Promise<Challenge[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('challenges')
          .update({ status: 'VALIDATED', updated_at: new Date().toISOString() })
          .eq('id', challengeId);
      } catch (e) {
        console.warn('Supabase validateChallenge error:', e);
      }
    }
    const existing = loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, MOCK_CHALLENGES);
    const updated = existing.map(ch => ch.id === challengeId ? { ...ch, status: 'VALIDATED' as ChallengeStatus, updatedAt: new Date().toISOString() } : ch);
    dataService.saveChallenges(updated);
    return updated;
  },

  assignUniversity: async (challengeId: string, universityName: string): Promise<Challenge[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('challenges')
          .update({ 
            status: 'UNIVERSITY_ASSIGNED', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', challengeId);
      } catch (e) {
        console.warn('Supabase assignUniversity error:', e);
      }
    }
    const existing = loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, MOCK_CHALLENGES);
    const updated = existing.map(ch => ch.id === challengeId ? { 
      ...ch, 
      status: 'UNIVERSITY_ASSIGNED' as ChallengeStatus, 
      assignedUniversity: universityName,
      universityName,
      updatedAt: new Date().toISOString() 
    } : ch);
    dataService.saveChallenges(updated);
    return updated;
  },

  acceptChallenge: async (challengeId: string, universityName: string): Promise<Challenge[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('challenges')
          .update({ 
            status: 'UNIVERSITY_ACCEPTED', 
            accepted_at: new Date().toISOString(),
            updated_at: new Date().toISOString() 
          })
          .eq('id', challengeId);
      } catch (e) {
        console.warn('Supabase acceptChallenge error:', e);
      }
    }
    const existing = loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, MOCK_CHALLENGES);
    const updated = existing.map(ch => ch.id === challengeId ? { 
      ...ch, 
      status: 'UNIVERSITY_ACCEPTED' as ChallengeStatus, 
      assignedUniversity: universityName,
      universityName,
      acceptedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    } : ch);
    dataService.saveChallenges(updated);
    return updated;
  },

  // -------------------------------------------------------------
  // PROJECTS — Supabase DB Queries & Mutations
  // -------------------------------------------------------------
  getProjects: async (): Promise<Project[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbProjects, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_milestones(*),
            industry_collaborations(*),
            challenges(challenge_code, title, district, domain)
          `)
          .order('created_at', { ascending: false });

        if (!error && dbProjects && dbProjects.length > 0) {
          const mapped = dbProjects.map(row => {
            const milestones = row.project_milestones || [];
            const collabs = row.industry_collaborations || [];
            const challengeRow = Array.isArray(row.challenges) ? row.challenges[0] : row.challenges;
            return mapProjectFromDB(row, milestones, collabs, challengeRow);
          });
          saveToStorage(STORAGE_KEYS.PROJECTS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getProjects error:', err);
      }
    }
    return loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, MOCK_PROJECTS);
  },

  saveProjects: (projects: Project[]): void => {
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  },

  createProject: async (data: {
    challengeId: string;
    title: string;
    description: string;
    universityName: string;
    facultyMentor: string;
    studentTeam: string[];
    requiredSkills: string[];
    requiredIndustrySupport: SupportType[];
    expectedOutcome: string;
  }): Promise<Project> => {
    const existingProjects = loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, MOCK_PROJECTS);
    const challenges = loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, MOCK_CHALLENGES);
    const targetChallenge = challenges.find(c => c.id === data.challengeId) || challenges[0];

    let savedProject: Project;
    const projId = `proj-${Date.now()}`;

    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = {
          challenge_id: data.challengeId,
          title: data.title,
          description: data.description,
          faculty_mentor: data.facultyMentor,
          student_team: data.studentTeam,
          required_skills: data.requiredSkills,
          required_industry_support: data.requiredIndustrySupport,
          expected_outcome: data.expectedOutcome,
          status: 'PLANNING',
          progress_percentage: 25
        };

        const { data: inserted, error: insertErr } = await supabase
          .from('projects')
          .insert(dbPayload)
          .select()
          .single();

        if (inserted && !insertErr) {
          const insertedProjId = inserted.id;

          // Create Initial Milestones
          const initialMs = [
            { project_id: insertedProjId, title: 'Challenge Validated & University Match', description: `Accepted by ${data.universityName}`, target_date: new Date().toISOString().split('T')[0], status: 'COMPLETED', completion_percentage: 100, responsible_role: `${data.universityName} Faculty` },
            { project_id: insertedProjId, title: 'Team Formation & Requirements Specification', description: `Student team assembled: ${data.studentTeam.join(', ')}`, target_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], status: 'IN_PROGRESS', completion_percentage: 40, responsible_role: 'Student Lead' },
            { project_id: insertedProjId, title: 'Industry Partner Onboarding', description: `Requesting support for: ${data.requiredIndustrySupport.join(', ')}`, target_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], status: 'PENDING', completion_percentage: 0, responsible_role: 'Industry Partner' }
          ];
          const { data: msInserted } = await supabase.from('project_milestones').insert(initialMs).select();

          // Update Challenge status in Supabase
          await supabase.from('challenges').update({ status: 'PROJECT_CREATED', updated_at: new Date().toISOString() }).eq('id', data.challengeId);

          savedProject = mapProjectFromDB(inserted, msInserted || [], [], targetChallenge ? mapChallengeToDB(targetChallenge) : null);
        } else {
          throw new Error(insertErr?.message || 'Project insert failed');
        }
      } catch (err) {
        console.warn('Supabase createProject error, using local fallback:', err);
        savedProject = dataService.createLocalProjectFallback(data, targetChallenge, projId);
      }
    } else {
      savedProject = dataService.createLocalProjectFallback(data, targetChallenge, projId);
    }

    const updatedProjects = [savedProject, ...existingProjects];
    dataService.saveProjects(updatedProjects);

    // Update challenge local status
    const updatedChallenges = challenges.map(c => c.id === data.challengeId ? { ...c, status: 'PROJECT_CREATED' as ChallengeStatus } : c);
    dataService.saveChallenges(updatedChallenges);

    return savedProject;
  },

  createLocalProjectFallback: (data: any, targetChallenge: any, projId: string): Project => {
    return {
      id: projId,
      challengeId: data.challengeId,
      challengeCode: targetChallenge?.challengeCode || 'YG-2026-00100',
      challengeTitle: targetChallenge?.title || data.title,
      universityId: 'uni-1',
      universityName: data.universityName,
      title: data.title,
      description: data.description,
      facultyMentor: data.facultyMentor,
      studentTeam: data.studentTeam,
      requiredSkills: data.requiredSkills,
      requiredIndustrySupport: data.requiredIndustrySupport,
      expectedOutcome: data.expectedOutcome,
      status: 'PLANNING',
      progressPercentage: 25,
      collaborations: [],
      milestones: [
        { id: `ms-${Date.now()}-1`, projectId: projId, title: 'Challenge Validated & Match', description: `Accepted by ${data.universityName}`, targetDate: new Date().toISOString().split('T')[0], status: 'COMPLETED', completionPercentage: 100, updatedAt: new Date().toISOString(), responsibleRole: `${data.universityName} Faculty` },
        { id: `ms-${Date.now()}-2`, projectId: projId, title: 'Team Formation & Scope', description: `Team: ${data.studentTeam.join(', ')}`, targetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], status: 'IN_PROGRESS', completionPercentage: 40, updatedAt: new Date().toISOString(), responsibleRole: 'Student Lead' }
      ],
      district: targetChallenge?.district || 'Ranchi',
      domain: targetChallenge?.domain || 'Infrastructure',
      createdAt: new Date().toISOString()
    };
  },

  collaborateOnProject: async (
    projectId: string,
    partnerName: string,
    supportTypes: SupportType[],
    notes: string
  ): Promise<Project[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const collabPayload = {
          project_id: projectId,
          partner_name: partnerName,
          support_types: supportTypes,
          notes,
          status: 'ACCEPTED'
        };
        await supabase.from('industry_collaborations').insert(collabPayload);
        await supabase.from('projects').update({ status: 'IN_PROGRESS', progress_percentage: 50, updated_at: new Date().toISOString() }).eq('id', projectId);
      } catch (err) {
        console.warn('Supabase collaborateOnProject error:', err);
      }
    }

    const existingProjects = loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, MOCK_PROJECTS);
    const updatedProjects = existingProjects.map(proj => {
      if (proj.id === projectId) {
        const newCollab = {
          id: `col-${Date.now()}`,
          projectId,
          partnerName,
          supportTypes,
          status: 'ACCEPTED' as const,
          notes,
          createdAt: new Date().toISOString()
        };
        return {
          ...proj,
          collaborations: [...(proj.collaborations || []), newCollab],
          status: 'IN_PROGRESS' as ProjectStatus,
          progressPercentage: 50
        };
      }
      return proj;
    });

    dataService.saveProjects(updatedProjects);
    return updatedProjects;
  },

  updateMilestoneProgress: async (
    projectId: string,
    milestoneId: string,
    status: MilestoneStatus,
    percentage: number
  ): Promise<Project[]> => {
    if (isSupabaseConfigured && supabase && !milestoneId.startsWith('ms-')) {
      try {
        await supabase
          .from('project_milestones')
          .update({
            status: status.toUpperCase(),
            completion_percentage: percentage,
            updated_at: new Date().toISOString()
          })
          .eq('id', milestoneId);
      } catch (err) {
        console.warn('Supabase updateMilestoneProgress error:', err);
      }
    }

    const existingProjects = loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, MOCK_PROJECTS);
    const updated = existingProjects.map(proj => {
      if (proj.id === projectId) {
        const updatedMs = proj.milestones.map(m => m.id === milestoneId ? { ...m, status, completionPercentage: percentage, updatedAt: new Date().toISOString() } : m);
        const totalPct = Math.round(updatedMs.reduce((acc, m) => acc + m.completionPercentage, 0) / updatedMs.length);
        return { ...proj, milestones: updatedMs, progressPercentage: totalPct };
      }
      return proj;
    });

    dataService.saveProjects(updated);
    return updated;
  },

  // -------------------------------------------------------------
  // STORAGE & EVIDENCE UPLOAD
  // -------------------------------------------------------------
  uploadEvidenceFile: async (file: File): Promise<{ url: string; type: 'image' | 'video' | 'document'; name: string }> => {
    const fileType: 'image' | 'video' | 'document' = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
      ? 'video'
      : 'document';

    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `evidence/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('challenge-evidence')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from('challenge-evidence').getPublicUrl(filePath);
          if (publicUrlData?.publicUrl) {
            return { url: publicUrlData.publicUrl, type: fileType, name: file.name };
          }
        }
      } catch (err) {
        console.warn('Supabase Storage upload fallback:', err);
      }
    }

    // Data URL fallback for local offline testing
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: reader.result as string,
          type: fileType,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    });
  },

  // -------------------------------------------------------------
  // NOTIFICATIONS — Supabase Queries & Mutations
  // -------------------------------------------------------------
  getNotifications: async (): Promise<NotificationItem[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbNotifications, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbNotifications && dbNotifications.length > 0) {
          const mapped = dbNotifications.map(mapNotificationFromDB);
          saveToStorage(STORAGE_KEYS.NOTIFICATIONS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getNotifications error:', err);
      }
    }
    return loadFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
  },

  createNotification: async (notif: {
    role?: string;
    title: string;
    message: string;
    relatedChallengeId?: string;
    relatedProjectId?: string;
  }): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = mapNotificationToDB({
          role: (notif.role || 'all') as any,
          title: notif.title,
          message: notif.message,
          relatedChallengeId: notif.relatedChallengeId,
          relatedProjectId: notif.relatedProjectId,
          read: false
        });
        await supabase.from('notifications').insert(dbPayload);
      } catch (err) {
        console.warn('Supabase createNotification error:', err);
      }
    }

    const existing = loadFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      role: (notif.role || 'all') as any,
      title: notif.title,
      message: notif.message,
      link: notif.relatedChallengeId ? `/challenges/${notif.relatedChallengeId}` : undefined,
      relatedChallengeId: notif.relatedChallengeId,
      relatedProjectId: notif.relatedProjectId,
      read: false,
      createdAt: new Date().toISOString()
    };
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...existing]);
  },

  markNotificationRead: async (id: string): Promise<NotificationItem[]> => {
    if (isSupabaseConfigured && supabase && !id.startsWith('notif-')) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
      } catch (e) {
        console.warn('Supabase markNotificationRead error:', e);
      }
    }

    const existing = loadFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    const updated = existing.map(n => n.id === id ? { ...n, read: true } : n);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  getUserProfile: (defaultRole: string): UserProfile => {
    const fallback: UserProfile = {
      id: 'usr-1',
      authUserId: 'auth-usr-1',
      fullName: defaultRole === 'admin' ? 'Shri R. K. Verma' :
                defaultRole === 'university' ? 'Dr. Pankaj Rai' :
                defaultRole === 'industry' ? 'Vikram Sharma' : 'Ramesh Singh',
      email: `${defaultRole}@gati.in`,
      role: defaultRole as any,
      organizationName: defaultRole === 'university' ? 'BIT Sindri' :
                         defaultRole === 'industry' ? 'Tata Steel CSR' :
                         defaultRole === 'admin' ? 'Jharkhand Innovation Council' : undefined,
      district: 'Palamu',
      createdAt: new Date().toISOString()
    };
    return loadFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, fallback);
  },

  saveUserProfile: (profile: UserProfile): void => {
    saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);
  }
};
