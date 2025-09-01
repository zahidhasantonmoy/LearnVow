"use client";

import UserDashboard from '../components/UserDashboard/UserDashboard';
import styles from './library.module.css';

export default function Library() {
  return (
    <div className={styles.container}>
      <UserDashboard />
    </div>
  );
}