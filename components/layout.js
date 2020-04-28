import Head from 'next/head'
import styles from './layout.module.css'

export default function Layout({children}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>scribble</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </div>
  );
}