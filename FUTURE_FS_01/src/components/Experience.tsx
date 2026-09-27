import { Briefcase, Calendar, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="py-20 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            04. Industry Experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Work & Internships
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
            Real software engineering internship experience working with cross-functional teams, agile methodologies, and production web applications.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 dark:border-indigo-900/60 space-y-12 max-w-4xl">
          {experience.map((item) => (
            <div key={item.id} className="relative group">
              
              {/* Timeline Pin/Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-4 border-indigo-600 dark:border-indigo-500 shadow-sm" />

              {/* Card Container */}
              <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-xs light-card light-card-hover space-y-5 hover:border-indigo-300 transition-all">
                
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {item.role}
                    </h3>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {item.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.duration}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                {/* Key Responsibilities */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Core Engineering Contributions:
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {item.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-normal">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies: unboxed metadata */}
                <div className="pt-2">
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500 mr-2">
                    Technologies:
                  </span>
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
                    {item.technologies.join(' · ')}
                  </span>
                </div>

                {/* Key Recognition / Achievement note */}
                {item.achievements && item.achievements.length > 0 && (
                  <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                    <p className="font-semibold font-mono uppercase tracking-wider text-[11px] text-indigo-600 dark:text-indigo-400">
                      Deliverables & Outcomes:
                    </p>
                    {item.achievements.map((ach, idx) => (
                      <p key={idx} className="flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{ach}</span>
                      </p>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}

          {/* Academic & Hackathon milestones in same timeline */}
          <div className="relative group">
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-4 border-slate-400 dark:border-slate-600" />
            
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="font-bold text-slate-900 dark:text-white font-sans text-sm">
                  Active Collegiate Projects & Competitive Programming
                </span>
                <span>2024 – Present</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Regular participant in technical symposiums, hackathons, and departmental open-source workshops. Actively solving Data Structures & Algorithm problems on LeetCode and building practical full-stack prototypes.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
