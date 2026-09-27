import { useEffect } from 'react';
import { X, Download, Printer, ExternalLink, Mail, Phone, MapPin, Globe, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generates print view or direct file download
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[90vh]">
        
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              {portfolioData.personal.name} — Curriculum Vitae
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ATS-Optimized View
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Resume / Save as PDF"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleDownload}
              title="Download Resume"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close resume viewer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Sheet Canvas (White paper styling for authentic professional review) */}
        <div className="overflow-y-auto p-4 sm:p-10 bg-slate-50 dark:bg-slate-950">
          <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-xl shadow-lg border border-slate-200 max-w-3xl mx-auto space-y-6 font-sans text-xs sm:text-sm">
            
            {/* Resume Header */}
            <div className="border-b border-slate-300 pb-5 text-center sm:text-left space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {portfolioData.personal.name}
              </h1>
              <p className="text-indigo-600 font-semibold text-sm sm:text-base">
                {portfolioData.personal.role} · 5th Semester Computer Science Engineering
              </p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-600 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{portfolioData.personal.email}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{portfolioData.personal.location}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>github.com/Ramakrishnavaddar1726</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>linkedin.com/in/ramakrishna-vaddar-966a49356</span>
                </span>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Professional Summary
              </h2>
              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                Dedicated 5th-semester Computer Science Engineering student with practical experience building responsive web applications and RESTful backend architectures using React.js, Node.js, Express, and MongoDB. Proven problem-solving ability in core computer science concepts (Data Structures, Algorithms, DBMS, OS) and hands-on internship experience in agile sprint environments.
              </p>
            </div>

            {/* Technical Skills */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Technical Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <p>
                  <strong className="text-slate-900">Frontend:</strong> React.js, JavaScript (ES6+), TypeScript, HTML5, CSS3, Tailwind CSS, Responsive Design
                </p>
                <p>
                  <strong className="text-slate-900">Backend:</strong> Node.js, Express.js, REST APIs, JWT Auth, Middleware
                </p>
                <p>
                  <strong className="text-slate-900">Databases:</strong> MongoDB, Mongoose, MySQL, Schema Design
                </p>
                <p>
                  <strong className="text-slate-900">Languages & Tools:</strong> Java, C, Python, Git, GitHub, VS Code, Postman, Vercel, Render
                </p>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Work Experience
              </h2>
              {portfolioData.experience.map((exp) => (
                <div key={exp.id} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.role} — {exp.company}</span>
                    <span className="font-mono text-slate-500">{exp.duration}</span>
                  </div>
                  <p className="text-slate-600 italic">{exp.location}</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 pt-1">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i} className="leading-snug">{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Key Engineering Projects
              </h2>
              {portfolioData.projects.slice(0, 3).map((proj) => (
                <div key={proj.id} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{proj.title}</span>
                    <span className="font-mono text-slate-500">{proj.technologies.slice(0, 4).join(', ')}</span>
                  </div>
                  <p className="text-slate-700 leading-snug">{proj.description}</p>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Education
              </h2>
              <div className="flex justify-between font-bold text-slate-900 text-xs">
                <span>{portfolioData.education.degree} in {portfolioData.education.major}</span>
                <span className="font-mono text-slate-500">{portfolioData.education.duration}</span>
              </div>
              <p className="text-slate-600 text-xs">{portfolioData.education.institution} · Standing: {portfolioData.education.currentSemester} · CGPA: {portfolioData.education.cgpaOrGrade}</p>
              <p className="text-slate-700 text-xs">
                <strong>Relevant Coursework:</strong> {portfolioData.education.coursework.join(', ')}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
