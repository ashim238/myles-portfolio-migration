"use client";

import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  OrbitControls,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

type Device3DSceneProps = {
  /** Public path to the screen image mapped onto the display. */
  screen: string;
};

// iPhone-ish proportions. Screen plane sits a hair proud of the front face.
const BODY = { w: 1.62, h: 3.34, d: 0.22, radius: 0.2 };
const SCREEN = { w: 1.48, h: 3.16 };

function Phone({ screen }: { screen: string }) {
  const texture = useTexture(screen);

  return (
    <group rotation={[0, -0.35, 0]}>
      {/* Body */}
      <RoundedBox
        args={[BODY.w, BODY.h, BODY.d]}
        radius={BODY.radius}
        smoothness={8}
        castShadow
      >
        <meshStandardMaterial color="#0b0b0c" metalness={0.25} roughness={0.55} />
      </RoundedBox>

      {/* Screen */}
      <mesh position={[0, 0, BODY.d / 2 + 0.002]}>
        <planeGeometry args={[SCREEN.w, SCREEN.h]} />
        <meshBasicMaterial
          map={texture}
          map-colorSpace={THREE.SRGBColorSpace}
          map-anisotropy={8}
          toneMapped={false}
        />
      </mesh>

      {/* Dynamic island */}
      <mesh position={[0, SCREEN.h / 2 - 0.16, BODY.d / 2 + 0.004]}>
        <planeGeometry args={[0.34, 0.1]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}

export default function Device3DScene({ screen }: Device3DSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color="#6aab7e" />
      <pointLight position={[0, 0, 4]} intensity={0.6} />

      <Suspense fallback={null}>
        <Phone screen={screen} />
      </Suspense>

      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.34}
        scale={7}
        blur={2.6}
        far={3}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.7}
        minPolarAngle={Math.PI / 2 - 0.45}
        maxPolarAngle={Math.PI / 2 + 0.45}
        minAzimuthAngle={-0.9}
        maxAzimuthAngle={0.9}
      />
    </Canvas>
  );
}
