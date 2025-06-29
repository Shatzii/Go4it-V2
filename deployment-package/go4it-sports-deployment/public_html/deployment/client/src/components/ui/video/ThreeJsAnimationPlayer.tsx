import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Video, Play, Pause, RotateCcw } from 'lucide-react';

interface ThreeJsAnimationPlayerProps {
  animationType: 'sprint' | 'vertical' | 'agility' | 'strength';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  metricData?: {
    label: string;
    value: string;
    unit: string;
  };
  className?: string;
  autoPlay?: boolean;
}

/**
 * ThreeJsAnimationPlayer - Renders console-quality "128-bit" 3D animations
 * using Three.js for ultra-realistic athlete and sport modeling
 */
const ThreeJsAnimationPlayer: React.FC<ThreeJsAnimationPlayerProps> = ({
  animationType,
  colors,
  metricData,
  className = '',
  autoPlay = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showControls, setShowControls] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  
  // Parse colors for Three.js
  const primaryColor = new THREE.Color(colors.primary);
  const secondaryColor = new THREE.Color(colors.secondary);
  const accentColor = new THREE.Color(colors.accent);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a');
    sceneRef.current = scene;
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    cameraRef.current = camera;
    
    // Set camera position based on animation type
    switch (animationType) {
      case 'sprint':
        camera.position.set(0, 5, 15);
        break;
      case 'vertical':
        camera.position.set(0, 8, 12);
        break;
      case 'agility':
        camera.position.set(0, 15, 15);
        camera.lookAt(0, 0, 0);
        break;
      case 'strength':
        camera.position.set(0, 5, 10);
        break;
      default:
        camera.position.set(0, 5, 15);
    }
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    
    // Add lighting
    addLighting(scene);
    
    // Add environment based on animation type
    switch (animationType) {
      case 'sprint':
        createSprintEnvironment(scene, primaryColor, secondaryColor);
        break;
      case 'vertical':
        createVerticalJumpEnvironment(scene, primaryColor, secondaryColor);
        break;
      case 'agility':
        createAgilityEnvironment(scene, primaryColor, secondaryColor);
        break;
      case 'strength':
        createStrengthEnvironment(scene, primaryColor, secondaryColor);
        break;
    }
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Show as loaded after slight delay to ensure smooth transition
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [animationType]);
  
  // Animation loop
  useEffect(() => {
    if (!isPlaying || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    let previousTime = 0;
    
    const animate = (time: number) => {
      const deltaTime = time - previousTime;
      previousTime = time;
      timeRef.current += deltaTime * 0.001; // Convert to seconds
      
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        // Run appropriate animation based on type
        switch (animationType) {
          case 'sprint':
            animateSprint(sceneRef.current, timeRef.current);
            break;
          case 'vertical':
            animateVerticalJump(sceneRef.current, timeRef.current);
            break;
          case 'agility':
            animateAgility(sceneRef.current, timeRef.current);
            break;
          case 'strength':
            animateStrength(sceneRef.current, timeRef.current);
            break;
        }
        
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    frameIdRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [isPlaying, animationType]);
  
  // Add basic lighting to the scene
  const addLighting = (scene: THREE.Scene) => {
    // Main directional light (like sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Shadow quality settings
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    
    // Add ambient light for general illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add a subtle blue hue with hemisphere light
    const hemisphereLight = new THREE.HemisphereLight(0x0066ff, 0x002244, 0.5);
    scene.add(hemisphereLight);
    
    // Add spotlights for dramatic effect based on animation type
    if (animationType === 'strength' || animationType === 'vertical') {
      const spotlight = new THREE.SpotLight(0xffffff, 3);
      spotlight.position.set(0, 15, 0);
      spotlight.angle = Math.PI / 6;
      spotlight.penumbra = 0.3;
      spotlight.decay = 1;
      spotlight.distance = 30;
      spotlight.castShadow = true;
      scene.add(spotlight);
    }
  };
  
  // Create environments and animations for each animation type
  
  // 40-yard dash environment
  const createSprintEnvironment = (scene: THREE.Scene, primaryColor: THREE.Color, secondaryColor: THREE.Color) => {
    // Create track
    const trackGeometry = new THREE.BoxGeometry(30, 0.1, 4);
    const trackMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111, 
      roughness: 0.8,
      metalness: 0.1
    });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.position.y = 0;
    track.receiveShadow = true;
    scene.add(track);
    
    // Add lane markings
    for (let i = 0; i < 4; i++) {
      const lineGeometry = new THREE.BoxGeometry(30, 0.1, 0.05);
      const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.position.y = 0.05;
      line.position.z = -1.5 + i * 1;
      scene.add(line);
    }
    
    // Add yard markers
    for (let i = 0; i < 5; i++) {
      const markerGeometry = new THREE.BoxGeometry(0.1, 0.11, 4);
      const markerMaterial = new THREE.MeshStandardMaterial({ 
        color: i === 0 || i === 4 ? primaryColor : 0xffffff,
        roughness: 0.5
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.y = 0.05;
      marker.position.x = -12 + i * 6;
      scene.add(marker);
      
      // Yard numbers
      const textGeometry = new THREE.PlaneGeometry(1, 0.5);
      const textMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.set(-12 + i * 6, 0.3, 2.5);
      text.rotation.x = -Math.PI / 2;
      scene.add(text);
    }
    
    // Create runner (placeholder - in production would be a detailed 3D model)
    const runnerGeometry = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: primaryColor });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.9;
    body.castShadow = true;
    runnerGeometry.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.7;
    head.castShadow = true;
    runnerGeometry.add(head);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.2, 0.7, 0.2);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.4, 1.0, 0);
    leftArm.castShadow = true;
    runnerGeometry.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.4, 1.0, 0);
    rightArm.castShadow = true;
    runnerGeometry.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, 0.4, 0);
    leftLeg.castShadow = true;
    runnerGeometry.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, 0.4, 0);
    rightLeg.castShadow = true;
    runnerGeometry.add(rightLeg);
    
    // Jersey number
    const jerseyGeometry = new THREE.PlaneGeometry(0.3, 0.3);
    const jerseyMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const jersey = new THREE.Mesh(jerseyGeometry, jerseyMaterial);
    jersey.position.set(0, 1.0, 0.21);
    runnerGeometry.add(jersey);
    
    // Position the runner at the start of the track
    runnerGeometry.position.set(-12, 0, 0);
    runnerGeometry.name = "runner";
    scene.add(runnerGeometry);
    
    // Create finish line flag
    const flagGeometry = new THREE.ConeGeometry(0.2, 0.8, 4);
    const flagMaterial = new THREE.MeshStandardMaterial({ color: primaryColor });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(12, 1.5, -2.5);
    flag.castShadow = true;
    scene.add(flag);
    
    // Create pole for flag
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(12, 1.5, -2.5);
    pole.castShadow = true;
    scene.add(pole);
  };
  
  const animateSprint = (scene: THREE.Scene, time: number) => {
    const runner = scene.getObjectByName("runner");
    if (runner) {
      // Calculate position based on time (5 second run)
      const duration = 5;
      const normalizedTime = (time % (duration + 2)) / duration;
      
      if (normalizedTime <= 1) {
        // Ease out for realistic acceleration
        const easeOut = 1 - Math.pow(1 - normalizedTime, 3);
        const xPos = -12 + (24 * easeOut);
        runner.position.x = xPos;
        
        // Running animation - bob up and down slightly
        runner.position.y = Math.sin(time * 10) * 0.05;
        
        // Animate legs and arms with running motion
        runner.children.forEach((child, index) => {
          // Arms (index 2 and 3)
          if (index === 2) {
            child.rotation.x = Math.sin(time * 10) * 0.5;
          } else if (index === 3) {
            child.rotation.x = -Math.sin(time * 10) * 0.5;
          }
          // Legs (index 4 and 5)
          else if (index === 4) {
            child.rotation.x = -Math.sin(time * 10) * 0.5;
          } else if (index === 5) {
            child.rotation.x = Math.sin(time * 10) * 0.5;
          }
        });
      } else if (normalizedTime <= 1.4) {
        // Slow down after crossing finish line
        runner.position.x = 12;
        runner.position.y = 0;
      } else {
        // Reset to start position with a quick teleport
        runner.position.x = -12;
        runner.position.y = 0;
        runner.children.forEach(child => {
          child.rotation.x = 0;
        });
      }
    }
  };
  
  // Vertical jump environment
  const createVerticalJumpEnvironment = (scene: THREE.Scene, primaryColor: THREE.Color, secondaryColor: THREE.Color) => {
    // Create floor
    const floorGeometry = new THREE.BoxGeometry(20, 0.1, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333, 
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create court markings - center circle
    const circleGeometry = new THREE.RingGeometry(2, 2.05, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.y = 0.06;
    circle.rotation.x = -Math.PI / 2;
    scene.add(circle);
    
    // Create court lines
    const lineGeometry = new THREE.PlaneGeometry(10, 0.1);
    const lineMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    
    // Free throw line
    const freethrowLine = new THREE.Mesh(lineGeometry, lineMaterial);
    freethrowLine.position.set(0, 0.06, -5);
    freethrowLine.rotation.x = -Math.PI / 2;
    scene.add(freethrowLine);
    
    // Create measurement board
    const boardGeometry = new THREE.BoxGeometry(0.3, 6, 1);
    const boardMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.set(3, 3, 0);
    board.castShadow = true;
    scene.add(board);
    
    // Add measurement markings
    for (let i = 0; i <= 10; i++) {
      const markerGeometry = new THREE.BoxGeometry(0.32, 0.05, 0.2);
      const markerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.5
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(3, i * 0.5, 0);
      scene.add(marker);
    }
    
    // Target height marker
    const targetGeometry = new THREE.BoxGeometry(0.4, 0.1, 1.2);
    const targetMaterial = new THREE.MeshStandardMaterial({ 
      color: primaryColor,
      roughness: 0.5,
      metalness: 0.2
    });
    const target = new THREE.Mesh(targetGeometry, targetMaterial);
    target.position.set(3, 3.85, 0);
    scene.add(target);
    
    // Create player (placeholder - in production would be a detailed basketball player model)
    const playerGeometry = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.4, 0.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: primaryColor });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.0;
    body.castShadow = true;
    playerGeometry.add(body);
    
    // Shorts
    const shortsGeometry = new THREE.BoxGeometry(0.9, 0.5, 0.55);
    const shortsMaterial = new THREE.MeshStandardMaterial({ color: secondaryColor });
    const shorts = new THREE.Mesh(shortsGeometry, shortsMaterial);
    shorts.position.y = 0.5;
    shorts.castShadow = true;
    playerGeometry.add(shorts);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.0;
    head.castShadow = true;
    playerGeometry.add(head);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.5, 1.2, 0);
    leftArm.castShadow = true;
    playerGeometry.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.5, 1.2, 0);
    rightArm.castShadow = true;
    playerGeometry.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 0.9, 0.3);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, 0.0, 0);
    leftLeg.castShadow = true;
    playerGeometry.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, 0.0, 0);
    rightLeg.castShadow = true;
    playerGeometry.add(rightLeg);
    
    // Jersey number
    const jerseyGeometry = new THREE.PlaneGeometry(0.4, 0.4);
    const jerseyMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const jersey = new THREE.Mesh(jerseyGeometry, jerseyMaterial);
    jersey.position.set(0, 1.2, 0.26);
    playerGeometry.add(jersey);
    
    // Position the player
    playerGeometry.position.set(0, 0, 0);
    playerGeometry.name = "player";
    scene.add(playerGeometry);
  };
  
  const animateVerticalJump = (scene: THREE.Scene, time: number) => {
    const player = scene.getObjectByName("player");
    if (player) {
      // Complete jump cycle lasts 3 seconds
      const cycleDuration = 3;
      const normalizedTime = (time % cycleDuration) / cycleDuration;
      
      // Calculate jump height based on time
      if (normalizedTime < 0.2) {
        // Crouch phase
        const crouchDepth = 0.3;
        player.position.y = crouchDepth * Math.sin(normalizedTime * Math.PI / 0.2);
        
        // Arm raise and leg bend
        player.children.forEach((child, index) => {
          // Arms (index 3 and 4)
          if (index === 3 || index === 4) {
            child.rotation.x = -normalizedTime * 1.5;
          }
          // Legs (index 5 and 6) - bend knees
          else if (index === 5 || index === 6) {
            child.rotation.x = -normalizedTime * 2;
          }
        });
      } else if (normalizedTime < 0.5) {
        // Jump phase - rapid ascent
        const jumpHeight = 3.8; // Peak height
        const jumpProgress = (normalizedTime - 0.2) / 0.3;
        const easeOut = Math.sin(jumpProgress * Math.PI / 2);
        player.position.y = jumpHeight * easeOut;
        
        // Extend arms upward
        player.children.forEach((child, index) => {
          // Arms (index 3 and 4) - reach up high
          if (index === 3 || index === 4) {
            child.rotation.x = -Math.PI/2 - (jumpProgress * Math.PI/4);
          }
          // Legs (index 5 and 6) - extend
          else if (index === 5 || index === 6) {
            child.rotation.x = -0.4 + (jumpProgress * 0.4);
          }
        });
        
        // Move slightly towards measurement board
        player.position.x = 1 * jumpProgress;
      } else if (normalizedTime < 0.8) {
        // Descent phase
        const jumpHeight = 3.8;
        const descentProgress = (normalizedTime - 0.5) / 0.3;
        const easeIn = Math.cos(descentProgress * Math.PI / 2);
        player.position.y = jumpHeight * easeIn;
        
        // Begin to bring arms back down
        player.children.forEach((child, index) => {
          // Arms (index 3 and 4)
          if (index === 3 || index === 4) {
            child.rotation.x = -Math.PI/2 - (Math.PI/4) + (descentProgress * Math.PI/2);
          }
          // Legs (index 5 and 6) - prepare for landing
          else if (index === 5 || index === 6) {
            child.rotation.x = -0.3 * descentProgress;
          }
        });
        
        // Continue moving towards measurement board
        player.position.x = 1 + 0.5 * descentProgress;
      } else {
        // Reset/landing phase
        const resetProgress = (normalizedTime - 0.8) / 0.2;
        
        // Reset position
        player.position.y = 0;
        player.position.x = Math.max(0, 1.5 - (1.5 * resetProgress));
        
        // Reset arm and leg positions
        player.children.forEach((child, index) => {
          // Arms (index 3 and 4)
          if (index === 3 || index === 4) {
            child.rotation.x = -Math.PI/4 * (1 - resetProgress);
          }
          // Legs (index 5 and 6)
          else if (index === 5 || index === 6) {
            child.rotation.x = -0.3 * (1 - resetProgress);
          }
        });
      }
    }
  };
  
  // Agility drill environment
  const createAgilityEnvironment = (scene: THREE.Scene, primaryColor: THREE.Color, secondaryColor: THREE.Color) => {
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333, 
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create cone drill pattern
    const coneGeometry = new THREE.ConeGeometry(0.3, 0.8, 16);
    const coneMaterial = new THREE.MeshStandardMaterial({ color: primaryColor });
    
    // Add cones in 3-cone drill pattern
    const conePositions = [
      [0, 0, 0],
      [5, 0, 0],
      [5, 0, 5]
    ];
    
    conePositions.forEach((pos, index) => {
      const cone = new THREE.Mesh(coneGeometry, coneMaterial);
      cone.position.set(pos[0], 0.4, pos[2]);
      cone.castShadow = true;
      scene.add(cone);
    });
    
    // Draw course lines on floor
    const lineMaterial = new THREE.LineBasicMaterial({ color: secondaryColor, transparent: true, opacity: 0.6 });
    const linePoints = [
      new THREE.Vector3(0, 0.05, 0),
      new THREE.Vector3(5, 0.05, 0),
      new THREE.Vector3(5, 0.05, 5),
      new THREE.Vector3(0, 0.05, 0)
    ];
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    
    // Create player (placeholder - in production would be a detailed football player model)
    const playerGeometry = new THREE.Group();
    
    // Body with jersey
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: primaryColor });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.9;
    body.castShadow = true;
    playerGeometry.add(body);
    
    // Helmet
    const helmetGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.5);
    const helmetMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
    helmet.position.y = 1.7;
    helmet.castShadow = true;
    playerGeometry.add(helmet);
    
    // Facemask
    const maskGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.1);
    const maskMaterial = new THREE.MeshStandardMaterial({ color: secondaryColor });
    const mask = new THREE.Mesh(maskGeometry, maskMaterial);
    mask.position.set(0, 1.7, 0.3);
    mask.castShadow = true;
    playerGeometry.add(mask);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.25, 0.7, 0.25);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.5, 0.9, 0);
    leftArm.castShadow = true;
    playerGeometry.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.5, 0.9, 0);
    rightArm.castShadow = true;
    playerGeometry.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 0.9, 0.3);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, 0.0, 0);
    leftLeg.castShadow = true;
    playerGeometry.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, 0.0, 0);
    rightLeg.castShadow = true;
    playerGeometry.add(rightLeg);
    
    // Jersey number
    const jerseyGeometry = new THREE.PlaneGeometry(0.4, 0.4);
    const jerseyMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const jersey = new THREE.Mesh(jerseyGeometry, jerseyMaterial);
    jersey.position.set(0, 1.0, 0.26);
    playerGeometry.add(jersey);
    
    // Position the player at the start
    playerGeometry.position.set(0, 0, 0);
    playerGeometry.name = "player";
    scene.add(playerGeometry);
  };
  
  const animateAgility = (scene: THREE.Scene, time: number) => {
    const player = scene.getObjectByName("player");
    if (player) {
      // Complete agility drill cycle lasts 6 seconds
      const cycleDuration = 6;
      const normalizedTime = (time % cycleDuration) / cycleDuration;
      
      // Define the agility drill path
      const path = [
        { x: 0, z: 0 },    // Start at the first cone
        { x: 5, z: 0 },    // Run to second cone
        { x: 0, z: 0 },    // Back to first cone
        { x: 5, z: 5 },    // Diagonal to third cone
        { x: 0, z: 0 }     // Back to starting position
      ];
      
      // Segments for different parts of the path
      const segments = [0.25, 0.5, 0.75, 1.0];
      
      let position = { x: 0, z: 0 };
      let legPhase = 0;
      
      // Calculate position along the path
      if (normalizedTime < segments[0]) {
        // First segment: Start to Cone 2
        const t = normalizedTime / segments[0];
        const easeInOut = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        position.x = path[0].x + (path[1].x - path[0].x) * easeInOut;
        position.z = path[0].z + (path[1].z - path[0].z) * easeInOut;
        player.rotation.y = 0; // Face right
        legPhase = normalizedTime * 20;
      } else if (normalizedTime < segments[1]) {
        // Second segment: Cone 2 back to Start
        const t = (normalizedTime - segments[0]) / (segments[1] - segments[0]);
        const easeInOut = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        position.x = path[1].x + (path[2].x - path[1].x) * easeInOut;
        position.z = path[1].z + (path[2].z - path[1].z) * easeInOut;
        player.rotation.y = Math.PI; // Face left
        legPhase = normalizedTime * 20;
      } else if (normalizedTime < segments[2]) {
        // Third segment: Start to Cone 3 (diagonal)
        const t = (normalizedTime - segments[1]) / (segments[2] - segments[1]);
        const easeInOut = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        position.x = path[2].x + (path[3].x - path[2].x) * easeInOut;
        position.z = path[2].z + (path[3].z - path[2].z) * easeInOut;
        player.rotation.y = Math.PI / 4; // Face diagonal
        legPhase = normalizedTime * 20;
      } else if (normalizedTime < segments[3]) {
        // Fourth segment: Cone 3 back to Start
        const t = (normalizedTime - segments[2]) / (segments[3] - segments[2]);
        const easeInOut = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        position.x = path[3].x + (path[4].x - path[3].x) * easeInOut;
        position.z = path[3].z + (path[4].z - path[3].z) * easeInOut;
        player.rotation.y = Math.PI + Math.PI / 4; // Face back diagonal
        legPhase = normalizedTime * 20;
      } else {
        // Reset phase - stay at start position
        position.x = path[4].x;
        position.z = path[4].z;
        player.rotation.y = 0;
        legPhase = 0;
      }
      
      // Update player position
      player.position.x = position.x;
      player.position.z = position.z;
      
      // Basic running animation
      if (normalizedTime < segments[3]) {
        // Animate legs and arms for running
        player.children.forEach((child, index) => {
          // Arms (index 3 and 4)
          if (index === 3) {
            child.rotation.x = Math.sin(legPhase * Math.PI) * 0.7;
          } else if (index === 4) {
            child.rotation.x = -Math.sin(legPhase * Math.PI) * 0.7;
          }
          // Legs (index 5 and 6)
          else if (index === 5) {
            child.rotation.x = -Math.sin(legPhase * Math.PI) * 0.7;
          } else if (index === 6) {
            child.rotation.x = Math.sin(legPhase * Math.PI) * 0.7;
          }
        });
        
        // Slight bobbing up and down for realistic running
        player.position.y = Math.abs(Math.sin(legPhase * Math.PI)) * 0.08;
      } else {
        // Reset animations when idle
        player.children.forEach((child, index) => {
          if (index >= 3 && index <= 6) {
            child.rotation.x = 0;
          }
        });
        player.position.y = 0;
      }
    }
  };
  
  // Strength environment (bench press)
  const createStrengthEnvironment = (scene: THREE.Scene, primaryColor: THREE.Color, secondaryColor: THREE.Color) => {
    // Create platform/floor
    const floorGeometry = new THREE.BoxGeometry(20, 0.1, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x555555, 
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create bench
    const benchGeometry = new THREE.BoxGeometry(2.5, 0.4, 1);
    const benchMaterial = new THREE.MeshStandardMaterial({ 
      color: secondaryColor,
      roughness: 0.7,
      metalness: 0.3
    });
    const bench = new THREE.Mesh(benchGeometry, benchMaterial);
    bench.position.y = 0.2;
    bench.castShadow = true;
    bench.receiveShadow = true;
    scene.add(bench);
    
    // Create bench supports
    const supportGeometry = new THREE.BoxGeometry(0.2, 0.5, 1);
    const supportMaterial = new THREE.MeshStandardMaterial({ 
      color: secondaryColor,
      roughness: 0.7,
      metalness: 0.3
    });
    
    const leftSupport = new THREE.Mesh(supportGeometry, supportMaterial);
    leftSupport.position.set(-1, -0.05, 0);
    leftSupport.castShadow = true;
    scene.add(leftSupport);
    
    const rightSupport = new THREE.Mesh(supportGeometry, supportMaterial);
    rightSupport.position.set(1, -0.05, 0);
    rightSupport.castShadow = true;
    scene.add(rightSupport);
    
    // Create barbell rack
    const rackGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
    const rackMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x888888,
      roughness: 0.7,
      metalness: 0.5
    });
    
    const leftRack = new THREE.Mesh(rackGeometry, rackMaterial);
    leftRack.position.set(-1.5, 0.75, -0.7);
    leftRack.castShadow = true;
    scene.add(leftRack);
    
    const rightRack = new THREE.Mesh(rackGeometry, rackMaterial);
    rightRack.position.set(1.5, 0.75, -0.7);
    rightRack.castShadow = true;
    scene.add(rightRack);
    
    // Create rack support
    const rackSupportGeometry = new THREE.BoxGeometry(3.2, 0.1, 0.3);
    const rackSupportMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x888888,
      roughness: 0.7,
      metalness: 0.5
    });
    
    const rackSupport = new THREE.Mesh(rackSupportGeometry, rackSupportMaterial);
    rackSupport.position.set(0, 1.3, -0.7);
    rackSupport.castShadow = true;
    scene.add(rackSupport);
    
    // Create player (placeholder - in production would be a detailed powerlifter model)
    const playerGeometry = new THREE.Group();
    
    // Body with jersey
    const bodyGeometry = new THREE.BoxGeometry(1.6, 0.7, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: primaryColor });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.55;
    body.castShadow = true;
    playerGeometry.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.55, -0.8);
    head.castShadow = true;
    playerGeometry.add(head);
    
    // Arms (upper)
    const upperArmGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const leftUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
    leftUpperArm.position.set(-1.0, 0.55, 0);
    leftUpperArm.rotation.z = Math.PI / 2; // Horizontal position for bench
    leftUpperArm.castShadow = true;
    playerGeometry.add(leftUpperArm);
    
    const rightUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
    rightUpperArm.position.set(1.0, 0.55, 0);
    rightUpperArm.rotation.z = -Math.PI / 2; // Horizontal position for bench
    rightUpperArm.castShadow = true;
    playerGeometry.add(rightUpperArm);
    
    // Arms (forearms)
    const forearmGeometry = new THREE.BoxGeometry(0.2, 0.7, 0.2);
    
    const leftForearm = new THREE.Mesh(forearmGeometry, armMaterial);
    leftForearm.position.set(-1.0, 0.55, 0.5);
    leftForearm.rotation.x = Math.PI / 2; // Vertical to hold bar
    leftForearm.castShadow = true;
    playerGeometry.add(leftForearm);
    
    const rightForearm = new THREE.Mesh(forearmGeometry, armMaterial);
    rightForearm.position.set(1.0, 0.55, 0.5);
    rightForearm.rotation.x = Math.PI / 2; // Vertical to hold bar
    rightForearm.castShadow = true;
    playerGeometry.add(rightForearm);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.4);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.5, -0.4, 0);
    leftLeg.castShadow = true;
    playerGeometry.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.5, -0.4, 0);
    rightLeg.castShadow = true;
    playerGeometry.add(rightLeg);
    
    // Jersey number
    const jerseyGeometry = new THREE.PlaneGeometry(0.6, 0.6);
    const jerseyMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const jersey = new THREE.Mesh(jerseyGeometry, jerseyMaterial);
    jersey.position.set(0, 0.56, 0.51);
    jersey.rotation.x = Math.PI / 2;
    playerGeometry.add(jersey);
    
    // Position the player on the bench
    playerGeometry.position.set(0, 0, 0);
    playerGeometry.name = "lifter";
    scene.add(playerGeometry);
    
    // Create barbell
    const barbellGroup = new THREE.Group();
    
    // Bar
    const barGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5, 16);
    const barMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xdddddd,
      roughness: 0.3,
      metalness: 0.7
    });
    barGeometry.rotateZ(Math.PI / 2); // Make it horizontal
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.castShadow = true;
    barbellGroup.add(bar);
    
    // Weight plates
    const plateGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
    const plateMaterial = new THREE.MeshStandardMaterial({ 
      color: primaryColor,
      roughness: 0.5,
      metalness: 0.2
    });
    plateGeometry.rotateZ(Math.PI / 2); // Make it align with bar
    
    // Left plates
    const leftPlate1 = new THREE.Mesh(plateGeometry, plateMaterial);
    leftPlate1.position.x = -2;
    leftPlate1.castShadow = true;
    barbellGroup.add(leftPlate1);
    
    const leftPlate2 = new THREE.Mesh(plateGeometry, plateMaterial);
    leftPlate2.position.x = -2.2;
    leftPlate2.castShadow = true;
    barbellGroup.add(leftPlate2);
    
    // Right plates
    const rightPlate1 = new THREE.Mesh(plateGeometry, plateMaterial);
    rightPlate1.position.x = 2;
    rightPlate1.castShadow = true;
    barbellGroup.add(rightPlate1);
    
    const rightPlate2 = new THREE.Mesh(plateGeometry, plateMaterial);
    rightPlate2.position.x = 2.2;
    rightPlate2.castShadow = true;
    barbellGroup.add(rightPlate2);
    
    // Position the barbell
    barbellGroup.position.set(0, 1.0, 0.5);
    barbellGroup.name = "barbell";
    scene.add(barbellGroup);
    
    // Rep counter display
    const counterGeometry = new THREE.PlaneGeometry(1, 0.5);
    const counterMaterial = new THREE.MeshBasicMaterial({ 
      color: primaryColor,
      transparent: true,
      opacity: 0.7
    });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.set(2.5, 1.5, 0);
    counter.rotation.y = -Math.PI / 4;
    counter.name = "counter";
    scene.add(counter);
  };
  
  const animateStrength = (scene: THREE.Scene, time: number) => {
    const lifter = scene.getObjectByName("lifter");
    const barbell = scene.getObjectByName("barbell");
    
    if (lifter && barbell) {
      // Complete bench press cycle lasts 4 seconds
      const cycleDuration = 4;
      const normalizedTime = (time % cycleDuration) / cycleDuration;
      
      // Calculate lift position based on time
      if (normalizedTime < 0.4) {
        // Lowering phase - bar comes down to chest
        const lowerProgress = normalizedTime / 0.4;
        const easeIn = Math.pow(lowerProgress, 2); // Ease in - starts slow, accelerates
        
        // Barbell movement
        barbell.position.y = 1.0 - (0.4 * easeIn);
        
        // Arm bending animation
        lifter.children.forEach((child, index) => {
          // Forearms (index 4 and 5) - keep vertical
          if (index === 4 || index === 5) {
            child.position.y = 0.55 - (0.3 * easeIn);
          }
        });
      } else if (normalizedTime < 0.7) {
        // Pressing phase - push bar back up
        const pressProgress = (normalizedTime - 0.4) / 0.3;
        const easeOut = 1 - Math.pow(1 - pressProgress, 3); // Ease out - starts fast, decelerates
        
        // Barbell movement
        barbell.position.y = 0.6 + (0.4 * easeOut);
        
        // Arm extending animation
        lifter.children.forEach((child, index) => {
          // Forearms (index 4 and 5) - keep vertical
          if (index === 4 || index === 5) {
            child.position.y = 0.25 + (0.3 * easeOut);
          }
        });
        
        // Show rep counter when reaching the top
        if (pressProgress > 0.8) {
          const counter = scene.getObjectByName("counter");
          if (counter) {
            counter.visible = true;
            // Pulse effect
            counter.scale.set(1.1, 1.1, 1.1);
            setTimeout(() => {
              if (counter) counter.scale.set(1, 1, 1);
            }, 200);
          }
        }
      } else {
        // Rest at top position
        barbell.position.y = 1.0;
        
        // Arms fully extended
        lifter.children.forEach((child, index) => {
          // Forearms (index 4 and 5)
          if (index === 4 || index === 5) {
            child.position.y = 0.55;
          }
        });
        
        // Hide rep counter during rest
        const counter = scene.getObjectByName("counter");
        if (counter) {
          counter.visible = false;
        }
      }
    }
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleRestart = () => {
    timeRef.current = 0;
    setIsPlaying(true);
  };
  
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl bg-black ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Loading overlay */}
      <motion.div
        className="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        style={{ pointerEvents: isLoaded ? 'none' : 'auto' }}
      >
        <div className="flex flex-col items-center">
          <div 
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: `${colors.primary} transparent transparent transparent` }}
          />
          <p className="mt-4 text-white">Loading ultra-realistic 128-bit animation...</p>
        </div>
      </motion.div>
      
      {/* The 3D canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {/* Overlay with animation data */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute right-5 top-5 px-3 py-2 rounded-lg"
          style={{ 
            backgroundColor: `${colors.primary}`,
            color: 'white',
          }}
        >
          <p className="text-xs opacity-80">{animationType.toUpperCase()}</p>
          <p className="text-xl font-bold">{metricData?.value || '4.42s'}</p>
        </div>
        
        {/* 128-bit quality badge */}
        <div className="absolute top-5 left-5 px-2 py-1 rounded-md bg-green-500/20 border border-green-500/40 backdrop-blur-sm flex items-center gap-1.5 text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="font-medium text-green-400">128-Bit HD Rendering</span>
        </div>
      </div>
      
      {/* Player controls */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3 flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls || !isPlaying ? 1 : 0, y: showControls || !isPlaying ? 0 : 20 }}
      >
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white ml-0.5" />}
        </button>
        
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
          onClick={handleRestart}
        >
          <RotateCcw size={18} className="text-white" />
        </button>
        
        <div className="ml-auto flex items-center">
          <span className="text-sm text-white/70 mr-2">3D Quality: Ultra</span>
        </div>
      </motion.div>
      
      {/* Interactive prompt to engage with the animation */}
      {!isPlaying && !showControls && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlayPause}
        >
          <motion.div 
            className="w-16 h-16 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={32} className="text-white ml-1" />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ThreeJsAnimationPlayer;