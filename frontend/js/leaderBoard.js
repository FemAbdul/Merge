// async function fetchAndDisplayLeaderboard() {
//     try {
//         const currentUser = JSON.parse(localStorage.getItem('currentUser'));

//         const options = {
//             method: 'GET', 
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${currentUser.token}` 
//             }
//         };
//         const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/games/leaderboard', options);
        
//         if (!response.ok) {
//             throw new Error('Failed to fetch leaderboard');
//         }

//         const leaderboardData = await response.json();
//         let currentPage = 1;
//         const entriesPerPage = 5;
        
//         function renderLeaderboardPage(page) {
//             const start = (page - 1) * entriesPerPage;
//             const end = start + entriesPerPage;
//             const paginatedData = leaderboardData.slice(start, end);

//             document.getElementById('leaderboardTable').innerHTML = paginatedData.map(data => `
//                 <tr>
//                     <td>${data.rank}</td>
//                     <td>
//                         <img src="${data.avatar}" alt="Avatar" width="30" style="vertical-align: middle; border-radius: 50%;"> 
//                         ${data.display_name}
//                     </td>
//                     <td>${data.total_score}</td>
//                     <td>${(data.winning_rate * 100).toFixed(2)}%</td>
//                     <td>${new Date(data.date_joined).toLocaleDateString()}</td>
//                 </tr>
//             `).join('');
//             renderPagination();
//         }

//         function renderPagination() {
//             const totalPages = Math.ceil(leaderboardData.length / entriesPerPage);
//             const paginationDiv = document.getElementById('pagination');
//             paginationDiv.innerHTML = '<span>Page: </span>';

//             for (let i = 1; i <= totalPages; i++) {
//                 const button = document.createElement('button');
//                 button.textContent = i;
//                 button.classList.add('page-button');
//                 if (i === currentPage) {
//                     button.classList.add('active');
//                 }
//                 button.addEventListener('click', () => {
//                     currentPage = i;
//                     renderLeaderboardPage(currentPage);
//                 });
//                 paginationDiv.appendChild(button);
//             }
//         }

//         document.getElementById('content').innerHTML = `
//             <div id="leaderboard">
//                 <h1>Leaderboard</h1>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Rank</th>
//                             <th>Player</th>
//                             <th>Score</th>
//                             <th>Winning Rate</th>
//                             <th>Member Since</th>
//                         </tr>
//                     </thead>
//                     <tbody id="leaderboardTable"></tbody>
//                 </table>
//                 <div id="pagination"></div>
//             </div>
//             <div id="footer">
//                 <button onclick="showTournaments()" class="control-btn">Show Tournaments</button>
//             </div>
//         `;

//         renderLeaderboardPage(currentPage);
//     } catch (error) {
//         console.error('Error fetching leaderboard data:', error);
//         document.getElementById('content').innerHTML = '<p>Error loading leaderboard. Please try again later.</p>';
//     }
// }



async function fetchAndDisplayLeaderboard() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const selectedLang = localStorage.getItem('selectedLanguage') || 'en'; // Default to English

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            }
        };
        const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/games/leaderboard', options);

        if (!response.ok) {
            throw new Error(translations[selectedLang].errorMessage);
        }

        const leaderboardData = await response.json();
        let currentPage = 1;
        const entriesPerPage = 5;

        function renderLeaderboardPage(page) {
            const start = (page - 1) * entriesPerPage;
            const end = start + entriesPerPage;
            const paginatedData = leaderboardData.slice(start, end);

            document.getElementById('leaderboardTable').innerHTML = paginatedData.map(data => `
                <tr>
                    <td>${data.rank}</td>
                    <td>
                        <img src="${data.avatar}" alt="Avatar" width="30" style="vertical-align: middle; border-radius: 50%;">
                        ${data.display_name}
                    </td>
                    <td>${data.total_score}</td>
                    <td>${(data.winning_rate * 100).toFixed(2)}%</td>
                    <td>${new Date(data.date_joined).toLocaleDateString()}</td>
                </tr>
            `).join('');
            renderPagination();
        }

        function renderPagination() {
            const totalPages = Math.ceil(leaderboardData.length / entriesPerPage);
            const paginationDiv = document.getElementById('pagination');
            paginationDiv.innerHTML = `<span>${translations[selectedLang].page}</span>`;

            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.classList.add('page-button');
                if (i === currentPage) {
                    button.classList.add('active');
                }
                button.addEventListener('click', () => {
                    currentPage = i;
                    renderLeaderboardPage(currentPage);
                });
                paginationDiv.appendChild(button);
            }
        }

        document.getElementById('content').innerHTML = `
            <div id="leaderboard">
                <h1>${translations[selectedLang].leaderboardTitle}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>${translations[selectedLang].rank}</th>
                            <th>${translations[selectedLang].player}</th>
                            <th>${translations[selectedLang].score}</th>
                            <th>${translations[selectedLang].winningRate}</th>
                            <th>${translations[selectedLang].memberSince}</th>
                        </tr>
                    </thead>
                    <tbody id="leaderboardTable"></tbody>
                </table>
                <div id="pagination"></div>
            </div>
            <div id="footer">
                <button onclick="showTournaments()" class="control-btn">${translations[selectedLang].showTournaments}</button>
            </div>
        `;

        renderLeaderboardPage(currentPage);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        document.getElementById('content').innerHTML = `<p>${translations[selectedLang].errorMessage}</p>`;
    }
}
