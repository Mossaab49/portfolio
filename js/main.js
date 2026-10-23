/**
 * main.js – Portfolio interactions
 * Handles: nav, typed text, scroll reveal, contact form, card tilt, theme
 */
 
document.addEventListener('DOMContentLoaded', () => {
 
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
    /* ============================
       1. MOBILE HAMBURGER NAV
    ============================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
 
    hamburger?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
    });
 
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            navLinks?.classList.remove('open');
        });
    });
 
    /* ============================
       2. SMOOTH SCROLL
    ============================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            }
        });
    });
 
    /* ============================
       3. ACTIVE NAV HIGHLIGHTING
    ============================== */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
 
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(a => a.classList.remove('active'));
                const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                active?.classList.add('active');
            }
        });
    }, { threshold: 0.35 });
 
    sections.forEach(section => sectionObserver.observe(section));
 
    /* ============================
       4. NAVBAR SCROLL SHADOW
    ============================== */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
 
    /* ============================
       5. TYPED TEXT EFFECT (HERO)
       Static text is already in the HTML; the animation is skipped
       when the visitor prefers reduced motion.
    ============================== */
    const typedEl = document.querySelector('.typed-text');
    if (typedEl && !reduceMotion) {
        const phrases = [
            'Cybersecurity Engineering Student',
            'SOC / SOAR / SecOps Automation',
            'DevSecOps & Web Security',
            'PFE Internship · January 2027',
        ];
        let phraseIdx = 0, charIdx = 0, deleting = false;
 
        function type() {
            const current = phrases[phraseIdx];
            typedEl.textContent = deleting
                ? current.substring(0, charIdx--)
                : current.substring(0, charIdx++);
 
            let delay = deleting ? 60 : 100;
            if (!deleting && charIdx > current.length) {
                delay = 1800;
                deleting = true;
            } else if (deleting && charIdx < 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                delay = 400;
            }
            setTimeout(type, delay);
        }
        type();
    }
 
    /* ============================
       6. SCROLL REVEAL SECTIONS
    ============================== */
    const revealEls = document.querySelectorAll('.reveal');
    if (reduceMotion) {
        revealEls.forEach(el => el.classList.add('visible'));
    } else {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
 
        revealEls.forEach(el => revealObserver.observe(el));
    }
 
    /* ============================
       7. CONTACT FORM (Formspree)
    ============================== */
    const form = document.getElementById('contact-form');
    form?.addEventListener('submit', function (e) {
        e.preventDefault();
 
        const formData = new FormData(this);
 
        // Honeypot: bots fill this hidden field, humans never see it.
        if (formData.get('_gotcha')) {
            form.reset();
            return;
        }
 
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();
 
        if (!name || !email || !message) {
            showFormMsg('Please fill in your name, email and message.', 'error');
            return;
        }
 
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        btn.textContent = 'Sending…';
        btn.disabled = true;
 
        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                showFormMsg(`Thanks ${name}! Your message has been sent.`, 'success');
                form.reset();
            } else {
                response.json().then(data => {
                    if (data.errors) {
                        showFormMsg(data.errors.map(err => err.message).join(', '), 'error');
                    } else {
                        showFormMsg('The message could not be sent. Please try again or email me directly.', 'error');
                    }
                }).catch(() => {
                    showFormMsg('The message could not be sent. Please try again or email me directly.', 'error');
                });
            }
        }).catch(() => {
            showFormMsg('The message could not be sent. Please try again or email me directly.', 'error');
        }).finally(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
    });
 
    function showFormMsg(msg, type) {
        let el = document.querySelector('.form-msg');
        if (!el) {
            el = document.createElement('p');
            el.className = 'form-msg';
            el.setAttribute('role', 'status');
            document.getElementById('contact-form')?.appendChild(el);
        }
        el.textContent = msg;
        el.className = `form-msg ${type}`;
        setTimeout(() => { el.textContent = ''; el.className = 'form-msg'; }, 6000);
    }
 
    /* ============================
       8. PROJECT CARD TILT (subtle)
    ============================== */
    if (!reduceMotion) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
                card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
 
    /* ============================
       9. THEME TOGGLE (LIGHT/DARK)
    ============================== */
    const themeToggle = document.getElementById('theme-toggle');
    const storageKey = 'portfolio-theme';
 
    function readTheme() {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved === 'light' ? 'light' : 'dark';
        } catch (_) {
            return 'dark';
        }
    }
 
    document.documentElement.setAttribute('data-theme', readTheme());
 
    themeToggle?.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        try { localStorage.setItem(storageKey, newTheme); } catch (_) { /* storage blocked */ }
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });
 
});