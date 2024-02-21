// Sélection des éléments du DOM
const scoreEl = document.getElementById("score");
const colorParts = document.querySelectorAll(".colors");
const containerEl = document.querySelector(".container");
const startBtn = document.querySelector("#start-btn");
const resultEl = document.querySelector("#score-result");
const wrapperEl = document.querySelector(".wrapper");

// Définition des couleurs disponibles
const colorObj = {
    color1: { current: "#99BC85", new: "#00ff00" },
    color2: { current: "#DC8686", new: "#ff0000" },
    color3: { current: "#F0DBAF", new: "#0000ff" },
    color4: { current: "#7ED7C1", new: "#ffff00" },
};

// Variables du jeu
let randomColors = [];
let isPathGenerating = false;
let score = 0;
let clickCount = 0;

// Fonction pour obtenir une couleur aléatoire
const getRandomColor = (colorsObj) => {
    const colorKeys = Object.keys(colorsObj);
    return colorKeys[Math.floor(Math.random() * colorKeys.length)];
};

// Fonction pour mettre en pause l'exécution du jeu pendant un certain temps
const delay = async () => {
    // Calculer le délai en fonction du score
    const baseDelay = 500;
    const speedIncreaseFactor = 0.95; // Ajustez cette valeur pour modifier le taux d'augmentation de vitesse
    const delayTime = baseDelay * Math.pow(speedIncreaseFactor, score);

    // Attendre le délai calculé
    return await new Promise((resolve) => setTimeout(resolve, delayTime));
};

// Fonction pour générer un chemin aléatoire de couleurs
const generateRandomPath = async () => {
    randomColors.push(getRandomColor(colorObj));
    score = randomColors.length;
    isPathGenerating = true;
    await showPath(randomColors);
};

// Fonction pour afficher le chemin des couleurs
const showPath = async (colors) => {
    scoreEl.innerText = score;

    for (let color of colors) {
        const currentColor = document.querySelector(`.${color}`);

        await delay();
        currentColor.style.backgroundColor = colorObj[color].new;
        await delay();
        currentColor.style.backgroundColor = colorObj[color].current;
        await delay();
    }

    isPathGenerating = false;
};

// Fonction pour mettre fin au jeu et afficher le score final
const endGame = () => {
    resultEl.innerHTML = `<span>Votre score: ${score}</span>`;
    resultEl.classList.remove("hide");
    containerEl.classList.remove("hide");
    wrapperEl.classList.add("hide");
    startBtn.innerText = "Rejouer";
    startBtn.classList.remove("hide");
};

// Fonction pour réinitialiser le jeu après la fin
const resetGame = () => {
    score = 0;
    clickCount = 0;
    randomColors = [];
    isPathGenerating = false;
    wrapperEl.classList.remove("hide");
    containerEl.classList.add("hide");
    generateRandomPath();
};

// Fonction pour gérer le clic sur une couleur
const handleColorClick = async (e) => {
    if (isPathGenerating) {
        return false;
    }

    if (e.target.classList.contains(randomColors[clickCount])) {
        e.target.style.backgroundColor = colorObj[randomColors[clickCount]].new;
        await delay();
        e.target.style.backgroundColor = colorObj[randomColors[clickCount]].current;
        clickCount++;

        if (clickCount === score) {
            clickCount = 0;
            generateRandomPath();
        }
    } else {
        endGame();
    }
};

// Écouteur d'événement pour le bouton de démarrage
startBtn.addEventListener("click", resetGame);

// Écouteurs d'événement pour les parties colorées
colorParts.forEach((color) => color.addEventListener("click", handleColorClick));

