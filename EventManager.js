
/**
 * Classe per la gestione degli eventi dell'interfaccia
 */
class EventManager {
    constructor(promptService, modalManager) {
        this.promptService = promptService;
        this.modalManager = modalManager;
        this.keepNewlines = false;
    }

    /**
     * Inizializza tutti gli event listener
     */
    bindEvents() {
        this.bindCopyEvents();
        $('#txtSource').on('input', () => this.promptService.autoRegenerate(this.keepNewlines));
        $(document).on('click', ".bottone", (e) => this.handleButtonClick(e));
        this.bindScrollEvents();
        $('#toggleNewlines').on('change', (e) => this.toggleNewlines(e));
    }

    /**
     * Eventi per la copia negli appunti
     */
    bindCopyEvents() {
        $('#copia').on('click', () => this.copyToClipboard());
        $('#Risultato').on('click', function () { $(this).select(); });
    }


    /**
     * Eventi per lo scroll
     */
    bindScrollEvents() {
        $(window).on('scroll', () => this.handleScroll());
        $('#back-to-top').on('click', (e) => this.scrollToTop(e));
    }


    /**
     * Gestisce il click sui bottoni principali
     */
    handleButtonClick(event) {
        const source = $('#txtSource').val().trim();
        if (!source) {
            this.modalManager.showError('Campo vuoto', 'Inserisci il testo da elaborare');
            return;
        }

        const button = $(event.currentTarget);
        const type = button.data("type");

        if (type === "Revisione") {
            $('#toggleNewlines').prop("checked", true);
            this.keepNewlines = true;
        }

        const scrollToResult = () => {
            $('html, body').animate({
                scrollTop: $("#Risultato").offset().top - 100
            }, 500);
        };

        const generateCallback = () => this.promptService.generatePrompt(button, this.keepNewlines, scrollToResult);

        if (type === "Produzione Testi") {
            this.modalManager.showToneModal(button, generateCallback);
        } else if (type === "Social Tag") {
            this.modalManager.showSocialSelectModal(button, generateCallback);
        } else {
            generateCallback();
        }
    }

    /**
     * Copia il testo negli appunti
     */
    copyToClipboard() {
        const text = $("#Risultato").val().trim();
        if (!text) {
            this.modalManager.showError("Oops..", "Il testo è vuoto, non c'è nulla da copiare");
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            Swal.fire({
                title: "Testo copiato!",
                icon: "success",
                showCloseButton: false,
                showCancelButton: false,
                showConfirmButton: false,
                html: linkAI.map(link =>
                    `<a href="${link.url}" target="_blank" class="m-1 btn btn-sm btn-dark">${link.nome}</a>`
                ).join('')
            });
        }).catch(() => {
            this.modalManager.showError("Errore", "Impossibile copiare il testo");
        });
    }

    /**
     * Gestisce lo scroll della pagina
     */
    handleScroll() {
        const backToTop = $('#back-to-top');
        if ($(window).scrollTop() > 50) {
            backToTop.fadeIn();
        } else {
            backToTop.fadeOut();
        }
    }

    /**
     * Scroll verso l'alto
     */
    scrollToTop(event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 200);
    }

    /**
     * Toggle per le nuove righe
     */
    toggleNewlines(event) {
        this.keepNewlines = event.target.checked;
        this.promptService.autoRegenerate(this.keepNewlines);
    }
}
