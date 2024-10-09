import { useEffect, useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { animated } from "@react-spring/three";
import * as THREE from "three";


export const useResponsiveScale = () => {
    const [scale, setScale] = useState([2, 2, 2]);
    const [modelPosition, setPosition] = useState([0.2, -0.7, 0]);

    useEffect(() => {
        const handleResize = () => {
            // if (window.innerWidth < 768) {
            //     setScale([1, 1, 1]);
            //     setPosition([0.2, -0.1, 0]);
            // } else if (window.innerWidth < 1024) {
            //     setScale([1.33, 1.33, 1.33]);
            //     setPosition([0.2, -0.3, 0]);
            // } else if (window.innerWidth < 1280) {
            //     setScale([1.5, 1.5, 1.5]);
            //     setPosition([0.2, -0.4, 0]);
            // } else if (window.innerWidth < 1536) {
            //     setScale([1.66, 1.66, 1.66]);
            //     setPosition([0.2, -0.5, 0]);
            // } else {
            //     setScale([2, 2, 2]);
            //     setPosition([0.2, -0.7, 0]);
            // }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // initial resize

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return { scale, modelPosition };
};

export const CameraController = ({ position, zoom, rotationX, rotationY, state, anim, camera }) => {
    useEffect(() => {

        if (state == "World" && anim != "animated")
        {
            const distance = 15 * zoom; // Distance from the object
            // Clamp the vertical rotation (rotationX) between limits (in radians)
            const minVerticalAngle = 0; // Limit up (e.g., 0 degrees up)
            const maxVerticalAngle = Math.PI / 4; // Limit down (e.g., 45 degrees down)
            const clampedRotationX = Math.max(minVerticalAngle, Math.min(maxVerticalAngle, rotationX));
    
            const phi = clampedRotationX; // Vertical rotation
            const theta = rotationY; // Horizontal rotation (no limits for full 360)
    
            // Convert spherical coordinates to Cartesian
            camera.current.position.x = distance * Math.sin(theta) * Math.cos(phi);
            camera.current.position.y = distance * Math.sin(phi);
            camera.current.position.z = distance * Math.cos(theta) * Math.cos(phi);
    
            camera.current.lookAt(0, 0, 0);
    
            camera.current.updateProjectionMatrix();
        }

    }, [rotationX, rotationY, camera, zoom]);

    return (
        <animated.perspectiveCamera 
            position={position} 
            rotation={[0, 0, 0]} 
            ref={camera} 
      />
    );
};

export const CameraEvents = (state) => {
    const [rotationX, setRotationX] = useState(0);
    const [rotationY, setRotationY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {

        if (state != "World") return;

        const handleMouseDown = (event) => {
            setIsDragging(true);
            setLastMousePos({ x: event.clientX, y: event.clientY });
        };

        const handleMouseMove = (event) => {
            if (isDragging) {
                const deltaX = event.clientX - lastMousePos.x;
                const deltaY = event.clientY - lastMousePos.y;

                setRotationX((prevRotationX) => prevRotationX + deltaY * 0.01);
                setRotationY((prevRotationY) => prevRotationY + deltaX * 0.01);

                setLastMousePos({ x: event.clientX, y: event.clientY });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, lastMousePos, state]);

    return { rotationX, rotationY };
};

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

export const ZoomEvents = () => {
    const [zoom, setZoom] = useState(1);

    useEffect(() => {

        const handleWheel = (event) => {
            event.preventDefault();

            const deltaY = event.deltaY;
            const zoomFactor = 0.00025;

            const minZoom = 0.5;
            const maxZoom = 1;

            setZoom((prevZoom) => {
                const newZoom = prevZoom + deltaY * zoomFactor
                return Math.max(minZoom, Math.min(maxZoom, newZoom));
            });
        };

        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel, { passive: false });
        };
    }, []);

    return { zoom };
}

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