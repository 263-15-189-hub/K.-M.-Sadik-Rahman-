import React, { useState } from 'react';
import { 
  Sprout, 
  Search, 
  Moon, 
  Sun, 
  User as UserIcon, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { User, Language } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  lang: Language;
  onToggleLang: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  lang,
  onToggleLang,
  darkMode,
  onToggleDarkMode,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home' },
    { id: 'advisory', labelBn: 'কৃষি পরামর্শ', labelEn: 'Advisory' },
    { id: 'google-search', labelBn: 'গুগল অনুসন্ধান', labelEn: 'Google Search' },
    { id: 'crops', labelBn: 'ফসল', labelEn: 'Crops' },
    { id: 'seeds', labelBn: 'বীজ', labelEn: 'Seeds' },
    { id: 'soil', labelBn: 'মাটি ও সার', labelEn: 'Soil & Fertilizer' },
    { id: 'pests', labelBn: 'পোকা ও রোগ', labelEn: 'Pests & Diseases' },
    { id: 'weather', labelBn: 'আবহাওয়া', labelEn: 'Weather' },
    { id: 'knowledge', labelBn: 'জ্ঞানকোষ', labelEn: 'Knowledge Base' },
    { id: 'my-questions', labelBn: 'আমার প্রশ্ন', labelEn: 'My Questions' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#087A35] to-[#064E2B] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-[#087A35] dark:text-emerald-400 font-display">
                  AGRIMIND
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-[#064E2B] dark:bg-emerald-950 dark:text-emerald-300">
                  {lang === 'bn' ? 'বাংলাদেশ' : 'BD'}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-tight hidden sm:block">
                Smart Agriculture. Better Tomorrow.
              </p>
            </div>
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-sm font-medium transition-all rounded-lg whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#087A35] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 font-semibold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-[#087A35] dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {lang === 'bn' ? item.labelBn : item.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-[#087A35] dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={lang === 'bn' ? 'অনুসন্ধান করুন' : 'Search Knowledge'}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Selector */}
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#087A35] dark:hover:border-emerald-500 transition-colors cursor-pointer"
              title="Toggle Language"
            >
              {lang === 'bn' ? 'EN' : 'বাংলা'}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Account or Login / Register */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 text-slate-800 dark:text-slate-200 hover:bg-emerald-100/70 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#087A35] text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium max-w-[100px] truncate hidden md:inline-block">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentUser.role === 'admin' ? '🛡️ সিস্টেম অ্যাডমিন' : `📍 ${currentUser.district}, ${currentUser.upazila}`}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-[#087A35]" />
                      {currentUser.role === 'admin' ? 'অ্যাডমিন প্যানেল' : 'কৃষক ড্যাশবোর্ড'}
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          handleNavClick('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        অ্যাডমিন সেটিংস ও ভেরিফিকেশন
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      লগআউট (Logout)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-[#087A35] dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'লগইন' : 'Login'}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#087A35] hover:bg-[#064E2B] rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  {lang === 'bn' ? 'নিবন্ধন' : 'Register'}
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#087A35] dark:text-emerald-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {lang === 'bn' ? item.labelBn : item.labelEn}
            </button>
          ))}
          {currentUser && (
            <button
              onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30"
            >
              {currentUser.role === 'admin' ? '🛡️ অ্যাডমিন কনসোল' : '👤 আমার ড্যাশবোর্ড'}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
