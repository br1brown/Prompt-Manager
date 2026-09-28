const ICONS = {
    error: 'fas fa-circle-exclamation text-danger',
    success: 'fas fa-circle-check text-success',
    info: 'fas fa-circle-info text-primary'
};

/**
 * Mostra un avviso nella modale condivisa #alertModal, riusando lo
 * stesso stile delle altre modali dell'app invece di una notifica
 * "toast" a comparsa.
 */
export function showAlert({ title = '', text = '', icon = 'info' } = {}) {
    const modalEl = document.getElementById('alertModal');
    if (!modalEl || !window.bootstrap) return;

    modalEl.querySelector('.modal-title').innerHTML = `
        <i class="${ICONS[icon] || ICONS.info} me-2" aria-hidden="true"></i>${title}
    `;

    const bodyEl = modalEl.querySelector('.modal-body');
    bodyEl.textContent = text;
    bodyEl.style.display = text ? '' : 'none';

    window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
}
