import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "@react-three/drei";

export function CameraTransition({ position, target, controls }) {
    const controlsRef = useRef()
    
    useEffect(() => {
        if (controlsRef.current) {

            controlsRef.current.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: null
          }
        }
    
        const canvas = document.querySelector('canvas')
        if (canvas) {
          canvas.addEventListener('contextmenu', (e) => {
            e.stopPropagation()
          })
        }
    
        return () => {
          if (canvas) {
            canvas.removeEventListener('contextmenu', (e) => e.stopPropagation())
          }
        }
      }, [])

    useEffect(() => {
      // Disable rotation and zoom initially
      if (controlsRef.current) {
        controlsRef.current.enableRotate = false
        controlsRef.current.enableZoom = false
      }
  
      console.log(position, target, controls)

      // GSAP Animation for camera position
      gsap.to(controlsRef.current.object.position, { duration: 1.5, ease: "power1.inOut", x: position[0], y: position[1], z: position[2] })
  
      // GSAP Animation for camera target
      gsap.to(controlsRef.current.target, { duration: 1.5, ease: "power1.inOut", x: target[0], y: target[1], z: target[2] })
  
      // Re-enable rotation and zoom after animation
      const timer = setTimeout(() => {
        controlsRef.current.enableRotate = controls
        controlsRef.current.enableZoom = controls
      }, 1500)
  
      return () => clearTimeout(timer)
    }, [position, target, controls])
  
    return <OrbitControls ref={controlsRef} />
  }

export const Lighting = () => {
    return (
        <>
            <directionalLight position={[1, 1, 1]} intensity={2} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 5, 10]} intensity={2} />
            <spotLight position={[0, 50, 10]} angle={0.15} penumbra={1} intensity={2} />
            <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />
        </>
    );
};

export const SelectionEvent = ({ setSelected }) => {
    const raycaster = new THREE.Raycaster();

    const { camera, scene } = useThree();

    useEffect(() => {
        const OnMouseUp = (event) => {
            const coords = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );
            raycaster.setFromCamera(coords, camera);

            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                setSelected(intersects[0].object.name);
                console.log(intersects[0].object.name);
            } else {
                setSelected(null);
            }
        };

        window.addEventListener("mouseup", OnMouseUp);

        return () => {
            window.removeEventListener("mouseup", OnMouseUp);
        };
    }, []);

    return null;
}