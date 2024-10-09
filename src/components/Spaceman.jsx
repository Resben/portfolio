import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSpring, animated, useSpringRef } from "@react-spring/three";
import { Box } from '@react-three/drei';

import mainScene from "../assets/3d/anotherScene.glb";

import CanvasLoader from "./Loader";
import { useResponsiveScale, CameraController, Lighting, CameraEvents, ZoomEvents, SelectionEvent } from "./SceneController";
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

const StateControl = (selected, setTargetPosition, setTargetRotation) => {
  const [state, setState] = useState("World");

  useEffect(() => {
    if (selected) {
      switch (selected) {
        case "World":
          setState("World");
          console.log("World");
          setTargetPosition([0, 0, 15]);
          setTargetRotation([0, 0, 0]);
          break;
        case "Art":
          setState("Art");
          console.log("Art");
          setTargetPosition([10, 5, 0]);
          setTargetRotation([0, 0, 0]);
          break;
        case "Portfolio":
          setState("Portfolio");
          console.log("Portfolio");
          setTargetPosition([-10, 5, 0]);
          setTargetRotation([0, 0, 0]);
          break;
        case "Games":
          setState("Games");
          console.log("Games");
          setTargetPosition([1.2, 1.5, 0.4]);
          setTargetRotation([0, 3.2, 0]);
          break;
      }
    }
  }, [selected]);

  return { state };
}

const ControlStuff = ({toggleCameraState, activeCamera, camera}) => {
  const [selected, setSelected] = useState(null);
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
  const [targetRotation, setTargetRotation] = useState([0, 0, 0]);

  const { modelScale, modelPosition } = useResponsiveScale();
  const { zoom } = ZoomEvents();
  const { state } = StateControl(selected, setTargetPosition, setTargetRotation);
  const { rotationX, rotationY } = CameraEvents(state);

  const isFirstRender = useRef(true);
  const springRef = useSpringRef();

  const [springProps, setSpring] = useSpring(() => ({
    ref: springRef,
    config: { mass: 10, tension: 100, friction: 50 },
    onStart: () => {
      toggleCameraState();
    },
    onRest: () => {
      toggleCameraState();
    },
    onChange: (springValues) => {
      if (camera.current) {
        const [x, y, z] = springValues.value.position;
        camera.current.position.set(x, y, z);
        const [rx, ry, rz] = springValues.value.rotation;
        camera.current.rotation.set(rx, ry, rz);

        camera.current.updateMatrixWorld();
      }
    }
  }));

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } 

    if (camera.current) {
        const positionArray = camera.current.position.toArray();
        const rotationArray = camera.current.rotation.toArray();
        setSpring({ from: { position: positionArray, rotation: rotationArray }, to: { position: targetPosition, rotation: targetRotation } });
        springRef.start();
    }
    
    }, [targetPosition, targetRotation]); // Trigger when the target position changes

    console.log(activeCamera, state);

    useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 't') {
        setSelected("Games");
      }
    };


    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <group>
      <CameraController position={springProps.position} rotation={springProps.rotation} zoom={zoom} rotationX={rotationX} rotationY={rotationY} state={state} anim={activeCamera} camera={camera} />
      <Lighting />
      <StaticGLB glb={mainScene} scale={modelScale} position={modelPosition} />
      <SelectionEvent setSelected={setSelected} />
      <GameDevelopment setSelected={setSelected}/>
      <animated.mesh position={springProps.position}>
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
        <Setup />
      </Suspense>
    </Canvas>
  );
};

export default SpacemanCanvas;

const Setup = () => {
  const { camera: defaultCamera } = useThree();
  const mainCameraRef = useRef(defaultCamera);
  const [activeCamera, setActiveCamera] = useState("main"); // Track active camera

  useEffect(() => {
    mainCameraRef.current = defaultCamera;

    mainCameraRef.current.position.x = 15 * Math.sin(0) * Math.cos(0);
    mainCameraRef.current.position.y = 15 * Math.sin(0);
    mainCameraRef.current.position.z = 15 * Math.cos(0) * Math.cos(0);

    mainCameraRef.current.lookAt(0, 0, 0);

    mainCameraRef.current.updateProjectionMatrix();
  }, []);

  const toggleCameraState = () => {
    setActiveCamera(prevCamera => {
      const newCamera = prevCamera === "main" ? "animated" : "main";
      return newCamera;
    });
  };

  return (
    <group>
        <ControlStuff 
          toggleCameraState={toggleCameraState}
          activeCamera={activeCamera} 
          camera={mainCameraRef}/>
        <IdleStuff />
    </group>
  );
}
