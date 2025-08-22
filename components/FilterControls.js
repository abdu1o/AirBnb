'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from '../styles/Home.module.css';
import { FiSearch } from 'react-icons/fi';
import Modal from './Modal';
import WhereModal from './WhereModal';
import WhoModal from './WhoModal';

function formatDateForInput(iso) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('uk-UA').format(new Date(iso));
}

export default function FilterControls() {
  const [hydrated, setHydrated] = useState(false);

  // --- Состояния с дефолтными значениями для SSR ---
  const [dateRange, setDateRange] = useState(null);
  const [whereSelected, setWhereSelected] = useState(null);
  const [whoSelected, setWhoSelected] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [whereOpen, setWhereOpen] = useState(false);
  const [whoOpen, setWhoOpen] = useState(false);

  // --- Читаем localStorage только на клиенте ---
  useEffect(() => {
    try {
      const rawDate = localStorage.getItem('hf_dateRange');
      if (rawDate) setDateRange(JSON.parse(rawDate));

      const rawWhere = localStorage.getItem('hf_where');
      if (rawWhere) setWhereSelected(JSON.parse(rawWhere));

      const rawWho = localStorage.getItem('hf_who');
      if (rawWho) setWhoSelected(JSON.parse(rawWho));
    } catch (e) {
      console.error('Failed to parse localStorage', e);
    }
    setHydrated(true);
  }, []);

  // --- Сохраняем изменения в localStorage и на сервере ---
  useEffect(() => {
    if (!hydrated) return;

    const state = {
      where: whereSelected || { selected: null, query: '' },
      who: whoSelected || { adults: 1, children: 0, infants: 0, pets: 0 },
      dateRange: dateRange || null,
    };

    try {
      localStorage.setItem('hf_state', JSON.stringify(state));
      localStorage.setItem('hf_dateRange', JSON.stringify(dateRange));
      localStorage.setItem('hf_where', JSON.stringify(whereSelected));
      localStorage.setItem('hf_who', JSON.stringify(whoSelected));
      
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  
    fetch('/api/searchState', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
  }, [whereSelected, whoSelected, dateRange, hydrated]);

  // --- Обработчики ---
  const handleSaveDates = (range) => setDateRange(range);
  const handleSaveWhere = (payload) => setWhereSelected(payload);
  const handleSaveWho = (payload) => setWhoSelected(payload);

  const isCombined = dateRange && dateRange.type && dateRange.type !== 'range';
  const openModalSafe = () => { if (!hydrated) return; setModalOpen(true); };
  const openWhere = () => { if (!hydrated) return; setWhereOpen(true); };
  const openWho = () => { if (!hydrated) return; setWhoOpen(true); };

  const modalKey = useMemo(() => {
    try { return dateRange ? JSON.stringify(dateRange) : 'empty'; }
    catch (e) { return 'empty'; }
  }, [dateRange]);

  // --- Не рендерим ничего на сервере ---
  if (!hydrated) return null;

  return (
    <div className={styles.filterWrapper}>
      <div className={styles.searchBox}>
        {/* КУДИ */}
        <div
          role="button"
          tabIndex={0}
          className={styles.inputField}
          onClick={openWhere}
          style={{ cursor: 'pointer' }}
        >
          {whereSelected?.label || 'Куди'}
        </div>

        <div className={styles.separator} />

        {/* КОЛИ */}
        {!isCombined ? (
          <>
            <div role="button" tabIndex={0} className={styles.inputField} onClick={openModalSafe}>
              {dateRange?.type === 'range' && dateRange.start
                ? formatDateForInput(dateRange.start)
                : 'Прибуття'}
            </div>

            <div className={styles.separator} />

            <div role="button" tabIndex={0} className={styles.inputField} onClick={openModalSafe}>
              {dateRange?.type === 'range' && dateRange.end
                ? formatDateForInput(dateRange.end)
                : 'Виїзд'}
            </div>
          </>
        ) : (
          <>
            <div role="button" tabIndex={0} className={styles.whenContainer} onClick={openModalSafe}>
              <div className={styles.whenLabel}>Коли</div>
              <div className={styles.whenValue}>{dateRange?.label || 'Оберіть дату'}</div>
            </div>
            {dateRange?.type !== 'flex' && <div className={styles.separator} />}
          </>
        )}

        <div className={styles.separator} />

        {/* ХТО */}
        <div
          role="button"
          tabIndex={0}
          className={styles.inputField}
          onClick={openWho}
          style={{ cursor: 'pointer' }}
        >
          {whoSelected?.label || 'Хто'}
        </div>

        <button className={styles.searchButton} aria-label="Search">
          <FiSearch size={20} />
        </button>
      </div>

      {/* Modals */}
      <Modal
        key={modalKey}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialRange={dateRange}
        onSave={(range) => { handleSaveDates(range); setModalOpen(false); window.location.reload(); }}
      />

      <WhereModal
        isOpen={whereOpen}
        onClose={() => setWhereOpen(false)}
        initialWhere={whereSelected}
        onSave={(w) => { handleSaveWhere(w); setWhereOpen(false); window.location.reload(); }}
      />

      <WhoModal
        isOpen={whoOpen}
        onClose={() => setWhoOpen(false)}
        initialWho={whoSelected}
        onSave={(w) => { handleSaveWho(w); setWhoOpen(false); window.location.reload(); }}
      />
    </div>
  );
}
