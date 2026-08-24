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
 * affidabile su prompt complessi):
 *
 *   - source: il materiale su cui lavorare (va in <source>, mai fuso nel task)
 *   - task: l'istruzione operativa, scritta per riferirsi al tag <source>
 *   - voice: il tono di voce richiesto, quando pertinente (sezione propria,
 *     non un vincolo tra gli altri: è l'unica cosa che l'utente sceglie a mano)
 *   - context: informazioni di sfondo utili all'esecuzione
 *   - examples: coppie { input, output } few-shot (0-3, facoltative)
 *   - constraints / warnings: regole da rispettare e pattern da evitare
 *   - outputFormat: lo schema/formato atteso della risposta
 *
 * Unico punto da estendere se in futuro serve un nuovo campo comune.
 */
export function creaTask({ task, source, voice, outputFormat, constraints = [], warnings = [], context, examples = [] } = {}) {
    return { task, source, voice, outputFormat, constraints, warnings, context, examples };
}
