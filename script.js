/**
* Created by INNA on 27.02.2017.
*/








const colors = ['limegreen', 'crimson', 'cyan', 'darkviolet', 'goldenrod'];
const indexesOfReceivedForAll = [];
const DomHelper = {
    hideFromDom: function (element) {
        element.style.display = 'none'
    },
    setElementText: function (element, text) {
        document.getElementById(element).innerHTML = text;
    }
};

let allQuestions = [];
let curQuestion = 0;
let totalResult = 0;
let numbers = [];
let variants = [];
let inputs = [];
let lines = [];


loadData();

/* functions */
function loadData() {
    let xhttp = new XMLHttpRequest();
    /*prepare questions*/
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let receivedStr = this.responseText;
            let questions = JSON.parse(receivedStr);
            let resultQuestions = [];

            for (let i = 0; i < questions.length; i++) {
                let currQuestion = questions[i];
                let currChoices = [];
                let currAnswers = [];

                for (let j = 0; j < currQuestion.options.length; j++) {
                    currChoices.push(currQuestion.options[j].description);
                    if (currQuestion.options[j].isCorrect)
                        currAnswers.push(j);
                }

                let q = {
                    question: currQuestion.description,
                    choices: currChoices,
                    correctAnswer: currAnswers
                };

                resultQuestions.push(q);
            }
            allQuestions = resultQuestions;
            initializeData();
        }
    };

    xhttp.open("GET", "http://localhost:8080/questions", true);
    xhttp.send();
}
function addButtons() {
    for (let i = 0; i < allQuestions.length; i++) {
        document.getElementById('questionsNumbers').innerHTML += '<button type="button" class="questionNumber">' + (i+1) + '</button>';
    }
    numbers = document.querySelectorAll('.questionNumber');
}

function addOptions() {

    for (let i = 0; i < allQuestions[curQuestion].choices.length; i++) {
        document.getElementById('variants').innerHTML += '<div class="check"><div class="circle"><input type="checkbox" name="var" class="radinput" id="choice1"></div><div class="line"><label for="choice1" class="variant">' + allQuestions[curQuestion].choices[i] + '</label></div></div>';
        variants.push(allQuestions[curQuestion].choices[i]);
        lines = document.querySelectorAll('.check');
    }
}


function initializeData() {
    addButtons();
    displayQuestion();
    /*displayVariants();*/
    displayColor();
    addOptions();

    DomHelper.setElementText('totalQuestions', allQuestions.length);
    DomHelper.hideFromDom(document.getElementById('return'));

    document.getElementById('button').onclick = processClick;
    document.getElementById('return').onclick = processClick;
    numbers.forEach(key => key.addEventListener('click', processClick))
}

function processClick(e) {
  saveAnswers();
  changeQuestionNumber(e);
  changeCard();
/*  showChecked();*/

}

/*
function returnClick() {
    if (curQuestion > 0) {
        curQuestion--;
        if (curQuestion === 0) {
          DomHelper.hideFromDom(document.getElementById('return'));
        }
        DomHelper.setElementText('currentQuestion', curQuestion + 1);
        displayQuestion();
        displayVariants();


    }
}
*/

function displayVariants() {
    for (let j = 0; j < variants.length; j++) {
        variants[j] = allQuestions[curQuestion].choices[j];
    }
}

function displayQuestion() {
    DomHelper.setElementText('question', allQuestions[curQuestion].question);
}

function displayColor() {
    let random = Math.floor((Math.random() * 4) + 1);
    document.getElementById('questionCard').style.background = colors[random];
}

function changeCard () {
    inputs.forEach(key => key.checked = false);

    displayColor();
    if (curQuestion > 0) {
      document.getElementById('return').style.display = 'inline';
    } else {
        document.getElementById('return').style.display = 'none';
    }

    if (curQuestion < allQuestions.length) {

        DomHelper.setElementText('currentQuestion', curQuestion + 1);
        displayQuestion();
        displayVariants();

    } else {
        hideQuestion();
        countResults();
        showResults();
    }
    if (curQuestion === allQuestions.length-1) {
        DomHelper.setElementText('button', 'Results');
    } else {
        DomHelper.setElementText('button', 'Confirm');
    }
}

function saveAnswers () {
    inputs = document.querySelectorAll('.radinput');
  let indexesOfReceivedForSingleQuestion = [];
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      indexesOfReceivedForSingleQuestion.push(i);
    }
  }
  indexesOfReceivedForAll[curQuestion] = indexesOfReceivedForSingleQuestion;
  return indexesOfReceivedForAll;
}

function hideQuestion() {
    document.querySelectorAll('.variants').forEach(DomHelper.hideFromDom);
    inputs.forEach(DomHelper.hideFromDom);
    DomHelper.hideFromDom(document.getElementById('questionNumeration'));
    DomHelper.hideFromDom(document.getElementById('button'));
    DomHelper.hideFromDom(document.getElementById('return'));
    lines.forEach(DomHelper.hideFromDom);
    numbers.forEach(DomHelper.hideFromDom);
}

function countResults () {

  for (let i = 0; i < allQuestions.length; i++) {
      let correctInOneQuestion = 0;

      if (indexesOfReceivedForAll[i] && indexesOfReceivedForAll[i].length === allQuestions[i].correctAnswer.length) {
        for (let j = 0; j < indexesOfReceivedForAll[i].length; j++) {
            if (indexesOfReceivedForAll[i][j] === allQuestions[i].correctAnswer[j]) {
            correctInOneQuestion++;
            }
        }
      }
      if (correctInOneQuestion === allQuestions[i].correctAnswer.length) {
          totalResult++;
      }
  }
  return totalResult;
}

function showResults() {
    DomHelper.setElementText('question', "You've answered " + totalResult + " questions correctly");
}

function changeQuestionNumber(e) {
    if (e.target.id === 'button')     {
        curQuestion++;
    } else if (e.target.id === 'return') {
        curQuestion--;
    } else if (e.target.className === 'questionNumber') {
        curQuestion = +e.target.innerHTML-1;
    }
}

/*
function showChecked() {
    for (let i = 0; i < inputs.length; i++) {
        if (indexesOfReceivedForAll[curQuestion][i] >= 0) {
            let temp = indexesOfReceivedForAll[curQuestion][i];
            if (temp >= 0) {
                inputs[temp].checked = true;
            } else if (temp) {
                inputs[temp].checked = false;
            }
        }
    }
}*/

/**
 * Created by INNA on 06.03.2017.
 */

/*admin settings*/
const newQuestions = document.querySelectorAll(".newQuestion");
const addQuestionButton = document.getElementById('addQuestionButton');
const addOptionButton = document.getElementById('addOptionButton');
const saveChangesButton = document.getElementById('saveChangesButton');
newQuestions.forEach(key => key.addEventListener('click', showSettings))
addQuestionButton.addEventListener('click', addOneQuestion);
addOptionButton.addEventListener('click', addOneOption);
saveChangesButton.addEventListener('click', saveChanges);

function initializeQuestions() {
}

let questionCounter = 0;
function addOneQuestion() {
    document.getElementById('tableOfQuestions').innerHTML += '<tr class="newQuestion">' + '<td>' + (questionCounter+1) + '</td>' + '<td>' + 'Tap to edit' + '</td>' +         '<td>' + '<img src="http://www.iconsdb.com/icons/download/red/minus-4-512.gif" alt="minus sign" height="20px" width="20px" class="sign">' + '</td>' + '</tr>';
    document.querySelector(".newQuestion").addEventListener('click', showSettings);
    questionCounter++;
}

function showSettings() {
    document.getElementById('settingsForQuestions').style.visibility = 'visible';
}
function addOneOption() {
    document.getElementById('tableOfOptions').innerHTML += '<tr class="newOption">' +         '<td>' + '</td>' + '<td><input type="text" name="questionVariant" value="option1" class="adminOptionsInput"></td>  <td><input type="checkbox" class="checkbox"></td><td><img src="http://www.iconsdb.com/icons/download/red/minus-4-512.gif" alt="minus sign" height="20px" width="20px" class="sign"></td></tr>';
}
function saveChanges() {
    let addingQuestion = document.getElementById('adminQuestionInput').value;
    let addingOptions = document.querySelectorAll('.adminOptionsInput');
    let options = [];
    let allAns = document.querySelectorAll('.checkbox');
    let corAns = [];
    for (let i = 0; i < addingOptions.length; i++) {
        options.push(addingOptions[i].value);
        if (allAns[i].checked) {
            corAns.push(i);
        }
    }
    let q = {
        question: addingQuestion,
        choices: options,
        correctAnswer: corAns
    };

    allQuestions.push(q);
    document.getElementById('settingsForQuestions').style.visibility = 'hidden';
}