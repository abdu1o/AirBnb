'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

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

export default function CategoryChips({ categoriesSelected, setCategoriesSelected }) {
  const toggleCategory = (label) => {
    const newSelected = categoriesSelected.includes(label)
      ? categoriesSelected.filter(c => c !== label)
      : [...categoriesSelected, label];

    setCategoriesSelected(newSelected);
  };

  return (
    <div className={styles.categoryChips}>
      {categories.map(cat => (
        <div
          key={cat.label}
          className={`${styles.chip} ${categoriesSelected.includes(cat.label) ? styles.activeChip : ''}`}
          onClick={() => {
            toggleCategory(cat.label);
            window.location.reload();
          }}
        >
          <Image src={`/icons/${cat.icon}`} width={20} height={20} alt={cat.label}/>
          <span className={styles.chipLabel}>{cat.label}</span>
        </div>
      ))}
    </div>
  );
}
