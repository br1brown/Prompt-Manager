import { PromptService } from './PromptService.js';
import { ModalManager } from './ModalManager.js';
import { EventManager } from './EventManager.js';
import { UIRenderer } from './UIRenderer.js';

/**
 * Classe principale per l'orchestrazione del sistema
 */
export class PromptGenerator {
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
