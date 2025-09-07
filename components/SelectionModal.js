// components/SelectionModal.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from '../styles/Modals.module.css';

/* date helpers */
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), daysInMonth(d.getFullYear(), d.getMonth())); }
function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const weekday = (first.getDay() + 6) % 7; // Monday = 0
  const total = daysInMonth(year, month);
  const prevMonthDays = weekday;
  const cells = [];
  const prevMonth = new Date(year, month - 1, 1);
  const prevTotal = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();
  for (let i = prevTotal - prevMonthDays + 1; i <= prevTotal; i++) cells.push({ date: new Date(year, month - 1, i), inCurrentMonth: false });
  for (let i = 1; i <= total; i++) cells.push({ date: new Date(year, month, i), inCurrentMonth: true });
  while (cells.length % 7 !== 0) {
    const nextIndex = cells.length - (weekday + total);
    cells.push({ date: new Date(year, month + 1, nextIndex + 1), inCurrentMonth: false });
  }
  return cells;
}
function isSameDay(a, b) { if (!a || !b) return false; return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function isBetween(day, start, end) { if (!start || !end) return false; const d = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime(); const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime(); const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime(); return d > s && d < e; }

export default function SelectionModal({ isOpen, onClose, initialRange, onSave }) {
  // stable today reference
  const today = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);

  // Allowed navigation bounds:
  // minLeft = startOfMonth(today)
  // maxLeft = such that rightMonth <= December(current year)
  const year = today.getFullYear();
  const endOfYearMonth = startOfMonth(new Date(year, 11, 1)); // Dec 1 of current year
  // prefer maxLeft so that rightMonth can be Dec: maxLeft = Nov 1
  const defaultMaxLeft = addMonths(endOfYearMonth, -1); // Nov 1
  // if today is already in December, allow left to be Dec start (so user still can select within December)
  const maxLeft = today.getMonth() === 11 ? startOfMonth(today) : defaultMaxLeft;
  const minLeft = startOfMonth(today);

  // initialize left/right months (clamped into [minLeft, maxLeft])
  const clampMonth = (d) => {
    if (d.getTime() < minLeft.getTime()) return new Date(minLeft);
    if (d.getTime() > maxLeft.getTime()) return new Date(maxLeft);
    return new Date(d);
  };

  const [leftMonth, setLeftMonth] = useState(() => clampMonth(startOfMonth(today)));
  const [rightMonth, setRightMonth] = useState(() => {
    const r = addMonths(clampMonth(startOfMonth(today)), 1);
    // if r beyond December, clamp to Dec
    if (r.getTime() > endOfYearMonth.getTime()) return new Date(endOfYearMonth);
    return r;
  });

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  // sync incoming initialRange when opened/updated
  useEffect(() => {
    if (!initialRange) { setStart(null); setEnd(null); return; }

    let s = initialRange.start ? new Date(initialRange.start) : null;
    let e = initialRange.end ? new Date(initialRange.end) : null;

    if (s) s = new Date(s.getFullYear(), s.getMonth(), s.getDate());
    if (e) e = new Date(e.getFullYear(), e.getMonth(), e.getDate());

    // clamp to today: don't allow initial values in the past
    if (s && s.getTime() < today.getTime()) s = new Date(today);
    if (e && e.getTime() < today.getTime()) e = new Date(today);

    if (s && e && e.getTime() < s.getTime()) e = new Date(s);

    setStart(s);
    setEnd(e);
  }, [initialRange, isOpen, today]);

  // whenever leftMonth changes, update rightMonth (try to keep right = left + 1, but clamp to Dec)
  useEffect(() => {
    const candidate = addMonths(leftMonth, 1);
    if (candidate.getTime() > endOfYearMonth.getTime()) {
      // if candidate beyond Dec, clamp to Dec
      setRightMonth(new Date(endOfYearMonth));
    } else {
      setRightMonth(candidate);
    }
  }, [leftMonth, endOfYearMonth]);

  if (!isOpen) return null;

  // navigation handlers
  const canPrev = leftMonth.getTime() > minLeft.getTime();
  const canNext = leftMonth.getTime() < maxLeft.getTime();

  const goPrev = () => {
    if (!canPrev) return;
    setLeftMonth(prev => {
      const next = addMonths(prev, -1);
      return clampMonth(next);
    });
  };
  const goNext = () => {
    if (!canNext) return;
    setLeftMonth(prev => {
      const next = addMonths(prev, 1);
      // clamp to maxLeft
      return next.getTime() > maxLeft.getTime() ? new Date(maxLeft) : next;
    });
  };

  const handleDayClick = (day) => {
    const dayMid = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    if (dayMid.getTime() < today.getTime()) return; // ignore past

    if (!start || (start && end)) {
      setStart(dayMid);
      setEnd(null);
    } else if (start && !end) {
      if (dayMid.getTime() < start.getTime()) {
        // if clicked before start, make it new start (clamped to today)
        const newStart = dayMid.getTime() < today.getTime() ? new Date(today) : dayMid;
        setStart(newStart);
      } else {
        setEnd(dayMid);
      }
    }
  };

  const saveAndClose = () => {
    if (start && end) onSave({ type: 'range', start: start.toISOString(), end: end.toISOString(), label: `${start.toLocaleDateString('uk-UA')} — ${end.toLocaleDateString('uk-UA')}` });
    else if (start && !end) onSave({ type: 'range', start: start.toISOString(), end: start.toISOString(), label: `${start.toLocaleDateString('uk-UA')}` });
    else onSave(null);
    onClose();
  };

  const clearSelection = () => { setStart(null); setEnd(null); };

  const renderMonth = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const cells = buildMonthGrid(year, month);

    return (
      <div className={styles.calendarMonth} key={`${year}-${month}`}>
        <div className={styles.monthTitle}>{monthDate.toLocaleString('uk-UA', { month: 'long', year: 'numeric' })}</div>
        <div className={styles.weekdays}>{['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(w => <div key={w}>{w}</div>)}</div>
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
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>

        <div className={styles.modalHeader} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className={styles.chip} onClick={goPrev} disabled={!canPrev} aria-label="Previous month">‹</button>
            <button className={styles.chip} onClick={goNext} disabled={!canNext} aria-label="Next month">›</button>
          </div>

          <div style={{ marginLeft: '8px', fontWeight: 600 }}>
            {leftMonth.toLocaleString('uk-UA', { month: 'short', year: 'numeric' })} — {rightMonth.toLocaleString('uk-UA', { month: 'short', year: 'numeric' })}
          </div>

          <div style={{ flex: 1 }} />

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

        <div className={styles.helperText} style={{ marginTop: 8 }}>
          {start ? `Від: ${start.toLocaleDateString('uk-UA')}` : 'Від: —'} — {end ? `До: ${end.toLocaleDateString('uk-UA')}` : 'До: —'}
        </div>
      </div>
    </div>
  );
}
