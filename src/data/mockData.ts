import type { 
  Challenge, 
  University, 
  IndustryPartner, 
  Project, 
  NotificationItem,
  Domain,
  JharkhandDistrict 
} from '../types';

export const DOMAINS: Domain[] = [
  'Education',
  'Healthcare',
  'Agriculture',
  'Water Management',
  'Sanitation',
  'Environment',
  'Energy',
  'Urban Development',
  'Accessibility',
  'Public Administration',
  'Rural Livelihoods',
  'Transportation/Infrastructure'
];

export const JHARKHAND_DISTRICTS: JharkhandDistrict[] = [
  'Ranchi',
  'Dhanbad',
  'Bokaro',
  'Jamshedpur/East Singhbhum',
  'Palamu',
  'Hazaribagh',
  'Deoghar',
  'Giridih',
  'Dumka',
  'West Singhbhum',
  'Ramgarh',
  'Garhwa',
];

export const MOCK_UNIVERSITIES: University[] = [
  {
    id: 'uni-1',
    name: 'BIT Sindri',
    district: 'Dhanbad',
    type: 'State Autonomous Engineering Institute',
    contactEmail: 'innovations@bitsindri.ac.in',
    website: 'https://bitsindri.ac.in',
    expertise: ['Water Resources Engineering', 'IoT & Embedded Systems', 'Environmental Engineering', 'Civil Infrastructure']
  },
  {
    id: 'uni-2',
    name: 'Ranchi University',
    district: 'Ranchi',
    type: 'State University',
    contactEmail: 'research@ranchiuniversity.ac.in',
    website: 'https://ranchiuniversity.ac.in',
    expertise: ['Data Analytics', 'Biotechnology', 'Public Health', 'Rural Sociology']
  },
  {
    id: 'uni-3',
    name: 'IIT (ISM) Dhanbad',
    district: 'Dhanbad',
    type: 'Institute of National Importance',
    contactEmail: 'csr-incubation@iitism.ac.in',
    website: 'https://iitism.ac.in',
    expertise: ['Mining & Geoscience', 'AI & Machine Learning', 'Renewable Energy', 'Sensor Technology']
  },
  {
    id: 'uni-4',
    name: 'Birsa Agricultural University',
    district: 'Ranchi',
    type: 'Agricultural State University',
    contactEmail: 'agri-innovation@baujharkhand.org',
    website: 'https://baujharkhand.org',
    expertise: ['Agronomy', 'Soil & Solar Irrigation', 'Precision Farming', 'Crop Protection']
  },
  {
    id: 'uni-5',
    name: 'NIT Jamshedpur',
    district: 'Jamshedpur/East Singhbhum',
    type: 'Institute of National Importance',
    contactEmail: 'projects@nitjsr.ac.in',
    website: 'https://nitjsr.ac.in',
    expertise: ['Robotics', 'Clean Energy Grid', 'Material Science', 'Industrial Automation']
  }
];

export const MOCK_INDUSTRY_PARTNERS: IndustryPartner[] = [
  {
    id: 'ind-1',
    name: 'IoT Solutions India Pvt Ltd',
    sector: 'Smart Hardware & Sensor Networks',
    contactPerson: 'Vikram Sharma (Head of Innovation)',
    email: 'partnerships@iotsolutions.in',
    location: 'Ranchi Tech Park'
  },
  {
    id: 'ind-2',
    name: 'Tata Steel CSR Foundation',
    sector: 'Industrial & Community Development',
    contactPerson: 'Anjali Sen (Director Social Impact)',
    email: 'csr@tatasteel.com',
    location: 'Jamshedpur'
  },
  {
    id: 'ind-3',
    name: 'Central Coalfields Limited (CCL)',
    sector: 'Energy & Mining Sustainability',
    contactPerson: 'Rajesh Kumar (General Manager)',
    email: 'sd@centralcoalfields.in',
    location: 'Ranchi Headquarters'
  },
  {
    id: 'ind-4',
    name: 'Jindal Steel & Power CSR',
    sector: 'Infrastructure & Water Technologies',
    contactPerson: 'Sanjay Mukherjee (CSR Lead)',
    email: 'impact@jindalsteel.com',
    location: 'Ramgarh'
  },
  {
    id: 'ind-5',
    name: 'Schneider Electric Foundation',
    sector: 'Microgrid & Clean Energy',
    contactPerson: 'Deepak Verma (Program Manager)',
    email: 'foundation.in@se.com',
    location: 'National Innovation Hub'
  }
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'ch-101',
    challengeCode: 'YG-2026-00124',
    title: 'Severe road damage near village school',
    description: 'The road is used daily by school students, farmers and villagers. Large potholes make transportation difficult and unsafe.',
    domain: 'Transportation/Infrastructure',
    district: 'Palamu',
    block: 'Satbarwa',
    villageCity: 'Lalgarh Village',
    location: 'School Road Corridor, Satbarwa, Palamu',
    affectedCount: 1800,
    urgency: 'HIGH',
    expectedSolution: 'Pavement re-surfacing and civil road repair.',
    contactInfo: 'Mukhiya Ramesh Singh (+91 98351 44521)',
    status: 'assigned',
    assignedUniversity: 'BIT Sindri',
    createdAt: '2026-08-15T09:30:00Z',
    evidence: [
      {
        id: 'ev-1',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        type: 'image',
        name: 'Palamu_School_Road_Damage.jpg'
      }
    ],
    aiAnalysis: {
      id: 'ai-101',
      challengeId: 'ch-101',
      modelName: 'gemini-2.5-flash',
      isLiveGemini: true,
      problemDetected: true,
      detectedIssue: 'Severe Road Surface Damage & Potholes',
      primaryCategory: 'Transportation/Infrastructure',
      subCategory: 'Road Infrastructure',
      priority: 'HIGH',
      confidenceScore: 93,
      visibleEvidence: [
        'Large pothole visible in roadway',
        'Cracked road surface around impact area',
        'Uneven pavement creating safety risk for school buses'
      ],
      userReportedContext: 'The road is used daily by school students, farmers and villagers. Large potholes make transportation difficult and unsafe.',
      estimatedImpact: '1,800+ daily students & commuters',
      recommendedAction: 'Conduct physical civil inspection and prioritize asphalt re-surfacing.',
      requiredExpertise: [
        'Civil Engineering',
        'Transportation Engineering',
        'Infrastructure Management'
      ],
      recommendedInstitutions: [
        'BIT Sindri',
        'Ranchi University',
        'IIT (ISM) Dhanbad'
      ],
      potentialIndustryPartners: [
        'Tata Steel CSR Foundation',
        'Jindal Steel & Power CSR',
        'Municipal PWD Contractors'
      ],
      summary: 'Visual analysis confirms structural asphalt deterioration with a deep pothole along active school transit corridor.'
    }
  },
  {
    id: 'ch-102',
    challengeCode: 'YG-2026-00125',
    title: 'Frequent micro-grid voltage drops in rural Hazaribagh tribal schools',
    description: '14 residential tribal schools (Kasturba Gandhi Balika Vidyalayas) in Hazaribagh suffer from 6-8 hours of daily power blackout, hampering digital smart class education.',
    domain: 'Energy',
    district: 'Hazaribagh',
    block: 'Chorparan',
    villageCity: 'Chorparan',
    location: 'KGBV Chorparan, Hazaribagh',
    affectedCount: 1400,
    urgency: 'HIGH',
    expectedSolution: 'Compact solar rooftop micro-grid with smart battery health telemetry.',
    contactInfo: 'Principal Savitri Hembrom (+91 94311 00213)',
    status: 'in_development',
    assignedUniversity: 'NIT Jamshedpur',
    createdAt: '2026-08-18T11:15:00Z',
    evidence: [
      {
        id: 'ev-3',
        url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        type: 'image',
        name: 'School_Solar_Setup.jpg'
      }
    ],
    aiAnalysis: {
      id: 'ai-102',
      challengeId: 'ch-102',
      modelName: 'gemini-2.5-flash (Demo Mode)',
      isLiveGemini: false,
      problemDetected: true,
      detectedIssue: 'Micro-Grid Solar Capacity Deficiency',
      primaryCategory: 'Energy',
      subCategory: 'Solar PV Systems',
      priority: 'HIGH',
      confidenceScore: 92,
      visibleEvidence: ['Rooftop solar inverter wiring overload', 'Battery telemetry offline'],
      userReportedContext: '14 residential tribal schools suffer power blackouts hampering digital smart classes.',
      estimatedImpact: '1,400 students & faculty',
      recommendedAction: 'Install smart telemetry battery balancer and auxiliary rooftop solar array.',
      requiredExpertise: ['Clean Energy Grid', 'Power Electronics', 'Battery Telemetry'],
      recommendedInstitutions: ['NIT Jamshedpur', 'IIT (ISM) Dhanbad'],
      potentialIndustryPartners: ['Schneider Electric Foundation', 'Central Coalfields Limited (CCL)'],
      summary: 'High social value solar micro-grid telemetry implementation for remote education continuity.'
    }
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-201',
    challengeId: 'ch-101',
    challengeCode: 'YG-2026-00124',
    challengeTitle: 'Severe road damage near village school',
    universityId: 'uni-1',
    universityName: 'BIT Sindri',
    title: 'Smart Rural Road Repair & Pavement Assessment Project',
    description: 'Civil engineering team deploying recycled asphalt concrete mix and sensor-assisted pavement inspection in Satbarwa block to ensure safe school commute.',
    facultyMentor: 'Dr. Pankaj Rai (Dept of Civil Engineering, BIT Sindri)',
    studentTeam: [
      'Amit Kumar (B.Tech Civil - Lead)',
      'Neha Sharma (B.Tech CSE - Data)',
      'Rahul Verma (B.Tech Civil)'
    ],
    requiredSkills: [
      'Civil Engineering',
      'Pavement Materials',
      'GIS Mapping'
    ],
    requiredIndustrySupport: [
      'Hardware',
      'Mentorship',
      'Funding',
      'Pilot Deployment'
    ],
    expectedOutcome: 'Complete repair of 2.4 km school road corridor with 5-year durability guarantee.',
    status: 'prototype',
    progressPercentage: 65,
    district: 'Palamu',
    domain: 'Transportation/Infrastructure',
    createdAt: '2026-08-16T10:00:00Z',
    collaborations: [
      {
        id: 'col-301',
        projectId: 'proj-201',
        partnerId: 'ind-2',
        partnerName: 'Tata Steel CSR Foundation',
        supportTypes: ['Hardware', 'Funding'],
        status: 'active',
        notes: 'Pledged ₹3.5 Lakh asphalt material grant and civil equipment.',
        createdAt: '2026-08-19T14:00:00Z'
      }
    ],
    milestones: [
      {
        id: 'ms-1',
        projectId: 'proj-201',
        title: 'Gemini AI Vision Analysis & Match',
        description: 'Gemini Vision AI classified severe pothole damage; BIT Sindri assigned lead civil department.',
        targetDate: '2026-08-16',
        status: 'completed',
        completionPercentage: 100,
        updatedAt: '2026-08-16T12:00:00Z',
        responsibleRole: 'BIT Sindri Civil Dept'
      },
      {
        id: 'ms-2',
        projectId: 'proj-201',
        title: 'Pavement Survey & Soil Core Test',
        description: 'Faculty mentor Dr. Pankaj Rai completed soil load bearing tests along school road.',
        targetDate: '2026-08-18',
        status: 'completed',
        completionPercentage: 100,
        updatedAt: '2026-08-18T16:00:00Z',
        responsibleRole: 'University Faculty Lead'
      },
      {
        id: 'ms-3',
        projectId: 'proj-201',
        title: 'Industry Partner Onboarding',
        description: 'Tata Steel CSR Foundation signed MoU for pavement material grant.',
        targetDate: '2026-08-21',
        status: 'completed',
        completionPercentage: 100,
        updatedAt: '2026-08-21T11:00:00Z',
        responsibleRole: 'Tata Steel CSR'
      },
      {
        id: 'ms-4',
        projectId: 'proj-201',
        title: 'Pilot Re-surfacing in Satbarwa',
        description: 'Paving 500m high-durability test strip near village school entrance.',
        targetDate: '2026-08-30',
        status: 'in_progress',
        completionPercentage: 65,
        updatedAt: '2026-09-01T10:00:00Z',
        responsibleRole: 'Student Engineering Team'
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    role: 'all',
    title: 'Gemini Vision AI Analysis Completed',
    message: 'Road damage challenge evaluated with 93% AI confidence (YG-2026-00124).',
    link: '/challenges/ch-101',
    read: false,
    createdAt: '2026-08-15T09:35:00Z'
  }
];
