import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

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

// Komponen untuk handle klik peta dan set markerPosition tunggal
function LocationMarker({ markerPosition, setMarkerPosition, onLocationChange, readOnly }) {
  useMapEvents({
    click(e) {
      if (readOnly) return;
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setMarkerPosition({ lat, lng });
      if (onLocationChange) onLocationChange(lat, lng);
    },
  });

  return markerPosition ? <Marker position={markerPosition} /> : null;
}

function MapPicker({
  latitude,
  longitude,
  onLocationChange,
  readOnly = false,
  pendatangList = [], // tambahan props untuk marker banyak
}) {

  const [markerPosition, setMarkerPosition] = useState(
    latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : null
  );

  // Tentukan center peta: kalau ada markerPosition, pakai itu,
  // Kalau tidak ada tapi pendatangList ada, pusatkan di rata-rata koordinat pendatang,
  // Kalau tidak ada keduanya, pakai default
  const center =
    markerPosition ||
    (pendatangList.length
      ? {
          lat:
            pendatangList.reduce((sum, p) => sum + parseFloat(p.latitude), 0) /
            pendatangList.length,
          lng:
            pendatangList.reduce((sum, p) => sum + parseFloat(p.longitude), 0) /
            pendatangList.length,
        }
      : centerDefault);

  useEffect(() => {
    if (latitude && longitude) {
      setMarkerPosition({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
    }
  }, [latitude, longitude]);

  return (
    <MapContainer center={center} zoom={13} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marker tunggal yang bisa dipilih/diganti */}
      <LocationMarker
        markerPosition={markerPosition}
        setMarkerPosition={setMarkerPosition}
        onLocationChange={onLocationChange}
        readOnly={readOnly}
      />

      {/* Marker banyak pendatang (readOnly, tidak bisa klik ganti posisi) */}
      {pendatangList.map((pendatang) => {
        
       const customIcon = L.divIcon({
        className: 'custom-label-marker',
        html: `
          <div class="flex flex-col items-center">
            <div class="text-xs font-semibold text-white bg-blue-600 px-2 py-1 rounded-md shadow-md">
              ${pendatang.nama_lengkap}
            </div>
            <div class="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-blue-600"></div>
          </div>
        `,
        iconSize: [100, 50],
        iconAnchor: [50, 50], // supaya bagian "ujung pin" pas ke posisi marker
      });
      

        return (
          <Marker
            key={pendatang.id}
            position={{
              lat: parseFloat(pendatang.latitude),
              lng: parseFloat(pendatang.longitude),
            }}
            icon={customIcon}
          >
            <Popup>
              <div>
                <b>Nama:</b> {pendatang.nama_lengkap} <br />
                <b>Lat:</b> {pendatang.latitude} <br />
                <b>Lng:</b> {pendatang.longitude}
              </div>
            </Popup>
          </Marker>
        );
      })}

    </MapContainer>
  );
}

export default MapPicker;
