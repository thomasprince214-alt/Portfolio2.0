// 1. Initialize Supabase Connection
// REMEMBER TO PASTE YOUR KEYS HERE!
const supabaseUrl = 'https://xvvgzhzhawancrnyapty.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dmd6aHpoYXdhbmNybnlhcHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDM5MzUsImV4cCI6MjA4OTkxOTkzNX0.JKnLTunupsSDtBeEbsQ_MdD29zJya_plFAgSPrNeKak'; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    
    // --- SCROLL ANIMATION LOGIC ---
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15, // Triggers when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once it's visible
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // --- SUPABASE CONTACT FORM LOGIC ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    if(contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            statusMessage.style.display = 'none';
            
            try {
                const { error } = await supabase
                    .from('portfolio_messages')
                    .insert([
                        { name: name, email: email, message: message }
                    ]);
                
                if (error) throw error;
                
                statusMessage.className = 'status-message success';
                statusMessage.textContent = 'Thanks for reaching out! Your message was sent successfully.';
                statusMessage.style.display = 'block';
                contactForm.reset();
                
            } catch (error) {
                console.error("Database Error:", error);
                statusMessage.className = 'status-message error';
                statusMessage.textContent = 'Failed to send message: ' + (error.message || 'Please try again.');
                statusMessage.style.display = 'block';
                
            } finally {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }
});
