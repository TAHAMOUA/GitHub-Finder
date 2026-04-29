const state = {
    currentUser: null,      // Utilisateur actuellement affiché
    bookmarks: [],          // Favoris sauvegardés
    repos:[]
};

// DOM
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const welcome = document.getElementById("welcomeSection");
const loading = document.getElementById("loadingSection");
const error = document.getElementById("errorSection");
const errorText = document.getElementById("errorText");
const profileSection = document.getElementById("profileSection");
const userProfile = document.getElementById("userProfile");
const reposList = document.getElementById("reposList");


async function fetchUser(username) {

    try {

    const user=await fetch("https://api.github.com/user")
        if(!Response.ok){
            throw new Error("user not found")
        }
        const data =await Response.json()
    } catch (error) {
       console.log(error.message)
        

    }
}

// UI
function showLoading() {
    loading.classList.remove("hidden");
    welcome.classList.add("hidden");
    error.classList.add("hidden");
    profileSection.classList.add("hidden");
}
 
function showError(msg) {
    errorText.textContent = msg;
    error.classList.remove("hidden");
    loading.classList.add("hidden");
}

function showProfile() {
    profileSection.classList.remove("hidden");
    loading.classList.add("hidden");
    error.classList.add("hidden");
}

// Display
function displayUser(user) {
    userProfile.innerHTML = `
        <img src="${user.avatar_url}" width="100" style="border-radius:50%">
        
        <h2>${user.name}</h2>
        <p class="muted">@${user.login}</p>
        <p>${user.bio || ""}</p>

        <p>👥 ${user.followers} • ${user.following}</p>
        <p>📦 ${user.public_repos} repos</p>

        <div class="profile-actions">
            <button class="btn btn--outline" id="favBtn">
                ⭐ Ajouter aux favoris
            </button>

            <a href="https://github.com/${user.login}" target="_blank" class="btn">
                🌐 Voir GitHub
            </a>
        </div>
    `;

    // EVENT FAVORIS (simple version)
    const favBtn = document.getElementById("favBtn");

    favBtn.addEventListener("click", () => {
        alert(`${user.login} ajouté aux favoris ⭐`);
    });
}

function displayRepos(repos) {
    reposList.innerHTML = "";

    repos.forEach(repo => {
        const el = document.createElement("div");
        el.className = "repo-card";

        el.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || ""}</p>
            <div class="repo-meta">
                ⭐ ${repo.stargazers_count} • 🍴 ${repo.forks_count}
            </div>
            <a href="${repo.html_url}" target="_blank">Voir le repo</a>
        `;

        reposList.appendChild(el);
    });
}

// Search
function searchUser(username) {
    showLoading();

    setTimeout(() => {
        const user = testUsers.find(
            u => u.login.toLowerCase() === username.toLowerCase()
        );

        if (!user) {
            showError("Utilisateur introuvable");
            return;
        }

        displayUser(user);
        displayRepos(testRepos);
        showProfile();

    }, 800);
}

// Events
searchBtn.addEventListener("click", () => {
    searchUser(searchInput.value.trim());
});

searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        searchUser(searchInput.value.trim());
    }
});