// app/components/WhoModal.js  (или ./components/WhoModal.js)
'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/Modals.module.css';

const OPTIONS = [
  { key: 'adults', title: 'Дорослі', hint: 'Вік: від 13 р.' },
  { key: 'children', title: 'Діти', hint: 'Вік: 2–12 р.' },
  { key: 'infants', title: 'Немовлята', hint: 'До 2 р.' },
  { key: 'pets', title: 'Домашні тварини' },
];

export default function WhoModal({ isOpen, onClose, initialWho, onSave }) {
  // defaults: adults 1, others 0
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  useEffect(() => {
    if (!initialWho) {
      setAdults(1); setChildren(0); setInfants(0); setPets(0);
      return;
    }
    setAdults(Number(initialWho.adults ?? 1));
    setChildren(Number(initialWho.children ?? 0));
    setInfants(Number(initialWho.infants ?? 0));
    setPets(Number(initialWho.pets ?? 0));
  }, [initialWho, isOpen]);

  if (!isOpen) return null;

  const inc = (setter, value, max = 9) => {
    if (value >= max) return;
    setter(value + 1);
  };
  const dec = (setter, value, min = 0) => {
    if (value <= min) return;
    setter(value - 1);
  };

  // For adults min should be 1
  const decAdults = () => dec(setAdults, adults, 1); // will stop at 1
  const makeLabel = () => {
    const parts = [];
    if (adults) parts.push(`Дорослі: ${adults}`);
    if (children) parts.push(`Діти: ${children}`);
    if (infants) parts.push(`Немовлята: ${infants}`);
    if (pets) parts.push(`Песики: ${pets}`);
    return parts.length ? parts.join(' · ') : 'Хто';
  };

  const handleSave = () => {
    const payload = {
      adults, children, infants, pets,
      label: makeLabel()
    };
    onSave(payload);
    onClose();
  };

  const handleClear = () => {
    setAdults(1); setChildren(0); setInfants(0); setPets(0);
  };

  return (
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>

        <h3 style={{ textAlign: 'center', margin: '6px 0 14px' }}>Хто їде?</h3>

        <div style={{ display: 'flex', gap: 14 }}>
          {/* left: options + hints */}
          <div style={{ flex: 1 }}>
            {OPTIONS.map(opt => (
              <div key={opt.key} style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 700 }}>{opt.title}</div>
                {opt.hint && <div style={{ fontSize: 12, color: '#666' }}>{opt.hint}</div>}
              </div>
            ))}
          </div>

          {/* right: counters */}
          <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Adults */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ minWidth: 90 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  aria-label="Уменьшить взрослых"
                  onClick={() => decAdults()}
                  className={styles.chip}
                  style={{ padding: '6px 10px' }}
                >−</button>
                <div className={styles.countDisplay} style={{ minWidth: 36, textAlign: 'center', fontWeight: 600 }}>{adults}</div>
                <button
                  aria-label="Увеличить взрослых"
                  onClick={() => inc(setAdults, adults)}
                  className={styles.chip}
                  style={{ padding: '6px 10px' }}
                >+</button>
              </div>
            </div>

            {/* Children */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ minWidth: 90 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button aria-label="Уменьшить детей" onClick={() => dec(setChildren, children)} className={styles.chip} style={{ padding: '6px 10px' }}>−</button>
                <div className={styles.countDisplay} style={{ minWidth: 36, textAlign: 'center', fontWeight: 600 }}>{children}</div>
                <button aria-label="Увеличить детей" onClick={() => inc(setChildren, children)} className={styles.chip} style={{ padding: '6px 10px' }}>+</button>
              </div>
            </div>

            {/* Infants */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ minWidth: 90 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button aria-label="Уменьшить немовлят" onClick={() => dec(setInfants, infants)} className={styles.chip} style={{ padding: '6px 10px' }}>−</button>
                <div className={styles.countDisplay} style={{ minWidth: 36, textAlign: 'center', fontWeight: 600 }}>{infants}</div>
                <button aria-label="Увеличить немовлят" onClick={() => inc(setInfants, infants)} className={styles.chip} style={{ padding: '6px 10px' }}>+</button>
              </div>
            </div>

            {/* Pets */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ minWidth: 90 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button aria-label="Уменьшить животных" onClick={() => dec(setPets, pets)} className={styles.chip} style={{ padding: '6px 10px' }}>−</button>
                <div className={styles.countDisplay} style={{ minWidth: 36, textAlign: 'center', fontWeight: 600 }}>{pets}</div>
                <button aria-label="Увеличить животных" onClick={() => inc(setPets, pets)} className={styles.chip} style={{ padding: '6px 10px' }}>+</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter} style={{ marginTop: 12 }}>
          <div style={{ flex: 1 }} />
          <button className={styles.chip} onClick={handleClear}>Очистити</button>
          <button className={styles.chip} onClick={handleSave}>Зберегти</button>
        </div>
      </div>
    </div>
  );
}
