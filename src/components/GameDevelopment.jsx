import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as MATH from "../utils/mathUtils";

import background from "../assets/game_development/background.png";


const GameDevelopment = ({setSelected}) => {
    const screenRef = useRef();
    const hitboxRef = useRef();

    // Background
    const position = [1.2715, 1.63, 1.01];
    const rotation = MATH.toRadiansArray([0, 183, 0]);
    const size = [0.343, 0.257];

    const [texture, setTexture] = useState(null);

    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(background, (loadedTexture) => {
            setTexture(loadedTexture);
        });
    }, []);

    const onClick = () => {
        setSelected("World");
    }

    return (
        <>
        {texture &&
            <mesh position={position} rotation={rotation} ref={screenRef}>
                <planeGeometry args={size} />
                <meshBasicMaterial map={texture}/>
            </mesh>}

            <mesh
                position={position}
                rotation={rotation}
                ref={hitboxRef}
                onClick={onClick}
                onPointerOver={(e) => e.stopPropagation()} // Prevent event bubbling
                onPointerOut={(e) => e.stopPropagation()}
                visible={true} // Make the hitbox invisible
            >
                <planeGeometry args={[0.1, 0.12]} />
                <meshBasicMaterial transparent opacity={1} color="orange" />
            </mesh>
        </>
    );
};

const Page = () => {
    return (
        <group>

        </group>
    )
};

export default GameDevelopment;