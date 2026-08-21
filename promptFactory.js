/**
 * Formatta il testo sorgente per l'inclusione nel prompt
 */
export function formattaSource(keepNewlines, sorgente = "") {
    if (!keepNewlines) {
        sorgente = sorgente.replace(/[\s\r\t\n]+/g, " ").trim();
    }
    return keepNewlines ? `\n------\n${sorgente}\n------` : `"${sorgente}"`;
}

/**
 * Crea un task-prompt con una forma coerente: objective, output,
 * constraints, warnings, context. Unico punto da estendere se in
 * futuro serve un nuovo campo comune a tutti i prompt.
 */
export function creaTask({ objective, output, constraints = [], warnings = [], context } = {}) {
    return { objective, output, constraints, warnings, context };
}
