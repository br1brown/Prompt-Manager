import { config } from './config.js';
import { linkAI } from './data/linkAI.js';

/**
 * Classe per la gestione degli eventi dell'interfaccia
 */
export class EventManager {
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
        $('#togglePreview').on('click', () => this.togglePreview());
    }

    /**
     * Espande/comprime la textarea del risultato (collassata di default)
     */
    togglePreview() {
        const wrapper = $('.result-textarea-wrapper');
        const btn = $('#togglePreview');
        const isExpanded = wrapper.hasClass('expanded');

        wrapper.toggleClass('expanded', !isExpanded);
        btn.attr('aria-expanded', String(!isExpanded));
        btn.text(isExpanded ? 'Vedi il prompt completo' : 'Comprimi');
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
        const index = button.data("index");

        // Ottieni la configurazione del bottone
        const buttonConfig = config[type][index];

        // Se è "Revisione", attiva automaticamente "Mantieni a capo"
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

        // Se il bottone richiede modale (Personalizzata), mostrala
        if (buttonConfig.needsModal) {
            this.modalManager.showToneModal(button, generateCallback);
        } else {
            // Altrimenti genera direttamente (bottoni con tono fisso o Revisione)
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
            // Rileva se siamo su mobile
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            // L'AI usata l'ultima volta va per prima ed evidenziata: la scelta tra
            // 10 servizi equivalenti si riduce a "quello di sempre + altri"
            // (legge di Tesler: la complessità non sparisce, si sposta dall'utente al sistema)
            const lastUsedAI = localStorage.getItem('lastUsedAI');
            const orderedLinks = [...linkAI].sort((a, b) => {
                if (a.nome === lastUsedAI) return -1;
                if (b.nome === lastUsedAI) return 1;
                return 0;
            });

            Swal.fire({
                title: "Testo copiato!",
                icon: "success",
                showCloseButton: false,
                showCancelButton: false,
                showConfirmButton: false,
                html: orderedLinks.map(link => {
                    // Se siamo su mobile e c'è un deep link app, usa quello; altrimenti
                    // il sito web va comunque bene anche da mobile, quindi nessun
                    // servizio senza deep link va nascosto dalla lista
                    const url = (isMobile && link.app) ? link.app : link.url;

                    const isLastUsed = link.nome === lastUsedAI;
                    const style = isLastUsed ? 'btn-primary' : 'btn-dark';
                    const star = isLastUsed ? '<i class="fas fa-star me-1" aria-hidden="true"></i>' : '';

                    return `<a href="${url}" target="_blank" class="m-1 btn btn-sm ${style} ai-link" data-nome="${link.nome}">${star}${link.nome}</a>`;
                }).filter(Boolean).join(''),
                didOpen: () => {
                    $('.ai-link').on('click', function () {
                        localStorage.setItem('lastUsedAI', $(this).data('nome'));
                    });
                }
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
            backToTop.addClass('show');
        } else {
            backToTop.removeClass('show');
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
