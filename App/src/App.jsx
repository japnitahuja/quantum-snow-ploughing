import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import DriverMap from "./components/DriverMap/DriverMap";
import CitizenMap from "./components/CitizenMap/CitizenMap";
import Header from "./components/Header/Header";

function App() {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  // useEffect(() => {
  //   mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  //   mapRef.current = new mapboxgl.Map({
  //     container: mapContainerRef.current,
  //   });

  //   return () => {
  //     mapRef.current.remove()
  //   }
  // }, [])

  return (
    <>
    <DriverMap/>
    {/* <CitizenMap/> */}
      {/* <header>
        Header
      </header>

      <h1>
        Content
      </h1>

      <div id="map" ref={mapContainerRef} />

      <footer>
        Footer
      </footer> */}
      
    </>
  )
}

export default App;
