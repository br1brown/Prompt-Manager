const STORAGE_KEY = 'memeModeEnabled';
const PARTICLES = ['✨', '🌟', '💫', '🚀', '🤖', '💜', '🔮', '⚡'];
const PARTICLE_COUNT = 18;

/**
 * Modalità "meme": parodia esagerata del classico design system che
 * un'AI genera quando le si chiede qualcosa di "moderno" — gradienti
 * ovunque, glassmorphism, stelline fluttuanti, tutto pieno di vita.
 * Attivabile/disattivabile dall'interruttore in cima alla pagina.
 */
export function initMemeMode() {
    const toggle = document.getElementById('memeModeToggle');
    if (!toggle) return;

    const particleLayer = document.createElement('div');
    particleLayer.className = 'meme-particle-layer';
    particleLayer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(particleLayer);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const span = document.createElement('span');
        span.className = 'meme-particle';
        span.textContent = PARTICLES[i % PARTICLES.length];
        span.style.left = `${Math.random() * 100}%`;
        span.style.animationDelay = `${Math.random() * 8}s`;
        span.style.animationDuration = `${6 + Math.random() * 8}s`;
        span.style.fontSize = `${1 + Math.random() * 1.5}rem`;
        particleLayer.appendChild(span);
    }

    const applyState = (enabled, { announce = false } = {}) => {
        document.body.classList.toggle('meme-mode', enabled);
        toggle.checked = enabled;
        localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');

        if (announce && window.Swal) {
            window.Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2200,
                timerProgressBar: true,
                title: enabled
                    ? '🚀 Design Reimmaginato con l\'AI™ ✨'
                    : 'Tornato al design noioso 😴'
            });
        }
    };

    const savedState = localStorage.getItem(STORAGE_KEY) === '1';
    applyState(savedState);

    toggle.addEventListener('change', () => {
        applyState(toggle.checked, { announce: true });
    });
}
