'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from '../styles/Home.module.css';
import { FiSearch } from 'react-icons/fi';
import Modal from './Modal';
import WhereModal from './WhereModal'; // <-- новый модал
import WhoModal from './WhoModal';



function formatDateForInput(iso) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('uk-UA').format(new Date(iso));
}

export default function FilterControls() {
  const [modalOpen, setModalOpen] = useState(false);
  const [whereOpen, setWhereOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [dateRange, setDateRange] = useState(null);
  const [whereSelected, setWhereSelected] = useState(null); // { label, lat, lon }

  // В component state:
  const [whoOpen, setWhoOpen] = useState(false);
  const [whoSelected, setWhoSelected] = useState(null);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem('hf_dateRange');
      if (raw) setDateRange(JSON.parse(raw));
    } catch (e) { /* ignore */ }

    try {
      const w = localStorage.getItem('hf_where');
      if (w) setWhereSelected(JSON.parse(w));
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (dateRange) localStorage.setItem('hf_dateRange', JSON.stringify(dateRange));
      else localStorage.removeItem('hf_dateRange');
    } catch (e) { /* ignore */ }
  }, [dateRange, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (whereSelected) localStorage.setItem('hf_where', JSON.stringify(whereSelected));
      else localStorage.removeItem('hf_where');
      try {
        const w = localStorage.getItem('hf_who');
        if (w) setWhoSelected(JSON.parse(w));
      } catch (e) { /* ignore */ }
    } catch (e) { /* ignore */ }
  }, [whereSelected, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (whoSelected) localStorage.setItem('hf_who', JSON.stringify(whoSelected));
      else localStorage.removeItem('hf_who');
    } catch (e) { }
  }, [whoSelected, hydrated]);

  const handleSaveDates = (range) => setDateRange(range);
  const handleSaveWhere = (payload) => setWhereSelected(payload);

  const isCombined = dateRange && dateRange.type && dateRange.type !== 'range';
  const openModalSafe = () => { if (!hydrated) return; setModalOpen(true); };

  const openWho = () => { if (!hydrated) return; setWhoOpen(true); };
  const handleSaveWho = (payload) => setWhoSelected(payload);

  const modalKey = useMemo(() => {
    try { return dateRange ? JSON.stringify(dateRange) : 'empty'; }
    catch (e) { return 'empty'; }
  }, [dateRange]);

  // handler for clicking "Куди"
  const openWhere = () => {
    if (!hydrated) return;
    setWhereOpen(true);
  };

  return (
    <div className={styles.filterWrapper}>
      <div className={styles.searchBox}>
        {/* "Куди" now opens WhereModal */}
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

        {/* Dates / When */}
        {!hydrated ? (
          <>
            <input type="text" placeholder="Прибуття" className={styles.inputField} readOnly onClick={openModalSafe} />
            <div className={styles.separator} />
            <input type="text" placeholder="Виїзд" className={styles.inputField} readOnly onClick={openModalSafe} />
          </>
        ) : !isCombined ? (
          <>
            <div role="button" tabIndex={0} className={styles.inputField} onClick={openModalSafe}>
              {dateRange && dateRange.type === 'range' && dateRange.start
                ? formatDateForInput(dateRange.start)
                : 'Прибуття'}
            </div>

            <div className={styles.separator} />

            <div role="button" tabIndex={0} className={styles.inputField} onClick={openModalSafe}>
              {dateRange && dateRange.type === 'range' && dateRange.end
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

        <div role="button" tabIndex={0} className={styles.inputField} onClick={openWho} style={{ cursor: 'pointer' }}>
          {whoSelected?.label || 'Хто'}
        </div>

        <button className={styles.searchButton} aria-label="Search">
          <FiSearch size={20} />
        </button>
      </div>

      <Modal
        key={modalKey}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialRange={dateRange}
        onSave={(range) => { handleSaveDates(range); setModalOpen(false); }}
      />

      <WhereModal
        isOpen={whereOpen}
        onClose={() => setWhereOpen(false)}
        initialWhere={whereSelected}
        onSave={(w) => { handleSaveWhere(w); setWhereOpen(false); }}
      />

      <WhoModal
        isOpen={whoOpen}
        onClose={() => setWhoOpen(false)}
        initialWho={whoSelected}
        onSave={(w) => { handleSaveWho(w); setWhoOpen(false); }}
      />
    </div>
  );
}
