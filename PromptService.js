import { config } from './config.js';

/**
 * Classe per la gestione della generazione dei prompt
 */
export class PromptService {
    constructor() {
        this.lastClickedButton = null;
        this.selectedTone = null;
    }

    /**
     * Genera il prompt basato sui parametri forniti
     */
    generatePrompt(button, keepNewlines, callback) {
        const source = $('#txtSource').val().trim();
        if (!source) return;

        this.lastClickedButton = button;

        const type = button.data("type");
        const index = button.data("index");
        const buttonConfig = config[type][index];

        // Se il bottone ha un tono embedded, usalo
        // Altrimenti usa il tono selezionato dalla modale (per "Personalizzata")
        const tone = buttonConfig.tone || this.selectedTone || "invariato";

        const task = buttonConfig.func(keepNewlines, source, tone);
        const result = this.formatPromptResult(task);

        $("#Risultato").val(result);
        this.resetPreviewState();

        if (callback) callback();
    }

    /**
     * Ogni nuova generazione riparte collassata: si vedono solo le prime
     * righe del risultato (il resto sfuma nello sfondo, vedi CSS), con
     * "Vedi il prompt completo" per espandere. Chi genera e copia non deve
     * leggere per forza tutto il prompt: quel dettaglio resta disponibile
     * ma non è imposto a chi non lo vuole (legge di Tesler).
     */
    resetPreviewState() {
        $('.result-textarea-wrapper').removeClass('is-empty expanded');
        $('#togglePreview').prop('hidden', false).attr('aria-expanded', 'false').text('Vedi il prompt completo');
    }

    /**
     * Serializza il task in un prompt a tag XML: è la struttura che i
     * modelli attuali seguono in modo più affidabile su prompt complessi,
     * perché separa nettamente i dati (il testo dell'utente, potenzialmente
     * non fidato) dalle istruzioni, invece di concatenarli come testo
     * libero. Ordine: il materiale sorgente per primo (i documenti lunghi
     * vanno letti prima della richiesta), le istruzioni operative alla
     * fine, così il modello le legge per ultime, subito prima di rispondere.
     */
    formatPromptResult(task) {
        if (!task) return "Nessun task fornito.";

        const section = (tag, content) => content ? `<${tag}>\n${content}\n</${tag}>` : null;
        const list = (items) => items.map(item => `- ${item}`).join("\n");

        const examplesBlock = Array.isArray(task.examples) && task.examples.length > 0
            ? task.examples.map(ex =>
                `<example>\n<input>\n${ex.input}\n</input>\n<output>\n${ex.output}\n</output>\n</example>`
            ).join("\n")
            : null;

        const parts = [
            section("source", task.source),
            section("task", task.objective),
            section("context", task.context),
            section("examples", examplesBlock),
            Array.isArray(task.constraints) && task.constraints.length > 0
                ? section("constraints", list(task.constraints)) : null,
            Array.isArray(task.warnings) && task.warnings.length > 0
                ? section("warnings", list(task.warnings)) : null,
            section("output_format", task.output)
        ].filter(Boolean);

        return parts.length > 0 ? parts.join("\n\n") : "Nessun dato disponibile per questo task.";
    }

    /**
     * Rigenera automaticamente il prompt quando il testo sorgente cambia
     */
    autoRegenerate(keepNewlines) {
        if (this.lastClickedButton) {
            this.generatePrompt(this.lastClickedButton, keepNewlines);
        }
    }

    /**
     * Setter per il tono selezionato (usato dalla modale "Personalizzata")
     */
    setSelectedTone(tone) {
        this.selectedTone = tone;
    }

    /**
     * Getter per l'ultimo bottone cliccato
     */
    getLastClickedButton() {
        return this.lastClickedButton;
    }
}