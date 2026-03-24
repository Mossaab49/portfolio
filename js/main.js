/**
 * main.js – Portfolio interactions
 * Handles: nav, typed text, scroll reveal, skill bars, contact form
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================
       1. MOBILE HAMBURGER NAV
    ============================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close nav when a link is clicked (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navLinks?.classList.remove('open');
        });
    });

    /* ============================
       2. SMOOTH SCROLL
    ============================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ============================
       3. ACTIVE NAV HIGHLIGHTING
    ============================== */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

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
    });

    /* ============================
       5. TYPED TEXT EFFECT (HERO)
    ============================== */
    const typedEl = document.querySelector('.typed-text');
    if (typedEl) {
        const phrases = [
            'Cybersecurity Engineering Student',
            'Backend Web Developer',
            'Low-Level Systems Enthusiast',
            'Freelance Developer',
        ];
        let phraseIdx = 0, charIdx = 0, deleting = false;

        function type() {
            const current = phrases[phraseIdx];
            const displayed = deleting
                ? current.substring(0, charIdx--)
                : current.substring(0, charIdx++);

            typedEl.textContent = displayed;

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
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ============================
       7. ANIMATED SKILL BARS
    ============================== */
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const barObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const target = fill.dataset.width || '0';
                fill.style.width = target + '%';
                barObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => {
        bar.style.width = '0%';
        barObserver.observe(bar);
    });

    /* ============================
       8. CONTACT FORM
    ============================== */
    const form = document.getElementById('contact-form');
    form?.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();

        if (!name || !email || !message) {
            showFormMsg('Please fill in all fields.', 'error');
            return;
        }

        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        btn.textContent = 'Sending…';
        btn.disabled = true;

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                showFormMsg(`Thanks ${name}! Your message has been sent successfully.`, 'success');
                form.reset();
            } else {
                response.json().then(data => {
                    if (data.errors) {
                        showFormMsg(data.errors.map(err => err.message).join(", "), 'error');
                    } else {
                        showFormMsg('Oops! There was a problem submitting your form.', 'error');
                    }
                });
            }
        }).catch(error => {
            showFormMsg('Oops! There was a problem submitting your form.', 'error');
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
            document.getElementById('contact-form')?.appendChild(el);
        }
        el.textContent = msg;
        el.className = `form-msg ${type}`;
        setTimeout(() => { el.textContent = ''; el.className = 'form-msg'; }, 5000);
    }

    /* ============================
       9. PROJECT CARD TILT (subtle)
    ============================== */
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

});
