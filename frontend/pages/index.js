import Head from 'next/head'
import PromptInterface from '../components/PromptInterface'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>VibeCode - AI Web App Generator</title>
        <meta name="description" content="Generate web applications from text descriptions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <PromptInterface />
      </main>
    </div>
  )
}
