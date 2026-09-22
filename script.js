document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       CUSTOM CURSOR EFFECT
       ========================================================================== */
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const interactiveElements = document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .tab-btn, .btn-copy, .form-input');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Track mouse coordinates
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate position for the dot
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // Smooth cursor movement using requestAnimationFrame
    function animateCursor() {
        // Linear interpolation formula (lerp) for smooth trailing
        const lerpFactor = 0.15;
        cursorX += (mouseX - cursorX) * lerpFactor;
        cursorY += (mouseY - cursorY) * lerpFactor;

        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states for interactive items
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hovered');
            if (cursorDot) cursorDot.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hovered');
            if (cursorDot) cursorDot.classList.remove('hovered');
        });
    });


    /* ==========================================================================
       MOBILE NAVIGATION MENU
       ========================================================================== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });


    /* ==========================================================================
       SCROLL EFFECTS & STICKY HEADER
       ========================================================================== */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });


    /* ==========================================================================
       ACTIVE LINK ON SCROLL (INTERSECTION OBSERVER)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const navObserverOptions = {
        root: null,
        threshold: 0.3,
        rootMargin: "0px"
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });


    /* ==========================================================================
       ABOUT TABS INTERACTION
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active to current button
            btn.classList.add('active');

            // Add active to matching content pane
            const targetTab = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(`tab-${targetTab}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       SKILLS PROGRESS BARS ANIMATION (ON INTERSECT)
       ========================================================================== */
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress');
    let animatedSkills = false;

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedSkills) {
                // Animate bars
                if (progressBars.length > 0) {
                    const htmlProgress = document.querySelector('.html-progress');
                    const cssProgress = document.querySelector('.css-progress');
                    const tailwindProgress = document.querySelector('.tailwind-progress');
                    const jsProgress = document.querySelector('.js-progress');
                    const pwaProgress = document.querySelector('.pwa-progress');

                    if (htmlProgress) htmlProgress.style.width = '95%';
                    if (cssProgress) cssProgress.style.width = '90%';
                    if (tailwindProgress) tailwindProgress.style.width = '92%';
                    if (jsProgress) jsProgress.style.width = '88%';
                    if (pwaProgress) pwaProgress.style.width = '85%';
                }
                animatedSkills = true;
            }
        });
    }, { threshold: 0.15 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }


    /* ==========================================================================
       PROJECTS FILTERING
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Reset card transition state
                card.style.transform = 'scale(0.85)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    const matchesFilter = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
                    
                    if (matchesFilter) {
                        card.classList.remove('hidden');
                        // Fade in transition
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });


    /* ==========================================================================
       COPY EMAIL UTILITY
       ========================================================================== */
    const btnCopyEmail = document.getElementById('btn-copy-email');
    const emailText = document.getElementById('email-text');
    const tooltip = document.getElementById('copy-tooltip');

    if (btnCopyEmail && emailText && tooltip) {
        btnCopyEmail.addEventListener('click', () => {
            const email = emailText.textContent.trim();
            
            navigator.clipboard.writeText(email).then(() => {
                // Success feedback
                tooltip.textContent = 'Copié !';
                btnCopyEmail.classList.add('success');
                
                // Reset tooltip after 2s
                setTimeout(() => {
                    tooltip.textContent = 'Copier';
                    btnCopyEmail.classList.remove('success');
                }, 2000);
            }).catch(err => {
                console.error("Échec de la copie de l'e-mail : ", err);
                tooltip.textContent = 'Erreur';
            });
        });
    }


    /* ==========================================================================
       CONTACT FORM SUBMISSION (MOCK)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const btnSubmit = document.getElementById('btn-submit');
    const formStatus = document.getElementById('form-status');

    if (contactForm && btnSubmit && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable submit button and show loading state
            btnSubmit.disabled = true;
            const submitText = btnSubmit.querySelector('.submit-text');
            const submitSpinner = btnSubmit.querySelector('.submit-spinner');
            
            if (submitText) submitText.textContent = 'Envoi en cours...';
            if (submitSpinner) submitSpinner.classList.remove('hidden');
            
            // Hide previous status
            formStatus.classList.add('hidden');
            formStatus.className = 'form-status';

            const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
            const accessKey = accessKeyInput ? accessKeyInput.value : '';

            // Check if user has updated the placeholder key
            if (accessKey === 'YOUR_ACCESS_KEY_HERE' || accessKey === 'VOTRE_CLE_REÇUE_ICI' || !accessKey) {
                // Mock simulation mode
                setTimeout(() => {
                    formStatus.textContent = 'Simulation d\'envoi réussie ! (Pour recevoir de vrais e-mails sur votre boîte Kalwardin963@gmail.com, veuillez renseigner une clé Web3Forms gratuite dans index.html)';
                    formStatus.classList.add('success');
                    formStatus.classList.remove('hidden');
                    
                    btnSubmit.disabled = false;
                    if (submitText) submitText.textContent = 'Envoyer le message';
                    if (submitSpinner) submitSpinner.classList.add('hidden');
                    
                    contactForm.reset();
                }, 1500);
            } else {
                // Real submission mode using Web3Forms API
                const formData = new FormData(contactForm);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    const result = await response.json();
                    if (response.status === 200) {
                        formStatus.textContent = 'Votre message a été envoyé avec succès ! Je reviendrai vers vous rapidement.';
                        formStatus.classList.add('success');
                        contactForm.reset();
                    } else {
                        formStatus.textContent = 'Erreur lors de l\'envoi : ' + (result.message || 'Veuillez réessayer.');
                        formStatus.classList.add('error');
                    }
                })
                .catch((error) => {
                    console.error("Erreur d'envoi du formulaire :", error);
                    formStatus.textContent = 'Impossible de contacter le service de messagerie. Vérifiez votre connexion.';
                    formStatus.classList.add('error');
                })
                .finally(() => {
                    formStatus.classList.remove('hidden');
                    btnSubmit.disabled = false;
                    if (submitText) submitText.textContent = 'Envoyer le message';
                    if (submitSpinner) submitSpinner.classList.add('hidden');
                });
            }
        });
    }
});
