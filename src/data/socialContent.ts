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
      "Il sito web è il tuo dipendente più instancabile",
      "Come le PMI possono battere i giganti con la velocità",
      "Perché il posizionamento locale è la tua miniera d'oro",
      "L'importanza di possedere la propria piattaforma"
    ],
    EDUCATIONAL: [
      "Checklist per la tua presenza locale online",
      "Gestione dei lead: come rispondere in tempo reale",
      "L'impatto di un sito professionale sulla fiducia",
      "Semplificare i servizi per vendere di più"
    ],
    PROBLEM_SOLUTION: [
      "Sito che non converte? Analizziamo i motivi",
      "Dallo statico al dinamico: l'evoluzione della PMI",
      "Funnel di acquisizione contatti per il business locale",
      "Google Business Profile + Sito: la combo perfetta"
    ],
    VIRAL_HOOK: [
      "Il digitale è l'alleato numero uno della tua impresa",
      "Non lasciare che la tecnologia sia un ostacolo",
      "La tua azienda merita una vetrina all'altezza"
    ]
  }
};

// --- DYNAMIC SLIDE LOGIC (Anti-Repetitive) ---
const slideLogic = {
  AUTHORITY: [
    (title: string, ind: string) => ({ title, text: "Un'analisi rapida su come questo concetto cambia le regole del gioco." }),
    (title: string, ind: string) => ({ title: "IL CONTESTO", text: `Nel mondo ${ind}, l'attenzione è la moneta più preziosa. Se il tuo sito non la cattura subito, hai già perso.` }),
    (title: string, ind: string) => ({ title: "COSA CAMBIA", text: "Passare da una vetrina statica a uno strumento interattivo aumenta la fiducia del 70%." }),
    (title: string, ind: string) => ({ title: "LA NOSTRA FILOSOFIA", text: "Costruiamo soluzioni che risolvono problemi, non solo layout belli da vedere." }),
    (title: string, ind: string) => ({ title: "PROSSIMO PASSO", text: "Se vuoi approfondire come applicare questo al tuo business, scrivici." })
  ],
  EDUCATIONAL: [
    (title: string, ind: string) => ({ title, text: "Ecco alcuni spunti tecnici per migliorare la tua presenza online." }),
    (title: string, ind: string) => ({ title: "PUNTO 01", text: "La velocità non è un dettaglio. Ogni decimo di secondo di attesa riduce le tue conversioni." }),
    (title: string, ind: string) => ({ title: "PUNTO 02", text: "La chiarezza vince sulla creatività fine a se stessa. L'utente deve capire subito cosa offri." }),
    (title: string, ind: string) => ({ title: "PUNTO 03", text: `Per il settore ${ind}, la prova sociale e le recensioni sono il motore della vendita.` }),
    (title: string, ind: string) => ({ title: "APPLICAZIONE", text: "Inizia testando il tuo sito da mobile: è lì che si decide il tuo successo." }),
    (title: string, ind: string) => ({ title: "AIUTO ESPERTO", text: "Se non sai da dove iniziare, possiamo fare un check gratuito insieme." })
  ],
  PROBLEM_SOLUTION: [
    (title: string, ind: string) => ({ title, text: "Molti si scontrano con questo ostacolo. Vediamo come superarlo." }),
    (title: string, ind: string) => ({ title: "LA CAUSA", text: "Spesso il problema risiede in una tecnologia obsoleta o in una struttura poco chiara." }),
    (title: string, ind: string) => ({ title: "LA SOLUZIONE", text: "Ottimizzare il codice e semplificare il percorso d'acquisto è la chiave per ripartire." }),
    (title: string, ind: string) => ({ title: "IL BENEFICIO", text: "Meno frizione per l'utente significa più contatti qualificati per te." }),
    (title: string, ind: string) => ({ title: "CONTATTACI", text: "Sblocca il potenziale del tuo sito. Raccontaci la tua sfida in DM." })
  ],
  VIRAL_HOOK: [
    (title: string, ind: string) => ({ title, text: `Non restare fermo mentre il settore ${ind} si evolve. Il momento di agire è adesso.` })
  ]
};

// --- CAPTION GENERATOR ---
type Pillar = 'AUTHORITY' | 'EDUCATIONAL' | 'PROBLEM_SOLUTION' | 'PERSONAL_BRAND' | 'VIRAL_HOOK';

const generateCaption = (title: string, pillar: Pillar, ind: string, variant: number) => {
  const hooks: Record<string, string[]> = {
    AUTHORITY: [
      `Consiglio digitale per il settore ${ind}: l'esperienza utente vince sempre. 🏛️`,
      `Ecco perché la solidità tecnica è fondamentale nel settore ${ind}. 💎`,
      `Leadership digitale: come distinguersi nel settore ${ind}. 🚀`
    ],
    EDUCATIONAL: [
      `Pillola del giorno per chi opera nel settore ${ind}. 📊`,
      `Mini-guida: ottimizzare la tua presenza nel settore ${ind}. 💡`,
      `3 Cose da sapere subito sul web per il settore ${ind}. 📝`
    ],
    PROBLEM_SOLUTION: [
      `Come risolvere i problemi comuni del web nel settore ${ind}. ⚠️`,
      `Basta sprecare budget nel settore ${ind}. Ecco la soluzione. 🛠️`,
      `Il tuo sito nel settore ${ind} non funziona? Leggi qui. 🔍`
    ],
    VIRAL_HOOK: [
      `Il mondo digitale cambia, non restare indietro nel settore ${ind}. ⚡`,
      `La verità scomoda sul web nel settore ${ind}. 🤐`,
      `Stai ancora usando metodi del 2010 per il settore ${ind}? 🕒`
    ]
  };

  const bodies = [
    `In Link2Digital risolviamo problemi reali con soluzioni tecniche eleganti. Non creiamo solo siti, ma strumenti di lavoro che semplificano la tua vita.`,
    `Il nostro approccio è basato sui dati e sull'esperienza dell'utente. Vogliamo che il tuo business cresca in modo sano e costante.`,
    `Crediamo che la tecnologia debba essere un supporto, non un ostacolo. Ecco come vediamo l'evoluzione del web per il tuo settore.`
  ];

  const ctas = [
    "👉 Scrivici in DM se vuoi analizzare il tuo sito attuale.",
    "👉 Clicca sul link in bio per scoprire come lavoriamo.",
    "👉 Prenota un check gratuito della tua presenza online."
  ];

  const hookPool = hooks[pillar] || hooks.AUTHORITY;
  const hook = hookPool[variant % hookPool.length];
  const body = bodies[variant % bodies.length];
  const cta = ctas[variant % ctas.length];

  return `${hook} \n\n ${body} \n\n ${title} è un tema centrale oggi. \n\n ${cta} \n\n #Link2Digital #WebDevelopment #UX #DigitalStrategy #${ind.replace(/\s+/g, '')}`;
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
      caption: generateCaption(title, pillar, industry.title, styleVariant)
    });
  }
  
  return allPosts;
};
