// components/LeafletMap.js
'use client';

import 'leaflet/dist/leaflet.css'; // импорт css здесь — загружается только на клиенте
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useMemo } from 'react';
import styles from '../styles/Location.module.css';

export default function LeafletMap({ lat = 48.43333, lng = 33.4234, zoom = 14, height = 380, popupText = '' }) {
  const center = [Number(lat), Number(lng)];

  // создаём DivIcon один раз
  const hfuIcon = useMemo(() => {
    // html содержит class из CSS-модуля — будет корректно натягиваться
    return L.divIcon({
      className: styles.hfuDivIcon || '',
      html: `<div class="${styles.hfuInner}">BNB</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -46],
    });
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: `${height}px`, width: '100%', borderRadius: 12, overflow: 'hidden' }}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />

      <Marker position={center} icon={hfuIcon}>
        <Popup>
          <div style={{ maxWidth: 240 }}>
            <strong>BNB</strong>
            <div style={{ marginTop: 6, fontSize: 13 }}>{popupText}</div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
