import Header from '../components/Header';
import ProfileHeader from '../components/ProfileHeader';
import ProfileFields from '../components/ProfileFields';
import ProfileSection from '../components/ProfileSection';
import ProfileInterests from '../components/ProfileInterests';
import styles from '../styles/Profile.module.css';

export default function Profile() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <ProfileHeader />
        <div className={styles.sections}>
          <ProfileFields />
          <ProfileSection />
          <ProfileInterests />
        </div>
      </main>
    </div>
  );
}