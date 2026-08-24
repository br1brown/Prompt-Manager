import { formattaSource, creaTask } from '../promptFactory.js';
import { PATTERN_SCRITTURA_AI } from '../data/patternScritturaAI.js';
import { toneProfiles } from '../data/toneProfiles.js';

// Tic e pattern da evitare, se assenti nell'originale. Sono elencati tutti
// insieme perché condividono un'unica motivazione (vedi CRITERI_BASE):
// spiegare il "perché" una volta sola, non ripeterlo riga per riga.
const TIC_AI = [
    "trattino (—, --, –) usato come inciso",
    "perifrasi come 'rappresenta', 'si configura come', 'funge da' al posto di un semplice 'è/sono' quando l'originale usa la forma semplice",
    "struttura 'non solo… ma anche…'",
    "attribuzioni vaghe (es. 'gli esperti sostengono', 'si osserva che') assenti nella fonte",
    "triadi retoriche (liste di tre elementi) assenti nel testo originale",
    "chiusure generiche tipo 'nonostante le sfide, il futuro è promettente'",
    "frasi gerundive di commento vuoto (es. 'sottolineando/evidenziando l'importanza di...') assenti nell'originale",
    ...PATTERN_SCRITTURA_AI.map(p => `${p.categoria} (es. ${p.esempi})`)
];

// Criteri di successo comuni a tutte le armonizzazioni, indipendenti dal tono
const CRITERI_BASE = [
    { regola: "Conserva riferimenti ed esempi se presenti" },
    { regola: "Mantieni il significato originale" },
    { regola: "Ottimizza solo la struttura, mai il messaggio" },
    { regola: "Usa solo paragrafi continui: niente grassetti, corsivi o elenchi puntati" },
    {
        regola: `Non introdurre, se assenti nell'originale: ${TIC_AI.join("; ")}`,
        perche: "sono i tic più riconoscibili della scrittura AI, rari nel parlato o scritto umano naturale: introdurli è il modo più rapido per tradire un testo generato"
    }
];

const EXAMPLES = [
    {
        input: "Il prodotto è molto innovativo. È un prodotto che rappresenta una svolta ed è, allo stesso tempo, all'avanguardia rispetto alla concorrenza.",
        output: "Il prodotto è innovativo e supera nettamente la concorrenza."
    }
];

// Funzione base per armonizzazione
const armonizzazioneBase = (keepNewlines, source, toneofvoice) => creaTask({
    task: `Armonizza il testo racchiuso nel tag <source>: elimina le ripetizioni semantiche e rendilo più scorrevole, senza alterarne il significato.`,

    source: formattaSource(keepNewlines, source),

    voice: toneofvoice,

    context: `Il testo deve risultare fluido, coerente e leggibile, senza perdita di informazioni specifiche.`,

    examples: EXAMPLES,

    criteri: CRITERI_BASE,

    outputFormat: `Testo armonizzato (nient'altro)`
});

/**
 * Genera dinamicamente i bottoni di armonizzazione dai toneProfiles
 */
export function generaArmonizzazioni() {
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
}
