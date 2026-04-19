// ── MOBILE NAV TOGGLE ──
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');

if (toggle && nav) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.style.zIndex = '990';
    document.body.appendChild(overlay);

    const toggleMenu = () => {
        nav.style.zIndex = '10000';
        const isOpen = nav.classList.toggle('open');
        if (isOpen) {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            // transform hamburger to X
            toggle.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            toggle.children[1].style.opacity = '0';
            toggle.children[2].style.transform = 'rotate(-45deg) translate(5px, -4px)';
        } else {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            // reset hamburger
            toggle.children[0].style.transform = '';
            toggle.children[1].style.opacity = '1';
            toggle.children[2].style.transform = '';
        }
    };

    toggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        // Open clicked if it was closed
        if (!isOpen) item.classList.add('open');
    });
});

// ── SCROLL FADE-IN ──
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.prog-card, .vm-card, .course-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// ── ACTIVE NAV ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    } else if (!link.classList.contains('btn-login')) {
        link.classList.remove('active');
    }
});
