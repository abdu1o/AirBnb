// components/OrderPage.js
'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../styles/Order.module.css';
import { useSearchParams } from 'next/navigation';

function fmt(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function calcNights(start, end) {
  if (!start || !end) return 1;
  const s = new Date(start);
  const e = new Date(end);
  const diff = (e - s) / (1000 * 60 * 60 * 24);
  return diff > 0 ? diff : 1;
}

export default function OrderPage({ listing = null, user = null, reviewCount = 0, reviews = [] }) {
  // URL params (if page was opened via Link с query)
  const sp = useSearchParams();
  const startParam = sp?.get('start') || '';
  const endParam = sp?.get('end') || '';
  const guestsParam = sp?.get('guests') || '';
  const nightsParam = sp?.get('nights') || '';
  const totalParam = sp?.get('total') || '';

  // If listing prop exists, use its data; otherwise fallback to query values / placeholders
  const listingTitle = listing?.title || listing?.description || 'Помешкання для оренди цілком';
  const listingLocation = listing?.location || '';
  const basePrice = listing?.price ?? (totalParam ? Number(totalParam) : 63);
  const photos = (listing?.photos && listing.photos.length) ? listing.photos : (listing?.imageUrl ? [listing.imageUrl] : ['/images/room-placeholder.jpg']);
  const thumb = photos[0];

  // derive booking info (prefer query params when present)
  const start = startParam || '';
  const end = endParam || '';
  const guests = guestsParam || String((listing && listing.details?.guests) || '1');
  const nights = Number(nightsParam || calcNights(start, end) || 1);
  const total = String(parseInt(totalParam) + 20) || String((basePrice * nights + 20).toFixed(2));

  const avgRating = reviews && reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <main className={styles.left}>
          <Link href="/" className={styles.back}>‹ Запит на бронювання</Link>

          <div className={styles.infoCard}>
            <div className={styles.badge}>Це рідкісна знахідка</div>
            <p className={styles.infoText}>Помешкання господаря {user?.name || 'Марія'} зазвичай заброньоване.</p>
          </div>

          <h2 className={styles.sectionTitle}>Ваша подорож</h2>

          <div className={styles.rowBetween}>
            <div className={styles.label}>Дати</div>
            <div className={styles.action}>Редагувати</div>
          </div>

          <div className={styles.muted}>{start ? fmt(start) + ' — ' + (end ? fmt(end) : '') : 'Не вибрано'}</div>

          <div className={styles.rowBetween} style={{ marginTop: '18px' }}>
            <div className={styles.label}>Гості</div>
            <div className={styles.action}>Редагувати</div>
          </div>
          <div className={styles.muted}>{guests} {Number(guests) === 1 ? 'гість' : 'гостей'}</div>

          <h3 className={styles.sectionTitle} style={{ marginTop: 26 }}>Варіант оплати</h3>

          <div className={styles.paymentOptions}>
            <label className={styles.paymentItem}>
              <input type="radio" name="pay" defaultChecked />
              <div className={styles.payContent}>
                <div className={styles.payTitle}>Оплатити в повному обсязі</div>
                <div className={styles.muted}>{total ? `Сплатіть усю суму ($${total}) одразу.` : 'Сплатіть суму при оформленні.'}</div>
              </div>
            </label>
          </div>

          <h3 className={styles.sectionTitle} style={{ marginTop: 28 }}>Вкажіть номер телефону, щоб зробити бронювання</h3>

          <div className={styles.formBlock}>
            <select className={styles.select}>
              <option>Україна (+380)</option>
            </select>
            <input className={styles.input} placeholder="Номер телефону" />

            <button className={styles.primary}>Продовжити</button>

            <div className={styles.divider}><span>або</span></div>

            <button className={styles.linkBtn}>Використати електронну пошту</button>
          </div>
        </main>

        <aside className={styles.right}>
          <div className={styles.summaryCard}>
            <img src={thumb} alt="room" className={styles.thumb} />
            <div className={styles.cardBody}>
              <div className={styles.roomTitle}>{listingTitle}</div>
              <div className={styles.muted}>{listingLocation} {avgRating ? `· ★ ${avgRating} · ${reviewCount} відгуків` : ''}</div>

              <div className={styles.hr} />

              <div className={styles.priceRow}>
                <div>${Number(basePrice).toFixed(2)} {nights > 1 ? `× ${nights} ночей` : 'за ніч'}</div>
                <div>${(Number(basePrice) * nights).toFixed(2)}</div>
              </div>

              <div className={styles.priceRow}>
                <div>Плата за прибирання</div>
                <div>$20.00</div>
              </div>

              <div className={styles.totalRow}>
                <div>Усього (USD)</div>
                <div className={styles.totalPrice}>${total}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
