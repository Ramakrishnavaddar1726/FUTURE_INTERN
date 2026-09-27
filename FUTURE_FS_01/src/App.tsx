import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Services from './components/Services';
import Resume from './components/Resume';
import GitHub from './components/GitHub';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ResumeModal from './components/ResumeModal';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // Clear legacy default if set
      const legacy = localStorage.getItem('portfolio-theme');
      if (legacy) {
        localStorage.removeItem('portfolio-theme');
      }
      const stored = localStorage.getItem('portfolio-theme-preference');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      // Default to light mode
      return false;
    }
    return false;
  });

  const [activeSection, setActiveSection] = useState<string>('home');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Sync dark mode class and theme-color on root HTML element
  useEffect(() => {
    const root = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('portfolio-theme-preference', 'dark');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#0B0F17');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('portfolio-theme-preference', 'light');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#F8FAFC');
    }
  }, [darkMode]);

  // Track active section for Navbar highlight
  useEffect(() => {
    const sectionIds = [
      'home',
      'about',
      'skills',
      'projects',
      'experience',
      'education',
      'services',
      'resume',
      'github',
      'contact',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Fixed Sticky Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main id="main-content">
        <Hero onOpenResume={() => setIsResumeModalOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Services />
        <Resume onOpenResume={() => setIsResumeModalOpen(true)} />
        <GitHub />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Full ATS Resume Modal */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}
