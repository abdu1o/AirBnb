import { useState, useEffect } from "react";
import styles from "../styles/Profile.module.css";
import toast from "react-hot-toast";

export default function ProfileFields() {
  const [user, setUser] = useState({ email: "", phone: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser({ email: data.user.email, phone: data.user.phone });
        }
      } catch (err) {
        console.error(err);
        toast.error("Помилка при отриманні даних користувача");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};

    if (!user.email) {
      errors.email = "Email не може бути порожнім";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.email = "Невірний формат email";
    }

    if (!user.phone) {
      errors.phone = "Телефон не може бути порожнім";
    } else if (!/^\+?[0-9]{6,15}$/.test(user.phone)) {
      errors.phone = "Невірний формат телефону";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((msg) => toast.error(msg));
      return;
    }

    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Помилка при оновленні профілю");
        return;
      }

      toast.success(data.message || "Профіль оновлено!");
      setUser({ email: data.user.email, phone: data.user.phone });
    } catch (err) {
      console.error(err);
      toast.error("Помилка з'єднання з сервером");
    }
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Email</label>
        <input
          type="email"
          name="email"
          className={styles.fieldInput}
          value={user.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>Телефон</label>
        <input
          type="text"
          name="phone"
          className={styles.fieldInput}
          value={user.phone}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className={styles.fieldInput}
        style={{ textAlign: "center", cursor: "pointer", background: "#f5f5f5ff", border: "1px solid #ccc" }}
      >
        Зберегти зміни
      </button>
    </form>
  );
}
