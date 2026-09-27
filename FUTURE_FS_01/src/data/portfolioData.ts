export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Frontend' | 'JavaScript' | 'Java / DSA';
  technologies: string[];
  keyFeatures: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  accentColor: string;
  demoType: 'weather' | 'todo' | 'streaming' | 'dsa';
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: {
    name: string;
    level: 'Proficient' | 'Intermediate' | 'Familiar' | 'Exploring';
    iconName?: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
}

export interface EducationItem {
  degree: string;
  major: string;
  institution: string;
  duration: string;
  currentSemester: string;
  cgpaOrGrade: string;
  coursework: string[];
  highlights: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  bullets: string[];
  icon: string;
}

export interface RepositoryItem {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  topics: string[];
}

export const portfolioData = {
  personal: {
    name: "Ramakrishna Vaddar",
    shortName: "Ramakrishna",
    role: "Full-Stack Developer",
    status: "Computer Science Engineering Student & Web Developer Intern",
    headline: "Full-Stack Developer specialising in React, TypeScript, Node.js, and modern responsive web applications.",
    bio: "I am a Computer Science Engineering student and aspiring Full-Stack Developer passionate about engineering responsive, high-performance web applications and solving computational problems. Having completed a Web Development Internship at Thiranex and built production-focused full-stack and frontend systems, I enjoy turning design concepts and APIs into fluid, reliable digital experiences.",
    email: "ramakrishnak1726@gmail.com",
    githubUsername: "Ramakrishnavaddar1726",
    githubUrl: "https://github.com/Ramakrishnavaddar1726",
    linkedinUrl: "https://www.linkedin.com/in/ramakrishna-vaddar-966a49356/",
    location: "India",
    availability: "Open to Software Engineering Opportunities",
    resumeUrl: "/assets/Ramakrishna_Vaddar_Resume.pdf",
    stats: [
      { label: "Public Repositories", value: "4+", helper: "Real repositories on GitHub" },
      { label: "Internship Completed", value: "Thiranex", helper: "Web Development Intern" },
      { label: "LeetCode & DSA Solved", value: "Java", helper: "Algorithms & Problem Solving" },
      { label: "Responsive Web Dev", value: "HTML/CSS/JS", helper: "Client Apps & Real APIs" },
    ],
  },

  skills: [
    {
      title: "Frontend Engineering",
      description: "Developing responsive, accessible interfaces using semantic HTML5, modern CSS3, React, and TypeScript.",
      skills: [
        { name: "React.js", level: "Proficient" },
        { name: "TypeScript", level: "Proficient" },
        { name: "JavaScript (ES6+)", level: "Proficient" },
        { name: "HTML5 Semantic Web", level: "Proficient" },
        { name: "CSS3 Flexbox & Grid", level: "Proficient" },
        { name: "Tailwind CSS", level: "Proficient" },
        { name: "Responsive Layouts", level: "Proficient" },
      ],
    },
    {
      title: "Backend Development",
      description: "Architecting RESTful APIs, asynchronous services, and server handlers using Node.js and Express.",
      skills: [
        { name: "Node.js", level: "Proficient" },
        { name: "Express.js", level: "Intermediate" },
        { name: "RESTful API Integration", level: "Proficient" },
        { name: "Async / Await Flow", level: "Proficient" },
        { name: "Fetch & JSON APIs", level: "Proficient" },
      ],
    },
    {
      title: "Databases & Storage",
      description: "Data persistence, browser storage mechanisms, and relational/document databases.",
      skills: [
        { name: "LocalStorage API", level: "Proficient" },
        { name: "MongoDB & Mongoose", level: "Intermediate" },
        { name: "MySQL", level: "Intermediate" },
        { name: "IndexedDB / Caching", level: "Familiar" },
      ],
    },
    {
      title: "Core Programming & DSA",
      description: "Solid problem-solving skills in Data Structures and Algorithms with clean object-oriented code.",
      skills: [
        { name: "Java (LeetCode & DSA)", level: "Proficient" },
        { name: "C Programming", level: "Intermediate" },
        { name: "Python", level: "Intermediate" },
        { name: "Two-Pointers & Hash Maps", level: "Proficient" },
      ],
    },
    {
      title: "Tools & Ecosystem",
      description: "Version control workflows, developer tools, and API testing environments.",
      skills: [
        { name: "Git", level: "Proficient" },
        { name: "GitHub", level: "Proficient" },
        { name: "VS Code", level: "Proficient" },
        { name: "Postman", level: "Intermediate" },
        { name: "Chrome DevTools", level: "Proficient" },
      ],
    },
    {
      title: "Cloud & Deployment",
      description: "Deploying client applications and full-stack services across hosting platforms.",
      skills: [
        { name: "Vercel", level: "Proficient" },
        { name: "Netlify", level: "Proficient" },
        { name: "Render", level: "Intermediate" },
        { name: "GitHub Pages", level: "Proficient" },
      ],
    },
  ] as SkillCategory[],

  projects: [
    {
      id: "project-weather-dashboard",
      title: "Real-Time Weather Dashboard",
      tagline: "Dynamic meteorological forecast application integrating Open-Meteo REST APIs & Geolocation",
      description: "A responsive, real-time weather web application with city typeahead search, browser geolocation detection, multi-day forecasting, humidity and wind metrics, and custom SVG dynamic weather states.",
      category: "JavaScript",
      technologies: ["JavaScript (ES6+)", "Fetch API", "Open-Meteo REST API", "HTML5", "CSS3", "Geolocation API"],
      keyFeatures: [
        "Asynchronous city search with dynamic typeahead suggestions and debounce handling",
        "HTML5 Geolocation API integration to detect user coordinates and auto-load local forecast",
        "Comprehensive weather report cards: temperature, precipitation, wind speed, UV, and pressure",
        "Zero API keys required: connects directly to Open-Meteo geocoding and forecast endpoints",
      ],
      githubUrl: "https://github.com/Ramakrishnavaddar1726/Projects/tree/main/real-time%20Weather%20Dashboard",
      liveUrl: "https://github.com/Ramakrishnavaddar1726/Projects/tree/main/real-time%20Weather%20Dashboard",
      featured: true,
      accentColor: "#0EA5E9",
      demoType: "weather",
    },
    {
      id: "project-netflix-clone",
      title: "Netflix India Clone",
      tagline: "Pixel-perfect, fully responsive streaming landing page replicating Netflix India UI",
      description: "A front-end recreation of the Netflix India streaming interface featuring desktop and mobile responsiveness, hero banner with curved brand divider, horizontal trending now ranked slider, and accordion FAQ.",
      category: "Frontend",
      technologies: ["HTML5", "CSS3", "Responsive Design", "Flexbox", "CSS Grid", "Git"],
      keyFeatures: [
        "Full-screen responsive hero layout with brand logo, backdrop gradient, and email CTA",
        "Curved brand divider separating the hero banner from the main body content",
        "Trending Now carousel with horizontal scroll-snap and large rank numbers (1 to 10)",
        "Reasons to Join grid and styled accordion FAQ list matching Netflix's user experience",
      ],
      githubUrl: "https://github.com/Ramakrishnavaddar1726/Projects/tree/main/Netflix%20clone",
      liveUrl: "https://github.com/Ramakrishnavaddar1726/Projects/tree/main/Netflix%20clone",
      featured: true,
      accentColor: "#E50914",
      demoType: "streaming",
    },
    {
      id: "project-todo-ledger",
      title: "Client-Side Task Ledger App",
      tagline: "Lightweight, persistent productivity tool with stateful CRUD and LocalStorage wrapper",
      description: "A client-side task and to-do management application engineered with a clean single-source-of-truth state architecture, modular LocalStorage wrapper, real-time filtering (All, Active, Completed), and keyboard shortcuts.",
      category: "JavaScript",
      technologies: ["JavaScript", "HTML5", "CSS3", "LocalStorage API", "Event Delegation"],
      keyFeatures: [
        "Single-source-of-truth state machine ensuring reactive DOM updates through a commit() pattern",
        "Decoupled Storage module wrapping window.localStorage with error handling for data resilience",
        "Full CRUD: instant task addition, completion toggle, inline editing, and deletion",
        "Active status counter, batch clear-completed, and filter tabs for quick organization",
      ],
      githubUrl: "https://github.com/Ramakrishnavaddar1726/Projects/tree/main/client-side%20To-Do%20List%20application",
      liveUrl: "https://github.com/Ramakrishnavaddar1726/Projects/tree/main/client-side%20To-Do%20List%20application",
      featured: false,
      accentColor: "#10B981",
      demoType: "todo",
    },
    {
      id: "project-dsa-leetcode",
      title: "LeetCode DSA Solutions in Java",
      tagline: "Optimal implementations of core Data Structures & Algorithms problem sets",
      description: "Curated repository of algorithmic solutions in Java focusing on LeetCode problems including Two Sum (Hash Map O(n)), Valid Palindrome, Two Sum II (Two-Pointer O(n)), and Palindrome Number with detailed time and space complexity notes.",
      category: "Java / DSA",
      technologies: ["Java", "Data Structures", "Algorithms", "Two Pointers", "Hash Maps", "LeetCode"],
      keyFeatures: [
        "Optimal time complexity solutions (O(n) linear time hashing and two-pointer traversal)",
        "Clean, documented Java source code with edge-case handling and inline comments",
        "Detailed problem breakdowns, Big-O analysis, and test case validations",
      ],
      githubUrl: "https://github.com/Ramakrishnavaddar1726/DSA",
      liveUrl: "https://github.com/Ramakrishnavaddar1726/DSA",
      featured: false,
      accentColor: "#F59E0B",
      demoType: "dsa",
    },
  ] as Project[],

  experience: [
    {
      id: "exp-thiranex",
      role: "Web Development Intern",
      company: "Thiranex",
      location: "India (Internship)",
      duration: "Recent Internship",
      type: "Internship",
      summary: "Completed web development projects and tasks using HTML5, CSS3, JavaScript, Git, and GitHub. Built responsive user interfaces, real-time API integrations, and client-side applications according to industry web standards.",
      responsibilities: [
        "Developed responsive web interfaces including a real-time Weather Dashboard and Netflix India UI clone.",
        "Integrated third-party RESTful APIs using native JavaScript Fetch API with async/await error handling.",
        "Implemented local client-side persistence using the browser LocalStorage API.",
        "Practiced professional Git workflows, repository management, and code versioning on GitHub.",
        "Ensured responsive layouts and cross-browser compatibility across mobile, tablet, and desktop screens.",
      ],
      technologies: ["HTML5", "CSS3", "JavaScript (ES6+)", "REST APIs", "Git", "GitHub", "Responsive Web Design"],
      achievements: [
        "Successfully delivered all assigned web development modules and internship milestones.",
        "Created a dedicated open-source repository ('Projects') documenting all work completed during the internship.",
      ],
    },
  ] as ExperienceItem[],

  education: {
    degree: "Bachelor of Engineering (B.E.)",
    major: "Computer Science & Engineering",
    institution: "Engineering College (India)",
    duration: "2024 – 2028 (Expected Graduation)",
    currentSemester: "5th Semester",
    cgpaOrGrade: "Computer Science Undergrad",
    coursework: [
      "Data Structures & Algorithms (Java)",
      "Object-Oriented Programming",
      "Database Management Systems (DBMS)",
      "Operating Systems",
      "Computer Networks",
      "Web Technologies & Frameworks",
      "Software Engineering & Agile",
      "Design & Analysis of Algorithms",
    ],
    highlights: [
      "Actively practicing Data Structures & Algorithms on LeetCode with Java",
      "Hands-on internship experience in Web Development at Thiranex",
      "Building modern full-stack web applications with React, TypeScript, and Node.js",
    ],
  } as EducationItem,

  services: [
    {
      id: "srv-1",
      title: "Responsive Web Development",
      shortDescription: "Crafting mobile-friendly, accessible web layouts using modern HTML5, CSS3, and Tailwind CSS that scale seamlessly across all screen sizes.",
      bullets: ["Fluid Flexbox & CSS Grid", "Cross-browser compatibility", "Pixel-perfect visual fidelity"],
      icon: "Smartphone",
    },
    {
      id: "srv-2",
      title: "Frontend Engineering with React & TypeScript",
      shortDescription: "Building modular, type-safe single-page applications with modern React hooks, component reusability, and clean state management.",
      bullets: ["TypeScript type safety", "Modular architecture", "TanStack & React ecosystem"],
      icon: "Code",
    },
    {
      id: "srv-3",
      title: "Full-Stack Web Applications",
      shortDescription: "Developing end-to-end applications bridging frontend user interfaces with backend API logic, session handling, and persistent data storage.",
      bullets: ["Client & server integration", "SSR & full-stack routing", "Robust request handling"],
      icon: "Layers",
    },
    {
      id: "srv-4",
      title: "RESTful API Integration",
      shortDescription: "Connecting applications to third-party REST services (weather, geocoding, authentication) with asynchronous fetch flows and error handling.",
      bullets: ["Async/await fetch wrappers", "Typeahead & debounce logic", "Robust fallback states"],
      icon: "Server",
    },
    {
      id: "srv-5",
      title: "Client-Side Storage & Data Flow",
      shortDescription: "Implementing efficient data persistence using the LocalStorage API, state isolation patterns, and database connectivity.",
      bullets: ["Decoupled storage adapters", "Single-source-of-truth state", "CRUD workflows"],
      icon: "Database",
    },
    {
      id: "srv-6",
      title: "DSA & Problem Solving",
      shortDescription: "Solving computational problems with optimal time and space complexity using Java, two-pointer techniques, and hash-based lookups.",
      bullets: ["O(n) optimal complexity", "Clean Java implementations", "Data structures discipline"],
      icon: "Zap",
    },
  ] as ServiceItem[],

  github: {
    username: "Ramakrishnavaddar1726",
    profileUrl: "https://github.com/Ramakrishnavaddar1726",
    publicReposCount: 5,
    bio: "I am computer science engineering student",
    location: "India",
    pinnedRepositories: [
      {
        name: "Projects",
        description: "Web development projects and tasks completed during internship at Thiranex using HTML, CSS, JavaScript, Git, and GitHub.",
        language: "TypeScript",
        stars: 0,
        forks: 0,
        url: "https://github.com/Ramakrishnavaddar1726/Projects",
        topics: ["html5", "css3", "javascript", "thiranex-internship", "netflix-clone", "weather-dashboard"],
      },
      {
        name: "DSA",
        description: "LeetCode Data Structures and Algorithms solutions in Java, including Two Sum, Valid Palindrome, and optimal two-pointer approaches.",
        language: "Java",
        stars: 0,
        forks: 0,
        url: "https://github.com/Ramakrishnavaddar1726/DSA",
        topics: ["java", "dsa", "leetcode", "algorithms", "problem-solving"],
      },
      {
        name: "Ramakrishnavaddar",
        description: "Personal GitHub configuration and profile repository for Ramakrishna Vaddar.",
        language: "Markdown",
        stars: 0,
        forks: 0,
        url: "https://github.com/Ramakrishnavaddar1726/Ramakrishnavaddar",
        topics: ["profile", "github-config"],
      },
    ] as RepositoryItem[],
  },
};
