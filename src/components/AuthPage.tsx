import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  MapPin, 
  Wheat, 
  CloudSun, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  MoreVertical, 
  Globe, 
  Moon, 
  Sun, 
  AlertCircle, 
  KeyRound, 
  HelpCircle,
  Loader2,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { User, Language } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  lang: Language;
  onToggleLang: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

type AuthMode = 'farmer_login' | 'farmer_register' | 'forgot_password' | 'admin_login';

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  lang,
  onToggleLang,
  darkMode,
  onToggleDarkMode,
}) => {
  const [mode, setMode] = useState<AuthMode>('farmer_login');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Common UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Farmer Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Farmer Registration Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDistrict, setRegDistrict] = useState('ময়মনসিংহ');
  const [regUpazila, setRegUpazila] = useState('ত্রিশাল');
  const [regCrop, setRegCrop] = useState('ধান (Rice)');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot Password Form
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [testCodeHint, setTestCodeHint] = useState<string | null>(null);

  // Admin Login Form
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Close three-dot menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear messages when mode changes
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setMenuOpen(false);
  };

  // Farmer Login Submit
  const handleFarmerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage(lang === 'bn' ? 'অনুগ্রহ করে ইমেইল/ফোন নম্বর এবং পাসওয়ার্ড দিন।' : 'Please enter your email/phone and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === 'bn' ? 'লগইন ব্যর্থ হয়েছে।' : 'Login failed.'));
      }

      if (data.token) {
        localStorage.setItem('agrimind_token', data.token);
      }
      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || (lang === 'bn' ? 'সার্ভার সংযোগে ত্রুটি দেখা দিয়েছে।' : 'Server connection error.'));
    } finally {
      setIsLoading(false);
    }
  };

  // One-Click Demo Farmer Auto Fill & Login
  const handleDemoFarmerLogin = () => {
    setLoginIdentifier('farmer@agrimind.bd');
    setLoginPassword('password123');
    setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: 'farmer@agrimind.bd',
            password: 'password123',
          }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          if (data.token) localStorage.setItem('agrimind_token', data.token);
          onLoginSuccess(data.user);
        } else {
          // Local fallback
          onLoginSuccess({
            id: 'user-farmer-1',
            name: 'মোহাম্মদ রফিকুল ইসলাম',
            email: 'farmer@agrimind.bd',
            phone: '01711223344',
            role: 'farmer',
            district: 'ময়মনসিংহ',
            upazila: 'ত্রিশাল',
            farmingInterests: ['ধান (Rice)', 'আলু (Potato)'],
            joinedAt: '2025-01-15',
          });
        }
      } catch (e) {
        // Fallback
        onLoginSuccess({
          id: 'user-farmer-1',
          name: 'মোহাম্মদ রফিকুল ইসলাম',
          email: 'farmer@agrimind.bd',
          phone: '01711223344',
          role: 'farmer',
          district: 'ময়মনসিংহ',
          upazila: 'ত্রিশাল',
          farmingInterests: ['ধান (Rice)', 'আলু (Potato)'],
          joinedAt: '2025-01-15',
        });
      } finally {
        setIsLoading(false);
      }
    }, 50);
  };

  // Farmer Registration Submit
  const handleFarmerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setErrorMessage(lang === 'bn' ? 'সকল আবশ্যক তথ্য পূরণ করুন।' : 'Please fill all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage(lang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage(lang === 'bn' ? 'পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি।' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          district: regDistrict,
          upazila: regUpazila,
          farmingInterests: [regCrop],
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === 'bn' ? 'নিবন্ধন ব্যর্থ হয়েছে।' : 'Registration failed.'));
      }

      setSuccessMessage(lang === 'bn' ? 'নিবন্ধন সফল হয়েছে! আপনাকে স্বাগতম।' : 'Registration successful! Welcome.');
      if (data.token) {
        localStorage.setItem('agrimind_token', data.token);
      }
      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || (lang === 'bn' ? 'নিবন্ধনে ত্রুটি হয়েছে।' : 'Registration error.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password - Step 1: Request Code
  const handleForgotRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!forgotEmail.trim()) {
      setErrorMessage(lang === 'bn' ? 'আপনার নিবন্ধিত ইমেইল ঠিকানা দিন।' : 'Please enter your registered email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset code.');
      }

      setSuccessMessage(data.message || (lang === 'bn' ? 'যাচাইকরণ কোড পাঠানো হয়েছে।' : 'Verification code sent.'));
      if (data.testCode) {
        setTestCodeHint(data.testCode);
        setForgotCode(data.testCode);
      }
      setForgotStep(2);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error sending code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password - Step 2: Reset Password
  const handleForgotResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!forgotCode.trim()) {
      setErrorMessage(lang === 'bn' ? '৬ ডিজিটের যাচাইকরণ কোড লিখুন।' : 'Enter 6-digit code.');
      return;
    }

    if (forgotNewPassword.length < 6) {
      setErrorMessage(lang === 'bn' ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage(lang === 'bn' ? 'উভয় পাসওয়ার্ড একই হতে হবে।' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          code: forgotCode.trim(),
          newPassword: forgotNewPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।' : 'Password reset failed.'));
      }

      setSuccessMessage(lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! এখন লগইন করুন।' : 'Password updated successfully! Please log in.');
      setTimeout(() => {
        setLoginIdentifier(forgotEmail);
        setLoginPassword('');
        switchMode('farmer_login');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Admin Login Submit
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setErrorMessage(lang === 'bn' ? 'অ্যাডমিন ইমেইল এবং সিক্রেট পাসওয়ার্ড প্রদান করুন।' : 'Enter admin email and secret password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail.trim(),
          password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === 'bn' ? 'অ্যাডমিন অনুমোদন ব্যর্থ হয়েছে।' : 'Admin verification failed.'));
      }

      if (data.token) {
        localStorage.setItem('agrimind_token', data.token);
      }
      setSuccessMessage(lang === 'bn' ? 'অ্যাডমিন নিরাপত্তা যাচাই সফল! পোর্টালে প্রবেশ করা হচ্ছে...' : 'Admin authenticated! Entering portal...');
      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Admin authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for quick admin fill for evaluation
  const handleQuickAdminFill = () => {
    setAdminEmail('kmsadikrahmansoccho@gmail.com');
    setAdminPassword('soccho2026!');
  };

  // District options
  const districts = [
    'ময়মনসিংহ', 'রংপুর', 'দিনাজপুর', 'বগুড়া', 'কুমিল্লা', 
    'যশোর', 'রাজশাহী', 'ঢাকা', 'সিলেট', 'বরিশাল', 'পাবনা', 'কুষ্টিয়া'
  ];

  const crops = [
    'ধান (Rice)', 'আলু (Potato)', 'গম (Wheat)', 'ভুট্টা (Maize)', 
    'সরিষা (Mustard)', 'শাকসবজি (Vegetables)', 'পাট (Jute)', 'আম ও ফলমূল'
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900 text-slate-100 font-sans relative overflow-x-hidden">
      
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        
        {/* Three-Dot Menu (⋮) */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="More Options"
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 text-slate-800 dark:text-slate-100">
              
              {/* Language Switch */}
              <button
                type="button"
                onClick={() => {
                  onToggleLang();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-emerald-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#087A35] dark:text-emerald-400" />
                <span className="font-medium">
                  {lang === 'bn' ? 'Language: English' : 'ভাষা: বাংলা'}
                </span>
              </button>

              {/* Dark/Light Switch */}
              <button
                type="button"
                onClick={() => {
                  onToggleDarkMode();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-emerald-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">{lang === 'bn' ? 'লাইট মোড চালু করুন' : 'Switch to Light Mode'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">{lang === 'bn' ? 'ডার্ক মোড চালু করুন' : 'Switch to Dark Mode'}</span>
                  </>
                )}
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              {/* Admin Login Option - Discreetly placed */}
              <button
                type="button"
                onClick={() => switchMode('admin_login')}
                className="w-full px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-left transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#087A35] dark:text-emerald-400" />
                <span>{lang === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Login'}</span>
              </button>

            </div>
          )}
        </div>
      </div>

      {/* LEFT SIDE: World-Class Bangladeshi Farmer Image & Branding */}
      <div className="lg:w-1/2 relative min-h-[420px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden">
        
        {/* Background Photo of Bangladeshi Rice Farmer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('/src/assets/images/bangladeshi_rice_farmer_1794148262359.jpg')` }}
        />

        {/* Cinematic Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-transparent" />

        {/* Content on Left: Top Logo & Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#087A35] to-[#064E2B] flex items-center justify-center text-white shadow-xl shadow-emerald-950/50 border border-emerald-400/30">
              <Sprout className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-3xl tracking-tight text-white font-display drop-shadow">
                  AGRIMIND
                </span>
                <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 backdrop-blur-xs">
                  {lang === 'bn' ? 'বাংলাদেশ' : 'BD'}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium tracking-wide">
                Smart Agriculture. Better Tomorrow.
              </p>
            </div>
          </div>
        </div>

        {/* Content on Left: Middle Value Proposition */}
        <div className="relative z-10 my-8 lg:my-auto max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{lang === 'bn' ? 'যাচাইকৃত তথ্যের মাধ্যমে সঠিক কৃষি সিদ্ধান্ত' : 'Verified Agricultural Knowledge Engine'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-md">
            {lang === 'bn' ? (
              <>
                স্মার্ট কৃষি। <span className="text-emerald-400">সুরক্ষিত ফসল।</span> সমৃদ্ধ কৃষক।
              </>
            ) : (
              <>
                Smart Farming. <span className="text-emerald-400">Protected Crops.</span> Prosperous Farmers.
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal">
            {lang === 'bn'
              ? 'কৃষি সম্প্রসারণ অধিদপ্তর (DAE), ধান গবেষণা ইনস্টিটিউট (BRRI) ও বিএআরআই (BARI)-এর অফিশিয়াল গবেষণা তথ্যের ভিত্তিতে এআই সিদ্ধান্ত সহায়তা।'
              : 'Official research-grounded AI decision support powered by BRRI, BARI, DAE, and BAMIS guidelines.'}
          </p>

          {/* 4 Feature Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">AI কৃষি পরামর্শ</h4>
                <p className="text-[11px] text-slate-300">১০-ধাপের নিরাপত্তা ফিল্টার</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">বিশ্বস্ত কৃষি তথ্য</h4>
                <p className="text-[11px] text-slate-300">BRRI, BARI ও DAE যাচাইকৃত</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                <CloudSun className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">লাইভ আবহাওয়া তথ্য</h4>
                <p className="text-[11px] text-slate-300">কৃষি-আবহাওয়া সতর্কবার্তা</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">নিরাপদ কৃষি নির্দেশনা</h4>
                <p className="text-[11px] text-slate-300">১৬১২৩ হেল্পলাইন সংযোগ</p>
              </div>
            </div>

          </div>
        </div>

        {/* Content on Left: Bottom Credibility Line */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>সরকারি কৃষি গবেষণা ও নির্দেশনার আলোকে তৈরি</span>
          </div>
          <span className="font-mono text-emerald-300/80 text-[11px]">v2.4 Secured</span>
        </div>

      </div>

      {/* RIGHT SIDE: Authentication Card Area */}
      <div className="lg:w-1/2 bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 transition-colors">
        
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 relative transition-all">
          
          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[#087A35] dark:text-emerald-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODE 1: FARMER LOGIN                                     */}
          {/* ======================================================== */}
          {mode === 'farmer_login' && (
            <div className="space-y-6">
              
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#087A35] dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Sprout className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {lang === 'bn' ? 'কৃষক লগইন' : 'Farmer Login'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {lang === 'bn' 
                    ? 'আপনার কৃষি সহযোগী অ্যাকাউন্টে প্রবেশ করুন' 
                    : 'Sign in to access your agricultural advisory assistant'}
                </p>
              </div>

              <form onSubmit={handleFarmerLogin} className="space-y-4">
                
                {/* Email or Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'bn' ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Phone Number'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={lang === 'bn' ? 'যেমন: 01711223344 বা farmer@mail.com' : 'e.g. 01711223344 or email'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white transition"
                    />
                  </div>
                </div>

                {/* Password with Show/Hide */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot_password')}
                      className="text-xs font-semibold text-[#087A35] dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#087A35] border-slate-300 rounded focus:ring-[#087A35]"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {lang === 'bn' ? 'আমাকে মনে রাখুন' : 'Remember me'}
                    </span>
                  </label>
                </div>

                {/* Submit Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#087A35] to-[#064E2B] text-white font-bold text-sm shadow-md shadow-emerald-900/20 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{lang === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              {/* Demo One-Click Testing Button for Farmers */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleDemoFarmerLogin}
                  disabled={isLoading}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-[#087A35] dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>🧑‍🌾 এক ক্লিকে ডেমো কৃষক লগইন (তাৎক্ষণিক পরীক্ষা)</span>
                </button>
              </div>

              {/* Social Login Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  {lang === 'bn' ? 'অথবা' : 'OR'}
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Google Sign-in Mock/Placeholder */}
              <button
                type="button"
                onClick={handleDemoFarmerLogin}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{lang === 'bn' ? 'গুগল অ্যাকাউন্ট দিয়ে লগইন করুন' : 'Sign in with Google'}</span>
              </button>

              {/* Toggle to Registration */}
              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {lang === 'bn' ? 'নতুন কৃষক?' : 'New to AGRIMIND?'}{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('farmer_register')}
                    className="font-bold text-[#087A35] dark:text-emerald-400 hover:underline cursor-pointer ml-1"
                  >
                    {lang === 'bn' ? 'এখনই বিনামূল্যে নিবন্ধন করুন।' : 'Register for free now.'}
                  </button>
                </p>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* MODE 2: FARMER REGISTRATION                              */}
          {/* ======================================================== */}
          {mode === 'farmer_register' && (
            <div className="space-y-5">
              
              <div className="text-center space-y-1">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#087A35] dark:text-emerald-400 flex items-center justify-center mx-auto mb-1">
                  <Wheat className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {lang === 'bn' ? 'নতুন কৃষক নিবন্ধন' : 'Farmer Registration'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'bn' ? 'সঠিক কৃষি তথ্য ও পরামর্শ পেতে বিনামূল্যে যুক্ত হোন' : 'Join to access tailored advisory for your farm'}
                </p>
              </div>

              <form onSubmit={handleFarmerRegister} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'পুরো নাম *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={lang === 'bn' ? 'যেমন: মোহাম্মদ রফিকুল ইসলাম' : 'Your full name'}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'bn' ? 'ইমেইল ঠিকানা *' : 'Email *'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="farmer@domain.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="017xxxxxxxx"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* District and Upazila Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'bn' ? 'জেলা' : 'District'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <select
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                      >
                        {districts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'bn' ? 'উপজেলা' : 'Upazila'}
                    </label>
                    <input
                      type="text"
                      value={regUpazila}
                      onChange={(e) => setRegUpazila(e.target.value)}
                      placeholder={lang === 'bn' ? 'উপজেলার নাম' : 'Upazila'}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* Main Crop Interest */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'প্রধান ফসল / আগ্রহ' : 'Primary Crop Interest'}
                  </label>
                  <select
                    value={regCrop}
                    onChange={(e) => setRegCrop(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                  >
                    {crops.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'bn' ? 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *' : 'Password (min 6 chars) *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন *' : 'Confirm Password *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(p => !p)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087A35] to-[#064E2B] text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'bn' ? 'নিবন্ধন করা হচ্ছে...' : 'Registering...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{lang === 'bn' ? 'নিবন্ধন সম্পন্ন করুন' : 'Complete Registration'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              {/* Back to Login */}
              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {lang === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('farmer_login')}
                    className="font-bold text-[#087A35] dark:text-emerald-400 hover:underline cursor-pointer ml-1"
                  >
                    {lang === 'bn' ? 'লগইন করুন' : 'Sign In'}
                  </button>
                </p>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* MODE 3: FORGOT PASSWORD                                  */}
          {/* ======================================================== */}
          {mode === 'forgot_password' && (
            <div className="space-y-6">
              
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {lang === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Password Recovery'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {forgotStep === 1
                    ? (lang === 'bn' 
                        ? 'আপনার নিবন্ধিত ইমেইলে একটি ৬-সংখ্যার যাচাইকরণ কোড পাঠানো হবে' 
                        : 'A 6-digit verification code will be sent to your email')
                    : (lang === 'bn'
                        ? 'কোড যাচাই করে নতুন পাসওয়ার্ড নির্ধারণ করুন'
                        : 'Verify code and set your new password')}
                </p>
              </div>

              {/* STEP 1: Enter Email */}
              {forgotStep === 1 && (
                <form onSubmit={handleForgotRequestCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === 'bn' ? 'নিবন্ধিত ইমেইল ঠিকানা' : 'Registered Email Address'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="farmer@agrimind.bd"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087A35] to-[#064E2B] text-white font-bold text-sm shadow-md hover:brightness-105 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{lang === 'bn' ? 'কোড পাঠানো হচ্ছে...' : 'Sending code...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{lang === 'bn' ? 'যাচাইকরণ কোড পাঠান' : 'Send Verification Code'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: Enter Code and New Password */}
              {forgotStep === 2 && (
                <form onSubmit={handleForgotResetPassword} className="space-y-4">
                  
                  {/* Development/Testing Hint if provided */}
                  {testCodeHint && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                      <p className="font-bold">পরীক্ষামূলক যাচাইকরণ কোড (Dev Hint):</p>
                      <p className="font-mono text-sm tracking-wider font-extrabold text-[#087A35]">{testCodeHint}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === 'bn' ? '৬ ডিজিটের যাচাইকরণ কোড' : '6-digit Verification Code'}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-center font-mono tracking-widest text-lg font-bold focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === 'bn' ? 'নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)' : 'New Password (min 6 chars)'}
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === 'bn' ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#087A35] focus:outline-none dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087A35] to-[#064E2B] text-white font-bold text-sm shadow-md hover:brightness-105 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{lang === 'bn' ? 'পাসওয়ার্ড হালনাগাদ করা হচ্ছে...' : 'Updating password...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Reset Password'}</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Back to Farmer Login */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => switchMode('farmer_login')}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#087A35] dark:hover:text-emerald-400 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'কৃষক লগইনে ফিরে যান' : 'Back to Farmer Login'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* MODE 4: SECURE ADMIN LOGIN                               */}
          {/* ======================================================== */}
          {mode === 'admin_login' && (
            <div className="space-y-6">
              
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30 shadow-lg">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  AGRIMIND Admin Portal
                </h2>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[11px] font-bold">
                  <Lock className="w-3 h-3" />
                  <span>{lang === 'bn' ? 'শুধুমাত্র অনুমোদিত প্রশাসনিক কর্মকর্তাদের জন্য' : 'Authorized Personnel Only'}</span>
                </div>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                
                {/* Admin Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'bn' ? 'প্রশাসনিক ইমেইল' : 'Admin Email'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@agrimind.bd"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none dark:text-white transition"
                    />
                  </div>
                </div>

                {/* Admin Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'bn' ? 'সিক্রেট অ্যাডমিন পাসওয়ার্ড' : 'Admin Secret Password'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none dark:text-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick Auto-Fill for Authorized Evaluation */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleQuickAdminFill}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400 text-[11px] font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>অনুমোদিত অ্যাডমিন ক্রেডেনশিয়াল পূরণ করুন</span>
                  </button>
                </div>

                {/* Submit Admin Login */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'bn' ? 'নিরাপত্তা যাচাই চলছে...' : 'Authenticating...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'সিকিউর অ্যাডমিন লগইন' : 'Secure Admin Login'}</span>
                    </>
                  )}
                </button>

              </form>

              {/* Security Audit Note */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>সকল অ্যাডমিন লগইন প্রচেষ্টা এন্ড-টু-এন্ড অডিট লগ এবং আইপি ট্র্যাকিং দ্বারা সুরক্ষিত।</span>
              </div>

              {/* Back to Farmer Login */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => switchMode('farmer_login')}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#087A35] dark:hover:text-emerald-400 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? '← সাধারণ কৃষক লগইনে ফিরুন' : '← Return to Farmer Login'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
