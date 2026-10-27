/* ===================================================================
   LA REVOLTOSA-INSPIRED 3D WEBGL WORLD (Three.js Engine)
   Real-Time 3D Diamond Ring, Floating Hearts, Sparkling Champagne Bubbles,
   Dynamic Specular Lighting & Camera Choreography
   =================================================================== */

(function () {
  'use strict';

  // Check if THREE is loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Skipping 3D world.');
    return;
  }

  let scene, camera, renderer, canvas;
  let ringGroup, diamondMesh, bandMesh;
  let floatingObjects = [];
  let bubbleParticles = [];
  let pointLight, dirLight;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let currentSlide = 0;
  let clock = new THREE.Clock();

  function init() {
    canvas = document.getElementById('webglCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'webglCanvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '0';
      document.body.prepend(canvas);
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

    // 2. High-Performance Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xFFE5DA, 0.85);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(0xFFD166, 1.6);
    dirLight.position.set(6, 12, 8);
    scene.add(dirLight);

    // Dynamic point light that follows cursor
    pointLight = new THREE.PointLight(0xFF7B89, 2.2, 25);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    const blueRimLight = new THREE.DirectionalLight(0x9B6CE8, 1.2);
    blueRimLight.position.set(-8, -6, -4);
    scene.add(blueRimLight);

    // 4. Create 3D Assets
    createDiamondRing();
    createFloatingLoveSymbols();
    createChampagneBubbles();

    // 5. Events
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // 6. Start Render Loop
    animate();
  }

  // -------------------------------------------------------------
  // 3D Engagement Ring (Golden Band + Sparkling Cut Gemstone)
  // -------------------------------------------------------------
  function createDiamondRing() {
    ringGroup = new THREE.Group();

    // 1. Torus Band (Polished Gold)
    const bandGeo = new THREE.TorusGeometry(2.2, 0.28, 30, 80);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFFD166,
      metalness: 0.96,
      roughness: 0.18,
      envMapIntensity: 1.5
    });
    bandMesh = new THREE.Mesh(bandGeo, goldMat);
    ringGroup.add(bandMesh);

    // 2. Diamond Setting (Prong crown)
    const settingGeo = new THREE.CylinderGeometry(0.65, 0.35, 0.45, 8);
    const settingMesh = new THREE.Mesh(settingGeo, goldMat);
    settingMesh.position.set(0, 2.3, 0);
    ringGroup.add(settingMesh);

    // 3. Diamond Gem (Faceted Octahedron / Brilliant Gem)
    const diamondGeo = new THREE.OctahedronGeometry(0.95, 2);
    // Use high-refraction material
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.88,
      emissive: 0x1A2535,
      emissiveIntensity: 0.3
    });
    diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
    diamondMesh.position.set(0, 2.7, 0);
    ringGroup.add(diamondMesh);

    // Default position (floating softly on Hero)
    ringGroup.position.set(0, 0, 0);
    ringGroup.rotation.x = 0.35;
    ringGroup.rotation.y = 0.5;
    scene.add(ringGroup);
  }

  // -------------------------------------------------------------
  // Floating 3D Hearts & Golden Stars
  // -------------------------------------------------------------
  function createFloatingLoveSymbols() {
    // 3D Heart Shape
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0.3, -0.6, 0.6, -0.6, 1.1);
    heartShape.bezierCurveTo(-0.6, 1.5, -0.2, 1.9, 0, 2.1);
    heartShape.bezierCurveTo(0.2, 1.9, 0.6, 1.5, 0.6, 1.1);
    heartShape.bezierCurveTo(0.6, 0.6, 0, 0.3, 0, 0);

    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.12
    };

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    // Center geometry
    heartGeo.center();

    const colors = [0xFF7B89, 0xFFB3A7, 0x9B6CE8, 0xFFCAD4, 0xFFD166];

    for (let i = 0; i < 9; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        metalness: 0.45,
        roughness: 0.25
      });

      const heart = new THREE.Mesh(heartGeo, mat);
      const scale = (Math.random() * 0.35 + 0.35);
      heart.scale.set(scale, scale, scale);

      heart.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 12 - 2
      );

      heart.userData = {
        origY: heart.position.y,
        floatSpeed: Math.random() * 0.8 + 0.4,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.025,
        rotSpeedZ: (Math.random() - 0.5) * 0.015,
        bobPhase: Math.random() * Math.PI * 2
      };

      scene.add(heart);
      floatingObjects.push(heart);
    }

    // Golden Faceted Stars
    const starGeo = new THREE.IcosahedronGeometry(0.48, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xFFD166,
      metalness: 0.9,
      roughness: 0.2
    });

    for (let i = 0; i < 8; i++) {
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10 - 1
      );
      star.userData = {
        origY: star.position.y,
        floatSpeed: Math.random() * 0.7 + 0.3,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        bobPhase: Math.random() * Math.PI * 2
      };
      scene.add(star);
      floatingObjects.push(star);
    }
  }

  // -------------------------------------------------------------
  // Champagne Soda Bubbles (La Revoltosa Signature Sparkling Feel)
  // -------------------------------------------------------------
  function createChampagneBubbles() {
    const bubbleGeo = new THREE.SphereGeometry(1, 16, 16);
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xFFF0E6,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1
    });

    for (let i = 0; i < 110; i++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      const radius = Math.random() * 0.22 + 0.08;
      bubble.scale.set(radius, radius, radius);

      bubble.position.set(
        (Math.random() - 0.5) * 26,
        Math.random() * 24 - 12,
        (Math.random() - 0.5) * 14 - 2
      );

      bubble.userData = {
        speedY: Math.random() * 0.025 + 0.015,
        speedX: (Math.random() - 0.5) * 0.008,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 1.5 + 0.8
      };

      scene.add(bubble);
      bubbleParticles.push(bubble);
    }
  }

  // -------------------------------------------------------------
  // Interactive Camera & 3D Choreography on Slide Change
  // -------------------------------------------------------------
  window.update3DCamera = function (slideIdx) {
    currentSlide = slideIdx;
    if (typeof gsap === 'undefined') return;

    // Define 3D positions for each chapter (Awwwards-style camera journey)
    const cameraTracks = [
      // Chapter 0: Hero & Grand Reveal (Ring Centered & Prominent)
      { camPos: { x: 0, y: 0, z: 16 }, ringPos: { x: 0, y: 0, z: 0 }, ringRot: { x: 0.35, y: 0.6 } },
      // Chapter 1: Must Watch Reel (Camera pans right, ring frames left)
      { camPos: { x: -3.5, y: 1.5, z: 15 }, ringPos: { x: -5.5, y: 0.5, z: 1 }, ringRot: { x: 0.2, y: 1.4 } },
      // Chapter 2: Love Journey Timeline (Camera glides right)
      { camPos: { x: 3.5, y: -1.0, z: 16 }, ringPos: { x: 4.8, y: -0.5, z: 2 }, ringRot: { x: -0.25, y: 2.2 } },
      // Chapter 3: 40 Memories Gallery (Camera pulls back, celebratory perspective)
      { camPos: { x: 0, y: 2.5, z: 19 }, ringPos: { x: 0, y: 4.2, z: -2 }, ringRot: { x: 0.5, y: 3.14 } },
      // Chapter 4: 6 Secret Reasons (Camera rolls slightly)
      { camPos: { x: -2.8, y: -1.2, z: 15.5 }, ringPos: { x: -4.5, y: -1.5, z: 1 }, ringRot: { x: -0.3, y: 4.2 } },
      // Chapter 5: Birthday Cake (Camera zooms close, glowing warm aura)
      { camPos: { x: 0, y: -1.5, z: 13.5 }, ringPos: { x: 0, y: 2.8, z: 1 }, ringRot: { x: 0.1, y: 5.2 } },
      // Chapter 6: Royal Love Letter (Grand symmetrical royal frame)
      { camPos: { x: 0, y: 0, z: 17 }, ringPos: { x: 0, y: 0, z: -1 }, ringRot: { x: 0.3, y: 6.28 } }
    ];

    const track = cameraTracks[slideIdx] || cameraTracks[0];

    // Smooth GSAP tweening
    gsap.to(camera.position, {
      x: track.camPos.x,
      y: track.camPos.y,
      z: track.camPos.z,
      duration: 1.4,
      ease: 'power2.inOut'
    });

    if (ringGroup) {
      gsap.to(ringGroup.position, {
        x: track.ringPos.x,
        y: track.ringPos.y,
        z: track.ringPos.z,
        duration: 1.4,
        ease: 'power2.inOut'
      });
      gsap.to(ringGroup.rotation, {
        x: track.ringRot.x,
        y: track.ringRot.y,
        duration: 1.6,
        ease: 'power2.inOut'
      });
    }
  };

  // -------------------------------------------------------------
  // Animation & Render Loop
  // -------------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // 1. Mouse Lerping (Inertial camera tracking)
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Gentle camera parallax
    camera.rotation.y = -mouse.x * 0.08;
    camera.rotation.x = mouse.y * 0.06;

    // Point light follows cursor in 3D
    if (pointLight) {
      pointLight.position.x = mouse.x * 12;
      pointLight.position.y = mouse.y * 8;
    }

    // 2. Diamond Ring Animation
    if (ringGroup) {
      ringGroup.rotation.y += 0.008;
      ringGroup.position.y += Math.sin(elapsedTime * 1.5) * 0.004;

      if (diamondMesh) {
        diamondMesh.rotation.y += 0.012;
      }
    }

    // 3. Floating Hearts & Stars Animation
    floatingObjects.forEach((obj) => {
      obj.rotation.x += obj.userData.rotSpeedX;
      obj.rotation.y += obj.userData.rotSpeedY;
      obj.position.y = obj.userData.origY + Math.sin(elapsedTime * obj.userData.floatSpeed + obj.userData.bobPhase) * 0.45;
    });

    // 4. Champagne Bubbles Rising
    bubbleParticles.forEach((bubble) => {
      bubble.position.y += bubble.userData.speedY;
      bubble.position.x += Math.sin(elapsedTime * bubble.userData.swaySpeed + bubble.userData.swayPhase) * 0.012;

      // Loop back when reaching top
      if (bubble.position.y > 12) {
        bubble.position.y = -12;
        bubble.position.x = (Math.random() - 0.5) * 26;
      }
    });

    renderer.render(scene, camera);
  }

  // -------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------
  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function onMouseMove(e) {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

