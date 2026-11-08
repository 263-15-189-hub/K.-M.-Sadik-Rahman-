import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Printer, 
  ExternalLink, 
  PhoneCall, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Flag,
  FileCheck,
  ChevronDown,
  ChevronUp,
  MapPin,
  Lock,
  Info
} from 'lucide-react';
import { AdvisoryQuestion, Language, SafetyDecision } from '../types';

interface AdvisoryResultViewProps {
  question: AdvisoryQuestion;
  lang: Language;
  onSaveToggle: (id: string) => void;
  onFollowUpSubmit?: (additionalDetails: string) => void;
  onClose?: () => void;
}

export const AdvisoryResultView: React.FC<AdvisoryResultViewProps> = ({
  question,
  lang,
  onSaveToggle,
  onFollowUpSubmit,
  onClose
}) => {
  const [followUpText, setFollowUpText] = useState('');
  const [followUpSubmitted, setFollowUpSubmitted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [show10Stages, setShow10Stages] = useState(false);

  // Feedback Report State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [reportType, setReportType] = useState<'incorrect_advice' | 'harmful_recommendation' | 'outdated_info' | 'missing_info' | 'unsatisfactory'>('incorrect_advice');
  const [reportDescription, setReportDescription] = useState('');
  const [reportPhone, setReportPhone] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const resp = question.response;
  if (!resp) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}?q=${encodeURIComponent(question.query)}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim()) return;
    setFollowUpSubmitted(true);
    if (onFollowUpSubmit) {
      onFollowUpSubmit(followUpText.trim());
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription.trim()) return;
    setReportLoading(true);
    try {
      const res = await fetch('/api/feedback/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          querySummary: question.query,
          farmerName: question.userName || 'কৃষক সদস্য',
          farmerPhone: reportPhone,
          reportType,
          description: reportDescription
        })
      });
      if (res.ok) {
        setReportSubmitted(true);
        setTimeout(() => {
          setShowFeedbackModal(false);
          setReportSubmitted(false);
          setReportDescription('');
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  const getSafetyBadge = (status: SafetyDecision) => {
    switch (status) {
      case 'VERIFIED':
        return {
          label: lang === 'bn' ? 'যাচাইকৃত ও অনুমোদিত' : 'Verified & Approved',
          bg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300',
          icon: CheckCircle2
        };
      case 'HIGH_RISK_NEEDS_EXPERT':
        return {
          label: lang === 'bn' ? 'উচ্চ ঝুঁকি: বিশেষজ্ঞ পর্যালোচনাধীন' : 'High Risk: Needs Expert Review',
          bg: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300',
          icon: ShieldAlert
        };
      case 'INSUFFICIENT_EVIDENCE':
        return {
          label: lang === 'bn' ? 'পর্যাপ্ত তথ্যপ্রমাণ অনুপস্থিত' : 'Insufficient Evidence',
          bg: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300',
          icon: AlertTriangle
        };
      case 'CONFLICTING_EVIDENCE':
        return {
          label: lang === 'bn' ? 'সাংঘর্ষিক তথ্যপ্রমাণ প্রাপ্ত' : 'Conflicting Evidence',
          bg: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-300',
          icon: AlertTriangle
        };
      case 'NEEDS_MORE_INFO':
      default:
        return {
          label: lang === 'bn' ? 'মাঠ তথ্যের স্পষ্টীকরণ প্রয়োজন' : 'Needs More Information',
          bg: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300',
          icon: Info
        };
    }
  };

  const badge = getSafetyBadge(resp.safetyStatus);
  const BadgeIcon = badge.icon;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 transition-colors">
      
      {/* Top Header Bar */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-white dark:from-emerald-950/60 dark:via-slate-900 dark:to-slate-900 border-b border-emerald-100 dark:border-emerald-900/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#087A35] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#087A35] dark:text-emerald-400">
                  {lang === 'bn' ? 'কৃষি সেফটি ও ভেরিফিকেশন ইঞ্জিন' : 'Agricultural Safety & Verification Engine'}
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                  <BadgeIcon className="w-3.5 h-3.5" />
                  <span>{badge.label}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {new Date(question.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })} · {resp.searchProviderUsed || 'BRRI / DAE Grounded'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveToggle(question.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                question.saved
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              {question.saved ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সংরক্ষিত' : 'Saved'}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সংরক্ষণ' : 'Save'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
              title="Report an issue with this answer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ত্রুটি রিপোর্ট' : 'Report Error'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Research Status Disclosure */}
        {resp.liveResearchDisclosed && (
          <div className="mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{resp.liveResearchDisclosed}</span>
          </div>
        )}

        {/* Farmer's original question */}
        <div className="mt-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-emerald-200/60 dark:border-emerald-900/40">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            {lang === 'bn' ? 'কৃষকের প্রশ্ন / মাঠ সমস্যা:' : "Farmer's Query:"}
          </span>
          <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 italic">
            "{question.query}"
          </p>
        </div>

        {/* Safety Engine 10-Stage Audit Accordion Toggle */}
        <div className="mt-4">
          <button
            onClick={() => setShow10Stages(!show10Stages)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#087A35] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নিরাপত্তা ইঞ্জিনের ১০-ধাপের যাচাইকরণ রিপোর্ট দেখুন' : 'View 10-Stage Safety Audit Details'}</span>
            {show10Stages ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {show10Stages && resp.verificationStages && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                ১০-ধাপ বিশিষ্ট কৃষি নিরাপত্তা যাচাই অডিট (10-Stage Safety Verification):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {resp.verificationStages.map((stg) => (
                  <div key={stg.stageNumber} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {stg.stageNumber}. {stg.stageNameBn}:
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        {stg.summary}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      stg.status === 'passed' ? 'bg-emerald-100 text-emerald-800' :
                      stg.status === 'blocked' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {stg.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Structured Answer Sections (1 through 8) */}
      <div className="p-6 sm:p-8 space-y-8">

        {/* 1. সমস্যার সংক্ষিপ্ত বিবরণ */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono">
              ১
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'bn' ? 'সমস্যার সংক্ষিপ্ত বিবরণ' : 'Problem Summary'}
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            {resp.summary}
          </p>
        </div>

        {/* 2. সম্ভাব্য কারণ */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono">
              ২
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'bn' ? 'সম্ভাব্য কারণ ও লক্ষণ বিশ্লেষণ' : 'Possible Causes'}
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {resp.possibleCauses.map((item, idx) => {
              const badgeColors = {
                high: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
                medium: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
                low: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
              }[item.confidence];

              const confidenceLabel = {
                high: lang === 'bn' ? 'উচ্চ সম্ভাবনা (High)' : 'High Confidence',
                medium: lang === 'bn' ? 'মাঝারি সম্ভাবনা (Medium)' : 'Medium Confidence',
                low: lang === 'bn' ? 'কম সম্ভাবনা (Low)' : 'Low Confidence',
              }[item.confidence];

              return (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.cause}
                    </h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColors} shrink-0`}>
                      {confidenceLabel}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                  {item.evidenceNotes && (
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-2 font-medium">
                      ✓ প্রমাণ: {item.evidenceNotes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. কোন তথ্যগুলো যাচাই করা হয়েছে */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono">
              ৩
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'bn' ? 'কোন তথ্যগুলো যাচাই করা হয়েছে' : 'Verified Field Factors'}
            </h3>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
            <ul className="space-y-1.5">
              {resp.verifiedFactors.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. তথ্যসূত্র ও গবেষণার ভিত্তি (Sources & Research References) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono">
              ৪
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'bn' ? 'তথ্যসূত্র ও গবেষণার ভিত্তি' : 'Sources & Research References'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'bn' 
                  ? 'উত্তরের সমর্থনে আসল কৃষি প্রকাশনা, অফিশিয়াল নির্দেশিকা ও গবেষণাপত্রের প্রাতিষ্ঠানিক উদ্ধৃতি' 
                  : 'Official publication citations and verifiable research guidelines supporting this advice'}
              </p>
            </div>
          </div>

          {resp.hasReliableReferences && resp.sources && resp.sources.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {resp.sources.map((src, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-emerald-50/30 dark:hover:bg-slate-800/90 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#064E2B] dark:bg-emerald-950 dark:text-emerald-300">
                        {idx + 1}. {src.sourceType}
                      </span>
                      {src.isOutdated && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                          ⚠️ ৫ বছরের পুরাতন
                        </span>
                      )}
                    </div>

                    <div className="text-xs space-y-1 pt-1 text-slate-700 dark:text-slate-300">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">১. গবেষণার শিরোনাম: </span>
                        <span>{src.publicationTitle}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">২. প্রকাশনা প্রতিষ্ঠান: </span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{src.publishingInstitution}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">৩. প্রকাশের সাল: </span>
                        <span className="font-mono">{src.publicationYear}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">৪. তথ্যের ধরন: </span>
                        <span>{src.sourceType}</span>
                      </div>
                      {src.relevantSection && (
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">৫. প্রাসঙ্গিক অধ্যায়/পৃষ্ঠা: </span>
                          <span className="text-slate-600 dark:text-slate-400">{src.relevantSection}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                      ৬. মূল উৎস:
                    </span>
                    <a
                      href={src.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#087A35] dark:text-emerald-400 hover:underline"
                    >
                      <span>অফিশিয়াল ওয়েবসাইট</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>এই উত্তরের জন্য পর্যাপ্ত নির্ভরযোগ্য তথ্যসূত্র পাওয়া যায়নি।</span>
            </div>
          )}
        </div>

        {/* 5. যাচাই করা তথ্যের ভিত্তিতে পরামর্শ (Actionable Recommendations or Blocked Banner) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400 font-bold text-xs flex items-center justify-center font-mono">
              ৫
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'bn' ? 'যাচাই করা তথ্যের ভিত্তিতে পরামর্শ' : 'Evidence-Based Recommendations'}
            </h3>
          </div>

          {/* IF ACTIONABLE CHEMICAL ADVICE IS BLOCKED BY SAFETY ENGINE */}
          {resp.isActionableBlocked ? (
            <div className="p-6 rounded-2xl border-2 border-rose-300 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 space-y-3">
              <div className="flex items-center gap-3 text-rose-800 dark:text-rose-200">
                <Lock className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">
                    নিরাপত্তা কারণে রাসায়নিক/নির্দিষ্ট মাত্রা প্রয়োগ সাময়িক স্থগিত রাখা হয়েছে
                  </h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                    {resp.blockedActionReason || 'অস্পষ্ট বা অতি ঝুঁকিপূর্ণ লক্ষণ চিহ্নিত হওয়ায় কৃষকের আর্থিক ও শস্যের ক্ষতি রোধে সেফটি ইঞ্জিন এই সতর্কতা জারি করেছে।'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                <p className="font-semibold text-slate-900 dark:text-white">
                  করণীয় প্রাথমিক পদক্ষেপ:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>কোনো ওষুধ বা রাসায়নিক নিজে নিজে বা দোকানদারের কথায় স্প্রে করবেন না।</li>
                  <li>আক্রান্ত ফসলের চারা বা পাতার নমুনা পলিথিনে নিয়ে সরাসরি উপজেলা কৃষি অফিসে দেখান।</li>
                  <li>জরুরি পরামর্শে এখনই সরকারি টোল-ফ্রি হেল্পলাইন ১৬১২৩-এ ডায়াল করুন।</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {resp.recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h4 className="font-bold text-sm sm:text-base text-[#087A35] dark:text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{rec.action}</span>
                    </h4>
                    {rec.timing && (
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {rec.timing}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-2">
                    {rec.steps.map((step, sIdx) => (
                      <li key={sIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. সম্ভাব্য ঝুঁকি ও সতর্কতা */}
        <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 font-bold text-xs flex items-center justify-center font-mono">
              ৬
            </span>
            <h3 className="text-base font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{lang === 'bn' ? 'সম্ভাব্য ঝুঁকি ও সতর্কতা' : 'Risks & Precautions'}</span>
            </h3>
          </div>

          <ul className="space-y-2">
            {resp.precautions.map((item, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 7. কোন বিষয়গুলো এখনো নিশ্চিত নয় */}
        <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold text-xs flex items-center justify-center font-mono">
              ৭
            </span>
            <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
              {lang === 'bn' ? 'কোন বিষয়গুলো এখনো নিশ্চিত নয় (Uncertainties)' : 'Uncertainties'}
            </h3>
          </div>

          <ul className="space-y-2">
            {resp.uncertainties.map((item, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-amber-900 dark:text-amber-300 flex items-start gap-2">
                <span className="font-bold text-amber-600">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Interactive Clarification Follow-up Field */}
          {!followUpSubmitted ? (
            <form onSubmit={handleFollowUp} className="mt-4 pt-3 border-t border-amber-200/80 dark:border-amber-900/40 flex gap-2">
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                placeholder={lang === 'bn' ? 'অনিশ্চিত তথ্যের উত্তর বা মাঠের অতিরিক্ত বিবরণ লিখুন...' : 'Add clarification to help verify...'}
                className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087A35]"
              />
              <button
                type="submit"
                disabled={!followUpText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#087A35] hover:bg-[#064E2B] disabled:opacity-50 transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'যাচাইয়ে পাঠান' : 'Verify'}</span>
              </button>
            </form>
          ) : (
            <div className="mt-3 p-3 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? 'অতিরিক্ত তথ্য সংযুক্ত হয়েছে। ধন্যবাদ!' : 'Additional details submitted.'}</span>
            </div>
          )}
        </div>

        {/* 8. প্রয়োজনে স্থানীয় কৃষি কর্মকর্তার সঙ্গে যোগাযোগের নির্দেশনা (Mandatory Referral System) */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-[#064E2B] to-slate-900 text-white space-y-4 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center font-mono">
              ৮
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>{lang === 'bn' ? 'স্থানীয় কৃষি কর্মকর্তার সঙ্গে সরাসরি যোগাযোগ নির্দেশনা' : 'Local Agricultural Officer Referral'}</span>
            </h3>
          </div>

          {/* Mandatory Bangla Referral Message */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-emerald-50 leading-relaxed font-medium">
            "{resp.localReferral.mandatoryBanglaMessage}"
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-white/10 border border-white/15">
              <span className="text-[10px] text-emerald-200 block mb-0.5">নিকটস্থ মাঠ কর্মকর্তা:</span>
              <p className="font-bold text-white">{resp.localReferral.saaoOffice}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/15">
              <span className="text-[10px] text-emerald-200 block mb-0.5">উপজেলা কৃষি অফিস:</span>
              <p className="font-bold text-white">{resp.localReferral.upazilaOffice}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/15">
              <span className="text-[10px] text-emerald-200 block mb-0.5">টোল-ফ্রি জাতীয় কৃষি হেল্পলাইন:</span>
              <a href="tel:16123" className="font-extrabold text-amber-300 text-sm flex items-center gap-1.5 hover:underline">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>১৬১২৩ (সকাল ৯টা-বিকাল ৫টা)</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* FEEDBACK & ERROR REPORTING MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  কৃষি ত্রুটি বা ক্ষতিকর পরামর্শ রিপোর্ট করুন
                </h3>
              </div>
              <button 
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-8 text-center text-emerald-600">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                <p className="font-bold text-sm">আপনার রিপোর্টটি সফলভাবে গ্রহণ করা হয়েছে।</p>
                <p className="text-xs text-slate-500 mt-1">কৃষি বিশেষজ্ঞ ও অ্যাডমিন প্যানেল বিষয়টি তদন্ত করবে।</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3 mt-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    রিপোর্টের ধরন:
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="incorrect_advice">ভুল বা অসম্পূর্ণ তথ্য (Incorrect Advice)</option>
                    <option value="harmful_recommendation">সম্ভাব্য ক্ষতিকর সুপারিশ (Potentially Harmful)</option>
                    <option value="outdated_info">পুরাতন বা অপ্রচলিত তথ্য (Outdated Information)</option>
                    <option value="missing_info">জরুরি তথ্য বাদ পড়েছে (Missing Information)</option>
                    <option value="unsatisfactory">অসন্তোষজনক উত্তর (Unsatisfactory)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    কী সমস্যা হয়েছে বিস্তারিত বর্ণনা করুন:
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    rows={3}
                    required
                    placeholder="যেমন: এই কীটনাশকের ডোজ বেশি দেওয়া হয়েছে অথবা মাটির ধরন অনুযায়ী ভিন্ন হওয়া উচিত ছিল..."
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    আপনার মোবাইল নম্বর (ঐচ্ছিক, যোগাযোগের জন্য):
                  </label>
                  <input
                    type="tel"
                    value={reportPhone}
                    onChange={(e) => setReportPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={reportLoading || !reportDescription.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                  >
                    {reportLoading ? 'জমা হচ্ছে...' : 'রিপোর্ট জমা দিন'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
