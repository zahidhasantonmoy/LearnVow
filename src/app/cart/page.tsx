"use client";

import ShoppingCart from '../components/ShoppingCart/ShoppingCart';
import styles from './cart.module.css';

export default function Cart() {
  return (
    <div className={styles.container}>
      <ShoppingCart />
    </div>
  );
}