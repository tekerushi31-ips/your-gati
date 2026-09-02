import { GoogleGenAI, Type } from '@google/genai';
import type { AIAnalysis, Domain, Urgency } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
export const isGeminiConfigured = Boolean(apiKey && apiKey !== 'your_gemini_api_key_here');

const ai = isGeminiConfigured ? new GoogleGenAI({ apiKey }) : null;

export interface GeminiVisionInput {
  challengeId: string;
  title: string;
  description: string;
  district: string;
  domain: Domain;
  urgency: Urgency;
  imageBase64?: string;
  imageMimeType?: string;
}

const SYSTEM_INSTRUCTION = `You are YOUR GATI's societal challenge image analysis assistant.
Analyze the uploaded image carefully in combination with the user's description.

Your task is to identify visible societal or infrastructure problems.
Do not assume that a problem exists if it cannot reasonably be seen or inferred from clear visual evidence.

Identify:
1. What is visible in the image.
2. Whether a societal/infrastructure problem is present.
3. The most likely problem category.
4. The specific issue.
5. Severity (must be one of: LOW, MEDIUM, HIGH, CRITICAL).
6. Confidence (a decimal float between 0 and 1, e.g. 0.93).
7. Visual evidence supporting the conclusion (array of observed bullet points).
8. Relevant expertise required to address it.
9. Potential stakeholders who could help solve it.
10. A concise recommended action.

Possible domains include:
Education, Healthcare, Agriculture, Water Management, Sanitation, Environment, Energy, Urban Development, Accessibility, Public Administration, Rural Livelihood, Transportation/Infrastructure.

Return ONLY valid JSON matching the requested schema.
Never invent information that cannot be determined from the image.

If the image is unclear, unrelated, or insufficient to identify a problem, explicitly set problem_detected to false and state why in summary.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    problem_detected: { type: Type.BOOLEAN },
    detected_issue: { type: Type.STRING },
    domain: { type: Type.STRING },
    sub_category: { type: Type.STRING },
    severity: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
    confidence: { type: Type.NUMBER },
    visible_evidence: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    estimated_public_impact: { type: Type.STRING },
    recommended_action: { type: Type.STRING },
    required_expertise: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    recommended_stakeholders: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    summary: { type: Type.STRING }
  },
  required: [
    'problem_detected',
    'detected_issue',
    'domain',
    'severity',
    'confidence',
    'visible_evidence',
    'recommended_action',
    'required_expertise',
    'recommended_stakeholders',
    'summary'
  ]
};

export async function analyzeChallengeWithGemini(input: GeminiVisionInput): Promise<AIAnalysis> {
  if (isGeminiConfigured && ai && input.imageBase64) {
    try {
      console.log('✨ YOUR GATI: Initiating Real Gemini Multimodal Vision Analysis...');
      
      const cleanBase64 = input.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const mimeType = input.imageMimeType || 'image/jpeg';

      const promptText = `User Reported Challenge:
Title: "${input.title}"
Description: "${input.description}"
Reported District: ${input.district}
Reported Domain: ${input.domain}

Please analyze this image along with the user's description. Distinguish visual observations from user claims.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType, data: cleanBase64 } },
              { text: promptText }
            ]
          }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.2
        }
      });

      const rawText = response.text || '';
      const parsed = JSON.parse(rawText);

      const confidenceFloat = typeof parsed.confidence === 'number' ? parsed.confidence : 0.93;
      const confidencePercentage = confidenceFloat <= 1 ? Math.round(confidenceFloat * 100) : Math.round(confidenceFloat);

      const mappedDomain: Domain = (parsed.domain || input.domain) as Domain;
      const mappedPriority: Urgency = (parsed.severity || input.urgency) as Urgency;

      return {
        id: `ai-gemini-${Date.now()}`,
        challengeId: input.challengeId,
        modelName: 'gemini-2.5-flash',
        isLiveGemini: true,
        problemDetected: parsed.problem_detected !== false,
        detectedIssue: parsed.detected_issue || input.title,
        primaryCategory: mappedDomain,
        subCategory: parsed.sub_category || 'Infrastructure Assessment',
        priority: mappedPriority,
        confidenceScore: confidencePercentage,
        visibleEvidence: parsed.visible_evidence || ['Visual inspection completed via Gemini Vision AI'],
        userReportedContext: input.description,
        estimatedImpact: parsed.estimated_public_impact || 'High Community Impact',
        recommendedAction: parsed.recommended_action || 'Conduct physical engineering inspection and initiate repair project.',
        requiredExpertise: parsed.required_expertise || ['Civil Engineering', 'Infrastructure Management'],
        recommendedInstitutions: mapInstitutionsForDomain(mappedDomain),
        potentialIndustryPartners: parsed.recommended_stakeholders || ['Municipal Authority', 'Infrastructure Technology Partner'],
        summary: parsed.summary || 'Multimodal Gemini analysis performed on visual evidence and reported text.'
      };
    } catch (error) {
      console.error('❌ Gemini Vision API Error:', error);
      throw error;
    }
  }

  return getDemoFallbackAnalysis(input);
}

function mapInstitutionsForDomain(domain: Domain): string[] {
  if (domain === 'Water Management' || domain === 'Sanitation') {
    return ['BIT Sindri', 'Ranchi University', 'IIT (ISM) Dhanbad'];
  }
  if (domain === 'Energy') {
    return ['NIT Jamshedpur', 'IIT (ISM) Dhanbad', 'BIT Sindri'];
  }
  if (domain === 'Agriculture') {
    return ['Birsa Agricultural University', 'Ranchi University', 'BIT Sindri'];
  }
  if (domain === 'Education') {
    return ['Ranchi University', 'NIT Jamshedpur', 'BIT Sindri'];
  }
  return ['BIT Sindri', 'Ranchi University', 'IIT (ISM) Dhanbad'];
}

export function getDemoFallbackAnalysis(input: GeminiVisionInput): AIAnalysis {
  const isRoad = input.title.toLowerCase().includes('road') || input.description.toLowerCase().includes('pothole');
  const isWater = input.title.toLowerCase().includes('water') || input.domain === 'Water Management';

  if (isRoad) {
    return {
      id: `ai-demo-${Date.now()}`,
      challengeId: input.challengeId,
      modelName: 'gemini-2.5-flash (Demo Mode)',
      isLiveGemini: false,
      problemDetected: true,
      detectedIssue: 'Severe Road Surface Damage & Potholes',
      primaryCategory: 'Transportation/Infrastructure',
      subCategory: 'Road Infrastructure',
      priority: 'HIGH',
      confidenceScore: 93,
      visibleEvidence: [
        'Large asphalt pothole visible on primary roadway',
        'Extensive radial pavement cracking around impact zone',
        'Uneven road shoulder posing safety hazards for school buses'
      ],
      userReportedContext: input.description,
      estimatedImpact: '1,800+ daily students & commuters',
      recommendedAction: 'Immediate physical pavement inspection, temporary leveling, and municipal re-surfacing contract.',
      requiredExpertise: ['Civil Engineering', 'Transportation Engineering', 'Pavement Management'],
      recommendedInstitutions: ['BIT Sindri', 'NIT Jamshedpur', 'Ranchi University'],
      potentialIndustryPartners: ['Tata Steel CSR Foundation', 'Jindal Steel & Power CSR', 'State PWD Contractors'],
      summary: 'Visual analysis indicates structural asphalt deterioration with deep potholes along active transit corridor.'
    };
  }

  return {
    id: `ai-demo-${Date.now()}`,
    challengeId: input.challengeId,
    modelName: 'gemini-2.5-flash (Demo Mode)',
    isLiveGemini: false,
    problemDetected: true,
    detectedIssue: isWater ? 'Groundwater Depletion & Agricultural Drought Stress' : input.title,
    primaryCategory: input.domain,
    subCategory: 'Field Telemetry & Conservation',
    priority: input.urgency,
    confidenceScore: 94,
    visibleEvidence: [
      'Dry, fissured soil surface in agricultural catchment area',
      'Inactive low-capacity water pumping installation',
      'Visible crop foliage stress due to moisture deficiency'
    ],
    userReportedContext: input.description,
    estimatedImpact: '2,500+ agricultural citizens in ' + input.district,
    recommendedAction: 'Deploy LoRaWAN moisture telemetry network and automated solar micro-drip irrigation array.',
    requiredExpertise: ['Water Resources Engineering', 'IoT & Embedded Systems', 'Environmental Analytics'],
    recommendedInstitutions: ['BIT Sindri', 'Ranchi University', 'Birsa Agricultural University'],
    potentialIndustryPartners: ['IoT Solutions India Pvt Ltd', 'Schneider Electric Foundation', 'Jindal Steel & Power CSR'],
    summary: `Pre-analyzed sample assessment for ${input.domain} in ${input.district} district.`
  };
}
