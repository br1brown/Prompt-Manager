import { formattaSource, creaTask } from '../promptFactory.js';
import { LESSICO_VIETATO } from '../data/lessico.js';
import { toneProfiles } from '../data/toneProfiles.js';

// Vincoli e avvertenze comuni a tutte le armonizzazioni (indipendenti dal tono)
const CONSTRAINTS_BASE = [
    "Conserva riferimenti ed esempi se presenti",
    "Mantieni il significato originale",
    "Ottimizzare solo la struttura senza alterare il messaggio",
    "Nessun trattino (—, --, –) usato come inciso",
    "Non sostituire 'è/sono' con perifrasi come 'rappresenta', 'si configura come', 'funge da' quando l'originale usa la forma semplice"
];

const WARNINGS_BASE = [
    "Usa solo paragrafi; al loro interno niente grassetti, corsivi o elenchi",
    "Non usare il Lessico vietato nemmeno come sinonimi indiretti, a meno che non siano già nel testo originale",
    "Non introdurre strutture tipo 'non solo… ma anche…' se non già presenti nel testo",
    "Non introdurre attribuzioni vaghe (es. 'gli esperti sostengono', 'si osserva che') se non presenti nella fonte",
    "Non aggiungere triadi retoriche (liste di tre elementi) assenti nel testo originale",
    "Non chiudere con formule generiche tipo 'nonostante le sfide, il futuro è promettente'",
    "Non aggiungere frasi gerundive di commento vuoto (es. 'sottolineando/evidenziando l'importanza di...') assenti nell'originale"
];

const EXAMPLES = [
    {
        input: "Il prodotto è molto innovativo. È un prodotto che rappresenta una svolta ed è, allo stesso tempo, all'avanguardia rispetto alla concorrenza.",
        output: "Il prodotto è innovativo e supera nettamente la concorrenza."
    }
];

// Funzione base per armonizzazione
const armonizzazioneBase = (keepNewlines, source, toneofvoice) => {
    return creaTask({
        objective: `Armonizza il testo racchiuso nel tag <source>: elimina le ripetizioni semantiche e rendilo più scorrevole, senza alterarne il significato.`,

        source: formattaSource(keepNewlines, source),

        output: `Testo armonizzato (nient’altro)`,

        constraints: [
            `IMPORTANTE: Il tono è ${toneofvoice}`,
            ...CONSTRAINTS_BASE
        ],

        warnings: WARNINGS_BASE,

        examples: EXAMPLES,

        context: `Il testo deve risultare fluido, coerente e leggibile, senza perdita di informazioni specifiche.\n\n**Lessico vietato (case-insensitive):** ${LESSICO_VIETATO}`
    });
};

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
