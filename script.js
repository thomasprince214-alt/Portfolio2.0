// 🚨 CACHE TEST: If you do not see this pop-up on page load, 
// you need to clear your browser cache or open an Incognito window!
alert("Script is alive! Your browser is reading the new code.");

// 1. Initialize Supabase
const supabaseUrl = 'https://xvvgzhzhawancrnyapty.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dmd6aHpoYXdhbmNybnlhcHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDM5MzUsImV4cCI6MjA4OTkxOTkzNX0.JKnLTunupsSDtBeEbsQ_MdD29zJya_plFAgSPrNeKak'; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. Grab the form directly (No DOMContentLoaded wrapper needed)
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const messageStatus = document.getElementById('messageStatus');

// 3. Attach the submit event
contactForm.addEventListener('submit', async function(e) {
    // Stop the page reload
    e.preventDefault();
    
    // Grab the text from the inputs
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Visual feedback
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    messageStatus.style.display = 'none'; 
    
    try {
        // Send to Supabase
        const { error } = await supabase
            .from('contacts')
            .insert([{ name, email, message }]);
        
        if (error) throw error;
        
        // Success
        messageStatus.className = 'message-status success';
        messageStatus.textContent = 'Message sent successfully!';
        messageStatus.style.display = 'block';
        contactForm.reset();
        
    } catch (error) {
        // Failure
        console.error(error);
        alert("Database Error: " + error.message);
        messageStatus.className = 'message-status error';
        messageStatus.textContent = 'Failed to send message.';
        messageStatus.style.display = 'block';
    } finally {
        // Reset button
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
});
