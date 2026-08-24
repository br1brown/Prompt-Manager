/**
 * Normalizza il testo sorgente. La marcatura (tag <source>) è responsabilità
 * del renderer (PromptService), non di questa funzione: qui si tocca solo
 * il whitespace, mai la delimitazione.
 */
export function formattaSource(keepNewlines, sorgente = "") {
    return keepNewlines
        ? sorgente.trim()
        : sorgente.replace(/[\s\r\t\n]+/g, " ").trim();
}

/**
 * Crea un task-prompt con una forma coerente, pensata per essere
 * serializzata a tag XML (dati e istruzioni separati, mai testo libero
 * concatenato — è la struttura che i modelli attuali seguono in modo più
 * affidabile su prompt complessi). Ogni campo diventa un tag con lo stesso
 * nome (vedi PromptService.formatPromptResult): rinominare qui rinomina
 * anche il tag prodotto, non c'è un secondo posto da tenere allineato.
 *
 *   - source: il materiale su cui lavorare (mai fuso nel task)
 *   - task: l'istruzione operativa, scritta per riferirsi al tag <source>
 *   - voice: il tono di voce richiesto, quando pertinente
 *   - context: informazioni di sfondo utili all'esecuzione
 *   - metodo: come affrontare il task quando l'ordine dei passaggi conta
 *     (es. "valuta ogni affermazione singolarmente prima di rispondere") —
 *     va usato solo dove il ragionamento esplicito migliora il risultato,
 *     non è pertinente per un compito di pura riscrittura
 *   - examples: coppie { input, output } few-shot (0-3, facoltative)
 *   - criteri: condizioni di successo, ciascuna { regola, perche? } — il
 *     "perché" va scritto solo quando non è ovvio, non per ogni riga
 *   - outputFormat: lo schema/formato atteso della risposta
 *
 * Unico punto da estendere se in futuro serve un nuovo campo comune.
 */
export function creaTask({ task, source, voice, context, metodo, examples = [], criteri = [], outputFormat } = {}) {
    return { task, source, voice, context, metodo, examples, criteri, outputFormat };
}
