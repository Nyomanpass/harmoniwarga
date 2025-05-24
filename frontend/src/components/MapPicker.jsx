import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Leaflet default marker fix (karena tidak muncul di banyak bundler modern)
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const centerDefault = {
  lat: -8.8,
  lng: 115.2,
};

function LocationMarker({ markerPosition, setMarkerPosition, onLocationChange }) {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setMarkerPosition({ lat, lng });
      onLocationChange(lat, lng);
    },
  });

  return markerPosition ? <Marker position={markerPosition} /> : null;
}

function MapPicker({ latitude, longitude, onLocationChange }) {
  const [markerPosition, setMarkerPosition] = useState(
    latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : null
  );

  const center = markerPosition || centerDefault;

  return (
    <MapContainer center={center} zoom={13} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        markerPosition={markerPosition}
        setMarkerPosition={setMarkerPosition}
        onLocationChange={onLocationChange}
      />
    </MapContainer>
  );
}

export default MapPicker;
