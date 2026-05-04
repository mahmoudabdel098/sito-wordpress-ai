# Link2Digital — Agenzia Creativa

Questo è il repository ufficiale della piattaforma **Link2Digital**, un'agenzia creativa specializzata in soluzioni web ad alte prestazioni, design cinematico e innovazione digitale.

## Architettura e Design

Il sito è costruito con le più recenti tecnologie per garantire velocità, SEO e un'esperienza utente premium:
- **Core**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **Design System**: Layout Cinematico (100vh), tipografia editoriale e interazioni fluide.
- **Interattività**: Magnetismo dei bottoni, effetti tilt personalizzati e preloader dinamico.

## Note Tecniche e Produzione

Durante il passaggio dall'ambiente di sviluppo locale a quello di produzione (Vercel), abbiamo ottimizzato la base di codice per soddisfare standard professionali rigorosi:

- **Rigore di TypeScript**: Abbiamo configurato lo *Strict Mode* per garantire l'assenza di bug nascosti. Tutte le interfacce, inclusi i metadati e i parametri dinamici, sono stati tipizzati correttamente per evitare errori di tipo "implicit any".
- **Indici Dinamici**: Le operazioni di accesso ai dati dinamici sono state rese sicure tramite l'implementazione di interfacce `Record` e mappature esplicite, garantendo la stabilità del codice durante l'esecuzione.
- **Ottimizzazione Immagini**: Utilizzo del componente `next/image` per massimizzare le performance e i punteggi Core Web Vitals.

## Sviluppo Locale

Per avviare il progetto in locale:

```bash
npm install
npm run dev
```

Il sito sarà disponibile su `http://localhost:3000`.

## Deployment

Il sito è configurato per il deployment continuo su **Vercel**, sincronizzato automaticamente con il branch `main` di questo repository.
