function formattaSource(keepNewlines, sorgente = "") {
    if (!keepNewlines) {
        sorgente = sorgente.replace(/[\s\r\t\n]+/g, " ").trim();
    }
    return keepNewlines ? `\n------\n${sorgente}\n------` : `"${sorgente}"`;
}

const SocialTag = (keepNewlines, source, toneOfVoice, social, type) => {
    const platform = social ? `per ${social}` : "per le piattaforme digitali";
    const adaptation = social ? `${social}` : "delle piattaforme";
    const commonWarnings = [
        "Solo elementi pertinenti al contenuto",
        "Evita elementi spam o troppo generici",
    ];

    let objectiveSuffix, returnFormat, warnings;
    switch (type) {
        case "tag":
            objectiveSuffix = "una lista di tag separati da virgole";
            returnFormat = "tag1, tag2, tag3, tag4, ...";
            warnings = [
                "Massimo 500 caratteri totali",
                "Non usare hashtag (#), solo parole chiave",
                ...commonWarnings,
            ];
            break;
        case "hashtag":
            objectiveSuffix = "una lista di hashtag ottimizzati";
            returnFormat = "#hashtag1 #hashtag2 #hashtag3 ...";
            warnings = [
                "Da un minimo di 3 a un massimo di 15 hashtag",
                "Includi un mix bilanciato di hashtag di nicchia, medi e popolari",
                ...commonWarnings,
            ];
            break;
        default:
            throw new Error("Tipo non valido: scegli tra 'tag' o 'hashtag'");
    }

    return {
        objective: `Genera ${objectiveSuffix} partendo dal seguente contenuto:\n${formattaSource(keepNewlines, source)}`,
        output: returnFormat,
        warnings,
        context: `Strategia di ottimizzazione avanzata ${platform}. L’obiettivo è aumentare la visibilità e il coinvolgimento, applicando le best practice ${adaptation} per migliorare il posizionamento nei feed e l’engagement organico.`
    };
};

const COMMON_WARNINGS = [
  "Rimanere pertinente al contenuto",
];

const config = {
    "Social Tag": [
        {
            label: "Tag SEO",
            func: (keepNewlines, source, toneOfVoice, social) => SocialTag(keepNewlines, source, toneOfVoice, social, "tag"),
        },
        {
            label: "#hashtag",
            func: (keepNewlines, source, toneOfVoice, social) => SocialTag(keepNewlines, source, toneOfVoice, social, "hashtag"),
        },
    ],
    "Produzione Testi": [
        {
            label: "Armonizzazione Stile",
            func: (keepNewlines, source, toneofvoice) => {
        const formattedSource = formattaSource(keepNewlines, source);

        const LESSICO_VIETATO = `
"Può", "potrebbe", "solo", "molto", "davvero", "letteralmente", "effettivamente", "certamente", "probabilmente", "fondamentalmente", "approfondire", "intraprendere", "illuminante", "stimato", "fare luce", "creare", "immaginare", "regno", "rivoluzionario", "sbloccare", "scoprire", "alle stelle", "abisso", "non sei solo", "in un mondo dove", "rivoluzionare", "dirompente", "utilizzare", "tuffarsi", "arazzo", "illuminare", "svelare", "cruciale", "intricato", "chiarire", "quindi", "inoltre", "tuttavia", "sfruttare", "entusiasmante", "innovativo", "all'avanguardia", "notevole", "resta da vedere", "scorcio", "navigare", "paesaggio", "crudo", "testimonianza", "riassumendo", "in sintesi", "potenziare", "vertiginoso", "aprire", "potente", "richieste", "in continua evoluzione"
`;

        return {
            objective: `Armonizza il seguente testo eliminando ripetizioni semantiche e rendendolo più scorrevole, senza alterarne il significato:\n${formattedSource}`,

            output: `Testo armonizzato (nient’altro)`,

            warnings: [
				`IMPORTANTE: Il tono è ${toneofvoice}`,
                "Mantieni chiarezza, coerenza e fluidità",
                "Conserva riferimenti, esempi e stile retorico se presenti",
                "Non inserire commenti, spiegazioni o aggiunte",
				"Nessun trattino (—, --, –) usato come inciso o segno di punteggiatura; consentiti solo nelle parole composte",
				"Usa solo paragrafi; al loro interno niente grassetti, corsivi o elenchi",
				"Non introdurre strutture tipo 'non solo… ma anche…' se non già presenti nel testo",
				...COMMON_WARNINGS
            ],

            context: `Il testo deve risultare fluido, coerente e leggibile, senza perdita di informazioni specifiche.\n\n**Lessico vietato (case-insensitive):** non usare le seguenti parole nemmeno come sinonimi indiretti, a meno che non siano già nel testo originale:${LESSICO_VIETATO}`
        };
            }
        },
        {
            label: "Carosello Instagram",
            func: (keepNewlines, source, toneofvoice) => {
                return {
                    objective: `Crea un testo coinvolgente per carosello Instagram basato su: ${formattaSource(keepNewlines, source)}\nIl testo deve essere informativo, coinvolgente e strutturato per mantenere l'attenzione`,
                    output: `
[TITOLO PRINCIPALE]
ANTICIPAZIONE

[emoji] Titolo Slide 1
Contenuto Slide 1

[emoji] Titolo Slide 2
Contenuto Slide 2

...e così via per tutte le slide necessarie
`,
                    warnings: [
                        `Tono e linguaggio ${toneofvoice}`,
                        "Uso moderato delle emoji",
						...COMMON_WARNINGS
                    ],
                    context: `Struttura di un carosello Instagram ottimizzato per engagement. Deve mantenere una progressione logica, alternando informazione e intrattenimento`,
                };
            }
        }
    ],
    "Revisione": [
        {
            label: "Correzione Sottotitoli",
            func: (keepNewlines, source, toneofvoice) => {
                return {
                    objective: `Correggi esclusivamente gli errori grammaticali dovuti a trascrizioni errate e i problemi di punteggiatura nel seguente testo: ${formattaSource(keepNewlines, source)}\nIl testo deve rimanere il più possibile fedele all'originale.`,
                    warnings: [
                        "Non cambiare lo stile, il tono o la struttura delle frasi",
                        "Non riscrivere il testo: intervieni solo in presenza di errori evidenti",
                        "Cerca di accorpare parole singole per migliorare la leggibilità",
                        "Non modificare i riferimenti temporali (se presenti)",
                        "Ottimizza solo la punteggiatura per migliorare la comprensione, senza alterare il contenuto",
						...COMMON_WARNINGS
                    ],
                    context: `Revisione minimale dei sottotitoli, focalizzata esclusivamente sulla correzione di errori grammaticali evidenti e sulla punteggiatura. Le modifiche devono essere ridotte al minimo indispensabile, preservando completamente lo stile e il significato originale per garantire una lettura fluida e fedele.`
                };
            }
        },
        {
            label: "Controllo Accuratezza",
            func: (keepNewlines, source) => {
                return {
                    objective: `Verifica, anche tramite internet, l'accuratezza delle informazioni nel seguente testo: ${formattaSource(keepNewlines, source)}\nMostra solo gli errori e le inesattezze da correggere solo supportate da fonti affidabili`,
                    output: `---
Testo originale
[Spiegazione dell'errore], Fonti
Testo corretto proposto
---`,
                    warnings: [
                        "Verifica solo fatti oggettivi",
                        "Usa fonti autorevoli e fornisci link",
                        "Ignora le informazioni corrette",
                        "Mantieni neutralità nelle correzioni",
						...COMMON_WARNINGS
                    ],
                    context: `Analisi e correzione di eventuali errori fattuali. L'obiettivo è garantire informazioni accurate, fornendo riferimenti affidabili senza alterare il significato originale`,
                };
            }
        }
    ],
};
const toneProfiles = {
    "Divulgatore Corporate": {
        description: "Per spiegare concetti in modo chiaro, professionale e accessibile",
        icon: "fas fa-graduation-cap",
        tones: "formale e professionale, didattico, chiaro, competente, accessibile, neutro, autorevole"
    },
    "Messaggio in Chat": {
        description: "Per conversazioni ultra-informali e immediate, come in una chat",
        icon: "fas fa-comments",
        tones: "super colloquiale, con abbreviazioni, da linguaggio parlato, come una conversazione tra amici, un po' scemetto, spontaneo, con slang da internet e tipico dei social"

    },
    "alla 'Occhio al mondo'": {
        description: "Per contenuti dalla visione chiara e semplice raccontate in modo scanzonato",
        icon: "fas fa-video",
        tones: "ironico, scanzonato, appena caustico, con posizione chiara sui temi trattati, deciso e diretto ma non troppo distruttivo, accattivante"

    },
    "Schierato Fortissimo": {
        description: "Per contenuti radicali con posizioni estreme e polarizzanti",
        icon: "fas fa-bullhorn",
        tones: "militante, rabbioso, provocatorio, fortemente polemico, radicale, deciso, polarizzante, assertivo"
    }
};

const linkAI = [
    { nome: "Claude", url: "https://claude.ai/new" },
    { nome: "ChatGPT", url: "https://chatgpt.com/" },
    { nome: "Perplexity", url: "https://www.perplexity.ai" },
    { nome: "DeepSeek", url: "https://chat.deepseek.com/" },
    { nome: "Copilot", url: "https://copilot.microsoft.com/" },
    { nome: "Grok / X", url: "https://x.com/i/grok" },
    { nome: "Gemini", url: "https://gemini.google.com" },
    { nome: "HuggingChat", url: "https://huggingface.co/chat/" },
    { nome: "Mistral AI", url: "https://chat.mistral.ai/chat" },
    { nome: "Meta AI", url: "https://www.meta.ai" }
];
