import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSpring, animated, useSpringRef, to, config } from "@react-spring/three";
import { Box } from '@react-three/drei';

import mainScene from "../assets/3d/anotherScene.glb";

import CanvasLoader from "./Loader";
import { useResponsiveScale, CameraController, Lighting, CameraEvents, ZoomEvents, SelectionEvent, AnimatedCamera } from "./SceneController";

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
    <mesh ref={sceneRef} position={position} scale={scale} rotation={[0, -1.5, 0]}>
      <primitive object={scene} />
    </mesh>
  );
}

const StateControl = (selected, setActiveCamera, setTargetPosition) => {
  const [state, setState] = useState("World");

  useEffect(() => {
    if (selected) {
      switch (selected.name) {
        case "World":
          setState("World");
          console.log("World");
          setActiveCamera("main");
          setTargetPosition([0, 0, 0]);
          break;
        case "Art":
          setState("Art");
          console.log("Art");
          setActiveCamera("animated");
          setTargetPosition([10, 5, 0]);
          break;
        case "Portfolio":
          setState("Portfolio");
          console.log("Portfolio");
          setActiveCamera("animated");
          setTargetPosition([-10, 5, 0]);
          break;
        case "Games":
          setState("Games");
          console.log("Games");
          setActiveCamera("animated");
          setTargetPosition([10, 10, 10]);
          break;
      }
    }
  }, [selected]);

  return { state };
}

const ControlStuff = () => {
  const [activeCamera, setActiveCamera] = useState("main");
  const [selected, setSelected] = useState(null);
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);

  const { modelScale, modelPosition } = useResponsiveScale();
  const { zoom } = ZoomEvents();
  const { state } = StateControl(selected, setActiveCamera, setTargetPosition);
  const { rotationX, rotationY } = CameraEvents(state);

  const springRef = useSpringRef();

  const spring = useSpring({
    ref: springRef,
    from: { position: [0, 0, 0] },
    to: { position: targetPosition},
    config: { mass: 5, tension: 400, friction: 50 },
  });

  useEffect(() => {
    springRef.start();
  }, [targetPosition, springRef]);

  return (
    <group>
      {activeCamera === "main" && <CameraController zoom={zoom} rotationX={rotationX} rotationY={rotationY} animate={false} />}
      {activeCamera === "animated" && <AnimatedCamera position={spring.position} rotation={[0, 0, 0]} />}
      <Lighting />
      <StaticGLB glb={mainScene} scale={modelScale} position={modelPosition} />
      <SelectionEvent setSelected={setSelected} />
      <animated.mesh position={spring.position}>
      <Box args={[1, 1, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial attach="material" color="orange" />
      </Box>
      </animated.mesh>
    </group>
  );
};

const IdleStuff = () => {

  const { position } = useSpring({
    from: { position: [0, 0, 0] },
    to: [{ position: [0, 0, 0] }, { position: [1, 0, 0] }, { position: [0, 0, 0] }],
    config: { mass: 5, tension: 400, friction: 50 },
    loop: true,
  });

  return (
    <group>

    </group>
  );
};

const SpacemanCanvas = () => {

  // const [{ position, rotation }, api] = useSpring(() => ({
  //   position: [0, 5, 10],
  //   rotation: [0, 0, 0],
  //   config: { mass: 5, tension: 400, friction: 50 },
  // }));

  // useEffect(() => {
  //   const newPosition = state === 'World' ? [0, 5, 10] : 
  //                       state === 'Art' ? [10, 5, 0] : 
  //                       state === 'Games' ? [-10, 5, 0] : 
  //                       [10, 10, 10];

  //   const newRotation = state === 'World' ? [0, 0, 0] : 
  //                       state === 'Art' ? [0, Math.PI / 4, 0] : 
  //                       state === 'Games' ? [0, -Math.PI / 4, 0] : 
  //                       [0, 0, 0];

  //   // api.start({
  //   //   position: newPosition,
  //   //   rotation: newRotation,
  //   // });

  //   console.log(position, rotation);

  // }, [state, api]);

  return (
    <Canvas className={`w-full h-screen bg-transparent z-10`} camera={{ near: 0.1, far: 1000 }}>
      <Suspense fallback={<CanvasLoader />}>
        <ControlStuff />
        <IdleStuff />
      </Suspense>
    </Canvas>
  );
};

export default SpacemanCanvas;
