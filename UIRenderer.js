import { config } from './config.js';

// Etichetta del bottone considerato la scelta di default a basso sforzo decisionale
const DEFAULT_LABEL = "Armonizza";

/**
 * Classe per il rendering dell'interfaccia utente.
 * Mostra una categoria di prompt alla volta (tab), per ridurre il numero
 * di scelte simultanee mostrate all'utente (legge di Hick).
 */
export class UIRenderer {
    constructor() {
        this.activeCategory = Object.keys(config)[0];
    }

    /**
     * Renderizza tab di categoria e bottoni della categoria attiva
     */
    renderButtons() {
        this.renderTabs();
        this.renderCategoryButtons();
    }

    /**
     * Renderizza i tab di selezione categoria
     */
    renderTabs() {
        const tabsContainer = $('#category-tabs').empty();

        Object.keys(config).forEach(type => {
            const isActive = type === this.activeCategory;
            const tab = $(`
                <button type="button" class="tab-btn ${isActive ? 'active' : ''}"
                        role="tab" aria-selected="${isActive}" aria-controls="button-container">
                    ${type}
                </button>
            `);
            tab.on('click', () => {
                this.activeCategory = type;
                this.renderButtons();
            });
            tabsContainer.append(tab);
        });
    }

    /**
     * Renderizza i bottoni della categoria attualmente selezionata
     */
    renderCategoryButtons() {
        const buttonContainer = $('#button-container').empty();
        // Griglia responsive di Bootstrap: ogni bottone in una .col dentro
        // una .row con row-cols-*, che si occupa da sola di quante colonne
        // stare per riga a seconda della larghezza (niente più CSS grid custom).
        const buttonRow = $('<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-2"></div>');

        config[this.activeCategory].forEach((item, index) => {
            const isDefault = item.label === DEFAULT_LABEL;
            // d-flex sulla colonna fa sì che il bottone si estenda per
            // tutta l'altezza della riga (le .col sono già alte uguali
            // di default in una .row Bootstrap), altrimenti chi ha
            // un'etichetta corta resterebbe più basso di chi va a due righe
            const col = $('<div class="col d-flex"></div>');
            const button = $(`
                <button class="btn ${isDefault ? 'btn-primary' : 'btn-dark'} bottone w-100" type="button"
                        data-label="${item.label}"
                        data-type="${this.activeCategory}"
                        data-index="${index}">
                    ${item.label}
                </button>
            `);
            col.append(button);
            buttonRow.append(col);
        });

        buttonContainer.append(buttonRow);
    }
}
