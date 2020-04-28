import {useEffect} from 'react';
import {forceHTTPSInProduction} from '../hooks/forceHTTPSInProduction';
import Head from 'next/head'
import styles from './Layout.module.css'


export default function Layout({children}) {
  useEffect(forceHTTPSInProduction, []);

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