import React, { createContext, useContext, useState } from 'react';
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
  ProjectStatus
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
  
  // Actions linked to dataService persistence
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
  resetPrototypeState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [activePage, setActivePage] = useState<PageView>('citizen-dashboard');
  const [language, setLanguage] = useState<Language>('en');
  
  // Load initial state from local storage data service
  const [challenges, setChallenges] = useState<Challenge[]>(() => dataService.getChallenges());
  const [projects, setProjects] = useState<Project[]>(() => dataService.getProjects());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => dataService.getNotifications());
  
  const [universities] = useState<University[]>(MOCK_UNIVERSITIES);
  const [industryPartners] = useState<IndustryPartner[]>(MOCK_INDUSTRY_PARTNERS);
  
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(challenges[0] || null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [pendingChallengeForProject, setPendingChallengeForProject] = useState<Challenge | null>(null);
  
  const [toasts, setToasts] = useState<ToastState[]>([]);

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
    const updated = dataService.validateChallenge(challengeId);
    setChallenges(updated);
    showToast(`Challenge validated by Government Admin and opened for university match.`, 'success');
  };

  const assignUniversityToChallenge = (challengeId: string, universityName: string) => {
    const updated = dataService.assignUniversity(challengeId, universityName);
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
  }): Promise<Challenge> => {
    const newChallenge = dataService.submitChallenge(data);
    setChallenges(dataService.getChallenges());
    setNotifications(dataService.getNotifications());
    setSelectedChallenge(newChallenge);

    showToast(`Challenge ${newChallenge.challengeCode} submitted successfully! Saved to data engine.`, 'success');
    return newChallenge;
  };

  const acceptChallenge = (challengeId: string, universityName: string) => {
    const updated = dataService.acceptChallenge(challengeId, universityName);
    setChallenges(updated);

    const targetCh = updated.find(c => c.id === challengeId);
    if (targetCh) {
      setPendingChallengeForProject(targetCh);
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
    const newProject = dataService.createProject(data);
    setProjects(dataService.getProjects());
    setChallenges(dataService.getChallenges());
    setSelectedProject(newProject);
    setPendingChallengeForProject(null);

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
    const updatedProjects = dataService.collaborateOnProject(projectId, partnerName, supportTypes, notes);
    setProjects(updatedProjects);
    setChallenges(dataService.getChallenges());

    const updatedSelected = updatedProjects.find(p => p.id === projectId);
    if (updatedSelected) setSelectedProject(updatedSelected);

    showToast(`Collaboration offer submitted by ${partnerName}! Pledged to project.`, 'success');
  };

  const advanceProjectStage = (projectId: string, newStatus: ProjectStatus) => {
    const updatedProjects = dataService.advanceProjectStage(projectId, newStatus);
    setProjects(updatedProjects);

    const updatedSelected = updatedProjects.find(p => p.id === projectId);
    if (updatedSelected) setSelectedProject(updatedSelected);

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
    const updated = dataService.markNotificationRead(id);
    setNotifications(updated);
  };

  const resetPrototypeState = () => {
    dataService.resetDemoData();
    setChallenges(dataService.getChallenges());
    setProjects(dataService.getProjects());
    setNotifications(dataService.getNotifications());
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
      toasts,
      showToast,
      removeToast,
      isGeminiActive: false,
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
