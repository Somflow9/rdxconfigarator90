'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Html, 
  Sky, 
  Stars,
  Preload,
  useProgress
} from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { useConfigStore } from '@/store/configStore';
import { motion } from 'framer-motion';
import { 
  RotateCw,
  Eye, 
  EyeOff
} from 'lucide-react';
import * as THREE from 'three';

// Loading component with progress
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4"
        />
        <p className="text-white text-lg font-medium mb-2">Loading 3D Model</p>
        <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto mb-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-gray-400 text-sm">{Math.round(progress)}%</p>
      </motion.div>
    </Html>
  );
}

// Enhanced car model with GLTF loading and customization
function CarModel() {
  const { variant, color, roof, wheels, addOns, decals, customPlate } = useConfigStore();
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Create material instances for customization
  const bodyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color.hex),
      metalness: 0.8,
      roughness: decals.find(d => d.id === 'matte-wrap') ? 0.8 : 0.2,
      envMapIntensity: 1.0,
    });
  }, [color.hex, decals]);

  const roofMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: roof.id === 'convertible' ? new THREE.Color('#1a1a1a') : new THREE.Color(color.hex),
      metalness: 0.7,
      roughness: roof.id === 'soft-top' ? 0.9 : 0.3,
      envMapIntensity: 1.0,
    });
  }, [color.hex, roof.id]);

  const wheelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(wheels.type === 'alloy' ? '#C0C0C0' : '#1a1a1a'),
      metalness: 0.95,
      roughness: wheels.type === 'offroad' ? 0.3 : 0.1,
      envMapIntensity: 1.0,
    });
  }, [wheels.type]);

  // Create fallback geometry for missing models
  const createFallbackCar = useMemo(() => {
    const group = new THREE.Group();
    
    // Create car body (main box)
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 4);
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 0.4;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);
    
    // Create roof
    const roofGeometry = new THREE.BoxGeometry(1.8, 0.6, 2.5);
    const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
    roofMesh.position.y = 1.1;
    roofMesh.position.z = -0.3;
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    group.add(roofMesh);
    
    // Create wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const wheelPositions = [
      [-0.8, 0.4, -1.2], // Front left
      [0.8, 0.4, -1.2],  // Front right
      [-0.8, 0.4, 1.2],  // Rear left
      [0.8, 0.4, 1.2],   // Rear right
    ];
    
    wheelPositions.forEach((position) => {
      const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheelMesh.position.set(position[0], position[1], position[2]);
      wheelMesh.rotation.z = Math.PI / 2;
      wheelMesh.castShadow = true;
      wheelMesh.receiveShadow = true;
      group.add(wheelMesh);
    });
    
    // Add headlights
    const headlightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: 0.3,
    });
    
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.6, 0.6, -2);
    group.add(leftHeadlight);
    
    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.6, 0.6, -2);
    group.add(rightHeadlight);
    
    return group;
  }, [bodyMaterial, roofMaterial, wheelMaterial]);

  // Animation for configuration changes
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      
      // Subtle rotation based on hover
      if (hovered) {
        groupRef.current.rotation.y += 0.01;
      } else {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      }
    }
  });

  // Animation trigger for configuration changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [variant, color, roof, wheels, addOns, decals]);

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={isAnimating ? 1.05 : 1}
    >
      {/* Always render fallback car geometry since models are missing */}
      <primitive object={createFallbackCar} />
      
      {/* Add-ons rendering would go here */}
      {addOns.map((addon) => {
        // Placeholder for add-on components
        return (
          <mesh key={addon.id} position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} castShadow receiveShadow>
            <boxGeometry />
            <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.2} />
          </mesh>
        );
      })}
      
      {/* Decals rendering would go here */}
      {decals.map((decal) => {
        // Placeholder for decal components
        return (
          <mesh key={decal.id} position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]}>
            <boxGeometry />
            <meshStandardMaterial color="#ff0000" transparent opacity={0.8} />
          </mesh>
        );
      })}
      
      {/* Custom plate rendering would go here */}
      {customPlate && (
        <Html position={[0, 0.5, 2.1]} center>
          <div className="bg-white text-black px-2 py-1 rounded text-xs font-mono border-2 border-black">
            {customPlate}
          </div>
        </Html>
      )}
    </group>
  );
}

// Camera controls component
function CameraControls() {
  const [showControls, setShowControls] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  const positions = {
    front: { position: [0, 1, 6], target: [0, 1, 0] },
    side: { position: [6, 1, 0], target: [0, 1, 0] },
    rear: { position: [0, 1, -6], target: [0, 1, 0] },
    top: { position: [0, 8, 0], target: [0, 0, 0] },
    interior: { position: [0, 1.5, 0.5], target: [0, 1.5, 2] }
  };

  const handleCameraChange = (position: keyof typeof positions) => {
    const { position: pos, target } = positions[position];
    
    // This would animate the camera in a real implementation
    console.log(`Camera changed to ${position} view`);
  };

  return (
    <>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 6}
        maxDistance={20}
        minDistance={2}
        dampingFactor={0.05}
        enableDamping={true}
      />
      
      {/* Camera position buttons */}
      {showControls && (
        <Html position={[0, 0, 0]}>
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {Object.keys(positions).map((pos) => (
              <button
                key={pos}
                onClick={() => handleCameraChange(pos as keyof typeof positions)}
                className="bg-black/60 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm border border-white/10 hover:bg-black/80 transition-all duration-200"
              >
                {pos.charAt(0).toUpperCase() + pos.slice(1)}
              </button>
            ))}
          </div>
        </Html>
      )}
    </>
  );
}

// Enhanced environment component
function EnhancedEnvironment() {
  return (
    <>
      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0.5}
        azimuth={0.25}
        rayleigh={1}
        turbidity={10}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      
      {/* Stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Ambient light */}
      <ambientLight intensity={0.3} />
      
      {/* Directional light (sun) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Point lights for dramatic effect */}
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#8B5CF6" />
      <pointLight position={[10, 10, -10]} intensity={0.5} color="#EC4899" />
    </>
  );
}

export default function CarViewer() {
  const [is3DLoaded, set3DLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-purple-900 rounded-lg overflow-hidden"
    >
      <Canvas
        camera={{ position: [6, 3, 6], fov: 55, near: 0.1, far: 2000 }}
        onCreated={() => set3DLoaded(true)}
        className="w-full h-full"
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={<Loader />}>
          <EnhancedEnvironment />
          <CarModel />
          <CameraControls />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Enhanced loading overlay */}
      {!is3DLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4"
            />
            <p className="text-white text-lg font-medium">Loading 3D Model...</p>
            <p className="text-gray-400 text-sm mt-2">Preparing your premium experience</p>
          </div>
        </motion.div>
      )}

      {/* Enhanced configuration info overlay */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 right-6 bg-black/60 backdrop-blur-md rounded-xl p-4 text-white border border-white/10"
      >
        <h3 className="font-semibold mb-3 text-primary">Current Build</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Variant:</span>
            <span className="font-medium">{useConfigStore.getState().variant.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Color:</span>
            <span className="font-medium">{useConfigStore.getState().color.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Roof:</span>
            <span className="font-medium">{useConfigStore.getState().roof.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Wheels:</span>
            <span className="font-medium">{useConfigStore.getState().wheels.name}</span>
          </div>
        </div>
      </motion.div>

      {/* Control toggle buttons */}
      <div className="absolute top-6 left-6 flex gap-2">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => setShowControls(!showControls)}
          className="bg-black/60 backdrop-blur-md rounded-lg p-2 text-white border border-white/10 hover:bg-black/80 transition-all duration-200"
        >
          {showControls ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => setAutoRotate(!autoRotate)}
          className={`backdrop-blur-md rounded-lg p-2 text-white border border-white/10 transition-all duration-200 ${
            autoRotate ? 'bg-primary/60' : 'bg-black/60 hover:bg-black/80'
          }`}
        >
          <RotateCw className={`w-5 h-5 ${autoRotate ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>
    </motion.div>
  );
} 