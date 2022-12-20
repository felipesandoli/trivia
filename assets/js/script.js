const instructionsButton = document.getElementById("instructions-btn");
const closeModal = document.getElementById("close-btn");
const modal = document.getElementById("instructions-modal");

const playButton = document.getElementById("play");
playButton.addEventListener("click", validateUsername);

let questionsList;
let score = 0;

// Functions to display and close modal, adapted from w3schools
/**
 *  Displays the game instructions as a modal
 */
instructionsButton.onclick = function() {
    modal.classList.remove("hidden");
};

closeModal.onclick = function() {
    modal.classList.add("hidden");
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
};

// Function for diplaying a personalized message to the user before starting the game
/**
 *  Hides the welcome window and displays a greeting message to the user with their username, 
 *  displays button for starting the game
 */
function displayGameWindow() {
    const welcomeWindow = document.getElementById("welcome");
    const startGameWindow = document.getElementById("start-play-again");
    welcomeWindow.classList.add("hidden");
    startGameWindow.classList.remove("hidden");
    startGameWindow.children[0].innerText = `Hi ${localStorage.getItem("username")}`;
    const startGameBtn = document.getElementById("start-restart");
    startGameBtn.addEventListener("click", startGame);
}

/**
 *  Validates the username, does not allow empty field or usernames with less than 5
 *  characters
 */
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

/**
 *  Load questions from Open Trivia Database API, calls runGame function for displaying the first question
 */
function loadQuestions() {
    // Getting data from Open Trivia DataBase following tutorial from MDN
    fetch("https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple")
    .then(res => res.json())
    .then(data => {
        questionsList = data.results;
    })
    .then(() => runGame(0));
}


// This function hides the greetings and final window before calling the loadQuestions function, the time in which the window stays blank
// is the time spent loading the questions, the next game window will only appear after the questiosn are loaded.
function startGame() {
    // Clears screen before loading the questions
    const startGameWindow = document.getElementById("start-play-again");
    startGameWindow.classList.add("hidden");
    loadQuestions();
}
/**
 *  Display the question window, call function for displaying the question content and add event listeners for the answer buttons.
 *  Clicking on an answer will call the function that cheks the answer
 */
function runGame(questionNumber) {
    const questionWindow = document.getElementById("questions");
    questionWindow.classList.remove("hidden");
    displayQuestion(questionsList[questionNumber], questionNumber);
    // Add event listener to answer buttons
    const answerElements = document.getElementsByClassName("answer-btn");
    for (let answer of answerElements) {
         answer.addEventListener("click", checkAnswer);
    }
}

/**
 *  Display the question and answers, add a data attribute to the question for storing the question index in the questions array.
 *  Add the answers for that question index to a single array and randomizes it, add a data attribute to the answer elements for storing
 *  which answer is correct
 */
function displayQuestion(question, questionNumber) {
    const questionHeader = document.getElementById("questions").children[0];
    const questionElement = document.getElementById("questions").children[1];
    const answerElements = document.getElementsByClassName("answer-btn");
    questionHeader.innerHTML = `Question ${questionNumber+1}/10`;
    questionElement.innerHTML = question.question;
    questionHeader.setAttribute("data-index", questionNumber);
    
    // add all answers to a single array with objects containing the answer and true or false for correct and incorrect answers.
    let answers = [{answer: question.correct_answer, correct: true}];
    for (let incorrectAnswers of question.incorrect_answers) {
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

/**
 *  Gives visual feedback for the user to let them know if they got the answer right. If they chose the correct answer,
 *  the answer chosen will turn green, if they chose an incorrect answer, this will turn red, and the correct answer green.
 *  Removes the event listener from the buttons, so the user cannot chose another answer for the same question. 
 *  Displays the next button for getting the next question 
 *  
 */
function displayCorrectAnswer(isCorrect, element) {
    const answerElements = document.getElementsByClassName("answer-btn");
    
    if (isCorrect) {
        element.classList.add("correct-answer");
    } else {
        element.classList.add("incorrect-answer");
        for (let answer of answerElements) {
            if (answer.getAttribute("data-bool") === "true") {
                answer.classList.add("correct-answer");
            }
        }
    }

    // Remove event listner from answer buttons
    for (let answer of answerElements) {
        answer.removeEventListener("click", checkAnswer);
    }

    // Display next button for displaying next question
    const nextButton = document.getElementById("next-btn");
    nextButton.classList.remove("hidden-in-place");
    nextButton.addEventListener("click", showNextQuestion);
}

/**
 *  Checks the data attribute of the answer chosen for checking correctness
 */
function checkAnswer() {
    // Use of data attribute based on the Love Maths walkthrough project
    if (this.getAttribute("data-bool") === "true") {
        score++;
        displayCorrectAnswer(true, this);
    } else {
        displayCorrectAnswer(false, this);
    }
}

/**
 *  Hides the next question button. Get the question index from the data attribute, increments it for
 *  displaying the next question.  If there are still questions left, displays next question, 
 *  if the currect question is the last, displays the final screen with the score.
 */
function showNextQuestion() {
    // Remove event listener and hide next button
    const nextButton = document.getElementById("next-btn");
    nextButton.removeEventListener("click", showNextQuestion);
    nextButton.classList.add("hidden-in-place");

    // Get current question number and set it as the index for next question
    const questionHeading = document.getElementById("questions").children[0];
    let questionNumber = parseInt(questionHeading.getAttribute("data-index"));
    questionNumber++;
    questionHeading.removeAttribute("data-index");

    // Reset answer buttons background color
    resetButtons();

    // run game with next question
    (questionNumber < 10) ? runGame(questionNumber) : displayFinalScore();
}


/**
 *  Resets the color of the answer buttons.
 */
function resetButtons() {
    const answerElements = document.getElementsByClassName("answer-btn");
    for (let answer of answerElements) {
        if (answer.classList.contains("correct-answer")) {
            answer.classList.remove("correct-answer");
        } else if (answer.classList.contains("incorrect-answer")) {
            answer.classList.remove("incorrect-answer");
        }
    }
}

/**
 *  Displays the final score, with a customized message depending on how many answers the user got right.
 *  Displays button that allows the user to start the game again.
 */
function displayFinalScore() {
    const questionWindow = document.getElementById("questions");
    const finalWindow = document.getElementById("start-play-again");
    const playAgain = document.getElementById("start-restart");
    questionWindow.classList.add("hidden");
    finalWindow.classList.remove("hidden");
    finalWindow.children[1].innerHTML = `
            You got ${score}/10 questions right!
            <br>
            <br>
            If you would like to play again, just hit the PLAY AGAIN button bellow.
        `;
    if (score > 5) {
        finalWindow.children[0].innerHTML = `Congratulations ${localStorage.getItem("username")}!`;
    } else {
        finalWindow.children[0].innerHTML = `Better Luck next time ${localStorage.getItem("username")}!`;
    }
    playAgain.innerHTML = "Play Again";    
}