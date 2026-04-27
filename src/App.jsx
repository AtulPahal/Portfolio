import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const VolumeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

const MuteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);

const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ParticleSphere = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;

    let particles = [];
    const mouse = { x: -1000, y: -1000, radius: 80 };

    const handleMouseMove = (e) => { 
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left; 
        mouse.y = e.clientY - rect.top; 
    };
    const handleMouseOut = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);

    class Particle {
        constructor(baseX, baseY, baseZ) {
            this.baseX = baseX;
            this.baseY = baseY;
            this.baseZ = baseZ;
            
            this.x = (Math.random() - 0.5) * width;
            this.y = (Math.random() - 0.5) * height;
            
            this.vx = 0;
            this.vy = 0;
            this.friction = 0.88;
            this.ease = 0.05;
            this.size = 1.2;
            this.color = 'rgba(92, 36, 255, 1)';
        }

        draw(zDepth) {
            const alpha = Math.max(0.1, (zDepth + 1) / 2);
            ctx.fillStyle = this.color.replace(/[\d\.]+\)$/g, `${alpha})`); 
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        update(destX, destY) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                this.vx -= (dx / distance) * force * 2;
                this.vy -= (dy / distance) * force * 2;
            }

            this.vx += (destX - this.x) * this.ease;
            this.vy += (destY - this.y) * this.ease;
            
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.x += this.vx;
            this.y += this.vy;
        }
    }

    const numParticles = 400;
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    
    for (let i = 0; i < numParticles; i++) {
        let y = 1 - (i / (numParticles - 1)) * 2; 
        let radiusAtY = Math.sqrt(1 - y * y);
        let theta = phi * i;
        
        let x = Math.cos(theta) * radiusAtY;
        let z = Math.sin(theta) * radiusAtY;
        
        particles.push(new Particle(x, y, z));
    }

    let angleY = 0;
    let angleX = 0.2;
    let animationFrameId;

    function drawConnections() {
        const maxDistance = 25; 
        
        for (let i = 0; i < particles.length; i++) {
            if (particles[i].zDepth < 0) continue; 
            
            for (let j = i + 1; j < particles.length; j++) {
                if (particles[j].zDepth < 0) continue;
                
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distanceSq = dx * dx + dy * dy;

                if (distanceSq < maxDistance * maxDistance) {
                    const distance = Math.sqrt(distanceSq);
                    const opacity = (1 - (distance / maxDistance)) * 0.4 * particles[i].alphaMod;
                    
                    ctx.strokeStyle = `rgba(92, 36, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        angleY -= 0.005; 
        
        const sphereRadius = Math.min(width, height) * 0.4;
        const centerX = width / 2;
        const centerY = height / 2;
        
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        
        for (let p of particles) {
            let rotX = p.baseX * cosY - p.baseZ * sinY;
            let rotZ = p.baseX * sinY + p.baseZ * cosY;
            
            let finalY = p.baseY * cosX - rotZ * sinX;
            let finalZ = p.baseY * sinX + rotZ * cosX;
            let finalX = rotX;
            
            p.zDepth = finalZ;
            p.alphaMod = Math.max(0, (finalZ + 1) / 2); 
            
            let destX = centerX + finalX * sphereRadius;
            let destY = centerY + finalY * sphereRadius;
            
            p.update(destX, destY);
        }
        
        drawConnections();
        
        particles.sort((a, b) => a.zDepth - b.zDepth);
        for (let p of particles) {
            p.draw(p.zDepth);
        }
        
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} id="neuralCanvas"></canvas>;
};

const PenguinCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dotColor = '#5c24ff';
    const lineColor = '92, 36, 255';
    const numParticles = 350;
    const connectionDistance = 30;
    const mouse = { x: null, y: null, radius: 80 };
    let particles = [];
    let animationFrameId;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseOut = () => { mouse.x = null; mouse.y = null; };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);

    function isInsidePenguin(x, y, cx, cy) {
      let dx1 = x - cx, dy1 = y - (cy - 110);
      if (dx1 * dx1 + dy1 * dy1 <= 45 * 45) return true;
      let dx2 = x - cx, dy2 = y - (cy + 20);
      if ((dx2 * dx2) / (90 * 90) + (dy2 * dy2) / (140 * 140) <= 1) return true;
      let dx3 = x - (cx - 75), dy3 = y - (cy + 10);
      let rx3 = dx3 * Math.cos(-0.3) - dy3 * Math.sin(-0.3);
      let ry3 = dx3 * Math.sin(-0.3) + dy3 * Math.cos(-0.3);
      if ((rx3 * rx3) / (20 * 20) + (ry3 * ry3) / (90 * 90) <= 1) return true;
      let dx4 = x - (cx + 75), dy4 = y - (cy + 10);
      let rx4 = dx4 * Math.cos(0.3) - dy4 * Math.sin(0.3);
      let ry4 = dx4 * Math.sin(0.3) + dy4 * Math.cos(0.3);
      if ((rx4 * rx4) / (20 * 20) + (ry4 * ry4) / (90 * 90) <= 1) return true;
      let dx5 = x - (cx - 40), dy5 = y - (cy + 155);
      if ((dx5 * dx5) / (30 * 30) + (dy5 * dy5) / (10 * 10) <= 1) return true;
      let dx6 = x - (cx + 40), dy6 = y - (cy + 155);
      if ((dx6 * dx6) / (30 * 30) + (dy6 * dy6) / (10 * 10) <= 1) return true;
      return false;
    }

    function initParticles(cx, cy) {
      particles = [];
      let attempts = 0;
      while (particles.length < numParticles && attempts < 20000) {
        let px = cx - 150 + Math.random() * 300;
        let py = cy - 200 + Math.random() * 400;
        if (isInsidePenguin(px, py, cx, cy)) {
          particles.push({
            x: px, y: py,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
          });
        }
        attempts++;
      }
    }

    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      initParticles(cx, cy);
    }

    resize();
    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        let nextX = p1.x + p1.vx;
        let nextY = p1.y + p1.vy;
        if (!isInsidePenguin(nextX, nextY, cx, cy)) {
          p1.vx *= -1; p1.vy *= -1;
        } else {
          p1.x = nextX; p1.y = nextY;
        }

        if (mouse.x != null && mouse.y != null) {
          let dxM = p1.x - mouse.x, dyM = p1.y - mouse.y;
          let distM = Math.sqrt(dxM * dxM + dyM * dyM);
          if (distM < mouse.radius) {
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${1 - distM / mouse.radius})`;
            ctx.lineWidth = 1.2; ctx.stroke();
            let fx = dxM / distM, fy = dyM / distM;
            let force = (mouse.radius - distM) / mouse.radius;
            let pushX = p1.x + fx * force * 2.5;
            let pushY = p1.y + fy * force * 2.5;
            if (isInsidePenguin(pushX, pushY, cx, cy)) { p1.x = pushX; p1.y = pushY; }
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p1.x - p2.x, dy = p1.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${1 - dist / connectionDistance})`;
            ctx.lineWidth = 0.8; ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = dotColor; ctx.fill();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [roleText, setRoleText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const footerRef = useRef(null);

  const roles = ['AI Developer', 'AI Engineering', 'Web Developer'];

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout;
    if (!isDeleting) {
      if (roleText.length < currentRole.length) {
        timeout = setTimeout(() => setRoleText(currentRole.slice(0, roleText.length + 1)), 90);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 1600);
      }
    } else {
      if (roleText.length > 0) {
        timeout = setTimeout(() => setRoleText(roleText.slice(0, -1)), 50);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [roleText, isDeleting, roleIndex]);
  const audioRef = useRef(null);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  // Intersection Observer for Footer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Control play/pause via state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundEnabled) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [soundEnabled]);

  // Autoplay on first user interaction (browser policy workaround)
  useEffect(() => {
    const unlock = () => {
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
      document.removeEventListener('scroll', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
    document.addEventListener('scroll', unlock);
    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
      document.removeEventListener('scroll', unlock);
    };
  }, []);

  const handleEnter = () => {
    setShowIntro(false);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };


  // Intersection Observer for Active Section Highlighting
  useEffect(() => {
    const sections = document.querySelectorAll('section, header#hero');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'hero') {
             setActiveSection('');
          } else {
             setActiveSection(entry.target.id);
          }
        }
      });
    }, { threshold: 0.4 });
    
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // (Removed postMessage logic)

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleSound = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSoundEnabled(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="app-container">
      {showIntro && (
        <div className="intro-overlay" onClick={handleEnter}>
          <div className="intro-content">
            <div className="intro-logo">Atul</div>
            <p className="intro-sub">Atul Pahal · AI Developer</p>
            <button className="intro-btn">
              <span className="intro-btn-dot"></span>
              ENTER SITE
            </button>
            <p className="intro-hint">Click anywhere to continue</p>
          </div>
        </div>
      )}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="nav-logo" onClick={(e) => handleSmoothScroll(e, 'home')}>Atul</div>
          
          <div className="nav-center">
            <a href="#work" className={activeSection === 'work' ? 'active' : ''} onClick={(e) => handleSmoothScroll(e, 'work')}>WORK</a>
            <a href="#about" className={activeSection === 'about' ? 'active' : ''} onClick={(e) => handleSmoothScroll(e, 'about')}>ABOUT</a>
            <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={(e) => handleSmoothScroll(e, 'contact')}>CONTACT</a>
          </div>
          
          <div className="nav-right">
            <div className="nav-icon" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </div>
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <a href="#work" onClick={(e) => handleSmoothScroll(e, 'work')} className={activeSection === 'work' ? 'active' : ''}>WORK</a>
        <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className={activeSection === 'about' ? 'active' : ''}>ABOUT</a>
        <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className={activeSection === 'contact' ? 'active' : ''}>CONTACT</a>
      </div>

      {/* Floating Sound Toggle */}
      <div 
        className={`floating-sound ${isFooterVisible ? 'hidden' : ''}`} 
        onClick={toggleSound}
        title="Toggle Sound"
      >
        {soundEnabled ? <VolumeIcon /> : <MuteIcon />}
      </div>

      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        style={{ display: 'none' }}
        onCanPlayThrough={() => {
          if (soundEnabled && audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }}
      />

      <header id="hero">
        <div className="canvas-container">
          <ParticleSphere />
        </div>
        
        <div className="hero-content">
          <h1 className="hero-heading">
            Hello, I'm<br />
            <span className="role-typed">{roleText}<span className="cursor-blink">|</span></span>
          </h1>
          <p className="hero-subtitle">I build intelligent systems and precise digital experiences — bridging cutting-edge AI with fluid, modern web interfaces.</p>
          
          <div className="hero-actions">
            <a href="#work" onClick={(e) => handleSmoothScroll(e, 'work')} className="btn btn-primary">VIEW PROJECTS</a>
            <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="btn btn-outline">READ LOG</a>
          </div>
          
          <div className="tech-grid">
            <div className="tech-card">
              <span className="tech-num">01 //</span>
              <span className="tech-name">PYTORCH</span>
            </div>
            <div className="tech-card">
              <span className="tech-num">02 //</span>
              <span className="tech-name">TensorFlow</span>
            </div>
            <div className="tech-card">
              <span className="tech-num">03 //</span>
              <span className="tech-name">SCIKIT-LEARN</span>
            </div>
            <div className="tech-card">
              <span className="tech-num">04 //</span>
              <span className="tech-name">PYTHON</span>
            </div>
          </div>
        </div>
      </header>

      <section id="work">
        <div className="section-header">
          <h2>Selected Works</h2>
          <p>A collection of technical projects, open-source contributions, and experimental interfaces exploring the intersection of design and robust engineering.</p>
        </div>

        <div className="work-grid">
          <a href="https://movie-recomender-ashy.vercel.app/" target="_blank" rel="noreferrer" className="work-card large">
            <div className="work-img placeholder-1"></div>
            <div className="work-info">
              <div className="work-tags">PYTHON SCIKIT-LEARN STREAMLIT</div>
              <h3>Movie Recommendation System</h3>
              <p>An intelligent movie recommendation engine that suggests personalized content by analyzing user ratings and content similarities using machine learning algorithms.</p>
            </div>
          </a>
          
          <a href="https://image-detection-yaby.vercel.app/" target="_blank" rel="noreferrer" className="work-card">
            <div className="work-img placeholder-2"></div>
            <div className="work-info">
              <div className="work-tags">PYTHON TensorFlow OPENCV</div>
              <h3>Image Detection System</h3>
              <p>A sophisticated real-time image detection system that leverages deep learning and computer vision to identify and classify objects within visual data with high accuracy.</p>
            </div>
          </a>

          <a href="https://github.com/AtulPahal/spam-detection" target="_blank" rel="noreferrer" className="work-card">
            <div className="work-img placeholder-3"></div>
            <div className="work-info">
              <div className="work-tags">PYTHON SCIKIT-LEARN STREAMLIT</div>
              <h3>Spam Detection System</h3>
              <p>A machine learning-powered application that classifies messages as spam or ham using Natural Language Processing and Streamlit for the user interface.</p>
            </div>
          </a>

          <a href="https://github.com/AtulPahal/AI-Based-Crop-Health-Capstone" target="_blank" rel="noreferrer" className="work-card large-horizontal">
            <div className="work-img placeholder-4"></div>
            <div className="work-info">
              <div className="work-tags">AI COMPUTER VISION IOT</div>
              <h3>AI Based Crop Health Monitoring System</h3>
              <p>An intelligent system developed to monitor and analyze crop health through AI and computer vision, enabling early identification of diseases and optimizing agricultural yields.</p>
            </div>
          </a>
        </div>
        
        <div className="work-cta">
          <p>Let's build something.</p>
          <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="btn btn-primary">START A CONVERSATION</a>
        </div>
      </section>

      <section id="about">
        <div className="about-grid">
          <div className="about-text">
            <h2>Engineering precise digital experiences.</h2>
            <p>I'm an AI Developer focused on building scalable, performant, and intelligent applications. I bridge the gap between complex algorithms and practical engineering, ensuring that technical execution matches creative intent.</p>
            
            <div className="about-actions">
              <a href="/resuma.pdf" target="_blank" rel="noreferrer" className="btn btn-primary">VIEW CV</a>
              <a href="https://github.com/AtulPahal" target="_blank" rel="noreferrer" className="btn btn-outline">GITHUB</a>
            </div>
          </div>
          <div className="about-img">
            <PenguinCanvas />
          </div>
        </div>

        <div className="core-stack">
          <h3>Core Stack</h3>
          <div className="stack-grid">
            <div className="stack-card">
              <div className="stack-icon">⚙️</div>
              <h4>ML and DL Frameworks</h4>
              <p>PYTORCH, SCIKIT-LEARN, TensorFlow</p>
            </div>
            <div className="stack-card">
              <div className="stack-icon">🤖</div>
              <h4>Generative AI Stack</h4>
              <p>PINECONE, MILVUS, LANGCHAIN</p>
            </div>
            <div className="stack-card">
              <div className="stack-icon">🚀</div>
              <h4>MLOps & Deployment</h4>
              <p>DOCKER, FASTAPI, MLFLOW</p>
            </div>
            <div className="stack-card">
              <div className="stack-icon">☁</div>
              <h4>Cloud Platforms</h4>
              <p>AWS, GOOGLE CLOUD, AZURE</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="contact-grid">
          <div className="contact-form-container">
            <h2>Get in touch.</h2>
            <p>Open to opportunities, technical collaborations, or just a conversation about minimalist design systems. Drop a line.</p>
            
            <form
              id="contactForm"
              action="https://formspree.io/f/mkokplol"
              method="POST"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const btn = form.querySelector('button');
                const originalText = btn.innerText;
                btn.innerText = 'SENDING...';
                btn.disabled = true;

                fetch('https://formspree.io/f/mkokplol', {
                  method: 'POST',
                  body: new FormData(form),
                  headers: { Accept: 'application/json' },
                }).then((res) => {
                  if (res.ok) {
                    btn.innerText = '✓ MESSAGE SENT';
                    btn.style.backgroundColor = '#10b981';
                    btn.style.borderColor = '#10b981';
                    form.reset();
                    setTimeout(() => {
                      btn.innerText = originalText;
                      btn.style.backgroundColor = '';
                      btn.style.borderColor = '';
                      btn.disabled = false;
                    }, 4000);
                  } else {
                    btn.innerText = 'ERROR — TRY AGAIN';
                    btn.style.backgroundColor = '#ef4444';
                    btn.disabled = false;
                    setTimeout(() => {
                      btn.innerText = originalText;
                      btn.style.backgroundColor = '';
                    }, 3000);
                  }
                });
              }}
            >
              <div className="form-group">
                <label htmlFor="name">NAME</label>
                <input type="text" id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">EMAIL</label>
                <input type="email" id="email" name="email" placeholder="john@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">MESSAGE</label>
                <textarea id="message" name="message" rows="4" placeholder="Hello..." required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">SEND MESSAGE</button>
            </form>
          </div>
          
          <div className="contact-info">
            <div className="info-block">
              <h4>DIGITAL PRESENCE</h4>
              <ul className="social-links">
                <li><a href="https://github.com/AtulPahal" target="_blank" rel="noreferrer">↗ Github</a></li>
                <li><a href="https://x.com/AtulPahal00" target="_blank" rel="noreferrer">↗ Twitter</a></li>
                <li><a href="https://www.linkedin.com/in/atul-pahal-1275aa371/" target="_blank" rel="noreferrer">↗ LinkedIn</a></li>
              </ul>
            </div>
            <div className="info-block">
              <h4>EMAIL</h4>
              <a href="mailto:atulpahal@gmail.com" className="email-link">↗ atulpahal@gmail.com</a>
            </div>
            <div className="info-block">
              <h4>STATUS</h4>
              <div className="status-indicator">
                <span className="dot"></span>
                Available for freelance
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer ref={footerRef}>
        <div className="footer-left">
          © 2026 DEVELOPED BY ATUL
        </div>
        <div className="footer-center">
          <a href="https://github.com/AtulPahal" target="_blank" rel="noreferrer">GITHUB</a>
          <a href="/resuma.pdf" target="_blank" rel="noreferrer">READ CV</a>
          <a href="https://x.com/AtulPahal00" target="_blank" rel="noreferrer">TWITTER</a>
        </div>
        <div className="footer-right" onClick={toggleSound} style={{ cursor: 'pointer', transition: 'color 0.3s' }} title="Toggle Sound">
          <div className="equalizer" style={{ opacity: soundEnabled ? 1 : 0.2, transition: 'opacity 0.3s' }}>
            <span></span><span></span><span></span>
          </div>
          SOUND {soundEnabled ? 'ON' : 'OFF'}
        </div>
      </footer>
    </div>
  );
}

export default App;
