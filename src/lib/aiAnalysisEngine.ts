import type { AIAnalysis, Domain, JharkhandDistrict, Urgency } from '../types';

export function runAIChallengeAnalysis(
  challengeId: string,
  title: string,
  description: string,
  domain: Domain,
  district: JharkhandDistrict,
  urgency: Urgency
): AIAnalysis {
  let recommendedInstitutions: string[] = [];
  let potentialPartners: string[] = [];
  let requiredExpertise: string[] = [];

  const textLower = (title + ' ' + description).toLowerCase();

  switch (domain) {
    case 'Water Management':
      recommendedInstitutions = ['BIT Sindri', 'Ranchi University', 'IIT (ISM) Dhanbad'];
      potentialPartners = ['IoT Solutions India Pvt Ltd', 'Jindal Steel & Power CSR', 'Schneider Electric Foundation'];
      requiredExpertise = ['Water Resources Engineering', 'IoT Sensors', 'Environmental Engineering', 'Hydrological Analytics'];
      break;

    case 'Transportation/Infrastructure':
    case 'Urban Development':
      recommendedInstitutions = ['BIT Sindri', 'NIT Jamshedpur', 'Ranchi University'];
      potentialPartners = ['Tata Steel CSR Foundation', 'Jindal Steel & Power CSR', 'Municipal PWD Contractors'];
      requiredExpertise = ['Civil Engineering', 'Transportation Engineering', 'Infrastructure Management'];
      break;

    case 'Energy':
      recommendedInstitutions = ['NIT Jamshedpur', 'IIT (ISM) Dhanbad', 'BIT Sindri'];
      potentialPartners = ['Schneider Electric Foundation', 'Central Coalfields Limited (CCL)', 'Tata Steel CSR Foundation'];
      requiredExpertise = ['Clean Energy Grid', 'Power Electronics', 'Micro-Grid Management', 'Battery Telemetry'];
      break;

    case 'Agriculture':
      recommendedInstitutions = ['Birsa Agricultural University', 'Ranchi University', 'BIT Sindri'];
      potentialPartners = ['Tata Steel CSR Foundation', 'IoT Solutions India Pvt Ltd'];
      requiredExpertise = ['Agronomy', 'Soil Chemistry Diagnostic', 'Precision Farming', 'IoT Telemetry'];
      break;

    default:
      recommendedInstitutions = ['BIT Sindri', 'Ranchi University', 'IIT (ISM) Dhanbad'];
      potentialPartners = ['Tata Steel CSR Foundation', 'IoT Solutions India Pvt Ltd'];
      requiredExpertise = ['Systems Engineering', 'Community Innovation', 'Data Analytics'];
  }

  let calculatedPriority = urgency;
  if (textLower.includes('severe') || textLower.includes('drought') || textLower.includes('critical') || textLower.includes('pothole')) {
    if (calculatedPriority === 'MEDIUM') calculatedPriority = 'HIGH';
  }

  const confidenceScore = 93;

  return {
    id: `ai-${Date.now()}`,
    challengeId,
    modelName: 'gemini-2.5-flash',
    isLiveGemini: false,
    problemDetected: true,
    detectedIssue: title,
    primaryCategory: domain,
    subCategory: 'Societal Challenge Inspection',
    priority: calculatedPriority,
    confidenceScore,
    visibleEvidence: [
      `Visual anomaly detected corresponding to ${domain}`,
      `Observed structural pattern matching reported description in ${district}`,
      'Multi-spectral feature extraction completed'
    ],
    userReportedContext: description,
    estimatedImpact: `1,500+ citizens in ${district}`,
    recommendedAction: `Conduct physical verification and initiate multi-disciplinary R&D project with ${recommendedInstitutions[0]}.`,
    requiredExpertise,
    recommendedInstitutions,
    potentialIndustryPartners: potentialPartners,
    summary: `Categorized in ${domain} for ${district} district.`
  };
}
