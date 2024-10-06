import React from 'react';
import { useRef, useEffect, useState } from "react";
import axios from 'axios';

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import snowplough from "../../assets/snowplough.png"


const DriverMap = () => {
    const mapRef = useRef();
    const mapContainerRef = useRef();
    const [origin, setOrigin] = useState([-114.034192,51.015964]);
    const [destination, setDestination] = useState([-114.033971, 51.014200]);
    const [routeGeometry, setRouteGeometry] = useState(null);
    const [routeInfo, setRouteInfo] = useState([]);
    const [changeDestinationFlag, setChangeDestinationFlag] = useState(false)

    useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-114.032705,51.014443],
      style:'mapbox://styles/mapbox/streets-v12',
      zoom: 16,
    });

    mapRef.current.on('style.load', () => {
        calcRouteDirection()

        const customMarker = document.createElement('div');
        customMarker.style.backgroundImage = `url(${snowplough})`; // Set your custom image URL
        customMarker.style.width = '50px'; // Width of the marker
        customMarker.style.height = '50px'; // Height of the marker
        customMarker.style.backgroundSize = 'cover'; // Ensure the image covers the div
        customMarker.style.borderRadius = '50%'; // Optional: make it circular

        new mapboxgl.Marker(customMarker) // Create a new marker
        .setLngLat(origin) // Set the coordinates of the marker
        .addTo(mapRef.current)


      });

    return () => {
      mapRef.current.remove()
    }
  }, [])

  const calcRouteDirection = async () => {
      try {
        console.log(destination)
        const mapboxDirectionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${
            destination[0]
          },${destination[1]}?steps=true&geometries=geojson&access_token=${
            import.meta.env.VITE_MAPBOX_TOKEN
          }`;

        console.log(mapboxDirectionsUrl)
        const response = await axios.get(mapboxDirectionsUrl);
  
        const routes = response.data.routes;
        console.log("routes=>", routes);
        setRouteInfo(routes);
        // Check if any routes are returned
        if (routes.length > 0) {
        const { distance, duration, geometry } = routes[0];

        // Valid directions, use the distance and duration for further processing
        const directions = {
            distance,
            duration,
        };
        localStorage.setItem("fromLocation", origin);

        if (mapRef.current.getLayer("route")) {
            mapRef.current.removeLayer("route");
        }
        
        if (mapRef.current.getSource("route")) {
            mapRef.current.removeSource("route");
        }

        setRouteGeometry(geometry); // Set the route geometry
        return directions;
        } else {
        // No routes found
        throw new Error("Unable to calculate directions");
        }
    } catch (error) {
        // Handle error
        console.error("Error calculating directions:", error);
        throw error;
    }
  };

  useEffect(() => {
    if (mapRef.current && routeGeometry) {
    // mapRef.current.fitBounds(routeGeometry.bounds, { padding: 20 });
  
    mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: routeGeometry,
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#00f",
          "line-width": 4,
        },
      });
    }
  }, [mapRef.current, routeGeometry]);

  const changeDestination = () => {
    setDestination([-114.030954,51.012230])
    setChangeDestinationFlag(true)
  }

  useEffect (() => {
    if (changeDestinationFlag) {
        calcRouteDirection()
    }
  }, [destination])

     return <div>
      <Header/>

      <div style={{
                width: '100vw', // Set the width of the map
                height: '80vh', // Set the height of the map
            }} id="map" ref={mapContainerRef} />

      <button onClick={changeDestination}>customer report</button>
    </div>
};

export default DriverMap;