/**
* Created by INNA on 27.02.2017.
*/

/**/
const colors = ['limegreen', 'crimson', 'cyan', 'darkviolet', 'goldenrod'];
const indexesOfReceivedForAll = [];
const DomHelper = {
    hideFromDom: function (element) {
        element.style.display = 'none'
    },
    setElementText: function (element, text) {
        document.getElementById(element).innerHTML = text;
    },
/*    eventListen: function (event, action) {
        document.addEventListener(event, action);
    }*/
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
            renderQuestionTable();

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
    /*addButtons();*/
    displayQuestion();
    displayVariants();
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


/**
 * Created by INNA on 06.03.2017.
 */

/*admin settings*/



/*model*/
const defaultQuestion = {
    description: 'Some question',
    options: [
        {
            description: 'some option',
            isCorrect: false
        }, {
            description: 'another option',
            isCorrect: true
        }
    ]
};
const defaultQuestion2 = {
    description: 'Another question',
    options: [
        {
            description: 'dfdsf option',
            isCorrect: true
        }, {
            description: 'asdsf option',
            isCorrect: true
        }
    ]
};
const emptyQuestion = {
    description: '',
    options: []
};
const emptyOption = {
    description: '',
    isCorrect: false
};
let questions = [defaultQuestion];
let currentQuestionIndex = 0;



/*controller*/
const addQuestionButtonView = document.getElementById('addQuestionButton');
const addOptionButton = document.getElementById('addOptionButton');


const questionsView = document.getElementById('tableOfQuestions');
const optionsView = document.getElementById('tableOfOptions');
const rightBoxView = document.getElementById('settingsForQuestions');

window.onload = renderQuestions();
addQuestionButtonView.addEventListener('click', addQuestion);
addOptionButton.addEventListener('click', pushOption);



function renderQuestions() {
    questionsView.innerHTML = '';
    for (let i = 0; i < questions.length; i++) {
        questionsView.innerHTML +=
            `<tr >\
                <td>${i + 1}</td> \
                <td class="newQuestion">${questions[i].description}</td>\
                <td><img src="http://www.iconsdb.com/icons/download/red/minus-4-512.gif" alt="minus sign" height="20px" width="20px" class="minus-question"></td>\
            </tr>`;
    }
    const arr = document.querySelectorAll('.newQuestion');
    const minus = document.querySelectorAll('.minus-question');
    for (let i = 0; i < arr.length; i++) {
        arr[i].addEventListener('click', function () {
            if (arr[i].style.backgroundColor === 'aquamarine') {
                hideQuestionInfo();
                arr[i].style.backgroundColor = 'white'
            } else {
                displayQuestionDetails(i);
                arr[i].style.backgroundColor = 'aquamarine';
            }

        });
    }
    for (let i = 0; i < minus.length; i++) {
        minus[i].addEventListener('click', function () {
            deleteQuestion(i);
        });
    }
}

function deleteQuestion(i) {
    questions.splice(i, 1);
    renderQuestions();
    hideQuestionInfo();
}

function deleteOption(i) {
    questions[currentQuestionIndex].options.splice(i, 1);
    renderOptions();
}

function hideQuestionInfo() {
    rightBoxView.style.visibility = 'hidden';
}

function addQuestion() {
    pushQuestion();
    currentQuestionIndex = questions.length-1;
    renderQuestion();
}


function renderQuestion() {
    rightBoxView.style.visibility = 'visible';
    const currQuestionDescriptionView = document.getElementById('adminQuestionInput');
    currQuestionDescriptionView.value = questions[currentQuestionIndex].description;
    currQuestionDescriptionView.addEventListener('keyup', updateQuestionDescription);
    renderOptions();
}
function renderOptions() {
    optionsView.innerHTML = '';
    for (let i = 0; i < questions[currentQuestionIndex].options.length; i++) {
        let checked = questions[currentQuestionIndex].options[i].isCorrect ? 'checked' : '';
        optionsView.innerHTML +=
            `<tr class="newOption">\
                <td class="optionNumber">${i + 1}</td>\
                <td><input type="text" name="questionVariant" \
                    value="${questions[currentQuestionIndex].options[i].description}"\
                    class="adminOptionsInput">\
                </td>\
                <td>\
                    <input type="checkbox" class="checkbox" ${checked}>\
                </td>\
                <td>\
                    <img src="http://www.iconsdb.com/icons/download/red/minus-4-512.gif" alt="minus sign" height="20px" width="20px" class="minus-option">\
                </td>\
            </tr>`;
        }
        const optionDescription = document.querySelectorAll('.adminOptionsInput');
        const optionIsCorrect = document.querySelectorAll('.checkbox');
        const minus = document.querySelectorAll('.minus-option');
        for (let i = 0; i < optionDescription.length; i++) {
            optionDescription[i].addEventListener('keyup', function (e) {
                updateOptionDescription(i, e);
            });
            optionIsCorrect[i].addEventListener('click', function (e) {
                updateOptionIsCorrect(i, e);
            });
        }
        for (let i = 0; i < minus.length; i++) {
            minus[i].addEventListener('click', function () {
                deleteOption(i);
            });
        }
}

function updateOptionDescription(i, e) {
    questions[currentQuestionIndex].options[i].description = e.target.value;
}

function updateOptionIsCorrect(i, e) {
    questions[currentQuestionIndex].options[i].isCorrect = e.target.checked;
}

function pushQuestion() {
    questions.push(JSON.parse(JSON.stringify(emptyQuestion)));
    renderQuestions();
}

function pushOption() {
    questions[currentQuestionIndex].options.push(JSON.parse(JSON.stringify(emptyOption)));
    renderOptions();
}

function displayQuestionDetails(index) {
    currentQuestionIndex = index;
    renderQuestion();

}

function updateQuestionDescription(e){
    questions[currentQuestionIndex].description = e.target.value;
    renderQuestions();
}

























/*
let optionCounter = 0;
let tempOptions = [];
let tempCheckboxes = [];

function addOption() {
    optionCounter++;
    let tempOption = '';
    let tempCheckbox = '';
    tempOptions.push(tempOption);
    tempCheckboxes.push(tempCheckbox);
    renderOptionTable();
}*/

/*function renderOptionTable() {
    document.getElementById('tableOfOptions').innerHTML = '';
    for (let i = 0; i < optionCounter; i++) {
        document.getElementById('tableOfOptions').innerHTML +=
            '<tr class="newOption"><td class="optionNumber">' +
            (i + 1) + '</td><td><input type="text" name="questionVariant" ' +
            'value="' + tempOptions[i] + '" class="adminOptionsInput">' +
            '</td><td><input type="checkbox" class="checkbox"' + tempCheckboxes[i] + '></td><td>' +
            '<img src="http://www.iconsdb.com/icons/download/red/minus-4-512.gif" ' +
            'alt="minus sign" height="20px" width="20px" class="sign"></td></tr>';
    }
    let options = document.querySelectorAll('.adminOptionsInput');
    let checkboxes = document.querySelectorAll('.checkbox');
    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener('change', function (e) {
            updateOptions(e, i)
        })
    }
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', function (e) {
            updateCheckboxes(e, i)
        })
    }
}*//*
function updateOptions(e, index) {
    tempOptions[index] = e.currentTarget.value;
}
function updateCheckboxes(e, index) {
    if (e.currentTarget.checked) {
        tempCheckboxes[index] = 'checked';
    }
}*/





































/*/!*let questionCounter = allQuestions.length;
/!*let optionCounter = 0;*!/
let tempQuestion = '';
let tempOptions = [];
let tempCheckboxes = [];
let correctChecks = [];
addQuestionButton.addEventListener('click', initializeNewQuestion);
addOptionButton.addEventListener('click', initializeNewOption);
saveChangesButton.addEventListener('click', saveChanges);
preDisplaySettings();
function preDisplaySettings() {
    renderQuestionTable();
    document.getElementById('settingsForQuestions').style.visibility = 'hidden';
}


/*function initializeNewOption() {
    document.getElementById('tableOfOptions').innerHTML = '';
    let tempOption = '';
    let tempCheckbox = '';
    tempOptions.push(tempOption);
    tempCheckboxes.push(tempCheckbox);
/!*    tempOptions.forEach(key => key.addEventListener('change', updateOption));*!/
    updateOptionTable();*/
/*}*//*
function updateOption(index, e) {
    tempOptions[index] = (e.value);
}
function updateCheckbox(index, e) {
    if (e.checked) {
        tempCheckboxes[index] = 'checked';
    } else {
        tempCheckboxes[index] = '';
    }
}
function updateQuestion(e) {
    tempQuestion = e.target.value;
}
function updateOptionTable() {
    for (let i = 0; i < tempOptions.length; i++) {
        document.getElementById('tableOfOptions').innerHTML += '<tr class="newOption"><td class="optionNumber">' + (i + 1) + '</td><td><input type="text" name="questionVariant" value="' + tempOptions[i] + '" class="adminOptionsInput"></td><td><input type="checkbox" class="checkbox""></td><td><img src="http://www.iconsdb.com/icons/download/red/minus-4-512.gif" alt="minus sign" height="20px" width="20px" class="sign"></td></tr>';

    }
    let options = document.querySelectorAll('.adminOptionsInput');
    let checkboxes = document.querySelectorAll('.checkbox');

    options.forEach(key => key.addEventListener('change', updateOptions));
    checkboxes.forEach(key => key.addEventListener('change', updateCheckboxes));

    for (let i = 0; i < checkboxes.length; i++) {
        if (tempCheckboxes[i] === 'checked') {
            checkboxes[i].checked = true;
        }*/
   /* }*/
/*

    /!*    let optionNumber = document.querySelectorAll('.optionNumber');*!/
    /!*for (let i = 0; i < options.length; i++) {
        update(options[i]);
        function update(key) {
            key.addEventListener('change', updateOption(i, options[i]))
        }

    }*!/
    function updateOptions() {
        for (let i = 0; i < options.length; i++) {
            updateOption(i, options[i]);
        }
    }
    function updateCheckboxes() {
        for (let i = 0; i < checkboxes.length; i++) {
            updateCheckbox(i, checkboxes[i]);
        }
    }
/!*

    options.forEach(key => key.addEventListener('change', updateOption(key, indexOf(key))));
*!/
*/


/*}*//*

function displayDescriptionBox() {
    document.getElementById('settingsForQuestions').style.visibility = 'visible';
}

function saveChanges() {
    let questionCounter = allQuestions.length+1;

    convertChecksToNumbers();

    let tempModel = {
        question: tempQuestion,
        choices: tempOptions,
        correctAnswer: correctChecks
    };
    allQuestions[questionCounter] = tempModel;
    document.getElementById('settingsForQuestions').style.visibility = 'hidden';
    renderQuestionTable();
    return allQuestions;
}

function renderQuestionTable() {
    document.getElementById('tableOfQuestions').innerHTML = '';
    if (allQuestions.length > 0) {
        for (let i = 0; i < allQuestions.length; i++) {
            document.getElementById('tableOfQuestions').innerHTML += '<tr class="newQuestion"><td>' + (i + 1) + '</td><td>' + allQuestions[i].question + '</td><td><img src="http://www.iconsdb.com/icons/download/red/minus-4-512.gif" alt="minus sign" height="20px" width="20px" class="sign"></td></tr>';
        }
    }
}
*//*
function initializeNewQuestion() {
    displayDescriptionBox();
    document.getElementById('adminQuestionInput').addEventListener('change', updateQuestion);
}

function convertChecksToNumbers() {

    for (let i = 0; i < tempCheckboxes.length; i++) {
        if (tempCheckboxes[i] === 'checked') {
            correctChecks.push(i);
        }
    }
    return correctChecks;
}*!/

*/


/*

const newQuestions = document.querySelectorAll(".newQuestion");


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
}*/
