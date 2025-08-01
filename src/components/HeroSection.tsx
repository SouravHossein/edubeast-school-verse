import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GraduationCap, Users, BookOpen, BarChart, Play, ArrowRight, Star } from 'lucide-react';

const School3DHero = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create main school building with more detail
    const buildingGroup = new THREE.Group();
    
    // Main building
    const mainBuildingGeometry = new THREE.BoxGeometry(6, 5, 4);
    const mainBuildingMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.9
    });
    const mainBuilding = new THREE.Mesh(mainBuildingGeometry, mainBuildingMaterial);
    mainBuilding.castShadow = true;
    mainBuilding.receiveShadow = true;
    buildingGroup.add(mainBuilding);

    // Windows
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        const windowGeometry = new THREE.PlaneGeometry(0.8, 1.2);
        const windowMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x87ceeb,
          transparent: true,
          opacity: 0.8,
          emissive: 0x1e3a8a,
          emissiveIntensity: 0.2
        });
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(-1.5 + i * 1.5, -0.5 + j * 2, 2.01);
        buildingGroup.add(window);
      }
    }

    // Roof
    const roofGeometry = new THREE.ConeGeometry(4, 2, 4);
    const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 3.5;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    buildingGroup.add(roof);

    // Flag pole
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 8);
    const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(4, 1.5, 0);
    buildingGroup.add(pole);

    // Flag
    const flagGeometry = new THREE.PlaneGeometry(2, 1.2);
    const flagMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff6b6b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(3, 4.5, 0);
    buildingGroup.add(flag);

    scene.add(buildingGroup);

    // Floating books with better materials
    const books = [];
    const bookColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xfeca57, 0xff9ff3];
    
    for (let i = 0; i < 8; i++) {
      const bookGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.1);
      const bookMaterial = new THREE.MeshPhongMaterial({ 
        color: bookColors[i % bookColors.length],
        transparent: true,
        opacity: 0.9
      });
      const book = new THREE.Mesh(bookGeometry, bookMaterial);
      book.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 8 + 3,
        (Math.random() - 0.5) * 15
      );
      book.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      book.castShadow = true;
      scene.add(book);
      books.push(book);
    }

    // Floating geometric shapes for academic subjects
    const shapes = [];
    const shapeGeometries = [
      new THREE.TetrahedronGeometry(0.8),
      new THREE.OctahedronGeometry(0.8),
      new THREE.IcosahedronGeometry(0.8),
      new THREE.DodecahedronGeometry(0.8)
    ];

    for (let i = 0; i < 6; i++) {
      const geometry = shapeGeometries[i % shapeGeometries.length];
      const material = new THREE.MeshPhongMaterial({ 
        color: Math.random() * 0xffffff,
        transparent: true,
        opacity: 0.7,
        emissive: 0x111111,
        emissiveIntensity: 0.1
      });
      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 25,
        Math.random() * 6 + 5,
        (Math.random() - 0.5) * 20
      );
      shape.castShadow = true;
      scene.add(shape);
      shapes.push(shape);
    }

    // Particle system for magical effect
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 30;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x4f46e5,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4f46e5, 0.5);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Camera position
    camera.position.set(0, 3, 15);
    camera.lookAt(0, 0, 0);

    // Animation variables
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Mouse movement
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate building slowly
      buildingGroup.rotation.y = time * 0.2;

      // Animate flag
      flag.rotation.z = Math.sin(time * 3) * 0.1;

      // Animate books
      books.forEach((book, index) => {
        book.rotation.x += 0.01;
        book.rotation.y += 0.02;
        book.position.y += Math.sin(time + index) * 0.005;
      });

      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005;
        shape.rotation.y += 0.01;
        shape.position.y += Math.sin(time * 0.5 + index * 0.5) * 0.01;
      });

      // Animate particles
      particles.rotation.y = time * 0.1;

      // Camera movement based on mouse
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 1 - camera.position.y + 3) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    animate();
    setTimeout(() => setIsLoaded(true), 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50 pointer-events-none" />

      

      {/* Hero Content */}
     

      {/* Floating elements for extra visual appeal */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse" />
    </div>
  );
};



export default School3DHero;