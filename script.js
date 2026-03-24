// 1. Initialize Supabase
const supabaseUrl = 'YOUR_SUPABASE_URL'; // e.g., 'https://xyz.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // the long jwt string
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Load initial data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    loadProjects();
    setupFormListeners();
});

// Load skills from Supabase
async function loadSkills() {
    try {
        const { data: skills, error } = await supabase
            .from('skills')
            .select('name');

        if (error) throw error;
        
        // Convert array of objects [{name: 'React'}] to array of strings ['React']
        const skillNames = skills.map(s => s.name);
        displaySkills(skillNames);
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

// Display skills on the page
function displaySkills(skills) {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    
    skills.forEach(skill => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `<p>${skill}</p>`;
        skillsList.appendChild(skillCard);
    });
}

// Load projects from Supabase
async function loadProjects() {
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('id', { ascending: false }); // Newest first

        if (error) throw error;
        displayProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        // Display sample projects if API fails
        displaySampleProjects();
    }
}

// Display sample projects (for demo purposes)
function displaySampleProjects() {
    const sampleProjects = [
        {
            id: '1',
            title: 'Portfolio Website',
            description: 'A full-stack portfolio website integrated with Supabase. Features a contact form and project showcase.',
            link: '#',
            technologies: ['Supabase', 'HTML', 'CSS', 'JavaScript']
        }
    ];
    displayProjects(sampleProjects);
}

// Display projects on the page
function displayProjects(projects) {
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    
    if (!projects || projects.length === 0) {
        projectsList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No projects yet. Add your first project!</p>';
        return;
    }
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        const techTags = (project.technologies || [])
            .map(tech => `<span class="tech-tag">${tech}</span>`)
            .join('');
        
        projectCard.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            ${project.link && project.link !== '#' ? `<a href="${project.link}" class="project-link" target="_blank">View Project →</a>` : ''}
            <div class="tech-tags">${techTags}</div>
        `;
        projectsList.appendChild(projectCard);
    });
}

// Setup form listeners
function setupFormListeners() {
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
    document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);
}

// Handle contact form submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const messageStatus = document.getElementById('messageStatus');
    
    try {
        // Insert data into Supabase 'contacts' table
        const { error } = await supabase
            .from('contacts')
            .insert([{ name, email, message }]);
        
        if (error) throw error;
        
        messageStatus.className = 'message-status success';
        messageStatus.textContent = 'Message sent successfully!';
        document.getElementById('contactForm').reset();
        
    } catch (error) {
        console.error('Error sending message:', error);
        messageStatus.className = 'message-status error';
        messageStatus.textContent = 'Failed to send message. Please try again.';
    }
}

// Handle project form submission
async function handleProjectSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const link = document.getElementById('projectLink').value;
    const technologiesInput = document.getElementById('projectTech').value;
    const technologies = technologiesInput.split(',').map(tech => tech.trim());
    
    try {
        // Insert data into Supabase 'projects' table
        const { error } = await supabase
            .from('projects')
            .insert([{ title, description, link, technologies }]);
        
        if (error) throw error;
        
        // Reset form and reload projects
        document.getElementById('projectForm').reset();
        loadProjects();
        alert('Project added successfully!');
        
    } catch (error) {
        console.error('Error adding project:', error);
        alert('Failed to add project. Please try again.');
    }
}
