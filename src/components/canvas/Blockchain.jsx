import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls, useLoader } from "@react-three/drei";
import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

extend({ OrbitControls });

const PCDModel = () => {
  const pointsRef = useRef();
  const { scene } = useThree();

  const points = useLoader(PCDLoader, "./models/pcd/binary/Zaghetto.pcd");

  useEffect(() => {
    if (points) {
      points.geometry.center();
      points.geometry.rotateX(Math.PI);
      points.name = "Zaghetto.pcd";
      pointsRef.current = points;
      scene.add(points);

      const gui = new GUI();
      gui.add(points.material, "size", 0.001, 0.01).onChange(() => {});
      gui.addColor(points.material, "color").onChange(() => {});
      gui.open();
    }
    return () => {
      if (points) {
        scene.remove(points);
      }
    };
  }, [points, scene]);

  return null;
};

const BlockchainCanvas = () => {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      gl.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [camera, gl]);

  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 30 }}
      onCreated={({ gl }) => {
        gl.setSize(window.innerWidth, window.innerHeight);
        gl.setPixelRatio(window.devicePixelRatio);
      }}
    >
      <Suspense fallback={null}>
        <OrbitControls
          enableZoom
          minDistance={0.5}
          maxDistance={10}
        />
        <PCDModel />
      </Suspense>
    </Canvas>
  );
};



export default BlockchainCanvas;
