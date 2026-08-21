const STORAGE_KEY = 'memeModeEnabled';
const PARTICLES = ['✨', '🌟', '💫', '🚀', '🤖', '💜', '🔮', '⚡'];
const PARTICLE_COUNT = 18;
const CONFETTI = ['🎉', '✨', '🌟', '💫', '🚀', '🔥', '💜', '⚡'];
const CONFETTI_COUNT = 28;
const CURSOR_SPARKLES = ['✨', '💫', '⭐'];
const CURSOR_SPARKLE_INTERVAL_MS = 60;

// Didascalie senza alcun nesso logico, come nei "surreal meme": l'assurdo
// è il punto, non un bug.
const CAPTIONS = [
    'QUANDO CHIEDI ALL\'AI UN DESIGN "MODERNO"',
    'NESSUN PENSIERO. SOLO GRADIENTI.',
    'COSÌ È INIZIATA LA SINGOLARITÀ',
    'IO: FALLO SOBRIO. L\'AI: 🌈✨🚀',
    'STO VIVENDO IN 4D, TU IN 2D',
    'IL DESIGN SYSTEM HA PRESO VITA PROPRIA'
];

// Finti errori di sistema retrò, comparsi senza alcun motivo apparente:
// il contrasto fra l'estetica Windows 98 e il gergo da startup AI è
// tutto il gioco.
const RETRO_MESSAGES = [
    { icon: '⚠️', text: 'Errore: rilevata sinergia eccessiva nel sistema.' },
    { icon: '🖥️', text: 'Windows ha rilevato troppa positività. Riavviare la realtà?' },
    { icon: '❗', text: 'L\'AI ha capito male anche questa richiesta.' },
    { icon: '💭', text: 'Nessun pensiero rilevato. Solo gradienti.' },
    { icon: '🌀', text: 'Attenzione: il vibe check ha restituito un errore critico.' },
    { icon: '📠', text: 'Fax dall\'anno 2007: il tuo design è già vintage.' }
];
const RETRO_FIRST_DELAY_MS = 4000;
const RETRO_MIN_INTERVAL_MS = 20000;
const RETRO_MAX_INTERVAL_MS = 40000;
const RETRO_VISIBLE_MS = 5000;

/**
 * Modalità "meme": parodia esagerata del classico design system che
 * un'AI genera quando le si chiede qualcosa di "moderno" — gradienti
 * ovunque, glassmorphism, ticker di buzzword, coriandoli, una scia di
 * scintille che segue il mouse, didascalie assurde in stile "surreal
 * meme" e un finto popup di errore retrò senza alcun senso. Attivabile
 * e disattivabile dall'interruttore in cima alla pagina.
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

    const captionLayer = document.createElement('div');
    captionLayer.className = 'meme-caption-layer';
    captionLayer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(captionLayer);

    CAPTIONS.forEach((text, i) => {
        const span = document.createElement('span');
        span.className = 'meme-caption';
        span.textContent = text;
        span.style.top = `${15 + Math.random() * 55}%`;
        span.style.setProperty('--meme-cap-rot', `${(Math.random() - 0.5) * 24}deg`);
        span.style.animationDuration = `${9 + Math.random() * 4}s`;
        span.style.animationDelay = `${i * 6 + Math.random() * 3}s`;
        captionLayer.appendChild(span);
    });

    const retroDialog = document.createElement('div');
    retroDialog.className = 'meme-retro-dialog';
    retroDialog.setAttribute('role', 'status');
    retroDialog.innerHTML = `
        <div class="meme-retro-titlebar">
            <span>Sistema</span>
            <button type="button" class="meme-retro-close" aria-label="Chiudi">✕</button>
        </div>
        <div class="meme-retro-body">
            <span class="meme-retro-icon"></span>
            <span class="meme-retro-text"></span>
        </div>
        <div class="meme-retro-actions">
            <button type="button" class="meme-retro-ok">OK</button>
        </div>
    `;
    document.body.appendChild(retroDialog);

    const retroIcon = retroDialog.querySelector('.meme-retro-icon');
    const retroText = retroDialog.querySelector('.meme-retro-text');
    let retroHideTimer = null;
    let retroScheduleTimer = null;

    const hideRetroDialog = () => {
        retroDialog.classList.remove('visible');
        clearTimeout(retroHideTimer);
    };

    const showRetroDialog = () => {
        const message = RETRO_MESSAGES[Math.floor(Math.random() * RETRO_MESSAGES.length)];
        retroIcon.textContent = message.icon;
        retroText.textContent = message.text;
        retroDialog.classList.add('visible');
        clearTimeout(retroHideTimer);
        retroHideTimer = setTimeout(hideRetroDialog, RETRO_VISIBLE_MS);
    };

    const scheduleRetroDialog = (delay) => {
        clearTimeout(retroScheduleTimer);
        retroScheduleTimer = setTimeout(() => {
            showRetroDialog();
            const next = RETRO_MIN_INTERVAL_MS + Math.random() * (RETRO_MAX_INTERVAL_MS - RETRO_MIN_INTERVAL_MS);
            scheduleRetroDialog(next);
        }, delay);
    };

    const stopRetroDialog = () => {
        clearTimeout(retroScheduleTimer);
        clearTimeout(retroHideTimer);
        hideRetroDialog();
    };

    retroDialog.querySelector('.meme-retro-close').addEventListener('click', hideRetroDialog);
    retroDialog.querySelector('.meme-retro-ok').addEventListener('click', hideRetroDialog);

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

        if (enabled) {
            scheduleRetroDialog(RETRO_FIRST_DELAY_MS);
        } else {
            stopRetroDialog();
        }

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
