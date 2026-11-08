import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AdvisoryResultView } from './components/AdvisoryResultView';
import { ServiceCategories } from './components/ServiceCategories';
import { HomepageContentCards } from './components/HomepageContentCards';
import { WeatherSection } from './components/WeatherSection';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CategoryDetailView } from './components/CategoryDetailView';
import { GoogleSearchSection } from './components/GoogleSearchSection';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { User, AdvisoryQuestion, Language } from './types';
import { Sparkles, ShieldCheck, CheckCircle2, PhoneCall, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [lang, setLang] = useState<Language>('bn');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('agrimind_theme') === 'dark';
  });
  
  // Current user & authentication
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agrimind_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Questions and Active Advisory
  const [userQuestions, setUserQuestions] = useState<AdvisoryQuestion[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<AdvisoryQuestion | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [researchStep, setResearchStep] = useState<number>(0);

  // Sync Dark Mode with <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('agrimind_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('agrimind_theme', 'light');
    }
  }, [darkMode]);

  // Load questions history from server
  const loadQuestions = async () => {
    try {
      const res = await fetch('/api/advisory/history', {
        headers: currentUser ? { 'x-user-id': currentUser.id } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setUserQuestions(data.questions || []);
        if (data.questions && data.questions.length > 0 && !activeQuestion) {
          setActiveQuestion(data.questions[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [currentUser]);

  // Language toggle
  const toggleLanguage = () => {
    setLang(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Auth actions
  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('agrimind_user', JSON.stringify(user));
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('agrimind_user');
    localStorage.removeItem('agrimind_token');
    setCurrentView('home');
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const newProfile = { ...currentUser, ...updated };
    setCurrentUser(newProfile);
    localStorage.setItem('agrimind_user', JSON.stringify(newProfile));
  };

  // Navigation router
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Main AI Advisory Search
  const handleSearchSubmit = async (queryText: string, category: string = 'প্রশ্ন করুন') => {
    setIsSearching(true);
    setResearchStep(1);

    // Simulate real 6-step evidence analysis progress for user transparency
    const stepInterval = setInterval(() => {
      setResearchStep(prev => (prev < 5 ? prev + 1 : prev));
    }, 450);

    try {
      const res = await fetch('/api/advisory/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          category,
          language: lang,
          userId: currentUser?.id,
          crop: currentUser?.farmingInterests?.[0] || 'ধান',
          location: currentUser ? `${currentUser.district}, ${currentUser.upazila}` : 'বাংলাদেশ'
        })
      });

      clearInterval(stepInterval);
      setResearchStep(6);

      if (res.ok) {
        const data = await res.json();
        setActiveQuestion(data.question);
        setUserQuestions(prev => [data.question, ...prev]);
        setCurrentView('home');
        // Scroll to answer smoothly
        setTimeout(() => {
          const el = document.getElementById('advisory-result-anchor');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else {
        alert('পরামর্শ প্রস্তুত করতে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.error(err);
      alert('সার্ভার সংযোগে ত্রুটি দেখা দিয়েছে।');
    } finally {
      setIsSearching(false);
      setResearchStep(0);
    }
  };

  // Save/Bookmark toggle
  const handleSaveToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/advisory/history/${id}/save`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        setUserQuestions(prev => prev.map(q => q.id === id ? data.question : q));
        if (activeQuestion?.id === id) {
          setActiveQuestion(data.question);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Follow-up interaction
  const handleFollowUpSubmit = (details: string) => {
    if (!activeQuestion) return;
    handleSearchSubmit(`${activeQuestion.query}. অতিরিক্ত তথ্য: ${details}`, activeQuestion.category);
  };

  // If not logged in, show world-class AuthPage directly as the first screen
  if (!currentUser) {
    return (
      <AuthPage
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
        onToggleLang={toggleLanguage}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Top Navigation */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        lang={lang}
        onToggleLang={toggleLanguage}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <>
            {/* Hero Section with Search Panel */}
            <HeroSection
              lang={lang}
              onSearchSubmit={handleSearchSubmit}
              isLoading={isSearching}
            />

            {/* Researching Animation Indicator */}
            {isSearching && (
              <div className="max-w-3xl mx-auto px-4 py-8 text-center">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-center gap-3 text-[#087A35] dark:text-emerald-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-base font-bold">
                      {lang === 'bn' ? 'সরকারি কৃষি গবেষণা ডেটাবেস অনুসন্ধান চলছে...' : 'Grounding with Official Bangladesh Agri DB...'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p className={researchStep >= 1 ? 'text-emerald-700 font-semibold' : ''}>
                      ১. কৃষকের বর্ণিত লক্ষণ ও ফসলের অবস্থা শনাক্তকরণ
                    </p>
                    <p className={researchStep >= 2 ? 'text-emerald-700 font-semibold' : ''}>
                      ২. BRRI, BARI ও DAE অফিশিয়াল প্রকাশনায় তথ্যপ্রমাণ যাচাই
                    </p>
                    <p className={researchStep >= 3 ? 'text-emerald-700 font-semibold' : ''}>
                      ৩. কৃষি নিরাপত্তা মানদণ্ড অনুযায়ী রাসায়নিক সতর্কতা পরীক্ষা
                    </p>
                    <p className={researchStep >= 4 ? 'text-emerald-700 font-semibold' : ''}>
                      ৪. সমাধান চূড়ান্তকরণ ও ১৬১২৩ হেল্পলাইন রেফারেন্স প্রস্তুত
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Structured Advisory Answer Section */}
            {activeQuestion && !isSearching && (
              <div id="advisory-result-anchor" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <AdvisoryResultView
                  question={activeQuestion}
                  lang={lang}
                  onSaveToggle={handleSaveToggle}
                  onFollowUpSubmit={handleFollowUpSubmit}
                />
              </div>
            )}

            {/* 8 Service Categories */}
            <ServiceCategories
              lang={lang}
              onSelectCategory={(catId) => handleNavigate(catId)}
            />

            {/* 3 Homepage Content Cards */}
            <HomepageContentCards
              lang={lang}
              currentUser={currentUser}
              userQuestions={userQuestions}
              onOpenQuestionModal={() => {
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              onViewQuestion={(q) => {
                setActiveQuestion(q);
                setTimeout(() => {
                  document.getElementById('advisory-result-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              onNavigate={handleNavigate}
            />

            {/* Live Weather Section */}
            <WeatherSection lang={lang} />
          </>
        )}

        {/* VIEW 2: CATEGORY DETAIL PAGES (crops, seeds, soil, fertilizer, pests, diseases, irrigation, weather) */}
        {['crops', 'seeds', 'soil', 'fertilizer', 'pests', 'diseases', 'irrigation'].includes(currentView) && (
          <CategoryDetailView
            categoryId={currentView}
            lang={lang}
            onBack={() => handleNavigate('home')}
            onAskAboutCategory={(samplePrompt) => {
              handleSearchSubmit(samplePrompt, currentView);
            }}
          />
        )}

        {/* Dedicated Weather View */}
        {currentView === 'weather' && (
          <div className="py-8">
            <WeatherSection lang={lang} />
          </div>
        )}

        {/* VIEW: GOOGLE SEARCH */}
        {currentView === 'google-search' && (
          <GoogleSearchSection
            lang={lang}
            onAskAdvisory={(query) => {
              handleSearchSubmit(query);
            }}
          />
        )}

        {/* VIEW 3: KNOWLEDGE BASE */}
        {currentView === 'knowledge' && (
          <KnowledgeBaseView lang={lang} />
        )}

        {/* VIEW 4: MY QUESTIONS / FARMER DASHBOARD */}
        {(currentView === 'my-questions' || currentView === 'dashboard') && currentUser && (
          <FarmerDashboard
            currentUser={currentUser}
            userQuestions={userQuestions}
            lang={lang}
            onOpenQuestionModal={() => handleNavigate('home')}
            onViewQuestion={(q) => {
              setActiveQuestion(q);
              setCurrentView('home');
              setTimeout(() => {
                document.getElementById('advisory-result-anchor')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            onSaveToggle={handleSaveToggle}
            onUpdateProfile={handleUpdateProfile}
            onNavigateView={handleNavigate}
          />
        )}

        {/* Dedicated Advisory Query View */}
        {currentView === 'advisory' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <HeroSection
              lang={lang}
              onSearchSubmit={handleSearchSubmit}
              isLoading={isSearching}
            />
            {activeQuestion && (
              <div id="advisory-result-anchor" className="mt-8">
                <AdvisoryResultView
                  question={activeQuestion}
                  lang={lang}
                  onSaveToggle={handleSaveToggle}
                  onFollowUpSubmit={handleFollowUpSubmit}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: ADMIN CONSOLE */}
        {currentView === 'admin' && (
          <AdminDashboard lang={lang} />
        )}

      </main>

      {/* Footer */}
      <Footer lang={lang} onNavigate={handleNavigate} />

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal
          initialMode={authMode}
          lang={lang}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        lang={lang}
        onClose={() => setSearchModalOpen(false)}
        onSearch={(query) => handleSearchSubmit(query)}
      />

    </div>
  );
}
