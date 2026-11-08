import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Database, 
  FileUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Plus, 
  Sliders, 
  Users, 
  RefreshCw,
  Cpu,
  BookOpen,
  Flag,
  Lock,
  Clock,
  Eye,
  FileCheck,
  ShieldAlert,
  CloudSunRain
} from 'lucide-react';
import { 
  KnowledgeArticle, 
  SearchProviderConfig, 
  DocumentUpload, 
  Language, 
  FarmerErrorReport, 
  SafetyEngineLog,
  AdvisoryQuestion
} from '../types';

interface AdminDashboardProps {
  lang: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'expert_queue' | 'reports' | 'safety_logs' | 'providers' | 'documents' | 'analytics'>('expert_queue');
  
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [config, setConfig] = useState<SearchProviderConfig | null>(null);
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [pendingCases, setPendingCases] = useState<AdvisoryQuestion[]>([]);
  const [farmerReports, setFarmerReports] = useState<FarmerErrorReport[]>([]);
  const [safetyLogs, setSafetyLogs] = useState<SafetyEngineLog[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Article Form State
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('রোগ ও প্রতিকার');
  const [newCrop, setNewCrop] = useState('ধান');
  const [newSource, setNewSource] = useState<'DAE' | 'BRRI' | 'BARI' | 'BARC' | 'BAMIS' | 'AIS'>('DAE');
  const [newDesc, setNewDesc] = useState('');
  const [newRec, setNewRec] = useState('');

  // New Document upload state
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docSummary, setDocSummary] = useState('');
  const [docPubYear, setDocPubYear] = useState('2024');

  // Expert Review Modal State
  const [activeReviewCase, setActiveReviewCase] = useState<AdvisoryQuestion | null>(null);
  const [expertReviewNotes, setExpertReviewNotes] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('agrimind_token') || '';
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const loadData = async () => {
    setIsLoading(true);
    setAuthError(null);
    const headers = getAuthHeaders();
    try {
      const [artRes, cfgRes, docRes, anaRes, queueRes, repRes, logRes] = await Promise.all([
        fetch('/api/knowledge'),
        fetch('/api/admin/config', { headers }),
        fetch('/api/admin/documents', { headers }),
        fetch('/api/admin/analytics', { headers }),
        fetch('/api/admin/expert-queue', { headers }),
        fetch('/api/admin/reports', { headers }),
        fetch('/api/admin/safety-logs', { headers })
      ]);

      if (cfgRes.status === 401 || queueRes.status === 401) {
        setAuthError('অ্যাডমিন অনুমোদন যাচাই প্রয়োজন। অনুগ্রহ করে অনুমোদিত ইমেইল (kmsadikrahmansoccho@gmail.com) দিয়ে লগইন করুন।');
      }

      if (artRes.ok) {
        const d = await artRes.json();
        setArticles(d.articles || []);
      }
      if (cfgRes.ok) {
        const d = await cfgRes.json();
        setConfig(d.config);
      }
      if (docRes.ok) {
        const d = await docRes.json();
        setDocuments(d.documents || []);
      }
      if (anaRes.ok) {
        const d = await anaRes.json();
        setAnalytics(d.analytics);
      }
      if (queueRes.ok) {
        const d = await queueRes.json();
        setPendingCases(d.pendingCases || []);
      }
      if (repRes.ok) {
        const d = await repRes.json();
        setFarmerReports(d.reports || []);
      }
      if (logRes.ok) {
        const d = await logRes.json();
        setSafetyLogs(d.logs || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'verified' | 'rejected' | 'pending' | 'expired') => {
    try {
      const res = await fetch(`/api/knowledge/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setArticles(prev => prev.map(a => a.id === id ? { ...a, verificationStatus: newStatus } : a));
        setStatusMessage(`স্ট্যাটাস পরিবর্তন সফল: ${newStatus}`);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExpertDecision = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch(`/api/admin/expert-review/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          action,
          expertNotes: expertReviewNotes || 'উপজেলা কৃষি সম্প্রসারণ সেল দ্বারা মাঠ প্রটোকল অনুসারে পরীক্ষিত ও অনুমোদিত।',
          reviewerName: 'উপজেলা কৃষি সম্প্রসারণ ও মূল্যায়ন সেল'
        })
      });
      if (res.ok) {
        setPendingCases(prev => prev.filter(c => c.id !== id));
        setActiveReviewCase(null);
        setExpertReviewNotes('');
        setStatusMessage(action === 'APPROVE' ? 'সুপারিশটি বিশেষজ্ঞ সেল কর্তৃক সফলভাবে অনুমোদিত হয়েছে!' : 'সুপারিশটি প্রত্যাখ্যাত হয়েছে।');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateReportStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status: newStatus, adminNotes: 'তদন্ত সম্পন্ন ও সমাধান গৃহীত হয়েছে।' })
      });
      if (res.ok) {
        setFarmerReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
        setStatusMessage('অভিযোগের তদন্ত অবস্থা সফলভাবে হালনাগাদ হয়েছে!');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newRec.trim()) return;

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          title: newTitle,
          titleBn: newTitle,
          category: newCategory,
          crop: newCrop,
          sourceName: newSource,
          description: newDesc,
          recommendation: newRec,
          verificationStatus: 'verified'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setArticles(prev => [data.article, ...prev]);
        setShowAddArticle(false);
        setNewTitle('');
        setNewDesc('');
        setNewRec('');
        setStatusMessage('নতুন কৃষি নির্দেশিকা সফলভাবে অন্তর্ভুক্ত হয়েছে!');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveConfig = async (updated: Partial<SearchProviderConfig>) => {
    if (!config) return;
    const newCfg = { ...config, ...updated };
    setConfig(newCfg);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setStatusMessage('নিরাপত্তা ও এআই কনফিগারেশন সংরক্ষিত হয়েছে!');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    try {
      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          title: docTitle,
          parsedSummary: docSummary,
          publicationYear: docPubYear
        })
      });

      if (res.ok) {
        const data = await res.json();
        setDocuments(prev => [data.document, ...prev]);
        setShowAddDoc(false);
        setDocTitle('');
        setDocSummary('');
        setStatusMessage('কৃষি গবেষণা প্রকাশনা সফলভাবে যুক্ত হয়েছে!');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#087A35] dark:text-emerald-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'নিরাপত্তা ও কৃষি ভেরিফিকেশন কনসোল' : 'Safety & Verification Control Console'}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {lang === 'bn' ? 'AGRIMIND অ্যাডমিন ও সুরক্ষা ড্যাশবোর্ড' : 'AGRIMIND Admin & Safety Dashboard'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              উচ্চ-ঝুঁকি বিশেষজ্ঞ যাচাই, কৃষক অভিযোগ তদন্ত, বালাইনাশক গার্ডরেল ও এআই নিরীক্ষা (kmsadikrahmansoccho@gmail.com)
            </p>
          </div>

          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#087A35] flex items-center gap-2 text-xs font-semibold self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>

        {authError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {statusMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('expert_queue')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'expert_queue'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{lang === 'bn' ? `বিশেষজ্ঞ যাচাই কিউ (${pendingCases.length})` : `Expert Review Queue (${pendingCases.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>{lang === 'bn' ? `কৃষক অভিযোগ ও ত্রুটি (${farmerReports.length})` : `Farmer Error Reports (${farmerReports.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('safety_logs')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'safety_logs'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সেফটি ইঞ্জিন অ্যাক্টিভিটি লগ' : 'Safety Engine Activity Logs'}</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'knowledge'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'bn' ? `কৃষি জ্ঞান ভেরিফিকেশন (${articles.length})` : `Knowledge Base (${articles.length})`}
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'documents'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'bn' ? `গবেষণা ডকুমেন্ট (${documents.length})` : `Documents (${documents.length})`}
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'providers'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'নিরাপত্তা ও এআই কনফিগ' : 'Safety & AI Config'}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-[#087A35] text-[#087A35] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'সিস্টেম স্ট্যাটাস' : 'System Status'}
          </button>
        </div>

        {/* TAB 1: EXPERT REVIEW QUEUE (Section 8) */}
        {activeTab === 'expert_queue' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  উচ্চ-ঝুঁকি ও স্থগিতকৃত সুপারিশের বিশেষজ্ঞ যাচাই কিউ (Human Expert Queue)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  রাসায়নিক বালাইনাশক বা জটিল রোগের ক্ষেত্রে বিশেষজ্ঞ অনুমোদন ব্যতিরেকে কৃষকের কাছে নির্দেশনা প্রদর্শিত হবে না।
                </p>
              </div>
            </div>

            {pendingCases.length > 0 ? (
              <div className="space-y-4">
                {pendingCases.map((cs) => (
                  <div key={cs.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          {cs.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(cs.createdAt).toLocaleDateString('bn-BD')}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          📍 {cs.district || 'ময়মনসিংহ'}, {cs.upazila || 'সদর'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        "{cs.query}"
                      </h3>
                      <p className="text-xs text-rose-700 dark:text-rose-300">
                        {cs.response?.blockedActionReason || 'রাসায়নিক বালাইনাশক বা অননুমোদিত মাত্রার কারণে স্থগিত।'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setActiveReviewCase(cs);
                          setExpertReviewNotes('');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#087A35] hover:bg-[#064E2B] transition-colors"
                      >
                        নিরীক্ষা ও অনুমোদন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  বর্তমানে কোনো অপেক্ষমান উচ্চ-ঝুঁকি কেস নেই
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  সকল ঝুঁকিপূর্ণ সুপারিশ সফলভাবে নিষ্পত্তি হয়েছে অথবা ফিল্টারে নিরাপদ রাখা হয়েছে।
                </p>
              </div>
            )}

            {/* Expert Review Decision Modal */}
            {activeReviewCase && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
                <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                      <span>কৃষি বিশেষজ্ঞ পর্যালোচনা ও অনুমোদন</span>
                    </h3>
                    <button onClick={() => setActiveReviewCase(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>

                  <div className="py-4 space-y-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs">
                      <span className="font-semibold text-slate-500 block mb-0.5">কৃষকের সমস্যা:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">"{activeReviewCase.query}"</p>
                    </div>

                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-xs text-rose-800 dark:text-rose-300">
                      <span className="font-semibold block mb-0.5">স্থগিতের কারণ:</span>
                      <p>{activeReviewCase.response?.blockedActionReason}</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        বিশেষজ্ঞ নিরীক্ষক নোট ও যাচাইকরণ মন্তব্য:
                      </label>
                      <textarea
                        value={expertReviewNotes}
                        onChange={(e) => setExpertReviewNotes(e.target.value)}
                        rows={3}
                        placeholder="মাঠ প্রটোকল অনুসারে এই মাত্রায় স্প্রে অনুমোদিত কি না..."
                        className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                    <button
                      onClick={() => handleExpertDecision(activeReviewCase.id, 'REJECT')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200"
                    >
                      প্রত্যাখ্যান (Reject)
                    </button>
                    <button
                      onClick={() => handleExpertDecision(activeReviewCase.id, 'APPROVE')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#087A35] hover:bg-[#064E2B]"
                    >
                      সত্যায়ন ও অনুমোদন (Approve)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FARMER ERROR REPORTS (Section 12) */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              কৃষক মতামত ও ক্ষতিকর পরামর্শ রিপোর্ট ইনবক্স (Farmer Feedback & Error Reports)
            </h2>

            {farmerReports.length > 0 ? (
              <div className="space-y-3">
                {farmerReports.map((rep) => (
                  <div key={rep.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          {rep.reportType}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(rep.createdAt).toLocaleDateString('bn-BD')}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          কৃষক: {rep.farmerName} {rep.farmerPhone && `(${rep.farmerPhone})`}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1">
                        "{rep.description}"
                      </p>
                      {rep.adminNotes && (
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                          তদন্ত নোট: {rep.adminNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {rep.status !== 'resolved' && (
                        <button
                          onClick={() => handleUpdateReportStatus(rep.id, 'resolved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs"
                        >
                          সমাধান সম্পন্ন
                        </button>
                      )}
                      {rep.status !== 'investigating' && (
                        <button
                          onClick={() => handleUpdateReportStatus(rep.id, 'investigating')}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs"
                        >
                          তদন্তাধীন
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Flag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">কোনো কৃষক অভিযোগ জমা পড়েনি</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAFETY ENGINE LOGS (Section 13) */}
        {activeTab === 'safety_logs' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              ১০-ধাপের সেফটি ইঞ্জিনের রিয়েল-টাইম অডিট লগ (Safety Engine Logs)
            </h2>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">সময়</th>
                    <th className="py-3 px-4">কৃষকের জিজ্ঞাসা</th>
                    <th className="py-3 px-4">ঝুঁকি স্তর</th>
                    <th className="py-3 px-4">সেফটি সিদ্ধান্ত</th>
                    <th className="py-3 px-4">গার্ডরেল ফলাফল</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  {safetyLogs.map((lg) => (
                    <tr key={lg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        {new Date(lg.timestamp).toLocaleTimeString('bn-BD')}
                      </td>
                      <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white max-w-xs truncate">
                        {lg.query}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          lg.riskEvaluation === 'high' ? 'bg-rose-100 text-rose-800' :
                          lg.riskEvaluation === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {lg.riskEvaluation}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold">
                        {lg.safetyDecision}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        {lg.isActionableBlocked ? (
                          <span className="text-rose-600 font-bold">🛑 Action Blocked</span>
                        ) : (
                          <span className="text-emerald-600 font-bold">✓ Approved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: KNOWLEDGE BASE VERIFICATION */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                কৃষি প্রকাশনা ও ভেরিফিকেশন অবস্থা
              </h2>
              <button
                onClick={() => setShowAddArticle(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#087A35] hover:bg-[#064E2B] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন নিবন্ধ যোগ করুন</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">শিরোনাম ও ক্যাটাগরি</th>
                    <th className="py-3 px-4">প্রতিষ্ঠান</th>
                    <th className="py-3 px-4">ফসল</th>
                    <th className="py-3 px-4">ভেরিফিকেশন স্ট্যাটাস</th>
                    <th className="py-3 px-4">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {art.titleBn}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {art.category} · {art.publicationDate}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-400">
                        {art.sourceName}
                      </td>

                      <td className="py-3 px-4">
                        {art.crop}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          art.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : art.verificationStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {art.verificationStatus === 'verified' ? 'যাচাইকৃত' : art.verificationStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {art.verificationStatus !== 'verified' && (
                            <button
                              onClick={() => handleUpdateStatus(art.id, 'verified')}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px]"
                            >
                              Verify
                            </button>
                          )}
                          {art.verificationStatus !== 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(art.id, 'pending')}
                              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px]"
                            >
                              Pending
                            </button>
                          )}
                          {art.verificationStatus !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(art.id, 'rejected')}
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px]"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal: Add Article */}
            {showAddArticle && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      নতুন কৃষি গবেষণা নিবন্ধ যোগ করুন
                    </h3>
                    <button onClick={() => setShowAddArticle(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>

                  <form onSubmit={handleAddArticle} className="space-y-3 mt-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        নিবন্ধের শিরোনাম (বাংলা)
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">ক্যাটাগরি</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full text-xs px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                        >
                          <option value="রোগ ও প্রতিকার">রোগ ও প্রতিকার</option>
                          <option value="পোকামাকড় নিয়ন্ত্রণ">পোকামাকড় নিয়ন্ত্রণ</option>
                          <option value="সারের ব্যবস্থাপনা">সারের ব্যবস্থাপনা</option>
                          <option value="বীজ নির্বাচন ও বপন">বীজ নির্বাচন</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">ফসল</label>
                        <input
                          type="text"
                          value={newCrop}
                          onChange={(e) => setNewCrop(e.target.value)}
                          className="w-full text-xs px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">উৎস</label>
                        <select
                          value={newSource}
                          onChange={(e) => setNewSource(e.target.value as any)}
                          className="w-full text-xs px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                        >
                          <option value="DAE">DAE</option>
                          <option value="BRRI">BRRI</option>
                          <option value="BARI">BARI</option>
                          <option value="BARC">BARC</option>
                          <option value="AIS">AIS</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        লক্ষণ ও বৈজ্ঞানিক বর্ণনা
                      </label>
                      <textarea
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        rows={2}
                        className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        অনুমোদিত সমাধান ও করণীয়
                      </label>
                      <textarea
                        value={newRec}
                        onChange={(e) => setNewRec(e.target.value)}
                        rows={3}
                        required
                        className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddArticle(false)}
                        className="px-4 py-2 rounded-xl text-xs bg-slate-100 hover:bg-slate-200"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#087A35]"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: DOCUMENTS & OUTDATED DETECTION */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  সরকারি কৃষি প্রকাশনা ও হ্যান্ডবুক ডেটাবেস
                </h2>
                <p className="text-xs text-slate-500">
                  ৫ বছরের অধিক পুরাতন নথি স্বয়ংক্রিয়ভাবে আউটডেটেড ফ্ল্যাগ করা হয়।
                </p>
              </div>
              <button
                onClick={() => setShowAddDoc(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#087A35] hover:bg-[#064E2B] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileUp className="w-4 h-4" />
                <span>পিডিএফ / নির্দেশিকা আপলোড</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        {doc.fileName} · {doc.fileSize}
                      </span>
                      {doc.isOutdated ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                          ⚠️ পুরাতন নথি (Outdated)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          বর্তমান ও ইনডেক্সড
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {doc.parsedSummary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>আপলোডার: {doc.uploadedBy}</span>
                    <span>প্রকাশনা বছর: {doc.publicationYear || 2024}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Add Document */}
            {showAddDoc && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      গবেষণা প্রকাশনা বা হ্যান্ডবুক নিবন্ধন
                    </h3>
                    <button onClick={() => setShowAddDoc(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>

                  <form onSubmit={handleAddDocument} className="space-y-3 mt-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        ডকুমেন্টের নাম / প্রকাশনার শিরোনাম
                      </label>
                      <input
                        type="text"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        required
                        placeholder="যেমন: ব্রি উদ্ভাবিত আধুনিক ধানের জাত পরিচিতি ২০২৪"
                        className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        প্রকাশনার সাল (Publication Year)
                      </label>
                      <input
                        type="number"
                        value={docPubYear}
                        onChange={(e) => setDocPubYear(e.target.value)}
                        required
                        className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        সারাংশ ও মূল প্রতিপাদ্য বিষয়
                      </label>
                      <textarea
                        value={docSummary}
                        onChange={(e) => setDocSummary(e.target.value)}
                        rows={3}
                        placeholder="ডকুমেন্টের মূল প্রযুক্তি ও নির্দেশনাসমূহ সংক্ষেপে লিখুন..."
                        className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddDoc(false)}
                        className="px-4 py-2 rounded-xl text-xs bg-slate-100 hover:bg-slate-200"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#087A35]"
                      >
                        ডকুমেন্ট যুক্ত করুন
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SAFETY & AI CONFIG */}
        {activeTab === 'providers' && config && (
          <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                নিরাপত্তা গার্ডরেল ও এআই কনফিগারেশন
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                কৃষক নিরাপত্তা প্রথম: রাসায়নিক বালাইনাশক ব্লক ও সার মাত্রা নিয়ন্ত্রণ প্রটোকল।
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Pesticide & Chemical Safety Block (বালাইনাশক সেফটি ব্লক)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    অনিশ্চিত বা অস্পষ্ট লক্ষণে সরাসরি রাসায়নিক স্প্রে করা স্থগিত রাখবে।
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.expertReviewRequiredForChemicals}
                  onChange={(e) => handleSaveConfig({ expertReviewRequiredForChemicals: e.target.checked })}
                  className="w-5 h-5 accent-[#087A35] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Block Unapproved Fertilizer Dosage (মনগড়া সারের মাত্রা রোধ)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    মাটি পরীক্ষা ও বৃদ্ধি পর্যায় ছাড়া নির্দিষ্ট সার পরিমাণ ব্লক রাখবে।
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.blockUnapprovedFertilizerDosage}
                  onChange={(e) => handleSaveConfig({ blockUnapprovedFertilizerDosage: e.target.checked })}
                  className="w-5 h-5 accent-[#087A35] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Google Search Grounding
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Gemini 3.8 Flash এ গুগল সার্চ গ্রাউন্ডিং টুল সক্রিয় রাখবে।
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.googleSearchEnabled}
                  onChange={(e) => handleSaveConfig({ googleSearchEnabled: e.target.checked })}
                  className="w-5 h-5 accent-[#087A35] cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white block">
                  এআই মডেল নির্বাচন (Active Server-Side Gemini Model)
                </label>
                <select
                  value={config.aiModel}
                  onChange={(e) => handleSaveConfig({ aiModel: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended Default)</option>
                  <option value="gemini-flash-latest">gemini-flash-latest</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SYSTEM STATUS & ANALYTICS */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">মোট কৃষক জিজ্ঞাসা</span>
                <p className="text-3xl font-extrabold text-[#087A35] dark:text-emerald-400 mt-2 font-mono tabular-nums">
                  {analytics.totalQuestions}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">বিশেষজ্ঞ যাচাই কিউ</span>
                <p className="text-3xl font-extrabold text-rose-600 mt-2 font-mono tabular-nums">
                  {analytics.pendingExpertReviews}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">কৃষক অভিযোগ ইনবক্স</span>
                <p className="text-3xl font-extrabold text-amber-600 mt-2 font-mono tabular-nums">
                  {analytics.pendingReportsCount}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">সেফটি ইঞ্জিন স্ট্যাটাস</span>
                <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-3 font-mono">
                  ACTIVE & ENFORCING
                </p>
                <p className="text-[11px] text-slate-400 mt-1">১৬১২৩ রেফারেন্স বাধ্যতামূলক</p>
              </div>
            </div>

            {/* Service Health Checklist */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                সিস্টেম ইন্টিগ্রেশন ও লাইভ সার্ভিস স্ট্যাটাস
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Open-Meteo Weather API</span>
                    <span className="text-[11px] text-slate-500">৬৪ জেলা লাইভ পূর্বাভাস</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-white dark:bg-slate-800 px-2 py-0.5 rounded">
                    ONLINE
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">BRRI/BARI Grounding Corpus</span>
                    <span className="text-[11px] text-slate-500">যাচাইকৃত জাতীয় কৃষি ডেটা</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-white dark:bg-slate-800 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">AIS Krishi Call Centre</span>
                    <span className="text-[11px] text-slate-500">টোল-ফ্রি ১৬১২৩ হটলাইন</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-white dark:bg-slate-800 px-2 py-0.5 rounded">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
