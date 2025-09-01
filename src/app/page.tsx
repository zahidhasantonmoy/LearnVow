"use client";

import Hero from "./components/Hero/Hero";
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Hero />
    </div>
  );
}