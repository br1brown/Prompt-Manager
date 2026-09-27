const ICONS = {
    success: 'fas fa-circle-check text-success',
    error: 'fas fa-circle-exclamation text-danger',
    info: 'fas fa-circle-info text-primary'
};

/**
 * Mostra una notifica non bloccante riusando il toast Bootstrap già
 * presente in pagina (#appToast), condiviso da ModalManager e MemeMode
 * al posto delle notifiche "toast" di SweetAlert.
 */
export function showToast({ title = '', text = '', icon = 'info' } = {}) {
    const toastEl = document.getElementById('appToast');
    if (!toastEl || !window.bootstrap) return;

    toastEl.querySelector('.toast-body').innerHTML = `
        <i class="${ICONS[icon] || ICONS.info} me-2" aria-hidden="true"></i>
        ${title ? `<strong>${title}</strong>` : ''}${text ? `<div>${text}</div>` : ''}
    `;

    window.bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 }).show();
}
