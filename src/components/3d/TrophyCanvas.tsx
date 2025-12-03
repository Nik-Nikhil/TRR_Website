// src/components/3d/TrophyCanvas.tsx
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function AegisModel() {
  const gltf = useGLTF("/models/aegis.glb");
  return <primitive object={gltf.scene} scale={2.2} />;
}

export default function TrophyCanvas() {
  return (
    <div className="w-full h-[320px] md:h-[720px] rounded-3xl overflow-hidden">
      <Canvas camera={{ position: [0, 1.8, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 8, 4]} intensity={1.4} />
        <Suspense fallback={null}>
          <AegisModel />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={3.2}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/aegis.glb");
