(function () {
    const sidemenu = document.getElementById('sidemenu');
    const nav = document.querySelector('nav');
    const filterButtons = document.querySelectorAll('[data-filter]');
    const projectCards = document.querySelectorAll('.project-card');

    window.openmenu = function () {
        sidemenu.style.right = '0';
    };

    window.closemenu = function () {
        sidemenu.style.right = '-260px';
    };

    window.opentab = function (tabname) {
        document.querySelectorAll('.tab-links').forEach((link) => link.classList.remove('active-link'));
        document.querySelectorAll('.tab-contents').forEach((tab) => tab.classList.remove('active-tab'));
        event.currentTarget.classList.add('active-link');
        document.getElementById(tabname).classList.add('active-tab');
    };

    window.addEventListener('scroll', () => {
        if (nav) {
            nav.classList.toggle('nav-scrolled', window.scrollY > 40);
        }
    });

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach((card) => {
                const category = card.dataset.category;
                const show = filter === 'all' || category === filter;
                card.classList.toggle('hidden', !show);
            });
        });
    });

    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        revealElements.forEach((el) => observer.observe(el));
    } else {
        revealElements.forEach((el) => el.classList.add('visible'));
    }

    const yearEl = document.getElementById('copyright-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById('msg');

    if (form) {
        const scriptURL =
            'https://script.google.com/macros/s/AKfycbyei0ByQYAdvo9WIU3dPfl8gk-_3-kPHoAtn1u7opVzDpaiRTfyZcjYDKTZp7FQW0WD/exec';

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            fetch(scriptURL, { method: 'POST', body: new FormData(form) })
                .then((response) => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    window.location.href = 'thank-you.html';
                    form.reset();
                })
                .catch((error) => {
                    if (msg) {
                        msg.textContent =
                            'Failed to send. Please email me directly at cosmicneetro@gmail.com';
                        msg.style.color = '#ff6b6b';
                    }
                    console.error('Error!', error.message);
                })
                .finally(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                });
        });
    }
})();
