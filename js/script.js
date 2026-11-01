/**
 * AVAZBEK SHAXSIY PORTFOLIO
 * Yuqori xavfsizlik, zamonaviy animatsiyalar va interaktiv emotsiya tizimi
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. WEB AUDIO API SYNTHESIZER (Xavfsiz va engil mikrotovushlar)
       ========================================================================== */
    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.enabled = true;
            this.init();
        }

        init() {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            } catch (e) {
                console.warn('AudioContext mavjud emas:', e);
            }
        }

        resume() {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playBlip(freq = 600, type = 'sine', duration = 0.08) {
            if (!this.enabled || !this.ctx) return;
            this.resume();
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration);

                gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                // Ignore audio error
            }
        }

        playChime() {
            if (!this.enabled || !this.ctx) return;
            this.playBlip(784, 'sine', 0.12);
            setTimeout(() => this.playBlip(1046, 'sine', 0.15), 60);
        }

        toggle() {
            this.enabled = !this.enabled;
            return this.enabled;
        }
    }

    const sound = new SoundEngine();

    // Sound Toggle Button Handler
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');
    if (soundToggle && soundIcon) {
        soundToggle.addEventListener('click', () => {
            const isEnabled = sound.toggle();
            soundIcon.textContent = isEnabled ? '🔊' : '🔇';
            if (isEnabled) sound.playChime();
        });
    }


    /* ==========================================================================
       2. PRELOADER ANIMATION
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    const preloaderProgress = document.getElementById('preloaderProgress');
    const preloaderText = document.getElementById('preloaderText');

    let loadProgress = 0;
    const progressInterval = setInterval(() => {
        loadProgress += Math.floor(Math.random() * 20) + 10;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(progressInterval);
            if (preloaderProgress) preloaderProgress.style.width = '100%';
            if (preloaderText) preloaderText.textContent = 'Tayyor!';

            setTimeout(() => {
                if (preloader) preloader.classList.add('fade-out');
                document.body.classList.remove('loading-active');
                initCounters();
            }, 300);
        } else {
            if (preloaderProgress) preloaderProgress.style.width = `${loadProgress}%`;
        }
    }, 45);


    /* ==========================================================================
       3. AMBIENT CANVAS NETWORK (ZAMONAVIY FON ANIMATSIYASI)
       ========================================================================== */
    const canvas = document.getElementById('ambientCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(width > 768 ? 45 : 20, 50);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 - dist / 130 * 0.12})`;
                        ctx.lineWidth = 0.7;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }


    /* ==========================================================================
       4. CUSTOM CURSOR GLOW SPOTLIGHT
       ========================================================================== */
    const cursorGlow = document.getElementById('cursorGlow');
    const cursorDot = document.getElementById('cursorDot');

    if (cursorGlow && cursorDot && window.innerWidth > 768) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function renderCursor() {
            glowX += (mouseX - glowX) * 0.12;
            glowY += (mouseY - glowY) * 0.12;

            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;

            requestAnimationFrame(renderCursor);
        }
        renderCursor();
    }


    /* ==========================================================================
       5. EMOTION & VIBE SYSTEM (ASOSIY TALAB: EMOTSIYA BILAN)
       ========================================================================== */
    const vibeButtons = document.querySelectorAll('.vibe-btn');
    const dynamicQuoteText = document.getElementById('dynamicQuoteText');
    const currentVibeIcon = document.getElementById('currentVibeIcon');
    const currentVibeLabel = document.getElementById('currentVibeLabel');
    const avatarParticles = document.getElementById('avatarParticles');

    function spawnEmotionBurst(emoji, mood) {
        if (!avatarParticles) return;
        const currentMood = mood || document.documentElement.getAttribute('data-mood') || 'energetic';
        const starSymbols = ['✦', '✨', '⭐', '★', '✧', '🌟'];
        const starPalettes = {
            energetic: ['#00f0ff', '#38bdf8', '#67e8f9', '#ffffff'],
            passionate: ['#fbbf24', '#f59e0b', '#f97316', '#ffffff'],
            creative: ['#c084fc', '#e879f9', '#a855f7', '#ffffff'],
            focused: ['#34d399', '#10b981', '#6ee7b7', '#ffffff']
        };
        const activePalette = starPalettes[currentMood] || starPalettes.energetic;

        for (let i = 0; i < 14; i++) {
            const particle = document.createElement('span');
            particle.className = 'emotion-sparkle star-sparkle';
            const sym = starSymbols[i % starSymbols.length];
            particle.textContent = sym;
            particle.style.position = 'absolute';
            particle.style.left = `${48 + (Math.random() - 0.5) * 20}%`;
            particle.style.top = `${50 + (Math.random() - 0.5) * 20}%`;
            particle.style.fontSize = `${Math.random() * 1.1 + 0.9}rem`;
            const color = activePalette[Math.floor(Math.random() * activePalette.length)];
            particle.style.color = color;
            particle.style.textShadow = `0 0 10px ${color}, 0 0 20px #ffffff`;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '35';
            particle.style.opacity = '1';
            particle.style.transition = 'all 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
            particle.style.transform = 'translate(0, 0) scale(0.5) rotate(0deg)';

            avatarParticles.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 130 + 60;
            const rot = (Math.random() - 0.5) * 540;

            setTimeout(() => {
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(${Math.random() * 0.7 + 0.6}) rotate(${rot}deg)`;
                particle.style.opacity = '0';
            }, 20);

            setTimeout(() => {
                if (particle.parentNode) particle.remove();
            }, 1150);
        }
    }

    function setMood(mood, vibeLabel, quoteText, emoji) {
        document.documentElement.setAttribute('data-mood', mood);
        localStorage.setItem('avazbek_mood', mood);

        // Update active vibe buttons
        vibeButtons.forEach(btn => {
            if (btn.getAttribute('data-mood') === mood) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update quote with smooth fade
        if (dynamicQuoteText) {
            dynamicQuoteText.style.opacity = '0';
            setTimeout(() => {
                dynamicQuoteText.textContent = quoteText;
                dynamicQuoteText.style.opacity = '1';
            }, 150);
        }

        if (currentVibeIcon) currentVibeIcon.textContent = emoji;
        if (currentVibeLabel) currentVibeLabel.textContent = vibeLabel;

        spawnEmotionBurst(emoji, mood);
        sound.playChime();
    }

    vibeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = btn.getAttribute('data-mood');
            const vibe = btn.getAttribute('data-vibe');
            const quote = btn.getAttribute('data-quote');
            const emoji = btn.querySelector('.vibe-emoji').textContent;
            setMood(mood, vibe, quote, emoji);
        });
    });

    // Restore saved mood or default to energetic
    const savedMood = localStorage.getItem('avazbek_mood');
    if (savedMood) {
        const matchingBtn = document.querySelector(`.vibe-btn[data-mood="${savedMood}"]`);
        if (matchingBtn) {
            matchingBtn.click();
        }
    }


    /* ==========================================================================
       6. 3D AVATAR CARD TILT (INTERAKTIV MAJBURIY EFFECT)
       ========================================================================== */
    const avatarCard = document.getElementById('avatar3DCard');
    const avatarFrame = document.getElementById('avatarImageFrame');

    if (avatarCard && window.innerWidth > 768) {
        avatarCard.addEventListener('mousemove', (e) => {
            const rect = avatarCard.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = -(y / (rect.height / 2)) * 10;
            const rotateY = (x / (rect.width / 2)) * 10;

            avatarCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        avatarCard.addEventListener('mouseleave', () => {
            avatarCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    }


    /* ==========================================================================
       7. COSMIC PARTICLE CONVERGENCE SYSTEM (ZARRACHALARDAN HOSIL BO'LISH)
       ========================================================================== */
    const heroAvatarImg = document.getElementById('heroAvatarImg');
    const avatarFileInput = document.getElementById('avatarFileInput');
    const starCanvas = document.getElementById('starAssemblyCanvas');

    let currentPhotoSrc = 'images/avazbek.jpg?v=' + Date.now();

    // Clear any previous stale cache to ensure newly uploaded portrait is always used
    try {
        localStorage.removeItem('avazbek_avatar_data');
    } catch (e) {}

    if (heroAvatarImg) {
        heroAvatarImg.src = currentPhotoSrc;
    }


    /* ----------------------------------------------------------------------
       FULLSCREEN COSMIC PARTICLE ENGINE (Butun Ekranda Zarrachalar)
       ---------------------------------------------------------------------- */
    let starParticles = [];
    let starburstEffects = [];
    let canvasW = window.innerWidth;
    let canvasH = window.innerHeight;
    let starCtx = null;

    function resizeStarCanvas() {
        if (!starCanvas || !starCtx) return;
        canvasW = window.innerWidth;
        canvasH = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        starCanvas.width = canvasW * dpr;
        starCanvas.height = canvasH * dpr;
        starCtx.setTransform(1, 0, 0, 1, 0, 0);
        starCtx.scale(dpr, dpr);

        // Update scatter points to span the full new screen dimensions
        if (starParticles.length > 0) {
            starParticles.forEach(p => {
                p.scatterX = Math.random() * (canvasW + 160) - 80;
                p.scatterY = Math.random() * (canvasH + 160) - 80;
            });
        }
    }
    window.addEventListener('resize', resizeStarCanvas);

    const colorPalette = [
        '#00f0ff', // electric cyan
        '#ffd700', // radiant gold
        '#c084fc', // cosmic purple
        '#f43f5e', // ruby rose
        '#10b981', // emerald green
        '#fb923c', // amber orange
        '#38bdf8', // sky cyan
        '#e879f9', // neon magenta
        '#34d399', // bright mint
        '#ffffff'  // diamond white
    ];

    // High-performance GPU offscreen sprite cache (Zero shadowBlur lag, 60-120fps buttery smooth)
    const dotSpriteCache = {};
    function getDotSprite(color) {
        if (dotSpriteCache[color]) return dotSpriteCache[color];
        const off = document.createElement('canvas');
        const size = 32;
        off.width = size;
        off.height = size;
        const oCtx = off.getContext('2d');
        const center = size / 2;

        // Radial pinpoint glow
        const grad = oCtx.createRadialGradient(center, center, 0, center, center, center);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.25, '#ffffff');
        grad.addColorStop(0.5, color);
        grad.addColorStop(0.85, color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        oCtx.fillStyle = grad;
        oCtx.beginPath();
        oCtx.arc(center, center, center, 0, Math.PI * 2);
        oCtx.fill();

        dotSpriteCache[color] = off;
        return off;
    }

    function initStarParticles() {
        if (!starCanvas) return;
        starCtx = starCanvas.getContext('2d');
        resizeStarCanvas();

        const cols = 28;
        const rows = 40;
        starParticles = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Normalized coordinate across the photo frame (0.0 to 1.0)
                const u = (c + 0.5) / cols;
                const v = (r + 0.5) / rows;

                // Full-screen scatter across the entire window
                const scatterX = Math.random() * (canvasW + 160) - 80;
                const scatterY = Math.random() * (canvasH + 160) - 80;

                // Rich distinct colors for each tiny dot particle
                const color = colorPalette[(r * 7 + c * 13) % colorPalette.length];

                // Juda kichkina, nuqtadek radius (0.8px - 1.4px)
                const radius = 0.8 + Math.random() * 0.6;
                const sprite = getDotSprite(color);

                starParticles.push({
                    u,
                    v,
                    scatterX,
                    scatterY,
                    orbitRadius: 16 + Math.random() * 38,
                    orbitSpeed: 0.025 + Math.random() * 0.045, // Tez va jonli harakat
                    orbitPhase: Math.random() * Math.PI * 2,
                    color,
                    radius,
                    sprite,
                    twinkleSpeed: 0.06 + Math.random() * 0.1,
                    twinklePhase: Math.random() * Math.PI * 2,
                    trail: []
                });
            }
        }
    }

    // Draw ultra-small pinpoint dot particle (Tez, yengil va qotmaydigan GPU blitting)
    function drawDotParticle(ctx, x, y, radius, sprite, alpha) {
        if (alpha <= 0.01) return;
        ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
        const drawSize = radius * 4.6;
        ctx.drawImage(sprite, x - drawSize * 0.5, y - drawSize * 0.5, drawSize, drawSize);
    }

    function ctxPointTrail(ctx, x, y, radius, sprite, alpha) {
        if (alpha <= 0.01) return;
        ctx.globalAlpha = Math.min(1, Math.max(0, alpha * 0.4));
        const drawSize = radius * 2.6;
        ctx.drawImage(sprite, x - drawSize * 0.5, y - drawSize * 0.5, drawSize, drawSize);
    }

    function spawnStarburstLock() {
        const frameRect = avatarFrame ? avatarFrame.getBoundingClientRect() : null;
        const targetW = frameRect ? frameRect.width : 340;
        const targetH = frameRect ? frameRect.height : 420;
        const targetLeft = frameRect ? frameRect.left : (canvasW - targetW) / 2;
        const targetTop = frameRect ? frameRect.top : (canvasH - targetH) / 2;

        for (let i = 0; i < 60; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2.0 + Math.random() * 5.5;
            const color = colorPalette[i % colorPalette.length];
            starburstEffects.push({
                x: targetLeft + Math.random() * targetW,
                y: targetTop + Math.random() * targetH,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: 0.024 + Math.random() * 0.026,
                radius: 0.7 + Math.random() * 1.2,
                color
            });
        }
    }

    function getMoodStarlightColor() {
        const mood = document.documentElement.getAttribute('data-mood') || 'energetic';
        switch (mood) {
            case 'passionate': return '#fbbf24';
            case 'creative':   return '#c084fc';
            case 'focused':    return '#34d399';
            case 'energetic':
            default:           return '#00f0ff';
        }
    }

    // Scroll-driven assembly variables
    let targetProgress = 0;
    let currentProgress = 0;
    let isAssembledLocked = false;

    function getTargetProgress() {
        const sy = window.scrollY || window.pageYOffset || 0;
        const assembleThreshold = 180; // Tez va chaqqon yig'ilish masofasi
        return Math.min(1, Math.max(0, sy / assembleThreshold));
    }

    function applyCosmicStarAssembly(t) {
        const invertT = 1 - t;
        const ease = invertT * invertT; // quadratic ease
        const time = performance.now() * 0.003;
        const moodColor = getMoodStarlightColor();

        // Screen bounding box of the avatar photo
        const frameRect = avatarFrame ? avatarFrame.getBoundingClientRect() : null;
        const targetW = frameRect ? frameRect.width : 340;
        const targetH = frameRect ? frameRect.height : 420;
        const targetLeft = frameRect ? frameRect.left : (canvasW - targetW) / 2;
        const targetTop = frameRect ? frameRect.top : (canvasH - targetH) / 2;

        // 1. Render Fullscreen Swarm of GPU-accelerated Pinpoint Dots (0 lag)
        if (starCtx) {
            starCtx.clearRect(0, 0, canvasW, canvasH);

            // Zarrachalar yig'ilib bo'lgach (t >= 0.96), ular rasm ustida mutlaqo ko'rinmaydi!
            if (t < 0.96 && starParticles.length > 0) {
                // Zarrachalar rasmga yaqinlashganda (t = 0.84 dan 0.96 gacha) silliq erib ketadi
                const dotFade = t <= 0.84 ? 1.0 : Math.max(0, 1 - (t - 0.84) / 0.12);

                starParticles.forEach((p) => {
                    // Target destination on the photo card
                    const destX = targetLeft + p.u * targetW;
                    const destY = targetTop + p.v * targetH;

                    // Orbital hovering drift across the full screen when scattered
                    const hoverX = Math.cos(time * p.orbitSpeed + p.orbitPhase) * p.orbitRadius * ease;
                    const hoverY = Math.sin(time * p.orbitSpeed + p.orbitPhase) * p.orbitRadius * ease;

                    // Interpolated position: from full-screen scatter to target photo
                    const curX = destX + (p.scatterX - destX) * ease + hoverX;
                    const curY = destY + (p.scatterY - destY) * ease + hoverY;

                    const twinkle = 0.65 + 0.35 * Math.sin(time * p.twinkleSpeed + p.twinklePhase);
                    let alpha = (0.8 + 0.2 * (1 - ease * 0.1)) * twinkle * dotFade;
                    let curRadius = p.radius * (1 + ease * 0.1);

                    // Streaming filament motion trail as dots fly from across the screen
                    if (ease > 0.04 && ease < 0.94 && dotFade > 0.15) {
                        p.trail.push({ x: curX, y: curY, alpha: alpha * 0.35 });
                        if (p.trail.length > 3) p.trail.shift();

                        p.trail.forEach((pt, idx) => {
                            ctxPointTrail(starCtx, pt.x, pt.y, curRadius * (0.25 + idx * 0.15), p.sprite, pt.alpha * (idx / 3));
                        });
                    } else {
                        p.trail = [];
                    }

                    if (alpha > 0.01) {
                        drawDotParticle(starCtx, curX, curY, curRadius, p.sprite, alpha);
                    }
                });
            }

            // Render shockwave starburst sparks
            for (let i = starburstEffects.length - 1; i >= 0; i--) {
                const sp = starburstEffects[i];
                sp.x += sp.vx;
                sp.y += sp.vy;
                sp.life -= sp.decay;

                if (sp.life <= 0) {
                    starburstEffects.splice(i, 1);
                } else {
                    const spSprite = getDotSprite(sp.color || '#ffffff');
                    drawDotParticle(starCtx, sp.x, sp.y, sp.radius * sp.life, spSprite, sp.life);
                }
            }
        }

        // 2. Synthesize unified portrait ONLY AS particles arrive (t >= 0.84)
        if (avatarFrame) {
            if (t >= 0.84) {
                // Smooth lock-in when particles arrive
                const revealProgress = Math.min(1, Math.max(0, (t - 0.84) / 0.12));
                avatarFrame.style.opacity = revealProgress.toFixed(3);
                avatarFrame.style.filter = `brightness(${(1 + (1 - revealProgress) * 0.2).toFixed(2)}) drop-shadow(0 0 ${(18 * (1 - revealProgress)).toFixed(0)}px ${moodColor})`;
            } else {
                // Photo is completely hidden while particles are traveling!
                avatarFrame.style.opacity = '0';
                avatarFrame.style.filter = 'none';
            }
        }

        // Fade aura rings & floating badges in harmony with assembly
        const ringOuter = document.getElementById('glowRingOuter');
        const ringInner = document.getElementById('glowRingInner');
        if (ringOuter) ringOuter.style.opacity = Math.max(0.06, t * t).toFixed(2);
        if (ringInner) ringInner.style.opacity = Math.max(0.06, t * t).toFixed(2);

        const badgeExp = document.getElementById('badgeExp');
        const badgeQuality = document.getElementById('badgeQuality');
        if (badgeExp) badgeExp.style.opacity = (0.15 + 0.85 * t).toFixed(2);
        if (badgeQuality) badgeQuality.style.opacity = (0.15 + 0.85 * t).toFixed(2);

        // Sound chime and starburst shockwave on full synthesis
        if (t >= 0.98 && !isAssembledLocked) {
            isAssembledLocked = true;
            sound.playChime();
            spawnStarburstLock();
            if (avatarCard) {
                avatarCard.classList.add('assembled-pulse');
                setTimeout(() => avatarCard.classList.remove('assembled-pulse'), 850);
            }
        } else if (t < 0.85) {
            isAssembledLocked = false;
        }
    }

    // Initialize the star system
    initStarParticles();

    // Silky smooth 60-120fps spring lerp animation loop (Chaqqon va tezkor)
    function matrixRenderLoop() {
        targetProgress = getTargetProgress();
        const diff = targetProgress - currentProgress;
        if (Math.abs(diff) > 0.001) {
            currentProgress += diff * 0.26; // 60% tezroq va chaqqonroq javob beradi
        } else {
            currentProgress = targetProgress;
        }

        applyCosmicStarAssembly(currentProgress);
        requestAnimationFrame(matrixRenderLoop);
    }
    matrixRenderLoop();

    // Interactive mouse stars trail anywhere on the screen
    window.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.45 || !starCtx) return;
        if (window.scrollY < window.innerHeight * 1.5) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.2 + Math.random() * 2.8;
            starburstEffects.push({
                x: e.clientX,
                y: e.clientY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.5,
                life: 0.85,
                decay: 0.035,
                radius: 1.2 + Math.random() * 2.0,
                color: colorPalette[Math.floor(Math.random() * colorPalette.length)]
            });
        }
    });

    // User can click camera icon and choose their local photo directly
    if (avatarFileInput && heroAvatarImg) {
        avatarFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target.result;
                    heroAvatarImg.src = result;
                    try {
                        localStorage.setItem('avazbek_avatar_data', result);
                    } catch (err) {
                        console.warn('Storage limit:', err);
                    }
                    showToast('Rasm yangilandi!', 'Siz tanlagan yangi rasm portfolioga muvaffaqiyatli yuklandi.');
                    sound.playChime();
                };
                reader.readAsDataURL(file);
            }
        });
    }


    /* ==========================================================================
       8. TYPEWRITER EFFECT
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriterText');
    const roles = [
        "Full-Stack Dasturchi",
        "Creative UI/UX Engineer",
        "Frontend Mutaxassisi",
        "Xavfsiz Tizimlar Arxitektori",
        "Raqamli Innovator"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeWriterLoop() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 110;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400; // Pause before new word
        }

        setTimeout(typeWriterLoop, typingSpeed);
    }

    if (typewriterElement) {
        typeWriterLoop();
    }


    /* ==========================================================================
       9. STICKY NAVBAR & SCROLL SPY
       ========================================================================== */
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Sticky Header shadow
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll spy
        let currentSectionId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 140;
            const height = sec.offsetHeight;
            if (window.scrollY >= top && window.scrollY < top + height) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       10. MOBILE HAMBURGER MENU DRAWER
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const drawerClose = document.getElementById('drawerClose');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        mobileDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        sound.playBlip(500);
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));


    /* ==========================================================================
       11. MULTI-LANGUAGE SYSTEM (UZ, EN, RU)
       ========================================================================== */
    const translations = {
        uz: {
            nav_home: "Bosh sahifa",
            nav_about: "Haqimda",
            nav_skills: "Ko'nikmalar",
            nav_projects: "Loyihalar",
            nav_services: "Xizmatlar",
            nav_experience: "Tajriba",
            nav_contact: "Aloqa",
            nav_hire: "Bog'lanish",
            hero_status: "🚀 Yangi loyihalar uchun ochiqman",
            hero_greeting: "Assalomu alaykum, men",
            hero_desc: "Zamonaviy, yuqori darajada xavfsiz va ko'zni qamashtiruvchi raqamli veb-tajribalar yarataman. Har bir kod qatoriga chuqur ishtiyoq, har bir pikselga esa mukammallik bag'ishlayman.",
            hero_btn_projects: "Loyihalarni ko'rish",
            hero_btn_contact: "Bog'lanish",
            hero_btn_cv: "CV / Rezyume",
            hero_socials_label: "Ijtimoiy tarmoqlar:",
            hero_scroll: "Pastga suring",
            stat_projects: "Muvaffaqiyatli Loyihalar",
            stat_satisfaction: "Mijozlar Mamnuniyati",
            stat_exp: "Yillik Amaliy Tajriba",
            stat_security: "Xavfsizlik & Toza Kod",
            about_tag: "<Tanishing />",
            about_title: "Men Haqimda",
            about_subtitle: "Mukammallik sari intiluvchi dasturchining qadriyatlari va faoliyati",
            skills_tag: "<Imkoniyatlar />",
            skills_title: "Ko'nikmalar & Texnologiyalar",
            skills_subtitle: "Har kuni amalda qo'llaniladigan va chuqur o'rganilgan zamonaviy vositalar",
            projects_tag: "<Portfolio />",
            projects_title: "Saralangan Loyihalar",
            projects_subtitle: "Amalda tatbiq etilgan eng muvaffaqiyatli va zamonaviy yechimlar",
            services_tag: "<Takliflar />",
            services_title: "Ko'rsatiladigan Xizmatlar",
            services_subtitle: "Biznesingiz yoki loyihangiz uchun noldan to'liq ishga tushirishgacha professional xizmatlar",
            exp_tag: "<Yo'l Xaritasi />",
            exp_title: "Tajriba & Bosqichlar",
            exp_subtitle: "Kasbiy rivojlanish va muvaffaqiyatli qadamlar xronologiyasi",
            contact_tag: "<Bog'lanish />",
            contact_title: "Keling, Birga Yaratamiz!",
            contact_subtitle: "Loyihangiz bormi yoki yangi g'oyani muhokama qilmoqchimisiz? Men doim tayyorman!"
        },
        en: {
            nav_home: "Home",
            nav_about: "About",
            nav_skills: "Skills",
            nav_projects: "Projects",
            nav_services: "Services",
            nav_experience: "Experience",
            nav_contact: "Contact",
            nav_hire: "Contact Me",
            hero_status: "🚀 Available for new projects",
            hero_greeting: "Hello, I am",
            hero_desc: "Building high-performance, ultra-secure, and visually stunning digital web experiences with passion in every line of code.",
            hero_btn_projects: "View Projects",
            hero_btn_contact: "Get in Touch",
            hero_btn_cv: "Download CV",
            hero_socials_label: "Social links:",
            hero_scroll: "Scroll down",
            stat_projects: "Completed Projects",
            stat_satisfaction: "Client Satisfaction",
            stat_exp: "Years Experience",
            stat_security: "Security & Clean Code",
            about_tag: "<Meet Me />",
            about_title: "About Me",
            about_subtitle: "Values and philosophy of a developer dedicated to excellence",
            skills_tag: "<Capabilities />",
            skills_title: "Skills & Technologies",
            skills_subtitle: "Modern tools and stacks applied daily in production",
            projects_tag: "<Portfolio />",
            projects_title: "Featured Projects",
            projects_subtitle: "Real-world implementations built for scale and aesthetics",
            services_tag: "<What I Offer />",
            services_title: "Professional Services",
            services_subtitle: "Full-cycle software engineering solutions tailored to your vision",
            exp_tag: "<Roadmap />",
            exp_title: "Experience & Journey",
            exp_subtitle: "Chronology of professional growth and milestones",
            contact_tag: "<Contact />",
            contact_title: "Let's Build Something Great!",
            contact_subtitle: "Have a project idea or want to collaborate? I'm just a message away!"
        },
        ru: {
            nav_home: "Главная",
            nav_about: "Обо мне",
            nav_skills: "Навыки",
            nav_projects: "Проекты",
            nav_services: "Услуги",
            nav_experience: "Опыт",
            nav_contact: "Контакты",
            nav_hire: "Связаться",
            hero_status: "🚀 Открыт для новых проектов",
            hero_greeting: "Здравствуйте, я",
            hero_desc: "Создаю современные, безопасные и высокопроизводительные веб-приложения со страстью в каждой строчке кода.",
            hero_btn_projects: "Смотреть проекты",
            hero_btn_contact: "Связаться",
            hero_btn_cv: "Резюме / CV",
            hero_socials_label: "Социальные сети:",
            hero_scroll: "Листайте вниз",
            stat_projects: "Успешных проектов",
            stat_satisfaction: "Довольных клиентов",
            stat_exp: "Года опыта",
            stat_security: "Безопасный код",
            about_tag: "<Знакомство />",
            about_title: "Обо мне",
            about_subtitle: "Принципы и профессиональный подход к разработке",
            skills_tag: "<Стек />",
            skills_title: "Навыки и технологии",
            skills_subtitle: "Современные инструменты, применяемые на практике",
            projects_tag: "<Портфолио />",
            projects_title: "Избранные проекты",
            projects_subtitle: "Реальные продукты с фокусом на результат и дизайн",
            services_tag: "<Услуги />",
            services_title: "Что я предлагаю",
            services_subtitle: "Полный цикл разработки от идеи до стабильного запуска",
            exp_tag: "<Карьера />",
            exp_title: "Опыт и этапы",
            exp_subtitle: "Хронология профессионального развития",
            contact_tag: "<Связь />",
            contact_title: "Давайте воплотим идеи в жизнь!",
            contact_subtitle: "Есть интересная задача или проект? Всегда готов к сотрудничеству!"
        }
    };

    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');
    const currentLangText = document.getElementById('currentLang');
    const langOptions = document.querySelectorAll('.lang-option');

    function applyLanguage(lang) {
        if (!translations[lang]) return;
        currentLangText.textContent = lang.toUpperCase();

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        langOptions.forEach(opt => {
            if (opt.getAttribute('data-lang') === lang) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });

        localStorage.setItem('avazbek_lang', lang);
        sound.playBlip(700);
    }

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('show');
        });

        window.addEventListener('click', () => {
            langMenu.classList.remove('show');
        });

        langOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                const lang = opt.getAttribute('data-lang');
                applyLanguage(lang);
                langMenu.classList.remove('show');
            });
        });
    }

    const savedLang = localStorage.getItem('avazbek_lang') || 'uz';
    if (savedLang !== 'uz') {
        applyLanguage(savedLang);
    }


    /* ==========================================================================
       12. STATS COUNTER ANIMATION (INTERSECTION OBSERVER)
       ========================================================================== */
    let countersInitiated = false;
    function initCounters() {
        if (countersInitiated) return;
        const statNums = document.querySelectorAll('.stat-num');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersInitiated) {
                    countersInitiated = true;
                    statNums.forEach(num => {
                        const target = parseInt(num.getAttribute('data-target'), 10);
                        let count = 0;
                        const duration = 1500;
                        const stepTime = Math.max(Math.floor(duration / target), 20);

                        const timer = setInterval(() => {
                            count += 1;
                            num.textContent = count;
                            if (count >= target) {
                                num.textContent = target;
                                clearInterval(timer);
                            }
                        }, stepTime);
                    });
                }
            });
        }, { threshold: 0.3 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) observer.observe(statsSection);
    }


    /* ==========================================================================
       13. SKILLS CATEGORY FILTER
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInCard 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
            sound.playBlip(650);
        });
    });


    /* ==========================================================================
       14. PROJECTS CATEGORY FILTER
       ========================================================================== */
    const filterPills = document.querySelectorAll('.filter-pill');
    const projectCards = document.querySelectorAll('.project-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const filter = pill.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            sound.playBlip(680);
        });
    });


    /* ==========================================================================
       15. PROJECT DETAIL MODAL SYSTEM
       ========================================================================== */
    const projectModal = document.getElementById('projectModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalTag = document.getElementById('modalTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalPreviewGraphic = document.getElementById('modalPreviewGraphic');
    const modalDesc = document.getElementById('modalDesc');
    const modalTechTags = document.getElementById('modalTechTags');
    const modalHighlightsList = document.getElementById('modalHighlightsList');
    const modalLiveDemoBtn = document.getElementById('modalLiveDemoBtn');

    const projectData = {
        fintech: {
            title: "PayFlow — Onlayn Moliya & To'lovlar Tizimi",
            tag: "SaaS & FinTech",
            icon: "💳",
            desc: "Katta miqdordagi tranzaksiyalarni real vaqtda xavfsiz qayta ishlashga mo'ljallangan fintech platforma. Ma'lumotlarni tahlil qiluvchi interaktiv grafiklar, xavfsiz ikki bosqichli autentifikatsiya va to'lov hisobotlarini yaratish imkoniyatini taqdim etadi.",
            techs: ["React", "TypeScript", "Node.js", "PostgreSQL", "Chart.js", "Redis", "Docker"],
            highlights: [
                "Sekundiga 1,000+ tranzaksiyani xavfsiz qayta ishlash",
                "99.99% uzluksiz ishlash darajasi (High Availability)",
                "To'liq PCI-DSS xavfsizlik talablariga mos arxitektura"
            ]
        },
        edumaster: {
            title: "EduMaster AI — Aqlli Ta'lim Platformasi",
            tag: "AI & Ta'lim",
            icon: "🤖",
            desc: "Foydalanuvchilarning bilim darajasini avtomatik aniqlab, ularga individual ta'lim yo'l xaritasini shakllantiruvchi sun'iy intellektli ta'lim tizimi. Avtomatik test tekshirish va interaktiv maslahatchi botga ega.",
            techs: ["Next.js 14", "OpenAI API", "Tailwind CSS", "MongoDB", "Prisma", "WebSockets"],
            highlights: [
                "Sun'iy intellekt orqali 3 barobar tezroq o'zlashtirish",
                "15,000+ faol talaba tomonidan muvaffaqiyatli sinovdan o'tgan",
                "Har bir foydalanuvchiga moslashuvchan savol generatori"
            ]
        },
        apex: {
            title: "Apex Store — Katta Yuklamali Internet Do'kon",
            tag: "E-Commerce",
            icon: "🛍️",
            desc: "Zamonaviy dizaynga ega, 10,000 dan ortiq mahsulotlarni zumda filtrlash imkoniyatini beruvchi yirik onlayn savdo markazi. Click va Payme to'lov tizimlari bilan to'liq integratsiya qilingan.",
            techs: ["React.js", "Redux Toolkit", "Express.js", "PostgreSQL", "Stripe API", "AWS S3"],
            highlights: [
                "Sahifaning yuklanish vaqti 0.8 soniyadan kam",
                "Konversiya ko'rsatkichi 35% ga oshirilgan UX yechimlar",
                "Avtomatlashtirilgan kuryerlik va ombor boshqaruvi"
            ]
        },
        cloudsync: {
            title: "CloudSync — Bulutli Server & Server Boshqaruvi",
            tag: "Cloud SaaS",
            icon: "☁️",
            desc: "Bulutli infratuzilmalarni bitta qulay paneldan boshqarish, CPU/RAM yuklamasini kuzatish va avariya holatlarida darhol Telegramga xabarnoma yuborish tizimi.",
            techs: ["Vue 3", "Node.js", "Docker", "Prometheus", "Grafana", "Linux Bash"],
            highlights: [
                "Real vaqtli telemetriya va vizual grafiklar",
                "Avtomatlashtirilgan bir tugmali zaxira nusxa (Backup)",
                "Ko'p darajali rollar (RBAC) boshqaruvi"
            ]
        },
        healthpulse: {
            title: "HealthPulse — Xavfsiz Telemeditsina Servisi",
            tag: "WebRTC & Tibbiyot",
            icon: "🩺",
            desc: "Shifokor va bemorlar o'rtasida to'liq maxfiy va shifrlangan video konsultatsiyalarni o'tkazish, elektron tibbiy kartani yuritish imkonini beruvchi zamonaviy platforma.",
            techs: ["React", "WebRTC", "Socket.io", "Node.js", "AES-256 Encryption"],
            highlights: [
                "End-to-End shifrlangan video va audio aloqa",
                "Retseptlar va tahlillarni xavfsiz almashish",
                "Barcha qurilmalarda bir xil sifatli aloqa"
            ]
        },
        devforge: {
            title: "DevForge — Interaktiv Portfolio & UI Framework",
            tag: "Developer Studio",
            icon: "⚡",
            desc: "Dasturchilar o'z ishlarini eng nufuzli kompaniyalarga taqdim etishi uchun maxsus yaratilgan ultra-zamonaviy, 3D effektli va SEO optimallashgan portfolio platformasi.",
            techs: ["Vanilla JS", "Modern CSS", "HTML5 Canvas", "Web Audio API", "SEO Best Practices"],
            highlights: [
                "Zero-dependency: 100% toza va xavfsiz kod",
                "Google Lighthouse barcha mezonlarda 100/100",
                "Dinamik emotsiya va aura boshqaruvi"
            ]
        }
    };

    function openProjectModal(projectId) {
        const data = projectData[projectId];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalTag.textContent = data.tag;
        modalPreviewGraphic.textContent = data.icon;
        modalDesc.textContent = data.desc;

        modalTechTags.innerHTML = '';
        data.techs.forEach(t => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = t;
            modalTechTags.appendChild(span);
        });

        modalHighlightsList.innerHTML = '';
        data.highlights.forEach(h => {
            const li = document.createElement('li');
            li.textContent = h;
            modalHighlightsList.appendChild(li);
        });

        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        sound.playChime();
    }

    function closeProjectModal() {
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.project-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-project');
            openProjectModal(id);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);
    if (modalLiveDemoBtn) {
        modalLiveDemoBtn.addEventListener('click', () => {
            showToast('Jonli Namoyish', 'Loyiha demo versiyasi ochilmoqda...');
            sound.playBlip(750);
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });


    /* ==========================================================================
       16. TERMINAL CODE COPY FEATURE
       ========================================================================== */
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const devJsonCode = document.getElementById('devJsonCode');

    if (copyCodeBtn && devJsonCode) {
        copyCodeBtn.addEventListener('click', () => {
            const textToCopy = devJsonCode.innerText || devJsonCode.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyCodeBtn.classList.add('copied');
                sound.playBlip(880);
                setTimeout(() => copyCodeBtn.classList.remove('copied'), 2000);
            }).catch(() => {
                showToast('Nusxa olish', 'Matnni qo\'lda nusxalang');
            });
        });
    }


    /* ==========================================================================
       17. CV DOWNLOAD BUTTON HANDLER
       ========================================================================== */
    const cvDownloadBtn = document.getElementById('cvDownloadBtn');
    if (cvDownloadBtn) {
        cvDownloadBtn.addEventListener('click', () => {
            showToast('Rezyume / CV', 'Avazbek Xudoyqulovning (xudoyqulov.dev) to\'liq rezyumesi yuklab olinmoqda...');
            sound.playChime();
        });
    }


    /* ==========================================================================
       18. INTERACTIVE CONTACT FORM & TOAST NOTIFICATION
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    const toastNotification = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    let toastTimeout = null;

    function showToast(title, body, icon = '✅') {
        if (!toastNotification) return;
        toastTitle.textContent = title;
        toastBody.textContent = body;
        document.getElementById('toastIcon').textContent = icon;

        toastNotification.classList.add('show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Cybersecurity Anti-Bot Trap (Honeypot)
            const honeypot = document.getElementById('contactHoneypot');
            if (honeypot && honeypot.value) {
                console.warn('Bot faolligi aniqlandi va so\'rov bloklandi.');
                return; // Botlar uchun so'rovni jimgina to'xtatish
            }

            // 2. Anti-Spam & DoS Rate Limiting (Token Bucket)
            if (window.SecurityGuard && !window.SecurityGuard.rateLimiter.checkAllowed()) {
                const cooldown = window.SecurityGuard.rateLimiter.getRemainingCooldown();
                showToast(
                    'Xavfsizlik Cheklovi (Anti-Spam)',
                    `Iltimos, qayta yuborish uchun ${cooldown} soniya kuting.`,
                    '⏳'
                );
                if (sound) sound.playBlip(250, 'sawtooth');
                return;
            }

            const nameInput = document.getElementById('userName');
            const emailInput = document.getElementById('userEmail');
            const messageInput = document.getElementById('userMessage');

            let rawName = nameInput.value.trim();
            let rawEmail = emailInput.value.trim();
            let rawMessage = messageInput.value.trim();

            let isValid = true;

            // Reset errors
            document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

            // 3. XSS & Code Injection Pattern Defense
            if (window.SecurityGuard && (
                window.SecurityGuard.detectSuspiciousPatterns(rawName) ||
                window.SecurityGuard.detectSuspiciousPatterns(rawEmail) ||
                window.SecurityGuard.detectSuspiciousPatterns(rawMessage)
            )) {
                showToast(
                    'Xavfsizlik Xatosi',
                    'Kiritilgan matnda taqiqlangan kod yoki shubhali belgilar aniqlandi!',
                    '🛡️'
                );
                if (sound) sound.playBlip(200, 'sawtooth');
                return;
            }

            if (!rawName) {
                nameInput.closest('.form-group').classList.add('has-error');
                isValid = false;
            }

            if (!rawEmail || rawEmail.length < 5) {
                emailInput.closest('.form-group').classList.add('has-error');
                isValid = false;
            }

            if (!rawMessage || rawMessage.length < 5) {
                messageInput.closest('.form-group').classList.add('has-error');
                isValid = false;
            }

            if (!isValid) {
                if (sound) sound.playBlip(300, 'sawtooth');
                return;
            }

            // 4. Secure Sanitization of User Inputs
            const safeName = window.SecurityGuard ? window.SecurityGuard.sanitizeText(rawName) : rawName;
            const safeMessage = window.SecurityGuard ? window.SecurityGuard.sanitizeText(rawMessage) : rawMessage;

            // Simulate form submission with protected feedback
            formSubmitBtn.classList.add('loading');
            if (sound) sound.playBlip(600);

            setTimeout(() => {
                formSubmitBtn.classList.remove('loading');
                contactForm.reset();
                showToast(
                    'Katta Rahmat!',
                    `Hurmatli ${safeName}, xabaringiz Avazbek Xudoyqulovga xavfsiz yetkazildi. Tez orada siz bilan bog'lanaman!`,
                    '🚀'
                );
                if (sound) sound.playChime();
            }, 1000);
        });
    }


    /* ==========================================================================
       19. BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            sound.playBlip(750);
        });
    }


    /* ==========================================================================
       20. CURRENT YEAR AUTO-UPDATE
       ========================================================================== */
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

});
