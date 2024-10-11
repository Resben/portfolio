import InteractableScreen from "./InteractableScreen";
import { gameDevelopmentTextures, gameDevelopment } from "./Lookup";

const ScreenSetup = ({ setSelected, state }) => {
  return (
    <>
        <InteractableScreen setSelected={setSelected} state={state} givenState={"Games"} pageLookup={gameDevelopment} textureLookup={gameDevelopmentTextures} objectReplacement={"Screen1"}/>
    </>
  );
};

export default ScreenSetup;
