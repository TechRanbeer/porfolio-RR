import React, { useState, useEffect } from 'react';
import { ChevronDown, Github, Linkedin, Mail, ExternalLink, Code, Cpu, Zap, Wrench, Settings, Layers, Smartphone, MessageCircle, Bot, Sparkles, FileText, Instagram } from 'lucide-react';
import { ChatBot } from './components/ChatBot';
import { ContactModal } from './components/ContactModal';
import { trackPageView, trackProjectView } from './lib/supabase';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [currentRole, setCurrentRole] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const roles = [
    'Mechanical Engineer',
    'Raspberry PI Dev',
    'Practical Coder',
    'Firmware Explorer',
    'ARM chips Researcher'
  ];

  useEffect(() => {
    trackPageView(window.location.pathname);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const projects = [
    {
      id: 'raspberry-pi-iot-gateway',
      title: "Raspberry Pi IoT Gateway & NAS Server",
      description: "Transformed Raspberry Pi 5 into a full-fledged remote-access NAS and self-hosting server with Docker containerization, secure VPN access, and high-speed NVMe storage",
      tech: ["Raspberry Pi 5", "Ubuntu", "Docker", "CasaOS", "Tailscale", "Nextcloud", "NVMe SSD"],
      image: "https://www.techsmith.com/wp-content/uploads/2022/03/resize-image.png",
      highlights: ["4GB RAM + 1TB NVMe SSD", "Remote VPN Access", "Docker Containerization", "Real-time Monitoring"]
    },
    {
      id: 'inventory-management-system',
      title: "Java Inventory Management System",
      description: "Professional GUI-based inventory management system built with Java Swing and MySQL, featuring complete CRUD operations, real-time stock tracking, and secure database integration",
      tech: ["Java", "Swing GUI", "MySQL", "JDBC", "PreparedStatement"],
      image: "https://www.techsmith.com/wp-content/uploads/2022/03/resize-image.png",
      highlights: ["Real-time Stock Management", "Secure SQL Operations", "Professional GUI", "Complete CRUD System"]
    }
  ];

  const expertise = [
    {
      icon: Settings,
      title: "Mechanical Design",
      description: "CAD modeling, prototyping, and manufacturing processes",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Cpu,
      title: "Embedded Systems",
      description: "ARM microcontrollers, firmware development, and IoT solutions",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Code,
      title: "Programming",
      description: "C/C++, Python, and embedded software development",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Electronics",
      description: "Circuit design, PCB layout, and hardware debugging",
      color: "from-orange-500 to-red-500"
    }
  ];

  const [geminiData, setGeminiData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Gemini data
  const fetchGeminiData = async () => {
    try {
      const response = await fetch('/.netlify/functions/gemini'); // Call the Netlify function
      const data = await response.json();
      setGeminiData(data); // Update state with the data
    } catch (err) {
      setError('Error fetching data');
      console.error('Error fetching Gemini data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeminiData(); // Fetch data when component mounts
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.15),transparent_50%)] pointer-events-none"></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ranbeer Raja
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="text-slate-300 hover:text-white transition-colors duration-300">About</a>
            <a href="#projects" className="text-slate-300 hover:text-white transition-colors duration-300">Projects</a>
            <a href="/chat" className="text-slate-300 hover:text-white transition-colors duration-300">AI Chat</a>
            <a href="#contact" className="text-slate-300 hover:text-white transition-colors duration-300">Contact</a>
          </div>
          <button 
            onClick={() => setIsContactModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
          >
            Get In Touch
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Name - Extra Large */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent leading-tight">
            RANBEER RAJA
          </h1>
          
          {/* Animated Subtitle - Large */}
          <div className="mb-12 h-16 md:h-20 overflow-hidden">
            <div 
              className="transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateY(-${currentRole * (window.innerWidth >= 768 ? 80 : 64)}px)` }}
            >
              {roles.map((role, index) => (
                <h2 key={index} className="text-3xl md:text-5xl font-light text-slate-300 h-16 md:h-20 flex items-center justify-center">
                  {role}
                </h2>
              ))}
            </div>
          </div>

          {/* Engineering meets innovation - Medium */}
          <h3 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
            Engineering meets{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              innovation
            </span>
          </h3>

          {/* Description - Regular */}
          <div className="max-w-3xl mx-auto mb-12 space-y-4">
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Passionate about mechanical engineering, embedded systems, and bringing innovative hardware solutions to life through code and creativity.
            </p>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              My expertise spans from traditional mechanical engineering principles to modern embedded programming, with a particular love for ARM-based microcontrollers.
            </p>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              I specialize in creating innovative solutions that combine mechanical design with cutting-edge electronics and firmware development.
            </p>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Always exploring new firmware possibilities and pushing the boundaries of what's possible with embedded systems and Raspberry Pi platforms.
            </p>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              I believe in practical coding approaches that solve real-world engineering challenges, bridging the gap between hardware and software worlds.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={() => window.location.href = '/chat'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <Bot className="w-5 h-5" />
              Chat with AI Me
            </button>
            <button 
              onClick={() => window.open('/Resume main.pdf', '_blank')}
              className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-slate-500 px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              View Resume
            </button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            <a 
              href="https://github.com/TechRanbeer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-600 hover:border-slate-500"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/ranbeer-raja-10626532a/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-600 hover:border-slate-500"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="mailto:ranbeerraja1@gmail.com"
              className="w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-600 hover:border-slate-500"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a 
              href="https://www.instagram.com/ranbe3r.24_/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-600 hover:border-slate-500"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 px-6" id="about">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Expertise
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Combining mechanical engineering principles with modern technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((item, index) => (
              <div 
                key={item.title}
                className="group bg-slate-800/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:scale-105"
                style={{
                  transform: `translateY(${Math.max(0, 30 - (scrollY - 600 - index * 100) * 0.1)}px)`,
                  opacity: Math.max(0, Math.min(1, (scrollY - 400 - index * 100) / 300))
                }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-6" id="projects">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Showcasing innovative solutions that bridge mechanical engineering with modern technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.title}
                className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
                style={{
                  transform: `translateY(${Math.max(0, 30 - (scrollY - 1200 - index * 100) * 0.1)}px)`,
                  opacity: Math.max(0, Math.min(1, (scrollY - 1000 - index * 100) / 300))
                }}
              >
                <div className="h-56 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  {project.highlights && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.highlights.map((highlight) => (
                          <span key={highlight} className="bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-500/30">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span key={tech} className="bg-slate-700/50 text-xs px-3 py-2 rounded-full border border-slate-600/50 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a 
                      href={`/projects/${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackProjectView(project.id)}
                      className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      Details
                    </a>
                    <a 
                      href={`/projects/${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackProjectView(project.id)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6" id="contact">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              I'm always excited to work on new projects and collaborate with amazing people. Whether you have a specific project in mind or just want to explore possibilities, I'd love to hear from you. When I'm not coding, you'll find me on the basketball court, practicing karate (I'm a black belt!), or strategizing over a chess game.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-slate-800/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Chat with AI Me</h3>
                <p className="text-slate-300 mb-6">
                  I've created an AI assistant that knows everything about my experience, projects, and expertise. 
                  It can answer your questions instantly, 24/7!
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-purple-300 mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span>Powered by advanced AI • Always available</span>
                </div>
                <button 
                  onClick={() => window.location.href = '/chat'}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 mb-4"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chatting
                </button>
                <p className="text-xs text-slate-400">
                  Ask about my projects, skills, experience, or anything else!
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-slate-400 text-sm">ranbeerraja1@gmail.com</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] text-white font-medium"
                >
                  Send Message
                </button>
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-slate-400 text-sm">+91 Ranbeer</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Mon-Fri from 9am to 6pm</p>
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-slate-400 text-sm">Located in India</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">Available for remote work</p>
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                <h4 className="font-semibold mb-3">Beyond Engineering</h4>
                <p className="text-slate-400 text-sm mb-3">
                  🥋 Karate Black Belt & Former Instructor<br/>
                  🏀 Basketball Enthusiast<br/>
                  ♟️ Chess Strategist<br/>
                  ⚽ Football Player<br/>
                  🐎 Horse Riding Experience
                </p>
                <p className="text-xs text-slate-500">
                  I believe in balancing technical excellence with physical and mental wellness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <p>&copy; 2025 Ranbeer Raja. Crafted with passion for innovation.</p>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      
      {/* Floating Contact Button */}
      <button
        onClick={() => setIsContactModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
      >
        <Mail className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

export default App;
