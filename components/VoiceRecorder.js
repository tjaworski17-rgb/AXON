import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { callEdgeFunction } from '../lib/supabase';

export default function VoiceRecorder({ onTranscription, onAIResponse }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('Microphone permission granted');
      })
      .catch((err) => {
        console.error('Microphone permission denied:', err);
        setError('Brak dostępu do mikrofonu. Sprawdź uprawnienia przeglądarki.');
      });
  }, []);

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Nie można rozpocząć nagrywania. Sprawdź uprawnienia mikrofonu.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];
        
        try {
          const transcriptionResult = await callEdgeFunction('deepgram-transcribe', {
            audioData: base64Audio
          });

          if (!transcriptionResult.success) {
            throw new Error(transcriptionResult.error || 'Błąd transkrypcji');
          }

          const transcript = transcriptionResult.transcription;
          setTranscription(transcript);
          
          if (onTranscription) {
            onTranscription(transcript);
          }

          const aiResult = await callEdgeFunction('ai-brain', {
            transcription: transcript,
            sessionId: generateSessionId(),
            context: 'Voice input from Axon interface'
          });

          if (!aiResult.success) {
            throw new Error(aiResult.error || 'Błąd przetwarzania AI');
          }

          if (onAIResponse) {
            onAIResponse({
              transcription: transcript,
              aiResponse: aiResult.response,
              confidence: transcriptionResult.confidence,
              sessionId: aiResult.sessionId
            });
          }

        } catch (err) {
          console.error('Processing error:', err);
          setError(`Błąd przetwarzania: ${err.message}`);
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (err) {
      console.error('Audio processing error:', err);
      setError(`Błąd przetwarzania audio: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setTranscription('');
    setError('');
  };

  return (
    <div className="voice-recorder">
      <div className="recorder-controls">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            className="record-button"
            disabled={isProcessing}
          >
            <Mic size={24} />
            <span>Rozpocznij nagrywanie</span>
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="stop-button recording"
          >
            <MicOff size={24} />
            <span>Zatrzymaj nagrywanie</span>
          </button>
        )}

        {audioBlob && !isProcessing && (
          <div className="audio-controls">
            <button onClick={processAudio} className="process-button">
              <Send size={20} />
              <span>Przetwórz nagranie</span>
            </button>
            <button onClick={clearRecording} className="clear-button">
              Usuń nagranie
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="processing-indicator">
            <Loader2 size={24} className="spinner" />
            <span>Przetwarzanie...</span>
          </div>
        )}
      </div>

      {transcription && (
        <div className="transcription-result">
          <h3>Transkrypcja:</h3>
          <p>{transcription}</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <style jsx>{`
        .voice-recorder {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .recorder-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .record-button, .stop-button, .process-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .record-button {
          background: #10b981;
          color: white;
        }

        .record-button:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .stop-button {
          background: #ef4444;
          color: white;
        }

        .stop-button.recording {
          animation: pulse 2s infinite;
        }

        .process-button {
          background: #3b82f6;
          color: white;
        }

        .process-button:hover {
          background: #2563eb;
        }

        .clear-button {
          padding: 0.5rem 1rem;
          background: #6b7280;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .clear-button:hover {
          background: #4b5563;
        }

        .audio-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .processing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-weight: 500;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        .transcription-result {
          background: #f3f4f6;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .transcription-result h3 {
          margin: 0 0 0.5rem 0;
          color: #374151;
          font-size: 1.1rem;
        }

        .transcription-result p {
          margin: 0;
          color: #1f2937;
          line-height: 1.6;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }

        .error-message p {
          margin: 0;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .voice-recorder {
            padding: 1rem;
            margin: 1rem;
          }
          
          .record-button, .stop-button, .process-button {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
