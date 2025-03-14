function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function showPage(page, pushHistory = true) {
    const content = document.getElementById('content');
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';  // Default to English
    
    // Define protected pages that require login
    const protectedPages = ['dashboard', 'game', 'profile', 'chat', 'leaderboard'];
    
    // Check if trying to access protected page while logged out
    if (protectedPages.includes(page) && !isLoggedIn()) {
        content.innerHTML = `
            <div class="alert alert-warning text-center mt-5">
                Please login to access this page
                <br>
                <a href="#" class="btn btn-primary mt-3" data-page="login">Go to Login</a>
            </div>
        `;
        setupPageLinks();
        updateNavbar('loggedOut');
        return;
    }

    // Update browser history if needed
    if (pushHistory) {
        history.pushState({ page }, '', `#${page}`);
    }

    switch (page) {
        case 'home':
            content.innerHTML = `
                <div id="home" class="page">
                    <h1 class="welcome-title">${translations[selectedLang].welcome}</h1>
                    <a href="#" class="btn btn-primary btn-lg" data-page="login">${translations[selectedLang].getStarted}</a>
                </div>`;
            setupPageLinks();
            updateNavbar('loggedOut');
            break;

        case 'login':
            showLoginPage();
            break;

        case 'register':
            showRegisterPage();
            break;

        case 'dashboard':
            showDashboard();
            break;

        case 'game':
            showGames();
            updateNavbar('loggedIn');
            break;

        case 'profile':
            showProfilePage();
            updateNavbar('loggedIn');
            break;

        case 'leaderboard':
            fetchAndDisplayLeaderboard()
            updateNavbar('loggedIn');
            break;

        case 'tournaments':
            showTournaments();
            break;

        default:
            content.innerHTML = `<p>Page not found!</p>`;
    }
}


function updateNavbar(status) {
    const navbarLinks = document.getElementById('navbar-links');
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';  // Default to English
    // Map language codes to their native language names
    const languageMap = {
        'en': 'English',
        'fr': 'Français',
        'es': 'Español',
        'ar': 'العربية'
    };
    let languageDropdown = `
        <li class="nav-item dropdown mx-3">
            <a class="nav-link dropdown-toggle" href="#" role="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                ${languageMap[selectedLang]}
            </a>
            <ul class="dropdown-menu" aria-labelledby="languageDropdown">
                <li><a class="dropdown-item" href="#" onclick="setLanguage('en'); return false;">${languageMap['en']}</a></li>
                <li><a class="dropdown-item" href="#" onclick="setLanguage('fr'); return false;">${languageMap['fr']}</a></li>
                <li><a class="dropdown-item" href="#" onclick="setLanguage('es'); return false;">${languageMap['es']}</a></li>
                <li><a class="dropdown-item" href="#" onclick="setLanguage('ar'); return false;">${languageMap['ar']}</a></li>
            </ul>
        </li>
    `;


    if (status === 'loggedIn') {
        navbarLinks.innerHTML = `
            <li class="nav-item mx-3"><a class="nav-link" href="#" onclick="showPage('game'); return false;" data-translate="games">Games</a></li>
            <li class="nav-item mx-3"><a class="nav-link" href="#" onclick="showPage('leaderboard'); return false;" data-translate="leaderboard">Leaderboard</a></li>
            <li class="nav-item mx-3"><a class="nav-link" href="#" onclick="showPage('profile'); return false;" data-translate="profile">Profile</a></li>
            <li class="nav-item mx-3"><a class="nav-link" href="#" onclick="logout(); return false;" data-translate="logout">Logout</a></li>
            ${languageDropdown}
        `;
        navbarLinks.classList.add('justify-content-between');
    } else {
        navbarLinks.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="#" onclick="showPage('home'); return false;" data-translate="home">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#" onclick="showPage('login'); return false;" data-translate="login">Login</a></li>
            ${languageDropdown}
        `;
    }

    setupPageLinks();
    setupLogoutLink();
    applyTranslations();

}


// Setup event delegation for page links
function setupPageLinks() {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.removeEventListener('click', pageLinkHandler);
        link.addEventListener('click', pageLinkHandler);
    });
}

// Page link click handler
function pageLinkHandler(event) {
    event.preventDefault();
    const page = event.target.getAttribute('data-page');
    showPage(page);
}

// Setup logout link
function setupLogoutLink() {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.removeEventListener('click', logout);
        logoutLink.addEventListener('click', logout);
    }
}

// Get the logged-in user's avatar
function getUserAvatar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? `images/${currentUser.avatar}` : 'images/avatar.png';
}

function closePopups() {
    const friendsPopup = document.getElementById('friends-popup');
    if (friendsPopup && document.body.contains(friendsPopup)) {
        document.body.removeChild(friendsPopup);
    }
    const matchPopup = document.getElementById('match-popup');
    if (matchPopup && document.body.contains(matchPopup)) {
        document.body.removeChild(matchPopup);
    }
}

async function logout() {
    closePopups();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const options = {
        method: 'POST',  // Specify the method
        headers: {
            'Authorization': `Bearer ${currentUser.token}`  // Include the JWT token
        }
    };

    try {
        // Use apiCallWithAutoRefresh for the logout API call
        const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/logout/', options);

        if (!response) {
            console.error('Error during logout: No response received.');
            return;
        }
        // Check if the logout was successful
        if (response.ok) {
            // Clear local storage or any stored user data
            localStorage.removeItem('currentUser');
            showPage('home');
        } else {
            alert('Logout failed!');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

// Handle browser back/forward
window.addEventListener('popstate', (event) => {
    // Check if there's state data available
    if (event.state && event.state.page) {
        showPage(event.state.page, false);
    } else if(isLoggedIn()){
        // Get the current URL path to determine which page to show
        const currentPath = window.location.pathname;
        const pageName = getPageNameFromPath(currentPath);
        showPage(pageName, false);
    }
});

// Helper function to extract page name from URL path
function getPageNameFromPath(path) {
    // Remove leading slash and file extension if any
    let pageName = path.replace(/^\//, '').replace(/\.html$/, '');
    
    // If path is empty or just "/", set to home
    if (!pageName) {
        return 'home';
    }
    
    // Handle specific paths as needed
    if (pageName.includes('/')) {
        // Extract the relevant part for nested paths
        const parts = pageName.split('/');
        pageName = parts[parts.length - 1] || parts[parts.length - 2];
    }
    
    return pageName || 'home';
}

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
    const initialPage = window.location.hash.substring(1) || 'home';
    showPage(initialPage);
});

//Functions to make api calls which also handle expired access token. If token expired, refresh token is used to generate a new access token.
async function apiCallWithAutoRefresh(url, options = {}) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let accessToken = currentUser ? currentUser.token : null;

    // Ensure headers are present in options
    options.headers = options.headers || {};
    options.headers["Authorization"] = `Bearer ${accessToken}`;

    try {
        // First, make the fetch request with the provided method (GET, POST, etc.)
        let response = await fetch(url, options);

        // If access token is expired (401), try to refresh it
        if (response.status === 401) {
            console.log("Access token expired. Refreshing...");
            const newAccessToken = await refreshToken(); // Attempt to refresh

            if (!newAccessToken) {
                alert("Your session has expired. Please log in again.");
                localStorage.removeItem('currentUser');
                showPage('login'); // Redirect to login page
                return; // Stop execution after redirecting
            }

            // Retry the original request with the new access token
            options.headers["Authorization"] = `Bearer ${newAccessToken}`;
            response = await fetch(url, options);  // Retry with updated token
        }

        return response;  // Return the final response (either original or retried)
    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
}

async function refreshToken() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Ensure we have a refresh token to send
    if (!currentUser || !currentUser.refreshToken) {
        console.error("No refresh token available");
        return null;
    }

    try {
        // Make the request to refresh the access token
        const response = await fetch('http://127.0.0.1:8000/authentication/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: currentUser.refreshToken }) // Send the refresh token to get a new access token
        });

        if (!response.ok) {
            console.error("Failed to refresh the token");
            return null;
        }

        const data = await response.json();
        const newAccessToken = data.access;
        if (data.refresh) {
            currentUser.refreshToken = data.refresh; // Update refresh token if rotated
        }
        // Update the localStorage with the new access token
        currentUser.token = newAccessToken;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        console.log("Access token refreshed:", newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
}

// Expose functions globally
window.showPage = showPage;
window.logout = logout;