/* ============================================================
   ENCUESTA GÓTICA — SCRIPT PRINCIPAL
   Castlevania Dark Theme | Murciélagos | Canvas | Magia oscura
   ============================================================ */

// ============================================================
// MENSAJES OCULTOS — Solo para ella 🦇
// ============================================================
const secretMessages = [
    "Hay algo en ti que me hace querer conocerte para siempre.",
    "Tu sonrisa debería tener su propio nombre, porque es única en el mundo.",
    "Eres de esas personas que hacen que la oscuridad se sienta más bonita.",
    "Ojalá supieras lo especial que eres, en serio.",
    "Si fuera un murciélago, rondaría tu castillo toda la eternidad. 🦇",
    "Tienes algo mágico que no sé explicar, y me alegra no poder hacerlo.",
];
let secretIndex = 0;

function showSecret(idx) {
    const msg = document.getElementById('hiddenMsg');
    msg.textContent = secretMessages[idx % secretMessages.length];
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 4500);
}

// ============================================================
// PANTALLA DE INTRO — Castlevania Gate
// ============================================================
(function initIntro() {
    const intro   = document.getElementById('introScreen');
    const iCanvas = document.getElementById('introBatsCanvas');
    const iCtx    = iCanvas.getContext('2d');
    let introBats = [];
    let introAnim;

    // ---- Bats del intro ----
    class IntroBat {
        constructor() {
            this.x    = Math.random() * window.innerWidth;
            this.y    = Math.random() * window.innerHeight * 0.7 + 50;
            this.vx   = (Math.random() - 0.5) * 2.5;
            this.vy   = (Math.random() - 0.5) * 1.2;
            this.size = 8 + Math.random() * 14;
            this.alpha= 0.4 + Math.random() * 0.5;
            this.wingPhase   = Math.random() * Math.PI * 2;
            this.wingSpeed   = 0.1 + Math.random() * 0.12;
            this.wobblePhase = Math.random() * Math.PI * 2;
        }

        update() {
            this.wingPhase   += this.wingSpeed;
            this.wobblePhase += 0.02;
            this.x += this.vx + Math.sin(this.wobblePhase) * 0.5;
            this.y += this.vy;
            // Rebotar
            if (this.x < -50)  this.x = window.innerWidth  + 50;
            if (this.x > window.innerWidth  + 50) this.x = -50;
            if (this.y < -50)  this.y = window.innerHeight * 0.7;
            if (this.y > window.innerHeight * 0.75) this.y = 50;
        }

        draw(ctx) {
            const s = this.size;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = this.alpha;

            // Sombra roja suave
            ctx.shadowColor = '#8a0303';
            ctx.shadowBlur  = 6;
            ctx.fillStyle   = '#1a0505';

            // Cuerpo
            ctx.beginPath();
            ctx.ellipse(0, 0, s * 0.22, s * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();

            // Ala izq
            ctx.beginPath();
            const w = Math.cos(this.wingPhase) * s;
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo( s*0.3, -s*0.6,  w,  -s*0.5, w, 0);
            ctx.bezierCurveTo( w*0.6,  s*0.2,  s*0.2, s*0.15, 0, 0);
            ctx.fill();
            // Ala der
            ctx.scale(-1, 1);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo( s*0.3, -s*0.6,  w, -s*0.5, w, 0);
            ctx.bezierCurveTo( w*0.6,  s*0.2,  s*0.2, s*0.15, 0, 0);
            ctx.fill();

            // Ojos
            ctx.scale(-1, 1);
            ctx.shadowBlur  = 4;
            ctx.fillStyle   = '#ff2222';
            ctx.globalAlpha = this.alpha * 0.9;
            const e = s * 0.07;
            ctx.beginPath();
            ctx.arc(-s*0.08, -s*0.1, e, 0, Math.PI*2);
            ctx.arc( s*0.08, -s*0.1, e, 0, Math.PI*2);
            ctx.fill();

            ctx.restore();
        }
    }

    function resizeIntroCanvas() {
        iCanvas.width  = window.innerWidth;
        iCanvas.height = window.innerHeight;
    }
    resizeIntroCanvas();
    window.addEventListener('resize', resizeIntroCanvas);

    // Crear murciélagos del intro
    for (let i = 0; i < 20; i++) introBats.push(new IntroBat());

    // Gotas de sangre
    function createDrips() {
        const container = document.getElementById('bloodDrips');
        for (let i = 0; i < 15; i++) {
            const drip    = document.createElement('div');
            drip.className= 'drip';
            const left    = Math.random() * 100;
            const height  = 40 + Math.random() * 120;
            const dur     = 3 + Math.random() * 5;
            const del     = Math.random() * -8;
            drip.style.cssText = `
                left: ${left}%;
                height: ${height}px;
                animation-duration: ${dur}s;
                animation-delay: ${del}s;
                opacity: ${0.4 + Math.random() * 0.5};
            `;
            container.appendChild(drip);
        }
    }
    createDrips();

    function animateIntro() {
        iCtx.clearRect(0, 0, iCanvas.width, iCanvas.height);
        introBats.forEach(b => { b.update(); b.draw(iCtx); });
        introAnim = requestAnimationFrame(animateIntro);
    }
    animateIntro();

    // ---- Función para cerrar el intro ----
    window.enterSite = function () {
        intro.classList.add('exit');
        cancelAnimationFrame(introAnim);
        setTimeout(() => {
            intro.style.display = 'none';
            // Arrancar murciélagos del fondo principal
            window.spawnBatBurst && window.spawnBatBurst();
        }, 1000);
    };

    // Tecla cualquiera para entrar
    const keyHandler = (e) => {
        if (e.key && !['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
            window.enterSite();
            document.removeEventListener('keydown', keyHandler);
        }
    };
    document.addEventListener('keydown', keyHandler);
})();


// ============================================================
// AOS — Animaciones al hacer scroll
// ============================================================
AOS.init({
    duration: 900,
    once: true,
    offset: 60,
    easing: 'ease-out-cubic'
});

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(window.scrollY / total) * 100}%`;
});

// ============================================================
// TEXTAREA AUTORESIZE
// ============================================================
document.querySelectorAll('textarea').forEach(ta => {
    ta.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
});

// ============================================================
// PARTÍCULAS AMBIENTALES
// ============================================================
(function initParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 28; i++) {
        const p    = document.createElement('div');
        p.className= 'particle';
        const x    = Math.random() * 100;
        const dur  = 8 + Math.random() * 14;
        const size = 1 + Math.random() * 3;
        const del  = Math.random() * -dur;
        const isGold   = Math.random() < 0.08;
        const isPurple = Math.random() < 0.15;
        p.style.cssText = `
            left: ${x}%;
            width: ${size}px; height: ${size}px;
            animation-duration: ${dur}s;
            animation-delay: ${del}s;
            background: ${isGold ? '#c9a84c' : isPurple ? '#9b59b6' : '#8a0303'};
            box-shadow: 0 0 ${size*2}px currentColor;
        `;
        container.appendChild(p);
    }
})();

// ============================================================
// MURCIÉLAGOS — Canvas fondo principal (FIXED)
// ============================================================
(function initBats() {
    const canvas = document.getElementById('batsCanvas');
    const ctx    = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Bat {
        constructor(burst = false) {
            this.burst = burst;
            this.reset();
        }

        reset() {
            if (this.burst) {
                // Burst: salen desde el centro y se dispersan, ya visibles
                this.x     = window.innerWidth  * (0.25 + Math.random() * 0.5);
                this.y     = window.innerHeight * (0.35 + Math.random() * 0.25);
                this.vx    = (Math.random() - 0.5) * 6;
                this.vy    = -(1.5 + Math.random() * 4);
                this.size  = 14 + Math.random() * 16;
                this.alpha = 0.55 + Math.random() * 0.35; // YA visibles desde el inicio
            } else {
                // Normales: suben desde abajo
                this.x     = -60 + Math.random() * (window.innerWidth + 120);
                this.y     = window.innerHeight + 30;
                this.vx    = (Math.random() - 0.5) * 1.4;
                this.vy    = -(0.5 + Math.random() * 1.3);
                this.size  = 7 + Math.random() * 11;
                this.alpha = 0; // Aparecen gradualmente
            }
            this.wingPhase   = Math.random() * Math.PI * 2;
            this.wingSpeed   = 0.11 + Math.random() * 0.1;
            this.wobblePhase = Math.random() * Math.PI * 2;
            this.alive       = true;
        }

        update() {
            this.wingPhase   += this.wingSpeed;
            this.wobblePhase += 0.02;
            this.x += this.vx + Math.sin(this.wobblePhase) * 0.5;
            this.y += this.vy;

            if (this.burst) {
                // Burst: desvanecer lentamente y morir al salir
                this.alpha = Math.max(0, this.alpha - 0.003);
                if (this.alpha <= 0) this.alive = false;
            } else {
                // Normales: fade in al subir, fade out arriba
                if (this.y > window.innerHeight * 0.6) {
                    this.alpha = Math.min(0.75, this.alpha + 0.03);
                } else if (this.y < window.innerHeight * 0.2) {
                    this.alpha = Math.max(0, this.alpha - 0.015);
                }
            }

            if (this.y < -100 || this.x < -150 || this.x > window.innerWidth + 150) {
                this.alive = false;
            }
        }

        draw(ctx) {
            if (this.alpha <= 0) return;
            const s = this.size;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = this.alpha;
            ctx.shadowColor = '#3a0000';
            ctx.shadowBlur  = 4;
            ctx.fillStyle   = '#1a0505';

            // Cuerpo
            ctx.beginPath();
            ctx.ellipse(0, 0, s*0.22, s*0.3, 0, 0, Math.PI*2);
            ctx.fill();

            // Ala izquierda
            const w = Math.cos(this.wingPhase) * s;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(s*0.3, -s*0.6, w, -s*0.5, w, 0);
            ctx.bezierCurveTo(w*0.6,  s*0.2, s*0.2, s*0.15, 0, 0);
            ctx.fill();

            // Ala derecha (espejo)
            ctx.save();
            ctx.scale(-1, 1);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(s*0.3, -s*0.6, w, -s*0.5, w, 0);
            ctx.bezierCurveTo(w*0.6,  s*0.2, s*0.2, s*0.15, 0, 0);
            ctx.fill();
            ctx.restore();

            // Ojos brillantes
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur  = 5;
            ctx.fillStyle   = '#ff2222';
            ctx.globalAlpha = this.alpha * 0.95;
            const e = Math.max(1, s * 0.07);
            ctx.beginPath();
            ctx.arc(-s*0.08, -s*0.1, e, 0, Math.PI*2);
            ctx.arc( s*0.08, -s*0.1, e, 0, Math.PI*2);
            ctx.fill();

            ctx.restore();
        }
    }

    const bats = [];

    // Rutina de spawn normal
    function spawnRoutine() {
        if (bats.filter(b => !b.burst).length < 8) {
            bats.push(new Bat(false));
        }
        setTimeout(spawnRoutine, 2000 + Math.random() * 3000);
    }
    setTimeout(spawnRoutine, 500);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = bats.length - 1; i >= 0; i--) {
            bats[i].update();
            bats[i].draw(ctx);
            if (!bats[i].alive) bats.splice(i, 1);
        }
        requestAnimationFrame(animate);
    }
    animate();

    // Burst de murciélagos (al entrar / al enviar)
    window.spawnBatBurst = function (count = 25) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => bats.push(new Bat(true)), i * 60);
        }
    };
})();

// ============================================================
// CANVAS DE DIBUJO — Con CTRL+Z y resize sin bugeo
// ============================================================
(function initDrawCanvas() {
    const canvas    = document.getElementById('drawCanvas');
    const ctx       = canvas.getContext('2d');
    const hint      = document.getElementById('canvasHint');
    const dataInput = document.getElementById('canvasData');
    const undoBtn   = document.getElementById('undoBtn');

    let drawing   = false;
    let color     = '#e8e0e0';
    let brushSize = 3;
    let eraser    = false;
    let firstDraw = true;
    let lastX     = 0;
    let lastY     = 0;

    // ---- Historia para CTRL+Z ----
    const history  = [];
    let histIndex  = -1;
    const MAX_HIST = 40;

    function saveState() {
        // Eliminar redo states
        if (histIndex < history.length - 1) {
            history.splice(histIndex + 1);
        }
        history.push(canvas.toDataURL());
        if (history.length > MAX_HIST) history.shift();
        histIndex = history.length - 1;
        updateUndoBtn();
    }

    function undo() {
        if (histIndex <= 0) return;
        histIndex--;
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = history[histIndex];
        updateUndoBtn();
    }

    function updateUndoBtn() {
        undoBtn.disabled = histIndex <= 0;
    }

    // ---- Resize SIN perder el dibujo ----
    // La estrategia: fijar el canvas en píxeles internos a un valor razonable
    // y dejar que CSS lo escale. Así nunca se redimensionan los píxeles internos.
    function initCanvas() {
        const parentW = canvas.parentElement.clientWidth;
        // Solo inicializar una vez (fijar resolución interna)
        if (canvas.width === 0 || canvas._initialized !== true) {
            const w = Math.min(parentW, 900);
            const h = Math.min(360, Math.max(240, w * 0.5));
            canvas.width  = w;
            canvas.height = h;
            canvas._initialized = true;
            // Fondo base
            ctx.fillStyle = '#0a0308';
            ctx.fillRect(0, 0, w, h);
            // Guardar estado inicial
            saveState();
        }
        // El CSS ya hace width:100% — el canvas se escala visualmente
    }

    initCanvas();

    // En resize solo recalculamos coordenadas (no tocamos el canvas interno)
    window.addEventListener('resize', () => {
        // No hacemos nada con el canvas — solo el CSS lo escala
        // Esto evita el bugeo por completo
    });

    // ---- Coordenadas correctas (escala CSS vs resolución interna) ----
    function getPos(e) {
        const rect   = canvas.getBoundingClientRect();
        const scaleX = canvas.width  / rect.width;
        const scaleY = canvas.height / rect.height;
        const src    = e.touches ? e.touches[0] : e;
        return {
            x: (src.clientX - rect.left) * scaleX,
            y: (src.clientY - rect.top)  * scaleY
        };
    }

    function startDraw(e) {
        e.preventDefault();
        drawing = true;
        if (firstDraw) {
            firstDraw = false;
            hint.classList.add('hidden');
        }
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
        if (!drawing) return;
        e.preventDefault();
        const pos = getPos(e);

        ctx.lineWidth   = brushSize;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';

        if (eraser) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.shadowBlur  = 0;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur  = Math.min(brushSize * 0.6, 8);
        }

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        lastX = pos.x;
        lastY = pos.y;
    }

    function stopDraw() {
        if (!drawing) return;
        drawing = false;
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        saveState();
        dataInput.value = canvas.toDataURL('image/png');
    }

    // Eventos mouse
    canvas.addEventListener('mousedown',  startDraw);
    canvas.addEventListener('mousemove',  draw);
    canvas.addEventListener('mouseup',    stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    // Eventos touch
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove',  draw,      { passive: false });
    canvas.addEventListener('touchend',   stopDraw);

    // ---- CTRL+Z global ----
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            // Solo si el foco no está en un input de texto
            const tag = document.activeElement?.tagName;
            if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
                e.preventDefault();
                undo();
            }
        }
    });

    // ---- Botón deshacer ----
    undoBtn.addEventListener('click', undo);
    updateUndoBtn();

    // ---- Colores ----
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            color  = btn.dataset.color;
            eraser = false;
            eraserBtn.style.cssText = '';
        });
    });

    // ---- Tamaños ----
    document.querySelectorAll('.brush-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            brushSize = parseInt(btn.dataset.size);
        });
    });

    // ---- Borrador ----
    const eraserBtn = document.getElementById('eraserBtn');
    eraserBtn.addEventListener('click', function () {
        eraser = !eraser;
        this.style.borderColor = eraser ? '#c0392b' : '';
        this.style.background  = eraser ? 'rgba(192,57,43,0.2)' : '';
        this.style.color       = eraser ? '#e74c3c' : '';
    });

    // ---- Limpiar ----
    document.getElementById('clearBtn').addEventListener('click', () => {
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a0308';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        dataInput.value = '';
        firstDraw = true;
        hint.classList.remove('hidden');
        saveState();
    });
})();

// ============================================================
// FORMULARIO — Submit con efectos
// ============================================================
document.getElementById('mainForm').addEventListener('submit', function () {
    const canvas = document.getElementById('drawCanvas');
    document.getElementById('canvasData').value = canvas.toDataURL('image/png');

    window.spawnBatBurst && window.spawnBatBurst(35);

    document.getElementById('bloodOverlay').classList.add('active');
    setTimeout(() => document.getElementById('submitModal').classList.add('active'), 600);
});

// ============================================================
// EFECTO FOCUS en preguntas
// ============================================================
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    .pregunta.focused { transform: translateX(4px); transition: transform 0.3s ease; }
    .pregunta.focused label { color: #f5d0d0 !important; }
`;
document.head.appendChild(focusStyle);

document.querySelectorAll('input[type="text"], textarea, select').forEach(el => {
    el.addEventListener('focus', function () { this.closest('.pregunta')?.classList.add('focused'); });
    el.addEventListener('blur',  function () { this.closest('.pregunta')?.classList.remove('focused'); });
});

// ============================================================
// MENSAJES OCULTOS — Secretos escondidos para ella 🦇
// ============================================================
(function initSecrets() {
    let msgTimer = null;
    let hoverTimer = null;

    function trigger(idx) {
        clearTimeout(msgTimer);
        showSecret(idx);
        msgTimer = setTimeout(() => {}, 5000);
    }

    // Hover 2s en elementos con data-secret para revelar mensaje
    document.querySelectorAll('[data-secret]').forEach(el => {
        let holdTimer = null;
        el.addEventListener('mouseenter', function () {
            holdTimer = setTimeout(() => {
                trigger(secretIndex++ % secretMessages.length);
            }, 1800);
        });
        el.addEventListener('mouseleave', () => clearTimeout(holdTimer));
        el.addEventListener('touchstart', function (e) {
            holdTimer = setTimeout(() => {
                trigger(secretIndex++ % secretMessages.length);
            }, 1800);
        }, { passive: true });
        el.addEventListener('touchend', () => clearTimeout(holdTimer));
    });

    // Easter egg en el logo
    document.querySelector('.bat-logo')?.addEventListener('click', () => {
        window.spawnBatBurst && window.spawnBatBurst(20);
        trigger(secretIndex++ % secretMessages.length);
    });

    // Consola — mensajes bonitos para quien inspeccione 🦇
    const css1 = 'color:#c0392b;font-family:serif;font-size:18px;font-weight:bold;';
    const css2 = 'color:#c9a84c;font-family:serif;font-size:14px;font-style:italic;';
    const css3 = 'color:#a89090;font-family:serif;font-size:12px;';
    console.log('%c🦇 Hola, curioso/a que mira el código...', css1);
    console.log('%c"Eres de las personas que hacen que valga la pena conocer el mundo."', css2);
    console.log('%cEste formulario fue hecho con cariño. Solo para ti.', css3);
    console.log('%c— Hovea los ⸸ y 🦇 del formulario para encontrar más secretos.', css3);
})();