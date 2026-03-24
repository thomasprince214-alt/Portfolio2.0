// 1. Paste your Supabase details here
const supabaseUrl = 'https://xvvgzhzhawancrnyapty.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dmd6aHpoYXdhbmNybnlhcHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDM5MzUsImV4cCI6MjA4OTkxOTkzNX0.JKnLTunupsSDtBeEbsQ_MdD29zJya_plFAgSPrNeKak';  

// Initialize Supabase
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. Connect the Form
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const messageStatus = document.getElementById('messageStatus');

contactForm.addEventListener('submit', async function(event) {
    // Stop the page from reloading
    event.preventDefault();
    
    // Get the user's text
    const nameInput = document.getElementById('name').value;
    const emailInput = document.getElementById('email').value;
    const messageInput = document.getElementById('message').value;
    
    // Change button to show it is working
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    messageStatus.style.display = 'none';
    
    try {
        // Send data directly to your Supabase 'contacts' table
        const { error } = await supabase
            .from('contacts')
            .insert([
                { name: nameInput, email: emailInput, message: messageInput }
            ]);
        
        // If Supabase says no, throw an error
        if (error) {
            throw error;
        }
        
        // Success!
        messageStatus.className = 'message-status success';
        messageStatus.textContent = 'Message sent successfully to Supabase!';
        messageStatus.style.display = 'block';
        contactForm.reset(); // Clear the form
        
    } catch (err) {
        // Failure! Show the error message on the screen
        console.error("Supabase Error:", err);
        messageStatus.className = 'message-status error';
        messageStatus.textContent = 'Error: ' + err.message;
        messageStatus.style.display = 'block';
    } finally {
        // Reset the button
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
});
