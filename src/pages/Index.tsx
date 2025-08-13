import Navigation from '@/components/Navigation';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const FutureAcademy = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  // Three.js Scene Setup
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(400, 300);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create holographic book
    const bookGeometry = new THREE.BoxGeometry(2, 2.5, 0.3);
    const bookMaterial = new THREE.MeshPhongMaterial({
      color: 0x16f4d0,
      transparent: true,
      opacity: 0.7,
      emissive: 0x16f4d0,
      emissiveIntensity: 0.2,
    });
    const book = new THREE.Mesh(bookGeometry, bookMaterial);

    // Create pages
    const pageGeometry = new THREE.PlaneGeometry(1.8, 2.3);
    const pageMaterial = new THREE.MeshPhongMaterial({
      color: 0xf4d03f,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    const pages = [];
    for (let i = 0; i < 5; i++) {
      const page = new THREE.Mesh(pageGeometry, pageMaterial);
      page.position.set(0, 0, -0.1 + i * 0.05);
      page.rotation.y = (i * Math.PI) / 10;
      pages.push(page);
      scene.add(page);
    }

    scene.add(book);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x16f4d0, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xf4d03f, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      book.rotation.y += 0.01;
      book.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;

      pages.forEach((page, index) => {
        page.rotation.y += 0.005 * (index + 1);
        page.position.y = Math.sin(Date.now() * 0.001 + index) * 0.1;
      });

      renderer.render(scene, camera);
    };

    animate();
    sceneRef.current = { scene, camera, renderer, book, pages };

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Counter animation hook
  const useCounter = (target, isVisible) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!isVisible) return;
      
      let start = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        setCount(Math.floor(start));
      }, 20);
      
      return () => clearInterval(timer);
    }, [target, isVisible]);
    
    return count;
  };

  const StatCounter = ({ target, label, suffix = '+' }) => {
    const count = useCounter(target, isVisible.stats);
    return (
      <div className="text-center">
        <span className="block text-4xl md:text-5xl font-black bg-gradient-to-r from-teal-400 to-yellow-400 bg-clip-text text-transparent font-mono">
          {count.toLocaleString()}{suffix}
        </span>
        <span className="text-lg opacity-80 mt-2 block">{label}</span>
      </div>
    );
  };





  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute w-32 h-32 bg-gradient-to-r from-teal-400 to-yellow-400 rounded-full blur-sm animate-pulse top-1/4 left-1/4" 
             style={{
               animation: 'float 6s ease-in-out infinite',
               animationDelay: '0s'
             }}></div>
        <div className="absolute w-48 h-48 bg-gradient-to-r from-yellow-400 to-teal-400 rounded-full blur-sm animate-pulse top-3/5 right-1/4"
             style={{
               animation: 'float 6s ease-in-out infinite',
               animationDelay: '2s'
             }}></div>
        <div className="absolute w-24 h-24 bg-gradient-to-r from-teal-400 to-yellow-400 rounded-full blur-sm animate-pulse bottom-1/3 left-1/5"
             style={{
               animation: 'float 6s ease-in-out infinite',
               animationDelay: '4s'
             }}></div>
      </div>

      {/* Floating Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
        <div className="max-w-4xl z-10 px-6">
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-teal-400 to-yellow-400 bg-clip-text text-transparent font-mono animate-pulse">
            SHAPING FUTURE LEADERS
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90 font-light">
            Where Innovation Meets Education in the Digital Age
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="/apply"
              className="px-10 py-4 bg-gradient-to-r from-teal-400 to-yellow-400 text-slate-900 rounded-full font-bold text-lg transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl hover:shadow-teal-400/40"
            >
              Apply Now
            </a>
            <a 
              href="/about"
              className="px-10 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full font-bold text-lg transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl hover:shadow-white/20"
            >
              Discover More
            </a>
          </div>
        </div>

        {/* Three.js Holographic Book */}
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <div ref={mountRef} className="w-96 h-72"></div>
        </div>
      </section>

      {/* Stats Section */}
      <div 
        id="stats"
        data-animate
        className={`mx-6 md:mx-12 my-24 p-12 md:p-16 bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-3xl text-center transition-all duration-1000 ${
          isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <StatCounter target={2500} label="Students" />
          <StatCounter target={150} label="Expert Faculty" />
          <StatCounter target={98} label="College Acceptance" suffix="%" />
          <StatCounter target={50} label="Countries Represented" />
        </div>
      </div>
    </div>
  );
}; 

export default FutureAcademy;