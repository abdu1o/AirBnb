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

export default function FilterControls({ categoriesSelected, setCategoriesSelected }) {
  const [hydrated, setHydrated] = useState(false);

  const [dateRange, setDateRange] = useState(null);
  const [whereSelected, setWhereSelected] = useState(null);
  const [whoSelected, setWhoSelected] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [whereOpen, setWhereOpen] = useState(false);
  const [whoOpen, setWhoOpen] = useState(false);

  // Инициализация с localStorage
  useEffect(() => {
    try {
      const rawState = localStorage.getItem('hf_state');
      if (rawState) {
        const state = JSON.parse(rawState);
        setDateRange(state.dateRange || null);
        setWhereSelected(state.where || null);
        setWhoSelected(state.who || null);
        setCategoriesSelected(state.categories || []);
      }
    } catch (e) {
      console.error(e);
    }
    setHydrated(true);
  }, []);

  // Сохраняем в localStorage и на сервер
  useEffect(() => {
    if (!hydrated) return;

    const state = {
      where: whereSelected || { selected: null, query: '' },
      who: whoSelected || { adults: 1, children: 0, infants: 0, pets: 0 },
      dateRange: dateRange || null,
      categories: categoriesSelected || [],
    };

    try {
      localStorage.setItem('hf_state', JSON.stringify(state));
      localStorage.setItem('hf_dateRange', JSON.stringify(dateRange));
      localStorage.setItem('hf_where', JSON.stringify(whereSelected));
      localStorage.setItem('hf_who', JSON.stringify(whoSelected));
      localStorage.setItem('hf_categories', JSON.stringify(categoriesSelected));
    } catch (e) {
      console.error(e);
    }

    fetch('/api/searchState', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
  }, [whereSelected, whoSelected, dateRange, categoriesSelected, hydrated]);
  
  const handleSaveDates = (range) => setDateRange(range);
  const handleSaveWhere = (payload) => setWhereSelected(payload);
  const handleSaveWho = (payload) => setWhoSelected(payload);

  const isCombined = dateRange && dateRange.type && dateRange.type !== 'range';
  const openModalSafe = () => { if (!hydrated) return; setModalOpen(true); };
  const openWhere = () => { if (!hydrated) return; setWhereOpen(true); };
  const openWho = () => { if (!hydrated) return; setWhoOpen(true); };

  const modalKey = useMemo(() => {
    try { return dateRange ? JSON.stringify(dateRange) : 'empty'; }
    catch { return 'empty'; }
  }, [dateRange]);

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
        onSave={(w) => { handleSaveWhere(w); setWhereOpen(false); window.location.reload();}}
      />

      <WhoModal
        isOpen={whoOpen}
        onClose={() => setWhoOpen(false)}
        initialWho={whoSelected}
        onSave={(w) => { handleSaveWho(w); setWhoOpen(false); window.location.reload();}}
      />
    </div>
  );
}
