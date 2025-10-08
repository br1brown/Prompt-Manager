/**
* Classe per la gestione della generazione dei prompt
*/
class PromptService {
    constructor() {
        this.lastClickedButton = null;
        this.selectedTone = null;
        this.lastSocial = null;
    }

    /**
     * Genera il prompt basato sui parametri forniti
     */
    generatePrompt(button, keepNewlines, callback) {
        const source = $('#txtSource').val().trim();
        if (!source) return;

        this.lastClickedButton = button;
        const tone = this.selectedTone || "invariato";

        const task = config[button.data("type")][button.data("index")].func(keepNewlines, source, tone, this.lastSocial);
        const result = this.formatPromptResult(task);

        $("#Risultato").val(result);

        if (callback) callback();
    }

    /**
     * Formatta il risultato del prompt
     */
    formatPromptResult(task) {
        const parts = [];

        if (task.objective) parts.push(task.objective);
        if (task.output) parts.push(`Formato output richiesto:\n${task.output}`);
        if (Array.isArray(task.warnings) && task.warnings.length > 0) {
            parts.push(`Warnings:\n- ${task.warnings.join("\n- ")}`);
        }
        if (task.context) parts.push(`Contesto:\n${task.context}`);

        return parts.join("\n");
    }

    /**
     * Rigenera automaticamente il prompt quando il testo sorgente cambia
     */
    autoRegenerate(keepNewlines) {
        debugger
        if (this.lastClickedButton) {
            this.generatePrompt(this.lastClickedButton, keepNewlines);
        }
    }

    /**
     * Getter e setter per i parametri
     */
    setSelectedTone(tone) {
        this.selectedTone = tone;
    }

    setLastSocial(social) {
        this.lastSocial = social;
    }

    getLastClickedButton() {
        return this.lastClickedButton;
    }
}
