# Axon Live Transcription

System transkrypcji na żywo z rozpoznawaniem mówców i analizą AI w czasie rzeczywistym.

## Funkcjonalności

- 🎤 **Transkrypcja na żywo** - Automatyczna konwersja mowy na tekst w czasie rzeczywistym
- 👥 **Rozpoznawanie mówców** - Identyfikacja i rozróżnianie różnych osób w rozmowie
- 🧠 **Analiza AI** - Inteligentne przetwarzanie treści rozmów
- 📊 **Statystyki rozmowy** - Szczegółowe metryki uczestnictwa i aktywności

## Technologie

- Next.js 14
- React 18
- Web Speech API
- Supabase Edge Functions
- Deepgram API

## Instalacja

```bash
npm install
npm run dev
```

## Wdrożenie

Aplikacja jest przygotowana do wdrożenia na Vercel:

```bash
npm run build
```

## Konfiguracja

Utwórz plik `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
