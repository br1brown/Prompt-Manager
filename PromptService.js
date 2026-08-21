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
        this.renderPreview(task);

        if (callback) callback();
    }

    /**
     * Renderizza il pannello di anteprima con sezioni etichettate separate
     * (Obiettivo, Vincoli, Avvertenze, Contesto) invece di un unico blocco
     * di testo, per ridurre il carico di lettura (legge di Miller).
     * Il testo copiato da #Risultato resta invariato: qui cambia solo
     * la presentazione visiva.
     */
    renderPreview(task) {
        const preview = $('#risultatoPreview').empty();
        if (!task) return;

        const escapeHtml = (str) => $('<div>').text(str).html();

        const addSection = (label, contentHtml) => {
            preview.append(`
                <div class="preview-section">
                    <span class="preview-label">${label}</span>
                    <div class="preview-content">${contentHtml}</div>
                </div>
            `);
        };

        if (task.objective) addSection('Obiettivo', `<p>${escapeHtml(task.objective)}</p>`);
        if (task.output) addSection('Formato output', `<pre>${escapeHtml(task.output)}</pre>`);
        if (Array.isArray(task.constraints) && task.constraints.length > 0)
            addSection('Vincoli', `<ul>${task.constraints.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>`);
        if (Array.isArray(task.warnings) && task.warnings.length > 0)
            addSection('Avvertenze', `<ul>${task.warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul>`);
        if (task.context) addSection('Contesto', `<p>${escapeHtml(task.context)}</p>`);
    }

    /**
     * Formatta il risultato del prompt
     */
    formatPromptResult(task) {
        if (!task) return "Nessun task fornito.";

        const parts = [];

        if (task.objective) parts.push(task.objective);
        if (task.output) parts.push(`Formato output richiesto:\n${task.output}`);
        if (Array.isArray(task.constraints) && task.constraints.length > 0)
            parts.push(`Vincoli:\n- ${task.constraints.join("\n- ")}`);
        if (Array.isArray(task.warnings) && task.warnings.length > 0)
            parts.push(`Avvertenze:\n- ${task.warnings.join("\n- ")}`);
        if (task.context) parts.push(`Contesto:\n${task.context}`);

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