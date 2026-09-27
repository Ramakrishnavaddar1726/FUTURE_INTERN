import { useState } from 'react';
import { FileText, Download, Eye, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface ResumeProps {
  onOpenResume: () => void;
}

export default function Resume({ onOpenResume }: ResumeProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    // Printable / Downloadable resume flow
    onOpenResume();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <section id="resume" className="py-20 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card Container */}
        <div className="relative rounded-3xl border border-indigo-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900 shadow-xl overflow-hidden p-8 sm:p-12 lg:p-16 light-card">
          
          {/* Subtle Ambient Backing Light with colorful gradient */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-sky-400/10 dark:from-indigo-500/10 dark:to-transparent blur-3xl rounded-full pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 dark:bg-transparent blur-2xl rounded-full pointer-events-none"
          />

          <div className="relative z-10 max-w-3xl space-y-6">
            
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              <FileText className="w-4 h-4" />
              <span>07. Verified Credentials</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight text-balance">
              Want to know more about my experience and skills?
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Download my complete, ATS-compliant Curriculum Vitae highlighting verified internship experience, university academic transcripts, technical competencies, and project deliverables.
            </p>

            {/* Quick Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Single-Page ATS Standard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Updated for 2025/2026</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>VTU 5th Sem CS Verified</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={onOpenResume}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Eye className="w-4 h-4" />
                <span>View Resume</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Download className="w-4 h-4 text-indigo-500" />
                <span>Download Resume (PDF)</span>
              </button>

              {downloadSuccess && (
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resume viewer opened! Click Print / Save as PDF.
                </span>
              )}
            </div>

            {/* Configurable note */}
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono pt-2">
              Note: The resume path can be replaced directly in <code className="text-indigo-500 font-semibold">src/data/portfolioData.ts</code> (field: <code className="text-indigo-500">personal.resumeUrl</code>).
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
