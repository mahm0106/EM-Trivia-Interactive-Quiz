const easyButton = document.getElementById("easy-button");
const mediumButton = document.getElementById("medium-button");
const hardButton = document.getElementById("hard-button");
const questionElement = document.getElementById('question');
const optionsElement = document.querySelector('.quiz-options');
const questionNumberElement = document.getElementById('question-number');
const totalQuestionsElement = document.getElementById('total-question');
const nextQuestionButton = document.getElementById('next-question');
const resultsButton = document.getElementById('results');
const quizContainer = document.querySelector('.quiz-container');
const resultsContainer = document.querySelector('.results-container');
const resultElement = document.getElementById('result');
const checkAnswerButton = document.getElementById('check-answer');
const gradeElement = document.querySelector('.grade');
const tryAgainButton = document.getElementById('try-again');

let currentQuestionIndex = 0;
let questions = [];
let correctAnswersCount = 0;
let incorrectAnswersCount = 0;

easyButton.addEventListener("click", () => fetchAndDisplayQuestions("Easy"));
mediumButton.addEventListener("click", () => fetchAndDisplayQuestions("Medium"));
hardButton.addEventListener("click", () => fetchAndDisplayQuestions("Hard"));

tryAgainButton.addEventListener('click', () => {
    resetTally();
    hideElement(resultsContainer);
    showElement(document.querySelector(".intro-container"));
    currentQuestionIndex = 0;
});

checkAnswerButton.addEventListener('click', checkAnswer);

nextQuestionButton.addEventListener('click', nextQuestion);

resultsButton.addEventListener('click', showResults);

async function fetchAndDisplayQuestions(difficulty) {
    questions = await fetchQuestions(difficulty);
    totalQuestionsElement.textContent = questions.length;
    displayQuestion();
    hideElement(document.querySelector(".intro-container"));
    showElement(quizContainer);
    resultsButton.style.display = "none";
    resultElement.textContent = '';
    checkAnswerButton.style.display = "block";
}


async function fetchQuestions(difficulty) {
    const API_KEY = "qEnIzJiZWMhVYiLJnqEw5XMAyJqNEJIrVQ9P06jm";
    const API_URL = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&difficulty=${difficulty}&limit=10`;
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}

function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const { question, correct_answers, answers } = currentQuestion;
    const options = Object.values(answers).filter(option => option !== null);
    
    optionsElement.innerHTML = "";
    options.forEach((option, index) => {
        const li = document.createElement('li');
        li.textContent = option;
        li.setAttribute('data-correct', correct_answers[`answer_${String.fromCharCode(97 + index)}_correct`]);
        li.addEventListener('click', optionClick);
        optionsElement.appendChild(li);
    });
    
    questionElement.textContent = question;
    questionNumberElement.textContent = currentQuestionIndex + 1;
}

function optionClick(event) {
    checkAnswerButton.disabled = false;
    const selectedOption = event.target.textContent;
    highlightSelectedOption(selectedOption);
}

function highlightSelectedOption(selectedOption) {
    const options = optionsElement.querySelectorAll('li');
    options.forEach(option => {
        option.classList.toggle('selected', option.textContent === selectedOption);
    });
}

function checkAnswer() {
    const selectedOption = optionsElement.querySelector('.selected');
    if (!selectedOption) {
        alert("Please select an answer.");
        return;
    }
    
    const selectedAnswer = selectedOption.textContent;
    const correctOption = optionsElement.querySelector(`li[data-correct="true"]`).textContent;
    const resultMessage = selectedAnswer === correctOption ? "Correct!" : "Incorrect!";
    resultElement.textContent = resultMessage;
    selectedAnswer === correctOption ? correctAnswersCount++ : incorrectAnswersCount++;
    
    nextQuestionButton.style.display = "block";
    checkAnswerButton.disabled = true;
    checkAnswerButton.style.display = "none";
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
        nextQuestionButton.style.display = "none";
        resultsButton.style.display = "none";
        resultElement.textContent = '';
        checkAnswerButton.disabled = false;
        checkAnswerButton.style.display = "block";
    } else if (currentQuestionIndex === questions.length) {
        nextQuestionButton.style.display = "none";
        resultsButton.style.display = "block";
    }
}

function showResults() {
    hideElement(quizContainer);
    showElement(resultsContainer);
    document.getElementById('total-correct').textContent = correctAnswersCount;
    document.getElementById('total-incorrect').textContent = incorrectAnswersCount;

    let grade = '';
    if (correctAnswersCount >= 9) {
        grade = 'Excellent';
    } else if (correctAnswersCount >= 7) {
        grade = 'Very Good';
    } else if (correctAnswersCount >= 5) {
        grade = 'Good';
    } else if (correctAnswersCount >= 3) {
        grade = 'Satisfactory';
    } else {
        grade = 'Needs Improvement';
    }
    gradeElement.textContent = `Grade: ${grade}`;
}

function resetTally() {
    correctAnswersCount = 0;
    incorrectAnswersCount = 0;
    document.getElementById('total-correct').textContent = correctAnswersCount;
    document.getElementById('total-incorrect').textContent = incorrectAnswersCount;
}

function hideElement(element) {
    element.style.display = "none";
}

function showElement(element) {
    element.style.display = "block";
}
