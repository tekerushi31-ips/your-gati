import type { 
  Challenge, 
  Project, 
  NotificationItem, 
  Domain, 
  JharkhandDistrict, 
  Urgency, 
  SupportType, 
  ProjectStatus, 
  Milestone,
  AIAnalysis,
  UserProfile
} from '../types';
import { 
  MOCK_CHALLENGES, 
  MOCK_PROJECTS, 
  MOCK_NOTIFICATIONS,
  MOCK_UNIVERSITIES,
  MOCK_INDUSTRY_PARTNERS
} from '../data/mockData';

const STORAGE_KEYS = {
  CHALLENGES: 'yg_challenges_v1',
  PROJECTS: 'yg_projects_v1',
  NOTIFICATIONS: 'yg_notifications_v1',
  USER_PROFILE: 'yg_user_profile_v1'
};

// Safe JSON parser for localStorage
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage, using fallback:`, e);
    return fallback;
  }
}

// Safe JSON saver for localStorage
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const dataService = {
  // Reset all local storage data to initial demo state
  resetDemoData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CHALLENGES);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },

  // Challenge Queries & Mutations
  getChallenges: (): Challenge[] => {
    return loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, MOCK_CHALLENGES);
  },

  saveChallenges: (challenges: Challenge[]): void => {
    saveToStorage(STORAGE_KEYS.CHALLENGES, challenges);
  },

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
  }): Challenge => {
    const existing = dataService.getChallenges();
    const nextNum = existing.length + 125;
    const challengeCode = `YG-2026-00${nextNum}`;
    const newId = `ch-${Date.now()}`;

    // Demo AI Analysis classification model
    const aiAnalysis: AIAnalysis = {
      id: `ai-${Date.now()}`,
      challengeId: newId,
      modelName: 'gemini-2.5-flash (Prototype Ready)',
      isLiveGemini: false,
      problemDetected: true,
      detectedIssue: data.title,
      primaryCategory: data.domain,
      subCategory: 'Public Infrastructure Inspection',
      priority: data.urgency,
      confidenceScore: 92,
      visibleEvidence: ['Visual defect feature detected', 'Surface distress identified'],
      userReportedContext: data.description,
      estimatedImpact: `${data.affectedCount.toLocaleString()} Citizens Covered`,
      recommendedAction: 'Physical engineering inspection and university capstone assignment recommended.',
      requiredExpertise: ['Civil Engineering', 'Systems Engineering'],
      recommendedInstitutions: ['BIT Sindri', 'Ranchi University'],
      potentialIndustryPartners: ['State Public Works Dept', 'Tata Steel CSR'],
      summary: 'Prototype classification logged in local storage data engine.'
    };

    const newChallenge: Challenge = {
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

    const updated = [newChallenge, ...existing];
    dataService.saveChallenges(updated);

    // Also add notification
    const notifications = dataService.getNotifications();
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      role: 'all',
      title: 'New Challenge Reported',
      message: `${data.title} (${challengeCode}) in ${data.district}`,
      link: `/challenges/${newId}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    dataService.saveNotifications([newNotif, ...notifications]);

    return newChallenge;
  },

  validateChallenge: (challengeId: string): Challenge[] => {
    const existing = dataService.getChallenges();
    const updated = existing.map(ch => {
      if (ch.id === challengeId) {
        return { ...ch, status: 'VALIDATED' as const, updatedAt: new Date().toISOString() };
      }
      return ch;
    });
    dataService.saveChallenges(updated);
    return updated;
  },

  assignUniversity: (challengeId: string, universityName: string): Challenge[] => {
    const existing = dataService.getChallenges();
    const updated = existing.map(ch => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          status: 'UNIVERSITY_ASSIGNED' as const,
          assignedUniversity: universityName,
          universityName,
          updatedAt: new Date().toISOString()
        };
      }
      return ch;
    });
    dataService.saveChallenges(updated);
    return updated;
  },

  acceptChallenge: (challengeId: string, universityName: string): Challenge[] => {
    const existing = dataService.getChallenges();
    const updated = existing.map(ch => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          status: 'UNIVERSITY_ACCEPTED' as const,
          assignedUniversity: universityName,
          universityName,
          acceptedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return ch;
    });
    dataService.saveChallenges(updated);
    return updated;
  },

  // Project Queries & Mutations
  getProjects: (): Project[] => {
    return loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, MOCK_PROJECTS);
  },

  saveProjects: (projects: Project[]): void => {
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  },

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
  }): Project => {
    const existingProjects = dataService.getProjects();
    const challenges = dataService.getChallenges();
    const targetChallenge = challenges.find(c => c.id === data.challengeId) || challenges[0];
    const uni = MOCK_UNIVERSITIES.find(u => u.name === data.universityName) || MOCK_UNIVERSITIES[0];

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
      progressPercentage: 25,
      collaborations: [],
      milestones: initialMilestones,
      district: targetChallenge?.district || 'Ranchi',
      domain: targetChallenge?.domain || 'Infrastructure',
      createdAt: new Date().toISOString()
    };

    const updatedProjects = [newProject, ...existingProjects];
    dataService.saveProjects(updatedProjects);

    // Update challenge status in storage
    const updatedChallenges = challenges.map(c => c.id === data.challengeId ? { ...c, status: 'PROJECT_CREATED' as const } : c);
    dataService.saveChallenges(updatedChallenges);

    return newProject;
  },

  collaborateOnProject: (
    projectId: string,
    partnerName: string,
    supportTypes: SupportType[],
    notes: string
  ): Project[] => {
    const existingProjects = dataService.getProjects();
    const partner = MOCK_INDUSTRY_PARTNERS.find(p => p.name === partnerName) || MOCK_INDUSTRY_PARTNERS[0];

    const updatedProjects = existingProjects.map(proj => {
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

        return {
          ...proj,
          collaborations: [...(proj.collaborations || []), newCollab],
          milestones: updatedMilestones,
          status: 'IN_PROGRESS' as const,
          progressPercentage: 50
        };
      }
      return proj;
    });

    dataService.saveProjects(updatedProjects);

    // Update associated challenge status to INDUSTRY_COLLABORATION
    const targetProj = updatedProjects.find(p => p.id === projectId);
    if (targetProj) {
      const challenges = dataService.getChallenges();
      const updatedChallenges = challenges.map(c => c.id === targetProj.challengeId ? { ...c, status: 'INDUSTRY_COLLABORATION' as const } : c);
      dataService.saveChallenges(updatedChallenges);
    }

    return updatedProjects;
  },

  advanceProjectStage: (projectId: string, newStatus: ProjectStatus): Project[] => {
    const existingProjects = dataService.getProjects();
    const updated = existingProjects.map(proj => {
      if (proj.id === projectId) {
        let progress = proj.progressPercentage;
        if (newStatus === 'PLANNING' || newStatus === 'planning') progress = 20;
        else if (newStatus === 'IN_PROGRESS' || newStatus === 'in_progress') progress = 45;
        else if (newStatus === 'PROTOTYPE' || newStatus === 'prototype') progress = 70;
        else if (newStatus === 'PILOT_TESTING' || newStatus === 'pilot_testing') progress = 85;
        else if (newStatus === 'COMPLETED' || newStatus === 'completed') progress = 100;

        return { ...proj, status: newStatus, progressPercentage: progress };
      }
      return proj;
    });
    dataService.saveProjects(updated);
    return updated;
  },

  // Notification Queries & Mutations
  getNotifications: (): NotificationItem[] => {
    return loadFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
  },

  saveNotifications: (notifications: NotificationItem[]): void => {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  markNotificationRead: (id: string): NotificationItem[] => {
    const existing = dataService.getNotifications();
    const updated = existing.map(n => n.id === id ? { ...n, read: true } : n);
    dataService.saveNotifications(updated);
    return updated;
  },

  // Profile Queries & Mutations
  getUserProfile: (defaultRole: string): UserProfile => {
    const fallback: UserProfile = {
      id: 'usr-1',
      authUserId: 'auth-usr-1',
      fullName: defaultRole === 'admin' ? 'Rahul Kumar' :
                defaultRole === 'university' ? 'Dr. Pankaj Rai' :
                defaultRole === 'industry' ? 'Vikram Sharma' : 'Ramesh Singh',
      email: `${defaultRole}@gati.in`,
      role: defaultRole as any,
      organizationName: defaultRole === 'university' ? 'BIT Sindri' :
                         defaultRole === 'industry' ? 'Tata Steel' :
                         defaultRole === 'admin' ? 'Public Works Department' : undefined,
      district: 'Palamu',
      createdAt: new Date().toISOString()
    };
    return loadFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, fallback);
  },

  saveUserProfile: (profile: UserProfile): void => {
    saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);
  }
};
