'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from '../styles/Modals.module.css';

/* helper date utilities */
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), daysInMonth(d.getFullYear(), d.getMonth())); }
function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const weekday = (first.getDay() + 6) % 7; // Monday=0
  const total = daysInMonth(year, month);
  const prevMonthDays = weekday;
  const cells = [];
  const prevMonth = new Date(year, month, 0);
  const prevTotal = prevMonth.getDate();
  for (let i = prevTotal - prevMonthDays + 1; i <= prevTotal; i++) cells.push({ date: new Date(year, month - 1, i), inCurrentMonth: false });
  for (let i = 1; i <= total; i++) cells.push({ date: new Date(year, month, i), inCurrentMonth: true });
  // append next month days until divisible by 7
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, nextDay++), inCurrentMonth: false });
  }
  return cells;
}
function isSameDay(a, b) { if (!a || !b) return false; return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function isBetween(day, start, end) { if (!start || !end) return false; const d = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime(); const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime(); const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime(); return d > s && d < e; }

export default function Modal({ isOpen, onClose, initialRange, onSave }) {
  const today = new Date();
  const [leftMonth, setLeftMonth] = useState(startOfMonth(today));
  const [rightMonth, setRightMonth] = useState(addMonths(startOfMonth(today), 1));

  // dates tab
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  // months tab (range)
  const [monthsStart, setMonthsStart] = useState(null);
  const [monthsEnd, setMonthsEnd] = useState(null);

  // flex tab
  const [flexType, setFlexType] = useState('week');
  const [flexMonth, setFlexMonth] = useState(null);

  // helper to map external saved type -> internal tab name
  const mapTypeToTab = (t) => (t === 'range' ? 'dates' : (t || 'dates'));

  // active tab: ensure 'range' maps to 'dates'
  const [activeTab, setActiveTab] = useState(mapTypeToTab(initialRange?.type));

  // Sync initialRange into state on mount / when it changes
  useEffect(() => {
    if (!initialRange) {
      setStart(null); setEnd(null); setMonthsStart(null); setMonthsEnd(null); setFlexMonth(null); setFlexType('week');
      setActiveTab('dates');
      return;
    }

    if (initialRange.type === 'range') {
      setStart(initialRange.start ? new Date(initialRange.start) : null);
      setEnd(initialRange.end ? new Date(initialRange.end) : null);
    } else if (initialRange.type === 'months') {
      setMonthsStart(initialRange.start ? new Date(initialRange.start) : null);
      setMonthsEnd(initialRange.end ? new Date(initialRange.end) : null);
    } else if (initialRange.type === 'flex') {
      setFlexType(initialRange.flexType || 'week');
      setFlexMonth(initialRange.month ? new Date(initialRange.month) : null);
    }
    setActiveTab(mapTypeToTab(initialRange.type));
  }, [initialRange]);

  useEffect(() => {
    setRightMonth(addMonths(leftMonth, 1));
  }, [leftMonth]);

  const monthsList = useMemo(() => {
    const res = [];
    const cur = new Date(today.getFullYear(), today.getMonth(), 1);
    for (let i = 0; i < 12; i++) res.push(addMonths(cur, i));
    return res;
  }, [today]);

  // close on ESC for better UX
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDayClick = (day) => {
    const clicked = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    if (!start || (start && end)) { setStart(clicked); setEnd(null); }
    else if (start && !end) { if (clicked.getTime() < start.getTime()) setStart(clicked); else setEnd(clicked); }
  };

  const handleMonthClick = (monthDate) => {
    const m = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const disabled = m.getFullYear() < today.getFullYear() || (m.getFullYear() === today.getFullYear() && m.getMonth() < today.getMonth());
    if (disabled) return;

    if (!monthsStart || (monthsStart && monthsEnd)) { setMonthsStart(m); setMonthsEnd(null); return; }
    if (monthsStart && !monthsEnd) {
      if (m.getTime() < monthsStart.getTime()) setMonthsStart(m);
      else setMonthsEnd(m);
    }
  };

  const handleFlexTypeClick = (t) => setFlexType(t);
  const handleFlexMonthClick = (m) => {
    const mm = new Date(m.getFullYear(), m.getMonth(), 1);
    const disabled = mm.getFullYear() < today.getFullYear() || (mm.getFullYear() === today.getFullYear() && mm.getMonth() < today.getMonth());
    if (disabled) return;
    if (flexMonth && flexMonth.getFullYear() === mm.getFullYear() && flexMonth.getMonth() === mm.getMonth()) setFlexMonth(null);
    else setFlexMonth(mm);
  };

  const formatMonthTitle = (d) => d.toLocaleString('uk-UA', { month: 'long', year: 'numeric' });

  const saveAndClose = () => {
    if (activeTab === 'months') {
      if (monthsStart && monthsEnd) {
        const s = new Date(monthsStart.getFullYear(), monthsStart.getMonth(), 1);
        const e = endOfMonth(monthsEnd);
        onSave({ type: 'months', start: s.toISOString(), end: e.toISOString(), label: `${monthsStart.toLocaleString('uk-UA', { month: 'long' })} — ${monthsEnd.toLocaleString('uk-UA', { month: 'long' })}` });
      } else if (monthsStart && !monthsEnd) {
        const s = new Date(monthsStart.getFullYear(), monthsStart.getMonth(), 1);
        const e = endOfMonth(monthsStart);
        onSave({ type: 'months', start: s.toISOString(), end: e.toISOString(), label: `${monthsStart.toLocaleString('uk-UA', { month: 'long' })}` });
      } else onSave(null);
    } else if (activeTab === 'flex') {
      const labelMonth = flexMonth ? flexMonth.toLocaleString('uk-UA', { month: 'long' }) : '';
      const typeLabel = flexType === 'day' ? 'День' : flexType === 'week' ? 'Тиждень' : 'Місяць';
      onSave({ type: 'flex', flexType, month: flexMonth ? flexMonth.toISOString() : null, label: `${typeLabel}${labelMonth ? ', ' + labelMonth : ''}` });
    } else {
      // activeTab === 'dates' (internal) -> save external type 'range' (to keep compatibility)
      if (start && end) onSave({ type: 'range', start: start.toISOString(), end: end.toISOString(), label: `${start.toLocaleDateString('uk-UA')} — ${end.toLocaleDateString('uk-UA')}` });
      else if (start && !end) onSave({ type: 'range', start: start.toISOString(), end: start.toISOString(), label: `${start.toLocaleDateString('uk-UA')}` });
      else onSave(null);
    }
    onClose();
  };

  const preset = (days) => { const s = new Date(); const e = new Date(); e.setDate(e.getDate() + days); setStart(new Date(s.setHours(0,0,0,0))); setEnd(new Date(e.setHours(0,0,0,0))); };
  const clearSelection = () => { setStart(null); setEnd(null); setMonthsStart(null); setMonthsEnd(null); setFlexMonth(null); };

  const renderMonth = (monthDate) => {
    const year = monthDate.getFullYear(); const month = monthDate.getMonth(); const cells = buildMonthGrid(year, month);
    return (
      <div className={styles.calendarMonth} key={`${year}-${month}`}>
        <div className={styles.monthTitle}>{formatMonthTitle(monthDate)}</div>
        <div className={styles.weekdays}>{['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(w => <div key={w}>{w}</div>)}</div>
        <div className={styles.daysGrid}>
          {cells.map((c, idx) => {
            const d = c.date; const inactive = !c.inCurrentMonth;
            const isStart = isSameDay(d, start); const isEnd = isSameDay(d, end); const inRange = isBetween(d, start, end);
            const classes = [styles.day]; if (inactive) classes.push(styles.inactive); if (isStart && isEnd) classes.push(styles.selected); else if (isStart) classes.push(styles.rangeStart); else if (isEnd) classes.push(styles.rangeEnd); else if (inRange) classes.push(styles.inRange);
            return <div key={idx} className={classes.join(' ')} onClick={() => handleDayClick(d)}>{d.getDate()}</div>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>

        <div className={styles.modalHeader}>
          <button className={`${styles.tab} ${activeTab === 'dates' ? styles.active : ''}`} onClick={() => setActiveTab('dates')}>Дати</button>
          <button className={`${styles.tab} ${activeTab === 'months' ? styles.active : ''}`} onClick={() => setActiveTab('months')}>Місяці</button>
          <button className={`${styles.tab} ${activeTab === 'flex' ? styles.active : ''}`} onClick={() => setActiveTab('flex')}>Гнучкі правила</button>
        </div>

        {activeTab === 'dates' && (
          <>
            <div className={styles.calendarContainer}>{renderMonth(leftMonth)}{renderMonth(rightMonth)}</div>
            <div className={styles.modalFooter}>
              <button className={styles.chip} onClick={() => preset(0)}>Точні дати</button>
              <button className={`${styles.chip} ${styles.secondary}`} onClick={() => preset(1)}>+/- 1 день</button>
              <button className={`${styles.chip} ${styles.secondary}`} onClick={() => preset(2)}>+/- 2 дні</button>
              <button className={`${styles.chip} ${styles.secondary}`} onClick={() => preset(3)}>+/- 3 дні</button>
              <button className={`${styles.chip} ${styles.secondary}`} onClick={() => preset(7)}>+/- 7 днів</button>
              <div style={{ flex: 1 }} />
              <button className={styles.chip} onClick={clearSelection}>Очистити</button>
              <button className={styles.chip} onClick={saveAndClose}>Зберегти</button>
            </div>
            <div className={styles.helperText}>{start ? `Від: ${start.toLocaleDateString('uk-UA')}` : 'Від: —'} — {end ? `До: ${end.toLocaleDateString('uk-UA')}` : 'До: —'}</div>
          </>
        )}

        {activeTab === 'months' && (
          <div style={{ padding: 8 }}>
            <div className={styles.monthsGrid}>
              {monthsList.map((m, idx) => {
                const disabled = m.getFullYear() < today.getFullYear() || (m.getFullYear() === today.getFullYear() && m.getMonth() < today.getMonth());
                const isCurrent = m.getFullYear() === today.getFullYear() && m.getMonth() === today.getMonth();
                const startMonth = monthsStart ? new Date(monthsStart.getFullYear(), monthsStart.getMonth(), 1) : null;
                const endMonth = monthsEnd ? new Date(monthsEnd.getFullYear(), monthsEnd.getMonth(), 1) : null;
                const isRangeStart = startMonth && m.getFullYear() === startMonth.getFullYear() && m.getMonth() === startMonth.getMonth();
                const isRangeEnd = endMonth && m.getFullYear() === endMonth.getFullYear() && m.getMonth() === endMonth.getMonth();
                let inRange = false;
                if (startMonth && endMonth) {
                  const mTime = new Date(m.getFullYear(), m.getMonth(), 1).getTime();
                  inRange = mTime > startMonth.getTime() && mTime < endMonth.getTime();
                }
                const cls = [styles.monthItem];
                if (disabled) cls.push(styles.monthDisabled);
                if (isCurrent) cls.push(styles.monthCurrent);
                if (isRangeStart) cls.push(styles.monthRangeStart);
                if (isRangeEnd) cls.push(styles.monthRangeEnd);
                if (inRange) cls.push(styles.monthInRange);
                return (
                  <button key={idx} className={cls.join(' ')} onClick={() => handleMonthClick(m)} disabled={disabled}>
                    <div className={styles.monthName}>{m.toLocaleString('uk-UA', { month: 'short' })}</div>
                    <div className={styles.monthYear}>{m.getFullYear()}</div>
                  </button>
                );
              })}
            </div>
            <div className={styles.modalFooter}>
              <div style={{ flex: 1 }} />
              <button className={styles.chip} onClick={clearSelection}>Очистити</button>
              <button className={styles.chip} onClick={saveAndClose}>Зберегти</button>
            </div>
          </div>
        )}

        {activeTab === 'flex' && (
          <div style={{ padding: 12 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <button className={`${styles.chip} ${flexType === 'day' ? styles.monthSelected : ''}`} onClick={() => handleFlexTypeClick('day')}>День</button>
              <button className={`${styles.chip} ${flexType === 'week' ? styles.monthSelected : ''}`} onClick={() => handleFlexTypeClick('week')}>Тиждень</button>
              <button className={`${styles.chip} ${flexType === 'month' ? styles.monthSelected : ''}`} onClick={() => handleFlexTypeClick('month')}>Місяць</button>
            </div>

            <div style={{ marginBottom: 10, color: '#666' }}>Оберіть місяць (наступні 6):</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {monthsList.slice(0, 6).map((m, idx) => {
                const disabled = m.getFullYear() < today.getFullYear() || (m.getFullYear() === today.getFullYear() && m.getMonth() < today.getMonth());
                const selected = flexMonth && flexMonth.getFullYear() === m.getFullYear() && flexMonth.getMonth() === m.getMonth();
                const cls = [styles.chip];
                if (selected) cls.push(styles.monthSelected);
                return (
                  <button key={idx} className={cls.join(' ')} onClick={() => handleFlexMonthClick(m)} disabled={disabled}>
                    {m.toLocaleString('uk-UA', { month: 'long' })}
                  </button>
                );
              })}
            </div>

            <div className={styles.modalFooter}>
              <div style={{ flex: 1 }} />
              <button className={styles.chip} onClick={clearSelection}>Очистити</button>
              <button className={styles.chip} onClick={saveAndClose}>Зберегти</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
