// src/components/3d/TrophyCanvas.tsx
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import type { Mesh, Object3D } from "three";
import { MeshStandardMaterial } from "three";

function AegisModel() {
  const gltf = useGLTF("/models/aegis.glb");

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

  return <primitive object={gltf.scene} scale={2.2} />;
}

export default function TrophyCanvas() {
  return (
    <div className="w-full h-80 md:h-[720px] rounded-3xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 1.8, 5], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
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

        {/* smooth auto rotation */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={2.4}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/aegis.glb");
