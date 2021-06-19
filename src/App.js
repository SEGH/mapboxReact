import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-75);
  const [lat, setLat] = useState(39.9);
  const [zoom, setZoom] = useState(9);
  const marker = useRef(null);
  const [markerLng, setMarkerLng] = useState(-75.1684);
  const [markerLat, setMarkerLat] = useState(39.9322);
  const geolocate = useRef(null);
  const [geoCoords, setGeoCoords] = useState(null);
  const geocoder = useRef(null);

  useEffect(() => {
    // If no current map, add a new map
    if (map.current) return;
    // console.log('useEffect One')
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Create popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setText('Hello!');

    // Add draggable marker to map
    if (marker.current) return;
    marker.current = new mapboxgl.Marker({
      color: "#FFFFFF",
      draggable: true
    }).setLngLat([markerLng, markerLat]).setPopup(popup);
    marker.current.addTo(map.current);

    // Add GeolocateControl to locate and track the user
    if (geolocate.current) return;
    geolocate.current = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
    map.current.addControl(geolocate.current);

    // Adds geocoding control to web map, enabling users to search the map for a place
    if (geocoder.current) return;
    geocoder.current = new MapboxGeocoder({ accessToken: mapboxgl.accessToken, mapboxgl: mapboxgl });
    map.current.addControl(geocoder.current)
  });

  useEffect(() => {
    // If map, set the lat and long to current map center and zoom to current zoom
    if (!map.current) return;
    // console.log('useEffect Two')
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // Update marker coordinates when marker is dragged
    if (!marker.current) return;
    marker.current.on('drag', () => {
      setMarkerLng(marker.current.getLngLat().lng.toFixed(4));
      setMarkerLat(marker.current.getLngLat().lat.toFixed(4));
    });

    // When receiving a geolocation, set update geoCoords state to coordinates
    if (!geolocate.current) return;
    geolocate.current.on('geolocate', (data) => {
      console.log(data);
      setGeoCoords({ lat: data.coords.latitude.toFixed(4), lon: data.coords.longitude.toFixed(4) });
    })
  });

  return (
    <div className="App">
      <div ref={mapContainer} className="map-container" />
      <div className="sidebar">
        <p>Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</p>
        <p>Marker Longitude: {markerLng} | Latitude: {markerLat}</p>
        <p>{geoCoords ? `Current Longitude: ${geoCoords.lon} | Latitude: ${geoCoords.lat}` : ""}</p>
      </div>
    </div>
  );
}

export default App;
