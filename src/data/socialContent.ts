export const industries = [
  { id: 'agency', title: 'Link2Digital Agency', tag: 'Web & Growth' },
  { id: 'immobiliare', title: 'Immobiliare & Real Estate', tag: 'Luxury Homes' },
  { id: 'agenti', title: 'Agenti Immobiliari', tag: 'Personal Brand' },
  { id: 'fitness', title: 'Palestre & Fitness', tag: 'Fitness Club' },
  { id: 'beauty', title: 'Parrucchieri & Beauty', tag: 'Salon & Spa' },
  { id: 'lusso', title: 'Brand di Lusso', tag: 'Elite Brands' },
  { id: 'gioielleria', title: 'Gioiellerie', tag: 'Fine Jewelry' },
  { id: 'pmi', title: 'Brand Generali / PMI', tag: 'Business' }
];

const industryData = {
  agency: {
    AUTHORITY: [
      "Perché il 90% dei siti aziendali è solo un biglietto da visita costoso",
      "Il segreto della velocità: come carichiamo i siti in meno di 1 secondo",
      "Design d'impatto vs Design che converte: la differenza",
      "Il valore reale di una SEO fatta bene (non solo parole chiave)"
    ],
    EDUCATIONAL: [
      "3 Errori da non fare se vuoi un sito che porti clienti",
      "Come ottimizzare le tue immagini senza perdere qualità",
      "La checklist definitiva per il lancio del tuo sito",
      "Perché usiamo Next.js e perché dovrebbe interessarti"
    ],
    PROBLEM_SOLUTION: [
      "Il tuo sito è lento? Ecco 3 motivi tecnici comuni",
      "Hai traffico ma zero conversioni? Forse manca la chiarezza",
      "Sito non mobile-friendly? Stai perdendo metà dei tuoi utenti",
      "Come gestire le recensioni per aumentare la fiducia"
    ],
    VIRAL_HOOK: [
      "Il sito web non è morto, è morto il modo in cui lo costruisci",
      "Smetti di pagare per siti web che non puoi gestire",
      "La verità scomoda sulla pubblicità senza un sito pronto"
    ]
  },
  immobiliare: {
    AUTHORITY: [
      "Perché un sito immobiliare moderno deve caricare all'istante",
      "Il valore della fotografia professionale nel real estate online",
      "Come l'architettura tecnica del sito influenza la fiducia dell'acquirente",
      "Perché i portali non bastano più per un'agenzia che vuole crescere"
    ],
    EDUCATIONAL: [
      "3 Consigli per schede immobili più coinvolgenti",
      "Come usare le mappe interattive per valorizzare la zona",
      "L'importanza di un design pulito per immobili di lusso",
      "Come ottimizzare il tuo sito per le ricerche locali"
    ],
    PROBLEM_SOLUTION: [
      "Sito troppo lento? Ecco come velocizzarlo per non perdere visite",
      "Poche richieste dal sito? Controlla la chiarezza dei contatti",
      "Foto che caricano male? La soluzione tecnica è più semplice di quanto pensi",
      "Come rendere il tuo sito navigabile da smartphone senza errori"
    ],
    VIRAL_HOOK: [
      "Il futuro del real estate è digitale: non farti trovare impreparato",
      "Il tuo sito è lo showroom della tua agenzia, curalo come la tua sede",
      "Il segreto per vendere casa online? L'esperienza dell'utente"
    ]
  },
  agenti: {
    AUTHORITY: [
      "L’agente immobiliare moderno è digitale",
      "Social + sito = clienti",
      "Perché senza sito perdi incarichi",
      "Il personal brand dell’agente immobiliare",
      "Fiducia online nel real estate"
    ],
    EDUCATIONAL: [
      "Come un agente può generare contatti online",
      "Funnel per agenti immobiliari",
      "Instagram + sito: strategia perfetta",
      "Landing page personale per agenti",
      "Come presentarsi online per vendere più case",
      "Portfolio immobili intelligente",
      "Come diventare agente “top of mind”",
      "Come automatizzare richieste clienti",
      "Strategia contenuti immobiliari",
      "Come posizionarti nella tua città"
    ],
    PROBLEM_SOLUTION: [
      "Nessuno ti trova online",
      "I tuoi clienti non ti ricordano",
      "Stai lavorando ma non scalando",
      "Il tuo profilo non converte",
      "Il problema è la presenza digitale"
    ],
    VIRAL_HOOK: [
      "Nessuno te lo dice, ma sei invisibile",
      "Il tuo concorrente sta prendendo i tuoi incarichi",
      "Smetti di postare case senza una strategia"
    ]
  },
  fitness: {
    AUTHORITY: [
      "Perché la velocità del sito è cruciale per le iscrizioni in palestra",
      "L'importanza di un sistema di prenotazione integrato",
      "Come il design della tua palestra deve riflettersi online",
      "Fiducia e sicurezza: cosa cercano gli utenti in un sito fitness"
    ],
    EDUCATIONAL: [
      "Come mostrare i tuoi corsi in modo efficace sul sito",
      "3 Elementi che non possono mancare nella tua home page",
      "L'importanza delle testimonianze video caricate correttamente",
      "Come usare il blog per attirare nuovi iscritti localmente"
    ],
    PROBLEM_SOLUTION: [
      "Il modulo contatti non funziona? Potresti perdere decine di iscritti",
      "Sito non leggibile da mobile? Il 70% degli utenti fitness naviga da lì",
      "Poche iscrizioni online? Forse il processo è troppo complicato",
      "Come gestire gli orari delle lezioni in modo dinamico sul web"
    ],
    VIRAL_HOOK: [
      "La tua palestra inizia dal sito, non dalla reception",
      "Fai sentire i tuoi membri a casa ancora prima che arrivino",
      "Il digitale è il nuovo personal trainer del tuo business"
    ]
  },
  beauty: {
    AUTHORITY: [
      "Perché il tuo salone ha bisogno di un sistema di prenotazione online",
      "Come l'estetica del sito influenza la percezione del tuo servizio",
      "Il valore della velocità di caricamento per chi prenota da mobile",
      "Fiducia e igiene digitale: come comunicarle attraverso il web"
    ],
    EDUCATIONAL: [
      "3 Consigli per mostrare i tuoi lavori in modo professionale",
      "Come ottimizzare il tuo profilo per le ricerche locali in città",
      "L'importanza di una gallery curata e veloce da caricare",
      "Come usare i form di contatto per gestire meglio l'agenda"
    ],
    PROBLEM_SOLUTION: [
      "Agenda poco organizzata? Un sito ben fatto può automatizzare tutto",
      "Clienti che non trovano i prezzi? La trasparenza online paga sempre",
      "Sito che non carica le foto? Ecco come risolvere i problemi tecnici",
      "Come rendere il tuo salone visibile su Google Maps"
    ],
    VIRAL_HOOK: [
      "Il tuo salone è bellissimo, ma online come appare?",
      "La prima impressione del cliente avviene sul web, non in poltrona",
      "Trasforma la tua passione in un brand digitale solido"
    ]
  },
  lusso: {
    AUTHORITY: [
      "Perché il lusso richiede un'architettura web impeccabile",
      "L'importanza del design invisibile nelle esperienze premium",
      "Come la velocità del sito definisce l'esclusività del brand",
      "Oltre l'estetica: la solidità tecnica nei siti high-end"
    ],
    EDUCATIONAL: [
      "3 Elementi chiave per un'esperienza utente d'élite",
      "Come gestire contenuti video pesanti senza rallentare il sito",
      "Il valore della tipografia digitale nel posizionamento premium",
      "Come creare un percorso d'acquisto senza attriti per clienti high-ticket"
    ],
    PROBLEM_SOLUTION: [
      "Il sito non trasmette il valore reale? Forse manca coerenza tecnica",
      "Bassa conversione nel lusso? Analizziamo il percorso dell'utente",
      "Design datato? È il momento di un refresh tecnologico",
      "Come proteggere l'integrità del tuo brand nel mondo digitale"
    ],
    VIRAL_HOOK: [
      "L'esclusività online è una questione di dettagli tecnici",
      "Il tuo sito è l'ambasciatore digitale del tuo brand di lusso",
      "La perfezione nel web non è un optional per i brand premium"
    ]
  },
  gioielleria: {
    AUTHORITY: [
      "Sicurezza e fiducia: le basi di un ecommerce di gioielli",
      "Come valorizzare i dettagli dei tuoi pezzi attraverso il web",
      "L'importanza della velocità per chi acquista beni di valore",
      "Perché un sito professionale è il miglior certificato di garanzia"
    ],
    EDUCATIONAL: [
      "3 Consigli per presentare i tuoi gioielli online",
      "Come gestire le varianti di prodotto in modo intuitivo",
      "L'importanza di una UX fluida per acquisti emozionali",
      "Come ottimizzare il checkout per aumentare la fiducia"
    ],
    PROBLEM_SOLUTION: [
      "Poche vendite online? Controlla la chiarezza delle spedizioni",
      "Sito lento nel caricare i diamanti? La soluzione è nel codice",
      "Nessun contatto dal web? Forse il form è troppo complesso",
      "Come rendere il tuo ecommerce sicuro e performante"
    ],
    VIRAL_HOOK: [
      "Un gioiello dura per sempre, il tuo sito dovrebbe fare lo stesso",
      "Brilla online con una piattaforma degna delle tue creazioni",
      "L'eleganza digitale è il nuovo standard per le gioiellerie"
    ]
  },
  pmi: {
    AUTHORITY: [
      "Perché il sito web è il dipendente più importante per una PMI",
      "Come competere con i grandi brand attraverso l'agilità digitale",
      "Il valore della presenza locale online per le piccole imprese",
      "Perché investire in un sito proprietario invece di soli social"
    ],
    EDUCATIONAL: [
      "3 Semplici modi per migliorare la tua visibilità locale",
      "Come gestire i contatti che arrivano dal sito in modo efficace",
      "L'importanza di avere orari e contatti sempre aggiornati sul web",
      "Come presentare i tuoi servizi in modo chiaro e professionale"
    ],
    PROBLEM_SOLUTION: [
      "Pochi clienti nuovi? Forse il tuo sito non ti sta aiutando",
      "Sito vecchio e non aggiornabile? Vediamo come renderlo moderno",
      "Stanco di perdere tempo con contatti non qualificati? La soluzione è nel funnel",
      "Come rendere la tua impresa visibile su Google senza sprechi"
    ],
    VIRAL_HOOK: [
      "La digitalizzazione non è solo per i giganti, è per chi vuole crescere",
      "Il tuo business merita una casa digitale solida e accogliente",
      "Fai il primo passo verso la scalabilità con un sito professionale"
    ]
  }
};

// --- LOGIC TEMPLATES FOR SLIDES (Value Pills) ---
const slideLogic = {
  AUTHORITY: [
    (title: string) => ({ title, text: "Swipe per capire come trasformare la tua presenza digitale in un vantaggio competitivo reale." }),
    (title: string) => ({ title: "L'ANALISI CRITICA", text: "Molte aziende hanno siti belli che però non vendono. La differenza sta nell'architettura tecnica e psicologica." }),
    (title: string) => ({ title: "IL NOSTRO APPROCCIO", text: "Lavoriamo per rendere il tuo sito non solo esteticamente eccellente, ma uno strumento attivo di crescita." }),
    (title: string) => ({ title: "DATA DRIVEN", text: "Ogni scelta di design è basata su come gli utenti interagiscono davvero con il web oggi." }),
    (title: string) => ({ title: "PARLIAMO DI TE", text: "Non ci interessa essere i più bravi, ci interessa far crescere il tuo business. Contattaci per una consulenza." })
  ],
  EDUCATIONAL: [
    (title: string) => ({ title, text: "Ecco una pillola veloce per migliorare i tuoi risultati online oggi stesso." }),
    (title: string) => ({ title: "IL PUNTO DI PARTENZA", text: "Spesso la soluzione è più semplice di quanto pensi. Focalizzati sull'esperienza dell'utente." }),
    (title: string) => ({ title: "AZIONI PRATICHE", text: "Controlla la velocità di caricamento e la chiarezza del messaggio principale sulla tua home page." }),
    (title: string) => ({ title: "OTTIMIZZAZIONE", text: "Usa font leggibili, colori coerenti e pulsanti d'azione che siano impossibili da ignorare." }),
    (title: string) => ({ title: "COSTRUIAMO INSIEME", text: "Se vuoi implementare queste soluzioni in modo professionale, siamo qui per aiutarti." }),
    (title: string) => ({ title: "CONCLUSIONE", text: "Un piccolo cambiamento oggi può portare grandi risultati domani. Seguici per altri consigli." })
  ],
  PROBLEM_SOLUTION: [
    (title: string) => ({ title, text: "Ti senti bloccato con un sito che non porta risultati? Vediamo insieme come sbloccare la situazione." }),
    (title: string) => ({ title: "INDIVIDUA IL BLOCCO", text: "Il problema è spesso invisibile ad occhio nudo: tempi di risposta del server o UX confusa." }),
    (title: string) => ({ title: "LA SOLUZIONE", text: "Ripartiamo dalle basi. Struttura pulita, codice ottimizzato e un percorso utente senza ostacoli." }),
    (title: string) => ({ title: "IL RISULTATO", text: "Un sito che carica all'istante e che trasmette fiducia immediata a chi lo visita." }),
    (title: string) => ({ title: "FACCIAMO DUE CHIACCHIERE", text: "Raccontaci il tuo progetto. Analizzeremo insieme i punti di forza e di debolezza del tuo sito attuale." })
  ],
  VIRAL_HOOK: [
    (title: string) => ({ title, text: "Il web corre veloce. Non lasciare che il tuo brand resti indietro con tecnologie obsolete." })
  ]
};

// --- CAPTION GENERATOR ---
type Pillar = 'AUTHORITY' | 'EDUCATIONAL' | 'PROBLEM_SOLUTION' | 'PERSONAL_BRAND' | 'VIRAL_HOOK';

const generateCaption = (title: string, pillar: Pillar, ind: string) => {
  const hooks: Record<string, string> = {
    AUTHORITY: `Consiglio digitale per il settore ${ind}: l'esperienza utente vince sempre. 🏛️`,
    EDUCATIONAL: `Pillola del giorno per chi opera nel settore ${ind}. 📊`,
    PROBLEM_SOLUTION: `Come risolvere i problemi comuni del web nel settore ${ind}. ⚠️`,
    VIRAL_HOOK: `Il mondo digitale cambia, non restare indietro. ⚡`
  };

  const body = `In Link2Digital ci piace risolvere problemi reali con soluzioni tecniche eleganti. Non creiamo solo siti, ma strumenti di lavoro che semplificano la tua vita e quella dei tuoi clienti. \n\n${title} è uno dei temi che affrontiamo ogni giorno con i nostri partner.`;

  const cta = "👉 Scrivici in DM se vuoi analizzare il tuo sito attuale.";

  return `${hooks[pillar] || ''} \n\n ${body} \n\n ${cta} \n\n #Link2Digital #WebDevelopment #UserExperience #SitoWeb #DigitalTips #${ind.replace(/\s+/g, '')}`;
};

export const generatePosts = (count: number) => {
  const allPosts = [];
  
  for (let i = 0; i < count; i++) {
    const industry = industries[i % industries.length];
    const pool = industryData[industry.id as keyof typeof industryData] || industryData.agency;
    
    let pillar: Pillar = 'PROBLEM_SOLUTION';
    const rand = i % 10; 
    if (rand < 4) pillar = 'PROBLEM_SOLUTION';
    else if (rand < 7) pillar = 'EDUCATIONAL';
    else if (rand < 9) pillar = 'AUTHORITY';
    else pillar = 'VIRAL_HOOK';
    
    const titles = pool[pillar] || pool['AUTHORITY'];
    const title = titles[i % titles.length];
    
    const day = i + 1;
    const styleVariant = i % 10;
    
    // Use slide logic templates
    const logicTemplates = slideLogic[pillar] || slideLogic.AUTHORITY;
    const slides = logicTemplates.map(template => template(title, industry.title));

    allPosts.push({
      id: day,
      day: `Post ${day}`,
      industryId: industry.id,
      industryTitle: industry.title,
      industryTag: industry.tag,
      pillarName: pillar,
      styleVariant: styleVariant,
      slides: slides,
      caption: generateCaption(title, pillar, industry.title)
    });
  }
  
  return allPosts;
};
