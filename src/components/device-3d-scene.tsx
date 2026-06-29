"use client";

import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

type Device3DSceneProps = {
  /** Public path to the screen image mapped onto the display. */
  screen: string;
};

// Screen aspect locked to the source screenshots (1290 × 2796 ≈ 19.5:9) so the
// UI is housed edge-to-edge with no letterbox, crop, or stretch. Everything
// else is sized outward from the display.
const SCREEN_AR = 1290 / 2796;
const SCREEN_H = 3.18;
const SCREEN_W = SCREEN_H * SCREEN_AR;
const SCREEN_R = 0.17; // display corner radius

const BEZEL = 0.05; // black glass border around the display
const GLASS_W = SCREEN_W + BEZEL * 2;
const GLASS_H = SCREEN_H + BEZEL * 2;
const GLASS_R = SCREEN_R + BEZEL;

const RAIL = 0.022; // metal showing past the glass on the front
const BODY = {
  w: GLASS_W + RAIL * 2,
  h: GLASS_H + RAIL * 2,
  d: 0.2,
  radius: 0.22,
};
const FRONT = BODY.d / 2;

/**
 * Flat rounded-rectangle geometry with UVs remapped to 0..1 over its bounding
 * box, so an image texture maps upright and undistorted. Used for the display,
 * the glass panel, and the dynamic island.
 */
function useRoundedRect(w: number, h: number, r: number, segments = 16) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const geo = new THREE.ShapeGeometry(shape, segments);
    const pos = geo.attributes.position;
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uv[i * 2] = (pos.getX(i) - x) / w;
      uv[i * 2 + 1] = (pos.getY(i) - y) / h;
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    return geo;
  }, [w, h, r, segments]);
}

function CameraBump() {
  // Sits on the back; comes into view as the phone rotates.
  const z = -FRONT - 0.01;
  const lens = (lx: number, ly: number) => (
    <group position={[lx, ly, z - 0.03]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05, 32]} />
        <meshPhysicalMaterial color="#0c0c0d" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 32]} />
        <meshPhysicalMaterial
          color="#05060a"
          metalness={0}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
    </group>
  );

  return (
    <group position={[-BODY.w / 2 + 0.46, BODY.h / 2 - 0.52, 0]}>
      <RoundedBox args={[0.66, 0.66, 0.06]} radius={0.16} smoothness={6} position={[0, 0, z]}>
        <meshPhysicalMaterial color="#1c1d20" metalness={0.85} roughness={0.38} />
      </RoundedBox>
      {lens(-0.14, 0.14)}
      {lens(0.14, 0.14)}
      {lens(-0.14, -0.14)}
      {/* flash */}
      <mesh position={[0.16, -0.16, z - 0.02]}>
        <circleGeometry args={[0.045, 24]} />
        <meshBasicMaterial color="#e9e4cf" />
      </mesh>
    </group>
  );
}

function Phone({ screen }: { screen: string }) {
  const texture = useTexture(screen);
  const displayGeo = useRoundedRect(SCREEN_W, SCREEN_H, SCREEN_R);
  const glassGeo = useRoundedRect(GLASS_W, GLASS_H, GLASS_R);
  const islandGeo = useRoundedRect(0.42, 0.115, 0.057, 8);

  const railMat = (
    <meshPhysicalMaterial
      color="#17181b"
      metalness={0.92}
      roughness={0.32}
      clearcoat={0.6}
      clearcoatRoughness={0.25}
      envMapIntensity={1.2}
    />
  );

  return (
    <group rotation={[0, -0.32, 0]}>
      {/* Metal rail / chassis */}
      <RoundedBox args={[BODY.w, BODY.h, BODY.d]} radius={BODY.radius} smoothness={12} castShadow receiveShadow>
        {railMat}
      </RoundedBox>

      {/* Glossy black front glass — the bezel around the display. */}
      <mesh geometry={glassGeo} position={[0, 0, FRONT + 0.001]}>
        <meshPhysicalMaterial
          color="#08090b"
          metalness={0}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1}
        />
      </mesh>

      {/* The display — unlit so the shipped UI reads at true colour, housed
          exactly to the screenshot's aspect with matching rounded corners. */}
      <mesh geometry={displayGeo} position={[0, 0, FRONT + 0.004]}>
        <meshBasicMaterial
          map={texture}
          map-colorSpace={THREE.SRGBColorSpace}
          map-anisotropy={16}
          toneMapped={false}
        />
      </mesh>

      {/* Dynamic island */}
      <mesh geometry={islandGeo} position={[0, SCREEN_H / 2 - 0.12, FRONT + 0.006]}>
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Side buttons */}
      <mesh position={[BODY.w / 2, 0.3, 0]}>
        <boxGeometry args={[0.02, 0.36, 0.07]} />
        {railMat}
      </mesh>
      <mesh position={[-BODY.w / 2, 0.55, 0]}>
        <boxGeometry args={[0.02, 0.22, 0.07]} />
        {railMat}
      </mesh>
      <mesh position={[-BODY.w / 2, 0.22, 0]}>
        <boxGeometry args={[0.02, 0.22, 0.07]} />
        {railMat}
      </mesh>

      <CameraBump />
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
      {/* Key light — the only direct light; it casts the grounding shadow.
          Fill and reflections come from the environment. */}
      <directionalLight
        position={[3.5, 5.5, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <ambientLight intensity={0.2} />

      {/* In-memory studio environment (no network/HDRI file). The softboxes
          read as reflections along the aluminium edges and the glass. Kept
          neutral on purpose — the device is a product shot, not tinted by the
          project accent (per "neutralize device rim light"). */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.4} position={[0, 2.5, 4]} scale={[7, 7, 1]} color="#ffffff" />
        <Lightformer intensity={1.1} position={[-4, 0.5, 2]} scale={[3, 7, 1]} color="#eef2f5" />
        <Lightformer
          intensity={2.6}
          position={[4, 1.5, 1]}
          rotation-y={-Math.PI / 4}
          scale={[2.5, 7, 1]}
          color="#f4f6f8"
        />
        <Lightformer intensity={1.4} position={[0, -3, 2]} scale={[6, 3, 1]} color="#d7dcda" />
      </Environment>

      <Suspense fallback={null}>
        <Phone screen={screen} />
      </Suspense>

      <ContactShadows
        position={[0, -1.95, 0]}
        opacity={0.42}
        scale={8}
        blur={3.2}
        far={3.2}
        resolution={512}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 2 - 0.45}
        maxPolarAngle={Math.PI / 2 + 0.45}
        minAzimuthAngle={-0.9}
        maxAzimuthAngle={0.9}
      />
    </Canvas>
  );
}
