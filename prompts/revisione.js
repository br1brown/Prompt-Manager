import { formattaSource, creaTask } from '../promptFactory.js';

export const revisione = [
    {
        label: "Correzione Sottotitoli",
        func: (keepNewlines, source) => creaTask({
            task: `Correggi esclusivamente gli errori grammaticali dovuti a trascrizioni errate e i problemi di punteggiatura nel testo racchiuso nel tag <source>.`,

            source: formattaSource(keepNewlines, source),

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

            examples: [
                {
                    input: "quindi oggi vi parlo di un argomento che mi sta molto a cuore che è quello dell intelligenza artificiale",
                    output: "Quindi oggi vi parlo di un argomento che mi sta molto a cuore, che è quello dell'intelligenza artificiale."
                }
            ],

            context: `Revisione minimale dei sottotitoli autogenerati da un video, focalizzandosi esclusivamente sulla correzione di errori grammaticali e punteggiatura. Le modifiche devono essere ridotte al minimo indispensabile, preservando completamente lo stile e il significato originale per garantire una lettura fluida e fedele.`
        })
    },
    {
        label: "Controllo Accuratezza",
        func: (keepNewlines, source) => creaTask({
            task: `Verifica tramite internet l'accuratezza delle informazioni nel testo racchiuso nel tag <source>. Segnala solo gli errori e le inesattezze, supportati da fonti affidabili.`,

            source: formattaSource(keepNewlines, source),

            outputFormat: `Restituisci un blocco <correzione> per ogni errore trovato, in questo schema:

<correzione>
<testo_originale>frase esatta tratta dal source</testo_originale>
<errore>spiegazione dell'inesattezza</errore>
<fonti>link alle fonti usate per la verifica</fonti>
<testo_corretto>proposta di correzione</testo_corretto>
</correzione>

Se non trovi errori, rispondi solo con: nessun errore riscontrato.`,

            constraints: [
                "Verifica solo fatti oggettivi",
                "Usa fonti autorevoli e fornisci link",
                "Ignora le informazioni corrette"
            ],

            warnings: [
                "Mantieni neutralità nelle correzioni"
            ],

            context: `Analisi e correzione di eventuali errori fattuali. L'obiettivo è garantire informazioni accurate, fornendo riferimenti affidabili senza alterare il significato originale.`
        })
    }
];
