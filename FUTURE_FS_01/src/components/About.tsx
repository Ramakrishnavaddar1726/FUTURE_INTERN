import { Code2, Compass, Cpu, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function About() {
  const { personal } = portfolioData;

  return (
    <section id="about" className="py-20 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            01. Background & Perspective
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About Me
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
            A 5th-semester Computer Science Engineering student engineering scalable web software, bridging core computer systems with modern full-stack development.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Story & Mindset (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            <p>
              My journey into software engineering began with foundational programming in C and Java, quickly evolving into a deep curiosity about how large-scale web systems distribute data and maintain responsiveness. Currently in my <strong className="text-slate-900 dark:text-white font-semibold">5th semester of Computer Science & Engineering</strong>, I devote my hours to writing clean, modular code and solving algorithmic problems.
            </p>

            <p>
              I specialize in the <strong className="text-slate-900 dark:text-white font-semibold">React, Node.js, and Express ecosystem</strong> with persistent databases like MongoDB and MySQL. Rather than relying on boilerplate shortcuts, I prioritize understanding foundational principles: HTTP cycles, asynchronous concurrency, component life-cycles, state reconciliation, and database indexing.
            </p>

            <p>
              Beyond the classroom syllabus, I actively seek out real-world engineering challenges—whether building a scam-prevention utility to protect peers from fraudulent student internships or optimizing streaming interface replicas for smooth cross-device rendering. I am driven by high standards of craftsmanship, continuous learning, and collaborative problem-solving.
            </p>

            {/* Quick At-a-Glance Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 space-y-1 shadow-xs hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-semibold">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span>Current Status</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  5th Semester CSE Undergrad
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Expected Graduation: 2028
                </p>
              </div>

              <div className="p-4 rounded-xl border border-sky-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 space-y-1 shadow-xs hover:border-sky-300 transition-colors">
                <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-mono font-semibold">
                  <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span>Primary Focus</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Full-Stack Web Engineering
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  MERN, REST APIs, System Design
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 space-y-1 shadow-xs hover:border-amber-300 transition-colors">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-mono font-semibold">
                  <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Location & Relocation</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  India (Open to Relocation)
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  On-site / Hybrid / Remote
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 space-y-1 shadow-xs hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>Opportunity Status</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Open to Opportunities
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full-stack engineering & collaboration
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards Column (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {personal.stats.map((stat, idx) => {
              const borderColors = [
                'border-indigo-100 hover:border-indigo-300 text-indigo-600',
                'border-sky-100 hover:border-sky-300 text-sky-600',
                'border-amber-100 hover:border-amber-300 text-amber-600',
                'border-emerald-100 hover:border-emerald-300 text-emerald-600',
              ];
              const colorClass = borderColors[idx % borderColors.length];
              return (
                <div
                  key={stat.label}
                  className={`p-5 rounded-2xl border ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]} dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 dark:hover:border-indigo-500/40 transition-all shadow-xs light-card light-card-hover group`}
                >
                  <p className={`text-3xl sm:text-4xl font-extrabold font-heading ${colorClass.split(' ')[2]} dark:text-indigo-400 tracking-tight tabular-nums group-hover:scale-105 transition-transform`}>
                    {stat.value}
                  </p>
                  <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                    {stat.label}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {stat.helper}
                  </p>
                </div>
              );
            })}

            {/* Quote / Recruiter takeaway card spanning 2 columns */}
            <div className="col-span-2 p-5 rounded-2xl border border-indigo-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-sky-50/60 dark:from-slate-950/60 dark:to-slate-950/60 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-slate-400 mb-2 font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                <span>Core Engineering Philosophy</span>
              </div>
              <p className="text-xs sm:text-sm italic text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                "Writing clean, readable, and testable code is not a luxury; it is the baseline requirement for building software that people can rely on."
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
