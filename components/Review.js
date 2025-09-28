import React from 'react';
import styles from '../styles/Property.module.css';

export default function Review({ avatar, name, text }) {
  return (
    <article className={styles.reviewCard} aria-label={`Відгук від ${name}`}>
      <div className={styles.reviewHeader}>
        <img src={avatar} alt={`${name}`} className={styles.reviewAvatar} />
        <div>
          <div className={styles.reviewName}>{name}</div>
        </div>
      </div>

      <p className={styles.reviewText}>
        {text}
      </p>
    </article>
  );
}
