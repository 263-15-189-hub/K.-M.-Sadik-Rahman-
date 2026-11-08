import React, { useState, useEffect } from 'react';
import { 
  CloudSunRain, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  RefreshCw,
  Clock,
  ShieldCheck,
  Info
} from 'lucide-react';
import { WeatherData, Language } from '../types';

interface WeatherSectionProps {
  lang: Language;
}

const DISTRICT_LIST = [
  { id: 'Mymensingh', nameBn: 'ময়মনসিংহ', regionBn: 'হাওর ও সমভূমি' },
  { id: 'Dhaka', nameBn: 'ঢাকা', regionBn: 'মধ্যাঞ্চল' },
  { id: 'Bogura', nameBn: 'বগুড়া', regionBn: 'উত্তর-পশ্চিমাঞ্চল' },
  { id: 'Rangpur', nameBn: 'রংপুর', regionBn: 'তিস্তা পলল ভূমি' },
  { id: 'Dinajpur', nameBn: 'দিনাজপুর', regionBn: 'উত্তরাঞ্চল' },
  { id: 'Rajshahi', nameBn: 'রাজশাহী', regionBn: 'বরেন্দ্র অঞ্চল' },
  { id: 'Cumilla', nameBn: 'কুমিল্লা', regionBn: 'মেঘনা পলল ভূমি' },
  { id: 'Sylhet', nameBn: 'সিলেট', regionBn: 'সুরমা কুশিয়ারা উপত্যকা' },
  { id: 'Barishal', nameBn: 'বরিশাল', regionBn: 'গাঙ্গেয় মোহনা ও দক্ষিণাঞ্চল' },
  { id: 'Khulna', nameBn: 'খুলনা', regionBn: 'উপকূলীয় লবণাক্ত অঞ্চল' },
  { id: 'Jashore', nameBn: 'যশোর', regionBn: 'দক্ষিণ-পশ্চিমাঞ্চল' }
];

export const WeatherSection: React.FC<WeatherSectionProps> = ({ lang }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('Mymensingh');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchWeather = async (district: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/weather?district=${encodeURIComponent(district)}`);
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      setWeatherData(data.weather);
    } catch (err: any) {
      setErrorMsg('আবহাওয়া ডেটা লোড করতে সাময়িক সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedDistrict);
  }, [selectedDistrict]);

  const currentDistObj = DISTRICT_LIST.find(d => d.id === selectedDistrict);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#087A35] dark:text-emerald-400 mb-1">
              <CloudSunRain className="w-4 h-4" />
              <span>{lang === 'bn' ? 'কৃষি আবহাওয়া ও সতর্কবার্তা (যাচাইকৃত)' : 'Verified Agro-Meteorological Advisory'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {lang === 'bn' ? 'জেলা ভিত্তিক রিয়েল-টাইম পূর্বাভাস ও করণীয়' : 'District-Wise Live Weather & Farm Precautions'}
            </h2>
          </div>

          {/* District Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {lang === 'bn' ? 'জেলা পরিবর্তন:' : 'Select District:'}
            </span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087A35] shadow-xs cursor-pointer"
            >
              {DISTRICT_LIST.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.nameBn} ({dist.id})
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchWeather(selectedDistrict)}
              disabled={isLoading}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#087A35] transition-colors cursor-pointer"
              title="Refresh Weather"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#087A35]' : ''}`} />
            </button>
          </div>
        </div>

        {weatherData && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            
            {/* Top Weather Stats Strip */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-800 to-[#064E2B] text-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Location & Main Temperature */}
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                    <CloudSunRain className="w-9 h-9 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-300" />
                      <span className="text-lg font-bold">
                        {currentDistObj?.nameBn} ({selectedDistrict})
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white font-medium">
                        {currentDistObj?.regionBn}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-900">
                        {weatherData.dataStatus === 'real_time_live' ? '● LIVE' : 'CACHED'}
                      </span>
                    </div>
                    <p className="text-sm text-emerald-100 font-medium mt-0.5">
                      {lang === 'bn' ? weatherData.conditionBn : weatherData.condition}
                    </p>
                    <p className="text-xs text-emerald-200/80 flex items-center gap-2 mt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{lang === 'bn' ? 'হালনাগাদ:' : 'Updated:'} {weatherData.updatedAt}</span>
                      </span>
                      <span>·</span>
                      <span>{weatherData.dataSource}</span>
                    </p>
                  </div>
                </div>

                {/* 4 Metric Boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-200">
                      <Thermometer className="w-3.5 h-3.5 text-amber-300" />
                      <span>{lang === 'bn' ? 'তাপমাত্রা' : 'Temp'}</span>
                    </div>
                    <p className="text-2xl font-black mt-1 font-mono tabular-nums">
                      {weatherData.temp}°C
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-200">
                      <Droplets className="w-3.5 h-3.5 text-cyan-300" />
                      <span>{lang === 'bn' ? 'আর্দ্রতা' : 'Humidity'}</span>
                    </div>
                    <p className="text-2xl font-black mt-1 font-mono tabular-nums">
                      {weatherData.humidity}%
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-200">
                      <CloudSunRain className="w-3.5 h-3.5 text-sky-300" />
                      <span>{lang === 'bn' ? 'বৃষ্টির ঝুঁকি' : 'Rain Prob'}</span>
                    </div>
                    <p className="text-2xl font-black mt-1 font-mono tabular-nums">
                      {weatherData.rainProb}%
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-200">
                      <Wind className="w-3.5 h-3.5 text-teal-200" />
                      <span>{lang === 'bn' ? 'বাতাসের গতি' : 'Wind'}</span>
                    </div>
                    <p className="text-2xl font-black mt-1 font-mono tabular-nums">
                      {weatherData.windSpeed} <span className="text-xs font-normal">কিমি/ঘণ্টা</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Disclaimer if cached or limited */}
            {weatherData.disclaimer && (
              <div className="px-6 py-2 bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{weatherData.disclaimer}</span>
              </div>
            )}

            {/* Bottom Section: Alerts & Precautions */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Agricultural Alerts */}
              <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <h3 className="font-bold text-sm sm:text-base text-amber-900 dark:text-amber-200">
                    {lang === 'bn' ? 'কৃষি আবহাওয়া সতর্কতা (Agro Alerts)' : 'Agricultural Weather Alerts'}
                  </h3>
                </div>
                {weatherData.agriculturalAlerts.length > 0 ? (
                  <ul className="space-y-2">
                    {weatherData.agriculturalAlerts.map((alert, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-amber-900 dark:text-amber-300 leading-relaxed flex items-start gap-2">
                        <span className="font-bold text-amber-600 shrink-0">•</span>
                        <span>{alert}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'বর্তমানে কোনো গুরুতর আবহাওয়া সতর্কতা নেই।' : 'No critical alerts active.'}
                  </p>
                )}
              </div>

              {/* Recommended Precautions */}
              <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-[#087A35] shrink-0" />
                  <h3 className="font-bold text-sm sm:text-base text-[#087A35] dark:text-emerald-400">
                    {lang === 'bn' ? 'মাঠ পর্যায়ের করণীয় সতর্কতা' : 'Field Precautions & Farming Actions'}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {weatherData.precautions.map((prec, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="font-bold text-emerald-600 shrink-0">✓</span>
                      <span>{prec}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Official Source attribution */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {lang === 'bn' ? 'বাংলাদেশ আবহাওয়া অধিদপ্তর (BMD) ও BAMIS সমন্বিত ডেটা' : 'Integrated BMD & BAMIS Weather Feed'}
              </span>
              <span className="text-[11px] font-mono">
                {weatherData.dataSource} · 24h Forecast
              </span>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
