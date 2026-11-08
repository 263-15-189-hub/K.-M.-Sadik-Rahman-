import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Globe, 
  AlertCircle, 
  Calendar, 
  Building2, 
  ChevronRight,
  Loader2,
  FileText,
  Filter
} from 'lucide-react';
import { GoogleSearchResultItem, GoogleSearchResponse, SourceReference, Language } from '../types';

interface GoogleSearchSectionProps {
  lang: Language;
  onAskAdvisory: (query: string) => void;
}

export const GoogleSearchSection: React.FC<GoogleSearchSectionProps> = ({
  lang,
  onAskAdvisory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState<GoogleSearchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleQueries = [
    { labelBn: 'ধানের পাতা ব্লাস্ট রোগ দমন', query: 'ধানের পাতা ব্লাস্ট রোগ দমন ব্রি নির্দেশিকা' },
    { labelBn: 'বোরো ধানে এলসিসি ইউরিয়া প্রয়োগ', query: 'লিফ কালার চার্ট এলসিসি দিয়ে ইউরিয়া সার প্রয়োগ পদ্ধতি' },
    { labelBn: 'আলুর নাবী ধসা রোগ ব্যবস্থাপনা', query: 'আলুর নাবী ধসা রোগ প্রতিরোধ বারি নির্দেশিকা' },
    { labelBn: 'লবণাক্ততা সহনশীল ব্রি ধান৬৭', query: 'উপকূলীয় লবণাক্ত জমিতে ব্রি ধান৬৭ চাষের আধুনিক প্রযুক্তি' },
    { labelBn: 'আমের মাছি পোকা দমন ফেরোমোন ফাঁদ', query: 'আমের মাছি পোকা দমনে সেক্স ফেরোমোন ফাঁদ বারি' },
    { labelBn: 'ডলোমাইট চুন দিয়ে মাটির অম্লতা দূরীকরণ', query: 'মাটির অম্লতা দূরীকরণে ডলোমাইট চুন প্রয়োগ পদ্ধতি' }
  ];

  const categories = [
    { id: 'all', labelBn: 'সকল বিষয়', labelEn: 'All Topics' },
    { id: 'rice', labelBn: 'ধান গবেষণা (BRRI)', labelEn: 'Rice (BRRI)' },
    { id: 'potato', labelBn: 'আলু ও সবজি (BARI)', labelEn: 'Potato/Veg (BARI)' },
    { id: 'fertilizer', labelBn: 'মাটি ও সুষম সার', labelEn: 'Soil & Fertilizer' },
    { id: 'pesticide', labelBn: 'বালাইনাশক বিধি', labelEn: 'Pest Management' },
    { id: 'weather', labelBn: 'আবহাওয়া সেবা (BAMIS)', labelEn: 'Agro-Climate' }
  ];

  const performSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/search/google?q=${encodeURIComponent(queryText.trim())}&category=${activeCategory}`);
      if (res.ok) {
        const data: GoogleSearchResponse = await res.json();
        setSearchResponse(data);
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'অনুসন্ধান সম্পন্ন করা যায়নি।');
      }
    } catch (err) {
      setErrorMessage('সার্ভার সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleSampleClick = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  // Perform initial search on load
  useEffect(() => {
    performSearch('ধান চাষের আধুনিক প্রযুক্তি ও রোগ দমন নির্দেশিকা');
  }, []);

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-emerald-900 via-[#064E2B] to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200 mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'গুগল অনুসন্ধান ও প্রাতিষ্ঠানিক কৃষি গবেষণা' : 'Google Search & Agri Research Grounding'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display mb-3">
              {lang === 'bn' ? 'বিশ্বস্ত কৃষি তথ্য গুগল অনুসন্ধান' : 'Agricultural Google Search System'}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {lang === 'bn' 
                ? 'সরাসরি গুগল অনুসন্ধান ও বাংলাদেশ সরকারের শীর্ষ কৃষি গবেষণা প্রতিষ্ঠান (BRRI, BARI, BARC, DAE, BAMIS, AIS)-এর আসল গবেষণা প্রবন্ধ, বালাই নির্দেশিকা ও প্রযুক্তি অনুসন্ধান করুন।' 
                : 'Directly search verified research papers, official extension guidelines, and technological protocols across authoritative agricultural institutions.'}
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mt-6 relative z-10">
            <div className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-lg border border-white/20">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'bn' ? 'কীটনাশক, সার, জাত বা রোগের নাম দিয়ে গুগল ও গবেষণায় খুঁজুন...' : 'Search crops, diseases, fertilizers, or research publications...'}
                  className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#087A35] hover:bg-[#064E2B] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>খোঁজা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'গুগল অনুসন্ধান' : 'Search'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Suggested Quick Search Tags */}
          <div className="mt-4 flex items-center gap-2 flex-wrap text-xs relative z-10">
            <span className="text-emerald-200/90 font-medium">জনপ্রিয় অনুসন্ধান:</span>
            {sampleQueries.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(item.query)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] transition-colors border border-white/15 cursor-pointer"
              >
                {item.labelBn}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Categories Chips */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>ফিল্টার:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                if (searchQuery.trim()) performSearch(searchQuery);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#087A35] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              {lang === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Results Container */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#087A35] mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              গুগল অনুসন্ধান ও বাংলাদেশ কৃষি গবেষণা ডেটাবেস যাচাই করা হচ্ছে...
            </p>
            <p className="text-xs text-slate-500">
              BRRI, BARI, DAE ও BAMIS অফিশিয়াল রেকর্ড ফিল্টারিং চলছে
            </p>
          </div>
        ) : searchResponse ? (
          <div className="space-y-8">
            
            {/* Search Meta Status Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  "{searchResponse.query}" অনুসন্ধানে {searchResponse.totalResults}টি ফলাফল পাওয়া গেছে
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#064E2B] dark:bg-emerald-950 dark:text-emerald-300">
                  {searchResponse.provider}
                </span>
              </div>

              {searchResponse.disclaimer && (
                <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{searchResponse.disclaimer}</span>
                </div>
              )}
            </div>

            {/* List of Google Search Results */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>যাচাইকৃত গুগল অনুসন্ধান ফলাফল (Verified Google Search Results)</span>
              </h2>

              <div className="grid gap-4">
                {searchResponse.results.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                          {res.sourceInstitution}
                        </span>
                        {res.isOfficialBangladeshGov && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                            ✓ সরকারি প্রাতিষ্ঠানিক উৎস (.gov.bd)
                          </span>
                        )}
                      </div>

                      {res.publishedDate && (
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{res.publishedDate}</span>
                        </span>
                      )}
                    </div>

                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-bold text-[#087A35] dark:text-emerald-400 hover:underline flex items-start justify-between gap-3 group"
                    >
                      <span>{res.title}</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 mt-1" />
                    </a>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {res.snippet}
                    </p>

                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 truncate max-w-sm">
                        {res.url}
                      </span>

                      <button
                        onClick={() => onAskAdvisory(res.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#087A35] hover:bg-[#064E2B] transition-colors cursor-pointer shrink-0"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AGRIMIND পূর্ণ পরামর্শ নিন</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Research References Section */}
            {searchResponse.researchReferences && searchResponse.researchReferences.length > 0 && (
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      তথ্যসূত্র ও গবেষণার ভিত্তি (Connected Research References)
                    </h3>
                    <p className="text-xs text-slate-500">
                      অনুসন্ধানের সাথে সংশ্লিষ্ট প্রাতিষ্ঠানিক কৃষি প্রকাশনা ও প্রটোকল
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {searchResponse.researchReferences.map((ref, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                    >
                      <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#064E2B] dark:bg-emerald-950 dark:text-emerald-300">
                            {idx + 1}. {ref.sourceType}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            সাল: {ref.publicationYear}
                          </span>
                        </div>

                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">গবেষণার শিরোনাম: </span>
                          <span>{ref.publicationTitle}</span>
                        </div>

                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">প্রকাশনা প্রতিষ্ঠান: </span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{ref.publishingInstitution}</span>
                        </div>

                        {ref.relevantSection && (
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">প্রাসঙ্গিক অধ্যায়: </span>
                            <span>{ref.relevantSection}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <a
                          href={ref.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#087A35] dark:text-emerald-400 hover:underline"
                        >
                          <span>মূল প্রকাশনা পড়ুন</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : null}

      </div>
    </div>
  );
};
