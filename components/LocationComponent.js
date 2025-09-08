// components/LocationComponent.js
import dynamic from 'next/dynamic';
import { useState } from 'react';
import styles from '../styles/Location.module.css';

// динамический импорт клиентского компонента, без SSR
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

export default function LocationComponent({
  lat = 48.43333,
  lng = 33.4234,
  title = 'Одеса, Одеська область, Україна',
  shortText = 'Перша лінія біля моря, Аркадія, Французький бульвар',
  fullText = 'Точне розташування буде повідомлено після бронювання.',
  zoom = 14,
  height = 380,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.locationSection}>
      <h3 className={styles.sectionTitle}>Де ви будете</h3>

      <div className={styles.mapWrapper}>
        {/* LeafletMap загружается только на клиенте */}
        <LeafletMap lat={lat} lng={lng} zoom={zoom} height={height} popupText={fullText} />
      </div>

      <div className={styles.addressBlock}>
        <div className={styles.addressTitle}>{title}</div>
        <div className={styles.addressShort}>{shortText}</div>

        {expanded && <div className={styles.addressFull}>{fullText}</div>}

        <button
          className={styles.showMoreBtn}
          onClick={() => setExpanded((s) => !s)}
          aria-expanded={expanded}
        >
          {expanded ? 'Приховати' : 'Показати більше'}
        </button>
      </div>
    </section>
  );
}
