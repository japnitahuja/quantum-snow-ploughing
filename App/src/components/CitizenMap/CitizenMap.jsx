import React from 'react';
import { useRef, useEffect, useState } from "react";
import axios from 'axios';

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import arrow from "../../assets/arrowmarker.png"

const CitizenMap = () => {
    const mapRef = useRef();
    const citizenMapContainerRef = useRef();
    const colouredLanesCoordinates = [[[-114.034269,51.015972],[-114.035728,51.011947],"rgb(139,231,138)"], //bottom
                                      [[-114.037531,51.016074],[-114.034192,51.015964],"rgb(139,231,138)"], //before
                                      [[-114.030877,51.012211],[-114.034192,51.015964],"rgb(139,231,138)"],
                                      [[-114.034600,51.014415],[-114.030877,51.012211],"rgb(248,123,123)"],
                                      [[-114.033817,51.018699],[-114.035996,51.016110],"rgb(139,231,138)"]]
    const popupRef = useRef(new mapboxgl.Popup({ closeOnClick: false }));

    useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: citizenMapContainerRef.current,
      center: [-114.032705,51.014443],
      style:'mapbox://styles/mapbox/streets-v12',
      zoom: 15.4,
    });


    mapRef.current.on('style.load', () => {

      const customMarker = document.createElement('div');
      customMarker.style.backgroundImage = `url(${arrow})`; // Set your custom image URL
      customMarker.style.width = '50px'; // Width of the marker
      customMarker.style.height = '50px'; // Height of the marker
      customMarker.style.backgroundSize = 'cover'; // Ensure the image covers the div
      customMarker.style.borderRadius = '50%'; // Optional: make it circular

      new mapboxgl.Marker(customMarker) // Create a new marker
      .setLngLat([-114.030830,51.012224]) // Set the coordinates of the marker
      .addTo(mapRef.current)
    });

    return () => {
      mapRef.current.remove()
    }
  }, [])

  const changeDestination = () => {
    console.log("change destination clicked")
    localStorage.setItem('driverDestination', JSON.stringify([-114.030935,51.012165]));
    localStorage.setItem('changeDestinationFlag', JSON.stringify(true));
  }

  const navigate = async () => {
    colouredLanesCoordinates.forEach(async (lane, index) => {
      let route = await calcRouteDirection(lane[0],lane[1])
      console.log(route)
      renderLanes(index,route[0].geometry,lane[2])
    })
  }

  const renderLanes = async (index,routeGeometry,color) => {
    console.log(routeGeometry)
    mapRef.current.addLayer({
      id: `route${index}`,
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
        "line-color": color,
        "line-width": 4,
      },
    });

    const popupContent = `
              <div style="font-family: Arial, sans-serif;">
                <button id="report-button">REPORT LANE</button>
              </div>
            `;

    mapRef.current.on('click', `route${index}`, () => {
      popupRef.current
        .setLngLat(routeGeometry.coordinates[3])
        .setHTML(popupContent) // Set the popup content
        .addTo(mapRef.current);

        changeDestination()
    });

    const reportButton = document.getElementById(`report-button`);
    if (reportButton) {
      reportButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the popup from closing
        console.log("REPORT CLICKED") // Call the function to handle reporting
      });
    }
  }

  const calcRouteDirection = async (origin,dest) => {
    console.log("calc route direction triggered")
      try {
        const mapboxDirectionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${
          dest[0]},${dest[1]}?steps=true&geometries=geojson&access_token=${
            import.meta.env.VITE_MAPBOX_TOKEN
          }`;
        const response = await axios.get(mapboxDirectionsUrl);
        const routes = response.data.routes;
        return routes
        }
     catch (error) {
        // Handle error
        console.error("Error calculating directions:", error);
        throw error;
    }
  };


     return <div>
      <Header/>

      <div style={{
                width: '100vw', // Set the width of the map
                height: '82.5vh', // Set the height of the map
            }} id="citizenmap" ref={citizenMapContainerRef} />

      <Footer changeDestination={changeDestination} navigate={navigate}/>
    </div>
};

export default CitizenMap;