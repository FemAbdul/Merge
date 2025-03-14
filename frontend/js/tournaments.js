// async function showTournaments() {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     try {
//         const option = { 
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${currentUser.token}`,
//                 'Content-Type': 'application/json',
//             }};

//         const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/games/tournamentlist', option);
        
//         if (!response.ok) {
//             throw new Error('Failed to fetch tournament history');
//         }

//         const tournamentData = await response.json();

//         const content = document.getElementById('content');
//         content.innerHTML = `
//             <div id="tournament">
//                 <h1>Tournament History</h1>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>#</th>
//                             <th>Game</th>
//                             <th>Result</th>
//                             <th></th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${tournamentData.map((data, i) => `
//                             <tr>
//                                 <td>${i + 1}</td>
//                                 <td>${data.logged_in_user}: ${data.game_name} ${data.date} ${data.time}</td>
//                                 <td>${data.winner}</td>
//                                 <td> <!-- Button with "+" image in the last column -->
//                                 <button class="add-btn" onclick="handleAddButtonClick(${data.id})">
//                                     <img src="images/plus.png" alt="More Details" width="20" height="20">
//                                 </button></td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             </div>
//         `;
//     } catch (error) {
//         console.error('Error fetching tournament data:', error);
//         document.getElementById('content').innerHTML = '<p>Error loading tournament history. Please try again later.</p>';
//     }
// }

// async function handleAddButtonClick(tournamentId) {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     // Create and configure popup container
//     const matchPopup = document.createElement('div');
//     matchPopup.classList.add('match-popup', 'friends-popup');

//     // Add popup content with your styling
//     matchPopup.innerHTML = `
//         <div class="popup-content">
//             <h2>Match</h2>
//             <ul id="tournament-match-list"></ul>
//             <p id="empty-message" style="display: none; text-align: center; color: #f44336;">No match to display.</p>
//             <button id="close-match-popup-btn">Close</button>
//         </div>
//     `;

//     // Append popup to body
//     document.body.appendChild(matchPopup);

//     try {
//         const option = {
//             method: 'GET',
//             headers: { 
//                 'Authorization': `Bearer ${currentUser.token}`,
//                 'Content-Type': 'application/json' 
//             }
//         };
//         const response = await apiCallWithAutoRefresh(`http://127.0.0.1:8000/games/${tournamentId}/tournamentdetail`, option);

//         // Parse the response data
//         const data = await response.json();
//         const matchList = document.getElementById('tournament-match-list');
//         matchList.innerHTML = ''; // Clear the match list before adding new data

//         // Handle empty data case
//         if (data.length === 0) {
//             document.getElementById('empty-message').style.display = 'block';
//         } else {
//             document.getElementById('empty-message').style.display = 'none';

//             // Populate the list with match details
//             data.forEach(match => {
//                 const matchItem = document.createElement('li');
//                 matchItem.classList.add('match-item');
//                 matchItem.style.padding = '12px';
//                 matchItem.style.borderBottom = '1px solid #eee';
//                 matchItem.style.color = '#333'; // Match item text color

//                 matchItem.innerHTML = `
//                     <strong>Round ${match.round_number}</strong>: <br>
//                     ${match.player1 || 'Unknown'} vs ${match.player2 || 'Unknown'} <br>
//                     ${match.winner ? `${match.winner}` : ''} 🏆  won!
//                 `;
//                 matchList.appendChild(matchItem);
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching match history:', error);
//     }

//     // Close popup when "Close" button is clicked
//     document.getElementById('close-match-popup-btn').addEventListener('click', () => {
//         if (document.body.contains(matchPopup)) {
//             document.body.removeChild(matchPopup); // Remove popup from DOM
//         }
//     });
// }





async function showTournaments() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en'; // Default to English

    try {
        const option = { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`,
                'Content-Type': 'application/json',
            }
        };

        const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/games/tournamentlist', option);
        
        if (!response.ok) {
            throw new Error(translations[selectedLang].errorMessage);
        }

        const tournamentData = await response.json();

        const content = document.getElementById('content');
        content.innerHTML = `
            <div id="tournament">
                <h1>${translations[selectedLang].tournamentTitle}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>${translations[selectedLang].game}</th>
                            <th>${translations[selectedLang].result}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tournamentData.map((data, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${data.logged_in_user}: ${data.game_name} ${data.date} ${data.time}</td>
                                <td>${data.winner}</td>
                                <td> 
                                    <button class="add-btn" onclick="handleAddButtonClick(${data.id})">
                                        <img src="images/plus.png" alt="${translations[selectedLang].moreDetails}" width="20" height="20">
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching tournament data:', error);
        document.getElementById('content').innerHTML = `<p>${translations[selectedLang].errorMessage}</p>`;
    }
}

async function handleAddButtonClick(tournamentId) {
    closePopupById('match-popup');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';

    // Create and configure popup container
    const matchPopup = document.createElement('div');
    matchPopup.classList.add('match-popup', 'friends-popup');
    matchPopup.id = 'match-popup';

    // Add popup content with translated text
    matchPopup.innerHTML = `
        <div class="popup-content">
            <h2>${translations[selectedLang].matchTitle}</h2>
            <ul id="tournament-match-list"></ul>
            <p id="empty-message" style="display: none; text-align: center; color: #f44336;">${translations[selectedLang].noMatch}</p>
            <button id="close-match-popup-btn">${translations[selectedLang].closeButton}</button>
        </div>
    `;

    // Append popup to body
    document.body.appendChild(matchPopup);

    try {
        const option = {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${currentUser.token}`,
                'Content-Type': 'application/json' 
            }
        };
        const response = await apiCallWithAutoRefresh(`http://127.0.0.1:8000/games/${tournamentId}/tournamentdetail`, option);

        // Parse the response data
        const data = await response.json();
        const matchList = document.getElementById('tournament-match-list');
        matchList.innerHTML = ''; // Clear the match list before adding new data

        // Handle empty data case
        if (data.length === 0) {
            document.getElementById('empty-message').style.display = 'block';
        } else {
            document.getElementById('empty-message').style.display = 'none';

            // Populate the list with match details
            data.forEach(match => {
                const matchItem = document.createElement('li');
                matchItem.classList.add('match-item');
                matchItem.style.padding = '12px';
                matchItem.style.borderBottom = '1px solid #eee';
                matchItem.style.color = '#333';

                matchItem.innerHTML = `
                    <strong>${translations[selectedLang].round} ${match.round_number}</strong>: <br>
                    ${match.player1 || translations[selectedLang].unknown} vs ${match.player2 || translations[selectedLang].unknown} <br>
                    ${match.winner ? `${match.winner} 🏆 ${translations[selectedLang].won}` : ''}
                `;
                matchList.appendChild(matchItem);
            });
        }
    } catch (error) {
        console.error('Error fetching match history:', error);
    }

    // Close popup when "Close" button is clicked
    document.getElementById('close-match-popup-btn').addEventListener('click', () => {
        closePopupById('match-popup');
    });
}

function closePopupById(popupId) {
    const popup = document.getElementById(popupId);
    if (popup && document.body.contains(popup)) {
        document.body.removeChild(popup);
    }
}
