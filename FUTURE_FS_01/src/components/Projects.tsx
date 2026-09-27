import { useState } from 'react';
import { Github, ExternalLink, ArrowRight, Sparkles, Code2, CheckCircle2 } from 'lucide-react';
import { portfolioData, Project } from '../data/portfolioData';
import ProjectMockupPreview from './ProjectMockupPreview';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Frontend' | 'JavaScript' | 'Java / DSA'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filterTabs: Array<'All' | 'Frontend' | 'JavaScript' | 'Java / DSA'> = [
    'All',
    'Frontend',
    'JavaScript',
    'Java / DSA',
  ];

  const filteredProjects = activeFilter === 'All'
    ? portfolioData.projects
    : portfolioData.projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
              03. Selected Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Projects
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
              Engineered with clean architectural patterns, responsive viewports, and modern stacks. Every project includes accessible live demos and open source repositories.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-900/80 rounded-xl border border-slate-300/50 dark:border-slate-800 self-start md:self-end">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  activeFilter === tab
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 overflow-hidden hover:border-indigo-300 dark:hover:border-slate-700 transition-all shadow-xs light-card light-card-hover"
            >
              <div>
                {/* Visual Thumbnail / Interactive UI Preview */}
                <div
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer p-4 pb-0"
                >
                  <ProjectMockupPreview project={project} />
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Category Kicker & Featured Tag */}
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="flex items-center gap-1 text-[11px] text-amber-500">
                        <Sparkles className="w-3 h-3" /> Featured Architecture
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3
                      onClick={() => setSelectedProject(project)}
                      className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies: unboxed text with typographic separators (anti-slop rule) */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
                    {project.technologies.map((tech, idx) => (
                      <span key={tech} className="flex items-center gap-2">
                        <span className="text-slate-700 dark:text-slate-300">{tech}</span>
                        {idx < project.technologies.length - 1 && <span aria-hidden="true" className="text-slate-400">·</span>}
                      </span>
                    ))}
                  </div>

                  {/* Key Features Bullets */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Key Highlights:
                    </p>
                    {project.keyFeatures.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons in Card Footer */}
              <div className="p-6 pt-0 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  <span>Project Deep Dive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </a>

                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Project Modal for deep architectural drill-down */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

      </div>
    </section>
  );
}
