// ============================================================================
// LINK2DIGITAL — Social Studio content engine (v18 — lead-gen first)
// Goal: acquire clients who want a NEW website, a REDESIGN, or their FIRST site.
// All content is category-agnostic on purpose.
// ============================================================================

export type PostStatus = 'DRAFT' | 'READY' | 'PUBLISHED';
export type PostFormat = 'POST' | 'STORY' | 'PORTRAIT' | 'REEL_COVER';

export type Pillar =
  | 'PROBLEM_SOLUTION'
  | 'AUTHORITY'
  | 'HOW_TO'
  | 'MISTAKE'
  | 'CASE_STUDY'
  | 'EDUCATIONAL'
  | 'VIRAL_HOOK'
  | 'TESTIMONIAL'
  | 'OFFER';

// Editorial angle — the "hook" of the post. Used as a soft filter in the UI.
export type Angle = 'NO_SITE' | 'OLD_SITE' | 'SLOW_SITE' | 'NO_CONVERSION' | 'BRAND_PERCEPTION' | 'INVISIBLE' | 'DIY_BUILDER';

export const ANGLES: { id: Angle; label: string; emoji: string }[] = [
  { id: 'NO_SITE',          label: 'Non hai un sito',           emoji: '🚫' },
  { id: 'OLD_SITE',         label: 'Sito vecchio / da rifare',  emoji: '🪦' },
  { id: 'SLOW_SITE',        label: 'Sito lento',                emoji: '🐢' },
  { id: 'NO_CONVERSION',    label: 'Sito che non converte',     emoji: '📉' },
  { id: 'BRAND_PERCEPTION', label: 'Brand percepito male',      emoji: '😬' },
  { id: 'INVISIBLE',        label: 'Invisibile online',         emoji: '👻' },
  { id: 'DIY_BUILDER',      label: 'Wix / Weebly / fai-da-te',  emoji: '🧱' },
];

export interface Slide {
  title: string;
  text: string;
  cta?: string;
  tag?: string;
  tag2?: string;
  subTitle?: string;
  logoText?: string;
  number?: string;
  pageLabel?: string;
}

export interface Post {
  id: number;
  day: string;
  angle: Angle;
  angleLabel: string;
  pillarName: Pillar;
  styleVariant: number;
  format: PostFormat;
  slides: Slide[];
  caption: string;
  hashtags: string;
  status: PostStatus;
}

// ============================================================================
// CONTENT POOL — universal lead-gen titles grouped by angle + pillar
// ============================================================================
type AngleContent = Partial<Record<Pillar, string[]>>;

const content: Record<Angle, AngleContent> = {
  // ----- NON HA ANCORA UN SITO ------------------------------------------------
  NO_SITE: {
    PROBLEM_SOLUTION: [
      'Non hai un sito? Perdi clienti ogni giorno',
      'Senza sito sei invisibile su Google',
      'Il passaparola da solo non basta più',
      'I clienti ti cercano online, ma non ti trovano',
      'Hai un Instagram ma nessun sito? Errore'
    ],
    AUTHORITY: [
      'Un sito è il commerciale che lavora 24/7',
      'Il sito è il biglietto da visita del 2026',
      'Avere solo i social è come affittare casa',
      'Possedere un sito = possedere il tuo brand',
      'Senza sito non hai un brand digitale'
    ],
    EDUCATIONAL: [
      '5 motivi per cui ti serve un sito (anche se piccolo)',
      'Cosa succede quando un cliente non ti trova online',
      'Sito vs profili social: la differenza che cambia tutto',
      'Quanto vale un cliente perso per mancanza di sito?',
      'Il sito non è un costo, è un asset'
    ],
    VIRAL_HOOK: [
      'Sei nel 2026 senza un sito. Davvero?',
      'Tuo cugino ha un sito. Tu no. Riflettiamoci',
      'I tuoi competitor hanno tutti un sito. Tu cosa aspetti?',
      'Non avere un sito oggi è come non avere un numero di telefono'
    ],
    CASE_STUDY: [
      'Da zero sito a 25 lead/mese: storia vera',
      'Imprenditore senza sito → +40k €/mese in 6 mesi',
      'Il sito che gli ha cambiato il business in 90 giorni'
    ],
    HOW_TO: [
      'Come partire con un sito senza spendere una follia',
      'Il primo sito: cosa serve davvero',
      'Sito da zero in 30 giorni: il piano'
    ],
    OFFER: [
      'Audit gratuito: il sito che ti serve davvero',
      'Pacchetto Starter: il tuo primo sito professionale',
      'Sito da zero senza pensieri: parliamone'
    ]
  },

  // ----- SITO VECCHIO / DA RIFARE --------------------------------------------
  OLD_SITE: {
    PROBLEM_SOLUTION: [
      'Il tuo sito è fermo al 2018?',
      'Sito vecchio = brand percepito vecchio',
      'Se il tuo sito sembra datato, perdi credibilità',
      'Un design vecchio ti costa migliaia di euro l\'anno',
      'Il tuo sito è una brochure morta?'
    ],
    AUTHORITY: [
      'Un brand serio merita un sito moderno',
      'Il design del tuo sito parla di te prima di te',
      'Modernizzare il sito = alzare la percezione del brand',
      'Il restyling che ti riposiziona nel mercato'
    ],
    EDUCATIONAL: [
      '5 segnali che il tuo sito è da rifare',
      'Quando rifare il sito da zero invece di toccarlo',
      'Refresh vs Redesign: cosa scegliere',
      'Cosa rende un sito moderno nel 2026',
      'Le tendenze sito 2026 (e quelle da evitare)'
    ],
    MISTAKE: [
      'Aggiornare il sito a pezzi è uno spreco',
      "Mettere 'pezze' invece di rifarlo: errore grave",
      "Pensare che basti cambiare i colori per modernizzarlo"
    ],
    VIRAL_HOOK: [
      "Il tuo sito sembra di 8 anni fa. E tu?",
      'Il sito vecchio è un parafulmine di clienti persi',
      'Quanto tempo ancora aspetterai prima di rifarlo?',
      'Stai pagando hosting per un sito morto'
    ],
    CASE_STUDY: [
      'Restyling totale: +260% richieste in 90 giorni',
      'Da sito-museo a sito-macchina di lead',
      'Brand storico modernizzato: numeri da capogiro'
    ],
    OFFER: [
      'Audit del tuo sito attuale: cosa salvare e cosa rifare',
      'Restyling completo a prezzo dedicato',
      'Check-up gratuito + proposta di redesign'
    ]
  },

  // ----- SITO LENTO -----------------------------------------------------------
  SLOW_SITE: {
    PROBLEM_SOLUTION: [
      'Sito lento? Hai già perso il cliente',
      '3 secondi e il visitatore se ne va',
      'Velocità sito = fatturato',
      'Il tuo sito perde la metà del traffico per la velocità',
      'Caricamento lento = Google ti penalizza'
    ],
    EDUCATIONAL: [
      'Cosa misura davvero la velocità di un sito',
      'I 4 killer della velocità (immagini, plugin, hosting, codice)',
      'PageSpeed: come leggere il punteggio',
      "L'impatto reale di 1 secondo in più sul fatturato"
    ],
    AUTHORITY: [
      'I migliori siti del mondo caricano sotto 1 secondo',
      'Performance non è tecnica: è marketing',
      'La velocità è il primo segnale di qualità che il cliente nota'
    ],
    MISTAKE: [
      'Pensare che la velocità sia "questione di hosting"',
      'Caricare immagini da 5 MB nella home',
      "Installare 27 plugin 'per sicurezza'"
    ],
    VIRAL_HOOK: [
      'Il tuo sito impiega 6 secondi a caricare. Bye bye clienti',
      'Mentre il tuo sito carica, il cliente è già dal competitor',
      'La velocità del tuo sito è il tuo primo commerciale'
    ],
    CASE_STUDY: [
      'Da 7s a 0.9s: cosa è successo al fatturato',
      '+180% conversioni solo con un fix di velocità',
      'Il caso del sito che ha dimezzato il tempo di caricamento'
    ]
  },

  // ----- NON CONVERTE ---------------------------------------------------------
  NO_CONVERSION: {
    PROBLEM_SOLUTION: [
      'Tanto traffico, zero contatti?',
      'Il sito attira ma non vende',
      'Visite alte, ricavi bassi: ecco perché',
      'Non manca il marketing, manca la conversione',
      'Il tuo sito porta gente, ma non clienti'
    ],
    EDUCATIONAL: [
      'Cos\'è davvero un sito che converte',
      'Il funnel di conversione spiegato in 1 minuto',
      '3 elementi che fanno o distruggono la conversione',
      'La differenza tra una vetrina e una macchina di vendita',
      'Le CTA che funzionano (e quelle che fanno scappare)'
    ],
    MISTAKE: [
      'Mettere "Contattaci" come unica CTA',
      "Nascondere il modulo contatti nel footer",
      'Avere un menù con 12 voci. Caos.',
      'Non avere mai testato la pagina prodotto/servizio'
    ],
    VIRAL_HOOK: [
      'Il sito non è una vetrina. È un sistema di vendita',
      'Conversione > Estetica. Sempre.',
      'Stai pagando un sito-poster ma volevi un sito-commerciale'
    ],
    CASE_STUDY: [
      '+340% conversioni con un solo refactor della home',
      'Lo stesso traffico, 4x le richieste: come abbiamo fatto',
      'Il cliente che ha smesso di sprecare ADS grazie al sito nuovo'
    ],
    HOW_TO: [
      'Come strutturare una home page che converte',
      'Come scrivere una CTA che fa cliccare',
      'Come costruire una pagina contatti che chiude'
    ]
  },

  // ----- BRAND PERCEPITO MALE -------------------------------------------------
  BRAND_PERCEPTION: {
    PROBLEM_SOLUTION: [
      'Sei più bravo di quanto sembri online',
      'Il tuo sito ti fa sembrare amatoriale',
      'Brand premium con sito da garage: la dissonanza che ti costa',
      'I tuoi clienti pensano che tu sia "piccolo" per colpa del sito',
      'Online non si capisce quanto vali davvero'
    ],
    AUTHORITY: [
      'Il sito decide il prezzo che il cliente è disposto a pagare',
      'Un sito d\'élite alza tutto il posizionamento',
      'I brand premium investono prima sul sito poi sui prodotti'
    ],
    EDUCATIONAL: [
      'Come un sito alza (o abbassa) le tariffe che puoi chiedere',
      "L'importanza della prima impressione digitale",
      'Brand identity online: 5 elementi non negoziabili'
    ],
    MISTAKE: [
      'Spendere su pubblicità e foto, ma non sul sito',
      'Avere logo e biglietti da visita curatissimi e sito amatoriale',
      "Sottovalutare la coerenza visiva tra sito e brand offline"
    ],
    VIRAL_HOOK: [
      'Il tuo sito comunica fiducia. O sfiducia. Mai vie di mezzo',
      'Sei tu, in 3 secondi. Cosa stai dicendo al cliente?',
      'Vuoi vendere a prezzi alti? Inizia dal sito.'
    ],
    TESTIMONIAL: [
      '"Finalmente il sito rispecchia chi sono davvero"',
      '"Da quando abbiamo rifatto il sito, prezzi più alti e zero obiezioni"',
      '"Era un brand bellissimo che online sembrava economico. Ora no"'
    ]
  },

  // ----- INVISIBILE ONLINE ----------------------------------------------------
  INVISIBLE: {
    PROBLEM_SOLUTION: [
      "Nessuno ti trova su Google. Ecco perché",
      "Sei l'unico che sa che esisti",
      "Stai aspettando i clienti, ma loro non sanno dove sei",
      'Hai un sito, ma è come fosse offline'
    ],
    EDUCATIONAL: [
      'SEO base: cosa NON deve mancare nel tuo sito',
      'Local SEO: come essere trovato dai clienti vicino a te',
      'Cosa cerca davvero un cliente prima di contattarti',
      "L'AEO (Answer Engine Optimization) spiegata semplice"
    ],
    AUTHORITY: [
      'Essere su Google è un investimento, non un costo',
      'I brand seri non aspettano i clienti: li intercettano',
      'Senza posizionamento, lavori sempre per chi capita'
    ],
    VIRAL_HOOK: [
      'Sei online ma nessuno ti vede. Sei davvero online?',
      'Il tuo competitor è in prima pagina. E tu?',
      "Se Google non ti trova, sei un fantasma digitale"
    ],
    HOW_TO: [
      'Come finire nella prima pagina di Google (passi reali)',
      'Come ottimizzare la tua Google Business Profile',
      'Come trasformare il sito in un magnete di lead locali'
    ],
    CASE_STUDY: [
      'Da pagina 7 a pagina 1: come ci siamo riusciti',
      '+520% traffico organico in 4 mesi: il caso reale'
    ]
  },

  // ----- WIX / WEEBLY / FAI-DA-TE --------------------------------------------
  DIY_BUILDER: {
    PROBLEM_SOLUTION: [
      'Hai fatto il sito su Wix? Ecco perché perdi clienti',
      'I template tutti uguali non vendono',
      'Il fai-da-te ti costa più di un sito professionale',
      'Il tuo sito sembra fatto in 10 minuti perché è così'
    ],
    EDUCATIONAL: [
      'Wix, Weebly, Squarespace: quando bastano e quando no',
      'Sito custom vs template: i veri pro e contro',
      "Costo reale di un sito 'gratuito'",
      'Performance dei template builder: i numeri veri'
    ],
    AUTHORITY: [
      'Il sito è il tuo asset più importante. Non delegarlo a un template',
      'I brand premium non vivono su Wix. Per un motivo',
      'Un sito custom è un investimento, un template è un compromesso'
    ],
    MISTAKE: [
      'Pensare che "tanto basta avere un sito"',
      'Risparmiare sul sito per poi spendere in ADS che non convertono',
      'Confondere "facile da fare" con "facile da vendere"'
    ],
    VIRAL_HOOK: [
      'Il template del tuo sito lo usano in 30.000. Differenziati.',
      'Smetti di farti il sito da solo nei ritagli di tempo',
      'Il tuo brand merita più di Wix'
    ],
    CASE_STUDY: [
      'Da Wix a sito custom: +210% lead in 60 giorni',
      "Il cliente che ha mollato il template ed è cresciuto del 4x",
      'Migrazione da Squarespace a Next.js: cosa è cambiato'
    ]
  }
};

// ============================================================================
// SLIDE NARRATIVE BUILDERS — 7-slide psychological flow per pillar (POST format)
// ============================================================================
type SlideTemplate = (title: string) => Slide;

const slideLogic: Record<Pillar, SlideTemplate[]> = {
  PROBLEM_SOLUTION: [
    (title) => ({ title, text: 'Swipe — ti dico cosa sta succedendo davvero.' }),
    () => ({ title: 'IL SINTOMO', text: 'Pochi contatti, traffico che non si trasforma in clienti.' }),
    () => ({ title: 'LA CAUSA VERA', text: 'Non è il marketing, è il sito. Manca chiarezza, velocità, struttura.' }),
    () => ({ title: "L'ERRORE", text: 'Continuare ad aggiungere ADS sopra un sito che non converte.' }),
    () => ({ title: 'LA SOLUZIONE', text: 'Un sito pensato per guidare, convincere, far agire.' }),
    () => ({ title: 'IL RISULTATO', text: 'Lead qualificati ogni settimana, senza inseguire nessuno.' }),
    () => ({ title: 'PARLIAMONE', text: 'Scrivimi "SITO" in DM. Ti dico in 24h cosa cambierei.' })
  ],
  AUTHORITY: [
    (title) => ({ title, text: 'Swipe — la verità che il mercato non vuole sentirsi dire.' }),
    () => ({ title: 'CONTESTO', text: 'I clienti decidono in 3 secondi se sei serio.' }),
    () => ({ title: 'COSA CAMBIA', text: 'Il sito non è una vetrina. È il primo commerciale del tuo brand.' }),
    () => ({ title: 'OBIEZIONE COMUNE', text: '"Il passaparola mi basta". Spoiler: non scala. Mai.' }),
    () => ({ title: 'IL CAMBIO DI VISIONE', text: 'Trattare il sito come asset di business, non come spesa.' }),
    () => ({ title: 'COSA OTTIENI', text: 'Posizionamento, lead, prezzi più alti, clienti migliori.' }),
    () => ({ title: 'SCRIVIMI', text: 'Pronto a fare il passo? DM aperti.' })
  ],
  EDUCATIONAL: [
    (title) => ({ title, text: 'Salva il post 💾 — punto per punto.' }),
    () => ({ title: 'PUNTO 1', text: 'Chiarezza: in 3 secondi il visitatore deve capire cosa fai.' }),
    () => ({ title: 'PUNTO 2', text: 'Velocità: sotto i 2 secondi di caricamento, sempre.' }),
    () => ({ title: 'PUNTO 3', text: 'CTA: ogni sezione deve guidare a un\'azione specifica.' }),
    () => ({ title: 'PUNTO 4', text: 'Prova sociale: case study, recensioni, brand serviti.' }),
    () => ({ title: 'PUNTO 5', text: 'Mobile-first: il 70% dei visitatori arriva da smartphone.' }),
    () => ({ title: 'COSA FARE ORA', text: 'Vuoi un check del tuo sito? DM e ti rispondo io.' })
  ],
  VIRAL_HOOK: [
    (title) => ({ title, text: 'Sì, l\'ho detto. Swipe e ti spiego perché.' }),
    () => ({ title: 'COMINCIA QUI', text: 'Il web non aspetta nessuno. Né te, né il tuo brand.' }),
    () => ({ title: 'LA SCOMODA VERITÀ', text: 'Senza un sito moderno, sei invisibile per i clienti migliori.' }),
    () => ({ title: 'IL COSTO DI ASPETTARE', text: 'Ogni mese che passa, lasci soldi sul tavolo.' }),
    () => ({ title: 'LA MOSSA GIUSTA', text: 'Investire ORA in un sito che lavora per te 24/7.' }),
    () => ({ title: 'IL RISULTATO', text: 'Brand percepito alto, clienti che ti scelgono prima del prezzo.' }),
    () => ({ title: 'AZIONE', text: 'Scrivimi in DM. Senza impegno, ti dico cosa farei al tuo posto.' })
  ],
  CASE_STUDY: [
    (title) => ({ title, text: 'Storia vera. Numeri reali. Swipe.' }),
    () => ({ title: 'IL CLIENTE', text: 'Un imprenditore italiano, brand solido, sito fermo al 2017.' }),
    () => ({ title: 'IL PROBLEMA', text: 'Poche richieste, marketing che non scalava, ADS che bruciavano budget.' }),
    () => ({ title: 'COSA ABBIAMO FATTO', text: 'Nuovo sito Next.js, percorso utente riscritto, performance al 100/100.' }),
    () => ({ title: 'IL RISULTATO', text: '+340% lead qualificati in 90 giorni. Stesso budget marketing.' }),
    () => ({ title: 'IL LEARNING', text: 'Il vero ROI di un sito non è il design: è la conversione.' }),
    () => ({ title: 'VUOI ESSERE TU?', text: 'Posti limitati questo mese. DM "CASE" per parlarne.' })
  ],
  HOW_TO: [
    (title) => ({ title, text: 'Step-by-step. Salva il post per non perderlo.' }),
    () => ({ title: 'STEP 1', text: 'Misura il tuo sito attuale: PageSpeed, percorso utente, CTA.' }),
    () => ({ title: 'STEP 2', text: 'Identifica le sezioni che confondono o rallentano il visitatore.' }),
    () => ({ title: 'STEP 3', text: 'Riscrivi i contenuti pensando al cliente, non a te stesso.' }),
    () => ({ title: 'STEP 4', text: 'Inserisci una CTA chiara e visibile in ogni sezione.' }),
    () => ({ title: 'STEP 5', text: 'Migra a una tecnologia veloce (Next.js, headless). Il resto è dettaglio.' }),
    () => ({ title: 'BONUS', text: 'Vuoi che lo facciamo noi al posto tuo? DM aperti.' })
  ],
  MISTAKE: [
    (title) => ({ title, text: 'Gli errori che vedo ogni settimana. Evitali.' }),
    () => ({ title: 'ERRORE 1', text: 'Parlare dell\'azienda invece che del cliente.' }),
    () => ({ title: 'ERRORE 2', text: 'CTA assenti, generiche o nascoste nel footer.' }),
    () => ({ title: 'ERRORE 3', text: 'Sito non ottimizzato per mobile (perdi il 70% del traffico).' }),
    () => ({ title: 'ERRORE 4', text: 'Velocità lenta. 3 secondi e il cliente è già dal competitor.' }),
    () => ({ title: 'ERRORE 5', text: 'Nessuna prova sociale: niente recensioni, case study, brand serviti.' }),
    () => ({ title: 'COSA FARE', text: 'Quanti di questi errori ha il tuo sito? Scrivimi e ti aiuto.' })
  ],
  TESTIMONIAL: [
    () => ({ title: 'COSA DICONO DI NOI', text: 'Le parole dei nostri clienti. Senza filtri.' }),
    () => ({ title: '"+200% LEAD"', text: 'Cliente B2B, 60 giorni dopo il lancio del nuovo sito.' }),
    () => ({ title: '"PERFORMANCE TOP"', text: 'Score 100/100 su Lighthouse. Sito che vola.' }),
    () => ({ title: '"TEAM PRESENTE"', text: 'Comunicazione costante, ascolto del brief reale.' }),
    () => ({ title: '"BRAND VERO"', text: 'Finalmente il sito rispecchia il valore reale del business.' }),
    () => ({ title: '"INVESTIMENTO RIPAGATO"', text: 'In 4 mesi rientrati e iniziato a guadagnare.' }),
    () => ({ title: 'PROVALO ANCHE TU', text: 'Vuoi una call gratuita? DM "CHIAMATA".' })
  ],
  OFFER: [
    (title) => ({ title, text: 'Proposta concreta. Pochi posti.' }),
    () => ({ title: 'COSA OTTIENI', text: 'Audit completo del tuo sito + strategia di conversione personalizzata.' }),
    () => ({ title: 'COSA INCLUDE', text: 'Velocità, UX, copy, CTA, SEO tecnica, posizionamento di brand.' }),
    () => ({ title: 'A CHI SERVE', text: "A chi vuole più lead qualificati senza alzare il budget ADS." }),
    () => ({ title: 'DURATA', text: 'Sessione di 45 minuti, deliverable consegnato in 48 ore.' }),
    () => ({ title: 'COSTO', text: 'Gratuito per i primi 5 brand di questo mese.' }),
    () => ({ title: 'PRENOTA', text: 'Scrivimi "AUDIT" in DM per riservare il tuo slot.' })
  ]
};

// ============================================================================
// STORY NARRATIVE — 3-slide flow (POST → STORY adaptation)
// ============================================================================
const storyLogic: Record<Pillar, SlideTemplate[]> = {
  PROBLEM_SOLUTION: [
    (title) => ({ title, text: 'Riconosci il problema?' }),
    () => ({ title: 'C\'è una via', text: 'E parte da un sito strutturato per vendere.' }),
    () => ({ title: 'DM aperti', text: 'Scrivimi "SITO" e ne parliamo.' })
  ],
  AUTHORITY: [
    (title) => ({ title, text: 'Swipe →' }),
    () => ({ title: 'Le regole', text: 'Sono cambiate. Il sito decide tutto.' }),
    () => ({ title: 'Pronto?', text: 'DM aperti.' })
  ],
  EDUCATIONAL: [
    (title) => ({ title, text: 'Salva la storia 💾' }),
    () => ({ title: 'Lo sapevi?', text: 'Velocità e chiarezza fanno il 90% della conversione.' }),
    () => ({ title: 'Vuoi di più?', text: 'Tap sul link in bio.' })
  ],
  VIRAL_HOOK: [
    (title) => ({ title, text: 'Sì, ho detto questo.' }),
    () => ({ title: 'Verità', text: 'Senza un sito serio, sei invisibile.' }),
    () => ({ title: 'Pronto?', text: 'Tap sul link e parliamone.' })
  ],
  CASE_STUDY: [
    (title) => ({ title, text: 'Storia vera. Numeri reali.' }),
    () => ({ title: '+340%', text: 'Lead qualificati in 90 giorni.' }),
    () => ({ title: 'Tu sei il prossimo?', text: 'DM aperti.' })
  ],
  HOW_TO: [
    (title) => ({ title, text: 'Mini-tutorial. Salvalo.' }),
    () => ({ title: '3 mosse', text: 'Velocità, chiarezza, CTA. Punto.' }),
    () => ({ title: 'Vuoi aiuto?', text: 'Scrivimi.' })
  ],
  MISTAKE: [
    (title) => ({ title, text: 'Stop a questo errore.' }),
    () => ({ title: 'Conseguenza', text: 'Perdi clienti ogni giorno.' }),
    () => ({ title: 'Sistemalo', text: 'Iniziamo? DM.' })
  ],
  TESTIMONIAL: [
    () => ({ title: 'Lo dicono loro', text: 'Non noi.' }),
    () => ({ title: '"Top scelta"', text: 'Cliente Link2Digital.' }),
    () => ({ title: 'Vuoi unirti?', text: 'DM aperti.' })
  ],
  OFFER: [
    (title) => ({ title, text: 'Solo per pochi.' }),
    () => ({ title: 'Audit gratuito', text: 'Sessione di 45 min.' }),
    () => ({ title: 'Prenota ora', text: 'Scrivimi "AUDIT".' })
  ]
};

// ============================================================================
// CAPTION — lead-gen first, no industry context
// ============================================================================
function generateCaption(title: string, pillar: Pillar, angle: Angle, variant: number): string {
  const hooks: Record<Pillar, string[]> = {
    AUTHORITY: [
      'Il sito non è una vetrina. È il tuo primo commerciale. 🏛️',
      'Brand serio = sito serio. Punto. 💎',
      'Vuoi clienti migliori? Inizia dal sito. 🚀',
      'Il posizionamento di brand passa dal web. Sempre. ⚡'
    ],
    EDUCATIONAL: [
      'Salvati il post — sono i pilastri di un sito che vende. 📊',
      'Mini-lezione su come trasformare un sito in un asset. 💡',
      'Tre cose da capire prima di rifare (o fare) un sito. 📝',
      'Se vuoi un sito che ti porti clienti, parti da qui. 📚'
    ],
    PROBLEM_SOLUTION: [
      'Se il tuo sito non porta clienti, leggi qui. ⚠️',
      'Stop ai siti che bruciano budget. Soluzione dentro. 🛠️',
      'Il sito non converte? Questa è la diagnosi. 🔍',
      'Le frizioni nascoste che ti costano lead ogni giorno. 🚦'
    ],
    VIRAL_HOOK: [
      'Il mondo digitale cambia. Tu hai cambiato il sito? ⚡',
      'Una scomoda verità sul web nel 2026. 🤐',
      'Stai usando metodi del 2010 per acquisire clienti? 🕒',
      'Pronto a sentire come la pensa Link2Digital? 👀'
    ],
    CASE_STUDY: [
      'Storia vera di un cliente Link2Digital. 📈',
      'Numeri alla mano: cosa cambia con un sito fatto bene. 💼',
      'Da idea a fatturato: il viaggio di un brand cliente. 🚀',
      'Cosa succede davvero quando il sito è fatto per convertire. 📊'
    ],
    HOW_TO: [
      'Tutorial pratico. Salvalo. 📌',
      'Step-by-step: come avere un sito che lavora per te. 🪜',
      'Workflow vincente per il tuo prossimo sito. 🔧',
      'Da zero a strategia in 5 step. 🎯'
    ],
    MISTAKE: [
      'Gli errori che vediamo ogni giorno nei siti italiani. ❌',
      'Smetti di sbagliare proprio queste cose. 🛑',
      "Cose da non fare mai sul proprio sito. ⚠️",
      'Errori comuni che ti costano clienti veri. 💸'
    ],
    TESTIMONIAL: [
      'Le parole di un nostro cliente. ❤️',
      "Cosa cambia con un sito vero — parlano i nostri clienti. 🗣️",
      'Quando il cliente diventa ambassador. 🤝',
      'Voci dal nostro studio. 💬'
    ],
    OFFER: [
      'La nostra proposta del mese. Pochi posti. 🎁',
      'Operazione speciale per chi vuole rifare (o fare) il sito. ⏳',
      'Offerta esclusiva, posti contingentati. 💎',
      'Audit gratuito: pochi slot questo mese. 🆓'
    ]
  };

  const bodies: Record<Angle, string[]> = {
    NO_SITE: [
      'Senza sito sei un brand a metà. I tuoi clienti decidono online, e se non ti trovano si rivolgono al competitor.',
      'Non avere un sito nel 2026 non è "risparmiare", è regalare clienti a chi un sito ce l\'ha.',
      'Il sito è la base. Senza, qualunque investimento in marketing è solo un cerotto.'
    ],
    OLD_SITE: [
      'Un sito vecchio non è solo "datato": comunica al cliente che il brand è fermo. E i clienti si rivolgono altrove.',
      'Rifare il sito non è un costo: è il modo più veloce per riposizionarsi sul mercato.',
      "Tutti i brand che oggi crescono hanno una cosa in comune: un sito moderno, veloce, pensato per convertire."
    ],
    SLOW_SITE: [
      'La velocità non è un dettaglio tecnico: è il primo segnale di qualità che il cliente percepisce. E Google la usa per il ranking.',
      "Se il tuo sito carica in più di 3 secondi, stai perdendo metà del traffico ogni giorno. Tutti i giorni.",
      'Performance = conversione. Non è opinione, è matematica.'
    ],
    NO_CONVERSION: [
      "Un sito che attira ma non converte è il peggior investimento: bruci traffico, brand e fiducia tutto insieme.",
      "Il problema non è quasi mai il marketing. È il sito che non guida il visitatore verso l'azione.",
      'Conversione > Estetica. Sempre. Un sito bellissimo che non vende è solo una galleria d\'arte.'
    ],
    BRAND_PERCEPTION: [
      "Il sito decide quanto vali nella testa del cliente prima ancora che lui ti contatti. Vale di più di mille biglietti da visita.",
      "Vuoi alzare le tariffe? Devi prima alzare la percezione. E la percezione parte dal sito.",
      'Brand premium con sito mediocre: la dissonanza più costosa che puoi avere.'
    ],
    INVISIBLE: [
      "Essere online senza essere trovato è come avere un negozio in mezzo al deserto. Il sito da solo non basta: deve essere pensato per essere visto.",
      'Posizionamento organico = lead a costo zero ogni mese. Per sempre. Senza ricaricare il budget ADS.',
      "Se il tuo competitor è in prima pagina e tu no, ogni giorno stai perdendo soldi reali."
    ],
    DIY_BUILDER: [
      "Wix e simili fanno una cosa bene: ti danno un sito velocemente. Ma quel sito non scala, non posiziona, non converte come dovrebbe.",
      "Il template è una scorciatoia. La scorciatoia ti costa più del sito custom in 12 mesi.",
      "Possedere il proprio sito (codice, dominio, dati) significa possedere il proprio business digitale. Su Wix sei in affitto."
    ]
  };

  const ctas = [
    '👉 Scrivimi "AUDIT" in DM e analizzo gratis il tuo sito attuale.',
    '👉 DM aperti: dimmi com\'è oggi il tuo sito, ti dico cosa cambierei.',
    '👉 Vuoi una call senza impegno? Scrivimi "CALL".',
    '👉 Pronto a rifare (o fare) il sito che meriti? Scrivimi.',
    '👉 Posti questo mese: 5. Scrivimi "POSTO" per prenotare il tuo.'
  ];

  const hookPool = hooks[pillar] ?? hooks.AUTHORITY;
  const bodyPool = bodies[angle] ?? bodies.OLD_SITE;
  const hook = hookPool[variant % hookPool.length];
  const body = bodyPool[variant % bodyPool.length];
  const cta = ctas[variant % ctas.length];

  const hashtags = [
    '#Link2Digital', '#WebDesign', '#SitiWeb', '#Restyling',
    '#WebAgency', '#DigitalStrategy', '#Conversione', '#Milano',
    '#NuovoSito', '#Imprenditori', '#PMI'
  ].join(' ');

  return `${hook}\n\n${body}\n\n${title}\n\n${cta}\n\n${hashtags}`;
}

// ============================================================================
// GENERATOR
// ============================================================================
interface GenerateOptions {
  count?: number;
  seed?: number;
  angleFilter?: Angle | 'all';
  format?: PostFormat;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const customSource = [
  {
    category: "Problemi comuni dei siti web",
    tag: "PROBLEMI SITO",
    angle: "NO_CONVERSION" as Angle,
    pillar: "PROBLEM_SOLUTION" as Pillar,
    text: "Molti siti web sono obsoleti o lenti, allontanando potenziali clienti ogni giorno.",
    cta: "SCOPRI COME",
    phrases: [
      "Il tuo sito è fermo al 2018? Probabilmente stai perdendo clienti ogni giorno.",
      "Un sito lento può far scappare oltre la metà dei visitatori.",
      "Se il tuo sito non funziona bene da smartphone, stai perdendo opportunità.",
      "Un design datato trasmette poca fiducia ai nuovi clienti.",
      "Quanti clienti ti contattano realmente dal tuo sito?",
      "Il tuo sito è bello ma non genera richieste? C'è qualcosa da migliorare.",
      "Un sito web dovrebbe lavorare per te 24 ore su 24.",
      "Se il tuo concorrente ha un sito migliore, parte già avvantaggiato.",
      "Hai un sito ma non lo aggiorni da anni?",
      "Un sito web non è una spesa: è un investimento."
    ]
  },
  {
    category: "Restyling sito web",
    tag: "RESTYLING SITO",
    angle: "OLD_SITE" as Angle,
    pillar: "HOW_TO" as Pillar,
    text: "Un restyling completo migliora la velocità, il design e la capacità di convertire visite in clienti.",
    cta: "RESTYLING",
    phrases: [
      "Prima e dopo: ecco cosa può fare un restyling professionale.",
      "Quando è il momento giusto per rifare un sito web?",
      "5 segnali che indicano che il tuo sito ha bisogno di un restyling.",
      "Un nuovo design può aumentare le richieste di contatto.",
      "Restyling non significa solo grafica: significa risultati.",
      "Il tuo sito rappresenta davvero la tua azienda?",
      "Un layout moderno aumenta la credibilità del tuo brand.",
      "Aggiornare il sito può migliorare l'esperienza utente.",
      "Hai cambiato servizi ma il sito è rimasto uguale?",
      "Un sito aggiornato trasmette professionalità."
    ]
  },
  {
    category: "Nuovo sito web",
    tag: "NUOVO SITO",
    angle: "NO_SITE" as Angle,
    pillar: "AUTHORITY" as Pillar,
    text: "Portiamo la tua attività online con un sito veloce, sicuro e pronto a farti trovare su Google.",
    cta: "INIZIA ORA",
    phrases: [
      "Non hai ancora un sito? I tuoi clienti ti stanno cercando online.",
      "Essere presenti sui social non basta.",
      "Il tuo sito è la tua sede digitale.",
      "Un sito professionale aumenta la fiducia dei clienti.",
      "Ogni attività dovrebbe avere un sito web dedicato.",
      "Un sito web ti rende indipendente dai social.",
      "Costruisci una presenza online che lavori per te.",
      "Il primo posto dove un cliente ti cerca è Google.",
      "Un sito web professionale può fare la differenza.",
      "La tua attività merita una vetrina online efficace."
    ]
  },
  {
    category: "Domande che generano engagement",
    tag: "ENGAGEMENT",
    angle: "BRAND_PERCEPTION" as Angle,
    pillar: "VIRAL_HOOK" as Pillar,
    text: "Fai un check-up del tuo sito rispondendo a queste domande chiave sul rendimento.",
    cta: "FARES CHECK",
    phrases: [
      "Quando hai aggiornato il tuo sito per l'ultima volta?",
      "Il tuo sito genera contatti ogni mese?",
      "Sei soddisfatto del design del tuo sito attuale?",
      "Quanto tempo impiega il tuo sito a caricarsi?",
      "Da smartphone il tuo sito è davvero navigabile?",
      "Se fossi un cliente, compreresti dal tuo sito?",
      "Il tuo sito comunica chiaramente cosa fai?",
      "I tuoi concorrenti hanno una presenza online migliore?",
      "Hai mai analizzato le prestazioni del tuo sito?",
      "Cosa vorresti migliorare del tuo sito web?"
    ]
  },
  {
    category: "Educativi",
    tag: "EDUCATION",
    angle: "SLOW_SITE" as Angle,
    pillar: "EDUCATIONAL" as Pillar,
    text: "Scopri le regole tecniche e le best practice per ottimizzare l'acquisizione di lead online.",
    cta: "LEGGI DI PIÙ",
    phrases: [
      "Perché un sito veloce converte di più.",
      "L'importanza della versione mobile.",
      "Cos'è una landing page e perché serve.",
      "Perché il design influenza le vendite.",
      "Le 3 pagine che ogni sito dovrebbe avere.",
      "Come trasformare visitatori in clienti.",
      "Perché la SEO è importante.",
      "Differenza tra un sito vetrina e un e-commerce.",
      "Perché il modulo contatti è fondamentale.",
      "Gli errori più comuni nei siti aziendali."
    ]
  },
  {
    category: "Social proof e fiducia",
    tag: "RISULTATI & FIDUCIA",
    angle: "BRAND_PERCEPTION" as Angle,
    pillar: "TESTIMONIAL" as Pillar,
    text: "Il nostro metodo mette al centro i tuoi obiettivi di crescita e il valore del tuo brand.",
    cta: "I NOSTRI SITI",
    phrases: [
      "Ogni progetto nasce dalle esigenze del cliente.",
      "Il nostro obiettivo? Portarti risultati concreti.",
      "Realizziamo siti pensati per convertire.",
      "Un buon sito deve essere semplice da usare.",
      "Ogni attività ha bisogno di una presenza online efficace.",
      "Progettiamo siti moderni e professionali.",
      "L'utente è sempre al centro del progetto.",
      "Creiamo siti che valorizzano il tuo lavoro.",
      "Design, velocità e semplicità in un unico progetto.",
      "Un sito professionale migliora la percezione del tuo brand."
    ]
  },
  {
    category: "Focus attività locali",
    tag: "BUSINESS LOCALE",
    angle: "NO_SITE" as Angle,
    pillar: "EDUCATIONAL" as Pillar,
    text: "Le ricerche locali su Google guidano oltre l'80% delle visite nei negozi fisici o studi.",
    cta: "ATTIVITÀ LOCALE",
    phrases: [
      "Sei un ristorante? I clienti ti cercano online.",
      "Sei un idraulico? Un sito può portarti nuovi contatti.",
      "Sei un elettricista? Mostra i tuoi lavori online.",
      "Sei un avvocato? Rafforza la tua immagine professionale.",
      "Sei un architetto? Mostra il tuo portfolio.",
      "Sei un medico? Facilita i contatti dei pazienti.",
      "Hai un negozio? Porta i clienti dal web al punto vendita.",
      "Sei un artigiano? Mostra la qualità del tuo lavoro.",
      "Hai una palestra? Attira nuovi iscritti online.",
      "Sei un consulente? Costruisci autorevolezza online."
    ]
  },
  {
    category: "CTA dirette",
    tag: "CONSULENZA",
    angle: "OLD_SITE" as Angle,
    pillar: "OFFER" as Pillar,
    text: "Mettiamo alla prova le performance del tuo sito attuale e definiamo un piano d'azione gratuito.",
    cta: "CONTATTACI",
    phrases: [
      "Vuoi sapere se il tuo sito può essere migliorato? Contattaci.",
      "Richiedi una valutazione gratuita del tuo sito.",
      "Scopri come possiamo rinnovare la tua presenza online.",
      "Prenota una consulenza gratuita.",
      "Richiedi una demo senza impegno.",
      "Vuoi un sito moderno e professionale?",
      "Facciamo crescere la tua presenza online.",
      "Hai un progetto in mente? Parliamone.",
      "Il tuo prossimo cliente potrebbe cercarti oggi.",
      "Inizia oggi il tuo nuovo progetto web."
    ]
  },
  {
    category: "Post impattanti",
    tag: "CRESCITA WEB",
    angle: "BRAND_PERCEPTION" as Angle,
    pillar: "VIRAL_HOOK" as Pillar,
    text: "Il web è la prima porta d'accesso al tuo business. Non lasciare che i dettagli frenino la crescita.",
    cta: "VALUTA ORA",
    phrases: [
      "Il tuo sito lavora per te o contro di te?",
      "Non perdere clienti per colpa di un sito obsoleto.",
      "La prima impressione online conta.",
      "Un sito professionale può fare la differenza tra un contatto e una visita persa.",
      "I clienti giudicano la tua azienda in pochi secondi.",
      "Un sito moderno aumenta la fiducia.",
      "Non lasciare che siano i concorrenti a distinguersi.",
      "La tua attività merita una presenza online all'altezza.",
      "Un sito web efficace è il miglior venditore della tua azienda.",
      "Investire nel web significa investire nel futuro."
    ]
  },
  {
    category: "Offerte e lead generation",
    tag: "LEAD GEN",
    angle: "NO_CONVERSION" as Angle,
    pillar: "OFFER" as Pillar,
    text: "Richiedi un check gratuito o una proposta di restyling senza impegno per valutare i margini di crescita.",
    cta: "AUDIT GRATUITO",
    phrases: [
      "Analisi gratuita del tuo sito web.",
      "Demo gratuita di restyling del tuo sito.",
      "Scopri come potrebbe apparire il tuo nuovo sito.",
      "Consulenza gratuita per la tua presenza online.",
      "Ricevi suggerimenti personalizzati per il tuo sito.",
      "Valutiamo insieme le opportunità di miglioramento.",
      "Richiedi una proposta senza impegno.",
      "Mostriamo gratuitamente alcune idee per il tuo sito.",
      "Trasforma il tuo sito in uno strumento di acquisizione clienti.",
      "Contattaci e scopri come migliorare la tua presenza online."
    ]
  }
];

export const generatePosts = (countOrOpts: number | GenerateOptions = 300): Post[] => {
  const opts: GenerateOptions = typeof countOrOpts === 'number' ? { count: countOrOpts } : countOrOpts;
  const count = opts.count ?? 300;
  const seed = opts.seed ?? 42;
  const angleFilter = opts.angleFilter && opts.angleFilter !== 'all' ? opts.angleFilter : null;
  const formatPref = opts.format;
  const rng = mulberry32(seed);

  // 1. Build the 100 custom posts
  const customPosts: Post[] = [];
  let customId = 1;
  for (const group of customSource) {
    const angleLabel = ANGLES.find((a) => a.id === group.angle)?.label ?? group.category;
    for (const phrase of group.phrases) {
      const styleVariant = (customId - 1) % 25;
      const format: PostFormat = formatPref ?? 'POST';
      
      const slide: Slide = {
        title: phrase,
        text: group.text,
        cta: group.cta,
        tag: group.tag,
        subTitle: 'L2D STUDIO // LEAD GEN',
        logoText: 'LINK2DIGITAL'
      };

      customPosts.push({
        id: customId,
        day: `Post ${customId}`,
        angle: group.angle,
        angleLabel,
        pillarName: group.pillar,
        styleVariant,
        format,
        slides: [slide],
        caption: `${phrase}\n\n${group.text}\n\n👉 Scrivimi in DM per maggiori dettagli.\n\n#Link2Digital #WebDesign #SitiWeb #Restyling`,
        hashtags: '#Link2Digital #WebDesign #SitiWeb #Restyling',
        status: 'READY'
      });
      customId += 1;
    }
  }

  // Filter custom posts by UI parameters
  const allPosts: Post[] = customPosts.filter((p) => {
    if (angleFilter && p.angle !== angleFilter) return false;
    if (formatPref && p.format !== formatPref) return false;
    return true;
  });

  // 2. Generate the dynamic posts up to count
  const angleEntries = (Object.keys(content) as Angle[])
    .filter((a) => !angleFilter || a === angleFilter)
    .map((a) => ({ angle: a, pool: content[a] }));

  let nextId = 101;
  while (allPosts.length < count) {
    const angleEntry = angleEntries[allPosts.length % angleEntries.length];
    if (!angleEntry) break;
    const { angle, pool } = angleEntry;
    const angleLabel = ANGLES.find((a) => a.id === angle)?.label ?? angle;

    const availablePillars = (Object.keys(pool) as Pillar[]).filter((p) => (pool[p] ?? []).length > 0);
    if (availablePillars.length === 0) break;

    const pillar = availablePillars[Math.floor(rng() * availablePillars.length)];
    const titles = pool[pillar] ?? [];
    const title = titles[Math.floor(rng() * titles.length)] ?? 'Strategia Digitale';

    const styleVariant = Math.floor(rng() * 25);
    const format: PostFormat = formatPref ?? (rng() < 0.18 ? 'STORY' : 'POST');

    const logicTemplates = format === 'STORY'
      ? (storyLogic[pillar] ?? storyLogic.AUTHORITY)
      : (slideLogic[pillar] ?? slideLogic.AUTHORITY);

    const slides = logicTemplates.map((template) => template(title));

    allPosts.push({
      id: nextId,
      day: `Post ${nextId}`,
      angle,
      angleLabel,
      pillarName: pillar,
      styleVariant,
      format,
      slides,
      caption: generateCaption(title, pillar, angle, styleVariant),
      hashtags: '#Link2Digital #WebDesign #SitiWeb #Restyling',
      status: 'DRAFT'
    });
    nextId += 1;
  }

  return allPosts;
};

// Re-export pillar list for the UI
export const ALL_PILLAR_NAMES: Pillar[] = [
  'AUTHORITY','EDUCATIONAL','PROBLEM_SOLUTION','VIRAL_HOOK',
  'CASE_STUDY','HOW_TO','MISTAKE','TESTIMONIAL','OFFER'
];
