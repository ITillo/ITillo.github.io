/**
 * Skript für die dynamische Timeline-Animation auf der Lebenslauf-Seite
 * Verwendet GSAP und ScrollTrigger für Animationen
 */

document.addEventListener('DOMContentLoaded', function() {
    // Prüfen ob wir auf der Lebenslauf-Seite sind
    const timelinePath = document.getElementById('timelinePath');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (!timelinePath || timelineItems.length === 0) return;
    
    // GSAP und ScrollTrigger initialisieren
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP oder ScrollTrigger ist nicht geladen');
        // Fallback für fehlende Animation-Bibliothek
        timelineItems.forEach(item => {
            item.style.opacity = 1;
            item.style.transform = 'translateY(0)';
        });
        return;
    }
    
    // Registrieren des ScrollTrigger-Plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Timeline-Pfad-Animation
    const pathLength = timelinePath.getTotalLength();
    timelinePath.style.strokeDasharray = pathLength;
    timelinePath.style.strokeDashoffset = pathLength;
    
    gsap.to(timelinePath, {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 90%",
            end: "bottom 20%",
            scrub: 0.5,
        }
    });
    
    // Position der Timeline-Items basierend auf dem Pfad berechnen
    function positionItems() {
        const totalItems = timelineItems.length;
        let maxPosition = 0;
        
        // Berechne den Abstand zwischen den Einträgen
        const timelineContainer = document.querySelector('.timeline-container');
        const containerHeight = Math.max(1000, totalItems * 200); // Noch kleinere Höhe für engere Abstände
        timelineContainer.style.minHeight = `${containerHeight}px`;
        
        // Positioniere die Items gleichmäßig verteilt mit zusätzlichem Abstand
        let lastItemBottom = 0;
        
        timelineItems.forEach((item, index) => {
            // Berechne die vertikale Position basierend auf dem Index
            let verticalPosition = (index + 1) * (containerHeight / (totalItems + 1));
            
            // Stelle sicher, dass ein Mindestabstand zum vorherigen Element eingehalten wird
            if (index > 0 && verticalPosition < lastItemBottom + 15) {
                verticalPosition = lastItemBottom + 15;
            }
            
            // Setze die absolute vertikale Position
            item.style.top = `${verticalPosition}px`;
            
            // Aktualisiere die maximale Position für die Container-Höhe
            const itemHeight = item.offsetHeight;
            const itemBottom = verticalPosition + itemHeight;
            maxPosition = Math.max(maxPosition, itemBottom);
            lastItemBottom = itemBottom;
            
            // Füge visuelle Punkte hinzu, die mit dem Pfad verbunden sind
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                const isLeft = item.classList.contains('left');
                // Positionierung wird jetzt über CSS gehandhabt
            }
        });
        
        // Stelle sicher, dass der Container hoch genug ist
        if (timelineContainer && maxPosition > containerHeight) {
            timelineContainer.style.minHeight = `${maxPosition + 30}px`; // Noch kleinerer Abstand am Ende
        }
    }
    
    // Position aktualisieren bei Laden und Resize
    positionItems();
    window.addEventListener('resize', positionItems);
    
    // Animations-Effekte für die Timeline-Items
    timelineItems.forEach((item, index) => {
        const dot = item.querySelector('.timeline-dot');
        const content = item.querySelector('.timeline-content');
        
        // Animation für den Punkt
        gsap.fromTo(dot,
            { scale: 0 },
            {
                scale: 1,
                duration: 0.3, // Schnellere Animation
                delay: 0.1 + (index * 0.05), // Kürzere Verzögerung
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%", // Früher starten
                    toggleActions: "play none none reverse"
                }
            }
        );
        
        // Animation für den Inhalt
        gsap.fromTo(content,
            { opacity: 0, x: item.classList.contains('left') ? -30 : 30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.5, // Schnellere Animation
                delay: 0.15 + (index * 0.05), // Kürzere Verzögerung
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%", // Früher starten
                    toggleActions: "play none none reverse"
                }
            }
        );
        
        // Hauptanimation für das Item
        gsap.fromTo(item, 
            { opacity: 0, y: 30 }, // Weniger Bewegung
            {
                opacity: 1,
                y: 0,
                duration: 0.4, // Schnellere Animation
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%", // Früher starten
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    
    // Animation für die Skills-Balken
    const skillLevels = document.querySelectorAll('.skill-level .level');
    
    if (skillLevels.length > 0) {
        skillLevels.forEach(level => {
            const progress = level.getAttribute('data-level');
            
            gsap.fromTo(level,
                { width: 0 },
                {
                    width: `${progress}%`,
                    duration: 0.8, // Schnellere Animation
                    ease: "power1.out", // Schnellere Beschleunigung
                    scrollTrigger: {
                        trigger: level.parentElement,
                        start: "top 90%", // Früher starten
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }
    
    // Animation für die Zertifikate
    const certificates = document.querySelectorAll('.certificate-card');
    
    if (certificates.length > 0) {
        gsap.from(certificates, {
            opacity: 0,
            y: 20, // Weniger Bewegung
            stagger: 0.1, // Schnellere Abfolge
            duration: 0.5, // Schnellere Animation
            scrollTrigger: {
                trigger: '.certificates-grid',
                start: "top 90%" // Früher starten
            }
        });
    }
});