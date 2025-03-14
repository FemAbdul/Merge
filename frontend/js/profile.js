async function showProfilePage() {
    const content = document.getElementById('content');

    // Retrieve the currentUser from localStorage with default values
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";

    // Fetch stats from the backend
    const stats = await fetchUserStats(currentUser);
    if (stats) {
        currentUser.gamesPlayed = stats.total_games_played || 0;
        currentUser.wins = stats.total_wins || 0;
        currentUser.losses = stats.total_losses || 0;
        currentUser.score = stats.total_score || 0;
    }

    content.innerHTML = `
    <div class="profile-main-container">
        <!-- Left Section -->
        <div class="profile-container">
            <h2 class="display-name">${currentUser.displayName}</h2>
            <button id="change-nickname-btn">${translations[selectedLanguage].changeDisplayName}</button>
            <img id="avatar" src="${currentUser.avatar || 'images/avatar.png'}" class="avatar">
            <div class="avatar-selection">
                <div class="avatar-options">
                    <img src="images/avatar1.png" class="avatar-option">
                    <img src="images/avatar2.png" class="avatar-option">
                    <img src="images/avatar3.png" class="avatar-option">
                    <img src="images/avatar4.png" class="avatar-option">
                    <img src="images/avatar5.png" class="avatar-option">
                    <img src="images/avatar6.png" class="avatar-option">
                    <img src="images/avatar7.png" class="avatar-option">
                </div>
            </div>
            <button id="upload-btn">${translations[selectedLanguage].uploadPhoto}</button>
            <input type="file" id="avatar-upload"  accept="image/jpeg, image/png" style="display: none;">
            <button id="delete-btn">${translations[selectedLanguage].deleteAccount}</button>
        </div>

        <!-- Right Section -->
        <div class="profile-right">
            <h3>${translations[selectedLanguage].gameStats}</h3>
            <div class="stats-container">
                <ul class="stats-list">
                    <li><strong>${translations[selectedLanguage].gamesPlayed}:</strong> <span id="games-played">${currentUser.gamesPlayed}</span></li>
                    <li><strong>${translations[selectedLanguage].totalWins}:</strong> <span id="total-wins">${currentUser.wins}</span></li>
                    <li><strong>${translations[selectedLanguage].totalLosses}:</strong> <span id="total-losses">${currentUser.losses}</span></li>
                    <li><strong>${translations[selectedLanguage].score}:</strong> <span id="total-score">${currentUser.score}</span></li>
                </ul>
            </div>
<br>
            <button id="showGameHistoryBtn" class="bn" class="profile-container"><span id="matchhistory">Show Game History</span></button>

            <div class="match-history-container">
                <ul id="match-history"></ul>
                <button id="add-match-btn">${translations[selectedLanguage].matchHistory}</button>
            </div>
            <br>
            <div class="friends-container">
                <ul id="friends-list"></ul>
                <button id="add-friend-btn">${translations[selectedLanguage].friends}</button>
            </div>

             <!-- Enable 2FA Section -->
            <div class="profile-container">
                <button id="enable2FA" class="btn btn-primary">
                    ${translations[selectedLanguage].enable2FA}
                </button>
            </div>
        </div>
        </div>
    </div>
    `;
    applyTranslations();
    
    // Set up the avatar-related events and profile actions
    setupAvatarEvents(currentUser);
    setupProfileActions(currentUser);

    // Display the match history and friends list
    updateFriendsListDisplay(currentUser);

    document.getElementById('showGameHistoryBtn').addEventListener('click', async () => {
        await fetchAndDisplayMatchHistory(currentUser); // Fetch and display match history when button is clicked
    });

    document.getElementById('enable2FA').addEventListener('click', display2FASetup);

}

//FETCH USER GAME STATS
async function fetchUserStats(currentUser) {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.token}`,
            }
        };
 
        const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/games/user-stats', options);

        if (!response.ok) {
            throw new Error('Failed to fetch user stats');
        }

        const stats = await response.json();
        return stats;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return null; // Return null on failure
    }
}

//PROFILE AND AVATAR RELATED

function setupAvatarEvents(currentUser) {
    const avatar = document.getElementById("avatar");
    const uploadButton = document.getElementById("upload-btn");
    const avatarInput = document.getElementById("avatar-upload");
    
    // Set accepted file types in HTML
    avatarInput.setAttribute('accept', 'image/jpeg, image/png');
    if (!currentUser || !currentUser.token) {
        console.error("User not authenticated");
        return;
    }

    uploadButton.addEventListener("click", () => {
        avatarInput.click();
    });

    avatarInput.addEventListener("change", async () => {
        if (avatarInput.files.length > 0) {
            const file = avatarInput.files[0];
            const formData = new FormData();
            formData.append('avatar', file);
            try {
                const options = { 
                    method: 'POST',
                    headers: {
                                'Authorization': `Bearer ${currentUser.token}`,
                    },
                    body: formData,
                };
                const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/upload-avatar/', options);

                if (response.ok) {
                    const data = await response.json();
                    avatar.src = data.avatar_url; // Update the avatar on the page
                    updateAvatarInLocalStorage(data.avatar_url, currentUser); // Save the URL in localStorage
                    alert('Avatar updated successfully!');
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error || 'Failed to update avatar'}`);
                }
            } catch (error) {
                console.error("Error uploading avatar:", error);
                alert('An error occurred while uploading the avatar.');
            
            
            // Check file type
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload only JPEG or PNG files');
                avatarInput.value = ''; // Clear the input
                return;
            }

            // Check file size (e.g., 2MB max)
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes
            if (file.size > maxSize) {
                alert('File size must be less than 2MB');
                avatarInput.value = ''; // Clear the input
                return;
            }

            // Read and resize image before saving
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas for resizing
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set desired dimensions
                    const maxWidth = 200;
                    const maxHeight = 200;

                    // Calculate new dimensions maintaining aspect ratio
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    // Set canvas dimensions
                    canvas.width = width;
                    canvas.height = height;

                    // Draw resized image
                    ctx.drawImage(img, 0, 0, width, height);

                    // Get resized image as data URL
                    const resizedImage = canvas.toDataURL(file.type, 0.8); // 0.8 quality for JPEG

                    // Update avatar and save to localStorage
                    avatar.src = resizedImage;
                    localStorage.setItem('currentAvatar', resizedImage);
                    updateAvatarInLocalStorage(resizedImage);
                };
                img.src = e.target.result;
            };

            reader.readAsDataURL(file);
             } }
    });

    // Avatar options code
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', async (e) => {
            const selectedAvatarPath = e.target.src.split('/').slice(-2).join('/'); // Send relative path to the backend

            try {
                const option = { 
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser.token}`, // Add the JWT token
                    },
                    body: JSON.stringify({ avatar: selectedAvatarPath }), // Send the path to the backend};
                    }
                    const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/update-avatar/', option);

                if (response.ok) {
                    const data = await response.json();
                    avatar.src = data.avatar_url; // Update the avatar on the page
                    updateAvatarInLocalStorage(data.avatar_url, currentUser); // Save the URL in localStorage
                    alert('Avatar updated successfully!');
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error || 'Failed to update avatar'}`);
                }
            } catch (error) {
                console.error("Error updating avatar:", error);
                alert('An error occurred while updating the avatar.');
            }
        });
    });

    const savedAvatar = currentUser.avatar || localStorage.getItem('currentAvatar');
    if (savedAvatar) {
        avatar.src = savedAvatar;
    }
}

function updateAvatarInLocalStorage(avatarSrc, currentUser) {
    
    currentUser.avatar = avatarSrc;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

//Change display name and Delete user profile
function setupProfileActions(currentUser) {
    document.getElementById('change-nickname-btn').addEventListener('click', async() => {
        const newNickname = prompt("Enter your new nickname:", currentUser.displayName);
        if (newNickname && newNickname !== currentUser.displayName) {
            try {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser.token}`
                    },
                    body: JSON.stringify({ display_name: newNickname })
                };
                const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/changedisplayname/', options);

                if (response.ok) {
                    const data = await response.json();
                    // Update the display name locally
                    currentUser.displayName = data.display_name;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    showProfilePage(); // Refresh the page
                    alert('Display name updated successfully!');
                } else {
                    // Handle errors from the backend
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error || 'Failed to update display name'}`);
                }
            } catch (error) {
                console.error('Error updating display name:', error);
                alert('An error occurred. Please try again later.');
            }
        }
    });

    document.getElementById('delete-btn').addEventListener('click', async ()=> {
        const confirmDelete = confirm("Are you sure you want to delete your account?");
        if (confirmDelete) {
            try {
                const option = {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`,
                    },
                };
                const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/deleteaccount/', option);

                if (response.ok) {
                    alert('Account deleted successfully.');
                    localStorage.removeItem('currentUser');
                    showPage('home'); // Redirect to home
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error || 'Failed to delete account'}`);
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('An error occurred. Please try again later.');
            }
        }
    });
}

//FRIENDS

function updateFriendsListDisplay(currentUser) {
    const friendsList = document.getElementById('friends-list');
    friendsList.innerHTML = ''; // Clear previous list

    if (currentUser && currentUser.friends && currentUser.friends.length > 0) {
        currentUser.friends.forEach((friend) => {
            const friendItem = document.createElement('li');
            friendItem.textContent = friend;
            friendsList.appendChild(friendItem);
        });
    }
    document.getElementById('add-friend-btn').addEventListener('click', () => {
        showUsersFriends(currentUser);
    });
}

async function showUsersFriends(currentUser) {
    // Create popup container
    const friendsPopup = document.createElement('div');
    friendsPopup.classList.add('friends-popup');
    friendsPopup.id = 'friends-popup';
    closePopupById('friends-popup');

    // Add popup content
    friendsPopup.innerHTML = `
        <div class="popup-content">
            <h2>Friends</h2>
            <ul id="suggested-friends-list"></ul>
            <p id="empty-message" style="display: none;">No online users or friends to display.</p>
            <button id="close-friends-popup-btn">Close</button>
        </div>
    `;
    document.body.appendChild(friendsPopup);

    // F online users and all friends from backend
    const options = {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
    };
    const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/get-onlineusers/', options);
    if (response.ok) {
        const data = await response.json();
        const suggestedFriendsList = document.getElementById('suggested-friends-list');
        suggestedFriendsList.innerHTML = ''; // Clear the list
        
        // Iterate through the list of online users and friends
        data.users.forEach(user => {
            const friendItem = document.createElement('li');
            friendItem.classList.add('friend-item');

            if (user.is_friend) {
                // If the user is a friend, show the "Friend" button (disabled)
                friendItem.innerHTML = `
                    <span class="friend-name">${user.display_name}</span>
                    <span class="status">${user.online_status === 'online' ? '🟢 Online' : '🔴 Offline'}</span>
                    <button class="friend-btn added" disabled>Friend</button>
                `;
            } else if (user.online_status === 'online') {
                // If the user is online but not a friend, show the "Add Friend" button
                friendItem.innerHTML = `
                    <span class="friend-name">${user.display_name}</span>
                    <span class="status">🟢 Online</span>
                    <button class="add-friend-btn">Add Friend</button>
                `;

                // Add event listener to the "Add Friend" button
                const addButton = friendItem.querySelector('.add-friend-btn');
                addButton.addEventListener('click', () => {
                    addFriend(currentUser, user.id, addButton);
                });
            }

            suggestedFriendsList.appendChild(friendItem);
        });
    } else {
        console.error('Error fetching online users and friends:', response.status, response.statusText);
    }

    // Close button functionality
    document.getElementById('close-friends-popup-btn').addEventListener('click', () => {
        closePopupById('friends-popup');
    });
}

function closePopupById(popupId) {
    const popup = document.getElementById(popupId);
    if (popup && document.body.contains(popup)) {
        document.body.removeChild(popup);
    }
}

async function addFriend(currentUser, friendId, addButton) {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ friend_id: friendId })
    };
    try{
    const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/add_friend/', option);
    if (response.ok) {
        const data = await response.json();
        if (data.message) {
            addButton.textContent = 'Friend Added';
            addButton.classList.add('added');
            addButton.disabled = true;
        } else if (data.error) {
            alert(data.error);
        }
    } else {
        console.error('Failed to add friend:', response.status, response.statusText);
        alert('Failed to add friend. Please try again.');
    }
    } catch (error) {
        console.error('Error adding friend:', error);
        alert('An unexpected error occurred.');
    }
}

// // Function to fetch match history and update the display
// async function fetchAndDisplayMatchHistory(currentUser) {
      
//     console.log('Match history button clicked');
//     const matchHistoryContainer = document.getElementById('matchHistory');
//     if (matchHistoryContainer) {
//         matchHistoryContainer.style.display = 'none';
//     }
    
//     try {
//         const option = {method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${currentUser.token}`,
//             'Content-Type': 'application/json',
//         }};

//         const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/games/matches/', option);

//         if (!response.ok) {
//             matchHistoryContainer.innerHTML = '<p>Failed to fetch match history.</p>';
//         }

//         const matchHistory = await response.json();
        
//         if (matchHistory.length > 0) {
//             if (matchHistoryContainer) {
//                 matchHistoryContainer.style.display = 'flex'; 
//                 matchHistoryContainer.innerHTML = '<button id="closeMatchHistoryBtn" class="close-button" onclick="closeMatchHistory()">'+'close'+'</button>';
//                 const lineBreak = document.createElement('hr');
//                 lineBreak.style.visibility = 'hidden';
//                 lineBreak.style.margin = '10px 0';
//                 matchHistoryContainer.appendChild(lineBreak);
//             }
//             let index = 1;
//             matchHistory.forEach(match => {               
//                 const formattedTime = new Date(`1970-01-01T${match.time}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

//                 const gameElement = document.createElement('div');
//                 gameElement.classList.add('game-item', 'mb-3', 'border', 'border-primary', 'rounded', 'p-3');
//                 gameElement.innerHTML = `
//                         <h3>Match : ${index}</h3>
//                         <div><strong>Date:</strong> ${match.date}</div>
//                         <div><strong>Time:</strong> ${formattedTime}</div>
//                         <div><strong>Result:</strong> ${match.result}</div>
//                         <div><strong>Opponent:</strong> ${match.opponent_display_name}</div>
//                         <div><strong>Game:</strong> ${match.game_name}</div>
//                     `;
//                 matchHistoryContainer.appendChild(gameElement);
//                 index++;
//             });
//         } else {
//             // Display message if no matches are found
//             matchHistoryContainer.innerHTML = '<p>No match history available.</p>';
//         }
//     } catch (error) {
//         matchHistoryContainer.innerHTML = '<p>Error loading match history. Please try again later.</p>';
//     }
// }

// function closeMatchHistory() {
//     const matchHistoryContainer = document.getElementById('matchHistory');
//     if (matchHistoryContainer) {
//         matchHistoryContainer.style.display = 'none';
//     }
// }





async function fetchAndDisplayMatchHistory(currentUser) {
    console.log('Match history button clicked');
    const matchHistoryContainer = document.getElementById('matchHistory');
    if (matchHistoryContainer) {
        matchHistoryContainer.style.display = 'none';
    }

    const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";

    try {
        const option = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`,
                'Content-Type': 'application/json',
            }
        };

        const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/games/matches/', option);

        if (!response.ok) {
            matchHistoryContainer.innerHTML = `<p>${translations[selectedLanguage].failedToFetchMatchHistory}</p>`;
        }

        const matchHistory = await response.json();

        if (matchHistory.length > 0) {
            if (matchHistoryContainer) {
                matchHistoryContainer.style.display = 'flex';
                matchHistoryContainer.innerHTML = `<button id="closeMatchHistoryBtn" class="close-button" onclick="closeMatchHistory()">${translations[selectedLanguage].close}</button>`;
                const lineBreak = document.createElement('hr');
                lineBreak.style.visibility = 'hidden';
                lineBreak.style.margin = '10px 0';
                matchHistoryContainer.appendChild(lineBreak);
            }
            let index = 1;
            matchHistory.forEach(match => {
                const formattedTime = new Date(`1970-01-01T${match.time}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                const gameElement = document.createElement('div');
                gameElement.classList.add('game-item', 'mb-3', 'border', 'border-primary', 'rounded', 'p-3');
                gameElement.innerHTML = `
                        <h3>${translations[selectedLanguage].match}: ${index}</h3>
                        <div><strong>${translations[selectedLanguage].date}:</strong> ${match.date}</div>
                        <div><strong>${translations[selectedLanguage].time}:</strong> ${formattedTime}</div>
                        <div><strong>${translations[selectedLanguage].result}:</strong> ${match.result}</div>
                        <div><strong>${translations[selectedLanguage].opponent}:</strong> ${match.opponent_display_name}</div>
                        <div><strong>${translations[selectedLanguage].game}:</strong> ${match.game_name}</div>
                    `;
                matchHistoryContainer.appendChild(gameElement);
                index++;
            });
        } else {
            matchHistoryContainer.innerHTML = `<p>${translations[selectedLanguage].noMatchHistory}</p>`;
        }
    } catch (error) {
        matchHistoryContainer.innerHTML = `<p>${translations[selectedLanguage].errorLoadingMatchHistory}</p>`;
    }
}

function closeMatchHistory() {
    const matchHistoryContainer = document.getElementById('matchHistory');
    if (matchHistoryContainer) {
        matchHistoryContainer.style.display = 'none';
    }
}





document.getElementById('language-selector').addEventListener('change', function() {
    const selectedLanguage = this.value;
    localStorage.setItem("language", selectedLanguage); // Save the selected language
    showProfilePage(); // Refresh the profile page with the new language
});


window.addEventListener("DOMContentLoaded", () => {
    const savedLanguage = localStorage.getItem("language") || "en";
    document.getElementById("language-selector").value = savedLanguage;
});
