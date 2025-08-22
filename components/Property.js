'use client';

import { useState, useMemo } from 'react';
import SelectionModal from './SelectionModal';
import WhoModal from './WhoModal';
import styles from '../styles/Property.module.css';

function formatDate(iso) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('uk-UA').format(new Date(iso));
}

const IMG = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';

export default function Property({ photos: incomingPhotos }) {
  const photos = (incomingPhotos && incomingPhotos.length)
    ? incomingPhotos
    : [IMG, IMG, IMG, IMG];

  // states for dates (existing)
  const [selection, setSelection] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // NEW: who modal state
  const [who, setWho] = useState(null); // will hold {adults,children,infants,pets,label}
  const [whoModalOpen, setWhoModalOpen] = useState(false);

  const price = useMemo(() => 63, []);

  // guests label shown in input: prefer `who.label`, fallback to simple default
  const guestsLabel = who && who.label ? who.label : '1 гість';

  // gallery logic (same as before)
  const main = photos[0];
  const side = photos.slice(1);
  const countKey = Math.min(photos.length, 4);
  const countClass = `count${countKey}`;

  return (
    <>
      <main className={styles.container}>
        <div className={`${styles.gallery} ${styles[countClass]}`}>
          <div className={styles.mainPhoto}>
            <img src={main} alt="Main property" loading="lazy" />
          </div>

          {side.length > 0 && (
            <div className={styles.sidePhotos}>
              {side.map((src, idx) => (
                <div key={idx} className={styles.thumb}>
                  <img src={src} alt={`Photo ${idx + 2}`} loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>

        <section className={styles.description}>
          <h1 className={styles.title}>Студія та спальня з панарамою на місто! Біля моря!</h1>

          <div className={styles.meta}>
            <span>★ 4,95 · 35 відгуків</span>
            <span>· Одеса, Одеська область, Україна</span>
          </div>

          <div className={styles.about}>
            <h2>Помешкання для оренди, господар — Ілона</h2>
            <p className={styles.info}>4 гостя, 1 спальня, 2 ліжка, 1 ванна кімната</p>

            <hr />

            <h3>Окреме робоче місце</h3>
            <p className={styles.small}>Зона спільного користування з Wi-Fi, яка добре підходить для роботи. Великий стіл, зручне крісло та швидкий інтернет — все, що потрібно для продуктивного дня.</p>

            <h3>Самостійне прибуття</h3>
            <p className={styles.small}>Самостійне прибуття за допомогою ключа в сейфі — зручне та безконтактне.</p>

            <h3>Безкоштовне скасування</h3>
            <p className={styles.small}>Безкоштовне скасування бронювання до 30 грудня.</p>
          </div>
        </section>

        <aside className={styles.booking}>
          <div className={styles.bookingCard}>
            <div className={styles.priceRow}>
              <div className={styles.price}><strong>${price}</strong> ніч</div>
              <div className={styles.rating}>★ 4,95 · 35 відгуків</div>
            </div>

            <div className={styles.inputsGrid}>
              <div className={styles.inputLabel}>ПРИБУТТЯ</div>
              <div className={styles.inputLabel}>ВИЇЗД</div>

              <div
                role="button"
                tabIndex={0}
                className={styles.inputBox}
                onClick={() => setModalOpen(true)}
              >
                {selection && selection.type === 'range' ? formatDate(selection.start) : 'Оберіть'}
              </div>

              <div
                role="button"
                tabIndex={0}
                className={styles.inputBox}
                onClick={() => setModalOpen(true)}
              >
                {selection && selection.type === 'range' ? formatDate(selection.end) : 'Оберіть'}
              </div>

              <div className={styles.inputLabel}>ГОСТІ</div>
              <div className={styles.inputLabel}> </div>

              {/* Guests input: open WhoModal on click */}
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

            <button className={styles.bookButton}>Забронювати</button>
            <div className={styles.note}>Поки що ви нічого не платите</div>
          </div>
        </aside>
      </main>

      {/* SelectionModal (dates) */}
      <SelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialRange={selection}
        onSave={(range) => {
          if (range) setSelection(range);
          setModalOpen(false);
        }}
      />

      {/* WhoModal (guests) */}
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
