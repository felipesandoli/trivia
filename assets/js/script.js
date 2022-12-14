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
    let questionNumber = 0;
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
        displayQuestion(questionsList[questionNumber], questionNumber);
        // Add event listener to answer buttons
        const answerElements = document.getElementsByClassName("answer-btn");
        for (let answer of answerElements) {
            answer.addEventListener("click", checkAnswer);
        }
    })
}

function displayQuestion(question, questionNumber) {
    const questionHeader = document.getElementById("questions").children[0];
    const questionElement = document.getElementById("questions").children[1];
    const answerElements = document.getElementsByClassName("answer-btn");
    questionHeader.innerHTML = `Question ${questionNumber+1}/10`;
    questionElement.innerHTML = question.question;
    
    // add all answers to a single array with objects containing the answer and true or false for correct and incorrect answers.
    let answers = [{answer: question.correct_answer, correct: true}];
    for (incorrectAnswers of question.incorrect_answers) {
        answers.push({answer: incorrectAnswers, correct: false});
    }
    
    // Randomizes answers, taken from javascript.info
    answers.sort(() => Math.random() - 0.5);

    // Add answers to screen
    for (let i = 0; i < 4; i++) {
        answerElements[i].innerHTML = answers[i].answer;
        // Add data attribute for marking correct answer
        if (answers[i].correct) {
            answerElements[i].setAttribute("data-bool", "true");
        } else {
            answerElements[i].setAttribute("data-bool", "false");
        }
    }
}

function displayCorrectAnswer(isCorrect, element) {
    const answerElements = document.getElementsByClassName("answer-btn");
    
    if (isCorrect) {
        element.style.backgroundColor = "green";
    } else {
        element.style.backgroundColor = "red";
        for (let answer of answerElements) {
            if (answer.getAttribute("data-bool") === "true") {
                answer.style.backgroundColor = "green";
            }
        }
    }

    // Remove event listner from answer buttons
    for (let answer of answerElements) {
        answer.removeEventListener("click", checkAnswer);
    }

}

function checkAnswer() {
    // Use of data attribute based on the Love Maths walkthrough project
    if (this.getAttribute("data-bool") === "true") {
        updateScore();
        displayCorrectAnswer(true, this);
    } else {
        displayCorrectAnswer(false, this);
    }
}

function updateScore(score) {
    
}