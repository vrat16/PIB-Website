export type Language = 'en' | 'hi';

export type ContentType = 'Press Release' | 'Factsheet' | 'Feature' | 'Infographic';

export type Category =
  | 'Economy & Finance'
  | 'National & Governance'
  | 'Health & Family Welfare'
  | 'Science & Technology'
  | 'Defence & Security'
  | 'Education & Skill'
  | 'Environment & Climate'
  | 'Agriculture & Rural'
  | 'Commerce & Industry'
  | 'Infrastructure & Transport';

export type AttachmentStatus = 'available' | 'unavailable' | 'verified_archive';

export interface KeyFigure {
  metric: string;
  value: string;
  context: string;
}

export interface KeyDate {
  label: string;
  date: string;
}

export interface AvailableLanguage {
  lang: Language;
  label: string;
  releaseId: string;
  title: string;
}

export interface PressRelease {
  id: string;
  prid: string;
  title: string;
  ministry: string;
  ministryId: string;
  publishedAt: string; // ISO 8601 string
  location: string;
  category: Category;
  contentType: ContentType;
  language: Language;
  excerpt: string;
  originalText: string;
  sourceUrl: string;
  imageUrl?: string;
  attachmentUrl?: string;
  attachmentTitle?: string;
  attachmentSize?: string;
  attachmentStatus: AttachmentStatus;
  alternativeOfficialUrl?: string;
  relatedReleaseIds: string[];
  availableLanguages: AvailableLanguage[];
  keyFigures?: KeyFigure[];
  keyDates?: KeyDate[];
  eligibility?: string[];
  summaryBullets: string[];
  simpleExplanation: string;
  isHistorical?: boolean;
}

export interface Ministry {
  id: string;
  nameEn: string;
  nameHi: string;
  shortName: string;
  category: Category;
  description: string;
  releaseCount: number;
}

export interface UserPreferences {
  userPersona: 'general' | 'journalist';
  favoriteMinistries: string[];
  favoriteCategories: Category[];
  preferredLanguage: Language;
  theme: 'default' | 'light' | 'dark' | 'parchment' | 'eco-green';
  fontSize: 'normal' | 'large' | 'xlarge';
  emailSubscription?: SubscriptionConfig;
}

export interface SubscriptionConfig {
  email: string;
  selectedTopics: Category[];
  selectedMinistries: string[];
  contentTypes: ContentType[];
  frequency: 'instant' | 'daily' | 'weekly';
  deliveryTimeIST: string; // e.g. "08:00 AM"
  language?: 'all' | 'en' | 'hi';
  isActive: boolean;
  createdAt: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  groundedSourceIds?: string[];
  sourceCitations?: {
    id: string;
    prid: string;
    title: string;
    ministry: string;
    publishedAt: string;
  }[];
  extractedFigures?: KeyFigure[];
  extractedDates?: KeyDate[];
  suggestedFollowUps?: string[];
  isNotice?: boolean;
}

export interface SearchFilters {
  query: string;
  ministryId: string;
  category: string;
  contentType: string;
  language: string;
  startDate: string;
  endDate: string;
  sortBy: 'newest' | 'oldest';
  year?: string;
}
