import { Canvas } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Sparkles,
} from "@react-three/drei";

/* =========================
   3D RURAL PERSON
========================= */

function RuralPerson() {
  return (
    <group position={[0, -0.9, 1]}>

      {/* Legs */}
      <mesh position={[-0.22, 0.35, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 1.1, 10]} />
        <meshStandardMaterial color="#f1e0c0" />
      </mesh>

      <mesh position={[0.22, 0.35, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 1.1, 10]} />
        <meshStandardMaterial color="#f1e0c0" />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.22, -0.2, 0.12]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#70452d" />
      </mesh>

      <mesh position={[0.22, -0.2, 0.12]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#70452d" />
      </mesh>

      {/* Kurta / Body */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.9, 1.4, 0.55]} />
        <meshStandardMaterial color="#f5e7c8" />
      </mesh>

      {/* Scarf */}
      <mesh
        position={[-0.32, 1.15, 0.32]}
        rotation={[0, 0, -0.08]}
      >
        <boxGeometry args={[0.16, 1.35, 0.06]} />
        <meshStandardMaterial color="#c94f3d" />
      </mesh>

      <mesh
        position={[0.32, 1.15, 0.32]}
        rotation={[0, 0, 0.08]}
      >
        <boxGeometry args={[0.16, 1.35, 0.06]} />
        <meshStandardMaterial color="#c94f3d" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.95, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.25, 12]} />
        <meshStandardMaterial color="#9b613e" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.35, 0]}>
        <sphereGeometry args={[0.43, 24, 24]} />
        <meshStandardMaterial color="#a96d46" />
      </mesh>

      {/* Turban */}
      <mesh position={[0, 2.75, 0]}>
        <sphereGeometry args={[0.46, 20, 12]} />
        <meshStandardMaterial color="#e9d4a8" />
      </mesh>

      {/* Turban band */}
      <mesh position={[0, 2.67, 0]}>
        <torusGeometry args={[0.39, 0.045, 8, 24]} />
        <meshStandardMaterial color="#c98945" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.15, 2.4, 0.39]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <mesh position={[0.15, 2.4, 0.39]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 2.3, 0.42]}>
        <coneGeometry args={[0.07, 0.15, 8]} />
        <meshStandardMaterial color="#8f5739" />
      </mesh>

      {/* Happy smile */}
      <mesh
        position={[0, 2.18, 0.4]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.12, 0.025, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#4b2419" />
      </mesh>

      {/* Moustache */}
      <mesh position={[-0.09, 2.23, 0.43]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#38251c" />
      </mesh>

      <mesh position={[0.09, 2.23, 0.43]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#38251c" />
      </mesh>

      {/* Left arm */}
      <mesh
        position={[-0.62, 1.35, 0]}
        rotation={[0, 0, -0.65]}
      >
        <cylinderGeometry args={[0.11, 0.13, 0.9, 10]} />
        <meshStandardMaterial color="#f5e7c8" />
      </mesh>

      {/* Right arm - holding tablet */}
      <mesh
        position={[0.55, 1.25, 0.15]}
        rotation={[0, 0, 0.45]}
      >
        <cylinderGeometry args={[0.11, 0.13, 0.85, 10]} />
        <meshStandardMaterial color="#f5e7c8" />
      </mesh>

      {/* Tablet */}
      <mesh
        position={[0.45, 1.25, 0.5]}
        rotation={[0.1, -0.2, -0.15]}
      >
        <boxGeometry args={[0.45, 0.65, 0.05]} />
        <meshStandardMaterial color="#263238" />
      </mesh>

      {/* Thumb-up hand */}
      <group position={[-0.92, 1.75, 0]}>

        <mesh>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#a96d46" />
        </mesh>

        {/* Thumb */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.3, 10]} />
          <meshStandardMaterial color="#a96d46" />
        </mesh>

      </group>

    </group>
  );
}


/* =========================
   HOUSE
========================= */

function House() {
  return (
    <group position={[0, -1.4, -1]}>

      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[2.5, 1.5, 2]} />
        <meshStandardMaterial color="#d6ae7b" />
      </mesh>

      <mesh
        position={[0, 1.5, 0]}
        rotation={[0, 0, Math.PI / 4]}
      >
        <boxGeometry args={[2.1, 2.1, 2]} />
        <meshStandardMaterial color="#8b5539" />
      </mesh>

      <mesh position={[0, 0.45, 1.05]}>
        <boxGeometry args={[0.5, 0.9, 0.08]} />
        <meshStandardMaterial color="#563b2d" />
      </mesh>

    </group>
  );
}


/* =========================
   TREE
========================= */

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>

      <mesh>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 8]} />
        <meshStandardMaterial color="#795548" />
      </mesh>

      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshStandardMaterial color="#4f8f45" />
      </mesh>

    </group>
  );
}


/* =========================
   SCENE
========================= */

function Scene() {
  return (
    <>
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={2}
      />

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.5, 0]}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#a8c686" />
      </mesh>

      {/* Rural person */}
      <Float
        speed={1.2}
        rotationIntensity={0.08}
        floatIntensity={0.15}
      >
        <RuralPerson />
      </Float>

      {/* Village house */}
      <House />

      {/* Trees */}
      <Tree position={[-3, -0.8, -1]} scale={1.2} />
      <Tree position={[3, -0.8, -1]} scale={0.9} />
      <Tree position={[-4, -0.8, -3]} scale={0.8} />
      <Tree position={[4, -0.8, -3]} scale={1.1} />

      {/* AI particles */}
      <Sparkles
        count={80}
        scale={[8, 5, 5]}
        size={2}
        speed={0.4}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.5}
      />
    </>
  );
}


/* =========================
   MAIN COMPONENT
========================= */

export default function Rural3DScene() {
  return (
    <div className="rural-3d-scene">

      <Canvas
        camera={{
          position: [0, 1.8, 7],
          fov: 45,
        }}
      >
        <Scene />
      </Canvas>

      <div className="scene-overlay">
        <h2>🌾 Gram-Pragati AI</h2>

        <p>
          Your AI Business Partner for Rural India
        </p>
      </div>

    </div>
  );
}