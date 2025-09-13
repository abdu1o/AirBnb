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
  FiSun,
  FiCloud
} from 'react-icons/fi';

/**
 * Amenities component
 * props:
 *  - amenities: { wifi: true, washer: true, kitchen: true, ... }
 */
export default function Amenities({ amenities }) {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 3;

  const amenityMap = {
    wifi: { title: 'Wi-Fi', icon: <FiWifi size={20} /> },
    washer: { title: 'Пральна машина', icon: <FiCloud size={20} /> },
    kitchen: { title: 'Кухня', icon: <FiCoffee size={20} /> },
    airConditioning: { title: 'Кондиціонер', icon: <FiWind size={20} /> },
    heating: { title: 'Опалення', icon: <FiSun size={20} /> },
    tv: { title: 'Телевізор', icon: <FiTv size={20} /> },
    parking: { title: 'Паркінг', icon: <FiTruck size={20} /> },
    balcony: { title: 'Балкон', icon: <FiHome size={20} /> },
  };

  // Преобразуем объект amenities в массив только с true
  const list = Object.entries(amenities || {})
    .filter(([key, value]) => value)
    .map(([key]) => ({ id: key, ...amenityMap[key] }));

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
            {showAll ? 'Сховати' : `Показати всі (${total})`}
          </button>
        </div>
      )}
    </div>
  );
}
