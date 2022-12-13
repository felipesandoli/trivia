const instructionsButton = document.getElementById("instructions-btn");
const closeModal = document.getElementById("close-btn");
const modal = document.getElementById("instructions-modal");

const playButton = document.getElementById("play");
playButton.addEventListener("click", validateUsername);

// Functions to display and close modal, adapted from w3schools

instructionsButton.onclick = function() {
    modal.classList.remove("hidden");
}

closeModal.onclick = function() {
    modal.classList.add("hidden");
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
}

// Function for diplaying a personalized message to the user before starting the game

function displayGameWindow() {
    const welcomeWindow = document.getElementById("welcome");
    const startGameWindow = document.getElementById("start-play-again");
    welcomeWindow.classList.add("hidden");
    startGameWindow.classList.remove("hidden");
    startGameWindow.children[0].innerText = `Hi ${localStorage.getItem("username")}`;
    const startGame = document.getElementById("start-restart");
    startGame.addEventListener("click", runGame);
}

function validateUsername () {
    let username = document.getElementById("username");
    if (username.value === "") {
        alert("Please enter a username");
    } else if (username.value.length < 5){
        alert("Please choose a username with at least 5 characters");
    } else {
        localStorage.setItem("username", username.value);
        displayGameWindow();
    }
}

function runGame() {
    // Clears screen before loading the questions
    const startGameWindow = document.getElementById("start-play-again");
    startGameWindow.classList.add("hidden");
    // Getting data from Open Trivia DataBase following tutorial from MDN
    fetch("https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple")
    .then(res => res.json())
    .then(data => {
        questionsList = data.results;
    })
    .then(() => {
        const questionWindow = document.getElementById("questions");
        questionWindow.classList.remove("hidden");
        console.log(questionsList);
    })
    
}

