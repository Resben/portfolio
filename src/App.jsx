import { useEffect, useRef } from 'react';
import { BrowserRouter } from "react-router-dom";
import {Hero} from "./components";

const App = () => {

  return (
    <BrowserRouter>
        <Hero/>
    </BrowserRouter>
  );
};

export default App;
