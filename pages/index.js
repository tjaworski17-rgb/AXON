import { useState } from 'react';
import Head from 'next/head';
import LiveTranscription from '../components/LiveTranscription';
import SpeakerManager from '../components/SpeakerManager';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [speakers, setSpeakers] = useState(new Set());
  const [transcripts, setTranscripts] = useState([]);
  const [speakerData, setSpeakerData] = useState({});

  const handleSpeakerUpdate = (data) => {
    setSpeakerData(prev => ({
      ...prev,
      [data.speakerId]: {
        name: data.name,
        role: data.role,
        color: data.color
      }
    }));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Axon Live Transcription - Real-time AI Assistant</title>
        <meta name="description" content="System transkrypcji na żywo z rozpoznawaniem mówców" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.highlight}>Axon</span> Live Transcription
          </h1>
          <p className={styles.description}>
            System transkrypcji na żywo z rozpoznawaniem mówców i analizą AI w czasie rzeczywistym
          </p>
        </div>

        <div className={styles.appContainer}>
          {/* Live Transcription Interface */}
          <div className={styles.transcriptionSection}>
            <LiveTranscription 
              onSpeakersUpdate={setSpeakers}
              onTranscriptsUpdate={setTranscripts}
            />
          </div>

          {/* Speaker Management Panel */}
          <div className={styles.speakerSection}>
            <SpeakerManager 
              speakers={speakers}
              transcripts={transcripts}
              onSpeakerUpdate={handleSpeakerUpdate}
            />
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>🎤 Transkrypcja na żywo</h3>
            <p>Automatyczna konwersja mowy na tekst w czasie rzeczywistym z wysoką dokładnością</p>
          </div>
          <div className={styles.feature}>
            <h3>👥 Rozpoznawanie mówców</h3>
            <p>Identyfikacja i rozróżnianie różnych osób w rozmowie z możliwością przypisania ról</p>
          </div>
          <div className={styles.feature}>
            <h3>🧠 Analiza AI</h3>
            <p>Inteligentne przetwarzanie treści rozmów z fokusem na automatyzację procesów</p>
          </div>
          <div className={styles.feature}>
            <h3>📊 Statystyki rozmowy</h3>
            <p>Szczegółowe metryki uczestnictwa, pewności transkrypcji i aktywności mówców</p>
          </div>
        </div>
      </main>
    </div>
  );
}
