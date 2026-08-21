import { generaArmonizzazioni } from './prompts/armonizzazione.js';
import { revisione } from './prompts/revisione.js';

// Catalogo dei bottoni/prompt mostrati nell'interfaccia, raggruppati per sezione
export const config = {
    "Armonizzazioni": generaArmonizzazioni(),
    "Revisione": revisione
};
