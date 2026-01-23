// src/components/3d/TrophyCanvas.tsx
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import type { Mesh, Object3D, Group } from "three";
import { MeshStandardMaterial } from "three";

function AegisModel() {
  const gltf = useGLTF("/models/aegis.glb");
  const groupRef = useRef<Group>(null!);

  // Floating animation only - no spinning
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Base Y position varies by screen size
      const baseY = window.innerWidth < 768 ? 2.5 : 3.4;
      groupRef.current.position.y = baseY + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      // Removed auto-spinning - user controls rotation now
    }
  });

  gltf.scene.traverse((child: Object3D) => {
    const mesh = child as Mesh;

    if (!mesh.isMesh) return;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const material = mesh.material as MeshStandardMaterial;

    // 🔥 golden-metal style
    material.metalness = 1;
    material.roughness = 0.18;
    material.envMapIntensity = 1.35;
  });

  // Responsive positioning
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  
  const position: [number, number, number] = isMobile 
    ? [0, 2.5, 0] 
    : isTablet 
    ? [-0.5, 3, -0.1]
    : [-0.7, 3.4, -0.1];
    
  const scale = isMobile ? 1.1 : isTablet ? 1.3 : 1.5;

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={[-0.01, -1.37, 0]}
      scale={scale}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    // Responsive camera positioning
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    const cameraPos: [number, number, number] = isMobile
      ? [0, 1.5, 5.5]
      : isTablet
      ? [0.5, 1.7, 5.2]
      : [0.8, 1.8, 4.9];
      
    const fovValue = isMobile ? 50 : isTablet ? 49 : 48;
    
    camera.position.set(...cameraPos);
    if ('fov' in camera) {
      camera.fov = fovValue;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  return null;
}

export default function TrophyCanvas() {
  // Responsive target positioning
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
  
  const target: [number, number, number] = isMobile
    ? [0, 2, 0]
    : isTablet
    ? [-0.3, 2.5, 0.1]
    : [-0.6, 2.2, 0.1];

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden">
      <Canvas
        camera={{ position: [0.8, 1.8, 4.9], fov: 48 }}
        shadows
        gl={{ antialias: true }}
      >
        <CameraController />
        {/* 🔥 Cinematic lighting */}
        <ambientLight intensity={0.18} />
        <directionalLight position={[0, 4.8, 3]} intensity={3.2} />
        <directionalLight position={[-3, -2, -4]} intensity={1.8} />
        <pointLight position={[0, 2.6, -3]} intensity={1.2} />
        <spotLight
          position={[0, 6, 0]}
          angle={0.35}
          intensity={2}
          penumbra={0.7}
          castShadow
        />

        <Suspense fallback={null}>
          <AegisModel />
          {/* gold / chrome HDR reflections */}
          <Environment preset="studio" resolution={256} />
        </Suspense>

        {/* OrbitControls for camera - rotation only, no zoom */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          target={target}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/aegis.glb");
