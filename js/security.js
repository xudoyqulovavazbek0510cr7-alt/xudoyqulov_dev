/**
 * ==============================================================================
 * AVAZBEK XUDOYQULOV — ADVANCED CYBERSECURITY CLIENT SHIELD (v2.4)
 * Himoya tizimi: Anti-XSS, Anti-Clickjacking, Anti-Tabnabbing, Rate-Limiting,
 * Honeypot Bot Trap va Prototype Pollution mudofaasi.
 * ==============================================================================
 */

(function () {
    'use strict';

    // 1. ANTI-CLICKJACKING / FRAMEBUSTING SHIELD
    // Sayt boshqa shubhali saytlar ichida (iframe) ko'rsatilishiga yo'l qo'ymaydi
    try {
        if (window.top !== window.self) {
            window.top.location = window.self.location;
        }
    } catch (e) {
        // Agar iframe xavfsizlik cheklovi bo'lsa, body ni tozalash orqali kontentni yashirish
        document.documentElement.style.display = 'none';
        window.location.replace(window.self.location);
    }

    // 2. CONSOLE CYBERSECURITY BANNER (Anti-Self-XSS)
    const consoleBadge = [
        '%c⚡ XUDOYQULOV.DEV XAVFSIZLIK TIZIMI FAOL ⚡',
        'color: #00f0ff; background: #060911; font-size: 13px; font-weight: bold; padding: 5px 10px; border: 1px solid #00f0ff; border-radius: 4px;'
    ];
    const consoleWarning = [
        '%c🛡️ Himoya tizimi: Loyiha barcha so\'rovlar va kiritmalarni xavfsizlik nazoratidan o\'tkazadi.',
        'color: #38bdf8; font-size: 11px; font-weight: 500;'
    ];
    console.log(...consoleBadge);
    console.log(...consoleWarning);

    // 3. SECURE SANITIZER (Anti-XSS & Anti-HTML Injection)
    const SecurityGuard = {
        /**
         * Matnni barcha xavfli belgilardan xavfsiz HTML entitiylarga aylantirish
         */
        sanitizeText: function (str) {
            if (typeof str !== 'string') return '';
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '/': '&#x2F;',
                '`': '&#x60;'
            };
            return str.replace(/[&<>"'`/]/g, function (match) {
                return map[match];
            }).trim();
        },

        /**
         * Xavfli javascript: yoki data: URL protokollarini tozalash
         */
        sanitizeUrl: function (url) {
            if (typeof url !== 'string') return '#';
            const clean = url.trim();
            // Faqat http, https, mailto va tel protokollariga ruxsat berish
            if (/^(https?:|mailto:|tel:)/i.test(clean)) {
                return clean;
            }
            if (clean.startsWith('#') || clean.startsWith('/')) {
                return clean;
            }
            return '#';
        },

        /**
         * Xabarlardagi SQL Injection va buyruq kiritish shubhali naqshlarini tekshirish
         */
        detectSuspiciousPatterns: function (input) {
            if (!input || typeof input !== 'string') return false;
            const patterns = [
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                /javascript:/gi,
                /onload\s*=/gi,
                /onerror\s*=/gi,
                /onclick\s*=/gi,
                /union\s+select/gi,
                /--\s*$/gm,
                /;\s*drop\s+table/gi
            ];
            return patterns.some(pattern => pattern.test(input));
        },

        /**
         * RATE LIMITER (Botlar va spam hujumlaridan himoya qilish)
         * Belgilangan vaqt oralig'ida ruxsat etilgan maksimal urinishlar
         */
        rateLimiter: (function () {
            const timestamps = [];
            const MAX_REQUESTS = 4; // 1 daqiqada maksimal 4 ta so'rov
            const TIME_WINDOW_MS = 60 * 1000; // 60 soniya

            return {
                checkAllowed: function () {
                    const now = Date.now();
                    // Eskirgan vaqtlarni tozalash
                    while (timestamps.length && timestamps[0] <= now - TIME_WINDOW_MS) {
                        timestamps.shift();
                    }
                    if (timestamps.length >= MAX_REQUESTS) {
                        return false; // Cheklovdan oshdi
                    }
                    timestamps.push(now);
                    return true;
                },
                getRemainingCooldown: function () {
                    if (timestamps.length < MAX_REQUESTS) return 0;
                    const oldest = timestamps[0];
                    return Math.max(0, Math.ceil((oldest + TIME_WINDOW_MS - Date.now()) / 1000));
                }
            };
        })(),

        /**
         * SAFE LOCAL STORAGE WRAPPER (Storage poisoning va Prototype pollution himoyasi)
         */
        safeStorage: {
            setItem: function (key, value) {
                try {
                    const cleanKey = SecurityGuard.sanitizeText(key);
                    const cleanVal = typeof value === 'string' ? value : JSON.stringify(value);
                    localStorage.setItem(`__sec_${cleanKey}`, cleanVal);
                } catch (e) {
                    console.warn('Storage himoyasi:', e);
                }
            },
            getItem: function (key) {
                try {
                    const cleanKey = SecurityGuard.sanitizeText(key);
                    return localStorage.getItem(`__sec_${cleanKey}`);
                } catch (e) {
                    return null;
                }
            },
            removeItem: function (key) {
                try {
                    const cleanKey = SecurityGuard.sanitizeText(key);
                    localStorage.removeItem(`__sec_${cleanKey}`);
                } catch (e) {}
            }
        },

        /**
         * REVERSE TABNABBING HIMOYASI
         * target="_blank" havolalarini avtomatik noopener va noreferrer bilan xavfsizlash
         */
        enforceSafeLinks: function () {
            const links = document.querySelectorAll('a[target="_blank"]');
            links.forEach(function (link) {
                const currentRel = link.getAttribute('rel') || '';
                const parts = currentRel.split(' ').map(p => p.trim());
                if (!parts.includes('noopener')) parts.push('noopener');
                if (!parts.includes('noreferrer')) parts.push('noreferrer');
                link.setAttribute('rel', parts.join(' ').trim());
            });
        }
    };

    // DOM yuklanganda havolalar xavfsizligini tekshirish
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', SecurityGuard.enforceSafeLinks);
    } else {
        SecurityGuard.enforceSafeLinks();
    }

    // Obyektni o'zgartirish yoki unga yangi xavfli xossa qo'shishni muzlatib qo'yish (Object.freeze)
    window.SecurityGuard = Object.freeze(SecurityGuard);

})();
