import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import computerScene from "../assets/3d/webtest.glb";
import planeGLB from "../assets/3d/plane.glb";
import CanvasLoader from "./Loader";
import { useResponsiveScale, CameraController, Lighting, CameraEvents, ZoomEvents, SelectionEvent } from "./SceneController";

const AnimatedGLB = ({ glb, scale, position }) => {
  const sceneRef = useRef();
  const { scene, animations } = useGLTF(glb);
  const { actions } = useAnimations(animations, sceneRef);

  useEffect(() => {
    actions["Idle"].play();
  }, [actions]);

  return (
    <mesh ref={sceneRef} position={position} scale={scale}>
      <primitive object={scene} />
    </mesh>
  );
};

const StaticGLB = ({ glb, scale, position }) => {
  const sceneRef = useRef();
  const { scene } = useGLTF(glb);

  return (
    <mesh ref={sceneRef} position={position} scale={scale}> 
      <primitive object={scene} />
    </mesh>  
  );
}

const SpacemanCanvas = () => {
  const { scale, position } = useResponsiveScale();
  const { rotationX, rotationY } = CameraEvents();
  const { zoom } = ZoomEvents();

  return (
    <Canvas className={`w-full h-screen bg-transparent z-10`} camera={{ near: 0.1, far: 1000 }}>
      <Suspense fallback={<CanvasLoader />}>

        <Lighting />
        <CameraController rotationX={rotationX} rotationY={rotationY} />
        <AnimatedGLB glb={computerScene} scale={scale} position={position} />
        <StaticGLB glb={planeGLB} scale={scale} position={position} />
        <SelectionEvent />
      </Suspense>
    </Canvas>
  );
};

export default SpacemanCanvas;
