"use client";

import Checkout from '../components/Checkout/Checkout';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  return (
    <div className={styles.container}>
      <Checkout />
    </div>
  );
}