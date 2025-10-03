'use client';

import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useRef } from 'react';

const categories = [
  { label: 'Гарні краєвиди', icon: 'mountain.svg' },
  { label: 'Невеликі квартири', icon: 'home-small.svg' },
  { label: 'Великі квартири', icon: 'big-home.svg' },
  { label: 'Кімнати', icon: 'room.svg' },
  { label: 'Хостели', icon: 'hostel.svg' },
  { label: 'У центрі міста', icon: 'center.svg' },
  { label: 'Сільська місцевість', icon: 'village.svg' },
  { label: 'Від дизайнера', icon: 'design.svg' },
  { label: 'Біля моря', icon: 'sea.svg' },
  { label: 'Особняки', icon: 'mansion.svg' },
  { label: 'Легендарне', icon: 'legend.svg' },
];

export default function CategoryChips({ categoriesSelected, setCategoriesSelected, onFiltersChange }) {
  const containerRef = useRef(null);

  const toggleCategory = async (label) => {
    const newSelected = categoriesSelected.includes(label)
      ? categoriesSelected.filter(c => c !== label)
      : [...categoriesSelected, label];

    setCategoriesSelected(newSelected);

    try {
      const rawState = localStorage.getItem('hf_state');
      const state = rawState ? JSON.parse(rawState) : {};
      state.categories = newSelected;
      localStorage.setItem('hf_state', JSON.stringify(state));

      await fetch('/api/searchState', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
    } catch (e) {
      console.error(e);
    }

    onFiltersChange && onFiltersChange();
  };

  // keyboard support: Enter/Space toggle, arrows move focus
  const onKeyDown = (e, index, label) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCategory(label);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = containerRef.current?.querySelectorAll('[role="listitem"]')[index + 1];
      next?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = containerRef.current?.querySelectorAll('[role="listitem"]')[index - 1];
      prev?.focus();
    }
  };

  return (
    <div
      className={styles.categoryChips}
      ref={containerRef}
      role="list"
      aria-label="Категорії"
    >
      {categories.map((cat, i) => (
        <div
          key={cat.label}
          role="listitem"
          tabIndex={0}
          className={`${styles.chip} ${categoriesSelected.includes(cat.label) ? styles.activeChip : ''}`}
          onClick={() => toggleCategory(cat.label)}
          onKeyDown={(e) => onKeyDown(e, i, cat.label)}
          aria-pressed={categoriesSelected.includes(cat.label)}
        >
          <Image src={`/icons/${cat.icon}`} width={30} height={30} alt={cat.label} />
          <span className={styles.chipLabel}>{cat.label}</span>
        </div>
      ))}
    </div>
  );
}
