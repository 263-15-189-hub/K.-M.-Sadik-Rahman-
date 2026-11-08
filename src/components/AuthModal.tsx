import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { User, Language } from '../types';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  lang: Language;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  lang,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // Register state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('ময়মনসিংহ');
  const [upazila, setUpazila] = useState('ত্রিশাল');
  const [farmingInterests, setFarmingInterests] = useState('ধান, আলু, সরিষা');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Farmer Demo Login
  const handleQuickDemoFarmer = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'farmer@agrimind.bd', password: 'password123' })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
          localStorage.setItem('agrimind_token', data.token);
        }
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Demo login failed');
      }
    } catch (err: any) {
      setErrorMsg('সার্ভারে সংযোগে সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
          localStorage.setItem('agrimind_token', data.token);
        }
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setErrorMsg('সার্ভারে যোগাযোগ করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!email.trim() && !phone.trim())) {
      setErrorMsg('নাম এবং ইমেইল অথবা মোবাইল নম্বর প্রদান করুন।');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          district,
          upazila,
          farmingInterests: farmingInterests.split(',').map(s => s.trim()).filter(Boolean),
          role: 'farmer'
        })
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Registration failed');
      }
    } catch (err) {
      setErrorMsg('নিবন্ধন প্রক্রিয়ায় সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#087A35] to-[#064E2B] text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-900/10">
            <UserIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
            {mode === 'login' 
              ? (lang === 'bn' ? 'কৃষক লগইন' : 'Farmer Login') 
              : (lang === 'bn' ? 'কৃষক নিবন্ধন' : 'Farmer Registration')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            AGRIMIND · {lang === 'bn' ? 'জাতীয় কৃষি পরামর্শ প্ল্যাটফর্ম' : 'National Agri Advisory'}
          </p>
        </div>

        {/* Quick Demo Switcher (Farmer Only) */}
        <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center">
          <p className="text-[11px] font-bold text-[#087A35] dark:text-emerald-400 mb-2 uppercase tracking-wider">
            ⚡ তাৎক্ষণিক কৃষক ইন্টারফেস পরীক্ষা:
          </p>
          <button
            type="button"
            onClick={handleQuickDemoFarmer}
            disabled={isLoading}
            className="w-full py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            🧑‍🌾 কৃষক ডেমো প্রোফাইলে প্রবেশ করুন
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Mode: Login */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                ইমেইল বা মোবাইল নম্বর
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="farmer@agrimind.bd অথবা 01711223344"
                  required
                  className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087A35]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  পাসওয়ার্ড
                </label>
                <button
                  type="button"
                  onClick={() => alert('পাসওয়ার্ড রিসেটের জন্য ১৬১২৩ হেল্পলাইনে যোগাযোগ করুন।')}
                  className="text-[11px] text-[#087A35] dark:text-emerald-400 hover:underline"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087A35]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#087A35] hover:bg-[#064E2B] transition-colors shadow-md shadow-emerald-900/10 cursor-pointer"
            >
              {isLoading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">
                নতুন কৃষক?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#087A35] dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  নতুন একাউন্ট খুলুন
                </button>
              </span>
            </div>
          </form>
        ) : (
          /* Mode: Register */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                পূর্ণ নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: মোহাম্মদ রফিকুল ইসলাম"
                required
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  ইমেইল (ঐচ্ছিক)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@domain.com"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  জেলা
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  উপজেলা
                </label>
                <input
                  type="text"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                চাষের ফসল (কমা দিয়ে লিখুন)
              </label>
              <input
                type="text"
                value={farmingInterests}
                onChange={(e) => setFarmingInterests(e.target.value)}
                placeholder="ধান, আলু, সরিষা, শাকসবজি"
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#087A35] hover:bg-[#064E2B] transition-colors shadow-md shadow-emerald-900/10 cursor-pointer"
            >
              {isLoading ? 'নিবন্ধন হচ্ছে...' : 'নিবন্ধন সম্পন্ন করুন'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">
                ইতিমধ্যে একাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#087A35] dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  লগইন করুন
                </button>
              </span>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
