import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Shield, 
  Code2, 
  Globe, 
  Database, 
  ExternalLink, 
  Mail, 
  Linkedin, 
  Github, 
  Menu, 
  X, 
  ArrowRight, 
  Award,
  ChevronRight
} from 'lucide-react';

/* ==========================================
   3D TILT CARD COMPONENT
   Handles modern interactive mouse tracking and 3D tilting
   ========================================== */
const TiltCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12; 
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setRotation({ x: rotateX, y: rotateY });
    setGlow({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      className={`perspective-1000 ${className}`} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef}
        className="transition-transform duration-300 ease-out preserve-3d relative h-full w-full"
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255, 43, 43, 0.15), transparent 70%)`,
            zIndex: 1
          }}
        />
        {children}
      </div>
    </div>
  );
};

/* ==========================================
   TYPEWRITER EFFECT COMPONENT
   ========================================== */
const Typewriter = ({ texts }) => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (index >= texts.length) {
       setIndex(0);
       return;
    }
    if (subIndex === texts[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 50 : subIndex === texts[index].length ? 2000 : 100, parseInt(Math.random() * 20)));
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  useEffect(() => {
     setText(texts[index].substring(0, subIndex));
  }, [subIndex, index, texts]);

  return (
    <span>
      {text}
      <span className={`ml-1 text-[#ff2b2b] ${blink ? 'opacity-100' : 'opacity-0'}`}>|</span>
    </span>
  );
};

/* ==========================================
   NAVIGATION BAR
   ========================================== */
const Navbar = ({ onScrollTo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#262626] py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-2xl text-[#f5f5f5] tracking-tighter cursor-pointer" onClick={() => onScrollTo('home')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#262626] to-[#141414] border border-[#ff2b2b]/30 flex items-center justify-center text-[#ff2b2b] shadow-lg">
            ∑
          </div>
          <span className="font-display">K.V<span className="text-[#8e8e93] font-mono text-sm">.dev</span></span>
        </div>
        
        <div className="hidden md:flex gap-8 items-center text-sm font-mono text-[#8e8e93]">
          {['Home', 'Skills', 'Journey', 'Projects', 'Certs', 'Contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => onScrollTo(item.toLowerCase())}
              className="hover:text-[#f5f5f5] transition-colors uppercase tracking-wider"
            >
              {item}
            </button>
          ))}
          <button onClick={() => onScrollTo('contact')} className="px-5 py-2 rounded-lg bg-[#141414] border border-[#262626] hover:border-[#ff2b2b] transition-all text-[#f5f5f5] font-mono text-xs">
            HIRE ME
          </button>
        </div>

        <button className="md:hidden text-[#f5f5f5]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-[#0a0a0a]/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 z-40">
             {['Home', 'Skills', 'Journey', 'Projects', 'Certs', 'Contact'].map((item) => (
              <button 
                key={item} 
                onClick={() => { onScrollTo(item.toLowerCase()); setMobileMenuOpen(false); }}
                className="text-2xl font-display font-bold text-[#f5f5f5] hover:text-[#ff2b2b] uppercase"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

/* ==========================================
   MAIN APP ORCHESTRATOR
   ========================================== */
export default function App() {
  const [liveTime, setLiveTime] = useState('');

  // Clock Synchronization
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const skills = [
    { icon: <Terminal size={24} />, title: "Programming", items: ["Java", "Python", "JavaScript", "C++"] },
    { icon: <Shield size={24} />, title: "Cyber Security", items: ["Network Security", "Ethical Hacking", "Cryptography", "Linux"] },
    { icon: <Globe size={24} />, title: "Web Dev", items: ["React", "Node.js", "HTML/CSS", "Tailwind"] },
    { icon: <Database size={24} />, title: "Backend/Cloud", items: ["SQL", "AWS Basics", "Networking", "REST APIs"] },
  ];

  const journey = [
    { year: "2022", title: "High School Education", text: "Completed 10th." },
    { year: "2024", title: "12th Education Completed", text: "Completed 12th from Ryan International School with Physics, Chemistry, and Mathematics." },
    { year: "2024", title: "Undergrad at GLA", text: "Started B.Tech in Computer Science at GLA University, building a strong core foundation." },
    { year: "2024", title: "Web Development Specialist", text: "Dived deep into Full Stack development, mastering modern UI frameworks and real-time APIs." },
    { year: "2025", title: "Cyber Security Focus", text: "Shifted research focus towards Network Security and Ethical Hacking, bridging dev architecture and security." },
    { year: "2025", title: "Professional Growth", text: "Expanding industrial footprints through technical internships and advanced cloud security certifications." }
  ];

  const certificates = [
    { title: "Networking Basics", issuer: "Cisco Networking Academy", date: "Nov 2025", desc: "Proficient in network communication concepts, IPv4/IPv6, and modern system troubleshooting.", link: "/networking.pdf" },
    { title: "Cyber Internship", issuer: "CYBERZERO & Council", date: "45 Days", desc: "Practical operations across cybersecurity architecture, vulnerability scanning, and defense.", link: "/internship.pdf" },
    { title: "Java (Basic)", issuer: "HackerRank", date: "Nov 2025", desc: "Passed the HackerRank certification protocol validating core OOP design and algorithm logic.", link: "/java_basic certificate.pdf" },
    { title: "Cyber Job Sim", issuer: "Mastercard (Forage)", date: "Sept 2025", desc: "Interactive phishing payload analysis, infrastructure defense simulation, and threat telemetry.", link: "/cyberjo.pdf" },
    { title: "Cyber Job Sim", issuer: "Deloitte (Forage)", date: "Sept 2025", desc: "Assessed industrial targets via penetration testing plans and consulting methodologies.", link: "/cyber.pdf" },
    { title: "Solutions Architect", issuer: "AWS (Forage)", date: "Sept 2025", desc: "Modeled highly-available hosting stacks utilizing container arrays and secure VPC subnets.", link: "/archi.pdf" },
  ];

  const projects = [
    {
      title: "Phishing URL Detector",
      tag: "AI MODEL / CYBER",
      desc: "Lightweight ML + heuristics engine detecting malicious vectors and spoofed PDFs using Google's Gemini API.",
      color: "from-red-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
      link: "https://phishing-url-detector-weld.vercel.app/"
    },
    {
      title: "AI Interviewer Platform",
      tag: "AI / LLM ENG",
      desc: "Intelligent automation interface utilizing LLM pipelines to simulate realistic real-time technical assessments.",
      color: "from-blue-500 to-cyan-600",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      link: "https://ai-interview-three-mu.vercel.app/"
    },
    {
      title: "Showcase Model for Shop",
      tag: "E-COMMERCE 3D",
      desc: "Minimalist interactive catalog built with fast loading layouts to show commercial products with high-impact visuals.",
      image: "https://img.freepik.com/free-photo/courage-man-jump-through-gap-hill-business-concept-idea_1323-262.jpg?semt=ais_hybrid&w=740&q=80", 
      color: "from-green-500 to-emerald-600",
      link: "#"
    },
  ];

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen font-body selection:bg-[#ff2b2b] selection:text-white overflow-x-hidden relative">
      
      {/* Neo-brutalist custom design definitions */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        
        /* Smooth, solid transitions instead of soft curves */
        .brutalist-border {
          border: 1px solid #262626;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .brutalist-border:hover {
          border-color: #ff2b2b;
        }

        /* Scanline effect simulation */
        .scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 4px, 6px 100%;
          z-index: 99;
          opacity: 0.15;
        }
      `}</style>

      <div className="scanlines" />
      <Navbar onScrollTo={scrollTo} />

      {/* ======================= HERO SECTION ======================= */}
      <section id="home" className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-16 relative border-b border-[#262626] max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center w-full">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#141414] border border-[#262626] font-mono text-xs text-[#ff2b2b]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff2b2b] animate-pulse"></span>
              <span>SYSTEM SECURE // PORTFOLIO_V2.0</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-extrabold leading-none tracking-tight font-display text-white uppercase">
              KIRTI VARDHAN<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ff2b2b] to-[#8e8e93] block mt-1">
                <Typewriter texts={["Gupta", "Cyber Analyst", "Full Stack Dev", "Malware Investigator"]} />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#8e8e93] max-w-xl leading-relaxed">
              Driven Computer Science student passionate about security metrics and modern reactive computing. I engineer resilient Android applications, integrated AI tools, and predictive malware models.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => scrollTo('projects')} 
                className="px-8 py-4 bg-[#ff2b2b] hover:bg-[#e02222] font-mono text-xs font-bold tracking-widest text-white transition-all flex items-center gap-3 rounded-none"
              >
                EXPLORE WORK <ArrowRight size={16} />
              </button>
              <a 
                href="mailto:kirti8473@gmail.com" 
                className="px-8 py-4 bg-[#141414] border border-[#262626] hover:border-[#ff2b2b] font-mono text-xs font-bold tracking-widest text-white transition-all rounded-none"
              >
                CONTACT DIRECT
              </a>
            </div>
          </div>

          {/* 3D Profile Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <TiltCard className="w-full max-w-[360px] aspect-[4/5]">
              <div className="h-full w-full bg-[#141414] border-2 border-[#262626] hover:border-[#ff2b2b] p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
                
                <div className="w-full flex justify-between items-center relative z-10 font-mono text-[10px] text-[#8e8e93]">
                  <span>ID: // 1029_KVG</span>
                  <span className="px-2 py-0.5 bg-[#ff2b2b]/10 text-[#ff2b2b] border border-[#ff2b2b]/20">ADMIN LEVEL</span>
                </div>

                <div className="relative z-10 my-6 flex justify-center">
                  <div className="w-48 h-48 rounded-none border border-[#262626] p-1.5 bg-[#0a0a0a] shadow-2xl relative">
                    <img 
                      src="/profile.png" 
                      alt="Kirti Vardhan Gupta" 
                      className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="relative z-10 text-center font-mono">
                  <h3 className="text-lg font-bold font-display text-white tracking-wide uppercase">Kirti Vardhan Gupta</h3>
                  <p className="text-[#ff2b2b] text-xs mt-1">// CYBER SECURITY RESEARCHER</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4 text-left">
                    <div className="bg-[#0a0a0a] p-3 border border-[#262626]">
                      <div className="text-xl font-bold font-display text-white">06+</div>
                      <div className="text-[9px] text-[#8e8e93] uppercase">Certificates</div>
                    </div>
                    <div className="bg-[#0a0a0a] p-3 border border-[#262626]">
                      <div className="text-xl font-bold font-display text-white">03</div>
                      <div className="text-[9px] text-[#8e8e93] uppercase">Deployments</div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-[#262626] flex justify-between items-center font-mono text-[11px] text-[#8e8e93]">
          <div>[SCROLL TO DECIPHER SYSTEM]</div>
          <div>STATION TIME: {liveTime} UTC+05:30</div>
        </div>
      </section>

      {/* ======================= TECHNICAL ARSENAL ======================= */}
      <section id="skills" className="py-24 border-b border-[#262626] max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div>
            <span className="font-mono text-xs text-[#ff2b2b] uppercase tracking-widest">// SYSTEM_RESOURCES</span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display uppercase mt-2">Technical Arsenal</h2>
          </div>
          <span className="font-mono text-sm text-[#8e8e93]">[01 / SKILLS ENGINE]</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, idx) => (
            <TiltCard key={idx}>
              <div className="h-full bg-[#141414] brutalist-border p-8 flex flex-col justify-between min-h-[260px]">
                <div>
                  <div className="w-12 h-12 bg-[#0a0a0a] border border-[#262626] flex items-center justify-center text-[#ff2b2b] mb-6">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-white mb-4">{skill.title}</h3>
                </div>
                <ul className="space-y-2 font-mono text-xs text-[#8e8e93]">
                  {skill.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#ff2b2b]"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ======================= JOURNEY TIMELINE ======================= */}
      <section id="journey" className="py-24 border-b border-[#262626] max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div>
            <span className="font-mono text-xs text-[#ff2b2b] uppercase tracking-widest">// LOGISTICAL_CHRONOLOGY</span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display uppercase mt-2">The Journey</h2>
          </div>
          <span className="font-mono text-sm text-[#8e8e93]">[02 / HISTORY LOG]</span>
        </div>

        <div className="relative border-l border-[#262626] md:ml-12 space-y-12">
          {journey.map((item, idx) => (
            <div key={idx} className="relative pl-8 md:pl-16 group">
              <div className="absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 bg-[#ff2b2b] group-hover:scale-125 transition-transform duration-300"></div>
              
              <div className="bg-[#141414] brutalist-border p-8">
                <span className="font-mono text-xs text-[#ff2b2b] mb-2 block">{item.year} // CHRONO_RECORD</span>
                <h3 className="text-xl font-bold font-display uppercase tracking-tight text-white mb-3">{item.title}</h3>
                <p className="text-[#8e8e93] text-sm leading-relaxed max-w-3xl">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================= SELECTED WORKS ======================= */}
      <section id="projects" className="py-24 border-b border-[#262626] max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div>
            <span className="font-mono text-xs text-[#ff2b2b] uppercase tracking-widest">// REPLICATED_LAB_RESULTS</span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display uppercase mt-2">Featured Projects</h2>
          </div>
          <span className="font-mono text-sm text-[#8e8e93]">[03 / LAB DEPLOYMENTS]</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((proj, idx) => (
            <TiltCard key={idx} className="h-full">
              <div className="h-full bg-[#141414] brutalist-border overflow-hidden flex flex-col justify-between">
                <div className="h-56 relative overflow-hidden bg-black border-b border-[#262626]">
                  <img 
                    src={proj.image} 
                    alt={proj.title} 
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-[#0a0a0a]/90 backdrop-blur-md px-3 py-1 font-mono text-[10px] border border-[#262626] text-[#ff2b2b]">
                    {proj.tag}
                  </div>
                </div>
                
                <div className="p-8 space-y-4">
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-white">{proj.title}</h3>
                  <p className="text-[#8e8e93] text-xs leading-relaxed">{proj.desc}</p>
                  
                  <div className="pt-4 border-t border-[#262626] flex justify-between items-center">
                    <a 
                      href={proj.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-mono text-xs text-white hover:text-[#ff2b2b] flex items-center gap-2 group/btn"
                    >
                      EXECUTE PIPELINE <ChevronRight size={14} className="text-[#ff2b2b] group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ======================= CERTIFICATIONS ======================= */}
      <section id="certs" className="py-24 border-b border-[#262626] max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div>
            <span className="font-mono text-xs text-[#ff2b2b] uppercase tracking-widest">// VALIDATED_SECURITY_CREDENTIALS</span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display uppercase mt-2">Certifications</h2>
          </div>
          <span className="font-mono text-sm text-[#8e8e93]">[04 / SIGNED PROTOCOLS]</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, idx) => (
            <a 
              key={idx} 
              href={cert.link} 
              target="_blank"  
              rel="noopener noreferrer"
              className="bg-[#141414] brutalist-border p-8 flex flex-col justify-between group min-h-[220px]"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-[#0a0a0a] border border-[#262626] flex items-center justify-center text-[#ff2b2b] group-hover:border-[#ff2b2b] transition-all">
                    <Award size={20} />
                  </div>
                  <span className="font-mono text-[10px] text-[#8e8e93]">{cert.date}</span>
                </div>
                <h3 className="text-lg font-bold font-display uppercase tracking-tight text-white mb-1 group-hover:text-[#ff2b2b] transition-colors">{cert.title}</h3>
                <p className="font-mono text-xs text-[#ff2b2b] mb-3">{cert.issuer}</p>
              </div>
              <p className="text-[#8e8e93] text-xs leading-relaxed line-clamp-2">{cert.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ======================= CONTACT SECTION ======================= */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-[#141414] border border-[#262626] p-8 md:p-16 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff2b2b] to-transparent"></div>
          
          <span className="font-mono text-xs text-[#ff2b2b] uppercase tracking-widest">// SECURE_COMMUNICATION_LINK</span>
          <h2 className="text-3xl md:text-6xl font-extrabold font-display uppercase text-white mt-4 mb-6">Initiate Connection</h2>
          
          <p className="text-[#8e8e93] max-w-xl text-sm md:text-base leading-relaxed mb-12">
            Currently accepting developer tasks, threat intelligence partnerships, and security consulting projects. Reach out via the encrypted channels below.
          </p>

          <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
            <a 
              href="mailto:kirti8473@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-black hover:bg-[#ff2b2b] hover:text-white font-mono text-xs font-bold tracking-widest transition-all uppercase flex items-center justify-center gap-2 rounded-none"
            >
              <Mail size={16} />
              <span>SEND EMAIL</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/kirti-vardhan-gupta-1029kv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#0a0a0a] border border-[#262626] hover:border-[#ff2b2b] text-white hover:text-[#ff2b2b] font-mono text-xs font-bold tracking-widest transition-all uppercase flex items-center justify-center gap-2 rounded-none"
            >
              <Linkedin size={16} />
              <span>LINKEDIN</span>
            </a>

            <a 
              href="https://github.com/kv1029" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#0a0a0a] border border-[#262626] hover:border-[#ff2b2b] text-white hover:text-[#ff2b2b] font-mono text-xs font-bold tracking-widest transition-all uppercase flex items-center justify-center gap-2 rounded-none"
            >
              <Github size={16} />
              <span>GITHUB</span>
            </a>
          </div>
        </div>
      </section>

      {/* ======================= FOOTER ======================= */}
      <footer className="py-8 border-t border-[#262626] text-center bg-[#0a0a0a] max-w-7xl mx-auto font-mono text-[11px] text-[#8e8e93]">
        <p>© {new Date().getFullYear()} KIRTI VARDHAN GUPTA. ALL SYSTEM SYSTEMS GO. ENGAGED WITH CYBER RESILIENCE.</p>
      </footer>
    </div>
  );
}
