import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  UserRole, 
  Challenge, 
  Project, 
  University, 
  IndustryPartner, 
  NotificationItem, 
  Domain, 
  JharkhandDistrict, 
  Urgency,
  SupportType,
  ProjectStatus,
  Milestone,
  AIAnalysis
} from '../types';
import { 
  MOCK_CHALLENGES, 
  MOCK_UNIVERSITIES, 
  MOCK_INDUSTRY_PARTNERS, 
  MOCK_PROJECTS, 
  MOCK_NOTIFICATIONS 
} from '../data/mockData';
import { analyzeChallengeWithGemini, isGeminiConfigured } from '../lib/geminiVision';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type PageView = 
  | 'login'
  | 'landing'
  | 'submit-challenge'
  | 'ai-analysis'
  | 'my-challenges'
  | 'track-challenge'
  | 'citizen-dashboard'
  | 'citizen-challenges'
  | 'citizen-track'
  | 'citizen-report'
  | 'citizen-nearby'
  | 'citizen-notifications'
  | 'citizen-profile'
  | 'citizen-settings'
  | 'university-dashboard' 
  | 'create-project' 
  | 'industry-dashboard' 
  | 'project-lifecycle' 
  | 'admin-dashboard'
  | 'admin-challenges'
  | 'admin-pending'
  | 'admin-in-progress'
  | 'admin-resolved'
  | 'admin-overdue'
  | 'admin-universities'
  | 'admin-assignments'
  | 'admin-industry'
  | 'admin-map'
  | 'admin-analytics'
  | 'admin-reports'
  | 'admin-departments'
  | 'admin-staff'
  | 'admin-challenge-detail'
  | 'nearby-issues';

export type Language = 'en' | 'hi' | 'mr';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  challenges: Challenge[];
  projects: Project[];
  universities: University[];
  industryPartners: IndustryPartner[];
  notifications: NotificationItem[];
  selectedChallenge: Challenge | null;
  setSelectedChallenge: (challenge: Challenge | null) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  pendingChallengeForProject: Challenge | null;
  setPendingChallengeForProject: (challenge: Challenge | null) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  isGeminiActive: boolean;
  
  // Actions
  validateChallenge: (challengeId: string) => void;
  assignUniversityToChallenge: (challengeId: string, universityName: string) => void;
  
  submitChallenge: (data: {
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
  }) => Promise<Challenge>;

  acceptChallenge: (challengeId: string, universityName: string) => void;
  
  createProject: (data: {
    challengeId: string;
    title: string;
    description: string;
    universityName: string;
    facultyMentor: string;
    studentTeam: string[];
    requiredSkills: string[];
    requiredIndustrySupport: SupportType[];
    expectedOutcome: string;
  }) => Project;

  collaborateOnProject: (
    projectId: string,
    partnerName: string,
    supportTypes: SupportType[],
    notes: string
  ) => void;

  advanceProjectStage: (projectId: string, newStatus: ProjectStatus) => void;
  updateMilestoneProgress: (projectId: string, milestoneId: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED', percentage: number) => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [activePage, setActivePage] = useState<PageView>('citizen-dashboard');
  const [language, setLanguage] = useState<Language>('en');
  
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [universities] = useState<University[]>(MOCK_UNIVERSITIES);
  const [industryPartners] = useState<IndustryPartner[]>(MOCK_INDUSTRY_PARTNERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(MOCK_CHALLENGES[0]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(MOCK_PROJECTS[0]);
  const [pendingChallengeForProject, setPendingChallengeForProject] = useState<Challenge | null>(null);
  
  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const sb = supabase;
      const fetchSupabaseData = async () => {
        try {
          const { data: dbChallenges } = await sb.from('challenges').select('*');
          if (dbChallenges && dbChallenges.length > 0) {
            console.log('Loaded challenges from Supabase:', dbChallenges.length);
          }
        } catch (e) {
          console.warn('Supabase fetch fallback to mock store:', e);
        }
      };
      fetchSupabaseData();
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'university') setActivePage('university-dashboard');
    else if (role === 'industry') setActivePage('industry-dashboard');
    else if (role === 'admin') setActivePage('admin-dashboard');
    else if (role === 'citizen') setActivePage('citizen-dashboard');
  };

  const validateChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          status: 'VALIDATED' as any
        };
      }
      return ch;
    }));
    showToast(`Challenge validated by Government Admin and opened for university match.`, 'success');
  };

  const assignUniversityToChallenge = (challengeId: string, universityName: string) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          status: 'UNIVERSITY_ASSIGNED' as any,
          assignedUniversity: universityName,
          universityName
        };
      }
      return ch;
    }));
    showToast(`Challenge assigned to ${universityName}! Opportunity sent to institution portal.`, 'success');
  };

  const submitChallenge = async (data: {
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
  }): Promise<Challenge> => {
    const nextNum = challenges.length + 125;
    const challengeCode = `YG-2026-00${nextNum}`;
    const newId = `ch-${Date.now()}`;

    const imageEvidence = data.evidenceFiles?.find(f => f.type === 'image' && f.base64Data);

    let aiAnalysis: AIAnalysis;
    try {
      aiAnalysis = await analyzeChallengeWithGemini({
        challengeId: newId,
        title: data.title,
        description: data.description,
        district: data.district,
        domain: data.domain,
        urgency: data.urgency,
        imageBase64: imageEvidence?.base64Data,
        imageMimeType: 'image/jpeg'
      });
    } catch (err) {
      console.warn('Gemini API call failed, falling back to structured result:', err);
      showToast('Gemini API request failed. Using structured fallback analysis.', 'warning');
      aiAnalysis = {
        id: `ai-fallback-${Date.now()}`,
        challengeId: newId,
        modelName: 'gemini-2.5-flash (Fallback)',
        isLiveGemini: false,
        problemDetected: true,
        detectedIssue: data.title,
        primaryCategory: data.domain,
        subCategory: 'Infrastructure Inspection',
        priority: data.urgency,
        confidenceScore: 90,
        visibleEvidence: ['Visual inspection pending physical survey'],
        userReportedContext: data.description,
        estimatedImpact: `${data.affectedCount.toLocaleString()} Citizens`,
        recommendedAction: 'Physical engineering inspection recommended.',
        requiredExpertise: ['Civil Engineering', 'Systems Engineering'],
        recommendedInstitutions: ['BIT Sindri', 'Ranchi University'],
        potentialIndustryPartners: ['State Public Works Dept'],
        summary: 'Standard challenge classification logged in database.'
      };
    }

    const newChallenge: Challenge = {
      id: newId,
      challengeCode,
      title: data.title,
      description: data.description,
      domain: aiAnalysis.primaryCategory || data.domain,
      district: data.district,
      block: data.block,
      villageCity: data.villageCity,
      location: data.location,
      affectedCount: data.affectedCount,
      urgency: aiAnalysis.priority || data.urgency,
      expectedSolution: data.expectedSolution,
      contactInfo: data.contactInfo,
      status: 'SUBMITTED',
      evidence: data.evidenceFiles ? data.evidenceFiles.map((f, idx) => ({
        id: `ev-${idx}-${Date.now()}`,
        url: f.url,
        type: f.type,
        name: f.name,
        base64Data: f.base64Data
      })) : [],
      aiAnalysis,
      createdAt: new Date().toISOString()
    };

    setChallenges(prev => [newChallenge, ...prev]);
    setSelectedChallenge(newChallenge);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('challenges').insert([{
          challenge_code: challengeCode,
          title: data.title,
          description: data.description,
          domain: data.domain,
          district: data.district,
          block: data.block,
          village_city: data.villageCity,
          location: data.location,
          affected_count: data.affectedCount,
          urgency: data.urgency,
          expected_solution: data.expectedSolution,
          contact_info: data.contactInfo,
          status: 'SUBMITTED'
        }]);

        await supabase.from('challenge_ai_analysis').insert([{
          challenge_id: newId,
          model_name: aiAnalysis.modelName,
          primary_category: aiAnalysis.primaryCategory,
          priority: aiAnalysis.priority,
          estimated_impact: aiAnalysis.estimatedImpact,
          required_expertise: aiAnalysis.requiredExpertise,
          recommended_institutions: aiAnalysis.recommendedInstitutions,
          potential_industry_partners: aiAnalysis.potentialIndustryPartners,
          confidence_score: aiAnalysis.confidenceScore,
          summary: aiAnalysis.summary
        }]);
      } catch (err) {
        console.error('Supabase write error:', err);
      }
    }

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      role: 'all',
      title: 'New Community Challenge Submitted',
      message: `${data.title} (${challengeCode}) in ${data.district}`,
      link: `/challenges/${newId}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Challenge ${challengeCode} submitted successfully!`, 'success');
    return newChallenge;
  };

  const acceptChallenge = (challengeId: string, universityName: string) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          status: 'UNIVERSITY_ACCEPTED',
          assignedUniversity: universityName,
          universityName
        };
      }
      return ch;
    }));

    const targetCh = challenges.find(c => c.id === challengeId);
    if (targetCh) {
      setPendingChallengeForProject({ ...targetCh, status: 'UNIVERSITY_ACCEPTED', assignedUniversity: universityName });
      setActivePage('create-project');
      showToast(`Challenge accepted by ${universityName}. Transitioning to project setup.`, 'success');
    }
  };

  const createProject = (data: {
    challengeId: string;
    title: string;
    description: string;
    universityName: string;
    facultyMentor: string;
    studentTeam: string[];
    requiredSkills: string[];
    requiredIndustrySupport: SupportType[];
    expectedOutcome: string;
  }): Project => {
    const targetChallenge = challenges.find(c => c.id === data.challengeId) || selectedChallenge;
    const uni = universities.find(u => u.name === data.universityName) || universities[0];

    const projId = `proj-${Date.now()}`;
    const initialMilestones: Milestone[] = [
      {
        id: `ms-${Date.now()}-1`,
        projectId: projId,
        title: 'Challenge Validated & University Match',
        description: `Accepted by ${data.universityName} under mentorship of ${data.facultyMentor}.`,
        targetDate: new Date().toISOString().split('T')[0],
        status: 'COMPLETED',
        completionPercentage: 100,
        updatedAt: new Date().toISOString(),
        responsibleRole: `${data.universityName} Faculty`
      },
      {
        id: `ms-${Date.now()}-2`,
        projectId: projId,
        title: 'Team Formation & Requirements Specification',
        description: `Student team assembled: ${data.studentTeam.join(', ')}.`,
        targetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        status: 'IN_PROGRESS',
        completionPercentage: 40,
        updatedAt: new Date().toISOString(),
        responsibleRole: 'Student Lead'
      },
      {
        id: `ms-${Date.now()}-3`,
        projectId: projId,
        title: 'Industry Partner Onboarding',
        description: `Requesting support for: ${data.requiredIndustrySupport.join(', ')}.`,
        targetDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        status: 'PENDING',
        completionPercentage: 0,
        updatedAt: new Date().toISOString(),
        responsibleRole: 'Industry Partner'
      },
      {
        id: `ms-${Date.now()}-4`,
        projectId: projId,
        title: 'Prototype Development & Testing',
        description: 'Building functional MVP prototype.',
        targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'PENDING',
        completionPercentage: 0,
        updatedAt: new Date().toISOString(),
        responsibleRole: 'University Innovation Lab'
      },
      {
        id: `ms-${Date.now()}-5`,
        projectId: projId,
        title: 'Field Pilot Deployment',
        description: `Deploying pilot in ${targetChallenge?.district || 'Jharkhand'}.`,
        targetDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
        status: 'PENDING',
        completionPercentage: 0,
        updatedAt: new Date().toISOString(),
        responsibleRole: 'University + Industry + Govt'
      }
    ];

    const newProject: Project = {
      id: projId,
      challengeId: data.challengeId,
      challengeCode: targetChallenge?.challengeCode || 'YG-2026-00100',
      challengeTitle: targetChallenge?.title || data.title,
      universityId: uni.id,
      universityName: uni.name,
      title: data.title,
      description: data.description,
      facultyMentor: data.facultyMentor,
      studentTeam: data.studentTeam,
      requiredSkills: data.requiredSkills,
      requiredIndustrySupport: data.requiredIndustrySupport,
      expectedOutcome: data.expectedOutcome,
      status: 'PLANNING',
      progressPercentage: 20,
      collaborations: [],
      milestones: initialMilestones,
      district: targetChallenge?.district || 'Ranchi',
      domain: targetChallenge?.domain || 'Water Management',
      createdAt: new Date().toISOString()
    };

    setProjects(prev => [newProject, ...prev]);
    setSelectedProject(newProject);
    setPendingChallengeForProject(null);

    setChallenges(prev => prev.map(c => c.id === data.challengeId ? { ...c, status: 'PROJECT_CREATED' } : c));

    showToast(`Project "${data.title}" created successfully!`, 'success');
    setActivePage('project-lifecycle');
    return newProject;
  };

  const collaborateOnProject = (
    projectId: string,
    partnerName: string,
    supportTypes: SupportType[],
    notes: string
  ) => {
    const partner = industryPartners.find(p => p.name === partnerName) || industryPartners[0];
    
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        const newCollab = {
          id: `col-${Date.now()}`,
          projectId,
          partnerId: partner.id,
          partnerName: partner.name,
          supportTypes,
          status: 'ACCEPTED' as const,
          notes,
          createdAt: new Date().toISOString()
        };

        const updatedMilestones = proj.milestones.map(m => {
          if (m.title.includes('Industry Partner Onboarding')) {
            return {
              ...m,
              status: 'COMPLETED' as const,
              completionPercentage: 100,
              description: `Partnered with ${partner.name} for ${supportTypes.join(', ')}.`
            };
          }
          return m;
        });

        const updatedProj = {
          ...proj,
          collaborations: [...proj.collaborations, newCollab],
          milestones: updatedMilestones,
          status: 'IN_PROGRESS' as const,
          progressPercentage: 45
        };

        if (selectedProject?.id === projectId) {
          setSelectedProject(updatedProj);
        }

        setChallenges(chPrev => chPrev.map(c => c.id === proj.challengeId ? { ...c, status: 'INDUSTRY_COLLABORATION' } : c));

        return updatedProj;
      }
      return proj;
    }));

    showToast(`Collaboration offer submitted by ${partnerName}!`, 'success');
  };

  const advanceProjectStage = (projectId: string, newStatus: ProjectStatus) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        let progress = proj.progressPercentage;
        if (newStatus === 'PLANNING' || newStatus === 'planning') progress = 20;
        else if (newStatus === 'IN_PROGRESS' || newStatus === 'in_progress') progress = 40;
        else if (newStatus === 'PROTOTYPE' || newStatus === 'prototype') progress = 65;
        else if (newStatus === 'PILOT_TESTING' || newStatus === 'pilot_testing') progress = 85;
        else if (newStatus === 'COMPLETED' || newStatus === 'completed') progress = 100;

        const updated = { ...proj, status: newStatus, progressPercentage: progress };
        if (selectedProject?.id === projectId) setSelectedProject(updated);
        return updated;
      }
      return proj;
    }));
    showToast(`Project stage updated to ${newStatus.toUpperCase().replace('_', ' ')}`, 'info');
  };

  const updateMilestoneProgress = (
    projectId: string,
    milestoneId: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
    percentage: number
  ) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        const updatedMs = proj.milestones.map(m => m.id === milestoneId ? { ...m, status, completionPercentage: percentage, updatedAt: new Date().toISOString() } : m);
        const totalPct = Math.round(updatedMs.reduce((acc, m) => acc + m.completionPercentage, 0) / updatedMs.length);
        const updated = { ...proj, milestones: updatedMs, progressPercentage: totalPct };
        if (selectedProject?.id === projectId) setSelectedProject(updated);
        return updated;
      }
      return proj;
    }));
    showToast('Milestone progress updated.', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setRole,
      activePage,
      setActivePage,
      language,
      setLanguage,
      challenges,
      projects,
      universities,
      industryPartners,
      notifications,
      selectedChallenge,
      setSelectedChallenge,
      selectedProject,
      setSelectedProject,
      pendingChallengeForProject,
      setPendingChallengeForProject,
      toasts,
      showToast,
      removeToast,
      isGeminiActive: isGeminiConfigured,
      validateChallenge,
      assignUniversityToChallenge,
      submitChallenge,
      acceptChallenge,
      createProject,
      collaborateOnProject,
      advanceProjectStage,
      updateMilestoneProgress,
      markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
