import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Eye,
  Tag
} from 'lucide-react';
import { KnowledgeArticle, Language } from '../types';

interface KnowledgeBaseViewProps {
  lang: Language;
  onSelectArticle?: (article: KnowledgeArticle) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  lang,
  onSelectArticle
}) => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);

  const categories = [
    { id: 'all', nameBn: 'সব ক্যাটাগরি', nameEn: 'All Categories' },
    { id: 'রোগ ও প্রতিকার', nameBn: 'রোগ ও প্রতিকার', nameEn: 'Disease & Cure' },
    { id: 'পোকামাকড় নিয়ন্ত্রণ', nameBn: 'পোকামাকড় নিয়ন্ত্রণ', nameEn: 'Pest Control' },
    { id: 'সারের ব্যবস্থাপনা', nameBn: 'সারের ব্যবস্থাপনা', nameEn: 'Fertilizers' },
    { id: 'বীজ নির্বাচন ও বপন', nameBn: 'বীজ নির্বাচন ও বপন', nameEn: 'Seeds' },
    { id: 'সেচ ব্যবস্থাপনা', nameBn: 'সেচ ব্যবস্থাপনা', nameEn: 'Irrigation' },
    { id: 'মাটি ও জমির পরামর্শ', nameBn: 'মাটি ও জমি', nameEn: 'Soil & Land' },
  ];

  const crops = [
    { id: 'all', nameBn: 'সব ফসল', nameEn: 'All Crops' },
    { id: 'ধান', nameBn: 'ধান (Rice)', nameEn: 'Rice' },
    { id: 'আলু', nameBn: 'আলু (Potato)', nameEn: 'Potato' },
    { id: 'আম', nameBn: 'আম (Mango)', nameEn: 'Mango' },
    { id: 'গম', nameBn: 'গম (Wheat)', nameEn: 'Wheat' },
    { id: 'ভুট্টা', nameBn: 'ভুট্টা (Maize)', nameEn: 'Maize' },
  ];

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedCrop !== 'all') params.append('crop', selectedCrop);
      if (searchQuery.trim()) params.append('q', searchQuery.trim());

      const res = await fetch(`/api/knowledge?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, selectedCrop, searchQuery]);

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400 text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'জাতীয় কৃষি জ্ঞানকোষ' : 'National Agricultural Knowledge Bank'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            {lang === 'bn' ? 'যাচাইকৃত কৃষি গবেষণা ও নির্দেশিকা' : 'Verified Agricultural Research & Guidelines'}
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {lang === 'bn'
              ? 'বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI), কৃষি গবেষণা ইনস্টিটিউট (BARI), ও কৃষি সম্প্রসারণ অধিদপ্তর (DAE) কর্তৃক নিরীক্ষিত ও সত্যায়িত প্রকাশনা।'
              : 'Directly sourced from BRRI, BARI, DAE, BARC, and BAMIS official peer-reviewed agricultural manuals.'}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'bn' ? 'ফসল, রোগ, পোকা বা সার লিখে খুঁজুন...' : 'Search by crop, disease, pest, or fertilizer...'}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087A35]"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="text-xs sm:text-sm px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087A35]"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === 'bn' ? c.nameBn : c.nameEn}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs sm:text-sm px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087A35]"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {lang === 'bn' ? cat.nameBn : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles List */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-[#087A35] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500">গবেষণাপত্র লোড হচ্ছে...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400">
                      {art.sourceName} Official
                    </span>

                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {art.verificationStatus === 'verified' ? 'যাচাইকৃত' : art.verificationStatus}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#087A35] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {lang === 'bn' ? art.titleBn : art.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {art.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-600" />
                      {art.crop}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {art.publicationDate}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveArticle(art);
                    }}
                    className="w-full py-1.5 rounded-lg text-xs font-bold text-[#087A35] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors text-center"
                  >
                    {lang === 'bn' ? 'বিস্তারিত নির্দেশনা দেখুন' : 'View Full Guideline'} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {lang === 'bn' ? 'কোনো নিবন্ধ খুঁজে পাওয়া যায়নি' : 'No Articles Found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              অন্য কোনো ফসল বা অনুসন্ধান শব্দ দিয়ে চেষ্টা করুন।
            </p>
          </div>
        )}

      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400">
                  {activeArticle.sourceName} · {activeArticle.category}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-2">
                  {lang === 'bn' ? activeArticle.titleBn : activeArticle.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  ফসল: {activeArticle.crop} · অঞ্চল: {activeArticle.region} · মৌসুম: {activeArticle.season}
                </p>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="py-5 space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  লক্ষণ ও বৈজ্ঞানিক প্রেক্ষাপট:
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  {activeArticle.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#087A35] dark:text-emerald-400 mb-1">
                  সরকারি অনুমোদিত সুপারিশ ও করণীয়:
                </h4>
                <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-emerald-50/50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 whitespace-pre-line">
                  {activeArticle.recommendation}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold">যাচাই নিরীক্ষকের নোট: </span>
                  <span>{activeArticle.reviewerNotes}</span>
                </div>
                <div className="text-[11px] font-mono">
                  সর্বশেষ পর্যালোচনা: {activeArticle.lastReviewedDate}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a
                href={activeArticle.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#087A35] dark:text-emerald-400 hover:underline flex items-center gap-1.5"
              >
                <span>অফিশিয়াল ওয়েবসাইট সোর্স দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
