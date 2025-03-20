/**
 * Skript für die Projektseite - Filterung und Animationen
 */

document.addEventListener('DOMContentLoaded', function() {
    // Prüfen, ob wir auf der Projektseite sind
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterButtons.length === 0 || projectItems.length === 0) return;
    
    // Initialisiere GSAP Animationen, wenn verfügbar
    if (typeof gsap !== 'undefined') {
        // Animation beim Seitenload
        gsap.from(projectItems, {
            opacity: 0,
            y: 30,
            stagger: 0.1,
            duration: 0.8,
            delay: 0.3
        });
    }
    
    // Filter-Funktionalität
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktiver Button-Status ändern
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Alle Projekte anzeigen/verbergen basierend auf dem Filter
            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === itemCategory) {
                    // Projekt anzeigen
                    showProject(item);
                } else {
                    // Projekt verbergen
                    hideProject(item);
                }
            });
        });
    });
    
    // Funktionen zum Anzeigen/Verbergen mit Animation
    function showProject(item) {
        if (typeof gsap !== 'undefined') {
            gsap.to(item, {
                opacity: 1,
                scale: 1,
                height: 'auto',
                duration: 0.4,
                onStart: function() {
                    item.classList.remove('hide');
                }
            });
        } else {
            // Fallback ohne GSAP
            item.classList.remove('hide');
        }
    }
    
    function hideProject(item) {
        if (typeof gsap !== 'undefined') {
            gsap.to(item, {
                opacity: 0,
                scale: 0.8,
                duration: 0.4,
                onComplete: function() {
                    item.classList.add('hide');
                }
            });
        } else {
            // Fallback ohne GSAP
            item.classList.add('hide');
        }
    }
    
    // Hover-Effekte für Projekt-Karten
    projectItems.forEach(item => {
        const projectCard = item.querySelector('.project-card');
        
        if (projectCard) {
            projectCard.addEventListener('mouseenter', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, {
                        y: -10,
                        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                        duration: 0.3
                    });
                    
                    // Animation für das Icon
                    const icon = this.querySelector('.project-image i');
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1.1,
                            rotation: 5,
                            duration: 0.3
                        });
                    }
                }
            });
            
            projectCard.addEventListener('mouseleave', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, {
                        y: 0,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        duration: 0.3
                    });
                    
                    // Animation für das Icon zurücksetzen
                    const icon = this.querySelector('.project-image i');
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.3
                        });
                    }
                }
            });
        }
    });
    
    // Detaillierte Projektansicht Funktion (wenn Links vorhanden)
    const projectLinks = document.querySelectorAll('.project-links a');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Wenn es sich um einen Demo-Link handelt, nichts tun
            if (this.classList.contains('secondary-btn')) return;
            
            // Wenn es sich um den "Code ansehen" Button handelt
            if (this.classList.contains('outline-btn')) {
                e.preventDefault();
                const projectTitle = this.closest('.project-card').querySelector('h3').textContent;
                alert(`Quellcode für "${projectTitle}" wird in einem echten Projekt hier verlinkt.`);
            }
        });
    });
    
    // Scroll-Animationen mit ScrollTrigger, wenn verfügbar
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // CTA-Sektion Animation
        const projectCta = document.querySelector('.project-cta');
        if (projectCta) {
            gsap.from(projectCta.children, {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.8,
                scrollTrigger: {
                    trigger: projectCta,
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }
    
    // Optional: Suchfunktion für Projekte
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Projekte durchsuchen...';
    searchInput.classList.add('project-search');
    
    // Füge das Suchelement zur Seite hinzu (direkt nach den Filter-Buttons)
    const filterContainer = document.querySelector('.filter-buttons');
    if (filterContainer) {
        filterContainer.parentNode.insertBefore(searchInput, filterContainer.nextSibling);
        
        // Styling für das Suchelement
        searchInput.style.width = '100%';
        searchInput.style.maxWidth = '400px';
        searchInput.style.padding = '0.8rem 1rem';
        searchInput.style.marginTop = '1.5rem';
        searchInput.style.marginBottom = '1.5rem';
        searchInput.style.border = '1px solid #e0e0e0';
        searchInput.style.borderRadius = '5px';
        searchInput.style.display = 'block';
        searchInput.style.margin = '1.5rem auto';
        
        // Event-Listener für die Suche
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            projectItems.forEach(item => {
                const projectTitle = item.querySelector('h3').textContent.toLowerCase();
                const projectDesc = item.querySelector('p').textContent.toLowerCase();
                const projectTags = Array.from(item.querySelectorAll('.project-tags span'))
                    .map(tag => tag.textContent.toLowerCase())
                    .join(' ');
                
                // Prüfe, ob der Suchbegriff im Titel, der Beschreibung oder den Tags vorkommt
                if (
                    projectTitle.includes(searchTerm) || 
                    projectDesc.includes(searchTerm) || 
                    projectTags.includes(searchTerm)
                ) {
                    showProject(item);
                } else {
                    hideProject(item);
                }
            });
            
            // Wenn eine Suche ausgeführt wird, den "Alle Projekte" Filter aktivieren
            filterButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-filter="all"]').classList.add('active');
        });
    }
});