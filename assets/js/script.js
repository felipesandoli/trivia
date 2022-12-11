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

// Function for diplaying the gaming window for playing the game for the first time

function displayGameWindow(username) {
    console.log(username);
}

function validateUsername () {
    let username = document.getElementById("username");
    if (username.value === "") {
        alert("Please enter a username");
    } else if (username.value.length < 5){
        alert("Please choose a username with at least 5 characters");
    } else {
        displayGameWindow(username.value);
    }
}