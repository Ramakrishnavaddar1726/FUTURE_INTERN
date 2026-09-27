import { GraduationCap, Award, BookOpen, Calendar, CheckCircle } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Education() {
  const { education } = portfolioData;

  return (
    <section id="education" className="py-20 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            05. Academic Foundation
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Education
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
            Undergraduate engineering training in computer science theory, systems programming, and software engineering methodologies.
          </p>
        </div>

        {/* Education Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Degree Card (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-xs light-card space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {education.degree} in {education.major}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 mt-1">
                    {education.institution}
                  </p>
                  <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-1 font-bold">
                    Current Standing: {education.currentSemester} (5th Semester)
                  </p>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{education.duration}</span>
                </span>
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                  {education.cgpaOrGrade}
                </p>
              </div>
            </div>

            {/* Relevant Coursework */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Relevant Coursework & Theory:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {education.coursework.map((course) => (
                  <div
                    key={course}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{course}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Highlights */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Key Academic Achievements:
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {education.highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Academic Profile Snapshot Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-xs light-card space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <span>Student Highlights</span>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white font-sans text-sm">
                    Core CS Foundation
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Strong grasp on time & space complexity analysis (Big-O), memory allocation in C, and object encapsulation in Java.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white font-sans text-sm">
                    5th-Semester Agility
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Currently pursuing advanced modules in Web Technologies, Software Engineering, and Database Indexing.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white font-sans text-sm">
                    Campus Engagement
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Active organizer of peer study sessions for Data Structures, git onboarding sessions, and college coding club events.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
