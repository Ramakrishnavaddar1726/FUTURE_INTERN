import { useState } from 'react';
import { ArrowDown, FileText, Send, Github, Linkedin, Mail, Terminal as TerminalIcon, Sparkles, CheckCircle2, Copy } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface HeroProps {
  onOpenResume: () => void;
}

export default function Hero({ onOpenResume }: HeroProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'stack' | 'status'>('profile');

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Dynamic Background Glows (Rich, modern ambient light) */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[380px] bg-gradient-to-tr from-indigo-500/20 via-sky-400/20 to-purple-500/15 dark:from-indigo-600/10 dark:via-indigo-500/10 dark:to-transparent blur-[110px] rounded-full pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-12 right-12 w-[380px] h-[380px] bg-gradient-to-br from-amber-400/15 via-rose-400/15 to-emerald-400/15 dark:from-cyan-600/5 dark:to-transparent blur-[120px] rounded-full pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -top-10 right-1/4 w-[280px] h-[280px] bg-sky-400/15 dark:bg-transparent blur-[90px] rounded-full pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Bio & Primary CTAs (7 columns on desktop) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Main Greeting & Identity */}
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Hi, I'm {portfolioData.personal.name}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
                Full-Stack <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">Developer</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {portfolioData.personal.headline}
            </p>

            {/* Key Academic & Stacks kicker line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
              <span>5th Sem CSE</span>
              <span aria-hidden="true">·</span>
              <span>MERN Stack</span>
              <span aria-hidden="true">·</span>
              <span>React & Node.js</span>
              <span aria-hidden="true">·</span>
              <span>REST APIs</span>
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span>View My Projects</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onOpenResume}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Resume / CV</span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg border border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Send className="w-4 h-4" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Social Links & One-click Email */}
            <div className="pt-4 flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Connect:
              </span>
              
              <a
                href={portfolioData.personal.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="p-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                href={portfolioData.personal.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                href={`mailto:${portfolioData.personal.email}`}
                aria-label="Direct Email"
                className="p-2 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>

              {/* Instant Email Copy Button */}
              <button
                type="button"
                onClick={copyEmailToClipboard}
                title="Copy email to clipboard"
                className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {copiedEmail ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-sans">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{portfolioData.personal.email}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Visual Developer Terminal & Architecture Card (5 columns on desktop) */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl border border-indigo-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-xl shadow-indigo-500/5 dark:shadow-2xl backdrop-blur-xl overflow-hidden light-card">
              
              {/* Terminal Window Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-xs" />
                  <span className="ml-2 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1 font-semibold">
                    <TerminalIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> ramakrishna@github:~
                  </span>
                </div>

                {/* Tab Switchers */}
                <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-0.5 rounded-lg text-xs font-mono">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    bio.ts
                  </button>
                  <button
                    onClick={() => setActiveTab('stack')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      activeTab === 'stack'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    stack.json
                  </button>
                  <button
                    onClick={() => setActiveTab('status')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      activeTab === 'status'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    git.log
                  </button>
                </div>
              </div>

              {/* Terminal Code Body */}
              <div className="p-5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto min-h-[300px]">
                {activeTab === 'profile' && (
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <p className="text-slate-400 dark:text-slate-500">
                      // Developer profile snapshot
                    </p>
                    <p>
                      <span className="text-purple-600 dark:text-purple-400">const</span>{' '}
                      <span className="text-blue-600 dark:text-blue-400">developer</span> = &#123;
                    </p>
                    <p className="pl-4">
                      name: <span className="text-emerald-600 dark:text-emerald-400">"{portfolioData.personal.name}"</span>,
                    </p>
                    <p className="pl-4">
                      education: <span className="text-emerald-600 dark:text-emerald-400">"B.E. Computer Science"</span>,
                    </p>
                    <p className="pl-4">
                      semester: <span className="text-amber-600 dark:text-amber-400">5</span>,
                    </p>
                    <p className="pl-4">
                      cgpa: <span className="text-amber-600 dark:text-amber-400">8.4</span>,
                    </p>
                    <p className="pl-4">
                      role: <span className="text-emerald-600 dark:text-emerald-400">"Full-Stack Developer"</span>,
                    </p>
                    <p className="pl-4">
                      focusAreas: [<span className="text-emerald-600 dark:text-emerald-400">"Web Apps"</span>, <span className="text-emerald-600 dark:text-emerald-400">"REST APIs"</span>, <span className="text-emerald-600 dark:text-emerald-400">"System Design"</span>],
                    </p>
                    <p className="pl-4">
                      seeking: <span className="text-emerald-600 dark:text-emerald-400">"Internships & SDE-1"</span>,
                    </p>
                    <p className="pl-4">
                      openToRelocation: <span className="text-purple-600 dark:text-purple-400">true</span>,
                    </p>
                    <p>&#125;;</p>
                    <p className="pt-2 text-indigo-600 dark:text-indigo-400">
                      developer.buildScalableApps();
                    </p>
                  </div>
                )}

                {activeTab === 'stack' && (
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <p className="text-slate-400 dark:text-slate-500">
                      // Core technical competencies
                    </p>
                    <p>&#123;</p>
                    <p className="pl-4">
                      <span className="text-indigo-600 dark:text-indigo-400">"frontend"</span>: [
                      <span className="text-emerald-600 dark:text-emerald-400">"React.js"</span>,{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"JavaScript ES6+"</span>,{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"TailwindCSS"</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-indigo-600 dark:text-indigo-400">"backend"</span>: [
                      <span className="text-emerald-600 dark:text-emerald-400">"Node.js"</span>,{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"Express.js"</span>,{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"REST APIs"</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-indigo-600 dark:text-indigo-400">"database"</span>: [
                      <span className="text-emerald-600 dark:text-emerald-400">"MongoDB"</span>,{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"MySQL"</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-indigo-600 dark:text-indigo-400">"languages"</span>: [
                      <span className="text-emerald-600 dark:text-emerald-400">"Java"</span>,{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"C"</span>,{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"Python"</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-indigo-600 dark:text-indigo-400">"deployments"</span>: [
                      <span className="text-emerald-600 dark:text-emerald-400">"Vercel"</span>,{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"Render"</span>,{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"Netlify"</span>]
                    </p>
                    <p>&#125;</p>
                  </div>
                )}

                {activeTab === 'status' && (
                  <div className="space-y-2 text-slate-700 dark:text-slate-300">
                    <p className="text-slate-400 dark:text-slate-500">
                      $ git log --oneline -n 4
                    </p>
                    <div className="space-y-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                      <p>
                        <span className="text-amber-600 dark:text-amber-400">7d64d3e</span> feat(DSA): solve Two Sum in Java with O(n) hash map
                      </p>
                      <p>
                        <span className="text-amber-600 dark:text-amber-400">a3f21b9</span> feat(Projects): real-time weather with Open-Meteo API
                      </p>
                      <p>
                        <span className="text-amber-600 dark:text-amber-400">601877d</span> feat(Projects): Netflix India clone responsive UI
                      </p>
                      <p>
                        <span className="text-amber-600 dark:text-amber-400">4244a05</span> feat(Projects): client-side task ledger with storage
                      </p>
                    </div>
                    <p className="pt-2 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Working branch: main (@Ramakrishnavaddar1726)
                    </p>
                  </div>
                )}
              </div>

              {/* Terminal Footer Indicator */}
              <div className="px-4 py-2 bg-slate-100/40 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>UTF-8</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> All systems nominal
                </span>
                <span>Node v20.x</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
