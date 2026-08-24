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
     *
     * Il tag è derivato dal nome del campo (camelCase -> snake_case): non
     * c'è una mappa parallela nome-campo -> nome-tag da tenere allineata a
     * mano, quindi rinominare o aggiungere un campo in creaTask basta da
     * solo a farlo comparire nel prompt con il tag giusto.
     */
    formatPromptResult(task) {
        if (!task) return "Nessun task fornito.";

        const toTag = (field) => field.replace(/([A-Z])/g, "_$1").toLowerCase();
        const section = (field, content) => content ? `<${toTag(field)}>\n${content}\n</${toTag(field)}>` : null;

        const examplesBlock = task.examples?.length > 0
            ? task.examples.map(ex =>
                `<example>\n<input>\n${ex.input}\n</input>\n<output>\n${ex.output}\n</output>\n</example>`
            ).join("\n")
            : null;

        // Ogni criterio è una condizione di successo verificabile; il
        // "perché" compare solo dove è stato scritto, non è un campo
        // obbligatorio (evita di spiegare l'ovvio a ogni riga).
        //
        // Quando il task ha anche un tono (<voice>), i criteri qui sotto
        // sono la norma generale, non un vincolo assoluto: un tono scritto
        // a mano (bottone "Personalizzata") non può avere le eccezioni
        // dedicate che i profili fissi hanno in ECCEZIONI_TONO
        // (armonizzazione.js), quindi il modello deve poter arbitrare da
        // solo un conflitto reale invece di applicare la regola alla
        // lettera contro l'intento esplicito dell'utente.
        const criteriBlock = task.criteri?.length > 0
            ? (task.voice ? "Se il tono richiesto in <voice> confligge con una di queste regole, il tono ha la priorità: i criteri restano la norma, il tono è l'eccezione dichiarata.\n\n" : "")
                + task.criteri.map(c => c.perche ? `- ${c.regola} (perché: ${c.perche})` : `- ${c.regola}`).join("\n")
            : null;

        const parts = [
            section("source", task.source),
            section("task", task.task),
            section("voice", task.voice),
            section("context", task.context),
            section("metodo", task.metodo),
            section("examples", examplesBlock),
            section("criteri", criteriBlock),
            criteriBlock ? section("verificaFinale", "Prima di rispondere, ripassa il risultato contro ogni voce di <criteri> e correggi in silenzio ogni scostamento, senza commentarlo.") : null,
            section("outputFormat", task.outputFormat)
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