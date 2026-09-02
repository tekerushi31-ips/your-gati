export type UserRole = 'citizen' | 'university' | 'industry' | 'admin';

export interface UserProfile {
  id: string;
  authUserId: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationName?: string;
  district?: string;
  createdAt: string;
}

export type Domain = 
  | 'Education' 
  | 'Healthcare' 
  | 'Agriculture' 
  | 'Water Management' 
  | 'Sanitation' 
  | 'Environment' 
  | 'Energy' 
  | 'Urban Development' 
  | 'Accessibility' 
  | 'Public Administration' 
  | 'Rural Livelihoods'
  | 'Transportation/Infrastructure';

export type JharkhandDistrict = 
  | 'Ranchi' 
  | 'Dhanbad' 
  | 'Bokaro' 
  | 'Jamshedpur/East Singhbhum' 
  | 'Palamu' 
  | 'Hazaribagh' 
  | 'Deoghar' 
  | 'Giridih' 
  | 'Dumka' 
  | 'West Singhbhum' 
  | 'Ramgarh' 
  | 'Garhwa';

export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ChallengeStatus = 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'VALIDATED' 
  | 'UNIVERSITY_ASSIGNED' 
  | 'UNIVERSITY_ACCEPTED' 
  | 'PROJECT_CREATED' 
  | 'INDUSTRY_COLLABORATION' 
  | 'PROTOTYPE' 
  | 'PILOT_TESTING' 
  | 'DEPLOYED' 
  | 'IMPACT_MEASURED'
  | 'submitted'
  | 'validated'
  | 'assigned'
  | 'in_development'
  | 'pilot';

export type ProjectStatus = 
  | 'PLANNING' 
  | 'IN_PROGRESS' 
  | 'PROTOTYPE' 
  | 'PILOT_TESTING' 
  | 'COMPLETED'
  | 'planning'
  | 'in_progress'
  | 'prototype'
  | 'pilot_testing'
  | 'completed';

export type SupportType = 'Mentorship' | 'Funding' | 'Hardware' | 'Software' | 'Testing' | 'Pilot Deployment';

export interface EvidenceItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  name: string;
  base64Data?: string;
}

export interface AIAnalysis {
  id: string;
  challengeId: string;
  modelName: string;
  isLiveGemini: boolean;
  problemDetected: boolean;
  detectedIssue: string;
  primaryCategory: Domain;
  subCategory: string;
  priority: Urgency;
  confidenceScore: number;
  visibleEvidence: string[];
  userReportedContext?: string;
  estimatedImpact: string;
  recommendedAction: string;
  requiredExpertise: string[];
  recommendedInstitutions: string[];
  potentialIndustryPartners: string[];
  summary: string;
}

export interface Challenge {
  id: string;
  challengeCode: string;
  createdBy?: string;
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
  status: ChallengeStatus;
  evidence: EvidenceItem[];
  aiAnalysis?: AIAnalysis;
  universityId?: string;
  assignedUniversity?: string;
  universityName?: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface University {
  id: string;
  name: string;
  district: JharkhandDistrict;
  type: string;
  contactEmail: string;
  website: string;
  expertise: string[];
}

export interface IndustryPartner {
  id: string;
  name: string;
  sector: string;
  contactPerson: string;
  email: string;
  location: string;
}

export type CollaborationStatus = 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'pledged' | 'active' | 'completed';

export interface Collaboration {
  id: string;
  projectId: string;
  partnerId?: string;
  partnerName: string;
  supportTypes: SupportType[];
  status: CollaborationStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'pending' | 'in_progress' | 'completed';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  targetDate: string;
  status: MilestoneStatus;
  completionPercentage: number;
  evidenceUrl?: string;
  updatedAt: string;
  responsibleRole: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId?: string;
  name: string;
  role: 'STUDENT' | 'FACULTY' | 'MENTOR';
  joinedAt: string;
}

export interface Project {
  id: string;
  challengeId: string;
  challengeCode: string;
  challengeTitle: string;
  universityId: string;
  universityName: string;
  title: string;
  description: string;
  facultyMentor: string;
  studentTeam: string[];
  requiredSkills: string[];
  requiredIndustrySupport: SupportType[];
  expectedOutcome: string;
  status: ProjectStatus;
  progressPercentage: number;
  collaborations: Collaboration[];
  milestones: Milestone[];
  members?: ProjectMember[];
  district: JharkhandDistrict;
  domain: Domain;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  role: UserRole | 'all';
  type?: string;
  title: string;
  message: string;
  link?: string;
  relatedChallengeId?: string;
  relatedProjectId?: string;
  read: boolean;
  createdAt: string;
}
