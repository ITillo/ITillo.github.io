// Add any JavaScript functionality here
console.log('Welcome to my personal page!');

// Navbar and hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        // Toggle menu when hamburger is clicked
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent click from bubbling to document
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Close menu when a link is clicked
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
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
