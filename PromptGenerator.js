
/**
 * Classe principale per l'orchestrazione del sistema
 */
class PromptGenerator {
    constructor() {
        this.promptService = new PromptService();
        this.modalManager = new ModalManager(this.promptService);
        this.eventManager = new EventManager(this.promptService, this.modalManager);
        this.uiRenderer = new UIRenderer();

        this.init();
    }

    /**
     * Inizializza l'applicazione
     */
    init() {
        this.eventManager.bindEvents();
        this.uiRenderer.renderButtons();
    }
}
