const STORAGE_KEY = 'memeModeEnabled';
const PARTICLES = ['✨', '🌟', '💫', '🚀', '🤖', '💜', '🔮', '⚡'];
const PARTICLE_COUNT = 18;
const CONFETTI = ['🎉', '✨', '🌟', '💫', '🚀', '🔥', '💜', '⚡'];
const CONFETTI_COUNT = 28;
const CURSOR_SPARKLES = ['✨', '💫', '⭐'];
const CURSOR_SPARKLE_INTERVAL_MS = 60;

/**
 * Modalità "meme": parodia esagerata del classico design system che
 * un'AI genera quando le si chiede qualcosa di "moderno" — gradienti
 * ovunque, glassmorphism, ticker di buzzword, coriandoli, una scia di
 * scintille che segue il mouse, tutto pieno di vita. Attivabile e
 * disattivabile dall'interruttore in cima alla pagina.
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

    const confettiLayer = document.createElement('div');
    confettiLayer.className = 'meme-confetti-layer';
    confettiLayer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(confettiLayer);

    const cursorTrailLayer = document.createElement('div');
    cursorTrailLayer.className = 'meme-cursor-trail-layer';
    cursorTrailLayer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorTrailLayer);

    const burstConfetti = () => {
        for (let i = 0; i < CONFETTI_COUNT; i++) {
            const piece = document.createElement('span');
            piece.className = 'meme-confetti-piece';
            piece.textContent = CONFETTI[i % CONFETTI.length];
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.setProperty('--meme-confetti-x', `${(Math.random() - 0.5) * 200}px`);
            piece.style.setProperty('--meme-confetti-spin', `${360 + Math.random() * 720}deg`);
            piece.style.animationDuration = `${1.8 + Math.random() * 1.4}s`;
            piece.style.animationDelay = `${Math.random() * 0.3}s`;
            confettiLayer.appendChild(piece);
            piece.addEventListener('animationend', () => piece.remove());
        }
    };

    let lastSparkleAt = 0;
    const onCursorMove = (event) => {
        const now = Date.now();
        if (now - lastSparkleAt < CURSOR_SPARKLE_INTERVAL_MS) return;
        lastSparkleAt = now;

        const point = event.touches ? event.touches[0] : event;
        if (!point) return;

        const sparkle = document.createElement('span');
        sparkle.className = 'meme-cursor-sparkle';
        sparkle.textContent = CURSOR_SPARKLES[Math.floor(Math.random() * CURSOR_SPARKLES.length)];
        sparkle.style.left = `${point.clientX}px`;
        sparkle.style.top = `${point.clientY}px`;
        cursorTrailLayer.appendChild(sparkle);
        sparkle.addEventListener('animationend', () => sparkle.remove());
    };

    const setCursorTrailActive = (active) => {
        if (active) {
            document.addEventListener('mousemove', onCursorMove);
            document.addEventListener('touchmove', onCursorMove);
        } else {
            document.removeEventListener('mousemove', onCursorMove);
            document.removeEventListener('touchmove', onCursorMove);
            cursorTrailLayer.innerHTML = '';
        }
    };

    const applyState = (enabled, { announce = false } = {}) => {
        document.body.classList.toggle('meme-mode', enabled);
        toggle.checked = enabled;
        localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
        setCursorTrailActive(enabled);

        if (announce) {
            if (enabled) burstConfetti();
            if (window.Swal) {
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
        }
    };

    const savedState = localStorage.getItem(STORAGE_KEY) === '1';
    applyState(savedState);

    toggle.addEventListener('change', () => {
        applyState(toggle.checked, { announce: true });
    });
}
