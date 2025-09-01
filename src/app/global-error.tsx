'use client';

import styles from './global-error.module.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className={styles.container}>
          <h2>Something went wrong!</h2>
          <p>{error.message}</p>
          <button onClick={() => reset()} className={styles.button}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}