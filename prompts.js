function formattaSource(keepNewlines, sorgente = "") {
    if (!keepNewlines) {
        sorgente = sorgente.replace(/[\s\r\t\n]+/g, " ").trim();
    }
    return keepNewlines ? `\n------\n${sorgente}\n------` : `"${sorgente}"`;
}

const COMMON_WARNINGS = [];

// Funzione base per armonizzazione
const armonizzazioneBase = (keepNewlines, source, toneofvoice) => {
    const formattedSource = formattaSource(keepNewlines, source);

    const LESSICO_VIETATO = "può, potrebbe, solo, molto, davvero, letteralmente, effettivamente, certamente, probabilmente, fondamentalmente, approfondire, intraprendere, illuminante, stimato, fare luce, creare, immaginare, regno, rivoluzionario, sbloccare, scoprire, alle stelle, abisso, non sei solo, in un mondo dove, rivoluzionare, dirompente, utilizzare, tuffarsi, arazzo, illuminare, svelare, cruciale, intricato, chiarire, quindi, inoltre, tuttavia, sfruttare, entusiasmante, innovativo, all\'avanguardia, notevole, resta da vedere, scorcio, navigare, paesaggio, crudo, testimonianza, riassumendo, in sintesi, potenziare, vertiginoso, aprire, potente, richieste, in continua evoluzione";

    return {
        objective: `Armonizza il seguente testo eliminando ripetizioni semantiche e rendendolo più scorrevole, senza alterarne il significato: ${formattedSource}`,

        output: `Testo armonizzato (nient’altro)`,

        constraints: [
            `IMPORTANTE: Il tono è ${toneofvoice}`,
            "Conserva riferimenti ed esempi se presenti",
            "Mantieni il significato originale",
            "Ottimizzare solo la struttura senza alterare il messaggio",
            "Nessun trattino (—, --, –) usato come inciso"
        ],

        warnings: [
            "Usa solo paragrafi; al loro interno niente grassetti, corsivi o elenchi",
            "Non usare il Lessico vietato nemmeno come sinonimi indiretti, a meno che non siano già nel testo originale",
            "Non introdurre strutture tipo 'non solo… ma anche…' se non già presenti nel testo"
        ],

        context: `Il testo deve risultare fluido, coerente e leggibile, senza perdita di informazioni specifiche.\n\n**Lessico vietato (case-insensitive):** ${LESSICO_VIETATO}`
    };
};

// Profili tono (UNICA FONTE DI VERITÀ)
const toneProfiles = {
    "Divulgatore Corporate": {
        description: "Per spiegare concetti in modo chiaro, professionale e accessibile",
        icon: "fas fa-graduation-cap",
        tones: "formale e professionale, didattico, chiaro, competente, accessibile, neutro, autorevole",
    },
    "Messaggio in Chat": {
        description: "Per conversazioni ultra-informali e immediate, come in una chat",
        icon: "fas fa-comments",
        tones: "super colloquiale, con abbreviazioni, da linguaggio parlato, come una conversazione tra amici, un po' scemetto, spontaneo, con slang da internet e tipico dei social",
    },
    "alla 'Occhio al mondo'": {
        description: "Per contenuti dalla visione chiara e semplice raccontate in modo scanzonato",
        icon: "fas fa-video",
        tones: "ironico, scanzonato, appena caustico, con posizione chiara sui temi trattati, deciso e diretto ma non troppo distruttivo, accattivante",
    },
    "Schierato Fortissimo": {
        description: "Per contenuti radicali con posizioni estreme e polarizzanti",
        icon: "fas fa-bullhorn",
        tones: "militante, rabbioso, provocatorio, fortemente polemico, radicale, deciso, polarizzante, assertivo",
    }
};

// Genera dinamicamente i bottoni di armonizzazione dai toneProfiles
const generaArmonizzazioni = () => {
    const armonizzazioni = [];

    // Bottoni per ogni profilo tono
    Object.entries(toneProfiles).forEach(([profileName, profile]) => {
        armonizzazioni.push({
            label: profileName,
            tone: profile.tones,
            func: (keepNewlines, source) => armonizzazioneBase(keepNewlines, source, profile.tones)
        });
    });

    // Bottone "Armonizza" (tono invariato)
    armonizzazioni.push({
        label: "Armonizza",
        tone: "invariato",
        func: (keepNewlines, source) => armonizzazioneBase(keepNewlines, source, "invariato")
    });

    // Bottone "Personalizzata" (apre modale)
    armonizzazioni.push({
        label: "Personalizzata",
        needsModal: true,
        func: (keepNewlines, source, toneofvoice) => armonizzazioneBase(keepNewlines, source, toneofvoice || "invariato")
    });

    return armonizzazioni;
};

const config = {
    "Armonizzazioni": generaArmonizzazioni(),
    "Revisione": [
        {
            label: "Correzione Sottotitoli",
            func: (keepNewlines, source) => {
                return {
                    objective: `Correggi esclusivamente gli errori grammaticali dovuti a trascrizioni errate e i problemi di punteggiatura nel seguente testo: ${formattaSource(keepNewlines, source)}`,

                    constraints: [
                        "Il testo deve rimanere fedele all'originale",
                        "Non cambiare lo stile, il tono o la struttura delle frasi",
                        "Non riscrivere il testo: intervieni solo in presenza di errori evidenti",
                        "Non modificare i riferimenti temporali (se presenti)",
                        "Ottimizza solo la punteggiatura per migliorare la comprensione, senza alterare il contenuto"
                    ],

                    warnings: [
                        "Cerca di accorpare parole singole per migliorare la leggibilità"
                    ],

                    context: `Revisione minimale dei sottotitoli autogenerati da un video, focalizzandosi esclusivamente sulla correzione di errori grammaticali e punteggiatura. Le modifiche devono essere ridotte al minimo indispensabile, preservando completamente lo stile e il significato originale per garantire una lettura fluida e fedele.`
                };
            }
        },
        {
            label: "Controllo Accuratezza",
            func: (keepNewlines, source) => {
                return {
                    objective: `Verifica tramite internet l'accuratezza delle informazioni nel seguente testo: ${formattaSource(keepNewlines, source)}\nMostra solo gli errori e le inesattezze da correggere solo supportate da fonti affidabili`,

                    output: `---
Testo originale
[Spiegazione dell'errore], Fonti
Testo corretto proposto
---`,

                    constraints: [
                        "Verifica solo fatti oggettivi",
                        "Usa fonti autorevoli e fornisci link",
                        "Ignora le informazioni corrette"
                    ],

                    warnings: [
                        "Mantieni neutralità nelle correzioni"
                    ],

                    context: `Analisi e correzione di eventuali errori fattuali. L'obiettivo è garantire informazioni accurate, fornendo riferimenti affidabili senza alterare il significato originale.`
                };
            }
        }
    ]
};

const linkAI = [
    { nome: "Claude", url: "https://claude.ai/new", app: "claude://chat" },
    { nome: "ChatGPT", url: "https://chatgpt.com/", app: "chatgpt://" },
    { nome: "Perplexity", url: "https://www.perplexity.ai", app: "perplexity://" },
    { nome: "DeepSeek", url: "https://chat.deepseek.com/", app: "deepseek://" },
    { nome: "Copilot", url: "https://copilot.microsoft.com/", app: "ms-copilot://" },
    { nome: "Grok / X", url: "https://x.com/i/grok", app: "twitter://grok" },
    { nome: "Gemini", url: "https://gemini.google.com", app: "googleapp://google.com/gemini" },
    { nome: "HuggingChat", url: "https://huggingface.co/chat/", app: null },
    { nome: "Mistral AI", url: "https://chat.mistral.ai/chat", app: null },
    { nome: "Meta AI", url: "https://www.meta.ai", app: "fb-messenger://m.me/" }
];