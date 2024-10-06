import React from 'react';
import { useRef, useEffect, useState } from "react";
import axios from 'axios';

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const CitizenMap = () => {
    const mapRef = useRef();
    const citizenMapContainerRef = useRef();
    const colouredLanesCoordinates = [[[-114.034269,51.015972],[-114.035728,51.011947],"rgb(248,123,123)"], //bottom
                                      [[-114.037531,51.016074],[-114.034192,51.015964],"rgb(139,231,138)"], //before
                                      [[-114.030877,51.012211],[-114.034192,51.015964],"rgb(248,123,123)"],
                                      [[-114.034600,51.014415],[-114.030877,51.012211],"rgb(248,123,123)"],
                                      [[-114.033817,51.018699],[-114.035996,51.016110],"rgb(139,231,138)"]]

    useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: citizenMapContainerRef.current,
      center: [-114.032705,51.014443],
      style:'mapbox://styles/mapbox/streets-v12',
      zoom: 15.4,
    });


    mapRef.current.on('style.load', () => {
      colouredLanesCoordinates.forEach(async (lane, index) => {
        let route = await calcRouteDirection(lane[0],lane[1])
        console.log(route)
        renderLanes(index,route[0].geometry,lane[2])
      })
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

  const renderLanes = async (index,routeGeometry,color) => {
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

      <Footer changeDestination={changeDestination}/>
    </div>
};

export default CitizenMap;