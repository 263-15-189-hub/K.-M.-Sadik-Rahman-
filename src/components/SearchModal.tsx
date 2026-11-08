import React, { useState } from 'react';
import { Search, X, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  lang,
  onClose,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const popularSearches = [
    'বোরো ধানে ইউরিয়া ও পটাশ সার দেওয়ার সঠিক সময়',
    'আলুর নাবী ধসা রোগ নিরাময় নির্দেশিকা',
    'লবণাক্ত জমিতে ব্রি ধান৬৭ চাষের প্রযুক্তি',
    'ধানের বাদামি গাছফড়িং (BPH) দমন কৌশল',
    'আমের মাছি পোকা ও ফ্রুট ড্রপ প্রতিরোধ'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    onSearch(searchTerm.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="mt-2">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'bn' ? 'যেকোনো ফসলের রোগ, পোকা বা সারের নাম লিখুন...' : 'Search any crop symptom, pest, or fertilizer...'}
              className="w-full text-sm pl-11 pr-24 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087A35]"
            />
            <button
              type="submit"
              disabled={!searchTerm.trim()}
              className="absolute right-2 top-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#087A35] hover:bg-[#064E2B] disabled:opacity-40 transition-colors"
            >
              অনুসন্ধান
            </button>
          </div>
        </form>

        <div className="mt-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            জনপ্রিয় কৃষি অনুসন্ধান:
          </span>
          <div className="space-y-1.5">
            {popularSearches.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSearch(item);
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between group cursor-pointer transition-colors"
              >
                <span className="line-clamp-1">{item}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#087A35] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
