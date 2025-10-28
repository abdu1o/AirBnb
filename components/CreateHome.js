// FILE: pages/create-home.jsx
// Next.js page: "Запропонувати житло"
// Треба встановити залежності перед використанням:
// npm install leaflet react-icons
// (Leaflet CSS завантажується динамічно всередині компонента)

import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header'; // припускаю, що такий компонент у вас вже є
import styles from '../styles/CreateHome.module.css';
import {
  FiWifi,
  FiCloud,
  FiCoffee,
  FiWind,
  FiSun,
  FiTv,
  FiTruck,
  FiHome,
  FiMapPin,
  FiUpload,
} from 'react-icons/fi';

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

export default function CreateHomePage() {
  const [coords, setCoords] = useState({ lat: 46.4825, lng: 30.7233 }); // приклад: Одеса
  const [city, setCity] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Автоматичне визначення геолокації при завантаженні
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        reverseGeocode(lat, lng);
      },
      (err) => {
        console.warn('Геолокація відхилена або недоступна:', err.message);
      }
    );
  }, []);

  // Reverse geocoding via Nominatim (OpenStreetMap)
  async function reverseGeocode(lat, lon) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      if (!res.ok) return;
      const data = await res.json();
      // спробуємо витягти місто або населений пункт
      const cityName = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state;
      if (cityName) setCity(cityName);
    } catch (e) {
      console.error('Помилка reverse geocode', e);
    }
  }

  // Inicjalizacja Leaflet map (без react-leaflet) — динамічно завантажуємо leaflet
  useEffect(() => {
    let L;
    let map;

    async function initMap() {
      // завантажуємо leaflet CSS
      if (!document.querySelector('#leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const leaflet = await import('leaflet');
      L = leaflet.default || leaflet;

      // виправлення шляху до іконок у leaflet (якщо потрібно)
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      });

      map = L.map('create-home-map', { zoomControl: false }).setView([coords.lat, coords.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // marker
      markerRef.current = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(map);

      map.on('click', function (e) {
        const { lat, lng } = e.latlng;
        setCoords({ lat, lng });
        markerRef.current.setLatLng(e.latlng);
        reverseGeocode(lat, lng);
      });

      markerRef.current.on('dragend', function (e) {
        const { lat, lng } = e.target.getLatLng();
        setCoords({ lat, lng });
        reverseGeocode(lat, lng);
      });

      mapRef.current = map;
    }

    initMap();

    // оновлювати позицію маркера коли coords змінюються ззовні
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Оновлюємо вид маркера, якщо координати змінюються через геолокацію
  useEffect(() => {
    try {
      if (markerRef.current) markerRef.current.setLatLng([coords.lat, coords.lng]);
      if (mapRef.current) mapRef.current.setView([coords.lat, coords.lng], 13);
    } catch (e) {}
  }, [coords]);

  function toggleAmenity(key) {
    setSelectedAmenities((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      return [...prev, key];
    });
  }

  function handlePhotoChange(e) {
    const files = Array.from(e.target.files || []);
    setPhotos(files);
    const previews = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setPhotoPreviews(previews);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    // Підготовка payload — тут можна відправити на ваш API
    const payload = {
      title,
      description,
      coords,
      city,
      amenities: selectedAmenities,
      photos: photos.map((p) => p.name),
    };

    // Для демо просто лог
    console.log('Payload ready:', payload);
    // якщо потрібна відправка файлів, створіть FormData і відправте

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Житло запропоновано (демо) — подивіться консоль.');
    }, 800);
  }

  return (
    <div className={styles.pageRoot}>
      <Header />

      <main className={styles.container}>
        <h1 className={styles.title}>Запропонувати житло</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.leftColumn}>
            <label className={styles.label}>Назва оголошення</label>
            <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Наприклад: Затишна квартира в центрі" />

            <label className={styles.label}>Опис</label>
            <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Короткий опис житла..." />

            <label className={styles.label}>Локація на мапі</label>
            <div className={styles.mapBlock}>
              <div id="create-home-map" className={styles.map}></div>
              <div className={styles.coordsRow}>
                <div className={styles.coordsItem}><FiMapPin /> {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</div>
                <div className={styles.coordsItem}>Місто: <strong>{city || 'Невідомо'}</strong></div>
              </div>
              <small className={styles.hint}>Клацніть по мапі або перетягніть маркер, щоб вибрати точну позицію.</small>
            </div>

            <label className={styles.label}>Зручності</label>
            <div className={styles.amenitiesGrid}>
              {Object.entries(amenityMap).map(([key, { title, icon }]) => (
                <button
                  type="button"
                  key={key}
                  className={`${styles.amenityBtn} ${selectedAmenities.includes(key) ? styles.amenityActive : ''}`}
                  onClick={() => toggleAmenity(key)}
                >
                  <div className={styles.amenityIcon}>{icon}</div>
                  <div className={styles.amenityTitle}>{title}</div>
                </button>
              ))}
            </div>

            <label className={styles.label}>Фотографії житла</label>
            <div className={styles.uploader}>
              <label className={styles.uploadLabel}>
                <FiUpload /> Завантажити фото
                <input className={styles.fileInput} type="file" accept="image/*" multiple onChange={handlePhotoChange} />
              </label>

              <div className={styles.previews}>
                {photoPreviews.map((p) => (
                  <div key={p.url} className={styles.previewItem}>
                    <img src={p.url} alt={p.name} />
                    <div className={styles.previewName}>{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className={styles.rightColumn}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Перевірте локацію та фото</h3>
              <div className={styles.cardRow}><strong>Місто:</strong> {city || 'не визначено'}</div>
              <div className={styles.cardRow}><strong>Координати:</strong> {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</div>
              <div className={styles.cardRow}><strong>Вибрані зручності:</strong> {selectedAmenities.length ? selectedAmenities.map(k => amenityMap[k].title).join(', ') : 'не вибрано'}</div>

              <button className={styles.submitBtn} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Відправка...' : 'Запропонувати житло'}</button>

              <div className={styles.smallNote}>Після відправки — адміністратор перегляне оголошення.</div>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}

/*
  Примітка:
  - Файл використовує leaflet, тому потрібно додати пакет leaflet: npm i leaflet
  - Header компонент імпортується як ../components/Header — змініть шлях якщо потрібно
  - Reverse geocoding йде на nominatim.openstreetmap.org — без API ключа.
*/


/* -------------------------------------------------------------------------- */
/* FILE: styles/CreateHome.module.css                                              */
/* Помістіть цей CSS у файл: ../styles/CreateHome.module.css                    */
