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
        // Un criterio può avere un "livello": "fedelta" (vincolo sul
        // contenuto, mai negoziabile) o "stile" (regola sul "come", dove un
        // tono esplicito in <voice> può avere la priorità se confligge). Se
        // il task usa i livelli, i criteri vengono raggruppati in due blocchi
        // separati, ciascuno con la propria regola di validità dichiarata:
        // non è un conflitto da segnalare al modello, è una gerarchia, e
        // la nota di priorità si applica solo al blocco "stile" - i vincoli
        // di fedeltà restano assoluti in ogni caso. Un task senza livelli
        // (es. revisione, che non ha un tono con cui negoziare) ottiene
        // semplicemente l'elenco piatto di sempre.
        const bullet = (c) => c.perche ? `- ${c.regola} (perché: ${c.perche})` : `- ${c.regola}`;
        const usaLivelli = task.criteri?.some(c => c.livello);

        const criteriBlock = !task.criteri?.length ? null
            : !usaLivelli ? task.criteri.map(bullet).join("\n")
            : [
                task.criteri.some(c => c.livello === "fedelta")
                    ? "Vincoli di fedeltà (sempre validi, nessun tono può derogarvi):\n"
                        + task.criteri.filter(c => c.livello === "fedelta").map(bullet).join("\n")
                    : null,
                task.criteri.some(c => c.livello !== "fedelta")
                    ? `Criteri di stile (regolano il "come", non il contenuto)${task.voice ? ". Se il tono richiesto in <voice> confligge con uno di questi, il tono ha la priorità" : ""}:\n`
                        + task.criteri.filter(c => c.livello !== "fedelta").map(bullet).join("\n")
                    : null
            ].filter(Boolean).join("\n\n");

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