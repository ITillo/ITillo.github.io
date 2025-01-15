// Add any JavaScript functionality here
console.log('Welcome to my personal page!');

// Navbar scroll visibility
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return; // Exit if navbar doesn't exist
    
    // Check if we're on the index page
    const currentPath = window.location.pathname.toLowerCase();
    const isIndexPage = currentPath.endsWith('index.html') || 
                       currentPath.endsWith('/') ||
                       currentPath === '';
    
    if (isIndexPage) {
        // Handle scroll event for index page
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY || window.pageYOffset;
            
            if (scrollPosition > 100) {
                navbar.classList.add('visible');
            } else {
                navbar.classList.remove('visible');
            }
        });
    } else {
        // Make navbar immediately visible on all other pages
        navbar.style.opacity = '1';
        navbar.style.visibility = 'visible';
    }
});

// Initialize Quill editor
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the contact page
    const contactForm = document.getElementById('contactForm');
    const quill = document.querySelector('#editor') ? new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Write your message here...'
    }) : null;

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                // Get form data
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: quill ? quill.root.innerHTML : document.getElementById('message').value
                };

                console.log('Sending form data:', formData); // Debug log

                const response = await fetch('http://localhost:5000/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                console.log('Server response:', result); // Debug log

                if (response.ok) {
                    alert('Nachricht erfolgreich gesendet!');
                    contactForm.reset();
                    if (quill) {
                        quill.setContents([{ insert: '\n' }]);
                    }
                } else {
                    throw new Error(result.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Fehler beim Senden der Nachricht: ' + error.message);
            }
        });
    }
});
