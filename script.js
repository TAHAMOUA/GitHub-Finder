// STATE
const state = {
    currentUser: null,
    bookmarks: JSON.parse(localStorage.getItem('githubBookmarks')) || [],
    repos: []
};

// DOM ELEMENTS
const searchInput    = document.getElementById("searchInput");
const searchBtn      = document.getElementById("searchBtn");
const welcome        = document.getElementById("welcomeSection");
const loadingSection = document.getElementById("loadingSection");
const errorSection   = document.getElementById("errorSection");
const errorText      = document.getElementById("errorText");
const profileSection = document.getElementById("profileSection");
const userProfile    = document.getElementById("userProfile");
const reposList      = document.getElementById("reposList");

// DISPLAY USER
function displayUser(user) {
    const isBookmarked = state.bookmarks.find(u => u.login === user.login);

    userProfile.innerHTML = `
        <img src="${user.avatar_url}" width="100" style="border-radius:50%" alt="${user.login}">
        <h2>${user.name || user.login}</h2>
        <p class="muted">@${user.login}</p>
        <p>${user.bio || ""}</p>
        <p>${user.followers} followers • ${user.following} following</p>
        <p>${user.public_repos} repos</p>
        <div class="profile-actions">
            <button class="btn btn--outline" id="toggleBtn">
                ${isBookmarked ? " Retirer des favoris" : " Ajouter aux favoris"}
            </button>
            <a href="https://github.com/${user.login}" target="_blank" class="btn">🌐 Voir GitHub</a>
        </div>
    `;

    document.getElementById("toggleBtn").addEventListener("click", () => {
        toggleBookmark(user);
        displayUser(user);
    });
}

// DISPLAY REPOS
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
                 ${repo.stargazers_count} •  ${repo.forks_count}
            </div>
            <a href="${repo.html_url}" target="_blank">Voir le repo →</a>
        `;
        reposList.appendChild(el);
    });
}

// UI STATES
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

// API
async function fetchUser(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}`);
    if (response.status === 404) throw new Error(`User "@${userName}" not found`);
    if (response.status === 403) throw new Error('API rate limit reached. Try later.');
    if (!response.ok) throw new Error('Unexpected error occurred');
    return await response.json();
}

async function fetchRepos(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}/repos?sort=stars`);
    if (response.status === 403) throw new Error('Rate limit reached');
    if (!response.ok) throw new Error('Impossible de charger les repos');
    return await response.json();
}

// SEARCH
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

// EVENTS
searchBtn.addEventListener("click", () => searchUser(searchInput.value.trim()));
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchUser(searchInput.value.trim());
});

// BOOKMARKS
function displayBookmarks() {
    const bookmarksSection = document.getElementById("bookmarksSection");
    if (state.bookmarks.length === 0) {
        bookmarksSection.innerHTML = "<p>Aucun favori sauvegardé.</p>";
        return;
    }
    bookmarksSection.innerHTML = state.bookmarks.map(user => `
        <div class="bookmark-card">
            <img src="${user.avatar_url}" width="40" style="border-radius:50%">
            <span>@${user.login}</span>
            <button onclick="removeBookmark('${user.login}')"></button>
            <button onclick="searchUser('${user.login}')"></button>
        </div>
    `).join("");
}

function toggleBookmark(user) {
    const exists = state.bookmarks.find(u => u.login === user.login);
    if (exists) {
        removeBookmark(user.login);
    } else {
        addBookmark(user);
    }
}

function addBookmark(user) {
    state.bookmarks.push(user);
    localStorage.setItem("githubBookmarks", JSON.stringify(state.bookmarks));
    displayBookmarks();
    updateBookmarkCount();
}

function removeBookmark(login) {
    state.bookmarks = state.bookmarks.filter(u => u.login !== login);
    localStorage.setItem("githubBookmarks", JSON.stringify(state.bookmarks));
    displayBookmarks();
    updateBookmarkCount();
}

function clearBookmarks() {
    state.bookmarks = [];
    localStorage.removeItem("githubBookmarks");
    displayBookmarks();
    updateBookmarkCount();
}

function updateBookmarkCount() {
    const countEl = document.getElementById("bookmarkCount");
    const count = state.bookmarks.length;
    countEl.textContent = ` ${count} ${count > 1 ? "" : ""}`;
}

updateBookmarkCount();