export type Language = 'bn' | 'en';

export type UserRole = 'farmer' | 'admin' | 'officer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  district: string;
  upazila: string;
  farmingInterests: string[];
  joinedAt: string;
  token?: string;
}

export interface PossibleCause {
  cause: string;
  confidence: 'high' | 'medium' | 'low';
  description: string;
  evidenceNotes?: string;
}

export interface RecommendationStep {
  action: string;
  steps: string[];
  timing?: string;
  isSafetyChecked: boolean;
  isBlockedBySafety?: boolean;
  blockReason?: string;
}

export interface SourceReference {
  publicationTitle: string; // গবেষণার শিরোনাম
  publishingInstitution: string; // প্রকাশনা প্রতিষ্ঠান (BRRI, BARI, DAE, BARC, BAMIS, AIS, etc.)
  publicationYear: string; // প্রকাশের সাল
  sourceType: 'Official Guideline' | 'Research Paper' | 'Technical Bulletin' | 'Agricultural Manual' | 'Grounded Web Reference'; // তথ্যের ধরন
  sourceUrl: string; // মূল উৎস
  relevantSection?: string; // প্রাসঙ্গিক পৃষ্ঠা বা অধ্যায়
  verifiedByDAE?: boolean;
  isOutdated?: boolean;
}

export type SafetyDecision = 
  | 'VERIFIED'
  | 'NEEDS_MORE_INFO'
  | 'CONFLICTING_EVIDENCE'
  | 'HIGH_RISK_NEEDS_EXPERT'
  | 'INSUFFICIENT_EVIDENCE';

export interface VerificationStageResult {
  stageNumber: number;
  stageName: string;
  stageNameBn: string;
  status: 'passed' | 'warning' | 'alert' | 'blocked';
  summary: string;
  details?: string;
}

export interface LocalReferralInfo {
  isTriggered: boolean;
  mandatoryBanglaMessage: string;
  saaoOffice: string;
  upazilaOffice: string;
  helpline: string;
  district: string;
  upazila: string;
}

export interface AdvisoryResponse {
  summary: string; // 1. সমস্যার সংক্ষিপ্ত বিবরণ
  possibleCauses: PossibleCause[]; // 2. সম্ভাব্য কারণ
  verifiedFactors: string[]; // 3. কোন তথ্যগুলো যাচাই করা হয়েছে
  sources: SourceReference[]; // 4. তথ্যসূত্র ও গবেষণার ভিত্তি (Sources & Research References)
  recommendations: RecommendationStep[]; // 5. যাচাই করা তথ্যের ভিত্তিতে পরামর্শ
  precautions: string[]; // 6. সম্ভাব্য ঝুঁকি ও সতর্কতা
  uncertainties: string[]; // 7. কোন বিষয়গুলো এখনো নিশ্চিত নয়
  localReferral: LocalReferralInfo; // 8. প্রয়োজনে স্থানীয় কৃষি কর্মকর্তার সঙ্গে যোগাযোগের নির্দেশনা

  // Safety & Verification Engine Metadata
  safetyStatus: SafetyDecision;
  isActionableBlocked: boolean;
  blockedActionReason?: string;
  expertReviewStatus: 'NOT_REQUIRED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  expertReviewNotes?: string;
  reviewedByRole?: string; // e.g. "উপজেলা কৃষি সম্প্রসারণ সেল" (NO personal names)
  reviewedAt?: string;
  
  verificationStages: VerificationStageResult[];
  officialHelplineNotice: string;
  evidenceNotes?: string;
  searchProviderUsed?: string;
  liveResearchDisclosed?: string;
  hasReliableReferences: boolean;
}

export interface AdvisoryQuestion {
  id: string;
  userId?: string;
  userName?: string;
  category: string;
  query: string;
  language: Language;
  crop?: string;
  cropVariety?: string;
  district?: string;
  upazila?: string;
  growthStage?: string;
  soilCondition?: string;
  weatherCondition?: string;
  problemOnset?: string;
  previousPesticideOrFertilizer?: string;
  status: 'analyzing' | 'completed' | 'needs_info' | 'pending_expert_review';
  response?: AdvisoryResponse;
  createdAt: string;
  saved?: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  crop: string;
  region: string;
  season: string;
  description: string;
  recommendation: string;
  sourceName: 'DAE' | 'BRRI' | 'BARI' | 'BARC' | 'BAMIS' | 'AIS';
  sourceUrl: string;
  publicationDate: string;
  verificationStatus: 'verified' | 'pending' | 'rejected' | 'expired';
  lastReviewedDate: string;
  reviewerNotes?: string;
  views?: number;
  isOutdated?: boolean;
}

export interface WeatherData {
  district: string;
  upazila: string;
  temp: number;
  humidity: number;
  rainProb: number;
  windSpeed: number;
  condition: string;
  conditionBn: string;
  agriculturalAlerts: string[];
  precautions: string[];
  updatedAt: string;
  dataSource: string;
  dataStatus: 'real_time_live' | 'recent_cached' | 'service_unavailable';
  disclaimer?: string;
}

export interface SearchProviderConfig {
  googleSearchEnabled: boolean;
  bingSearchEnabled: boolean;
  officialAgriGroundingEnabled: boolean;
  fallbackKnowledgeBaseEnabled: boolean;
  aiModel: string;
  thinkingLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  safetyEnforcementStrict: boolean;
  expertReviewRequiredForChemicals: boolean;
  blockUnapprovedFertilizerDosage: boolean;
}

export interface DocumentUpload {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  parsedSummary: string;
  status: 'processed' | 'indexing' | 'pending';
  publicationYear?: number;
  isOutdated?: boolean;
}

// Institutional Service Desks (NO personal identities, purely institutional)
export interface InstitutionalDesk {
  id: string;
  deskTitle: string; // e.g. "উদ্ভিদ রোগতত্ত্ব বিভাগ (Plant Pathology Division)"
  organization: string; // e.g. "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI)"
  district: string;
  upazila: string;
  officialPhone: string;
  officialEmail: string;
  mandateScope: string;
  isAvailable: boolean;
}

export interface FarmerErrorReport {
  id: string;
  questionId?: string;
  querySummary?: string;
  farmerName: string;
  farmerPhone: string;
  reportType: 'incorrect_advice' | 'harmful_recommendation' | 'outdated_info' | 'missing_info' | 'unsatisfactory';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface SafetyEngineLog {
  id: string;
  timestamp: string;
  query: string;
  category: string;
  safetyDecision: SafetyDecision;
  isActionableBlocked: boolean;
  riskEvaluation: 'low' | 'medium' | 'high';
  triggers: string[];
  referredToOfficer: boolean;
}

export interface GoogleSearchResultItem {
  title: string;
  snippet: string;
  url: string;
  sourceInstitution: string;
  publishedDate?: string;
  isOfficialBangladeshGov: boolean;
}

export interface GoogleSearchResponse {
  query: string;
  totalResults: number;
  isLive: boolean;
  provider: string;
  results: GoogleSearchResultItem[];
  researchReferences: SourceReference[];
  disclaimer?: string;
}
