import type { 
  UserProfile, 
  Challenge, 
  EvidenceItem, 
  AIAnalysis, 
  Project, 
  Collaboration, 
  Milestone, 
  NotificationItem,
  Domain,
  JharkhandDistrict,
  Urgency,
  ChallengeStatus,
  ProjectStatus,
  SupportType
} from '../types';

export function mapProfileFromDB(row: any): UserProfile {
  return {
    id: row.id,
    authUserId: row.auth_user_id,
    email: row.email || '',
    fullName: row.full_name || '',
    role: row.role || 'citizen',
    organizationName: row.organization_name || undefined,
    district: row.district || 'Ranchi',
    createdAt: row.created_at || new Date().toISOString()
  };
}

export function mapProfileToDB(profile: Partial<UserProfile>): any {
  return {
    auth_user_id: profile.authUserId,
    email: profile.email,
    full_name: profile.fullName,
    role: profile.role,
    organization_name: profile.organizationName || null,
    district: profile.district || 'Ranchi'
  };
}

export function mapEvidenceFromDB(row: any): EvidenceItem {
  return {
    id: row.id,
    url: row.file_url || '',
    type: row.file_type || 'image',
    name: row.file_name || 'evidence-file'
  };
}

export function mapAIAnalysisFromDB(row: any): AIAnalysis {
  return {
    id: row.id,
    challengeId: row.challenge_id,
    modelName: row.model_name || 'gemini-2.5-flash',
    isLiveGemini: Boolean(row.is_live_gemini),
    problemDetected: row.problem_detected !== false,
    detectedIssue: row.detected_issue || '',
    primaryCategory: (row.primary_category || 'Transportation/Infrastructure') as Domain,
    subCategory: row.sub_category || 'General Inspection',
    priority: (row.priority || 'MEDIUM') as Urgency,
    confidenceScore: row.confidence_score || 93,
    visibleEvidence: Array.isArray(row.visible_evidence) ? row.visible_evidence : [],
    userReportedContext: row.user_reported_context || undefined,
    estimatedImpact: row.estimated_public_impact || 'Impacted Population',
    recommendedAction: row.recommended_action || 'Conduct physical engineering inspection',
    requiredExpertise: Array.isArray(row.required_expertise) ? row.required_expertise : [],
    recommendedInstitutions: Array.isArray(row.recommended_institutions) ? row.recommended_institutions : [],
    potentialIndustryPartners: Array.isArray(row.potential_industry_partners) ? row.potential_industry_partners : [],
    summary: row.summary || ''
  };
}

export function mapAIAnalysisToDB(analysis: AIAnalysis, challengeId: string): any {
  return {
    challenge_id: challengeId,
    model_name: analysis.modelName || 'gemini-2.5-flash',
    is_live_gemini: analysis.isLiveGemini || false,
    problem_detected: analysis.problemDetected !== false,
    detected_issue: analysis.detectedIssue || 'Issue Detected',
    primary_category: analysis.primaryCategory || 'Transportation/Infrastructure',
    sub_category: analysis.subCategory || 'Field Assessment',
    priority: analysis.priority || 'MEDIUM',
    confidence_score: analysis.confidenceScore || 90,
    visible_evidence: analysis.visibleEvidence || [],
    user_reported_context: analysis.userReportedContext || null,
    estimated_public_impact: analysis.estimatedImpact || 'High Public Impact',
    recommended_action: analysis.recommendedAction || 'Recommended inspection',
    required_expertise: analysis.requiredExpertise || [],
    recommended_institutions: analysis.recommendedInstitutions || [],
    potential_industry_partners: analysis.potentialIndustryPartners || [],
    summary: analysis.summary || ''
  };
}

export function mapChallengeFromDB(row: any, evidenceRows: any[] = [], aiRow: any = null): Challenge {
  return {
    id: row.id,
    challengeCode: row.challenge_code || `YG-2026-${row.id.substring(0, 5).toUpperCase()}`,
    createdBy: row.created_by || undefined,
    title: row.title || '',
    description: row.description || '',
    domain: (row.domain || 'Transportation/Infrastructure') as Domain,
    district: (row.district || 'Palamu') as JharkhandDistrict,
    block: row.block || '',
    villageCity: row.village_city || '',
    location: row.location || '',
    affectedCount: row.affected_count || 100,
    urgency: (row.urgency || 'MEDIUM') as Urgency,
    expectedSolution: row.expected_solution || '',
    contactInfo: row.contact_info || '',
    status: (row.status || 'SUBMITTED') as ChallengeStatus,
    evidence: evidenceRows.map(mapEvidenceFromDB),
    aiAnalysis: aiRow ? mapAIAnalysisFromDB(aiRow) : undefined,
    universityId: row.university_id || undefined,
    assignedUniversity: row.assigned_university || row.university_name || undefined,
    universityName: row.university_name || row.assigned_university || undefined,
    acceptedAt: row.accepted_at || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || undefined
  };
}

export function mapChallengeToDB(c: Partial<Challenge>): any {
  return {
    challenge_code: c.challengeCode,
    created_by: c.createdBy || null,
    title: c.title,
    description: c.description,
    domain: c.domain,
    district: c.district,
    block: c.block || null,
    village_city: c.villageCity || null,
    location: c.location || null,
    affected_count: c.affectedCount || 100,
    urgency: c.urgency || 'MEDIUM',
    expected_solution: c.expectedSolution || null,
    contact_info: c.contactInfo || null,
    status: c.status || 'SUBMITTED',
    university_id: c.universityId || null,
    accepted_at: c.acceptedAt || null,
    updated_at: new Date().toISOString()
  };
}

export function mapMilestoneFromDB(row: any): Milestone {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title || '',
    description: row.description || '',
    targetDate: row.target_date || new Date().toISOString().split('T')[0],
    status: row.status || 'PENDING',
    completionPercentage: row.completion_percentage || 0,
    evidenceUrl: row.evidence_url || undefined,
    updatedAt: row.updated_at || new Date().toISOString(),
    responsibleRole: row.responsible_role || 'Project Lead'
  };
}

export function mapMilestoneToDB(m: Partial<Milestone>, projectId: string): any {
  return {
    project_id: projectId,
    title: m.title,
    description: m.description || null,
    status: m.status || 'PENDING',
    completion_percentage: m.completionPercentage || 0,
    target_date: m.targetDate || null,
    responsible_role: m.responsibleRole || 'Project Lead',
    updated_at: new Date().toISOString()
  };
}

export function mapCollaborationFromDB(row: any): Collaboration {
  return {
    id: row.id,
    projectId: row.project_id,
    partnerId: row.industry_id || undefined,
    partnerName: row.partner_name || 'Industry Partner',
    supportTypes: (row.support_types || []) as SupportType[],
    status: row.status || 'REQUESTED',
    notes: row.notes || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || undefined
  };
}

export function mapCollaborationToDB(collab: Partial<Collaboration>): any {
  return {
    project_id: collab.projectId,
    industry_id: collab.partnerId || null,
    partner_name: collab.partnerName,
    support_types: collab.supportTypes || [],
    notes: collab.notes || null,
    status: collab.status || 'REQUESTED',
    updated_at: new Date().toISOString()
  };
}

export function mapProjectFromDB(
  row: any, 
  milestoneRows: any[] = [], 
  collabRows: any[] = [],
  challengeRow: any = null
): Project {
  return {
    id: row.id,
    challengeId: row.challenge_id,
    challengeCode: challengeRow?.challenge_code || row.challenge_code || 'YG-2026-00100',
    challengeTitle: challengeRow?.title || row.challenge_title || row.title,
    universityId: row.university_id || 'uni-1',
    universityName: row.university_name || 'BIT Sindri',
    title: row.title || '',
    description: row.description || '',
    facultyMentor: row.faculty_mentor || '',
    studentTeam: Array.isArray(row.student_team) ? row.student_team : [],
    requiredSkills: Array.isArray(row.required_skills) ? row.required_skills : [],
    requiredIndustrySupport: (Array.isArray(row.required_industry_support) ? row.required_industry_support : []) as SupportType[],
    expectedOutcome: row.expected_outcome || '',
    status: (row.status || 'PLANNING') as ProjectStatus,
    progressPercentage: row.progress_percentage || 20,
    collaborations: collabRows.map(mapCollaborationFromDB),
    milestones: milestoneRows.map(mapMilestoneFromDB),
    district: (challengeRow?.district || row.district || 'Ranchi') as JharkhandDistrict,
    domain: (challengeRow?.domain || row.domain || 'Infrastructure') as Domain,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || undefined
  };
}

export function mapProjectToDB(p: Partial<Project>): any {
  return {
    challenge_id: p.challengeId,
    university_id: p.universityId || null,
    title: p.title,
    description: p.description,
    faculty_mentor: p.facultyMentor,
    student_team: p.studentTeam || [],
    required_skills: p.requiredSkills || [],
    required_industry_support: p.requiredIndustrySupport || [],
    expected_outcome: p.expectedOutcome || null,
    status: p.status || 'PLANNING',
    progress_percentage: p.progressPercentage || 20,
    updated_at: new Date().toISOString()
  };
}

export function mapNotificationFromDB(row: any): NotificationItem {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    role: row.role || 'all',
    type: row.type || undefined,
    title: row.title || '',
    message: row.message || '',
    link: row.related_challenge_id ? `/challenges/${row.related_challenge_id}` : (row.related_project_id ? `/projects/${row.related_project_id}` : undefined),
    relatedChallengeId: row.related_challenge_id || undefined,
    relatedProjectId: row.related_project_id || undefined,
    read: Boolean(row.read),
    createdAt: row.created_at || new Date().toISOString()
  };
}

export function mapNotificationToDB(n: Partial<NotificationItem>): any {
  return {
    user_id: n.userId || null,
    role: n.role || 'all',
    type: n.type || null,
    title: n.title,
    message: n.message,
    related_challenge_id: n.relatedChallengeId || null,
    related_project_id: n.relatedProjectId || null,
    read: n.read || false
  };
}
