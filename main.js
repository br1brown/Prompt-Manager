import { PromptGenerator } from './PromptGenerator.js';
import { initMemeMode } from './MemeMode.js';

// Inizializzazione quando il documento è pronto
$(document).ready(() => {
    new PromptGenerator();
    initMemeMode();
});
