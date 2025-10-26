'use client';

import React, { useState } from 'react';
import styles from '../styles/Modals.module.css';
import regStyles from '../styles/Register.module.css';
import { FaGoogle } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

// PhoneAuthModal
export function PhoneAuthModal({ isOpen, onClose, onSubmit, title = 'Підтвердження номера' }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = (e) => {
    e && e.preventDefault();
    if (!phone || !/^\+?[0-9]{6,15}$/.test(phone)) {
      setError('Введіть коректний номер (наприклад: +380501234567)');
      return;
    }
    setError('');
    console.log(`${title} payload:`, { phone });
    onSubmit && onSubmit({ phone });
    setPhone('');
    onClose && onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div className={regStyles.regmodal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={() => onClose && onClose()}>✕</button>
        <h3 style={{ textAlign: 'center', margin: '8px 0 14px' }}>{title}</h3>

        <form onSubmit={handleConfirm}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Номер телефону</div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+380501234567"
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
            />
            {error && <div style={{ color: 'crimson', fontSize: 12 }}>{error}</div>}
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button type="button" className={styles.chip} onClick={() => onClose && onClose()}>Відмінити</button>
            <button className={styles.chip} type="submit">Підтвердити</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// RegisterPhoneModal (modal-styled, uses regStyles)
export function RegisterPhoneModal({ isOpen, onClose, onContinue }) {
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validatePhone = (p) => /^\+?[0-9]{6,15}$/.test(p);

  const handleContinue = (e) => {
    e && e.preventDefault();
    if (!validatePhone(phone)) {
      setError('Введіть коректний номер (наприклад: +380501234567)');
      return;
    }
    setError('');
    const payload = { phone, displayName, dob };
    console.log('Register by phone payload:', payload);
    onContinue && onContinue(payload);
    onClose && onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div className={`${regStyles.regmodal} ${regStyles.card}`} onMouseDown={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <button className={styles.closeButton} onClick={() => onClose && onClose()}>✕</button>
        <h3 style={{ textAlign: 'center', margin: '8px 0 14px' }}>Реєстрація по телефону</h3>

        <form onSubmit={handleContinue} className={regStyles.form}>
          <label className={regStyles.label}>
            Номер телефону
            <input
              className={regStyles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+380501234567"
              inputMode="tel"
              aria-label="Номер телефону"
            />
          </label>

          <label className={regStyles.label}>
            Ім&apos;я для відображення (необов&apos;язково)
            <input
              className={regStyles.input}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Як вас бачать інші"
            />
          </label>

          <label className={regStyles.label}>
            Дата народження
            <input
              className={regStyles.input}
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </label>

          {error && <div className={regStyles.error}>{error}</div>}

          <div className={regStyles.actions}>
            <button type="submit" className={regStyles.primaryBtn}>Продолжить</button>
          </div>
        </form>

        <div className={regStyles.sepRow}>
          <span className={regStyles.sepLine} />
          <span className={regStyles.sepText}>або</span>
          <span className={regStyles.sepLine} />
        </div>

        <div className={regStyles.socials} style={{ marginTop: 8 }}>
          <button type="button" className={regStyles.outlineBtn} onClick={handleGoogleRegister}>
              <span className={regStyles.iconWrap}>
                <FaGoogle size={15}/>
              </span>
              <span>З допомогою Google</span>
            </button>

          <button type="button" className={regStyles.outlineBtn} onClick={() => { console.log('Open phone login flow (frontend only)'); onClose && onClose(); onOpenLogin && onOpenLogin(); }}>
            <span className={regStyles.iconWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path fill="currentColor" d="M6.6 10.8a15.07 15.07 0 006.6 6.6l1.9-1.9a1 1 0 01.9-.3c1 .3 2 .5 2.9.5a1 1 0 011 1v3.1a1 1 0 01-1 1C10.1 22 2 13.9 2 3.9a1 1 0 011-1H6a1 1 0 011 1c0 1 .1 1.9.3 2.9a1 1 0 01-.3.9l-1.9 1.9z"/>
              </svg>
            </span>
            <span>Увійти по телефону</span>
          </button>
        </div>

        <div className={regStyles.smallNote} style={{ marginTop: 12 }}>
          Уже есть аккаунт? <a href="#" onClick={(e) => { e.preventDefault(); onClose && onClose(); }}>Войти</a>
        </div>
      </div>
    </div>
  );
}

// RegisterModal (updated layout: primary register button centered, blue; below it - login blue button; then 'или' and social/phone buttons)
export function RegisterModal({ isOpen, onClose, onOpenLogin, onOpenPhone }) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // ✅ Валідація
  const validate = () => {
    const err = {};

    if (!email) err.email = 'Введіть email';
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) err.email = 'Невірний формат email';

    if (!displayName) err.displayName = 'Введіть ім’я для відображення';

    if (!dob) {
      err.dob = 'Введіть дату народження';
    } else {
      // ПРоверка на 18+
      const birthDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const isBeforeBirthday =
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
      const actualAge = isBeforeBirthday ? age - 1 : age;

      if (actualAge < 18) {
        err.dob = 'Вам має бути щонайменше 18 років';
      }
    }

    if (!phone || !/^\+?[0-9]{6,15}$/.test(phone)) err.phone = 'Введіть коректний номер телефону';

    if (!password) err.password = 'Введіть пароль';
    if (password && password.length < 6) err.password = 'Пароль має бути щонайменше 6 символів';

    if (password !== confirm) err.confirm = 'Паролі не співпадають';

    return err;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setIsSubmitting(true);

    const payload = { email, displayName, dob, phone, password };

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || 'Помилка при створенні користувача');
      } else {
        toast.success('Реєстрація успішна!');

        setEmail('');
        setDisplayName('');
        setDob('');
        setPhone('');
        setPassword('');
        setConfirm('');

        setTimeout(() => {
          onClose && onClose();
          onOpenLogin && onOpenLogin();
        }, 1000);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Помилка зʼєднання з сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = () => {
    toast('🔄 Реєстрація через Google...');
    setTimeout(() => {
      toast.success('Успішний вхід через Google!');
      onClose && onClose();
      onOpenPhone && onOpenPhone();
    }, 600);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div
        className={styles.overlay}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose && onClose();
        }}
      >
        <div className={regStyles.regmodal} onMouseDown={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={() => onClose && onClose()}>
            ✕
          </button>

          <h3 style={{ textAlign: 'center', margin: '8px 0 14px' }}>Реєстрація</h3>

          <form onSubmit={onSubmit}>
            {/* Email */}
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 13, marginBottom: 6 }}>Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                style={inputStyle}
              />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </label>

            {/* Display Name */}
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 13, marginBottom: 6 }}>Ім’я для відображення</div>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Як вас бачать інші"
                style={inputStyle}
              />
              {errors.displayName && <div style={errorStyle}>{errors.displayName}</div>}
            </label>

            {/* Date of birth */}
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 13, marginBottom: 6 }}>Дата народження</div>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                style={inputStyle}
              />
              {errors.dob && <div style={errorStyle}>{errors.dob}</div>}
            </label>

            {/* Phone */}
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 13, marginBottom: 6 }}>Номер телефону</div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380501234567"
                style={inputStyle}
              />
              {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
            </label>

            {/* Password */}
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 13, marginBottom: 6 }}>Пароль</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Щонайменше 6 символів"
                style={inputStyle}
              />
              {errors.password && <div style={errorStyle}>{errors.password}</div>}
            </label>

            {/* Confirm Password */}
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 13, marginBottom: 6 }}>Підтвердіть пароль</div>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Повторіть пароль"
                style={inputStyle}
              />
              {errors.confirm && <div style={errorStyle}>{errors.confirm}</div>}
            </label>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                alignItems: 'center',
                marginTop: 12,
              }}
            >
              <button
                type="submit"
                className={regStyles.outlineBtn}
                style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
              </button>

              <button
                type="button"
                className={regStyles.outlineBtn}
                style={{ width: '100%', background: '#6b5e4b', color: '#fff' }}
                onClick={() => {
                  onClose && onClose();
                  onOpenLogin && onOpenLogin();
                }}
              >
                Увійти
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '16px 0',
              }}
            >
              <div style={{ flex: 1, height: 1, background: '#ddd' }}></div>
              <span style={{ margin: '0 8px', fontSize: 12, color: '#777' }}>або</span>
              <div style={{ flex: 1, height: 1, background: '#ddd' }}></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              className={regStyles.outlineBtn}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <FaGoogle />
              Продовжити з Google
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid rgba(0,0,0,0.12)',
};

const errorStyle = { color: 'crimson', fontSize: 12 };

// LoginModal
export function LoginModal({ isOpen, onClose, onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!login || !password) {
      setError('Введіть логін і пароль');
      return;
    }
    setError('');
    console.log('Login payload:', { login, password });
    onClose && onClose();
    onLogin && onLogin({ login });
    setLogin('');
    setPassword('');
  };

  return (
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div className={regStyles.regmodal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={() => onClose && onClose()}>✕</button>
        <h3 style={{ textAlign: 'center', margin: '8px 0 14px' }}>Увійти</h3>

        <form onSubmit={onSubmit}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Логін (email або номер телефону)</div>
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Ваш логін"
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 8 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Пароль</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ваш пароль"
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
            />
          </label>

          {error && <div style={{ color: 'crimson', fontSize: 13, marginBottom: 8 }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button type="button" className={styles.chip} onClick={() => onClose && onClose()}>Скасувати</button>
            <button className={styles.chip} type="submit">Увійти</button>
          </div>
        </form>

      </div>
    </div>
  );
}

// Demo parent
export default function RegisterLoginDemo() {
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isPhoneOpen, setPhoneOpen] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className={styles.chip} onClick={() => setRegisterOpen(true)}>Відкрити реєстрацію</button>
        <button className={styles.chip} onClick={() => setLoginOpen(true)}>Відкрити логін</button>
      </div>

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
        onOpenLogin={() => { setRegisterOpen(false); setLoginOpen(true); }}
        onOpenPhone={() => { setPhoneOpen(true); }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={(info) => { console.log('Logged in (demo):', info); }}
      />

      <RegisterPhoneModal
        isOpen={isPhoneOpen}
        onClose={() => setPhoneOpen(false)}
        onContinue={(payload) => { console.log('Phone registration flow payload:', payload); setPhoneOpen(false); }}
      />

      <PhoneAuthModal
        isOpen={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    </div>
  );
}
