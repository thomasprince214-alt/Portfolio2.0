// 1. Initialize Supabase Connection
const supabaseUrl = 'https://xvvgzhzhawancrnyapty.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dmd6aHpoYXdhbmNybnlhcHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDM5MzUsImV4cCI6MjA4OTkxOTkzNX0.JKnLTunupsSDtBeEbsQ_MdD29zJya_plFAgSPrNeKak'; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    // 3. Handle Form Submission
    contactForm.addEventListener('submit', async function(e) {
        // Prevent the page from refreshing
        e.preventDefault();
        
        // Grab the user's input
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Update UI to show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        statusMessage.style.display = 'none';
        
        try {
            // Send the data to the 'portfolio_messages' table in Supabase
            const { error } = await supabase
                .from('portfolio_messages')
                .insert([
                    { name: name, email: email, message: message }
                ]);
            
            // If Supabase returns an error, throw it so the catch block handles it
            if (error) throw error;
            
            // Show Success UI
            statusMessage.className = 'status-message success';
            statusMessage.textContent = 'Thanks for reaching out! Your message was sent successfully.';
            statusMessage.style.display = 'block';
            
            // Clear the form fields
            contactForm.reset();
            
        } catch (error) {
            // Show Error UI
            console.error("Database Error:", error);
            statusMessage.className = 'status-message error';
            statusMessage.textContent = 'Failed to send message: ' + (error.message || 'Please try again.');
            statusMessage.style.display = 'block';
            
        } finally {
            // Reset the button back to normal
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }
    });
});
