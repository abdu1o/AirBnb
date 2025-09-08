'use client';

import { useState } from 'react';
import styles from '../styles/Property.module.css';
import LocationComponent from '../components/LocationComponent';
import Amenities from './Amenities';
import Review from './Review';

export default function PropertyFooter() {
  const [activeTab, setActiveTab] = useState('amenities');

  const sampleAmenities = [
  { id: 'kitchen', title: 'Кухня', desc: '' , icon: (<svg ></svg>) },
  { id: 'workspace', title: 'Окреме місце для сну' },
  { id: 'wifi', title: 'Wi-Fi' },
  { id: 'tv', title: 'Телевізор HDTV з 32-дюймовим екраном', desc: 'стандартне кабельне ТБ, Netflix' },
  { id: 'lift', title: 'Ліфт' },
  { id: 'ac', title: 'Портативна система кондиціонування' },
  { id: 'dryer', title: 'Пральна та сушильна машина' },
  { id: 'kitch-equipped', title: 'Укомплектована кухня' },
  { id: 'hairdryer', title: 'Фен' },
  { id: 'parking', title: 'Паркінг' }];

  // Демонстрационные отзывы — замени на реальные при подключении БД
  const sampleReviews = [
    {
      name: 'Oleksandr',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=80&w=80',
      text: 'Однозначно рекомендую, все було на високому рівні :)',
    },
    {
      name: 'Дарина',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&h=80&w=80',
      text: 'Дуже дякую за гарні апартаменти! Дуже близько до пляжу, а сама квартира просто вау!',
    },
    {
      name: 'Дарья',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&h=80&w=80',
      text: 'Всі фото відповідають дійсності. Вид з вікна просто неймовірний!',
    },
    {
      name: 'Даниил',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&h=80&w=80',
      text: 'Все пройшло чудово! Місцерозташування квартири — 5 зірок!',
    },
    {
      name: 'Сергей',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&h=80&w=80',
      text: 'Все було чудово! Дар`я завжди готова допомогти!',
    },
    {
      name: 'Sveta',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&h=80&w=80',
      text: 'Дуже гарна квартира і дуже гарна господиня. Рекомендую!',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'amenities':
        return <Amenities amenities={sampleAmenities} />;;
      case 'reviews':
        return (
          <div>
            {/* Верхняя строка с заголовками/метриками (как на скриншоте) */}
            <div className={styles.reviewsHeader}>
              <div className={styles.reviewsHeaderItem}>
                <div className={styles.reviewsHeaderTitle}>Прибуття</div>
                <div className={styles.reviewsHeaderScore}>4,9</div>
              </div>

              <div className={styles.reviewsHeaderItem}>
                <div className={styles.reviewsHeaderTitle}>Ціна/Якість</div>
                <div className={styles.reviewsHeaderScore}>4,9</div>
              </div>
            </div>

            {/* Сетка отзывов */}
            <div className={styles.reviewsGrid}>
              {sampleReviews.map((r, idx) => (
                <Review key={idx} avatar={r.avatar} name={r.name} text={r.text} />
              ))}
            </div>

            <div className={styles.reviewsActions}>
              <button className={styles.showAllBtn}>Показати всі 35 відгуків</button>
            </div>
          </div>
        );
      case 'location':
        return (<LocationComponent
          lat={48.43333}
          lng={33.4234}
          title="Одеса, Одеська область, Україна"
          shortText="Перша лінія біля моря, Аркадія, Французький бульвар"
          fullText="Точне розташування буде повідомлено після бронювання. Поблизу: набережна, ресторани, парки. Готово для прогулянок та відпочинку."
          zoom={14}
          iframeHeight={380}
        />);
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
