import { Smartphone, Code, Layers, Server, Database, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { portfolioData, ServiceItem } from '../data/portfolioData';

export default function Services() {
  const { services } = portfolioData;

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-indigo-500" />;
      case 'Code':
        return <Code className="w-5 h-5 text-cyan-500" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-blue-500" />;
      case 'Server':
        return <Server className="w-5 h-5 text-emerald-500" />;
      case 'Database':
        return <Database className="w-5 h-5 text-amber-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-rose-500" />;
      default:
        return <Code className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <section id="services" className="py-20 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            06. Engineering Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What I Can Do
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
            Delivering end-to-end full-stack solutions with production-grade attention to responsive layouts, clean API contracts, and performant databases.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 hover:border-indigo-300 dark:hover:border-slate-700 transition-all shadow-xs light-card light-card-hover flex flex-col justify-between group"
            >
              <div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 w-fit mb-4 group-hover:scale-110 shadow-xs transition-transform">
                  {renderIcon(service.icon)}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {service.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {service.shortDescription}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5">
                  {service.bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <a href="#contact" className="inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                  <span>Collaborate on this</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
