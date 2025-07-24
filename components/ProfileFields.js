import styles from '../styles/Profile.module.css';

const fields = [
  'Навчальний заклад',
  'Місце проживання',
  'Десятиліття, коли я народився/-лась',
  'Найбільше захоплення',
  'Найбільші марні навички',
  'На що я витрачаю багато часу',
  'Моя професія',
  'Мови, якими я володію',
  'Улюблена пісня в старших класах',
  'Цікавий факт про мене',
  'Бажаний заголовок біографії',
  'Домашні тварини',
];

export default function ProfileFields() {
  return (
    <div className={styles.fieldGrid}>
      {fields.map(label => (
        <div key={label} className={styles.field}>
          <label className={styles.fieldLabel}>{label}</label>
          <input type="text" className={styles.fieldInput} />
        </div>
      ))}
    </div>
  );
}