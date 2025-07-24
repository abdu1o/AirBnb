import Image from 'next/image'
import styles from '../styles/Home.module.css'  // ← вот сюда

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
  /* ... */
]

export default function CategoryChips() {
  return (
    <div className={styles.categoryChips}>
      {categories.map(cat => (
        <div key={cat.label} className={styles.chip}>
          <Image src={`/icons/${cat.icon}`} width={20} height={20} alt={cat.label}/>
          <span className={styles.chipLabel}>{cat.label}</span>
        </div>
      ))}
    </div>
  )
}
