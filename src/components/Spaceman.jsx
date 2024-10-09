import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { act, Suspense, useEffect, useRef, useState } from "react";
import { useSpring, animated, useSpringRef, to, config } from "@react-spring/three";
import { Box } from '@react-three/drei';
import * as THREE from "three";

import mainScene from "../assets/3d/anotherScene.glb";

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
    <mesh ref={sceneRef} position={position} scale={scale} rotation={[0, -1.5, 0]}>
      <primitive object={scene} />
    </mesh>
  );
}

const StateControl = (selected, switchToAnimatedCamera, switchToOriginalCamera, setTargetPosition, setTargetRotation) => {
  const [state, setState] = useState("World");

  useEffect(() => {
    if (selected) {
      switch (selected) {
        case "World":
          setState("World");
          console.log("World");
          switchToOriginalCamera();
          setTargetPosition([0, 0, 0]);
          setTargetRotation([0, 0, 0]);
          break;
        case "Art":
          setState("Art");
          console.log("Art");
          switchToAnimatedCamera();
          setTargetPosition([10, 5, 0]);
          setTargetRotation([0, 0, 0]);
          break;
        case "Portfolio":
          setState("Portfolio");
          console.log("Portfolio");
          switchToAnimatedCamera();
          setTargetPosition([-10, 5, 0]);
          setTargetRotation([0, 0, 0]);
          break;
        case "Games":
          setState("Games");
          console.log("Games");
          switchToAnimatedCamera();
          setTargetPosition([1, 2, 0]);
          setTargetRotation([0, 0, 0]);
          break;
      }
    }
  }, [selected]);

  return { state };
}

const ControlStuff = ({switchToOriginalCamera, switchToAnimatedCamera, toggleCameraState, activeCamera, animatedCameraRef, mainCameraRef}) => {
  const [selected, setSelected] = useState(null);
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
  const [targetRotation, setTargetRotation] = useState([0, 0, 0]);

  const { modelScale, modelPosition } = useResponsiveScale();
  const { zoom } = ZoomEvents();
  const { state } = StateControl(selected, switchToAnimatedCamera, switchToOriginalCamera, setTargetPosition, setTargetRotation);
  const { rotationX, rotationY } = CameraEvents(state);

  const isFirstRender = useRef(true);
  const springRef = useSpringRef();

  const spring = useSpring({
    ref: springRef,
    from: { position: mainCameraRef.current.position.toArray() },
    to: { position: targetPosition},
    config: { mass: 10, tension: 400, friction: 50 },
    onStart: () => {
      switchToAnimatedCamera();
      toggleCameraState();
      console.log("cam pos = ", mainCameraRef.current.position.toArray());
      animatedCameraRef.current.updateMatrixWorld();
    },
    onRest: () => {
      switchToOriginalCamera();
      toggleCameraState();
      mainCameraRef.current.position.set(targetPosition[0], targetPosition[1], targetPosition[2]);
      mainCameraRef.current.updateMatrixWorld();

      // Need to lock main camera and set position/rotation to animated camera
    },
    onChange: (springValues) => {
      if (animatedCameraRef.current) {
        const [x, y, z] = springValues.value.position;
        animatedCameraRef.current.position.set(x, y, z);
        animatedCameraRef.current.updateMatrixWorld();
      }
    }
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } 
    springRef.start();
  }, [targetPosition, springRef]);

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
      {activeCamera === "main" && <CameraController zoom={zoom} rotationX={rotationX} rotationY={rotationY} state={state} />}
      <animated.perspectiveCamera 
        position={spring.position} 
        rotation={[0, 0, 0]} 
        ref={animatedCameraRef} 
        visible={activeCamera === "animated"} // Control visibility
      />
      <Lighting />
      <StaticGLB glb={mainScene} scale={modelScale} position={modelPosition} />
      <SelectionEvent setSelected={setSelected} />
      <animated.mesh position={spring.position}>
      <Box args={[1, 1, 1]} position={[1, 2.0, 0]}>
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

const Setup = () => {
  const { set, camera: defaultCamera } = useThree();
  const mainCameraRef = useRef(defaultCamera);
  const animatedCameraRef = useRef();
  const [activeCamera, setActiveCamera] = useState("main"); // Track active camera

  useEffect(() => {
    mainCameraRef.current = defaultCamera;
    animatedCameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  }, []);

  const switchToOriginalCamera = () => {
    set({ camera: mainCameraRef.current });
  }

  const switchToAnimatedCamera = () => {  
    set({ camera: animatedCameraRef.current });
  }

  const toggleCameraState = () => {
    setActiveCamera(prevCamera => {
      const newCamera = prevCamera === "main" ? "animated" : "main";
      return newCamera;
    });
  };

  return (
    <group>
        <ControlStuff 
          switchToAnimatedCamera={switchToAnimatedCamera} 
          switchToOriginalCamera={switchToOriginalCamera}
          toggleCameraState={toggleCameraState}
          activeCamera={activeCamera} 
          animatedCameraRef={animatedCameraRef}
          mainCameraRef={mainCameraRef}/>
        <IdleStuff />
    </group>
  );
}

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
        <Setup />
      </Suspense>
    </Canvas>
  );
};

export default SpacemanCanvas;
