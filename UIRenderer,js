
/**
 * Classe per il rendering dell'interfaccia utente
 */
class UIRenderer {
    /**
     * Renderizza i bottoni dell'interfaccia
     */
    renderButtons() {
        const buttonContainer = $("#button-container").empty();

        Object.keys(config).forEach(type => {
            const section = $('<div class="mb-4"></div>');
            const title = $(`<h5 class="category-title">${type}</h5>`);
            const buttonRow = $('<div class="d-flex flex-wrap"></div>');

            config[type].forEach((item, index) => {
                const button = $(`
                    <button class="btn btn-dark bottone m-2" type="button" 
                            data-label="${item.label}" 
                            data-type="${type}" 
                            data-index="${index}">
                        ${item.label}
                    </button>
                `);
                buttonRow.append(button);
            });

            section.append(title, buttonRow);
            buttonContainer.append(section);
        });
    }
}
