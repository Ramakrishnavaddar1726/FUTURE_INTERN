import { useState } from 'react';
import { Layout, Server, Database, Terminal, Wrench, Cloud, Check } from 'lucide-react';
import { portfolioData, SkillCategory } from '../data/portfolioData';

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Programming', 'Tools', 'Cloud'];

  const getCategoryIcon = (title: string) => {
    switch (title) {
      case 'Frontend Engineering':
        return <Layout className="w-5 h-5 text-indigo-500" />;
      case 'Backend Development':
        return <Server className="w-5 h-5 text-cyan-500" />;
      case 'Databases & Storage':
        return <Database className="w-5 h-5 text-emerald-500" />;
      case 'Core Programming':
        return <Terminal className="w-5 h-5 text-amber-500" />;
      case 'Tools & Ecosystem':
        return <Wrench className="w-5 h-5 text-purple-500" />;
      case 'Cloud & Deployment':
        return <Cloud className="w-5 h-5 text-sky-500" />;
      default:
        return <Layout className="w-5 h-5 text-indigo-500" />;
    }
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'Proficient':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60';
      case 'Intermediate':
        return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60';
      case 'Familiar':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const filteredCategories = selectedCategory === 'All'
    ? portfolioData.skills
    : portfolioData.skills.filter((c) =>
        c.title.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  return (
    <section id="skills" className="py-20 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <p className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            02. Technical Competencies
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skills & Technologies
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
            Real skills grounded in computer science principles and modern production tools. Clearly annotated by practical proficiency level rather than misleading percentage meters.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 mb-10 bg-slate-200/70 dark:bg-slate-900/80 rounded-xl w-fit max-w-full overflow-x-auto border border-slate-300/50 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.title}
              className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 hover:border-indigo-300 dark:hover:border-slate-700 transition-all shadow-xs light-card light-card-hover flex flex-col justify-between group"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs group-hover:scale-105 transition-transform">
                    {getCategoryIcon(category.title)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                  {category.description}
                </p>

                {/* Skills List */}
                <div className="space-y-2.5">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 transition-all"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {skill.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${getLevelBadgeClass(
                          skill.level
                        )}`}
                      >
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Footer Note */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span className="font-mono">{category.skills.length} competencies</span>
                <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Hands-on verified
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-4">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Level Legend:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <strong>Proficient:</strong> Built multiple complete projects / daily use
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <strong>Intermediate:</strong> Solid working knowledge & API integrations
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <strong>Familiar:</strong> Conceptual understanding & foundational usage
          </span>
        </div>

      </div>
    </section>
  );
}
