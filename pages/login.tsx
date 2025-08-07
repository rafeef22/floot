import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { PasswordLoginForm } from '../components/PasswordLoginForm';
import styles from './login.module.css';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Login | CHAMP</title>
        <meta name="description" content="Log in to your CHAMP account to manage your profile and purchases." />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <Link to="/" className={styles.logo}>CHAMP</Link>
            <h1 className={styles.title}>Admin Access</h1>
            <p className={styles.subtitle}>
              Enter your credentials to manage the store.
            </p>
          </div>

          <PasswordLoginForm />

          <div className={styles.testCredentials}>
            <h3 className={styles.testTitle}>Test Credentials</h3>
            <p className={styles.testLine}>
              <strong>Email:</strong> <span>rafurafi1132@gmail.com</span>
            </p>
            <p className={styles.testLine}>
              <strong>Password:</strong> <span>Yacht-Spell-8-Ghost-Train</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;