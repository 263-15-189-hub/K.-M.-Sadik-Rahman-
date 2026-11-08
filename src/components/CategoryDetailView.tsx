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
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Language } from '../types';

interface CategoryDetailViewProps {
  categoryId: string;
  lang: Language;
  onBack: () => void;
  onAskAboutCategory: (prompt: string) => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  categoryId,
  lang,
  onBack,
  onAskAboutCategory
}) => {
  const categoryData: Record<string, any> = {
    crops: {
      titleBn: 'ফসলের পরামর্শ (Crop Advisory)',
      titleEn: 'Crop Advisory',
      icon: Wheat,
      color: 'from-amber-600 to-amber-800',
      descriptionBn: 'বাংলাদেশে প্রধান খাদ্যশস্য (আমন, বোরো, আউশ ধান, গম, ভুট্টা) এবং অর্থকরী ফসল (আলু, পাট, সরিষা ও শাকসবজি) উৎপাদনের বৈজ্ঞানিক পর্যায়ক্রমিক নির্দেশিকা।',
      sections: [
        {
          title: 'বোরো ও আমন ধানের উচ্চফলনশীল জাতসমূহ (BRRI Varieties)',
          points: [
            'স্বল্পমেয়াদী আগাম আমন জাত: ব্রি ধান৭১, ব্রি ধান৭৫ (১২৫-১৩০ দিন মেয়াদী, কাটার পর অনায়াসে সরিষা চাষ সম্ভব)।',
            'লবণাক্ততা সহনশীল বোরো জাত: ব্রি ধান৬৭, ব্রি ধান৯৭, ব্রি ধান৯৯ (৮-১০ ডিএস/মি লবণাক্ততা সহনশীল)।',
            'জিংকসমৃদ্ধ পুষ্টি চাল: ব্রি ধান৭৪, ব্রি ধান৮৪ এবং ডায়াবেটিক চাল হিসেবে ব্রি ধান১৬।'
          ]
        },
        {
          title: 'রবি মৌসুমের আলু ও সরিষা চাষের কৌশল',
          points: [
            'আলুর আধুনিক জাত: বারি আলু-৭ (ডায়মন্ট), বারি আলু-৮ (কার্ডিনাল) ও রপ্তানিযোগ্য জাত বারি আলু-৪৬।',
            'উন্নত সরিষা জাত: বারি সরিষা-১৪ ও বারি সরিষা-১৭ (৮০-৮৫ দিনে পরিপক্ব, বিঘায় ৫-৬ মণ ফলন)।'
          ]
        }
      ],
      sampleQuery: 'আমন ধান কাটার পর একই জমিতে স্বল্পমেয়াদী সরিষা ও বোরো চাষের সময়সূচি কী?'
    },
    seeds: {
      titleBn: 'বীজ নির্বাচন ও বপন প্রযুক্তি (Seed Selection & Sowing)',
      titleEn: 'Seed Selection & Germination',
      icon: Sparkles,
      color: 'from-emerald-600 to-emerald-800',
      descriptionBn: 'ভালো বীজে ভালো ফসল। সরকারি বিএডিসি (BADC) এবং ব্রি/বারি কর্তৃক প্রত্যয়িত বীজ নির্বাচন, লবণাক্ত পানি দিয়ে পুষ্ট বীজ বাছাই এবং ট্রাইকোডার্মা দিয়ে বীজ শোধন প্রযুক্তি।',
      sections: [
        {
          title: 'লবণ পানি দিয়ে পুষ্ট ধানের বীজ বাছাই পদ্ধতি',
          points: [
            '১০ লিটার পানিতে ৪০০ গ্রাম খাওয়ার লবণ গুলিয়ে একটি তাজা ডিম ছাড়লে ডিম ভেসে উঠলেই বুঝতে হবে পানির ঘনত্ব সঠিক হয়েছে।',
            'ঐ পানিতে ধানের বীজ ঢেলে দিলে চিটা ও হালকা বীজ ভেসে উঠবে। ভেসে ওঠা বীজ ফেলে দিয়ে নিচের ভারী ও পুষ্ট বীজ আলাদা করুন।',
            'বাছাই করা বীজ অবিলম্বে পরিষ্কার মিষ্টি পানিতে ৩-৪ বার ধুয়ে নিন যাতে লবণের কোনো চিহ্ন না থাকে।'
          ]
        },
        {
          title: 'ছত্রাকনাশক ও ট্রাইকোডার্মা দ্বারা বীজ শোধন',
          points: [
            'প্রতি কেজি বীজে ২-৩ গ্রাম কার্বেনডাজিম বা ট্রাইসাইক্লাজোল অথবা বায়ো-এজেন্ট ট্রাইকোডার্মা মিশিয়ে শোধন করলে চারা অবস্থায় ৮০% রোগ প্রতিরোধ হয়।'
          ]
        }
      ],
      sampleQuery: 'বোরো ধানের বীজতলায় অঙ্কুরোদগম হার পরীক্ষা ও বীজ শোধন কীভাবে করব?'
    },
    soil: {
      titleBn: 'মাটি ও জমির টেকসই ব্যবস্থাপনা (Soil & Land Management)',
      titleEn: 'Soil Health & Fertility',
      icon: Layers,
      color: 'from-stone-600 to-stone-800',
      descriptionBn: 'মাটি সম্পদ উন্নয়ন ইনস্টিটিউট (SRDI) এর নির্দেশনানুসারে মাটির স্বাস্থ্য রক্ষা, জৈব পদার্থের ঘাটতি পূরণ এবং অম্ল ও লবণাক্ত মাটির সংস্কার।',
      sections: [
        {
          title: 'মাটির অম্লতা (pH < 5.5) ও ডলোমাইট চুন প্রয়োগ',
          points: [
            'উত্তরাঞ্চলের বরেন্দ্র ও তিস্তা পলল মাটিতে অম্লতা বেশি। জমিতে ডলোমাইট চুন (প্রতি শতকে ১.৫-২ কেজি) জমি চাষের সময় প্রয়োগ করলে ফসফরাস প্রাপ্যতা বৃদ্ধি পায়।',
            'চুন দেওয়ার পর অন্তত ১৫ দিন জমি ফেলে রেখে তারপর চারা রোপণ করুন।'
          ]
        },
        {
          title: 'জৈব সার ও ট্রাইকো-কম্পোস্ট তৈরি',
          points: [
            'মাটিতে ন্যূনতম ২% জৈব পদার্থ থাকা আবশ্যক। খামারজাত গোবর সারের সাথে ট্রাইকোডার্মা মিশিয়ে দ্রুত উৎকৃষ্ট ট্রাইকো-কম্পোস্ট তৈরি করা যায়।'
          ]
        }
      ],
      sampleQuery: 'আমার জমির মাটির অম্লতা (acidity) দূর করতে কতটুকু চুন ও জৈব সার দিতে হবে?'
    },
    fertilizer: {
      titleBn: 'সারের সুষম ব্যবস্থাপনা ও লিফ কালার চার্ট (Fertilizers & LCC)',
      titleEn: 'Fertilizer Management',
      icon: FlaskConical,
      color: 'from-blue-600 to-blue-800',
      descriptionBn: 'ইউরিয়া সারের অপচয় রোধে লিফ কালার চার্ট (LCC), গুটি ইউরিয়া (UDP) প্রযুক্তি এবং সুষম ডিএপি, পটাশ, জিপসাম ও জিংক সারের সঠিক প্রয়োগ মাত্রা।',
      sections: [
        {
          title: 'লিফ কালার চার্ট (LCC) দিয়ে ইউরিয়া সাশ্রয়',
          points: [
            'কুশি অবস্থা থেকে থোড় আসা পর্যন্ত প্রতি ৭-১০ দিন পর পর রোদ পিঠে রেখে সকাল ৯-১১টার মধ্যে ধানের ১০টি সুস্থ পাতার রঙ এলসিসির সাথে মেলান।',
            'রঙের মাত্রা চার্টের ৪ নম্বরের নিচে নামলে তবেই বিঘা প্রতি ৯-১০ কেজি ইউরিয়া উপরিপ্রয়োগ করুন। রঙ ৪ বা বেশি হলে ইউরিয়া দেওয়া সম্পূর্ণ বন্ধ রাখুন।'
          ]
        },
        {
          title: 'ডিএপি সার ব্যবহারে ইউরিয়া কমানোর নিয়ম',
          points: [
            'ডিএপি সারে ১৮% নাইট্রোজেন থাকায় ডিএপি ব্যবহার করলে বিঘাপ্রতি ইউরিয়া সার ৫-৭ কেজি কম প্রয়োগ করতে হয়।'
          ]
        }
      ],
      sampleQuery: 'বোরো ধানে বিঘা প্রতি ইউরিয়া, ডিএপি ও পটাশ সার দেওয়ার সঠিক সময়সূচি কী?'
    },
    pests: {
      titleBn: 'সমন্বিত বালাই ব্যবস্থাপনা (Integrated Pest Management - IPM)',
      titleEn: 'Pest Management',
      icon: Bug,
      color: 'from-rose-600 to-rose-800',
      descriptionBn: 'নির্বিচারে কীটনাশক প্রয়োগ না করে পরিবেশবান্ধব আলোর ফাঁদ, পার্চিং (ডালপোতা), ফেরোমোন ফাঁদ ও জৈব বালাইনাশকের মাধ্যমে ফসলের পোকা দমন।',
      sections: [
        {
          title: 'পার্চিং (ডালপোতা) ও আলোর ফাঁদ পদ্ধতি',
          points: [
            'বিঘা প্রতি ১০-১২টি বাঁশের কঞ্চি বা ডাল পুঁতলে ফিঙে, শালিক ইত্যাদি পাখি বসে ধানের ক্ষতিকর মাজরা ও লেদাপোকার কীড়া খেয়ে সাবাড় করে।',
            'রাতে ক্ষেতের পাশে কেরোসিনের বাতি বা বৈদ্যুতিক বাতির নিচে কেরোসিন মিশ্রিত পানির পাত্র রেখে আলোর ফাঁদ দিলে হাজার হাজার ক্ষতিকর পোকা আকৃষ্ট হয়ে মরে।'
          ]
        },
        {
          title: 'সেক্স ফেরোমোন ফাঁদ ব্যবহার',
          points: [
            'বেগুন, শসা, লাউ ও মিষ্টি কুমড়ার ডগা ও ফল ছিদ্রকারী পোকা দমনে কিউলিউর সেক্স ফেরোমোন ফাঁদ ব্যবহারে শতভাগ রাসায়নিক কীটনাশক ছাড়া বিষমুক্ত সবজি উৎপাদন সম্ভব।'
          ]
        }
      ],
      sampleQuery: 'ধানের মাজরা পোকা ও পাতা মোড়ানো পোকা দমনে পার্চিং ও আলোর ফাঁদ কীভাবে ব্যবহার করব?'
    },
    diseases: {
      titleBn: 'ফসল রোগ নির্ণয় ও নিরাময় (Crop Disease Management)',
      titleEn: 'Crop Disease Management',
      icon: ShieldAlert,
      color: 'from-purple-600 to-purple-800',
      descriptionBn: 'ধানের ব্লাস্ট, খোলপচা, ব্যাকটেরিয়াল ব্লাইট, আলুর নাবী ধসা ও শাকসবজির মোজাইক ভাইরাস রোগের প্রাথমিক লক্ষণ শনাক্তকরণ ও অনুমোদিত ছত্রাকনাশক তালিকা।',
      sections: [
        {
          title: 'ব্লাস্ট ও নাবী ধসা রোগের জরুরি চিকিৎসা',
          points: [
            'ধানের পাতা বা শীষ ব্লাস্টের জন্য ট্রাইসাইক্লাজোল (ট্রপার) বা অ্যাজোক্সিস্ট্রোবিন + ডাইফেনোকোনাজল (এমিস্টার টপ) অনুমোদিত মাত্রায় শেষ বিকেলে স্প্রে করুন।',
            'আলুর নাবী ধসায় কুয়াশা থাকা অবস্থায় ম্যানকোজেব আগাম স্প্রে করুন। আক্রমণ ছড়িয়ে পড়লে মেটালেক্সিল বা সাইমোক্সানিল গ্রুপের ওষুধ ব্যবহার করুন।'
          ]
        }
      ],
      sampleQuery: 'আলুর নাবী ধসা (Late Blight) রোগ দ্রুত ছড়িয়ে পড়া বন্ধ করতে কী ওষুধ স্প্রে করব?'
    },
    irrigation: {
      titleBn: 'পর্যায়ক্রমে ভেজানো ও শুকানো সেচ পদ্ধতি (AWD Irrigation)',
      titleEn: 'Irrigation & Water Management',
      icon: Droplets,
      color: 'from-teal-600 to-teal-800',
      descriptionBn: 'ভূগর্ভস্থ পানির স্তর রক্ষা ও বিদ্যুৎ খরচ সাশ্রয়ে অলটারনেট ওয়েটিং অ্যান্ড ড্রাইং (AWD) পাইপ প্রযুক্তি এবং আধুনিক ড্রিপ সেচ ব্যবস্থার বিস্তার।',
      sections: [
        {
          title: 'AWD ছিদ্রযুক্ত পাইপ স্থাপন ও পর্যবেক্ষণ',
          points: [
            'চারা রোপণের ১০ দিন পর জমিতে ২৫ সেমি লম্বা ও ১০ সেমি চওড়া ছিদ্রযুক্ত প্লাস্টিক বা বাঁশের পাইপ ১৫ সেমি মাটির নিচে পুঁতে দিন।',
            'পাইপের ভেতরের পানি মাটির নিচে ১৫ সেমি নামলে তবেই ৫ সেমি পর্যন্ত সেচ দিন। এতে ২৫-৩০% সেচের পানি সাশ্রয় হয়।'
          ]
        }
      ],
      sampleQuery: 'বোরো ধানে AWD পাইপ পদ্ধতিতে সেচ দিলে কতটুকু ডিজেল ও সেচ খরচ সাশ্রয় হয়?'
    },
    weather: {
      titleBn: 'কৃষি আবহাওয়া ও দুর্যোগ প্রস্তুতি (Agro-Weather Advisory)',
      titleEn: 'Agro-Meteorological Advisory',
      icon: CloudSunRain,
      color: 'from-sky-600 to-sky-800',
      descriptionBn: 'বাংলাদেশ কৃষি আবহাওয়া তথ্য পোর্টাল (BAMIS) এর সহায়তায় আগাম বৃষ্টিপাত, শৈত্যপ্রবাহ, খরা ও শিলাবৃষ্টির ঝুঁকি মোকাবিলায় কৃষকের করণীয়।',
      sections: [
        {
          title: 'বন্যা ও হঠাৎ শিলাবৃষ্টি পূর্বাভাসে করণীয়',
          points: [
            'হাওর অঞ্চলে ৮০% ধান পেকে গেলে বৈশাখী ঢল নামার আগেই দ্রুত ধান কেটে ঘরে তুলুন।',
            'ভারী বৃষ্টির পূর্বাভাস থাকলে জমিতে কীটনাশক ও রাসায়নিক সার উপরিপ্রয়োগ স্থগিত রাখুন।'
          ]
        }
      ],
      sampleQuery: 'ভারী বৃষ্টির পূর্বাভাস থাকলে ধান ক্ষেতে সার দেওয়া উচিত কি না?'
    }
  };

  const current = categoryData[categoryId] || categoryData.crops;
  const Icon = current.icon;

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#087A35] dark:hover:text-emerald-400 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
        </button>

        {/* Hero Card for Category */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-8">
          <div className={`p-8 bg-gradient-to-r ${current.color} text-white`}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  {lang === 'bn' ? 'বিশেষায়িত কৃষি বিভাগ' : 'Agricultural Domain Advisory'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
                  {lang === 'bn' ? current.titleBn : current.titleEn}
                </h1>
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-white/90 max-w-3xl leading-relaxed">
              {current.descriptionBn}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {current.sections.map((sec: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#087A35] dark:text-emerald-400 shrink-0" />
                  <span>{sec.title}</span>
                </h3>
                <ul className="space-y-2">
                  {sec.points.map((pt: string, pIdx: number) => (
                    <li key={pIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="font-bold text-emerald-600 mt-0.5">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Quick Ask Prompt Button */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#087A35] dark:text-emerald-400 block mb-1">
                  এই বিষয়ে এআই পরামর্শ চান?
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  "{current.sampleQuery}"
                </p>
              </div>
              <button
                onClick={() => onAskAboutCategory(current.sampleQuery)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#087A35] hover:bg-[#064E2B] transition-colors shrink-0 cursor-pointer shadow-md"
              >
                এআই পরামর্শ নিন →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
