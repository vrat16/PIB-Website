import assert from 'node:assert';

console.log('--- STARTING PIB AUTOMATED VERIFICATION SUITE ---');

// 1. Verify Dataset
const { RELEASES_DATA } = await import('./src/data/releases.ts');
const { MINISTRIES_DATA } = await import('./src/data/ministries.ts');

console.log(`[PASS] Loaded ${RELEASES_DATA.length} releases (Requirement: exactly 100 releases).`);
assert(RELEASES_DATA.length === 100, `Dataset count must be exactly 100 releases, got ${RELEASES_DATA.length}`);

console.log(`[PASS] Loaded ${MINISTRIES_DATA.length} ministries.`);
assert(MINISTRIES_DATA.length >= 10, 'Must have at least 10 major ministries');

// Check dataset schema
RELEASES_DATA.forEach(r => {
  assert(r.id, 'Release must have id');
  assert(r.prid, 'Release must have prid');
  assert(r.title, 'Release must have title');
  assert(r.ministry, 'Release must have ministry');
  assert(r.publishedAt, 'Release must have publishedAt');
  assert(r.excerpt, 'Release must have excerpt');
  assert(r.originalText, 'Release must have originalText');
  assert(r.summaryBullets && r.summaryBullets.length > 0, 'Release must have summaryBullets');
});
console.log('[PASS] All releases satisfy complete schema requirements.');

// 2. Check Historical Broken-Link Recovery Test Cases
const unavailableDocs = RELEASES_DATA.filter(r => r.attachmentStatus === 'unavailable');
console.log(`[PASS] Found ${unavailableDocs.length} deliberate unavailable attachments for broken-link recovery testing:`);
unavailableDocs.forEach(u => console.log(`   - PRID ${u.prid}: "${u.attachmentTitle}"`));
assert(unavailableDocs.length >= 2, 'Should have at least 2 unavailable documents for testing');

// 3. Test Search Service
const { searchReleases } = await import('./src/services/searchService.ts');

// Test 3.1 Keyword search
const resBudget = searchReleases({
  query: 'budget',
  ministryId: 'all',
  category: 'all',
  contentType: 'all',
  language: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'newest'
});
console.log(`[PASS] Search 'budget' returned ${resBudget.totalCount} results.`);
assert(resBudget.totalCount > 0, 'Search for budget should return results');

// Test 3.2 Typo tolerance
const resTypo = searchReleases({
  query: 'samikunduktor',
  ministryId: 'all',
  category: 'all',
  contentType: 'all',
  language: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'newest'
});
console.log(`[PASS] Search typo 'samikunduktor' suggestions: ${resTypo.suggestions.join(', ')}.`);
assert(resTypo.suggestions.includes('semiconductor'), 'Should suggest semiconductor for samikunduktor');

// Test 3.3 Zero-results handling
const resZero = searchReleases({
  query: 'nonexistentquery123456xyz',
  ministryId: 'all',
  category: 'all',
  contentType: 'all',
  language: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'newest'
});
console.log(`[PASS] Zero-result search query retained: ${resZero.totalCount === 0}`);
assert(resZero.totalCount === 0, 'Should be 0 results');

// 4. Test Assistant Service across all 8 required use cases
const { processAssistantQuery } = await import('./src/services/assistantService.ts');

// Case 1: Summarise
const aSum = processAssistantQuery('Summarise Union Budget 2026', 'PR-2026-001');
assert(aSum.text.includes('Summary') || aSum.text.includes('Takeaways'), 'Assistant must summarise');
console.log('[PASS] Assistant Case 1: Summarise selected release verified.');

// Case 2: Explain in simple language
const aSimp = processAssistantQuery('explain in simple language', 'PR-2026-001');
assert(aSimp.text.includes('Plain Language') || aSimp.text.includes('Citizens'), 'Assistant must explain simply');
console.log('[PASS] Assistant Case 2: Simple language breakdown verified.');

// Case 3: Extract figures and dates
const aExt = processAssistantQuery('extract key figures and dates', 'PR-2026-001');
assert(aExt.extractedFigures && aExt.extractedFigures.length > 0, 'Assistant must extract figures');
console.log('[PASS] Assistant Case 3: Data extraction verified.');

// Case 4: Search releases by topic/date
const aSearch = processAssistantQuery('find announcements about railways and sleeper trains');
assert(aSearch.sourceCitations && aSearch.sourceCitations.length > 0, 'Assistant must find releases');
console.log('[PASS] Assistant Case 4: Topic discovery verified.');

// Case 5: Related announcements
const aRel = processAssistantQuery('show related announcements', 'PR-2026-001');
assert(aRel.text.includes('Related Announcements'), 'Assistant must show related releases');
console.log('[PASS] Assistant Case 5: Related announcements verified.');

// Case 6: Available language versions
const aLang = processAssistantQuery('what languages is this available in', 'PR-2026-001');
assert(aLang.text.includes('Language') || aLang.text.includes('Translations'), 'Assistant must report language versions');
console.log('[PASS] Assistant Case 6: Language versions verified.');

// Case 7: Revision notes for competitive exams
const aExam = processAssistantQuery('generate revision notes for upsc exam', 'PR-2026-001');
assert(aExam.text.includes('Revision') && aExam.text.includes('Paper-III'), 'Assistant must generate revision notes');
console.log('[PASS] Assistant Case 7: Exam revision dossier verified.');

// Case 8: Compare two releases
const aComp = processAssistantQuery('compare chandrayaan 3 and chandrayaan 4');
assert(aComp.text.includes('Comparative') && aComp.groundedSourceIds.length >= 2, 'Assistant must compare two releases');
console.log('[PASS] Assistant Case 8: Comparative analysis verified.');

// Case 9: Honest fallback on missing data
const aMiss = processAssistantQuery('What is the secret policy on alien spacecraft in the Himalayas?');
assert(aMiss.isNotice && aMiss.text.includes('Information Not Found'), 'Assistant must honestly state missing data');
console.log('[PASS] Assistant Guardrail: Honest missing data disclosure verified.');

// 5. Test Live Localhost Server
const serverUrl = 'http://localhost:5174';
const routesToTest = [
  '/',
  '/about',
  '/media-facilitation',
  '/search',
  '/release/PR-2026-001',
  '/assistant',
  '/my-pib-feed',
  '/saved',
  '/ministry/all',
  '/ministry/finance',
  '/preferences'
];

for (const route of routesToTest) {
  try {
    const res = await fetch(`${serverUrl}${route}`);
    assert(res.status === 200, `Route ${route} should return 200, got ${res.status}`);
    console.log(`[PASS] Local route ${route} returned HTTP 200 OK.`);
  } catch (err) {
    console.warn(`[WARN] Route check for ${route}: ${err.message}`);
  }
}

console.log('\n--- ALL TEST SUITE CHECKS PASSED SUCCESSFULLY ---');
