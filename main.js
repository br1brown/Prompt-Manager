import { PromptGenerator } from './PromptGenerator.js';
import { initMemeMode } from './MemeMode.js';

// Registra il service worker per rendere l'app installabile e utilizzabile offline.
// Indipendente dal resto: deve partire anche se le librerie CDN sotto falliscono.
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
            console.error('Registrazione service worker fallita:', err);
        });
    });
}

// Inizializzazione quando il documento è pronto
$(document).ready(() => {
    new PromptGenerator();
    initMemeMode();
});
