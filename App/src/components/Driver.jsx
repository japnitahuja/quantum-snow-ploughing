import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

export default function Driver() {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
    });

    return () => {
      mapRef.current.remove()
    }
  }, [])

  return (
    <>
      <header>
        Driver
      </header>

      <h1>
        Content
      </h1>

      <div id="map" ref={mapContainerRef} />

      <footer>
        Footer
      </footer>
    </>
  );
}