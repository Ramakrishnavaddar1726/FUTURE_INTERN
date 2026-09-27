import { Play, CloudRain, CheckSquare, Layers, Code2, Star, MapPin, Wind, Thermometer, CheckCircle2, Terminal } from 'lucide-react';
import { Project } from '../data/portfolioData';

interface ProjectMockupPreviewProps {
  project: Project;
}

export default function ProjectMockupPreview({ project }: ProjectMockupPreviewProps) {
  // Real Netflix clone mockup
  if (project.demoType === 'streaming') {
    return (
      <div className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 group-hover:border-red-500/40 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/80 to-transparent pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/20 blur-3xl pointer-events-none" />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-red-600 text-sm tracking-wider font-heading">
              NETFLIX
            </span>
            <span className="text-[10px] text-slate-400">India</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 text-[10px] border border-red-500/30">
            Thiranex Task
          </span>
        </div>

        {/* Hero banner simulation */}
        <div className="relative z-10 space-y-1 my-auto py-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-400">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>Trending in India · Top 10</span>
          </div>
          <h4 className="text-white font-bold text-sm sm:text-base leading-tight">
            Responsive Streaming Interface
          </h4>
          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">
            Curved brand divider, responsive ranked cards, and styled FAQ accordion.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-white text-black">
              <Play className="w-2.5 h-2.5 fill-black" /> Get Started
            </span>
            <span className="text-[10px] text-slate-300 font-mono">HTML5 · CSS3 Flex & Grid</span>
          </div>
        </div>

        {/* Mock Carousel Thumbnails with Rank numbers */}
        <div className="relative z-10 grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-red-500"
            >
              #{i}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Real-Time Weather Dashboard mockup
  if (project.demoType === 'weather') {
    return (
      <div className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 group-hover:border-sky-500/40 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-sky-950/40 pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-sky-600/20 blur-3xl pointer-events-none" />

        {/* Top Navbar */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <CloudRain className="w-4 h-4 text-sky-400" />
            <span className="font-heading">Weather Dashboard</span>
          </div>
          <span className="text-[10px] text-sky-400 bg-sky-950/60 border border-sky-800/80 px-2 py-0.5 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Open-Meteo API
          </span>
        </div>

        {/* Weather data display */}
        <div className="relative z-10 grid grid-cols-3 gap-2 my-auto py-1">
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Location</span>
              <MapPin className="w-3 h-3 text-sky-400" />
            </div>
            <p className="font-semibold text-white truncate text-xs">Bengaluru, IN</p>
            <p className="text-sky-400 font-mono text-[11px]">27°C · Partly Cloudy</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Wind Speed</span>
              <Wind className="w-3 h-3 text-sky-400" />
            </div>
            <p className="font-semibold text-white truncate text-xs">14 km/h</p>
            <p className="text-emerald-400 font-mono text-[11px]">Humidity: 62%</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Forecast</span>
              <Thermometer className="w-3 h-3 text-sky-400" />
            </div>
            <p className="font-semibold text-white truncate text-xs">7-Day Outlook</p>
            <p className="text-amber-400 font-mono text-[11px]">UV Index: 5 Mod</p>
          </div>
        </div>

        {/* Weather footer */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
          <span>Async / Await Typeahead</span>
          <span className="text-sky-400">HTML5 Geolocation Enabled ✓</span>
        </div>
      </div>
    );
  }

  // Client-Side Task Ledger App mockup
  if (project.demoType === 'todo') {
    return (
      <div className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 group-hover:border-emerald-500/40 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/30 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-600/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span className="font-heading">The Ledger — Task List</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
            LocalStorage Sync
          </span>
        </div>

        {/* Task list simulation */}
        <div className="relative z-10 space-y-1.5 my-auto py-1">
          <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="line-through text-slate-500 text-[11px]">Implement Storage.js persistence layer</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="line-through text-slate-500 text-[11px]">Wire event delegation and commit() state cycle</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900/90 border border-emerald-500/30 text-[11px] text-white">
            <span className="w-3.5 h-3.5 rounded-full border border-emerald-400 shrink-0 inline-block" />
            <span className="text-[11px]">Add keyboard accessibility and filter tabs</span>
          </div>
        </div>

        {/* Ledger Footer */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
          <span>1 item left</span>
          <span className="text-emerald-400">All · Active · Completed</span>
        </div>
      </div>
    );
  }

  // DSA / LeetCode in Java mockup
  return (
    <div className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 group-hover:border-amber-500/40 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/30 pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-600/20 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-white font-bold">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span className="font-heading">DSA / LeetCode Java</span>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
          Algorithms
        </span>
      </div>

      {/* Java Code & Problem breakdown */}
      <div className="relative z-10 space-y-1.5 my-auto py-1 font-mono text-[11px]">
        <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-slate-300 space-y-1">
          <p className="text-amber-400 font-semibold text-[11px]">Problem #1: Two Sum</p>
          <p className="text-slate-400 text-[10px]">Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();</p>
          <p className="text-emerald-400 text-[10px]">Time Complexity: O(n) · Space: O(n)</p>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>#125 Valid Palindrome</span>
          <span>#167 Two Sum II</span>
          <span>#9 Palindrome Number</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
        <span>Clean Java Implementations</span>
        <span className="text-amber-400">Optimal Big-O Complexity ✓</span>
      </div>
    </div>
  );
}
