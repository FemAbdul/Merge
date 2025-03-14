//translations.js
const translations = {
    en: {
        home: "Home",
        login: "Login",
        register: "Register",
        dashboard: "Dashboard",
        games: "Games",
        profile: "Profile",
        chat: "Chat",
        leaderboard: "Leaderboard",
        logout: "Logout",
        welcome: "Welcome to Pong Game",
        getStarted: "Get Started",
        pageNotFound: "Page not found!",
        
        // Login/Register Page
        loginWith42: "Login with 42 ID",
        username: "Username",
        password: "Password",
        enterUsername: "Enter your username",
        enterPassword: "Enter your password",
        loginButton: "Login",
        newUserPrompt: "New user?",
        registerHere: "Register here",
        email: "Email",
        
        register: "Register",
        username: "Username",
        displayName: "Display Name (optional)",
        email: "Email",
        password: "Password",
        registerButton: "Register",

        invalidLogin: "Invalid username or password.",
        registrationSuccess: "Registration successful! Please log in.",
        registrationFailed: "Registration failed.",
        passwordRequirement: "Password must be at least 8 characters long and contain at least one uppercase letter.",

        //profile page
        profile: "Profile",
        changeDisplayName: "Change Display Name",
        uploadPhoto: "Upload Photo",
        deleteAccount: "Delete Account",
        gameStats: "Game Statistics",
        gamesPlayed: "Games Played",
        totalWins: "Total Wins",
        totalLosses: "Total Losses",
        score: "Score",
        showGameHistory: "Show Game History",
        friends: "Friends",
        enable2FA: "Enable Two-Factor Authentication",

        close: "Close",
        match: "Match",
        date: "Date",
        time: "Time",
        result: "Result",
        opponent: "Opponent",
        game: "Game",
        noMatchHistory: "No match history available.",
        errorLoadingMatchHistory: "Error loading match history. Please try again later.",
        failedToFetchMatchHistory: "Failed to fetch match history.",

        //games
        selectGame: "Select a Game to Play",
        playPingPong: "Play Ping Pong",
        playTicTacToe: "Play Tic-Tac-Toe",
        playRPS: "Play Rock Paper Scissors",

        chooseMode: "Choose Your Ping Pong Mode",
        back: "Back",
        training: "Training",
        singlePlayer: "Single Player (CPU)",
        multiplayer: "Multiplayer (Local)",
        tournament: "Tournament",

        //multiplayer
        back: "Back",
        selectPlayers: "Select Number of Players",
        twoPlayers: "2 Players",
        threePlayers: "3 Players",
        fourPlayers: "4 Players",

        //single player
        singlePlayerTitle: "Single Player (CPU) - 3D Ping Pong",
        reachPoints: "Reach 5 points to win!",
        player: "Player",
        cpu: "CPU",
        startGame: "Start Game",
        controls: "Use ↑ Up and ↓ Down arrow keys to move your paddle",

        //game training
        gameTitle: "Two Player Ping Pong",
        gameDescription: "Reach 5 points to win!",
        backButton: "Back",
        player1: "Player 1",
        player2: "Player 2",
        startGame: "Start Game",
        player1Controls: "Player 1 (Top): Use A and D keys to move",
        player2Controls: "Player 2 (Bottom): Use ← and → arrow keys to move",

        //leaderboard
        leaderboardTitle: "Leaderboard",
        rank: "Rank",
        player: "Player",
        score: "Score",
        winningRate: "Winning Rate",
        memberSince: "Member Since",
        page: "Page: ",
        showTournaments: "Show Tournaments",
        errorMessage: "Error loading leaderboard. Please try again later.",

        tournamentTitle: "Tournament History",
        game: "Game",
        result: "Result",
        moreDetails: "More Details",
        errorMessage: "Error loading tournament history. Please try again later.",
        matchTitle: "Match",
        noMatch: "No match to display.",
        closeButton: "Close",
        round: "Round",
        unknown: "Unknown",
        won: "won!",
    },
    fr: {
        home: "Accueil",
        login: "Connexion",
        register: "S'inscrire",
        dashboard: "Tableau de bord",
        games: "Jeux",
        profile: "Profil",
        chat: "Chat",
        leaderboard: "Classement",
        logout: "Déconnexion",
        welcome: "Bienvenue au jeu de Pong",
        getStarted: "Commencer",
        pageNotFound: "Page non trouvée !",
        
        // Login/Register Page
        loginWith42: "Se connecter avec 42 ID",
        username: "Nom d'utilisateur",
        password: "Mot de passe",
        enterUsername: "Entrez votre nom d'utilisateur",
        enterPassword: "Entrez votre mot de passe",
        loginButton: "Connexion",
        newUserPrompt: "Nouvel utilisateur ?",
        registerHere: "Inscrivez-vous ici",
        
        register: "S'inscrire",
        username: "Nom d'utilisateur",
        displayName: "Nom d'affichage (optionnel)",
        email: "Email",
        password: "Mot de passe",
        registerButton: "S'inscrire",

        invalidLogin: "Nom d'utilisateur ou mot de passe invalide.",
        registrationSuccess: "Inscription réussie ! Veuillez vous connecter.",
        registrationFailed: "L'inscription a échoué.",
        passwordRequirement: "Le mot de passe doit comporter au moins 8 caractères, dont une lettre majuscule.",
    
    
        profile: "Profil",
        changeDisplayName: "Changer le nom d'affichage",
        uploadPhoto: "Télécharger une photo",
        deleteAccount: "Supprimer le compte",
        gameStats: "Statistiques de jeu",
        gamesPlayed: "Parties jouées",
        totalWins: "Victoires totales",
        totalLosses: "Défaites totales",
        score: "Score",
        showGameHistory: "Afficher l'historique des jeux",
        friends: "Amis",
        enable2FA: "Activer l'authentification à deux facteurs",

        close: "Fermer",
        match: "Match",
        date: "Date",
        time: "Heure",
        result: "Résultat",
        opponent: "Adversaire",
        game: "Jeu",
        noMatchHistory: "Aucun historique de match disponible.",
        errorLoadingMatchHistory: "Erreur lors du chargement de l'historique des matchs. Veuillez réessayer plus tard.",
        failedToFetchMatchHistory: "Échec de la récupération de l'historique des matchs.",

        selectGame: "Sélectionnez un jeu à jouer",
        playPingPong: "Jouer au Ping Pong",
        playTicTacToe: "Jouer au Morpion",
        playRPS: "Jouer à Pierre Papier Ciseaux",

        chooseMode: "Choisissez votre mode Ping Pong",
        back: "Retour",
        training: "Entraînement",
        singlePlayer: "Joueur Unique (CPU)",
        multiplayer: "Multijoueur (Local)",
        tournament: "Tournoi",

        back: "Retour",
        selectPlayers: "Sélectionner le nombre de joueurs",
        twoPlayers: "2 joueurs",
        threePlayers: "3 joueurs",
        fourPlayers: "4 joueurs",

        //single playetr
        singlePlayerTitle: "Joueur unique (CPU) - Ping Pong 3D",
        reachPoints: "Atteignez 5 points pour gagner !",
        player: "Joueur",
        cpu: "CPU",
        startGame: "Commencer le jeu",
        controls: "Utilisez les touches ↑ Haut et ↓ Bas pour déplacer votre palette",
        //game training
        gameTitle: "Ping Pong à deux joueurs",
        gameDescription: "Atteignez 5 points pour gagner!",
        backButton: "Retour",
        player1: "Joueur 1",
        player2: "Joueur 2",
        startGame: "Commencer le jeu",
        player1Controls: "Joueur 1 (Haut) : Utilisez les touches A et D pour bouger",
        player2Controls: "Joueur 2 (Bas) : Utilisez les touches ← et → pour bouger",
            
        //leaderboard
        leaderboardTitle: "Classement",
        rank: "Rang",
        player: "Joueur",
        score: "Score",
        winningRate: "Taux de victoire",
        memberSince: "Membre depuis",
        page: "Page : ",
        showTournaments: "Afficher les tournois",
        errorMessage: "Erreur de chargement du classement. Veuillez réessayer plus tard.",
    
        tournamentTitle: "Historique du tournoi",
        game: "Jeu",
        result: "Résultat",
        moreDetails: "Plus de détails",
        errorMessage: "Erreur lors du chargement de l'historique du tournoi. Veuillez réessayer plus tard.",
        matchTitle: "Match",
        noMatch: "Aucun match à afficher.",
        closeButton: "Fermer",
        round: "Tour",
        unknown: "Inconnu",
        won: "a gagné!",
    },
    es: {
        home: "Inicio",
        login: "Iniciar sesión",
        register: "Registrarse",
        dashboard: "Panel de control",
        games: "Juegos",
        profile: "Perfil",
        chat: "Chat",
        leaderboard: "Clasificación",
        logout: "Cerrar sesión",
        welcome: "Bienvenido al juego de Pong",
        getStarted: "Empezar",
        pageNotFound: "Página no encontrada!",
        
        // Login/Register Page
        username: "Nombre de usuario",
        password: "Contraseña",
        enterUsername: "Ingrese su nombre de usuario",
        enterPassword: "Ingrese su contraseña",
        loginButton: "Iniciar sesión",
        newUserPrompt: "¿Nuevo usuario?",
        registerHere: "Regístrate aquí",
        loginWith42: "Iniciar sesión con 42 ID",

        register: "Registrarse",
        username: "Nombre de usuario",
        displayName: "Nombre para mostrar (opcional)",
        email: "Correo electrónico",
        password: "Contraseña",
        registerButton: "Registrarse",

        invalidLogin: "Nombre de usuario o contraseña inválidos.",
        registrationSuccess: "¡Registro exitoso! Por favor inicie sesión.",
        registrationFailed: "Registro fallido.",
        passwordRequirement: "La contraseña debe tener al menos 8 caracteres y contener al menos una letra mayúscula.",
    
        profile: "Perfil",
        changeDisplayName: "Cambiar nombre de usuario",
        uploadPhoto: "Subir foto",
        deleteAccount: "Eliminar cuenta",
        gameStats: "Estadísticas de juego",
        gamesPlayed: "Juegos jugados",
        totalWins: "Victorias totales",
        totalLosses: "Derrotas totales",
        score: "Puntuación",
        showGameHistory: "Mostrar historial de juegos",
        friends: "Amigos",
        enable2FA: "Habilitar autenticación de dos factores",

        close: "Cerrar",
        match: "Partido",
        date: "Fecha",
        time: "Hora",
        result: "Resultado",
        opponent: "Oponente",
        game: "Juego",
        noMatchHistory: "No hay historial de partidos disponible.",
        errorLoadingMatchHistory: "Error al cargar el historial de partidos. Por favor, inténtalo más tarde.",
        failedToFetchMatchHistory: "Error al obtener el historial de partidos.",

        selectGame: "Selecciona un juego para jugar",
        playPingPong: "Jugar Ping Pong",
        playTicTacToe: "Jugar Tres en Raya",
        playRPS: "Jugar Piedra Papel Tijeras",

        chooseMode: "Elige tu modo de Ping Pong",
        back: "Volver",
        training: "Entrenamiento",
        singlePlayer: "Jugador Único (CPU)",
        multiplayer: "Multijugador (Local)",
        tournament: "Torneo",

        back: "Volver",
        selectPlayers: "Seleccionar número de jugadores",
        twoPlayers: "2 jugadores",
        threePlayers: "3 jugadores",
        fourPlayers: "4 jugadores",

        //single player
        singlePlayerTitle: "Jugador único (CPU) - Ping Pong 3D",
        reachPoints: "¡Alcanza 5 puntos para ganar!",
        player: "Jugador",
        cpu: "CPU",
        startGame: "Iniciar Juego",
        controls: "Usa las teclas ↑ Arriba y ↓ Abajo para mover tu paleta",
    
        //game training
        gameTitle: "Ping Pong para dos jugadores",
        gameDescription: "¡Llega a 5 puntos para ganar!",
        backButton: "Atrás",
        player1: "Jugador 1",
        player2: "Jugador 2",
        startGame: "Iniciar juego",
        player1Controls: "Jugador 1 (Arriba): Usa las teclas A y D para moverte",
        player2Controls: "Jugador 2 (Abajo): Usa las teclas ← y → para moverte",

        leaderboardTitle: "Tabla de clasificación",
        rank: "Rango",
        player: "Jugador",
        score: "Puntuación",
        winningRate: "Tasa de victoria",
        memberSince: "Miembro desde",
        page: "Página: ",
        showTournaments: "Mostrar torneos",
        errorMessage: "Error al cargar la tabla de clasificación. Por favor, inténtalo de nuevo más tarde.",
    
        tournamentTitle: "Historial del torneo",
        game: "Juego",
        result: "Resultado",
        moreDetails: "Más detalles",
        errorMessage: "Error al cargar el historial del torneo. Por favor, inténtelo de nuevo más tarde.",
        matchTitle: "Partido",
        noMatch: "No hay partidos para mostrar.",
        closeButton: "Cerrar",
        round: "Ronda",
        unknown: "Desconocido",
        won: "ganó!",
    },
    ar: {
        home: "الرئيسية",
        login: "تسجيل الدخول",
        register: "تسجيل",
        dashboard: "لوحة القيادة",
        games: "الألعاب",
        profile: "الملف الشخصي",
        chat: "الدردشة",
        leaderboard: "لائحة المتصدرين",
        logout: "تسجيل الخروج",
        welcome: "مرحبًا بك في لعبة بونغ",
        getStarted: "ابدأ",
        pageNotFound: "الصفحة غير موجودة!",
        
        // Login/Register Page
        username: "اسم المستخدم",
        password: "كلمة المرور",
        enterUsername: "أدخل اسم المستخدم",
        enterPassword: "أدخل كلمة المرور",
        loginButton: "تسجيل الدخول",
        newUserPrompt: "مستخدم جديد؟",
        registerHere: "سجل هنا",
        loginWith42: "تسجيل الدخول بواسطة 42 ID",
        
        register: "تسجيل حساب",
        username: "اسم المستخدم",
        displayName: "اسم العرض (اختياري)",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        registerButton: "تسجيل",

        registrationSuccess: "تم التسجيل بنجاح! الرجاء تسجيل الدخول.",
        registrationFailed: "فشل التسجيل.",
        passwordRequirement: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف كبير واحد على الأقل.",
    

        profile: "الملف الشخصي",
        changeDisplayName: "تغيير اسم العرض",
        uploadPhoto: "تحميل صورة",
        deleteAccount: "حذف الحساب",
        gameStats: "إحصائيات اللعبة",
        gamesPlayed: "الألعاب التي تم لعبها",
        totalWins: "إجمالي الانتصارات",
        totalLosses: "إجمالي الخسائر",
        score: "النقاط",
        showGameHistory: "عرض سجل الألعاب",
        friends: "الأصدقاء",
        enable2FA: "تفعيل المصادقة الثنائية",
        
        close: "إغلاق",
        match: "المباراة",
        date: "التاريخ",
        time: "الوقت",
        result: "النتيجة",
        opponent: "الخصم",
        game: "اللعبة",
        noMatchHistory: "لا يوجد تاريخ مباريات متاح.",
        errorLoadingMatchHistory: "حدث خطأ أثناء تحميل تاريخ المباريات. يرجى المحاولة لاحقًا.",
        failedToFetchMatchHistory: "فشل في جلب تاريخ المباريات.",

        selectGame: "اختر لعبة للعب",
        playPingPong: "العب بينج بونج",
        playTicTacToe: "العب تيك تاك تو",
        playRPS: "العب حجر ورقة مقص",

        chooseMode: "اختر وضع بينج بونج الخاص بك",
        back: "عودة",
        training: "تدريب",
        singlePlayer: "لاعب فردي (وحدة المعالجة المركزية)",
        multiplayer: "متعدد اللاعبين (محلي)",
        tournament: "بطولة",

        back: "رجوع",
        selectPlayers: "حدد عدد اللاعبين",
        twoPlayers: "لاعبان",
        threePlayers: "3 لاعبين",
        fourPlayers: "4 لاعبين",

        //singl
        singlePlayerTitle: "لاعب واحد (CPU) - بينغ بونغ 3D",
        reachPoints: "الوصول إلى 5 نقاط للفوز!",
        player: "اللاعب",
        cpu: "CPU",
        startGame: "ابدأ اللعبة",
        controls: "استخدم مفاتيح السهم ↑ لأعلى و ↓ لأسفل لتحريك المضرب",
    
        //game training
        gameTitle: "بينج بونج للاعبين",
        gameDescription: "احصل على 5 نقاط للفوز!",
        backButton: "رجوع",
        player1: "اللاعب 1",
        player2: "اللاعب 2",
        startGame: "ابدأ اللعبة",
        player1Controls: "اللاعب 1 (أعلى): استخدم مفاتيح A و D للتحرك",
        player2Controls: "اللاعب 2 (أسفل): استخدم ← و → للتحرك",

        //leaderboard
        leaderboardTitle: "قائمة المتصدرين",
        rank: "الترتيب",
        player: "اللاعب",
        score: "النقاط",
        winningRate: "معدل الفوز",
        memberSince: "عضو منذ",
        page: "الصفحة: ",
        showTournaments: "عرض البطولات",
        errorMessage: "خطأ في تحميل قائمة المتصدرين. يرجى المحاولة مرة أخرى لاحقًا.",
    
        tournamentTitle: "Tournament History",
        game: "Game",
        result: "Result",
        moreDetails: "More Details",
        errorMessage: "Error loading tournament history. Please try again later.",
        matchTitle: "Match",
        noMatch: "No match to display.",
        closeButton: "Close",
        round: "Round",
        unknown: "Unknown",
        won: "won!",
    }
};






function applyTranslations() {
    const lang = localStorage.getItem('selectedLanguage') || 'en';
    console.log('Selected Language:', lang);

    const elements = document.querySelectorAll('[data-translate]');
    console.log('Elements to translate:', elements);

    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        const translation = translations[lang]?.[key] || translations['en']?.[key] || key; // Fallback to 'en'
        el.textContent = translation;
        console.log(`Translated: ${key} -> ${translation}`);
    });
}


// // works fine for everypage except profile pAGE and lang change working only on clicking profile tab
// function setLanguage(lang) {
//     // Store the selected language
//     localStorage.setItem('selectedLanguage', lang);

//     // Update the translations and reapply them
//     applyTranslations();
//     updateNavbar(JSON.parse(localStorage.getItem('currentUser')) ? 'loggedIn' : 'loggedOut');

//     // Re-render the current page
//     const currentPage = document.querySelector('.page').id; // Get the ID of the current page
//     showPage(currentPage);
// }

function setLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    
    // Apply translations without forcing a page reload
    applyTranslations();

    // Get current page from history state
    const currentPage = history.state ? history.state.page : 'home';
    
    // Update the navbar without changing the page
    updateNavbar(isLoggedIn() ? 'loggedIn' : 'loggedOut');

    // Re-render the current page (without redirection)
    showPage(currentPage, false);
}
