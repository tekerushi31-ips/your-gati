import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  MilestoneStatus,
  AIAnalysis
} from '../types';
import { 
  MOCK_UNIVERSITIES, 
  MOCK_INDUSTRY_PARTNERS 
} from '../data/mockData';
import { dataService } from '../lib/dataService';

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
  | 'nearby-issues'
  | 'help-support';

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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  isGeminiActive: boolean;
  
  // Data Service Operations (Async)
  refreshData: () => Promise<void>;
  validateChallenge: (challengeId: string) => Promise<void>;
  assignUniversityToChallenge: (challengeId: string, universityName: string) => Promise<void>;
  
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
    aiAnalysisResult?: AIAnalysis | null;
  }) => Promise<Challenge>;

  acceptChallenge: (challengeId: string, universityName: string) => Promise<void>;
  
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
  }) => Promise<Project>;

  collaborateOnProject: (
    projectId: string,
    partnerName: string,
    supportTypes: SupportType[],
    notes: string
  ) => Promise<void>;

  advanceProjectStage: (projectId: string, newStatus: ProjectStatus) => Promise<void>;
  updateMilestoneProgress: (projectId: string, milestoneId: string, status: MilestoneStatus, percentage: number) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  resetPrototypeState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [activePage, setActivePage] = useState<PageView>('citizen-dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const [universities] = useState<University[]>(MOCK_UNIVERSITIES);
  const [industryPartners] = useState<IndustryPartner[]>(MOCK_INDUSTRY_PARTNERS);
  
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [pendingChallengeForProject, setPendingChallengeForProject] = useState<Challenge | null>(null);
  
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const uniqueId = `toast-${Math.random().toString(36).substring(2, 9)}`;
    setToasts(prev => [...prev, { id: uniqueId, message, type }]);
    setTimeout(() => {
      removeToast(uniqueId);
    }, 4500);
  }, [removeToast]);

  const refreshData = useCallback(async () => {
    try {
      const fetchedChallenges = await dataService.getChallenges();
      const fetchedProjects = await dataService.getProjects();
      const fetchedNotifications = await dataService.getNotifications();

      setChallenges(fetchedChallenges);
      setProjects(fetchedProjects);
      setNotifications(fetchedNotifications);

      if (fetchedChallenges.length > 0 && !selectedChallenge) {
        setSelectedChallenge(fetchedChallenges[0]);
      }
      if (fetchedProjects.length > 0 && !selectedProject) {
        setSelectedProject(fetchedProjects[0]);
      }
    } catch (e) {
      console.warn('Refresh data error:', e);
    }
  }, [selectedChallenge, selectedProject]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'university') setActivePage('university-dashboard');
    else if (role === 'industry') setActivePage('industry-dashboard');
    else if (role === 'admin') setActivePage('admin-dashboard');
    else if (role === 'citizen') setActivePage('citizen-dashboard');
  };

  const validateChallenge = async (challengeId: string) => {
    const updated = await dataService.validateChallenge(challengeId);
    setChallenges(updated);
    showToast(`Challenge validated by Government Admin and opened for university match.`, 'success');
  };

  const assignUniversityToChallenge = async (challengeId: string, universityName: string) => {
    const updated = await dataService.assignUniversity(challengeId, universityName);
    setChallenges(updated);
    showToast(`Challenge assigned to ${universityName}! Sent to institution portal.`, 'success');
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
    aiAnalysisResult?: AIAnalysis | null;
  }): Promise<Challenge> => {
    const newChallenge = await dataService.submitChallenge(data);
    await refreshData();
    setSelectedChallenge(newChallenge);

    showToast(`Challenge ${newChallenge.challengeCode} submitted successfully to Supabase DB!`, 'success');
    return newChallenge;
  };

  const acceptChallenge = async (challengeId: string, universityName: string) => {
    const updated = await dataService.acceptChallenge(challengeId, universityName);
    setChallenges(updated);

    const targetCh = updated.find(c => c.id === challengeId);
    if (targetCh) {
      setPendingChallengeForProject(targetCh);
      setActivePage('create-project');
      showToast(`Challenge accepted by ${universityName}. Transitioning to project setup.`, 'success');
    }
  };

  const createProject = async (data: {
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
    const newProject = await dataService.createProject(data);
    await refreshData();
    setSelectedProject(newProject);
    setPendingChallengeForProject(null);

    showToast(`Project "${data.title}" created successfully in Supabase DB!`, 'success');
    setActivePage('project-lifecycle');
    return newProject;
  };

  const collaborateOnProject = async (
    projectId: string,
    partnerName: string,
    supportTypes: SupportType[],
    notes: string
  ) => {
    const updatedProjects = await dataService.collaborateOnProject(projectId, partnerName, supportTypes, notes);
    setProjects(updatedProjects);
    await refreshData();

    const updatedSelected = updatedProjects.find(p => p.id === projectId);
    if (updatedSelected) setSelectedProject(updatedSelected);

    showToast(`Collaboration offer submitted by ${partnerName}! Pledged to project.`, 'success');
  };

  const advanceProjectStage = async (projectId: string, newStatus: ProjectStatus) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    showToast(`Project stage updated to ${newStatus.toUpperCase().replace('_', ' ')}`, 'info');
  };

  const updateMilestoneProgress = async (
    projectId: string,
    milestoneId: string,
    status: MilestoneStatus,
    percentage: number
  ) => {
    const updated = await dataService.updateMilestoneProgress(projectId, milestoneId, status, percentage);
    setProjects(updated);
    const targetProj = updated.find(p => p.id === projectId);
    if (targetProj) setSelectedProject(targetProj);
    showToast('Milestone progress updated in Supabase DB.', 'success');
  };

  const markNotificationRead = async (id: string) => {
    const updated = await dataService.markNotificationRead(id);
    setNotifications(updated);
  };

  const resetPrototypeState = () => {
    dataService.resetDemoData();
    refreshData();
    showToast('Prototype demo data reset to default.', 'info');
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
      searchQuery,
      setSearchQuery,
      toasts,
      showToast,
      removeToast,
      isGeminiActive: true,
      refreshData,
      validateChallenge,
      assignUniversityToChallenge,
      submitChallenge,
      acceptChallenge,
      createProject,
      collaborateOnProject,
      advanceProjectStage,
      updateMilestoneProgress,
      markNotificationRead,
      resetPrototypeState
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
