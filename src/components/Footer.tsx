import React from 'react';
import { 
  Sprout, 
  PhoneCall, 
  ShieldCheck, 
  Mail, 
  ExternalLink,
  MapPin,
  Heart
} from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      
      {/* Top Banner: Krishi Helpline 16123 */}
      <div className="bg-[#064E2B] text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#064E2B] flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                {lang === 'bn' ? 'জাতীয় কৃষি হেল্পলাইন (টোল-ফ্রি)' : 'National Agriculture Helpline'}
              </p>
              <p className="text-base font-extrabold text-white">
                ১৬১২৩ · Krishi Call Centre (DAE / AIS)
              </p>
            </div>
          </div>
          <p className="text-xs text-emerald-100 max-w-md">
            সরাসরি সরকারি কৃষি কর্মকর্তার সাথে সকাল ৯টা থেকে বিকাল ৫টা পর্যন্ত কথা বলতে ডায়াল করুন।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#087A35] flex items-center justify-center text-white font-bold">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-display">
                AGRIMIND
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Better Agricultural Decisions Through Verified Knowledge.
              <br />
              বাংলাদেশের কৃষকদের জন্য নির্ভরযোগ্য গবেষণা, তাৎক্ষণিক লক্ষণ বিশ্লেষণ ও বৈজ্ঞানিক বালাই ব্যবস্থাপনা সহায়তা ব্যবস্থা।
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>BRRI, BARI, DAE, BARC ও BAMIS সমন্বিত ডেটাবেস</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>খামারবাড়ি, ফার্মগেট, ঢাকা-১২১৫, বাংলাদেশ</span>
              </p>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              সেবাসমূহ
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('crops')} className="hover:text-emerald-400 transition-colors">
                  ফসলের পরামর্শ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('seeds')} className="hover:text-emerald-400 transition-colors">
                  উন্নত জাত ও বীজ প্রযুক্তি
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('soil')} className="hover:text-emerald-400 transition-colors">
                  মাটির অম্লতা ও সার ব্যবস্থাপনা
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pests')} className="hover:text-emerald-400 transition-colors">
                  সমন্বিত বালাই দমন (IPM)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('weather')} className="hover:text-emerald-400 transition-colors">
                  জেলা ভিত্তিক কৃষি আবহাওয়া
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Research Institutes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              গবেষণা অংশীদার
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="https://dae.gov.bd" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                  <span>কৃষি সম্প্রসারণ অধিদপ্তর (DAE)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://brri.gov.bd" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                  <span>ধান গবেষণা ইনস্টিটিউট (BRRI)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://bari.gov.bd" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                  <span>কৃষি গবেষণা ইনস্টিটিউট (BARI)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://bamis.gov.bd" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                  <span>কৃষি আবহাওয়া পোর্টাল (BAMIS)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://ais.gov.bd" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                  <span>কৃষি তথ্য সার্ভিস (AIS)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Notice */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              কৃষি নিরাপত্তা প্রতিশ্রুতি
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              AGRIMIND কখনো মনগড়া রাসায়নিক ডোজ সুপারিশ করে না। সকল তথ্য সরকারি নির্দেশিকা দ্বারা যাচাইকৃত। জটিল বা মারাত্মক আক্রমণে স্থানীয় উপজেলা কৃষি কর্মকর্তার প্রত্যক্ষ পরামর্শ নিন।
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-emerald-300 font-semibold">
              ✓ ক্ষতিকর বালাইনাশকের অননুমোদিত ব্যবহার বর্জনীয়
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} AGRIMIND. সর্বস্বত্ব সংরক্ষিত · Smart Agriculture for Bangladesh.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('knowledge')} className="hover:text-slate-300">জ্ঞানকোষ</button>
            <span>·</span>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-slate-300">কৃষক লগইন</button>
            <span>·</span>
            <button onClick={() => onNavigate('admin')} className="hover:text-slate-300">অ্যাডমিন কনসোল</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
