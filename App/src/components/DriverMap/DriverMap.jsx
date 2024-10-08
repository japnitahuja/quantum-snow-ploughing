import React from 'react';
import { useRef, useEffect, useState } from "react";
import axios from 'axios';

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Header from '../Header/Header';
// import Footer from '../Footer/Footer';
import snowplough from "../../assets/snowplough.png"
import redBuzz from "../../assets/50.png"

import '../Footer/Footer.css';

const DriverMap = () => {
    const mapRef = useRef();
    const mapContainerRef = useRef();
    const [origin, setOrigin] = useState([-114.034583,51.014473]);
    const [routeGeometry, setRouteGeometry] = useState(null);
    const [routeInfo, setRouteInfo] = useState([]);
    const [driverDestination, setDriverDestination] = useState([-114.035957,51.011821]);
    const [changeDestinationFlag, setChangeDestinationFlag] = useState(false);
    const redErrorCoords = [-114.033542,51.013470]

    useEffect(() => {
    localStorage.setItem('driverDestination', JSON.stringify([-114.035957,51.011821]));
    localStorage.setItem('changeDestinationFlag', JSON.stringify(false));
    
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-114.032705,51.014443],
      style:'mapbox://styles/mapbox/streets-v12',
      zoom: 15.5,
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
    console.log("calc route direction triggered")
      try {
        console.log(driverDestination)
        const mapboxDirectionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${
          driverDestination[0]},${driverDestination[1]}?steps=true&geometries=geojson&access_token=${
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

  useEffect(() => {
    const handleStorageChange = () => {
      const storedDestination = localStorage.getItem('driverDestination');
      const storedDestinationFlag =localStorage.getItem('changeDestinationFlag');
      if (storedDestination) {
        setDriverDestination(JSON.parse(storedDestination));
        setChangeDestinationFlag(JSON.parse(storedDestinationFlag))
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect (() => {
    if (changeDestinationFlag) {
        calcRouteDirection()

        const customMarker = document.createElement('div');
        customMarker.style.backgroundImage = `url(${redBuzz})`; // Set your custom image URL
        customMarker.style.width = '50px'; // Width of the marker
        customMarker.style.height = '50px'; // Height of the marker
        customMarker.style.backgroundSize = 'cover'; // Ensure the image covers the div
        customMarker.style.borderRadius = '50%'; // Optional: make it circular

        new mapboxgl.Marker(customMarker) // Create a new marker
        .setLngLat(redErrorCoords) // Set the coordinates of the marker
        .addTo(mapRef.current)
    }
  }, [driverDestination,changeDestinationFlag])

  let currentLeg = null;
  let nextLeg = null;

  if (routeInfo.length > 0) {
    currentLeg = routeInfo[0].legs[0].summary;

    if (routeInfo[0].legs.length > 0) {
      nextLeg = routeInfo[0].legs[1];
    } else if (routeInfo.length > 1) {
      nextLeg = routeInfo[0].legs[0].summary;
    }
  }

     return <div>
      <Header/>

      <div style={{
                width: '100vw', // Set the width of the map
                height: '80vh', // Set the height of the map
            }} id="map" ref={mapContainerRef} />

      <footer className='footer'>
        {currentLeg && <><span style={{padding:"0.5rem"}}><h3>Current leg: {currentLeg}</h3></span><br /></> }
        {nextLeg && <><span>Next leg: {nextLeg}</span><br /></> }
      </footer>
    </div>
};

export default DriverMap;