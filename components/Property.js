/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useMemo } from 'react';
import SelectionModal from './SelectionModal';
import WhoModal from './WhoModal';
import styles from '../styles/Property.module.css';
import { pluralize } from '../lib/utils/pluralizer';

function formatDate(iso) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('uk-UA').format(new Date(iso));
}

const IMG = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';

export default function Property({ photos: incomingPhotos, listing, user, reviewCount, reviews }) {
  const photos = (incomingPhotos && incomingPhotos.length)
    ? incomingPhotos
    : [IMG, IMG, IMG, IMG];

  // вычисляем средний рейтинг на основе reviews
  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // states for dates
  const [selection, setSelection] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // who state
  const [who, setWho] = useState(null);
  const [whoModalOpen, setWhoModalOpen] = useState(false);

  // базовая цена за ночь
  const basePrice = useMemo(() => listing.price || 63, [listing]);

  // вычисляем количество ночей
  const nights = useMemo(() => {
    if (!selection || !selection.start || !selection.end) return 1;
    const start = new Date(selection.start);
    const end = new Date(selection.end);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 1;
  }, [selection]);

  // итоговая цена
  const totalPrice = useMemo(() => basePrice * nights, [basePrice, nights]);

  const guestsLabel = who?.label || '1 гість';

  // gallery
  const main = photos[0];
  const side = photos.slice(1);
  const countKey = Math.min(photos.length, 4);
  const countClass = `count${countKey}`;

  return (
    <>
      <main className={styles.container}>
        <div className={`${styles.gallery} ${styles[countClass]}`}>
          <div className={styles.mainPhoto}>
            <img src={listing.imageUrl} alt="Main property" loading="lazy" />
          </div>

          {side.length > 0 && (
            <div className={styles.sidePhotos}>
              {side.map((src, idx) => (
                <div key={idx} className={styles.thumb}>
                  <img src={listing.imageUrl} alt={`Photo ${idx + 2}`} loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>

        <section className={styles.description}>
          <h1 className={styles.title}>{listing.description}</h1>

          <div className={styles.meta}>
            <span>
              ★ {avgRating !== null ? avgRating : '—'} · {reviewCount} відгуків
            </span>
            <span>· {listing.title}, {listing.location}</span>
          </div>

          <div className={styles.about}>
            <h2>Господар — {user.name}</h2>
            <p className={styles.info}>
              {listing.details.guests} {pluralize(listing.details.guests, 'гостя', 'гостя', 'гостей')},{" "}
              {listing.details.beds} {pluralize(listing.details.beds, 'спальне місце', 'спальні місця', 'спальних місць')},{" "}
              {listing.details.bedrooms} {pluralize(listing.details.bedrooms, 'спальня', 'спальні', 'спальнь')},{" "}
              {listing.details.bathrooms} {pluralize(listing.details.bathrooms, 'ванна кімната', 'ванні кімнати', 'ванних кімнат')}{" "}
            </p>
            
            <hr />

            <h2 className={styles.title}>Кому можна їхати</h2>

            <p className={styles.small}> Діти до 12 років - {listing.childrenAllowed ? "Так" : "Ні"}</p>
            <p className={styles.small}> Тваринки - {listing.animalsAllowed ? "Так" : "Ні"}</p>
          </div>
        </section>

        <aside className={styles.booking}>
          <div className={styles.bookingCard}>
            <div className={styles.priceRow}>
              <div className={styles.price}>
                <strong>${totalPrice}</strong> {nights > 1 ? `за ${nights} ночей` : 'ніч'}
              </div>
              <div className={styles.rating}>
                ★ {avgRating !== null ? avgRating : '—'} · {reviewCount} відгуків
              </div>
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
                {selection?.start ? formatDate(selection.start) : 'Оберіть'}
              </div>

              <div
                role="button"
                tabIndex={0}
                className={styles.inputBox}
                onClick={() => setModalOpen(true)}
              >
                {selection?.end ? formatDate(selection.end) : 'Оберіть'}
              </div>

              <div className={styles.inputLabel}>ГОСТІ</div>
              <div className={styles.inputLabel}> </div>

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

      {/* SelectionModal */}
      <SelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialRange={selection}
        onSave={(range) => {
          setSelection(range);
        }}
      />

      {/* WhoModal */}
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
