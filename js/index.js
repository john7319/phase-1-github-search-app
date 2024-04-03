document.addEventListener("DOMContentLoaded", function(){
    const baseUrl = "https://api.github.com";
    const searchForm = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");

    searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); 

    const searchTerm = searchInput.value.trim(); 
    if (!searchTerm) {
        alert("Please enter a search term!");
        return;
    }
    const searchType = "users";

    fetch(`${baseUrl}/search/${searchType}?q=${searchTerm}`, {
        headers: {
        "Accept": "application/vnd.github.v3+json"
        }
    })
        .then(response => response.json())
        .then(data => {
        userList.innerHTML = ""; 
        reposList.innerHTML = ""; 

        if (data.items.length === 0) {
            const message = document.createElement("p");
            message.textContent = "No results found!";
            userList.appendChild(message);
        } else {
            data.items.forEach(item => {
            if (searchType === "users") {
                createUserElement(item);
            } else {
                createRepoElement(item);
            }
            });
        }
        })
        .catch(error => console.error("Error fetching results:", error));
    });

    function createUserElement(user) {
        const listItem = document.createElement("li");
        listItem.classList.add("user-result");

        const avatarImg = document.createElement("img");
        avatarImg.src = user.avatar_url;
        listItem.appendChild(avatarImg);

        const userInfo = document.createElement("div");
        userInfo.classList.add("user-info");

        const usernameLink = document.createElement("a");
        usernameLink.href = user.html_url;
        usernameLink.textContent = user.login;
        userInfo.appendChild(usernameLink);

        
        listItem.addEventListener("click", function () {
            fetchUserRepos(user.login);
        });

        listItem.appendChild(userInfo);

        userList.appendChild(listItem);
    }

    function createRepoElement(repo) {
    const listItem = document.createElement("li");
    listItem.classList.add("repo-result");

    const repoName = document.createElement("h3");
    repoName.textContent = repo.name;
    listItem.appendChild(repoName);

    const repoDesc = document.createElement("p");
    repoDesc.textContent = repo.description || "No description provided";
    listItem.appendChild(repoDesc);

    const repoLink = document.createElement("a");
    repoLink.href = repo.html_url;
    repoLink.textContent = "View Repository";
    listItem.appendChild(repoLink);

    reposList.appendChild(listItem);
    }

    function fetchUserRepos(username) {
    const url = `${baseUrl}/users/${username}/repos`;
    fetch(url, {
        headers: {
        "Accept": "application/vnd.github.v3+json"
        }
    })
        .then(response => response.json())
        .then(repos => {
        reposList.innerHTML = "";
        if (repos.length === 0) {
            const message = document.createElement("p");
            message.textContent = "No repositories found for this user.";
            reposList.appendChild(message);
        } else {
            repos.forEach(repo => createRepoElement(repo));
        }
        })
        .catch(error => console.error("Error fetching repos:", error));
    }


    
})
