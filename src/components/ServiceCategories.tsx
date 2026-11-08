import React from 'react';
import { 
  Wheat, 
  Sparkles, 
  Layers, 
  FlaskConical, 
  Bug, 
  ShieldAlert, 
  Droplets, 
  CloudSunRain,
  ArrowUpRight
} from 'lucide-react';
import { Language } from '../types';

interface ServiceCategoriesProps {
  lang: Language;
  onSelectCategory: (categoryId: string) => void;
}

export const ServiceCategories: React.FC<ServiceCategoriesProps> = ({
  lang,
  onSelectCategory
}) => {
  const categories = [
    {
      id: 'crops',
      titleBn: 'ফসলের পরামর্শ',
      titleEn: 'Crop Advisory',
      descBn: 'ধান, গম, ভুট্টা, আলু ও সবজি চাষের আধুনিক প্রযুক্তি',
      descEn: 'Rice, wheat, maize, potato & seasonal crop guides',
      icon: Wheat,
      color: 'from-amber-500 to-amber-700',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200 dark:border-amber-900/40'
    },
    {
      id: 'seeds',
      titleBn: 'বীজ নির্বাচন ও বপন',
      titleEn: 'Seed Selection',
      descBn: 'উচ্চফলনশীল জাত, ব্রি ধান ও অঙ্কুরোদগম মান পরীক্ষা',
      descEn: 'High yielding varieties, BRRI & germination testing',
      icon: Sparkles,
      color: 'from-emerald-500 to-emerald-700',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200 dark:border-emerald-900/40'
    },
    {
      id: 'soil',
      titleBn: 'মাটি ও জমির পরামর্শ',
      titleEn: 'Soil & Land Care',
      descBn: 'মাটি পরীক্ষা, অম্লতা (pH), ক্ষারত্ব ও লবণাক্ত জমি ব্যবস্থাপনা',
      descEn: 'Soil testing, acidity, alkalinity & salinity management',
      icon: Layers,
      color: 'from-orange-500 to-stone-700',
      bgColor: 'bg-stone-50 dark:bg-stone-900/40',
      borderColor: 'border-stone-200 dark:border-stone-800'
    },
    {
      id: 'fertilizer',
      titleBn: 'সারের ব্যবস্থাপনা',
      titleEn: 'Fertilizer Management',
      descBn: 'লিফ কালার চার্ট (LCC), সুষম রাসায়নিক ও জৈব সার প্রয়োগ',
      descEn: 'LCC leaf chart, balanced chemical & organic compost',
      icon: FlaskConical,
      color: 'from-blue-500 to-indigo-700',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-900/40'
    },
    {
      id: 'pests',
      titleBn: 'পোকামাকড় নিয়ন্ত্রণ',
      titleEn: 'Pest Management',
      descBn: 'আইপিএম, আলোর ফাঁদ, ফেরোমোন ফাঁদ ও জৈব দমন ব্যবস্থা',
      descEn: 'IPM, light traps, sex pheromones & bio-controls',
      icon: Bug,
      color: 'from-rose-500 to-red-700',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-200 dark:border-rose-900/40'
    },
    {
      id: 'diseases',
      titleBn: 'রোগ ও প্রতিকার',
      titleEn: 'Disease & Cure',
      descBn: 'ব্লাস্ট, নাবী ধসা, ঝলসানো ও ছত্রাকজনিত রোগ প্রতিষেধক',
      descEn: 'Blast, late blight, bacterial wilt & antifungal care',
      icon: ShieldAlert,
      color: 'from-purple-500 to-violet-700',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      borderColor: 'border-purple-200 dark:border-purple-900/40'
    },
    {
      id: 'irrigation',
      titleBn: 'সেচ ব্যবস্থাপনা',
      titleEn: 'Irrigation & AWD',
      descBn: 'পর্যায়ক্রমে ভেজানো ও শুকানো (AWD) ও সাশ্রয়ী ড্রিপ সেচ',
      descEn: 'Alternate wetting & drying (AWD) & drip irrigation',
      icon: Droplets,
      color: 'from-cyan-500 to-teal-700',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      borderColor: 'border-teal-200 dark:border-teal-900/40'
    },
    {
      id: 'weather',
      titleBn: 'আবহাওয়া পরামর্শ',
      titleEn: 'Weather Advisory',
      descBn: 'রিয়েল-টাইম বৃষ্টি, তাপমাত্রা, খরা ও বন্যা পূর্বাভাস',
      descEn: 'Live rain probability, frost, drought & storm warnings',
      icon: CloudSunRain,
      color: 'from-sky-500 to-blue-700',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40',
      borderColor: 'border-sky-200 dark:border-sky-900/40'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#087A35] dark:text-emerald-400">
              {lang === 'bn' ? 'কৃষি সেবা ও ক্যাটাগরি' : 'Agricultural Services & Categories'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-display">
              {lang === 'bn' ? 'সকল কৃষি বিভাগের বিশেষায়িত তথ্য ও সেবা' : 'Specialized Advisory for Every Farming Domain'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
            {lang === 'bn' 
              ? 'যেকোনো ক্যাটাগরিতে ক্লিক করে বিশদ গবেষণা ও নির্দেশিকা সরাসরি দেখুন।' 
              : 'Click any domain to access verified guidelines, practical steps and field research.'}
          </p>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group text-left p-5 rounded-2xl border ${cat.borderColor} ${cat.bgColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700 flex items-center justify-center text-[#087A35] dark:text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#087A35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#087A35] dark:group-hover:text-emerald-400 transition-colors">
                    {lang === 'bn' ? cat.titleBn : cat.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {lang === 'bn' ? cat.descBn : cat.descEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#087A35] dark:text-emerald-400 group-hover:underline">
                    {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'Explore Guidelines'} →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
