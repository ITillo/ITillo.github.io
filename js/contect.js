/**
 * Skript für die Kontaktseite - Formularvalidierung und Absendefunktionalität
 */

document.addEventListener('DOMContentLoaded', function() {
    // Prüfen, ob wir auf der Kontaktseite sind
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Formular-Validierung und Absenden
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Formularfelder sammeln
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const privacy = document.getElementById('privacy').checked;
        
        // Validierungsfunktion
        if (!validateForm(firstname, lastname, email, message, privacy)) {
            return;
        }
        
        // Formular-Daten für AJAX-Request vorbereiten
        const formData = new FormData();
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('email', email);
        formData.append('message', message);
        formData.append('privacy', privacy);
        
        // Submit-Button deaktivieren und Ladeindikator anzeigen
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gesendet...';
        
        // AJAX-Request zum Absenden des Formulars
        fetch('backend/contact_form.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Erfolgsfall
                showMessage('success', 'Vielen Dank für Ihre Nachricht! Ich werde mich so bald wie möglich bei Ihnen melden.');
                contactForm.reset();
            } else {
                // Fehlerfall
                showMessage('error', data.message || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
            }
        })
        .catch(error => {
            console.error('Fehler beim Absenden des Formulars:', error);
            showMessage('error', 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
        })
        .finally(() => {
            // Button wieder aktivieren
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });
    
    // Validierungsfunktion
    function validateForm(firstname, lastname, email, message, privacy) {
        // Zurücksetzen früherer Fehlermeldungen
        clearValidationErrors();
        
        let isValid = true;
        
        // Vorname überprüfen
        if (firstname.trim() === '') {
            displayError('firstname', 'Bitte geben Sie Ihren Vornamen ein.');
            isValid = false;
        }
        
        // Nachname überprüfen
        if (lastname.trim() === '') {
            displayError('lastname', 'Bitte geben Sie Ihren Nachnamen ein.');
            isValid = false;
        }
        
        // E-Mail überprüfen
        if (email.trim() === '') {
            displayError('email', 'Bitte geben Sie Ihre E-Mail-Adresse ein.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            displayError('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            isValid = false;
        }
        
        // Nachricht überprüfen
        if (message.trim() === '') {
            displayError('message', 'Bitte geben Sie eine Nachricht ein.');
            isValid = false;
        }
        
        // Datenschutz-Checkbox überprüfen
        if (!privacy) {
            displayError('privacy', 'Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.');
            isValid = false;
        }
        
        return isValid;
    }
    
    // E-Mail-Validierungsfunktion
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Fehlermeldung anzeigen
    function displayError(fieldId, errorMessage) {
        const field = document.getElementById(fieldId);
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '0.25rem';
        
        field.classList.add('error-field');
        field.style.borderColor = '#dc3545';
        
        // Spezialfall für Checkbox
        if (fieldId === 'privacy') {
            const checkboxContainer = field.parentElement;
            checkboxContainer.appendChild(errorElement);
        } else {
            field.parentElement.appendChild(errorElement);
        }
        
        // Fokussiere das erste Feld mit Fehler
        if (document.querySelectorAll('.error-message').length === 1) {
            field.focus();
        }
    }
    
    // Zurücksetzen aller Validierungsfehler
    function clearValidationErrors() {
        // Entferne alle Fehlermeldungen
        document.querySelectorAll('.error-message').forEach(element => {
            element.remove();
        });
        
        // Zurücksetzen der fehlerhaften Feldstile
        document.querySelectorAll('.error-field').forEach(field => {
            field.classList.remove('error-field');
            field.style.borderColor = '';
        });
    }
    
    // Ergebnismeldung anzeigen
    function showMessage(type, message) {
        const messageElement = document.getElementById('form-message');
        messageElement.textContent = message;
        messageElement.className = 'form-message';
        messageElement.classList.add(type);
        
        // Scroll zu der Nachricht
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Nach 5 Sekunden die Nachricht ausblenden (nur bei Erfolg)
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    messageElement.className = 'form-message';
                    messageElement.textContent = '';
                    messageElement.style.opacity = '1';
                }, 300);
            }, 5000);
        }
    }
    
    // Live-Validierung für die Felder
    const inputFields = contactForm.querySelectorAll('input, textarea');
    inputFields.forEach(field => {
        field.addEventListener('blur', function() {
            // Bei Verlassen des Feldes die Validierung durchführen
            if (this.id === 'firstname' && this.value.trim() === '') {
                displayError('firstname', 'Bitte geben Sie Ihren Vornamen ein.');
            } else if (this.id === 'lastname' && this.value.trim() === '') {
                displayError('lastname', 'Bitte geben Sie Ihren Nachnamen ein.');
            } else if (this.id === 'email') {
                if (this.value.trim() === '') {
                    displayError('email', 'Bitte geben Sie Ihre E-Mail-Adresse ein.');
                } else if (!isValidEmail(this.value)) {
                    displayError('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                }
            } else if (this.id === 'message' && this.value.trim() === '') {
                displayError('message', 'Bitte geben Sie eine Nachricht ein.');
            }
        });
        
        // Beim Eingeben in ein Feld die Fehlermeldung für dieses Feld entfernen
        field.addEventListener('input', function() {
            // Entferne Fehlermeldungen nur für dieses Feld
            this.classList.remove('error-field');
            this.style.borderColor = '';
            
            const errorMessage = this.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
    
    // Spezialbehandlung für die Checkbox
    const privacyCheckbox = document.getElementById('privacy');
    if (privacyCheckbox) {
        privacyCheckbox.addEventListener('change', function() {
            if (this.checked) {
                this.classList.remove('error-field');
                
                const errorMessage = this.parentElement.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
    }
    
    // FAQ Accordion Funktionalität
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Prüfen, ob dieses Item bereits aktiv ist
            const isActive = item.classList.contains('active');
            
            // Alle anderen FAQ-Items schließen
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const toggle = otherItem.querySelector('.faq-toggle');
                toggle.innerHTML = '<i class="fas fa-plus"></i>';
            });
            
            // Toggle für dieses Item
            if (!isActive) {
                item.classList.add('active');
                const toggle = item.querySelector('.faq-toggle');
                toggle.innerHTML = '<i class="fas fa-minus"></i>';
            }
        });
    });
    
    // Hover-Effekte für Social Icons
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Animation für Kontakt-Items, wenn GSAP verfügbar ist
    if (typeof gsap !== 'undefined') {
        const contactItems = document.querySelectorAll('.contact-item');
        gsap.from(contactItems, {
            opacity: 0,
            x: -30,
            stagger: 0.2,
            duration: 0.8,
            delay: 0.3
        });
        
        // Formular Animation
        const formContainer = document.querySelector('.contact-form-container');
        if (formContainer) {
            gsap.from(formContainer, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.5
            });
        }
    }
});