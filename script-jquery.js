/**
 * Created by INNA on 20.03.2017.
 */
/*model*/
const backgroundColors = ['chocolate', 'midnightblue', 'darkcyan', 'darkviolet', 'sienna'];
let quizQuestions = [];
let collectedQuizQuestions = [];
let options = [];
let checked = 0;
let inputs = [];
const indexesOfReceivedForAll = [];
let totalResult = 0;


/*view*/
let buttonNumbers = [];
let confirmButton = $('#button');
let returnButton = $('#return');
let lines = [];

/*controller*/
loadDataFromServer();
let questionIndex = 0;
let checkedBoxes = [];
confirmButton.on('click', processClick);
returnButton.on('click', processClick);


/*functions*/
function loadDataFromServer() {
    /*let xhttp = new XMLHttpRequest();*/
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            parseLoadedData(this.responseText);
            pagePreparetions();

        }};
    xhttp.open("GET", "http://localhost:8080/questions", true);
    xhttp.send();
}
function parseLoadedData(data) {
    let receivedQuestions = JSON.parse(data);
    let arrayLength = receivedQuestions.length;
    let tempQuizQuestions = [];

    for (let i = 0; i < arrayLength; i++) {
        let currentQuestion = receivedQuestions[i];
        let currentOptions = [];
        let currentAnswers = [];
        for (let j = 0; j < currentQuestion.options.length; j++) {
            currentOptions.push(currentQuestion.options[j].description);
            if (currentQuestion.options[j].isCorrect) {
                currentAnswers.push(j);
            }
        }
            let quizItem = {
                question: currentQuestion.description,
                choices: currentOptions,
                correctAnswer: currentAnswers
            };
            tempQuizQuestions.push(quizItem);
        }
    quizQuestions = tempQuizQuestions;
}
function pagePreparetions() {
    displayButtons();
    $('#totalQuestions').html(quizQuestions.length);
    changeCardColor();
    renderCard();
}
function renderCard() {
    $('#currentQuestion').html(questionIndex+1);
    displayData();
    displayBottomButtons();
    displayChecked();
}

function changeCardColor() {
    let randomColor = Math.floor((Math.random() * 4) + 1);
    $('#questionCard').css('backgroundColor', backgroundColors[randomColor]);
}
function displayData() {
    $("#question").html(quizQuestions[questionIndex].question);
    displayOptions();


}
function displayOptions() {
    options = quizQuestions[questionIndex].choices;
    let optionsCounter = options.length;
    $('#variants').html('');
    for (let i = 0; i < optionsCounter; i++) {
        document.getElementById('variants').innerHTML += '<div class="check center-block text-left"><label for="choice'+i+'" class="variant checkbox-inline"><input type="checkbox" name="var" class="radinput" id="choice'+i+'">' + quizQuestions[questionIndex].choices[i] + '</label></div>';
    }
    lines = $('.check');
}
function displayButtons() {
    let buttonCounter = quizQuestions.length;
    for (let i = 0; i < buttonCounter; i++) {
        document.getElementById('questionsNumbers').innerHTML += `<button type="button" class="questionNumber \
        btn btn-info">${(i+1)}</button>`;
    }
    buttonNumbers = $('.questionNumber');
    buttonNumbers.each(function() {
        $(this).on('click', processClick)});
}
function displayBottomButtons() {
    if (questionIndex === 0) {
        returnButton.css('display', 'none');
    } else {
        returnButton.css('display', 'inline');
    }
    if (questionIndex === quizQuestions.length-1) {
        confirmButton.html('Results');
    } else {
        confirmButton.html('Confirm');
    }
}
function processClick(e) {
    saveAnswer();
    changeQuestionNumber(e);
    changeCard();
}
function changeQuestionNumber(e) {
    if (e.target.id === 'button')     {
        questionIndex++;
    } else if (e.target.id === 'return') {
        questionIndex--;
    } else if ($(e.target).hasClass('questionNumber')) {
        questionIndex = +e.target.innerHTML-1;
    }
}
function saveAnswer() {
    inputs = $('.radinput');
    let indexesOfReceivedForSingleQuestion = [];
    let checkedBox = true;
    let arr = [];
    if (checkedBoxes[questionIndex]) {
        checkedBoxes[questionIndex].length = 0;
    }
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            indexesOfReceivedForSingleQuestion.push(i);
            checkedBox = true;
        } else {
            checkedBox = false;
        }
        arr.push(checkedBox);
    }
    checkedBoxes[questionIndex] = arr;
    indexesOfReceivedForAll[questionIndex] = indexesOfReceivedForSingleQuestion;
    return indexesOfReceivedForAll;
}
function changeCard() {
    inputs.each(key => key.checked = false);
    changeCardColor();
    if (questionIndex > 0) {
        returnButton.css('display', 'inline');
    } else {
        returnButton.css('display', 'none');;
    }
    if (questionIndex < quizQuestions.length) {
        renderCard();

    } else {
        hideQuestion();
        countResults();
        showResults();
    }
}
function hideQuestion() {
    $('.variants').each(el => el.css('display', 'none'));
    inputs.each(function() {
        $(this).css('display', 'none')});
    $('#questionNumeration').css('display', 'none');
    confirmButton.css('display', 'none');
    returnButton.css('display', 'none');
    lines.each(function() {
        $(this).css('display', 'none')});
    buttonNumbers.each(function() {
        $(this).css('display', 'none')});
}
function countResults() {
    for (let i = 0; i < quizQuestions.length; i++) {
        let correctInOneQuestion = 0;
        if (indexesOfReceivedForAll[i] && indexesOfReceivedForAll[i].length === quizQuestions[i].correctAnswer.length) {
            for (let j = 0; j < indexesOfReceivedForAll[i].length; j++) {
                if (indexesOfReceivedForAll[i][j] === quizQuestions[i].correctAnswer[j]) {
                    correctInOneQuestion++;
                }
            }
        }
        if (correctInOneQuestion === quizQuestions[i].correctAnswer.length) {
            totalResult++;
        }
    }
    return totalResult;
}
function showResults() {
    $('#question').html("You've answered " + totalResult + " questions correctly");
}
function displayChecked() {
    let optionsLength = quizQuestions[questionIndex].choices.length;
    if (checkedBoxes[questionIndex]) {
        for (let i = 0; i < optionsLength; i++) {
            if (checkedBoxes[questionIndex][i]) {
                $('.radinput')[i].checked = true;
            }
        }
    }
}