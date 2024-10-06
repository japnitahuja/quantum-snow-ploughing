import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "./App.css";
import DriverMap from "./components/DriverMap/DriverMap";
import CitizenMap from "./components/CitizenMap/CitizenMap";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/driver" element={<DriverMap />}/>
          <Route path="/citizen" element={<CitizenMap/>} />
        </Routes>
      </Router>
  )
}

export default App;
