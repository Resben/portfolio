import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/three";
import { Box } from '@react-three/drei';

import mainScene from "../assets/3d/anotherScene.glb";

import CanvasLoader from "./Loader";
import { CameraTransition, Lighting, SelectionEvent } from "./SceneController";
import GameDevelopment from "./GameDevelopment";

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

const StateControl = (selected) => {
  const [state, setState] = useState("World");

  useEffect(() => {
    if (selected) {
      switch (selected) {
        case "World":
          setState("World");
          console.log("World");
          break;
        case "Art":
          setState("Art");
          console.log("Art");
          break;
        case "Portfolio":
          setState("Portfolio");
          console.log("Portfolio");
          break;
        case "Games":
          setState("Games");
          console.log("Games");
          break;
      }
    }
  }, [selected]);

  return { state };
}

const CameraPosition = (state) => {
  const [position, setPosition] = useState([0, 0, 0]);
  const [target, setTarget] = useState([0, 0, 0]);
  const [controls, setControls] = useState(true);

  useEffect(() => {
    switch (state) {
      case "World":
        setPosition([-10, 4, -3]);
        setTarget([0, 0, 0]);
        setControls(true);
        break;
      case "Art":
        setPosition([0, 0, 0]);
        setTarget([0, 0, 0]);
        setControls(false);
        break;
      case "Portfolio":
        setPosition([0, 0, 0]);
        setTarget([0, 0, 0]);
        setControls(false);
        break;
      case "Games":
        setPosition([1, 2.2, 0.2]);
        setTarget([1, 2.2, 1]);
        setControls(false);
        break;
    }
  }, [state]);

  return { position, target, controls };
}


const ControlStuff = () => {
  const [selected, setSelected] = useState(null);
  const { state } = StateControl(selected);
  const { position, target, controls } = CameraPosition(state);
  
  useEffect(() => {

  }, [state]);

  // TESTING
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 't') {
        setSelected("Games");
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <group>
      <CameraTransition position={position} target={target} controls={controls} />
      <Lighting />
      <StaticGLB glb={mainScene}/>
      <SelectionEvent setSelected={setSelected} />
      <GameDevelopment setSelected={setSelected} state={state}/>
      <animated.mesh>
      <Box args={[1, 1, 1]} position={[1, 6.0, 0]}>
          <meshStandardMaterial attach="material" color="orange" name="hs" />
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

  return (
    <Canvas className={`w-full h-screen bg-transparent z-10`} camera={{ near: 0.1, far: 1000 }}>
      <Suspense fallback={<CanvasLoader />}>
        <ControlStuff/>
        <IdleStuff />
      </Suspense>
    </Canvas>
  );
};

export default SpacemanCanvas;