import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

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

  useEffect(() => {
    if (map.current) return;
    console.log('useEffect One')
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    if (marker.current) return;
    marker.current = new mapboxgl.Marker({
      color: "#FFFFFF",
      draggable: true
    }).setLngLat([markerLng, markerLat]);
    marker.current.addTo(map.current);

    if (geolocate.current) return;
    geolocate.current = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
    map.current.addControl(geolocate.current);
  });

  useEffect(() => {
    if (!map.current) return;
    console.log('useEffect Two')
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    if (!marker.current) return;
    marker.current.on('drag', () => {
      setMarkerLng(marker.current.getLngLat().lng.toFixed(4));
      setMarkerLat(marker.current.getLngLat().lat.toFixed(4));
    });
    if (!geolocate.current) return;
    geolocate.current.on('geolocate', (data) => {
      console.log(data);
      setGeoCoords({ lat: data.coords.latitude.toFixed(4), lon: data.coords.longitude.toFixed(4)});
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
