/**
 * Classe per la gestione delle modali
 */
class ModalManager {
    constructor(promptService) {
        this.promptService = promptService;
        this.storageKey = 'toneUsageStats';
    }

    /**
     * Mostra la modal per la selezione del tono
     */
    showToneModal(button, callback) {
        Swal.fire({
            title: 'Seleziona il tono di voce',
            html: this.buildToneModalHtml(this.getRecentTones()),
            width: 700,
            showCancelButton: true,
            confirmButtonText: 'Genera Prompt',
            cancelButtonText: 'Annulla',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary ms-2'
            },
            didOpen: () => this.setupToneModalEvents(),
            preConfirm: () => $('#customTone').val().trim() || 'invariato'
        }).then(result => {
            if (result.isConfirmed) {
                this.promptService.setSelectedTone(result.value);
                this.saveToneUsage(result.value);
                callback();
            }
        });
    }

    /**
     * Costruisce l'HTML per la modal del tono
     */
    buildToneModalHtml(recentTones) {
        const recentSection = recentTones.length ? `
            <div class="mb-4">
                <h6 class="text-muted"><i class="fas fa-clock me-2"></i>Toni recenti</h6>
                <div class="d-flex flex-wrap gap-2 justify-content-center">
                    ${recentTones.map(tone =>
            `<button class="btn btn-warning btn-sm tone-btn" data-tone="${tone}">${tone}</button>`
        ).join('')}
                </div>
            </div>` : '';

        const profilesSection = `
            <div class="mb-3">
                <h6 class="text-muted mb-3">
                    <i class="fas fa-user-tie me-2"></i>Scegli un profilo
                </h6>
                <div id="profiles-container" class="row">
                    ${Object.entries(toneProfiles).map(([name, profile]) => `
                        <div class="col-md-6 mb-3">
                            <div class="card profile-card h-100 p-3" data-profile="${name}" role="button">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="${profile.icon} me-2"></i>${name}</h6>
                                    <p class="card-text small text-muted">${profile.description}</p>
                                </div>
                            </div>
                        </div>`
        ).join('')}
                </div>
            </div>`;

        return `
            <div class="modal-body container-fluid">
                <div class="mb-4">
                    <label for="customTone" class="form-label">
                        <i class="fas fa-edit me-2"></i>Tono di voce personalizzato
                    </label>
                    <input id="customTone" class="form-control" placeholder="Scrivi il tuo tono personalizzato...">
                </div>
                ${recentSection}
                ${profilesSection}
            </div>`;
    }

    /**
     * Configura gli eventi per la modal del tono
     */
    setupToneModalEvents() {
        $('.profile-card').on('click', function () {
            $('.profile-card').removeClass('selected border-primary border-2');
            $(this).addClass('selected border border-2 border-primary');
            const profileName = $(this).data('profile');
            $('#customTone').val(toneProfiles[profileName].tones);
        });

        $('.tone-btn').on('click', function () {
            const selectedTone = $(this).data('tone');
            const currentValue = $('#customTone').val().trim();
            const currentTones = currentValue ? currentValue.split(',').map(t => t.trim()).filter(t => t) : [];

            if (!currentTones.includes(selectedTone)) {
                const newValue = currentValue ? `${currentValue}, ${selectedTone}` : selectedTone;
                $('#customTone').val(newValue);
            }
        });

        $('#customTone').on('input', () => {
            $('.profile-card').removeClass('selected border-primary border-2');
        });
    }

    /**
     * Ottiene i toni usati di recente
     */
    getRecentTones(span = 5) {
        const tonesStorage = JSON.parse(localStorage.getItem(this.storageKey)) || {};
        return Object.entries(tonesStorage)
            .sort((a, b) => b[1] - a[1])
            .slice(0, span)
            .map(entry => entry[0]);
    }

    /**
     * Salva l'utilizzo del tono nel localStorage
     */
    saveToneUsage(tone) {
        if (!tone.trim()) return;

        const usedTones = tone.split(",").map(t => t.toLowerCase().trim()).filter(t => t);
        if (usedTones.length === 0) return;

        let tonesStorage = JSON.parse(localStorage.getItem(this.storageKey)) || {};

        usedTones.forEach(toneItem => {
            tonesStorage[toneItem] = (tonesStorage[toneItem] || 0) + 1;
        });

        localStorage.setItem(this.storageKey, JSON.stringify(tonesStorage));
    }

    /**
     * Mostra modal di errore
     */
    showError(title, text) {
        Swal.fire({
            icon: "error",
            title: title,
            text: text
        });
    }
}