import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  ArrowRight, 
  Bookmark, 
  MessageSquare, 
  CheckCircle, 
  FileText,
  Calendar
} from 'lucide-react';
import { User, AdvisoryQuestion, Language } from '../types';
import { IMAGES } from '../assets/images';

interface HomepageContentCardsProps {
  lang: Language;
  currentUser: User | null;
  userQuestions: AdvisoryQuestion[];
  onOpenQuestionModal: () => void;
  onViewQuestion: (question: AdvisoryQuestion) => void;
  onNavigate: (view: string) => void;
}

export const HomepageContentCards: React.FC<HomepageContentCardsProps> = ({
  lang,
  currentUser,
  userQuestions,
  onOpenQuestionModal,
  onViewQuestion,
  onNavigate
}) => {
  const savedCount = userQuestions.filter(q => q.saved).length;
  const totalCount = userQuestions.length;
  const recentQuestion = userQuestions[0];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087A35] dark:text-emerald-400">
            {lang === 'bn' ? 'দৈনন্দিন কৃষি ও অগ্রগতি' : 'Daily Advisory & Farmer Progress'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-display">
            {lang === 'bn' ? 'সরাসরি তথ্য, প্রশ্ন ও আপনার চাষাবাদ ডায়েরি' : 'Actionable Knowledge & Your Farming Record'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* CARD 1: আজকের কৃষি পরামর্শ */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={IMAGES.riceHarvest} 
                  alt="Aman rice harvest in Bangladesh" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#087A35] text-white text-xs font-bold tracking-tight shadow-sm">
                  {lang === 'bn' ? 'আজকের কৃষি পরামর্শ' : "Today's Farm Advisory"}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{new Date().toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>·</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">BRRI / DAE</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {lang === 'bn' 
                    ? 'আমন ও বোরো ধানে শেষ পর্যায়ের সেচ ও ব্লাস্ট প্রতিরোধ ব্যবস্থা' 
                    : 'Late-Stage Irrigation and Blast Prevention in Rice'}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'bn' 
                    ? 'ধানের শীষ শক্ত হওয়া পর্যন্ত জমিতে সর্বদা ২-৩ ইঞ্চি পানি ধরে রাখুন। কুয়াশাচ্ছন্ন আবহাওয়ায় শীষ ব্লাস্ট রোগ দেখা দিলে শেষ বিকেলে অনুমোদিত ট্রাইসাইক্লাজোল স্প্রে করুন।'
                    : 'Maintain 2-3 inches of standing water until grain filling. In foggy weather, apply approved tricyclazole in late afternoon to prevent neck blast.'}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('knowledge')}
                className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-[#087A35] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'সম্পূর্ণ নির্দেশিকা পড়ুন' : 'Read Full Advisory'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 2: কৃষি জিজ্ঞাসা করুন */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={IMAGES.consultation} 
                  alt="Agricultural field consultation in Bangladesh" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-emerald-800 text-white text-xs font-bold tracking-tight shadow-sm">
                  {lang === 'bn' ? 'কৃষি জিজ্ঞাসা' : 'Ask Question'}
                </div>
              </div>

              <div className="p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {lang === 'bn' ? 'স্মার্ট এআই বিশেষজ্ঞ' : 'AI Agricultural Consultant'}
                </span>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mt-1">
                  {lang === 'bn' ? 'ফসলের যেকোনো সমস্যা নিয়ে এখনই জিজ্ঞাসা করুন' : 'Ask Any Question About Your Crops & Soil'}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'bn' 
                    ? 'পোকার আক্রমণ, পাতার রঙ পরিবর্তন, বীজের মান কিংবা সার প্রয়োগের সময়সূচি নিয়ে যেকোনো প্রশ্ন করুন। এআই সরকারি গবেষণাপত্র বিশ্লেষণ করে তাৎক্ষণিক উত্তর দেবে।'
                    : 'Describe pest symptoms, leaf discoloration, seed germination, or fertilizer timings to get evidence-supported Bangladesh research.'}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={onOpenQuestionModal}
                className="w-full py-2.5 px-4 rounded-xl bg-[#087A35] hover:bg-[#064E2B] text-xs font-bold text-white shadow-md shadow-emerald-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'এখনই প্রশ্ন করুন' : 'Ask AGRIMIND Now'}</span>
                <Sparkles className="w-4 h-4 text-emerald-200" />
              </button>
            </div>
          </div>

          {/* CARD 3: আপনার অগ্রগতি */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lang === 'bn' ? 'আপনার অগ্রগতি' : 'Your Farm Progress'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {currentUser ? currentUser.name : (lang === 'bn' ? 'কৃষক প্রোফাইল' : 'Farmer Profile')}
                    </p>
                  </div>
                </div>

                {currentUser && (
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    {currentUser.district}
                  </span>
                )}
              </div>

              {/* Real user data or clean empty state */}
              {totalCount > 0 ? (
                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lang === 'bn' ? 'মোট প্রশ্ন' : 'Questions'}</span>
                      </div>
                      <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                        {totalCount}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                        <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                        <span>{lang === 'bn' ? 'সংরক্ষিত রিপোর্ট' : 'Saved'}</span>
                      </div>
                      <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                        {savedCount}
                      </p>
                    </div>
                  </div>

                  {recentQuestion && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#087A35] dark:text-emerald-400 block mb-1">
                        {lang === 'bn' ? 'সাম্প্রতিক জিজ্ঞাসা ও পরামর্শ:' : 'Recent Advisory:'}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                        "{recentQuestion.query}"
                      </p>
                      <button
                        onClick={() => onViewQuestion(recentQuestion)}
                        className="mt-2 text-[11px] font-bold text-[#087A35] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{lang === 'bn' ? 'রিপোর্টটি পুনরায় দেখুন' : 'View Report'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>{lang === 'bn' ? 'যাচাইকৃত জ্ঞান অর্জনের হার' : 'Verified Knowledge Adherence'}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">৯৮.৫%</span>
                  </div>
                </div>
              ) : (
                /* Meaningful Empty State */
                <div className="mt-8 text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {lang === 'bn' ? 'এখনো কোনো প্রশ্ন করেননি' : 'No Questions Yet'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] mx-auto">
                    {lang === 'bn' 
                      ? 'আপনার ফসলের সমস্যা লিখে সার্চ করুন, এখানে আপনার রিপোর্ট সংরক্ষিত থাকবে।' 
                      : 'Search any agricultural issue to save your reports here.'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onNavigate('my-questions')}
                className="w-full py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#087A35] dark:hover:text-emerald-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{lang === 'bn' ? 'আমার সকল রিপোর্ট ড্যাশবোর্ড' : 'View Full Reports Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
