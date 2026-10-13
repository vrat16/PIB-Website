import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { ReleaseDetailPage } from './pages/ReleaseDetailPage';
import { AssistantPage } from './pages/AssistantPage';
import { MyPibFeedPage } from './pages/MyPibFeedPage';
import { SavedReleasesPage } from './pages/SavedReleasesPage';
import { MinistryDetailPage } from './pages/MinistryDetailPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { AboutPage } from './pages/AboutPage';
import { MediaFacilitationPage } from './pages/MediaFacilitationPage';
import { FloatingChatbotFab } from './components/assistant/FloatingChatbotFab';
import { loadPreferences, applyThemeAndFont } from './services/preferenceService';
import { ArrowLeft } from 'lucide-react';

export function App() {
  useEffect(() => {
    // Initialise saved accessibility theme and font scale on mount
    const saved = loadPreferences();
    applyThemeAndFont(saved);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-400 selection:text-slate-900">
        <Header />

        <main id="main-content" className="flex-1 focus:outline-hidden" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/media-facilitation" element={<MediaFacilitationPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/release/:id" element={<ReleaseDetailPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/my-pib-feed" element={<MyPibFeedPage />} />
            <Route path="/saved" element={<SavedReleasesPage />} />
            <Route path="/archives" element={<Navigate to="/saved" replace />} />
            <Route path="/ministry/:id" element={<MinistryDetailPage />} />
            <Route path="/preferences" element={<PreferencesPage />} />
            <Route
              path="*"
              element={
                <div className="pib-container py-16 text-center space-y-4">
                  <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                    404 — Official Page Not Found
                  </h1>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    The requested route does not correspond to an official PIB section or active release.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b3558] hover:bg-[#164e7c] text-white text-xs font-semibold rounded-lg"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Homepage</span>
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Global Floating Chatbot FAB in bottom right corner */}
        <FloatingChatbotFab />

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
