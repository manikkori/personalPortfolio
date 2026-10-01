// owner.js

const PASSWORD = "manik"; // simple password for frontend

const authOverlay = document.getElementById('authOverlay');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginBtn = document.getElementById('loginBtn');
const adminPassword = document.getElementById('adminPassword');
const authError = document.getElementById('authError');
const logoutBtn = document.getElementById('logoutBtn');
const exportBtn = document.getElementById('exportBtn');

// State
let portfolioData = JSON.parse(localStorage.getItem('manikPortfolioData')) || {
    photoUrl: './assets/img/hero_b_w.jpg',
    skills: [],
    projects: []
};

// Auth
loginBtn.addEventListener('click', () => {
    if (adminPassword.value === PASSWORD) {
        authOverlay.style.display = 'none';
        dashboardContainer.style.display = 'flex';
        sessionStorage.setItem('isAdmin', 'true');
        renderDashboard();
    } else {
        authError.textContent = "Incorrect password!";
    }
});

if (sessionStorage.getItem('isAdmin') === 'true') {
    authOverlay.style.display = 'none';
    dashboardContainer.style.display = 'flex';
    renderDashboard();
}

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('isAdmin');
    window.location.reload();
});

// Tabs
const tabs = document.querySelectorAll('.dash-tab');
const panels = document.querySelectorAll('.dash-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });
});

// Save to LocalStorage
function saveData() {
    localStorage.setItem('manikPortfolioData', JSON.stringify(portfolioData));
    renderDashboard();
    alert('Changes saved locally to your browser!');
}

// Render
function renderDashboard() {
    // Photo
    document.getElementById('photoUrl').value = portfolioData.photoUrl;
    document.getElementById('photoPreview').src = portfolioData.photoUrl;

    // Skills
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    portfolioData.skills.forEach((skill, index) => {
        skillsList.innerHTML += `
            <div class="list-item">
                <div class="list-item-content">
                    <h4><i class="${skill.icon}"></i> ${skill.name}</h4>
                    <p>${skill.desc}</p>
                </div>
                <button class="btn-danger" onclick="deleteSkill(${index})">Delete</button>
            </div>
        `;
    });

    // Projects
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    portfolioData.projects.forEach((proj, index) => {
        projectsList.innerHTML += `
            <div class="list-item">
                <div class="list-item-content">
                    <h4>${proj.name}</h4>
                    <p>${proj.desc.substring(0, 50)}...</p>
                </div>
                <button class="btn-danger" onclick="deleteProject(${index})">Delete</button>
            </div>
        `;
    });
}

// Photo Actions
document.getElementById('savePhotoBtn').addEventListener('click', () => {
    portfolioData.photoUrl = document.getElementById('photoUrl').value;
    saveData();
});

// Skill Actions
document.getElementById('addSkillBtn').addEventListener('click', () => {
    const name = document.getElementById('skillName').value;
    const desc = document.getElementById('skillDesc').value;
    const icon = document.getElementById('skillIcon').value;

    if(name && desc && icon) {
        portfolioData.skills.push({ name, desc, icon });
        saveData();
        document.getElementById('skillName').value = '';
        document.getElementById('skillDesc').value = '';
        document.getElementById('skillIcon').value = '';
    }
});

window.deleteSkill = (index) => {
    portfolioData.skills.splice(index, 1);
    saveData();
};

// Project Actions
document.getElementById('addProjBtn').addEventListener('click', () => {
    const name = document.getElementById('projName').value;
    const desc = document.getElementById('projDesc').value;
    const image = document.getElementById('projImage').value;
    const link = document.getElementById('projLink').value;

    if(name && desc && image) {
        portfolioData.projects.push({ name, desc, image, link });
        saveData();
        document.getElementById('projName').value = '';
        document.getElementById('projDesc').value = '';
        document.getElementById('projImage').value = '';
        document.getElementById('projLink').value = '';
    }
});

window.deleteProject = (index) => {
    portfolioData.projects.splice(index, 1);
    saveData();
};

// Export JSON
exportBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});
