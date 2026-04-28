const testUsers = [
    {
        id: 1,
        login: "torvalds",
        name: "Linus Torvalds",
        avatar_url: "https://avatars.githubusercontent.com/u/1024588?v=4",
        bio: "Linux creator",
        followers: 200000,
        following: 0,
        public_repos: 50
    },
    {
        id: 2,
        login: "gvanrossum",
        name: "Guido van Rossum",
        avatar_url: "https://avatars.githubusercontent.com/u/6490553?v=4",
        bio: "Python creator",
        followers: 50000,
        following: 50,
        public_repos: 30
    }
];

// Repositories de test

const testRepos = [
    {
        name: "linux",
        description: "Linux kernel",
        language: "C",
        stargazers_count: 15000,
        forks_count: 2000,
        html_url: "https://github.com/torvalds/linux"
    },
    {
        name: "cpython",
        description: "Python interpreter",
        language: "C",
        stargazers_count: 50000,
        forks_count: 23000,
        html_url: "https://github.com/python/cpython"
    }
];


const state = {
    currentUser: null,      // Utilisateur actuellement affiché
    bookmarks: [],          // Favoris sauvegardés
    isViewingBookmarks: false  // Affiche favoris ou résultats

};

//etape 3 


let searchInput=document.getElementById("search-box");
let searchBtn = document.getElementById("btn-search")
let btnFav = document.getElementById("btn-fav")
let welcome = document.getElementById("welcome-box")
let loading = document.getElementById("loading-box")
let error = document.getElementById("error-box")
let loading = document.getElementById("loading-box")
let userProfile=document.getElementById("profile-card")
let bookmarks =document.getElementById("bookmarks-card")




// etape 4


function displayUserProfile(user) {

    // Mettre à jour les éléments du profil
    userProfile.textContent=user.name
    userProfile.textContent=user.id
    
    
    // Afficher la carte profil
    userProfile.style.display="block"
    
    // Masquer l écran d'accueil
    userProfile.style.display="none"
  
}

// etape 5

function displayRepositories(repos) {

    // Vider la liste
   bookmarks.innerHTML = "";
    
    // Parcourir les repos et créer une carte pour chacun
   testRepos.forEach(repo=>{
        const card = document.createElement("div");
    card.className = "repo-card";

    card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "Pas de description"}</p>
        <a href="${repo.html_url}" target="_blank">Voir le repo</a>
    `;

    bookmarks.appendChild(card);
});
}

// etape 6 

function showLoading(){
    loading.style.display="block"
    error.style.display="none"
    userProfile.style.display="none"
    welcome.style.display="none"
}

function showError(message){
     
     error.textContent = message;
     error.style.display="block";
     loading.style.display="none";
}

function showWelcome(){
    welcome.style.display="block";
    userProfile.style.display="none"
    error.style.display="none"
    loading.style.display="none"
}

// etape 7

function searchUserLocal(username) {

    // Afficher le loader
    showLoading();

    // Simuler un délai réseau
    setTimeout(() => {

        // Vérifier si username 
        if (!username) {
            showError("Veuillez entrer un nom d'utilisateur");
            return;
        }
    displayRepositories(testRepos);
    },1500);
}

// etape 8 event listeners

searchBtn.addEventListener("click", () => {
    const username = searchInput.value.trim();
    searchUserLocal(username);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        const username = searchInput.value.trim();
        searchUserLocal(username);
    }
});














