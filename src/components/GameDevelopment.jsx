import { useEffect, useRef, useState } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import * as MATH from "../utils/mathUtils";

const Pager = ({ enabled, position, rotation, size, setPage, setPageIndex, pageID, pageIndex }) => {
    const hitboxRef = useRef();

    const onClick = () => {
        if (!enabled) return;
        console.log("Clicked on pager" + pageID);
        setPage(pageID);
    }

    return (
        <mesh position={position}
            rotation={rotation}
            ref={hitboxRef}
            onClick={onClick}
            onPointerOver={(e) => e.stopPropagation()}
            onPointerOut={(e) => e.stopPropagation()}
            visible={true}>
            <planeGeometry args={size} />
            <meshBasicMaterial transparent opacity={1} color="orange" />
        </mesh>
    );
};

const BackButton = ({ enabled, position, size, rotation, setSelected, setPage, defaultPage, setPageIndex, pageID, pageIndex }) => {
    const hitboxRef = useRef();

    const onClick = () => {
        if (!enabled) return;

        if (pageID === "main")
        {
            setSelected("World");
        }
        else if (pageIndex === 0) 
        {
            setPage(defaultPage);
        }
        else 
        {
            setPageIndex(pageIndex - 1);
        }
    }

    return (
        <mesh position={position}
            rotation={rotation}
            ref={hitboxRef}
            onClick={onClick}
            onPointerOver={(e) => e.stopPropagation()}
            onPointerOut={(e) => e.stopPropagation()}
            visible={true}>
            <planeGeometry args={size} />
            <meshBasicMaterial transparent opacity={1} color="orange" />
        </mesh>
    );
};
    

const GameDevelopment = ({setSelected, state}) => {
    const [currentPage, setCurrentPage] = useState("main");
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const enabled = state === "Games";

    const screenRef = useRef();
    const texturesRef = useRef({});
    const { scene } = useThree();

    const textureDictionary = {
        main: [
            'src/assets/game_development/background.png',
        ],
        game1: [
            'src/assets/game_development/summoners_crucible.png',
            'src/assets/game_development/summoners_more_info.png',
        ],
        game2: [
            'src/assets/game_development/beneath_the_clouds.png',
            'src/assets/game_development/beneath_more_info.png',
        ]
    }

    const loadedTextures = useLoader(THREE.TextureLoader, Object.values(textureDictionary).flat());

    useEffect(() => {
        let textureIndex = 0;
        Object.keys(textureDictionary).forEach(id => {
          texturesRef.current[id] = textureDictionary[id].map(() => {
            return loadedTextures[textureIndex++];
          });
        });
    }, [loadedTextures]);

    useEffect(() => {
        const screen1 = scene.getObjectByName("Screen1");
        if (screen1 && loadedTextures) {
            screenRef.current = screen1;
            if (screenRef.current.material) {
                screenRef.current.material.map = texturesRef.current[currentPage][currentPageIndex];
                screenRef.current.material.needsUpdate = true;
            }
        }
    }, [scene, loadedTextures]);

    useEffect(() => {
        if (screenRef.current.material && loadedTextures)
        {
            screenRef.current.material.map = texturesRef.current[currentPage][currentPageIndex];
            screenRef.current.material.needsUpdate = true;
        }
    }, [currentPage, currentPageIndex]);


    return (
        <>
            <Pager enabled={enabled} position={[0.5, 0.5, 0]} rotation={MATH.toRadiansArray([0, 180, 0])} size={[0.5, 0.5]} setPage={setCurrentPage} setPageIndex={setCurrentPageIndex} pageID={"game1"} pageIndex={0} />
            <Pager enabled={enabled} position={[0.5, -0.5, 0]} rotation={MATH.toRadiansArray([0, 180, 0])} size={[0.5, 0.5]} setPage={setCurrentPage} setPageIndex={setCurrentPageIndex} pageID={"game2"} pageIndex={0} />
            <BackButton enabled={enabled} position={[-0.5, 0.5, 0]} rotation={MATH.toRadiansArray([0, 180, 0])}  size={[0.5, 0.5]} setSelected={setSelected} setPage={setCurrentPage} defaultPage={"main"} setPageIndex={setCurrentPageIndex} pageID={currentPage} pageIndex={0} />
        </>
    );
};

export default GameDevelopment;