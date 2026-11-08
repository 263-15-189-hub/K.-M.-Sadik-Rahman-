import React, { useState } from 'react';
import { 
  User as UserIcon, 
  HelpCircle, 
  Bookmark, 
  FileText, 
  CloudSunRain, 
  BookOpen, 
  Users, 
  Settings, 
  Sprout, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ExternalLink,
  PhoneCall,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { User, AdvisoryQuestion, Language, InstitutionalDesk } from '../types';
import { INITIAL_INSTITUTIONAL_DESKS } from '../data/knowledgeSeed';

interface FarmerDashboardProps {
  currentUser: User;
  userQuestions: AdvisoryQuestion[];
  lang: Language;
  onOpenQuestionModal: () => void;
  onViewQuestion: (question: AdvisoryQuestion) => void;
  onSaveToggle: (id: string) => void;
  onUpdateProfile: (updated: Partial<User>) => void;
  onNavigateView: (view: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  currentUser,
  userQuestions,
  lang,
  onOpenQuestionModal,
  onViewQuestion,
  onSaveToggle,
  onUpdateProfile,
  onNavigateView
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'saved' | 'experts' | 'profile'>('overview');
  const [districtInput, setDistrictInput] = useState(currentUser.district);
  const [upazilaInput, setUpazilaInput] = useState(currentUser.upazila);
  const [interestsInput, setInterestsInput] = useState(currentUser.farmingInterests.join(', '));
  const [profileSaved, setProfileSaved] = useState(false);

  const savedQuestions = userQuestions.filter(q => q.saved);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      district: districtInput,
      upazila: upazilaInput,
      farmingInterests: interestsInput.split(',').map(s => s.trim()).filter(Boolean)
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Farmer Profile Hero Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#087A35] to-[#064E2B] text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {currentUser.name}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {currentUser.role === 'admin' ? 'অ্যাডমিন' : 'কৃষক সদস্য'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentUser.district}, {currentUser.upazila}</span>
                <span>·</span>
                <span>যুক্ত হয়েছেন: {currentUser.joinedAt}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {currentUser.farmingInterests.map((interest, idx) => (
                  <span key={idx} className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQuestionModal}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#087A35] hover:bg-[#064E2B] shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{lang === 'bn' ? 'নতুন প্রশ্ন জিজ্ঞাসা করুন' : 'Ask AGRIMIND'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'ওভারভিউ' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'questions'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'bn' ? `আমার প্রশ্ন ও রিপোর্ট (${userQuestions.length})` : `My Questions (${userQuestions.length})`}
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'bn' ? `সংরক্ষিত পরামর্শ (${savedQuestions.length})` : `Saved Reports (${savedQuestions.length})`}
          </button>
          <button
            onClick={() => setActiveTab('experts')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'experts'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'সরকারি কৃষি গবেষণা ও সেবা সেল' : 'Institutional Research Desks'}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">মোট জিজ্ঞাসিত প্রশ্ন</span>
                <p className="text-3xl font-extrabold text-[#087A35] dark:text-emerald-400 mt-2 font-mono tabular-nums">
                  {userQuestions.length}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">সবগুলো রিপোর্ট এআই ও ডিএই দ্বারা বিশ্লেষিত</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">সংরক্ষিত কৃষি প্রতিবেদন</span>
                <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2 font-mono tabular-nums">
                  {savedQuestions.length}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">দ্রুত রেফারেন্সের জন্য সেভ করা</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">জরুরি সরকারি সহায়তা</span>
                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 font-mono">
                  ১৬১২৩
                </p>
                <p className="text-[11px] text-slate-400 mt-1">টোল-ফ্রি কৃষি তথ্য সার্ভিস কল সেন্টার</p>
              </div>
            </div>

            {/* Recent Questions List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  সাম্প্রতিক প্রশ্ন ও গবেষণা প্রতিবেদন
                </h3>
                <button
                  onClick={() => setActiveTab('questions')}
                  className="text-xs font-bold text-[#087A35] dark:text-emerald-400 hover:underline"
                >
                  সবগুলো দেখুন →
                </button>
              </div>

              {userQuestions.length > 0 ? (
                <div className="space-y-4">
                  {userQuestions.slice(0, 3).map((q) => (
                    <div 
                      key={q.id}
                      onClick={() => onViewQuestion(q)}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400">
                            {q.category}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(q.createdAt).toLocaleDateString('bn-BD')}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                          "{q.query}"
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-[#087A35] dark:text-emerald-400">
                          রিপোর্ট দেখুন →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">এখনো কোনো প্রশ্ন করেননি।</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: My Questions */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            {userQuestions.map((q) => (
              <div 
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400">
                      {q.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(q.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    "{q.query}"
                  </h3>
                  {q.response && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {q.response.summary}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSaveToggle(q.id)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500"
                    title={q.saved ? 'Remove bookmark' : 'Bookmark report'}
                  >
                    <Bookmark className={`w-4 h-4 ${q.saved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                  </button>
                  <button
                    onClick={() => onViewQuestion(q)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#087A35] hover:bg-[#064E2B] transition-colors"
                  >
                    রিপোর্ট পড়ুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Saved Recommendations */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedQuestions.length > 0 ? (
              savedQuestions.map((q) => (
                <div 
                  key={q.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      সংরক্ষিত প্রতিবেদন · {q.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      "{q.query}"
                    </h3>
                  </div>
                  <button
                    onClick={() => onViewQuestion(q)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#087A35] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 transition-colors"
                  >
                    দেখুন →
                  </button>
                </div>
              ))
            ) : (
              <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">কোনো সংরক্ষিত রিপোর্ট নেই</p>
                <p className="text-xs text-slate-500 mt-1">যেকোনো রিপোর্টের বুকমার্ক আইকনে ক্লিক করে সংরক্ষণ করতে পারেন।</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Institutional Research & Extension Desks */}
        {activeTab === 'experts' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                সরকারি কৃষি গবেষণা ইনস্টিটিউট ও সম্প্রসারণ সেবা সেল
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI), বারি (BARI), কৃষি সম্প্রসারণ অধিদপ্তর (DAE) ও কৃষি তথ্য সার্ভিস (AIS)-এর প্রাতিষ্ঠানিক হেল্পডেস্ক
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INITIAL_INSTITUTIONAL_DESKS.map((desk) => (
                <div 
                  key={desk.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-300 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {desk.deskTitle}
                        </h4>
                        <p className="text-xs text-[#087A35] dark:text-emerald-400 font-bold mt-0.5">
                          {desk.organization}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{desk.district}, {desk.upazila}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        সরাসরি সেবা সেল
                      </span>
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold block mb-0.5 text-slate-900 dark:text-white">দায়িত্ব ও গবেষণা পরিধি:</span>
                      {desk.mandateScope}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <a
                      href={`tel:${desk.officialPhone.replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087A35] dark:text-emerald-400 hover:underline"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{desk.officialPhone}</span>
                    </a>

                    <a
                      href={`mailto:${desk.officialEmail}`}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    >
                      {desk.officialEmail}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              কৃষক প্রোফাইল ও চাষাবাদ বিবরণী
            </h3>

            {profileSaved && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>প্রোফাইল সফলভাবে হালনাগাদ করা হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  জেলা (District)
                </label>
                <input
                  type="text"
                  value={districtInput}
                  onChange={(e) => setDistrictInput(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  উপজেলা (Upazila)
                </label>
                <input
                  type="text"
                  value={upazilaInput}
                  onChange={(e) => setUpazilaInput(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  চাষের প্রধান ফসলসমূহ (কমা দিয়ে লিখুন)
                </label>
                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  placeholder="যেমন: ধান, আলু, গম, সরিষা"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#087A35] hover:bg-[#064E2B] transition-colors"
                >
                  তথ্য সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
