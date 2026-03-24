// 1. Initialize Supabase
// Don't forget to replace these with your actual Supabase project credentials!
const supabaseUrl = 'https://xvvgzhzhawancrnyapty.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dmd6aHpoYXdhbmNybnlhcHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDM5MzUsImV4cCI6MjA4OTkxOTkzNX0.JKnLTunupsSDtBeEbsQ_MdD29zJya_plFAgSPrNeKak'; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Setup listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setupFormListeners();
});

// Attach the submit event to the contact form
function setupFormListeners() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Handle contact form submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const messageStatus = document.getElementById('messageStatus');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Temporarily disable the button and show a loading state
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Insert data into the Supabase 'contacts' table
        const { error } = await supabase
            .from('contacts')
            .insert([{ name, email, message }]);
        
        if (error) throw error;
        
        // Show success message and clear the form
        messageStatus.className = 'message-status success';
        messageStatus.textContent = 'Message sent successfully! I will get back to you soon.';
        document.getElementById('contactForm').reset();
        
    } catch (error) {
        console.error('Error sending message:', error);
        // Show error message
        messageStatus.className = 'message-status error';
        messageStatus.textContent = 'Failed to send message. Please try again.';
    } finally {
        // Restore the button to its original state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}
