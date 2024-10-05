import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Citizen from "./components/Citizen";
import Driver from "./components/Driver";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/driver" element={<Driver />} />
        <Route path="/citizen" element={<Citizen />} />
      </Routes>
    </Router>
  )
}

export default App;
