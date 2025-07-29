import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Calendar, User, Zap, Shield, Database, Server, Code, Smartphone } from 'lucide-react';
import { trackPageView } from '../lib/supabase';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    trackPageView(`/projects/${projectId}`);
  }, [projectId]);

  const projectDetails = {
    'raspberry-pi-iot-gateway': {
      title: "Raspberry Pi IoT Gateway & NAS Server",
      subtitle: "Enterprise-Grade Home Server Solution",
      description: "A comprehensive transformation of a Raspberry Pi 5 into a powerful, secure, and scalable home server infrastructure that rivals commercial NAS solutions.",
      longDescription: `This project represents a complete reimagining of what's possible with single-board computers. By leveraging the Raspberry Pi 5's enhanced capabilities, I've created a production-ready server infrastructure that handles everything from file storage to application hosting, all while maintaining enterprise-level security and performance standards.

The system architecture is built around containerization principles, ensuring scalability, maintainability, and security. Every service runs in its own isolated environment, making the system both robust and easy to manage.`,
      image: "https://i.postimg.cc/0530BpbX/nas3.jpg",
      tech: ["Raspberry Pi 5", "Ubuntu Server", "Docker", "CasaOS", "Tailscale VPN", "Nextcloud", "NVMe SSD", "Portainer", "Cockpit", "Watchtower"],
      features: [
        {
          icon: Server,
          title: "CasaOS Management",
          description: "Clean, intuitive dashboard for managing all Docker-based applications with one-click installations and updates."
        },
        {
          icon: Shield,
          title: "Tailscale VPN",
          description: "Secure mesh VPN providing encrypted remote access from anywhere in the world with zero-configuration networking."
        },
        {
          icon: Database,
          title: "High-Speed Storage",
          description: "1TB Kioxia NVMe G3 Plus SSD delivering up to 5,000 MB/s throughput via GeeekPi N04 M.2 HAT."
        },
        {
          icon: Zap,
          title: "Container Orchestration",
          description: "Docker Compose for service orchestration with Portainer GUI for container management and monitoring."
        }
      ],
      specifications: {
        "Hardware": "Raspberry Pi 5 (4GB RAM)",
        "Storage": "1TB NVMe SSD (5,000 MB/s)",
        "OS": "Ubuntu Server 22.04 LTS",
        "Network": "Gigabit Ethernet + WiFi 6",
        "Power": "27W max consumption",
        "Uptime": "99.9% availability"
      },
      achievements: [
        "Achieved enterprise-grade performance on consumer hardware",
        "Implemented zero-trust security model with VPN access",
        "Created automated backup and monitoring systems",
        "Reduced power consumption by 80% vs traditional servers",
        "Built scalable architecture supporting 20+ concurrent users"
      ],
      gallery: [
        "https://i.postimg.cc/QxTJGH78/nas2.jpg",
        "  ",
        "https://i.postimg.cc/Qtmn7VmG/nas1.jpg"
      ]
    },
    'inventory-management-system': {
      title: "Java Inventory Management System",
      subtitle: "Professional Desktop Application",
      description: "A comprehensive inventory management solution built with Java Swing, featuring real-time stock tracking, secure database operations, and an intuitive user interface designed for business environments.",
      longDescription: `This inventory management system represents a complete business solution designed to handle the complexities of modern inventory tracking. Built with Java's robust ecosystem, it provides a reliable, secure, and user-friendly platform for managing stock levels, processing sales, and maintaining accurate inventory records.

The application follows enterprise software development principles, including secure database connections, parameterized queries to prevent SQL injection, and a modular architecture that ensures maintainability and scalability.`,
      image: "https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE=",
      tech: ["Java SE", "Swing GUI", "MySQL", "JDBC", "PreparedStatement", "DbUtils", "EventQueue"],
      features: [
        {
          icon: Database,
          title: "Secure Database Operations",
          description: "Parameterized SQL queries using PreparedStatement to prevent injection attacks and ensure data integrity."
        },
        {
          icon: Code,
          title: "Professional GUI",
          description: "Clean, intuitive Swing interface with organized panels for different operations and real-time data updates."
        },
        {
          icon: Zap,
          title: "Real-time Updates",
          description: "Instant table refresh after operations with visual feedback through JOptionPane dialogs for user confirmation."
        },
        {
          icon: Shield,
          title: "Data Validation",
          description: "Comprehensive input validation ensuring stock levels are maintained and preventing overselling scenarios."
        }
      ],
      specifications: {
        "Language": "Java SE 8+",
        "GUI Framework": "Swing",
        "Database": "MySQL 8.0",
        "Architecture": "MVC Pattern",
        "Security": "Parameterized Queries",
        "Threading": "Event Dispatch Thread"
      },
      achievements: [
        "Implemented complete CRUD operations with data validation",
        "Designed secure database layer preventing SQL injection",
        "Created intuitive user interface following Java UI guidelines",
        "Built real-time inventory tracking with automatic updates",
        "Developed robust error handling and user feedback systems"
      ],
      gallery: [
        "https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE=",
        "https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE=",
        "https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE="
      ]
    }
  };

  const project = projectId ? projectDetails[projectId as keyof typeof projectDetails] : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link to="/" className="text-purple-400 hover:text-purple-300">
            Return to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.15),transparent_50%)] pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative z-10 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Portfolio</span>
          </Link>
          <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ranbeer Raja
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-purple-400 mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{projectId === 'raspberry-pi-iot-gateway' ? '2025 Project' : '2024 Project'}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent leading-tight">
                {project.title}
              </h1>
              <h2 className="text-xl md:text-2xl text-slate-300 mb-6">
                {project.subtitle}
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                {project.description}
              </p>
              <div className="flex gap-4">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  View Code
                </button>          
              </div>
            </div>
            <div className="relative">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold mb-8 text-center">Technology Stack</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {project.tech.map((tech) => (
              <span 
                key={tech} 
                className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-full text-slate-300 hover:border-purple-500/50 transition-colors duration-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {project.features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center">Project Overview</h3>
          <div className="bg-slate-800/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50">
            <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-line">
              {project.longDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Specifications & Achievements */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Specifications */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
              <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                <div className="space-y-4">
                  {Object.entries(project.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-slate-700/30 last:border-b-0">
                      <span className="text-slate-400">{key}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Key Achievements</h3>
              <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                <div className="space-y-4">
                  {project.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Project Gallery</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {project.gallery.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl">
                <img 
                  src={image} 
                  alt={`${project.title} - Image ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 mb-4">
            Interested in this project or want to collaborate?
          </p>
          <Link 
            to="/#contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 text-white font-medium"
          >
            <User className="w-4 h-4" />
            Get In Touch
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default ProjectDetailPage;