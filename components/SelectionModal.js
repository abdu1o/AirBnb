'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from '../styles/Modals.module.css';

/* date helpers */
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const weekday = (first.getDay() + 6) % 7; // Monday = 0
  const total = daysInMonth(year, month);
  const prevMonthDays = weekday;
  const cells = [];
  const prevMonth = new Date(year, month, 0);
  const prevTotal = prevMonth.getDate();
  for (let i = prevTotal - prevMonthDays + 1; i <= prevTotal; i++) {
    cells.push({ date: new Date(year, month - 1, i), inCurrentMonth: false });
  }
  for (let i = 1; i <= total; i++) {
    cells.push({ date: new Date(year, month, i), inCurrentMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const nextIndex = cells.length - (weekday + total);
    cells.push({ date: new Date(year, month + 1, nextIndex + 1), inCurrentMonth: false });
  }
  return cells;
}
function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}
function isBetween(day, start, end) {
  if (!start || !end) return false;
  const d = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return d > s && d < e;
}
function datesEqual(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.getTime() === b.getTime();
}

export default function SelectionModal({ isOpen, onClose, initialRange, onSave }) {
  const today = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);

  const [leftMonth, setLeftMonth] = useState(() => startOfMonth(today));
  const [rightMonth, setRightMonth] = useState(() => addMonths(startOfMonth(today), 1));

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  useEffect(() => {
    setRightMonth(addMonths(leftMonth, 1));
  }, [leftMonth]);

  useEffect(() => {
    if (!initialRange) {
      setStart(null);
      setEnd(null);
      return;
    }

    let s = initialRange.start ? new Date(initialRange.start) : null;
    let e = initialRange.end ? new Date(initialRange.end) : null;

    if (s) s = new Date(s.getFullYear(), s.getMonth(), s.getDate());
    if (e) e = new Date(e.getFullYear(), e.getMonth(), e.getDate());

    if (s && s.getTime() < today.getTime()) s = new Date(today);
    if (e && e.getTime() < today.getTime()) e = new Date(today);
    if (s && e && e.getTime() < s.getTime()) e = new Date(s);

    if (!datesEqual(s, start) || !datesEqual(e, end)) {
      setStart(s);
      setEnd(e);
    }
  }, [initialRange, today]);

  if (!isOpen) return null;

  const handleDayClick = (day) => {
    const dayMid = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    if (dayMid.getTime() < today.getTime()) return;

    if (!start || (start && end)) {
      setStart(dayMid);
      setEnd(null);
    } else if (start && !end) {
      if (dayMid.getTime() < start.getTime()) {
        const newStart = dayMid.getTime() < today.getTime() ? new Date(today) : dayMid;
        setStart(newStart);
      } else {
        setEnd(dayMid);
      }
    }
  };

  const saveAndClose = () => {
    if (start && end) {
      onSave({
        type: 'range',
        start: start.toISOString(),
        end: end.toISOString(),
        label: `${start.toLocaleDateString('uk-UA')} — ${end.toLocaleDateString('uk-UA')}`
      });
    } else if (start && !end) {
      onSave({
        type: 'range',
        start: start.toISOString(),
        end: start.toISOString(),
        label: `${start.toLocaleDateString('uk-UA')}`
      });
    } else {
      onSave(null);
    }
    onClose();
  };

  const clearSelection = (e) => {
    e.stopPropagation(); 
    setStart(null);
    setEnd(null);
    onSave(null);
  };

  const renderMonth = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const cells = buildMonthGrid(year, month);

    return (
      <div className={styles.calendarMonth} key={`${year}-${month}`}>
        <div className={styles.monthTitle}>
          {monthDate.toLocaleString('uk-UA', { month: 'long', year: 'numeric' })}
        </div>
        <div className={styles.weekdays}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(w => <div key={w}>{w}</div>)}
        </div>
        <div className={styles.daysGrid}>
          {cells.map((c, idx) => {
            const d = c.date;
            const inactiveByMonth = !c.inCurrentMonth;
            const dayMid = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const isPast = dayMid.getTime() < today.getTime();
            const isStart = isSameDay(d, start);
            const isEnd = isSameDay(d, end);
            const inRange = isBetween(d, start, end);

            const classes = [styles.day];
            if (inactiveByMonth) classes.push(styles.inactive);
            if (isPast) classes.push(styles.inactive);
            if (isStart && isEnd) classes.push(styles.selected);
            else if (isStart) classes.push(styles.rangeStart);
            else if (isEnd) classes.push(styles.rangeEnd);
            else if (inRange) classes.push(styles.inRange);

            const clickHandler = isPast ? undefined : () => handleDayClick(d);

            return (
              <div
                key={idx}
                className={classes.join(' ')}
                onClick={clickHandler}
                role={isPast ? undefined : 'button'}
                aria-disabled={isPast ? true : undefined}
              >
                {d.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>

        <div className={styles.modalHeader}>
          <button className={`${styles.tab} ${styles.active}`}>Дати</button>
        </div>

        <div className={styles.calendarContainer}>
          {renderMonth(leftMonth)}
          {renderMonth(rightMonth)}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.chip} onClick={clearSelection}>Очистити</button>
          <div style={{ flex: 1 }} />
          <button className={styles.chip} onClick={saveAndClose}>Зберегти</button>
        </div>

        <div className={styles.helperText}>
          {start ? `Від: ${start.toLocaleDateString('uk-UA')}` : 'Від: —'} — {end ? `До: ${end.toLocaleDateString('uk-UA')}` : 'До: —'}
        </div>
      </div>
    </div>
  );
}
