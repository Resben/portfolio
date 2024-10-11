import { useEffect, useRef, useState } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const ChildPage = ({ enabled, lookup, childKey, setCurrentPage}) => {
    const object = lookup[childKey];
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const onClick = () => {
        if (!enabled) return;

        setCurrentPage(childKey);
    }

    return(
        <mesh position={object.position}
            rotation={object.rotation}
            onClick={onClick}
            onPointerOver={(e) => e.stopPropagation()}
            onPointerOut={(e) => e.stopPropagation()}
            visible={true}>
            <planeGeometry args={object.size} />
            <meshBasicMaterial transparent opacity={1} color={randomColor} />
        </mesh>
    );
};

const Pager = ({ enabled, lookup, currentPage, setCurrentPage, setCurrentTexture, setSelected }) => {

    const object = lookup[currentPage];

    setCurrentPage(currentPage);
    setCurrentTexture(object.texture);

    const pagers = [];

    if (object.children)
    {
        object.children.forEach((childkey) => {
            pagers.push(
                <ChildPage enabled={enabled} lookup={lookup} childKey={childkey} setCurrentPage={setCurrentPage}/>
            );
        });
    }

    return (
        <>
            {pagers}
            <BackButton enabled={enabled} lookup={lookup} setSelected={setSelected} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </>
    );
};

const BackButton = ({ enabled, lookup, setSelected, currentPage, setCurrentPage }) => {
    const object = lookup["back"];

    const onClick = () => {
        if (!enabled) return;

        if (currentPage === "main") {
            setSelected("World");
        }
        else {
            setCurrentPage(lookup[currentPage].parent);
        }
    }

    const randomColor = "red";

    return (
        <mesh position={object.position}
            rotation={object.rotation}
            onClick={onClick}
            onPointerOver={(e) => e.stopPropagation()}
            onPointerOut={(e) => e.stopPropagation()}
            visible={true}>
            <planeGeometry args={object.size} />
            <meshBasicMaterial transparent opacity={1} color={randomColor} />
        </mesh>
    );
};


const InteractableScreen = ({ setSelected, state, pageLookup, givenState, textureLookup, objectReplacement }) => {
    const [currentPage, setCurrentPage] = useState("main");
    const [currentTexture, setCurrentTexture] = useState("main");

    const enabled = state === givenState;

    const screenRef = useRef();
    const texturesRef = useRef({});
    const { scene } = useThree();

    const loadedTextures = useLoader(THREE.TextureLoader, Object.values(textureLookup).flat());

    useEffect(() => {
        let textureIndex = 0;
        const mappedTextures = {};
    
        Object.keys(textureLookup).forEach((key) => {
            mappedTextures[key] = loadedTextures[textureIndex++];
        });
        texturesRef.current = mappedTextures;
    
    }, [loadedTextures]);

    useEffect(() => {
        const screen1 = scene.getObjectByName(objectReplacement);
        if (screen1 && loadedTextures) {
            screenRef.current = screen1;
            if (screenRef.current.material) {
                screenRef.current.material.map = texturesRef.current[currentTexture];
                screenRef.current.material.needsUpdate = true;
            }
        }
    }, [scene, loadedTextures]);

    useEffect(() => {
        if (screenRef.current.material && loadedTextures) {
            screenRef.current.material.map = texturesRef.current[currentTexture];
            screenRef.current.material.needsUpdate = true;
        }
    }, [currentTexture]);

    return (
        <>
            <Pager enabled={enabled} lookup={pageLookup} currentPage={currentPage} setCurrentPage={setCurrentPage} setCurrentTexture={setCurrentTexture} setSelected={setSelected}/>
        </>
    );
};

export default InteractableScreen;