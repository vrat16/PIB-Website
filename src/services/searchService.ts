import { RELEASES_DATA } from '../data/releases';
import { PressRelease, SearchFilters } from '../types';

export interface SearchResult {
  releases: PressRelease[];
  totalCount: number;
  suggestions: string[];
  relatedTerms: string[];
  queryTerms: string[];
}

const COMMON_CORRECTIONS: Record<string, string> = {
  'samikunduktor': 'semiconductor',
  'semicondutor': 'semiconductor',
  'chip': 'semiconductor',
  'chndryan': 'chandrayaan',
  'chandryan': 'chandrayaan',
  'moon': 'chandrayaan',
  'kisn': 'kisan',
  'kisan': 'pm-kisan',
  'byudget': 'budget',
  'baget': 'budget',
  'ayushmn': 'ayushman',
  'ayshman': 'ayushman',
  'vnde': 'vande',
  'vande': 'vande bharat',
  'gatishkti': 'gatishakti',
  'gati': 'gatishakti',
  'soalr': 'solar',
  'soler': 'solar',
  'diffence': 'defence',
  'defens': 'defence',
  'edukation': 'education',
  'helth': 'health',
  'climat': 'climate'
};

const RELATED_TOPICS_MAP: Record<string, string[]> = {
  'budget': ['Fiscal Deficit', 'Capital Expenditure', 'Income Tax Slab', 'MSME Guarantee'],
  'semiconductor': ['India Semiconductor Mission', 'Wafer Fabrication', 'MeitY', 'Electronics Manufacturing'],
  'chandrayaan': ['ISRO', 'Lunar South Pole', 'Vikram Lander', 'Pragyan Rover', 'Chandrayaan-4'],
  'kisan': ['PM-KISAN', 'Direct Benefit Transfer', 'Agriculture Subsidies', 'Foodgrain Production'],
  'ayushman': ['PM-JAY', 'Senior Citizen Health', 'Cashless Hospitalization', 'Vay Vandana Card'],
  'solar': ['PM Surya Ghar', 'Muft Bijli Yojana', 'Rooftop Solar Subsidy', 'Renewable Energy'],
  'defence': ['Positive Indigenisation List', 'Defence Exports', 'Aatmanirbharta', 'BrahMos Missile'],
  'railways': ['Vande Bharat Sleeper', 'Kavach 4.0', 'High-Speed Rail', 'Indian Railways'],
  'education': ['NEP 2020', 'APAAR ID', 'Academic Bank of Credits', 'Mother Tongue Instruction'],
  'logistics': ['PM GatiShakti', 'National Logistics Policy', 'ULIP Platform', 'Multi-Modal Connectivity']
};

export const searchReleases = (filters: SearchFilters): SearchResult => {
  const rawQuery = (filters.query || '').trim().toLowerCase();
  const queryTokens = rawQuery.split(/\s+/).filter(t => t.length > 0);

  // Check typo corrections
  const suggestions: string[] = [];
  queryTokens.forEach(token => {
    if (COMMON_CORRECTIONS[token] && !rawQuery.includes(COMMON_CORRECTIONS[token])) {
      suggestions.push(COMMON_CORRECTIONS[token]);
    }
  });

  // Check related terms
  const relatedTermsSet = new Set<string>();
  Object.keys(RELATED_TOPICS_MAP).forEach(keyword => {
    if (rawQuery.includes(keyword)) {
      RELATED_TOPICS_MAP[keyword].forEach(item => relatedTermsSet.add(item));
    }
  });

  const results = RELEASES_DATA.filter(release => {
    // 1. Text Query Matching
    if (queryTokens.length > 0) {
      const searchableBlob = [
        release.title,
        release.excerpt,
        release.originalText,
        release.ministry,
        release.category,
        release.location,
        release.prid,
        ...(release.summaryBullets || [])
      ].join(' ').toLowerCase();

      // Check all query tokens match either whole or prefix/substring
      const matchesAllTokens = queryTokens.every(token => {
        // Direct substring check
        if (searchableBlob.includes(token)) return true;
        // Typo correction check
        if (COMMON_CORRECTIONS[token] && searchableBlob.includes(COMMON_CORRECTIONS[token])) {
          return true;
        }
        return false;
      });

      if (!matchesAllTokens) return false;
    }

    // 2. Ministry Filter
    if (filters.ministryId && filters.ministryId !== 'all') {
      if (release.ministryId !== filters.ministryId) return false;
    }

    // 3. Category Filter
    if (filters.category && filters.category !== 'all') {
      if (release.category !== filters.category) return false;
    }

    // 4. Content Type Filter
    if (filters.contentType && filters.contentType !== 'all') {
      if (release.contentType !== filters.contentType) return false;
    }

    // 5. Language Filter
    if (filters.language && filters.language !== 'all') {
      if (release.language !== filters.language) return false;
    }

    // 6. Year Filter (for Historical Explorer)
    if (filters.year && filters.year !== 'all') {
      const releaseYear = new Date(release.publishedAt).getFullYear().toString();
      if (releaseYear !== filters.year) return false;
    }

    // 7. Date Range Filter
    if (filters.startDate) {
      const pubDate = new Date(release.publishedAt);
      const startDate = new Date(filters.startDate);
      if (pubDate < startDate) return false;
    }

    if (filters.endDate) {
      const pubDate = new Date(release.publishedAt);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (pubDate > endDate) return false;
    }

    return true;
  });

  // Sort
  results.sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return filters.sortBy === 'oldest' ? timeA - timeB : timeB - timeA;
  });

  return {
    releases: results,
    totalCount: results.length,
    suggestions: Array.from(new Set(suggestions)),
    relatedTerms: Array.from(relatedTermsSet).slice(0, 5),
    queryTerms: queryTokens
  };
};

export const getReleaseById = (id: string): PressRelease | undefined => {
  return RELEASES_DATA.find(r => r.id === id || r.prid === id);
};

export const getRelatedReleases = (release: PressRelease): PressRelease[] => {
  if (!release.relatedReleaseIds || release.relatedReleaseIds.length === 0) {
    return [];
  }
  return release.relatedReleaseIds
    .map(relId => RELEASES_DATA.find(r => r.id === relId))
    .filter((r): r is PressRelease => Boolean(r));
};
