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
 * serializzata a tag XML (best practice 2026 per prompt strutturati:
 * dati e istruzioni separati, mai testo libero concatenato):
 *
 *   - source: il materiale su cui lavorare (va in <source>, mai fuso nell'objective)
 *   - objective: l'istruzione, scritta per riferirsi al tag <source>
 *   - context: informazioni di sfondo utili all'esecuzione
 *   - examples: coppie { input, output } few-shot (0-3, facoltative)
 *   - constraints / warnings: regole positive e negative
 *   - output: lo schema/formato atteso della risposta
 *
 * Unico punto da estendere se in futuro serve un nuovo campo comune.
 */
export function creaTask({ objective, source, output, constraints = [], warnings = [], context, examples = [] } = {}) {
    return { objective, source, output, constraints, warnings, context, examples };
}
