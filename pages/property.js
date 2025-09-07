// pages/property.js
import Header from '../components/Header';
import Property from '../components/Property';
import styles from '../styles/Property.module.css';
import PropertyFooter from "../components/PropertyFooter";

export default function PropertyPage() {
  return (
    <div className={styles.page}>
      <Header />
      <Property />
      <PropertyFooter />
    </div>
  );
}
