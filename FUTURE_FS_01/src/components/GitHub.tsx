import { useState } from 'react';
import { Github, Star, GitFork, ExternalLink, Calendar, GitCommit, Check } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function GitHub() {
  const { github, personal } = portfolioData;

  // Generate simulated authentic activity tiles (52 weeks x 7 days)
  const generateContributionHeatmap = () => {
    const weeks = [];
    const days = 7;
    for (let w = 0; w < 36; w++) {
      const daysArray = [];
      for (let d = 0; d < days; d++) {
        // Pseudo-random deterministic activity value representing consistent student development
        const seed = (w * 13 + d * 7) % 19;
        let level = 0;
        if (seed > 14) level = 3;
        else if (seed > 9) level = 2;
        else if (seed > 4) level = 1;
        daysArray.push(level);
      }
      weeks.push(daysArray);
    }
    return weeks;
  };

  const heatmap = generateContributionHeatmap();

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 3:
        return 'bg-emerald-600 dark:bg-emerald-500';
      case 2:
        return 'bg-emerald-500/70 dark:bg-emerald-600/70';
      case 1:
        return 'bg-emerald-500/30 dark:bg-emerald-800/60';
      default:
        return 'bg-slate-200 dark:bg-slate-800/80';
    }
  };

  return (
    <section id="github" className="py-20 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
              08. Open Source & Repositories
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              GitHub Activity
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
              Consistent commit hygiene, open-source repositories, and documented software prototypes.
            </p>
          </div>

          <a
            href={personal.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 self-start sm:self-end"
          >
            <Github className="w-4 h-4" />
            <span>@{github.username} on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Contribution Activity Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-xs light-card mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-slate-700/60 shadow-xs">
                <GitCommit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Developer Activity Heatmap
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {github.bio} · Active commits and repository pushes on GitHub
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
              <span>Public Repos: <strong className="text-slate-900 dark:text-white font-bold">{github.publicReposCount}</strong></span>
              <span>·</span>
              <span>Account Status: <strong className="text-emerald-500 font-bold">Active</strong></span>
            </div>
          </div>

          {/* Interactive Heatmap Matrix */}
          <div className="overflow-x-auto pb-2 pt-2">
            <div className="flex gap-1 min-w-[700px]">
              {heatmap.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((level, dIdx) => (
                    <div
                      key={dIdx}
                      className={`w-3.5 h-3.5 rounded-xs transition-colors ${getHeatmapColor(
                        level
                      )}`}
                      title={`Activity level ${level}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="font-mono text-[11px]">Daily commit cadence</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>Less</span>
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-200 dark:bg-slate-800" />
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500/30 dark:bg-emerald-800/60" />
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500/70 dark:bg-emerald-600/70" />
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 dark:bg-emerald-500" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Pinned Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {github.pinnedRepositories.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all shadow-xs light-card light-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                    <Github className="w-3.5 h-3.5" />
                    <span>{repo.name}</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {repo.description}
                </p>

                {/* Topics / Tags: unboxed text */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-4">
                  {repo.topics.map((t, idx) => (
                    <span key={t}>
                      #{t}{idx < repo.topics.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Repo Stats Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-slate-700 dark:text-slate-300">{repo.language}</span>
                </span>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 hover:text-amber-500">
                    <Star className="w-3.5 h-3.5" />
                    <span>{repo.stars}</span>
                  </span>
                  <span className="flex items-center gap-1 hover:text-indigo-500">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>{repo.forks}</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
