/**
 * Hauptscript für alle Seiten der Website
 * Enthält allgemeine Funktionalitäten wie Navigation, Animationen und Login-Modal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Header-Scrolleffekt
    const header = document.querySelector('header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menü Umschalter
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            const isOpen = navMenu.classList.contains('show');
            menuToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Schließe mobile Menü bei Klick auf einen Link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Animiere Skill-Balken
    const skillBars = document.querySelectorAll('.progress-bar');
    
    if (skillBars.length > 0) {
        const animateSkills = () => {
            skillBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = `${progress}%`;
            });
        };

        // Verzögerung für die Animation
        setTimeout(animateSkills, 500);
    }

    // Skill-Level in der Skills-Sektion
    const skillLevels = document.querySelectorAll('.level');
    
    if (skillLevels.length > 0) {
        const animateSkillLevels = () => {
            skillLevels.forEach(level => {
                const progress = level.getAttribute('data-level');
                level.style.width = `${progress}%`;
            });
        };

        // Verzögerung für die Animation
        setTimeout(animateSkillLevels, 500);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Schließe alle anderen FAQ-Items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle das aktuelle Item
                item.classList.toggle('active');
            });
        });
    }

    // Login Modal
    const loginLink = document.getElementById('login-link');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');

    if (loginLink && loginModal) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
            setTimeout(() => {
                loginModal.classList.add('show');
            }, 10);
        });

        closeModal.addEventListener('click', function() {
            loginModal.classList.remove('show');
            setTimeout(() => {
                loginModal.style.display = 'none';
            }, 400);
        });

        // Schließe Modal bei Klick außerhalb
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('show');
                setTimeout(() => {
                    loginModal.style.display = 'none';
                }, 400);
            }
        });

        // Login Form Handling
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                // Einfache Validierung
                if (username.trim() === '' || password.trim() === '') {
                    alert('Bitte füllen Sie alle Felder aus.');
                    return;
                }
                
                // AJAX Request für Login
                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);
                
                fetch('backend/login.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Erfolgreicher Login
                        alert('Login erfolgreich!');
                        window.location.reload();
                    } else {
                        // Fehlgeschlagener Login
                        alert('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.');
                    }
                })
                .catch(error => {
                    console.error('Fehler beim Login:', error);
                    alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
                });
            });
        }
    }

    // Smooth Scroll für Anker-Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.getAttribute('href').length > 1) { // Ignoriere leere Anker
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });

    // Scroll-Indikator animieren
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('.about-section');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // GSAP Animationen (wenn GSAP geladen ist)
    if (typeof gsap !== 'undefined') {
        // Hero-Animationen
        const heroTitle = document.querySelector('.hero h1');
        const heroSubtitle = document.querySelector('.hero p');
        const heroUnderline = document.querySelector('.title-underline');
        const ctaButtons = document.querySelector('.cta-buttons');
        
        if (heroTitle && heroSubtitle) {
            gsap.from(heroTitle, {
                opacity: 0,
                y: 50,
                duration: 1,
                delay: 0.2
            });
            
            gsap.from(heroSubtitle, {
                opacity: 0,
                y: 30,
                duration: 1,
                delay: 0.5
            });
            
            if (heroUnderline) {
                gsap.from(heroUnderline, {
                    scaleX: 0,
                    opacity: 0,
                    duration: 1,
                    delay: 0.8
                });
            }
            
            if (ctaButtons) {
                gsap.from(ctaButtons.children, {
                    opacity: 0,
                    y: 20,
                    stagger: 0.2,
                    duration: 0.8,
                    delay: 1
                });
            }
        }
    }
});