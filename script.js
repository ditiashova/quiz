/**
* Created by INNA on 27.02.2017.
*/
const allQuestions = [
    {question: "Who was the original author of Dracula?", choices: ["Gustave Eiffel", "Bram Stoker", "Leonardo Da Vinci", "Michelangelo"], correctAnswer: [1]},
    {question: "Who is the frontman of The Prodigy?", choices: ["Johnny Logan", "Bon Scott", "Keith Flint", "Johnny Logan"], correctAnswer: [2]},
    {question: "What is the house number of the Simpsons?", choices: ["13", "42", "742", "7"], correctAnswer: [2]},
    {question: "Who was the first man to fly around the earth with a spaceship?", choices: ["Gagarin", "Mask", "Armstrong", "Bush"], correctAnswer: [0]},
    {question: "In what year was Google launched on the web?", choices: ["1989", "1998", "1994", "2003"], correctAnswer: [1]}
];
const variants = document.querySelectorAll('.variant');
const inputs = document.querySelectorAll('.radinput');
const lines = document.querySelectorAll('.check');
const colors = ['limegreen', 'crimson', 'cyan', 'darkviolet', 'goldenrod'];
const arrayOfAllAnswers = [];
const indexesOfReceivedAnswers = [];
const DomHelper = {
    hideFromDom: function (element) {
        element.style.display = 'none'
    },
    setElementText: function (element, text) {
        document.getElementById(element).innerHTML = text;
    }
};

let currentQuestionNum = 0;
let counterOfCorrect = 0;
let totalCorrectAnswers = 0;

initializeData();

/* functions */
function initializeData() {
    displayQuestion();
    displayVariants();
    changeBackgroundColor();

    DomHelper.setElementText('totalQuestions', allQuestions.length);
    DomHelper.hideFromDom(document.getElementById('return'));

    document.getElementById('button').onclick = nextQuestionButton;
    document.getElementById('return').onclick = previousQuestionButton;
}
function manageReturnButton() {
    if (currentQuestionNum > 0) {
        document.getElementById('return').style.display = 'inline';
    } else {
        DomHelper.hideFromDom(document.getElementById('return'));
    }
}
function manageResultButton() {
    if (currentQuestionNum !== allQuestions.length-1) {
        DomHelper.setElementText('button', 'Confirm');
    } else {
        DomHelper.setElementText('button', 'Results');
    }
}
function manageGeneralView() {
    manageReturnButton();
    manageResultButton();
    if (currentQuestionNum < allQuestions.length) {
        DomHelper.setElementText('currentQuestion', currentQuestionNum + 1);
        displayQuestion();
        displayVariants();
    } else {
        hideQuestion();
        showResults();
    }
}
function nextQuestionButton() {
    counterOfCorrect = checkAnswer();
    clearInputs();
    addCorrectAnswers();
    currentQuestionNum++;
    changeBackgroundColor();
    manageGeneralView();
}
function previousQuestionButton() {
    currentQuestionNum--;
    manageGeneralView();
    clearInputs();
    showPreviousChosen();
}
function addCorrectAnswers() {
    if (counterOfCorrect !== 0 && !arrayOfAllAnswers[currentQuestionNum] ) {
        totalCorrectAnswers++;
        arrayOfAllAnswers[currentQuestionNum] = totalCorrectAnswers;
    } else if (!arrayOfAllAnswers[currentQuestionNum]) {
        arrayOfAllAnswers[currentQuestionNum] = 0;
    }
}
function checkAnswer() {
    let counter = 0;
    let receivedAnswers = [];
    indexesOfReceivedAnswers[currentQuestionNum] = [];
    let correctAnswersNumbers = allQuestions[currentQuestionNum].correctAnswer;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            receivedAnswers.push(i);
        }
    }
    indexesOfReceivedAnswers[currentQuestionNum] = receivedAnswers;
    if (correctAnswersNumbers.length === receivedAnswers.length) {
        for (let i = 0; i < correctAnswersNumbers.length; i++) {
            if (correctAnswersNumbers[i] === receivedAnswers[i]) {
                counter++;
            }
        }
    }

    return counter;
}
function hideQuestion() {
    variants.forEach(DomHelper.hideFromDom);
    inputs.forEach(DomHelper.hideFromDom);
    DomHelper.hideFromDom(document.getElementById('questionNumeration'));
    DomHelper.hideFromDom(document.getElementById('button'));
    DomHelper.hideFromDom(document.getElementById('return'));
    lines.forEach(DomHelper.hideFromDom);
}
function showResults() {
    DomHelper.setElementText('question', "You've answered " + totalCorrectAnswers + " questions correctly");
}
function showPreviousChosen() {
    for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < indexesOfReceivedAnswers[currentQuestionNum].length; j++) {
            if (i === indexesOfReceivedAnswers[currentQuestionNum][j]) {
                inputs[i].checked = true;
            }
        }
    }
}
function displayVariants() {
    for (let j = 0; j < variants.length; j++) {
        variants[j].innerHTML = allQuestions[currentQuestionNum].choices[j];
    }
}
function displayQuestion() {
    DomHelper.setElementText('question', allQuestions[currentQuestionNum].question);
}
function changeBackgroundColor() {
    let random = Math.floor((Math.random() * 4) + 1);
    document.getElementById('questionCard').style.background = colors[random];
}
function clearInputs() {
    inputs.forEach(key => key.checked = false);
}