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
  ChevronRight, 
  Award, 
  User,
  Menu,
  X
} from 'lucide-react';

// --- Components ---

// Typewriter Effect Component
const Typewriter = ({ texts }) => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Cursor blinking effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  // Typing logic
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
    }, Math.max(reverse ? 75 : subIndex === texts[index].length ? 2000 : 150, parseInt(Math.random() * 30)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  useEffect(() => {
     setText(texts[index].substring(0, subIndex));
  }, [subIndex, index, texts]);

  return (
    <span>
      {text}
      <span className={`ml-1 text-cyan-400 ${blink ? 'opacity-100' : 'opacity-0'}`}>|</span>
    </span>
  );
};

// Background Particle Animation Component
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle Config
    // INCREASED DENSITY: Changed divisor from 8 to 4 and cap from 100 to 300
    const particleCount = Math.min(window.innerWidth / 4, 300); 
    const connectionDistance = 140; // Slightly reduced to keep connections clean with more particles
    const mouseDistance = 250;

    let mouse = { x: null, y: null };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // 3D Depth Factor (z-index simulation)
        // 0.5 (far) to 2.0 (close) - Adjusted for better visibility
        this.z = Math.random() * 1.5 + 0.5; 
        
        // Size scales with depth
        this.size = Math.random() * 1.5 * this.z + 1; 
        
        // Speed scales with depth (Parallax Effect)
        const speedFactor = this.z * 0.2;
        this.vx = (Math.random() - 0.5) * speedFactor; 
        this.vy = (Math.random() - 0.5) * speedFactor;
        
        // Base color selection (Cyan or Purple)
        this.baseColor = Math.random() > 0.5 ? '34, 211, 238' : '168, 85, 247'; 
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseDistance) {
             const forceDirectionX = dx / distance;
             const forceDirectionY = dy / distance;
             const force = (mouseDistance - distance) / mouseDistance;
             const reactionStrength = 2 * this.z;
             const directionX = forceDirectionX * force * reactionStrength;
             const directionY = forceDirectionY * force * reactionStrength;
             this.x -= directionX;
             this.y -= directionY;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Opacity scales with depth
        const opacity = Math.min(this.z * 0.4, 0.8);
        ctx.fillStyle = `rgba(${this.baseColor}, ${opacity})`;
        ctx.fill();
      }
    }

    // Init Particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          if (distance < connectionDistance) {
            // Calculate combined depth factor for the line
            const avgZ = (particles[i].z + particles[j].z) / 2;
            const opacity = (0.15 - distance/connectionDistance * 0.15) * avgZ * 0.5;
            
            if (opacity > 0.01) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.lineWidth = 0.5 * avgZ; 
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0610] via-[#11081f] to-[#0b0610]" />
      {/* Canvas on top of gradient */}
      <canvas ref={canvasRef} className="block w-full h-full relative z-10" />
    </div>
  );
};

// 3D Tilt Card Component
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
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

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
        className="transition-transform duration-200 ease-out preserve-3d relative h-full"
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(139, 92, 246, 0.2), transparent 70%)`,
            zIndex: 0
          }}
        />
        {children}
      </div>
    </div>
  );
};

// Section Header
const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-12 text-center relative z-10">
    <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-mono mb-3 tracking-wider">
      {subtitle}
    </span>
    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
      {title}
      <span className="text-purple-500">.</span>
    </h2>
    <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full" />
  </div>
);

// Navigation
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0b0610]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-2xl text-white tracking-tighter cursor-pointer z-50" onClick={() => scrollTo('home')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-black shadow-lg shadow-purple-500/20">
            ∑
          </div>
          <span>K.V<span className="text-gray-500">.dev</span></span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-300">
          {['Home', 'Skills', 'Journey', 'Projects', 'Certs', 'Contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollTo(item.toLowerCase())}
              className="hover:text-cyan-400 transition-colors uppercase tracking-wide"
            >
              {item}
            </button>
          ))}
          <button onClick={() => scrollTo('contact')} className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all text-white">
            Hire Me
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white z-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 z-40 animate-fade-in">
             {['Home', 'Skills', 'Journey', 'Projects', 'Certs', 'Contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollTo(item.toLowerCase())}
              className="text-2xl font-bold text-white hover:text-cyan-400"
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

// Main App
export default function App() {
  
  // Data
  const skills = [
    { icon: <Terminal size={24} />, title: "Programming", items: ["Java", "Python", "JavaScript", "C++"] },
    { icon: <Shield size={24} />, title: "Cyber Security", items: ["Network Security", "Ethical Hacking", "Cryptography", "Linux"] },
    { icon: <Globe size={24} />, title: "Web Dev", items: ["React", "Node.js", "HTML/CSS", "Tailwind"] },
    { icon: <Database size={24} />, title: "Backend/Cloud", items: ["SQL", "AWS Basics", "Networking", "REST APIs"] },
  ];

  // Added missing journey data
  const journey = [
    { year: "2022", title: "High School Education", text: "Completed 10th." },
    { year: "2024", title: "12th Education Completed", text: "Completed 12th from Ryan International School with physics, chemistry and maths." },
    { year: "2024", title: "Undergrad at GLA", text: "Started B.Tech in Computer Science at GLA University, building a strong foundation." },
    { year: "2024", title: "Web Development", text: "Dived deep into Full Stack development, mastering React, Node.js and modern UI frameworks." },
    { year: "2025", title: "Cyber Security Focus", text: "Shifted focus towards Network Security and Ethical Hacking, bridging the gap between dev and sec." },
    { year: "2025", title: "Professional Growth", text: "Gaining real-world experience through internships and advanced certifications." }
  ];

  // --- CERTIFICATES CONFIGURATION ---
  const certificates = [
    { 
      title: "Networking Basics", 
      issuer: "Cisco Networking Academy", 
      date: "Nov 2025", 
      desc: "Proficient in network communication concepts, IPv4/IPv6, and troubleshooting.",
      link: "/networking.pdf" 
    },
    { 
      title: "Cyber Internship", 
      issuer: "CYBERZERO & Council", 
      date: "45 Days", 
      desc: "Practical knowledge across various domains of cybersecurity.",
      link: "/internship.pdf" 
    },
    { 
      title: "Java (Basic)", 
      issuer: "HackerRank", 
      date: "Nov 2025", 
      desc: "Passed the HackerRank skill certification test for Java proficiency.",
      link: "/java_basic certificate.pdf" 
    },
    { 
      title: "Cyber Job Sim", 
      issuer: "Mastercard (Forage)", 
      date: "Sept 2025", 
      desc: "Phishing email simulation design and result interpretation.",
      link: "/cyberjo.pdf" 
    },
    { 
      title: "Cyber Job Sim", 
      issuer: "Deloitte (Forage)", 
      date: "Sept 2025", 
      desc: "Completed practical tasks in Cyber security consulting.",
      link: "/cyber.pdf" 
    },
    { 
      title: "Solutions Architect", 
      issuer: "AWS (Forage)", 
      date: "Sept 2025", 
      desc: "Designed simple, scalable hosting architecture.",
      link: "/archi.pdf" 
    },
  ];

  const projects = [
    {
      title: "Phishing URL Detector",
      tag: "AI MODEL",
      desc: "Lightweight ML + heuristics prototype for detecting malicious URLs and emails. Uses pattern recognition to flag potential threats.To indentify the url and pdf file it uses ai gemini model ",
      color: "from-red-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
      // ADDED LINK HERE
      link: "https://phishing-url-detector-weld.vercel.app/"
    },
    {
      title: "AI Interviewer - Powered by Gemini",
      tag: "AI / LLM",
      desc: "This project is an intelligent, automated interview simulation platform built using Google's Gemini model. It is designed to conduct realistic technical and behavioral interviews, providing candidates with real-time interaction and feedback",
      color: "from-blue-500 to-cyan-600",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      // ADDED LINK HERE
      link: "https://ai-interview-three-khaki.vercel.app/"
    },
    {
      title: "Showcase model for Shop",
      tag: "E-Commerce",
      desc: "Interactive digital catalog designed to elegantly display products and enhance user engagement for retail businesses.",
      image: "https://img.freepik.com/free-photo/courage-man-jump-through-gap-hill-business-concept-idea_1323-262.jpg?semt=ais_hybrid&w=740&q=80", 
      color: "from-green-500 to-emerald-600",
      // Placeholder link
      link: "#"
    },
  ];

  return (
    // Note: removed bg-[#0b0610] here so it doesn't cover the fixed background
    <div className="min-h-screen text-slate-200 font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>

      {/* Animated Particle Background - Now handles the dark background itself */}
      <ParticleBackground />

      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative z-10 min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-mono text-cyan-300">System Online</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight min-h-[160px] md:min-h-[auto]">
              Hello, I'm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient-x block mt-2">
                <Typewriter 
                  texts={[
                    "Kirti Vardhan Gupta", 
                    "Problem Solver", 
                    "a Full Stack Developer",
                    "a Malware Analyst"
                  ]} 
                />
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
              Driven Computer Science student passionate about solving real-world problems through code. I specialize in Android development and AI integration, having built applications like 'Thread Guard' (a scam detection tool) and an AI-powered Voice Interviewer. With a strong foundation in Java, Python (Flask), and Cybersecurity, I aim to build secure, intelligent, and user-centric software solutions
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => document.getElementById('projects').scrollIntoView({behavior:'smooth'})} className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all flex items-center gap-2">
                Explore Work <ChevronRight size={18} />
              </button>
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=kirti8473@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center gap-2"
              >
                Contact Me
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-gray-500">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-purple-500" />
                <span className="text-sm">Security Focused</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-cyan-500" />
                <span className="text-sm">Full Stack Capable</span>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Card */}
          <div className="hidden lg:block relative z-20">
            <TiltCard className="w-full max-w-md mx-auto aspect-[4/5]">
              <div className="h-full w-full bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl flex flex-col items-center justify-between relative overflow-hidden group">
                
                {/* Decorative Grid inside card */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20"></div>
                
                {/* Top Badge */}
                <div className="w-full flex justify-between items-center relative z-10">
                  <div className="text-xs font-mono text-gray-500">ID: 1029KV</div>
                  <div className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">ADMIN</div>
                </div>

                {/* Avatar Area */}
                <div className="relative z-10">
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-1 shadow-[0_0_50px_rgba(168,85,247,0.4)] relative group-hover:shadow-[0_0_80px_rgba(0,229,255,0.4)] transition-shadow duration-500">
                  <div className="w-full h-full bg-gray-950 rounded-xl flex items-center justify-center overflow-hidden relative">
                    {/* REPLACED ICON WITH IMAGE HERE */}
                    <img 
                      src="/profile.png" // <--- Make sure your file in 'public' is named profile.jpg
                      alt="Kirti Vardhan Gupta" 
                      className="w-full h-full object-cover relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-20"></div>
                  </div>
                </div>
                </div>

                {/* Info */}
                <div className="text-center relative z-10 mt-6">
                  <h3 className="text-2xl font-bold text-white tracking-wide">Kirti Vardhan Gupta</h3>
                  <p className="text-cyan-400 font-mono text-sm mt-1 bg-cyan-950/30 px-2 py-0.5 rounded inline-block">@CyberAnalyst</p>
                  
                  <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-xl font-bold text-white">10+</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Certificates</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-xl font-bold text-white">5+</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Projects</div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Technical Arsenal" subtitle="SKILLS & TOOLS" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, idx) => (
              <TiltCard key={idx}>
                <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/[0.08] hover:border-cyan-500/30 transition-all group shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all border border-white/5">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{skill.title}</h3>
                  <ul className="space-y-2">
                    {skill.items.map((item, i) => (
                      <li key={i} className="flex items-center text-gray-400 text-sm">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 shadow-[0_0_5px_rgba(168,85,247,0.8)]"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Timeline Section */}
      <section id="journey" className="py-24 relative z-10">
        <div className="absolute inset-0 bg-black/40 -z-10 backdrop-blur-[1px]"></div>
        <div className="max-w-4xl mx-auto px-6">
          <SectionTitle title="The Journey" subtitle="TIMELINE" />
          
          <div className="relative border-l border-white/10 ml-6 md:ml-0 space-y-12">
            {journey.map((item, idx) => (
              <div key={idx} className="relative pl-12 md:pl-24 group">
                {/* Dot */}
                <div className="absolute -left-[5px] top-0 w-3 h-3 bg-cyan-500 rounded-full ring-4 ring-black group-hover:bg-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.8)] transition-all"></div>
                
                {/* Year Label */}
                <div className="hidden md:block absolute left-[-60px] top-[-5px] font-mono text-cyan-500 font-bold group-hover:text-purple-400 transition-colors">{item.year}</div>
                
                {/* Card */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-purple-500/50 hover:bg-white/[0.08] transition-all backdrop-blur-sm">
                  <span className="md:hidden font-mono text-cyan-500 text-sm mb-2 block">{item.year}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Featured Projects" subtitle="WORK & LABS" />
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((proj, idx) => (
              <TiltCard key={idx} className="h-full">
                <div className="h-full bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden group hover:border-cyan-500/30 transition-all shadow-lg hover:shadow-cyan-900/20">
                  {/* Visual Header */}
                  <div className={`h-48 relative overflow-hidden group`}>
                    {/* Background: Image or Gradient Fallback */}
                    {proj.image ? (
                        <img 
                          src={proj.image} 
                          alt={proj.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                    ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${proj.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    )}
                    
                    {/* Overlay to ensure text readability if needed, plus noise texture for style */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                    {/* Tag */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-white/10 text-white shadow-lg z-10">
                      {proj.tag}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{proj.title}</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {proj.desc}
                    </p>
                    <div className="flex items-center gap-4">
                        <button 
                          onClick={() => window.open(proj.link, '_blank')} // UPDATED ONCLICK
                          className="text-sm font-bold text-white flex items-center gap-2 hover:gap-3 transition-all"
                        >
                          View Details <ChevronRight size={16} className="text-purple-500" />
                        </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certs" className="py-24 relative z-10">
        <div className="absolute inset-0 bg-black/40 -z-10"></div>
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Certifications" subtitle="ACHIEVEMENTS" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, idx) => (
              <a 
                key={idx} 
                href={cert.link} // Direct Link here
                target="_blank"  // Open in new tab
                rel="noopener noreferrer"
                className="block bg-white/5 backdrop-blur-sm hover:bg-white/[0.08] border border-white/10 p-6 rounded-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-900/10 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-cyan-400/50 group-hover:text-cyan-400 transition-colors">
                    <ExternalLink size={18} />
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-500/20 transition-colors">
                    <Award size={24} />
                  </div>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-gray-400">{cert.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1" title={cert.title}>{cert.title}</h3>
                <p className="text-cyan-400 text-sm mb-3">{cert.issuer}</p>
                <p className="text-gray-400 text-sm leading-relaxed text-justify opacity-80">
                  {cert.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionTitle title="Get In Touch" subtitle="CONNECT" />
          
          <div className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
            {/* Glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm group-hover:w-96 transition-all duration-700"></div>
            
            <p className="text-xl text-gray-300 mb-8">
              I am currently open to internship opportunities and collaborative projects in 
              <span className="text-white font-bold"> Cyber Security</span> and <span className="text-white font-bold">Development</span>.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-4 flex-wrap">
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=kirti8473@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <Mail size={20} />
                <span>Send Email</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/kirti-vardhan-gupta-1029kv" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-black border border-white/20 text-white rounded-xl font-bold hover:border-cyan-500 hover:text-cyan-400 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              >
                <Linkedin size={20} />
                <span>LinkedIn Profile</span>
                <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0" />
              </a>
              <a 
                href="https://github.com/kv1029" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-black border border-white/20 text-white rounded-xl font-bold hover:border-purple-500 hover:text-purple-400 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              >
                <Github size={20} />
                <span>GitHub Profile</span>
                <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center relative z-10 bg-[#050208]">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Kirti Vardhan Gupta. Crafted with React & Tailwind.
        </p>
      </footer>

    </div>
  );
}