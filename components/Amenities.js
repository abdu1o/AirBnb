'use client';

import { useState } from 'react';
import styles from '../styles/Property.module.css';
import {
  FiCoffee,
  FiWifi,
  FiTv,
  FiHome,
  FiWind,
  FiTruck,
  FiKey,
  FiSun,
  FiMapPin,
  FiCloud
} from 'react-icons/fi';

/**
 * Amenities component
 * props:
 *  - amenities: [{ id, title, icon }]
 *
 * If no amenities prop provided, uses sampleAmenities.
 */
export default function Amenities({ amenities }) {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 6;

  const sampleAmenities = [
    { id: 'kitchen', title: 'Кухня', icon: <FiCoffee size={20} /> },
    { id: 'sleep', title: 'Окреме місце для сну', icon: <FiHome size={20} /> },
    { id: 'wifi', title: 'Wi-Fi', icon: <FiWifi size={20} /> },
    { id: 'tv', title: 'Телевізор', icon: <FiTv size={20} /> },
    { id: 'ac', title: 'Кондиціонер', icon: <FiWind size={20} /> },
    { id: 'washer', title: 'Пральна машина', icon: <FiCloud size={20} /> },
    { id: 'parking', title: 'Паркінг', icon: <FiTruck size={20} /> },
    { id: 'selfcheck', title: 'Самостійне прибуття', icon: <FiKey size={20} /> },
    { id: 'sun', title: 'Поблизу пляж', icon: <FiSun size={20} /> },
    { id: 'location', title: 'Зручне розташування', icon: <FiMapPin size={20} /> },
  ];

  const list = amenities && amenities.length ? amenities : sampleAmenities;
  const total = list.length;
  const visible = showAll ? list : list.slice(0, initialCount);

  return (
    <div className={styles.amenitiesSection}>
      <h3 className={styles.amenitiesTitle}>Які тут зручності</h3>

      <div className={styles.amenitiesGrid}>
        {visible.map((a) => (
          <div key={a.id} className={styles.amenityItem}>
            <div className={styles.amenityIcon} aria-hidden>
              {a.icon}
            </div>

            <div className={styles.amenityText}>
              <div className={styles.amenityTitle}>{a.title}</div>
            </div>
          </div>
        ))}
      </div>

      {total > initialCount && (
        <div className={styles.amenitiesActions}>
          <button
            className={styles.amenitiesToggleBtn}
            onClick={() => setShowAll((s) => !s)}
            aria-expanded={showAll}
          >
            {showAll ? 'Сховати' : `Показати всі зручності (${total})`}
          </button>
        </div>
      )}
    </div>
  );
}
