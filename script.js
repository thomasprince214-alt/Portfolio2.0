// 1. Initialize Supabase
const SUPABASE_URL = 'https://xvvgzhzhawancrnyapty.supabase.coL';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dmd6aHpoYXdhbmNybnlhcHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDM5MzUsImV4cCI6MjA4OTkxOTkzNX0.JKnLTunupsSDtBeEbsQ_MdD29zJya_plFAgSPrNeKak';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- PROJECT FETCHING LOGIC ---
const projectsContainer = document.getElementById('projects-container');

async function fetchProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('*');

    if (error) {
        console.error('Error fetching projects:', error);
        projectsContainer.innerHTML = '<p class="error">Error loading projects. Check console.</p>';
        return;
    }

    if (data.length === 0) {
        projectsContainer.innerHTML = '<p>No projects found. Add some in your Supabase dashboard!</p>';
        return;
    }

    projectsContainer.innerHTML = data.map(project => `
        <div class="project-card">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">View Project →</a>` : ''}
        </div>
    `).join('');
}

// --- CONTACT FORM LOGIC ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    // Get values from inputs
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Change button state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    formStatus.textContent = '';

    // Insert data into Supabase 'messages' table
    const { error } = await supabase
        .from('messages')
        .insert([{ name: name, email: email, message: message }]);

    if (error) {
        console.error('Error sending message:', error);
        formStatus.textContent = 'Something went wrong. Please try again.';
        formStatus.className = 'error';
    } else {
        formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
        formStatus.className = 'success';
        contactForm.reset(); // Clear the form
    }

    // Reset button state
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
});

// Load projects when the page starts
fetchProjects();
