// 1. Initialize Supabase
const supabaseUrl = 'https://xvvgzhzhawancrnyapty.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dmd6aHpoYXdhbmNybnlhcHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDM5MzUsImV4cCI6MjA4OTkxOTkzNX0.JKnLTunupsSDtBeEbsQ_MdD29zJya_plFAgSPrNeKak'; 

// 🚨 SAFETY CHECK: This will alert you if you forgot to add your keys!
if (supabaseUrl === 'https://xvvgzhzhawancrnyapty.supabase.co' || supabaseUrl === '') {
    alert("STOP: You still have 'https://xvvgzhzhawancrnyapty.supabase.co' in your script.js. You must replace it with your actual Supabase URL!");
}

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. Setup listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log("Form found! Attaching event listener...");
        contactForm.addEventListener('submit', handleContactSubmit);
    } else {
        console.error("CRITICAL ERROR: Could not find the #contactForm element in your HTML.");
    }
});

// 3. Handle contact form submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const messageStatus = document.getElementById('messageStatus');
    const submitBtn = document.getElementById('submitBtn');
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    messageStatus.style.display = 'none'; 
    
    try {
        console.log("Attempting to send data to Supabase...", { name, email, message });
        
        // Insert data and use .select() to force Supabase to return the row if successful
        const { data, error } = await supabase
            .from('contacts')
            .insert([{ name, email, message }])
            .select(); 
        
        // If Supabase rejects it, throw the exact error to the catch block
        if (error) throw error;
        
        console.log("Success! Data successfully inserted into database:", data);
        
        messageStatus.className = 'message-status success';
        messageStatus.textContent = 'Message sent successfully! I will get back to you soon.';
        messageStatus.style.display = 'block';
        document.getElementById('contactForm').reset();
        
    } catch (error) {
        // 🚨 This will pop up on your screen with the exact database error!
        console.error("SUPABASE ERROR DETAILS:", error);
        alert(`Database Error: ${error.message || 'Check the browser console for details'}`);
        
        messageStatus.className = 'message-status error';
        messageStatus.textContent = 'Failed to send message. Please try again.';
        messageStatus.style.display = 'block';
    } finally {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
}
