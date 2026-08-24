import { formattaSource, creaTask } from '../promptFactory.js';

export const revisione = [
    {
        label: "Correzione Sottotitoli",
        func: (keepNewlines, source) => creaTask({
            task: `Correggi esclusivamente gli errori grammaticali dovuti a trascrizioni errate e i problemi di punteggiatura nel testo racchiuso nel tag <source>.`,

            source: formattaSource(keepNewlines, source),

            context: `Revisione minimale di sottotitoli autogenerati da un video: le modifiche vanno ridotte al minimo indispensabile, preservando stile e significato originali per una lettura fluida e fedele.`,

            examples: [
                {
                    input: "quindi oggi vi parlo di un argomento che mi sta molto a cuore che è quello dell intelligenza artificiale",
                    output: "Quindi oggi vi parlo di un argomento che mi sta molto a cuore, che è quello dell'intelligenza artificiale."
                }
            ],

            criteri: [
                { regola: "Resta fedele all'originale: stile, tono e struttura delle frasi non cambiano" },
                { regola: "Interveni solo in presenza di errori evidenti", perche: "è una correzione minima, non una riscrittura" },
                { regola: "Non modificare i riferimenti temporali, se presenti" },
                { regola: "Correggi la punteggiatura solo per migliorare la comprensione, senza alterare il contenuto" },
                { regola: "Accorpa le parole spezzate dalla trascrizione automatica quando migliora la leggibilità" }
            ],

            outputFormat: `Testo corretto (nient'altro)`
        })
    },
    {
        label: "Controllo Accuratezza",
        func: (keepNewlines, source) => creaTask({
            task: `Verifica tramite internet l'accuratezza delle informazioni nel testo racchiuso nel tag <source>. Segnala solo gli errori e le inesattezze, supportati da fonti affidabili.`,

            source: formattaSource(keepNewlines, source),

            context: `Analisi e correzione di eventuali errori fattuali, per garantire informazioni accurate senza alterare il significato originale.`,

            metodo: `Per ciascuna affermazione verificabile nel testo, valutala singolarmente: individuala, verificala con fonti autorevoli, poi decidi se merita una segnalazione. Non mostrare questo processo nella risposta finale: nella risposta compaiono solo i blocchi <correzione>, o l'esito "nessun errore riscontrato".`,

            criteri: [
                { regola: "Verifica solo fatti oggettivi, non opinioni" },
                { regola: "Usa fonti autorevoli e cita sempre il link" },
                { regola: "Ignora le informazioni già corrette: segnala solo gli errori" },
                { regola: "Mantieni un tono neutro nelle correzioni proposte" }
            ],

            outputFormat: `Restituisci un blocco <correzione> per ogni errore trovato, in questo schema:

<correzione>
<testo_originale>frase esatta tratta dal source</testo_originale>
<errore>spiegazione dell'inesattezza</errore>
<fonti>link alle fonti usate per la verifica</fonti>
<testo_corretto>proposta di correzione</testo_corretto>
</correzione>

Se non trovi errori, rispondi solo con: nessun errore riscontrato.`
        })
    }
];
