import { formattaSource, creaTask } from '../promptFactory.js';
import { PATTERN_SCRITTURA_AI } from '../data/patternScritturaAI.js';
import { toneProfiles } from '../data/toneProfiles.js';

// Tic e pattern da evitare, se assenti nell'originale. Ognuno ha un id
// perché un tono può escluderne singolarmente uno (es. un tono polemico
// può voler tenere le triadi retoriche) senza dover riscrivere l'intera
// lista: vedi ECCEZIONI_TONO più sotto.
const TIC_AI = [
    { id: "em-dash", testo: "trattino (—, --, –) usato come inciso" },
    { id: "perifrasi-essere", testo: "perifrasi come 'rappresenta', 'si configura come', 'funge da' al posto di un semplice 'è/sono' quando l'originale usa la forma semplice" },
    { id: "non-solo-ma-anche", testo: "struttura 'non solo… ma anche…'" },
    { id: "attribuzioni-vaghe", testo: "attribuzioni vaghe (es. 'gli esperti sostengono', 'si osserva che') assenti nella fonte" },
    { id: "triadi-retoriche", testo: "triadi retoriche (liste di tre elementi) assenti nel testo originale" },
    { id: "chiusure-generiche", testo: "chiusure generiche tipo 'nonostante le sfide, il futuro è promettente'" },
    { id: "gerundi-vuoti", testo: "frasi gerundive di commento vuoto (es. 'sottolineando/evidenziando l'importanza di...') assenti nell'originale" },
    ...PATTERN_SCRITTURA_AI.map(p => ({ id: `pattern-${p.categoria.split(" ")[0]}`, testo: `${p.categoria} (es. ${p.esempi})` }))
];

// Criteri di successo comuni a tutte le armonizzazioni, prima di eventuali
// eccezioni di tono. Ognuno ha un "livello":
//   - "fedelta": vincoli sul contenuto, mai negoziabili con nessun tono
//     (non è una preferenza stilistica: è il confine stesso del task,
//     "riformula senza alterare")
//   - "stile": regole sul "come", dove un tono esplicito può avere la
//     priorità se confligge (vedi ECCEZIONI_TONO e PromptService)
// Anche questi hanno un id, per permettere a un tono di escluderne uno
// specifico senza riscrivere l'intera lista.
const CRITERI_BASE = [
    { id: "conserva-riferimenti", livello: "fedelta", regola: "Conserva riferimenti ed esempi se presenti" },
    { id: "mantieni-significato", livello: "fedelta", regola: "Mantieni il significato originale" },
    { id: "solo-struttura", livello: "fedelta", regola: "Ottimizza solo la struttura, mai il messaggio" },
    { id: "solo-paragrafi", livello: "fedelta", regola: "Usa solo paragrafi continui: niente grassetti, corsivi o elenchi puntati" },
    {
        id: "ritmo-frasi",
        livello: "stile",
        regola: "Alterna la lunghezza delle frasi: non più di due o tre frasi consecutive di lunghezza e struttura simili",
        perche: "il ritmo uniforme (bassa 'burstiness') è il segnale più affidabile con cui lettori e rilevatori riconoscono un testo generato da un'AI, più delle singole parole usate"
    }
];

/**
 * Costruisce i criteri per un tono: parte dal set comune, toglie le voci
 * (di CRITERI_BASE o di TIC_AI) che quel tono esclude esplicitamente, e
 * aggiunge le eventuali regole specifiche del tono (sempre di livello
 * "stile": sono già scritte su misura per quel tono, non c'è nulla da
 * arbitrare). Un tono senza eccezioni ottiene semplicemente il set comune
 * per intero: aggiungerne uno nuovo non richiede toccare questa funzione.
 */
function costruisciCriteri(escludiCriteri = [], criteriExtra = []) {
    const ticAttivi = TIC_AI.filter(t => !escludiCriteri.includes(t.id));
    // Sotto-elenco vero, non una riga con i pattern separati da
    // punto e virgola: più lungo, ma il modello lo scansiona invece di
    // doverlo analizzare come prosa compressa. Il "perché" resta unico,
    // in testa, non ripetuto per ogni voce.
    const criterioTic = ticAttivi.length > 0 ? [{
        livello: "stile",
        regola: `Non introdurre questi pattern, se assenti nell'originale (perché: sono i tic più riconoscibili della scrittura AI, rari nel parlato o scritto umano naturale: introdurli è il modo più rapido per tradire un testo generato):\n`
            + ticAttivi.map(t => `  - ${t.testo}`).join("\n")
    }] : [];

    return [
        ...CRITERI_BASE.filter(c => !escludiCriteri.includes(c.id)),
        ...criterioTic,
        ...criteriExtra.map(c => ({ livello: "stile", ...c }))
    ];
}

// Eccezioni ai criteri/esempi comuni, per profilo: qui un tono dichiara solo
// cosa lo rende diverso dal comportamento di default (escludiCriteri,
// criteriExtra, esempiExtra), non l'intero prompt da zero. Un profilo
// assente da questa mappa (o un tono personalizzato scritto a mano) usa il
// set comune così com'è: aggiungere un nuovo tono in toneProfiles.js non
// richiede nessuna modifica qui, a meno che quel tono non abbia davvero
// bisogno di una sua eccezione.
const ECCEZIONI_TONO = {
    "Schierato Fortissimo": {
        escludiCriteri: ["triadi-retoriche"],
        criteriExtra: [
            { regola: "Le triadi retoriche e le formule a effetto sono benvenute: è il registro tipico di un tono militante e polemico" }
        ]
    },
    "Messaggio in Chat": {
        escludiCriteri: ["ritmo-frasi"],
        criteriExtra: [
            { regola: "Frasi anche tutte molto brevi vanno bene: è il ritmo naturale di una chat, non un difetto da correggere" }
        ]
    },
    // Dalla style guide dell'autore. Presa solo la parte di voce/metodo
    // applicabile ad "armonizza un testo esistente senza aggiungerne il
    // contenuto": la struttura dell'episodio (apertura/sigla/chiusura) e
    // il parallelo storico ricorrente restano fuori, perché richiederebbero
    // di aggiungere materiale assente dal source, non solo di riformularlo
    "alla 'Occhio al mondo'": {
        criteriExtra: [
            {
                regola: "Quando nel testo compare un'interpretazione o una posizione, dichiarala esplicitamente come tale (es. 'questa è una mia lettura', 'non sto dicendo che X, sto dicendo che...'), distinguendola da ciò che è un fatto verificato",
                perche: "è la cifra distintiva del tono: prendere posizione senza mai far passare un'opinione per un dato di fatto"
            },
            {
                regola: "Se il source riporta già numeri o date precisi, mantienili esatti invece di genericizzarli (mai 'recentemente' o 'molte persone' al posto di un dato preciso già presente); se il source stesso è vago, non inventare una precisione che non c'è",
                perche: "il tono rifiuta le formule vaghe quando un dato preciso è disponibile, ma inventarne uno violerebbe la fedeltà al testo originale"
            },
            { regola: "Rivolgiti direttamente a chi legge, in seconda persona, quando il registro del testo lo permette" },
            { regola: "Le domande retoriche usate come cerniera tra un blocco e l'altro sono benvenute" }
        ],
        esempiExtra: [
            {
                input: "Le aziende hanno ridotto le tutele sulla privacy. È una scelta pericolosa.",
                output: "Le aziende hanno ridotto le tutele sulla privacy: questo è un fatto verificabile. Quello che segue è la mia lettura, dichiarata come tale: è una scelta pericolosa."
            }
        ]
    }
};

// Tre esempi, ciascuno mirato a un criterio diverso: un modello generalizza
// meglio imitando casi vari che applicando una regola astratta. In ordine
// di difficoltà crescente (l'ultimo, il più sottile, resta più fresco in
// memoria: i modelli pesano di più ciò che leggono per ultimo)
const EXAMPLES = [
    {
        input: "Il prodotto è molto innovativo. È un prodotto che rappresenta una svolta ed è, allo stesso tempo, all'avanguardia rispetto alla concorrenza.",
        output: "Il prodotto è innovativo e supera nettamente la concorrenza."
    },
    {
        input: "L'azienda ha annunciato il nuovo prodotto. Il prodotto introduce diverse funzionalità utili. Gli utenti possono personalizzare l'interfaccia. Le prime recensioni sono positive.",
        output: "L'azienda ha annunciato il nuovo prodotto, che introduce diverse funzionalità utili e permette agli utenti di personalizzare l'interfaccia. Le prime recensioni sono positive."
    },
    {
        input: "Dopo un'attenta analisi del testo, si può notare che il fatturato è cresciuto del 12% rispetto all'anno precedente.",
        output: "Il fatturato è cresciuto del 12% rispetto all'anno precedente."
    }
];

// Funzione base per armonizzazione
const armonizzazioneBase = (keepNewlines, source, toneofvoice, eccezioni = {}) => creaTask({
    task: `Armonizza il testo racchiuso nel tag <source>: elimina le ripetizioni semantiche e rendilo più scorrevole, senza alterarne il significato.`,

    source: formattaSource(keepNewlines, source),

    voice: toneofvoice,

    context: `Il testo deve risultare fluido, coerente e leggibile, senza perdita di informazioni specifiche.`,

    examples: [...EXAMPLES, ...(eccezioni.esempiExtra || [])],

    criteri: costruisciCriteri(eccezioni.escludiCriteri, eccezioni.criteriExtra),

    outputFormat: `Testo armonizzato (nient'altro)`
});

/**
 * Genera dinamicamente i bottoni di armonizzazione dai toneProfiles
 */
export function generaArmonizzazioni() {
    const armonizzazioni = [];

    // Bottoni per ogni profilo tono
    Object.entries(toneProfiles).forEach(([profileName, profile]) => {
        const eccezioni = ECCEZIONI_TONO[profileName] || {};
        armonizzazioni.push({
            label: profileName,
            tone: profile.tones,
            func: (keepNewlines, source) => armonizzazioneBase(keepNewlines, source, profile.tones, eccezioni)
        });
    });

    // Bottone "Armonizza" (tono invariato)
    armonizzazioni.push({
        label: "Armonizza",
        tone: "invariato",
        func: (keepNewlines, source) => armonizzazioneBase(keepNewlines, source, "invariato")
    });

    // Bottone "Personalizzata" (apre modale): tono scritto a mano, nessuna
    // eccezione nota a priori, si applica il set comune
    armonizzazioni.push({
        label: "Personalizzata",
        needsModal: true,
        func: (keepNewlines, source, toneofvoice) => armonizzazioneBase(keepNewlines, source, toneofvoice || "invariato")
    });

    return armonizzazioni;
}
