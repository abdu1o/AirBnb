import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/CreateHome.module.css';
import SelectionModal from './SelectionModal';
import WhoModal from './WhoModal';
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
  FiStar,
} from 'react-icons/fi';

const amenityMap = {
  wifi: { title: 'Wi-Fi', icon: <FiWifi size={18} /> },
  washer: { title: 'Пральна машина', icon: <FiCloud size={18} /> },
  kitchen: { title: 'Кухня', icon: <FiCoffee size={18} /> },
  airConditioning: { title: 'Кондиціонер', icon: <FiWind size={18} /> },
  heating: { title: 'Опалення', icon: <FiSun size={18} /> },
  tv: { title: 'Телевізор', icon: <FiTv size={18} /> },
  parking: { title: 'Паркінг', icon: <FiTruck size={18} /> },
  balcony: { title: 'Балкон', icon: <FiHome size={18} /> },
};

export default function CreateHomePage() {
  const [coords, setCoords] = useState({ lat: 46.4825, lng: 30.7233 });
  const [city, setCity] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reverseError, setReverseError] = useState(null);
  const [pricePerNight, setPricePerNight] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selection, setSelection] = useState({ start: null, end: null });
  const [who, setWho] = useState(null);
  const [whoModalOpen, setWhoModalOpen] = useState(false);

  const guestsLabel = who?.label || '1 гість';

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // refs для debounce/abort reverse geocode
  const reverseAbortRef = useRef(null);
  const reverseTimeoutRef = useRef(null);

  // примерные значения для правой карточки (можете заменить на реальные)
  const samplePrice = 85;
  const sampleRating = 3.7;
  const sampleReviews = 3;

  // Геолокация при загрузке
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        // при автопозиции — хочемо миттєвий зворотний геокод
        reverseGeocode(lat, lng, true);
      },
      (err) => {
        console.warn('Геолокація відхилена або недоступна:', err.message);
      }
    );
  }, []);

  // Debounced + cancellable reverse geocode
  // immediate=true — виконати без debounce (для початкової автопозиції)
  async function reverseGeocode(lat, lon, immediate = false) {
    // очистити попереднi таймери/запити
    if (reverseTimeoutRef.current) {
      clearTimeout(reverseTimeoutRef.current);
      reverseTimeoutRef.current = null;
    }
    if (reverseAbortRef.current) {
      reverseAbortRef.current.abort();
      reverseAbortRef.current = null;
    }

    const doFetch = async () => {
      const ac = new AbortController();
      reverseAbortRef.current = ac;
      setReverseError(null);
      try {
        // НОМИНАТИМ має rate limit; мы используем debounce + отмену чтобы не попадать под него.
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=uk`;
        const res = await fetch(url, {
          signal: ac.signal,
          headers: {
            // нельзя заменить User-Agent в браузере, но Accept полезен
            Accept: 'application/json',
          },
        });
        if (!res.ok) {
          setReverseError(`Reverse geocode failed: ${res.status}`);
          console.warn('Reverse geocode failed', res.status);
          return;
        }
        const data = await res.json();
        const addr = data.address || {};
        const cityName = addr.city || addr.town || addr.village || addr.county || addr.state || '';
        if (cityName) setCity(cityName);
      } catch (e) {
        if (e.name === 'AbortError') {
          // expected on rapid interactions
          // console.log('reverseGeocode aborted');
        } else {
          console.error(' Помилка reverse geocode:', e);
          setReverseError('Помилка визначення міста');
        }
      } finally {
        reverseAbortRef.current = null;
      }
    };

    if (immediate) {
      // невідкладно
      doFetch();
    } else {
      // debounce — 900ms пауза між викликами
      reverseTimeoutRef.current = setTimeout(doFetch, 900);
    }
  }

  // Инициализация leaflet (динамически)
  useEffect(() => {
    let L;
    let map;
    let mounted = true;

    async function initMap() {
      if (!mounted) return;
      // подключаем CSS один раз
      if (!document.querySelector('#leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const leaflet = await import('leaflet');
      L = leaflet.default || leaflet;

      // fix default icons path
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

      markerRef.current = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(map);

      map.on('click', function (e) {
        const { lat, lng } = e.latlng;
        setCoords({ lat, lng });
        if (markerRef.current) markerRef.current.setLatLng(e.latlng);
        // debounce reverse geocode (не відправляти мільйон запитів)
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

    return () => {
      mounted = false;
      // remove map if exists
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      // cancel pending reverse geocode
      if (reverseTimeoutRef.current) {
        clearTimeout(reverseTimeoutRef.current);
        reverseTimeoutRef.current = null;
      }
      if (reverseAbortRef.current) {
        reverseAbortRef.current.abort();
        reverseAbortRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // init once

  // обновляем маркер/вид когда coords изменяются извне (например геолокация)
  useEffect(() => {
    try {
      if (markerRef.current) markerRef.current.setLatLng([coords.lat, coords.lng]);
      if (mapRef.current) mapRef.current.setView([coords.lat, coords.lng], 13);
    } catch (e) {
      // ignore
    }
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

    const payload = {
      title,
      description,
      coords,
      city,
      amenities: selectedAmenities,
      photos: photos.map((p) => p.name),
      pricePerNight
    };

    console.log('Payload ready:', payload);

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Житло запропоновано (демо) — подивіться консоль.');
    }, 800);
  }

  return (
    <>
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
              {reverseError && <div className={styles.reverseError}>⚠️ {reverseError}</div>}
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
              <div className={styles.cardTop}>
                <div className={styles.cardTop}>
                  <div className={styles.priceInputWrap}>
                    <span className={styles.currency}>$</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(Number(e.target.value))}
                      className={styles.priceInput}
                      aria-label="Ціна за ніч"
                    />
                    <span className={styles.priceSuffix}>/ ніч</span>
                  </div>

                </div>
              </div>

              <h3 className={styles.cardTitle}>Перевірте локацію та фото</h3>

              <div className={styles.cardRow}><strong>Місто:</strong> {city || 'не визначено'}</div>
              <div className={styles.cardRow}><strong>Координати:</strong> {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</div>
              <div className={styles.cardRow}><strong>Вибрані зручності:</strong> {selectedAmenities.length ? selectedAmenities.map(k => amenityMap[k].title).join(', ') : 'не вибрано'}</div>

              <div className={styles.bookingFields}>
                <div className={styles.fieldRow}>
                  <label className={styles.smallLabel}>Вільні дати</label>
                  <div
                    role="button"
                    tabIndex={0}
                    className={styles.inputBox}
                    onClick={() => setModalOpen(true)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setModalOpen(true); }}
                  >
                    {selection.start ? `${new Date(selection.start).toLocaleDateString('uk-UA')} - ${new Date(selection.end).toLocaleDateString('uk-UA')}`  : 'Оберіть'}
                  </div>
                </div>

<div className={styles.fieldRow}>
                <label className={styles.smallLabel}>Гості</label>
                <div
                role="button"
                tabIndex={0}
                className={styles.inputBox}
                style={{ gridColumn: 'span 2' }}
                onClick={() => setWhoModalOpen(true)}
              >
                {guestsLabel}
              </div>
              </div>
              </div>

              <button className={styles.submitBtn} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Відправка...' : 'Запропонувати житло'}</button>

              <div className={styles.smallNote}>Після відправки — адміністратор перегляне оголошення.</div>
            </div>
          </aside>
        </form>
      </main>
    </div>

      <SelectionModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              initialRange={selection}
              onSave={(range) => setSelection(range)}
            />

      <WhoModal
              isOpen={whoModalOpen}
              onClose={() => setWhoModalOpen(false)}
              initialWho={who}
              onSave={(payload) => {
                setWho(payload);
                setWhoModalOpen(false);
              }}
            />
        
        </>
  );
}
