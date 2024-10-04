import { useEffect, useRef } from 'react';
import { BrowserRouter } from "react-router-dom";
import {Hero} from "./components";

const App = () => {
  const wrapperRef = useRef(null);

  return (
    <BrowserRouter>
        <Hero scrollContainer={wrapperRef} />
    </BrowserRouter>
  );
};

export default App;
