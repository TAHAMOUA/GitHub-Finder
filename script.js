
//  STATE

const state = {
    currentUser: null,
    bookmarks: [],
    repos: []
};


//  DOM ELEMENTS

const searchInput    = document.getElementById("searchInput");
const searchBtn      = document.getElementById("searchBtn");
const welcome        = document.getElementById("welcomeSection");
const loadingSection = document.getElementById("loadingSection");
const errorSection   = document.getElementById("errorSection");
const errorText      = document.getElementById("errorText");
const profileSection = document.getElementById("profileSection");
const userProfile    = document.getElementById("userProfile");
const reposList      = document.getElementById("reposList");


//  API

async function fetchUser(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}`);
    if (!response.ok) throw new Error("Utilisateur introuvable ❌");
    return await response.json();
}

async function fetchRepos(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}/repos?sort=stars`);
    if (!response.ok) throw new Error("Impossible de charger les repos ❌");
    return await response.json();
}

//  UI STATES

function showLoading() {
    loadingSection.classList.remove("hidden");
    welcome.classList.add("hidden");
    errorSection.classList.add("hidden");
    profileSection.classList.add("hidden");
}

function showError(msg) {
    errorText.textContent = msg;
    errorSection.classList.remove("hidden");
    loadingSection.classList.add("hidden");
    profileSection.classList.add("hidden");
}

function showProfile() {
    profileSection.classList.remove("hidden");
    loadingSection.classList.add("hidden");
    errorSection.classList.add("hidden");
}

//  DISPLAY

function displayUser(user) {
    userProfile.innerHTML = `
        <img src="${user.avatar_url}" width="100" style="border-radius:50%" alt="${user.login}">
        <h2>${user.name || user.login}</h2>
        <p class="muted">@${user.login}</p>
        <p>${user.bio || ""}</p>
        <p>👥 ${user.followers} followers • ${user.following} following</p>
        <p>📦 ${user.public_repos} repos</p>
        <div class="profile-actions">
            <button class="btn btn--outline" id="favBtn">⭐ Ajouter aux favoris</button>
            <a href="https://github.com/${user.login}" target="_blank" class="btn">🌐 Voir GitHub</a>
        </div>
    `;

    document.getElementById("favBtn").addEventListener("click", () => {
        addBookmark(user);
    });
}

function displayRepos(repos) {
    reposList.innerHTML = "";

    if (repos.length === 0) {
        reposList.innerHTML = "<p>Aucun repo public.</p>";
        return;
    }

    repos.forEach(repo => {
        const el = document.createElement("div");
        el.className = "repo-card";
        el.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || ""}</p>
            <div class="repo-meta">
                ⭐ ${repo.stargazers_count} • 🍴 ${repo.forks_count}
            </div>
            <a href="${repo.html_url}" target="_blank">Voir le repo →</a>
        `;
        reposList.appendChild(el);
    });
}



//  SEARCH

async function searchUser(userName) {
    if (!userName) {
        showError("Écris un nom d'utilisateur d'abord !");
        return;
    }

    showLoading();

    try {
        const [user, repos] = await Promise.all([
            fetchUser(userName),
            fetchRepos(userName)
        ]);

        state.currentUser = user;
        state.repos = repos;

        displayUser(user);
        displayRepos(repos);
        showProfile();

    } catch (err) {
        showError(err.message);
    }
}

//  EVENTS
searchBtn.addEventListener("click", () => {
    searchUser(searchInput.value.trim());
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchUser(searchInput.value.trim());
    }
});