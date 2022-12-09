const instructionsButton = document.getElementById("instructions-btn");
const closeModal = document.getElementById("close-btn");
const modal = document.getElementById("instructions-modal");

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

function displayGameWindow() {
    
}

function validateUsername () {

}