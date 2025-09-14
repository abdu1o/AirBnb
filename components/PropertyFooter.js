'use client';

import { useState } from 'react';
import styles from '../styles/Property.module.css';
import LocationComponent from '../components/LocationComponent';
import Amenities from './Amenities';
import Review from './Review';

export default function PropertyFooter({ listing, reviews }) {
  const [activeTab, setActiveTab] = useState('amenities');

  const renderContent = () => {
    switch (activeTab) {
      case 'amenities':
        return <Amenities amenities={listing.amenities} />;
      case 'reviews':
        return (
          <div>

            {/* !Сделаю если будет время!  */}

            {/* Верхняя строка с заголовками/метриками */}
            {/* <div className={styles.reviewsHeader}>
              <div className={styles.reviewsHeaderItem}>
                <div className={styles.reviewsHeaderTitle}>Прибуття</div>
                <div className={styles.reviewsHeaderScore}>4,9</div>
              </div>

              <div className={styles.reviewsHeaderItem}>
                <div className={styles.reviewsHeaderTitle}>Ціна/Якість</div>
                <div className={styles.reviewsHeaderScore}>4,9</div>
              </div>
            </div> */}
            {/* ---------------------------------  */}


            {/* Сетка отзывов */}
            <div className={styles.reviewsGrid}>
              {reviews.map((r) => (
                <Review
                  key={r.id}
                  avatar={r.user.avatarUrl}
                  name={`${r.user.name} ⭐ ${r.rating}`}
                  text={r.comment}
                />
              ))}
            </div>
            
            {/* !Сделаю если будет время!  */}
            {/* <div className={styles.reviewsActions}>
              <button className={styles.showAllBtn}>
                Показати всі {reviews.length} відгуків
              </button>
            </div> */}
            {/* ---------------------------------  */}
            
          </div>
        );
      case 'location':
        return (
          <LocationComponent
            lat={listing.lat}
            lng={listing.lng}
            title={listing.title}
            shortText={listing.location}
            fullText={listing.exactAddress}
            zoom={14}
            iframeHeight={380}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.footerWrapper}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'amenities' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('amenities')}
        >
          Зручності
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Відгуки
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'location' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('location')}
        >
          Розташування
        </button>
      </div>

      <div className={styles.contentWrapper}>{renderContent()}</div>
    </div>
  );
}
