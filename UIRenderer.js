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
        // Lo spazio tra i bottoni è dato solo dal "gap" della grid (stile.css):
        // niente margini sui singoli bottoni, altrimenti si sommano al gap
        // e la spaziatura diventa irregolare, soprattutto ai bordi.
        const buttonRow = $('<div class="d-flex flex-wrap"></div>');

        config[this.activeCategory].forEach((item, index) => {
            const isDefault = item.label === DEFAULT_LABEL;
            const button = $(`
                <button class="btn ${isDefault ? 'btn-primary' : 'btn-dark'} bottone" type="button"
                        data-label="${item.label}"
                        data-type="${this.activeCategory}"
                        data-index="${index}">
                    ${item.label}
                </button>
            `);
            buttonRow.append(button);
        });

        buttonContainer.append(buttonRow);
    }
}
