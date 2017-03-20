/**
* Created by INNA on 27.02.2017.
*/

/**/
const colors = ['chocolate', 'midnightblue', 'darkcyan', 'darkviolet', 'sienna'];
const indexesOfReceivedForAll = [];
const DomHelper = {
    hideFromDom: function (element) {
        element.style.display = 'none'
    },
    setElementText: function (element, text) {
        document.getElementById(element).innerHTML = text;
    },
};

let allQuestions = [];
let questionsServer = [];
/*let questions = [];*/
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
            let receivedQuestions = JSON.parse(receivedStr);
            questionsServer = receivedQuestions;
            questions = questionsServer;

            let resultQuestions = [];

            for (let i = 0; i < receivedQuestions.length; i++) {
                let currQuestion = receivedQuestions[i];
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
        document.getElementById('questionsNumbers').innerHTML += '<button type="button" class="questionNumber btn btn-info">' + (i+1) + '</button>';
    }
    numbers = document.querySelectorAll('.questionNumber');
}
function addOptions() {
    document.getElementById('variants').innerHTML = '';
    for (let i = 0; i < allQuestions[curQuestion].choices.length; i++) {

        document.getElementById('variants').innerHTML += '<div class="check center-block text-left"><label for="choice'+i+'" class="variant checkbox-inline"><input type="checkbox" name="var" class="radinput" id="choice'+i+'">' + allQuestions[curQuestion].choices[i] + '</label></div>';
        variants.push(allQuestions[curQuestion].choices[i]);
        lines = document.querySelectorAll('.check');
    }
}
function initializeData() {
    addButtons();
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
  showChecked();

}

function displayQuestion() {
    DomHelper.setElementText('question', allQuestions[curQuestion].question);
}
function displayVariants() {
    for (let i = 0; i < variants.length; i++) {
        variants[i] = allQuestions[curQuestion].choices[i];
    }

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
        addOptions();

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
    } else if (e.target.className === 'questionNumber btn btn-info') {
        curQuestion = +e.target.innerHTML-1;
    }
}











/**
 * Created by INNA on 16.03.2017.
 */
/*model*/
const emptyQuestion = {
    description: '',
    options: []
};
const emptyOption = {
    description: '',
    isCorrect: false
};
let currentQuestionIndex = 0;

/*controller*/
const addQuestionButtonView = document.getElementById('addQuestionButton');
const rightBoxView = document.getElementById('settingsForQuestions');
const saveButton = document.getElementById('saveButton');
const updateQuestionInfoButton = document.getElementById('updateQuestionInfo');
const questionsView = document.getElementById('tableOfQuestions');
const optionsView = document.getElementById('tableOfOptions');
const closeQuestionInfo = document.getElementById('closeQuestionInfo');
const cancelQuestionButton = document.getElementById('cancelQuestion');
const addOptionButton = document.getElementById('addOptionButton');
let iD = 0;
addQuestionButtonView.addEventListener('click', createEmptyQuestion); /*would be better
to add here displayBox and pass (tempQuestion)*/
closeQuestionInfo.addEventListener('click', hideQuestionInfo);
cancelQuestionButton.addEventListener('click', cancelChanges);


function createEmptyQuestion() {
    saveButton.style.visibility = 'visible';
    updateQuestionInfoButton.style.visibility = 'hidden';
    let newTempQuestion = [JSON.parse(JSON.stringify(emptyQuestion))];
    currentQuestionIndex = 0;
    renderQuestionBox(newTempQuestion[currentQuestionIndex]);
}

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
    deleteQuestionServer(questions[i].id);
    questions.splice(i, 1);
    renderQuestions();
    hideQuestionInfo();
}
function deleteQuestionServer(id) {
    let xhttp = new XMLHttpRequest();
    let addressToDelete = "http://localhost:8080/questions/" + id;
    xhttp.open("DELETE", addressToDelete, true);
    xhttp.send();
}
function saveQuestion(question) {
    postQuestionServer(question);
    hideQuestionInfo();

}
function postQuestionServer(objToPost) {
    let myJSON = JSON.stringify(objToPost);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let receivedStr = this.responseText;
            let receivedQuestions = JSON.parse(receivedStr);
            iD = receivedQuestions.id;
            saveAndAddId(objToPost, iD)
        }
    };
    xhttp.open("POST", "http://localhost:8080/questions", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(myJSON);
}

function saveAndAddId(question, id) {
    questions.push(question);
    questions[questions.length-1].id = id;
    renderQuestions();
}
function putQuestionServer(id, objToChange) {
    let addressToChange = "http://localhost:8080/questions/" + id;
    let myJSON = JSON.stringify(objToChange);
    let xhttp = new XMLHttpRequest();
    xhttp.open("PUT", addressToChange, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(myJSON);
}
function hideQuestionInfo() {
    rightBoxView.style.visibility = 'hidden';
    hideButtons();
}
function hideButtons() {
    saveButton.style.visibility = 'hidden';
    updateQuestionInfoButton.style.visibility = 'hidden';
}

function renderQuestionBox(question) {

    addOptionButton.addEventListener('click', function() {
        createNewOption(question)
    });

    rightBoxView.style.visibility = 'visible';
    const currentQuestionDesc = document.getElementById('adminQuestionInput');
    currentQuestionDesc.value = question.description;
    currentQuestionDesc.addEventListener('keyup', function (e){
        updateQuestionDescription(e, question);
    });
    renderOptions(question);

    saveButton.addEventListener('click', function(){
        saveQuestion(question);
    });


    updateQuestionInfoButton.addEventListener('click', function () {
        questions[currentQuestionIndex] = question;
        putQuestionServer(questions[currentQuestionIndex].id, question);
        renderQuestions();
        hideQuestionInfo();
    });


}
function displayQuestionDetails(index) {
    saveButton.style.visibility = 'hidden';
    updateQuestionInfoButton.style.visibility = 'visible';
    currentQuestionIndex = index;
    renderQuestionBox(questions[index]);
}
function updateQuestionDescription(e, question) {
    question.description = e.target.value;
    return question;
}




function renderOptions(question) {
    addOptionButton.removeEventListener('click', function() {
        createNewOption(question)
    });
    optionsView.innerHTML = '';
    for (let i = 0; i < question.options.length; i++) {
        let checked = question.options[i].isCorrect ? 'checked' : '';
        optionsView.innerHTML +=
            `<tr class="newOption">\
                <td class="optionNumber">${i + 1}</td>\
                <td><input type="text" name="questionVariant" \
                    value="${question.options[i].description}"\
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
            updateOptionDescription(i, e, question);
        });
        optionIsCorrect[i].addEventListener('click', function (e) {
            updateOptionIsCorrect(i, e, question);
        });
    }
    for (let i = 0; i < minus.length; i++) {
        minus[i].addEventListener('click', function () {
            deleteOption(i, question);
        });
    }
    return question;
}

function createNewOption(question){
    question.options.push(JSON.parse(JSON.stringify(emptyOption)));
    renderOptions(question);
}
function updateOptionDescription(i, e, question) {
    question.options[i].description = e.target.value;
}
function updateOptionIsCorrect(i, e, question) {
    question.options[i].isCorrect = e.target.checked;
}
function deleteOption(i, question) {
    question.options.splice(i, 1);
    renderOptions(question);
}
/*function pushOption(question) {
    question.options.push(JSON.parse(JSON.stringify(emptyOption)));
    renderOptions(question);
}*/

function cancelChanges() {
    renderQuestions();
    hideQuestionInfo();
}













/**
 * Created by INNA on 06.03.2017.
 */

/*admin settings*/



/*model*/
/*const defaultQuestion = {
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
};*/
/*
const emptyQuestion = {
    description: '',
    options: []
};
const emptyOption = {
    description: '',
    isCorrect: false
};
*/

/*let currentQuestionIndex = 0;
let newTempQuestion = {};*/


/*controller*/
/*const addQuestionButtonView = document.getElementById('addQuestionButton');*/
/*const addOptionButton = document.getElementById('addOptionButton');*/
/*const saveButton = document.getElementById('saveButton');*/
/*const cancelQuestionButton = document.getElementById('cancelQuestion');

const questionsView = document.getElementById('tableOfQuestions');
const optionsView = document.getElementById('tableOfOptions');
const rightBoxView = document.getElementById('settingsForQuestions');
const closeQuestionInfo = document.getElementById('closeQuestionInfo');

/!*window.onload = renderQuestions();*!/
addQuestionButtonView.addEventListener('click', addQuestion);
addOptionButton.addEventListener('click', pushOption);
closeQuestionInfo.addEventListener('click', hideQuestionInfo);*/


/*
function postQuestion(objToPost) {
    let myJSON = JSON.stringify(objToPost);
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8080/questions", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(myJSON);
}
*/


function getLastData() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let receivedStr = this.responseText;
            let receivedQuestions = JSON.parse(receivedStr);
            questions = receivedQuestions;
        }
    };
    xhttp.open("GET", "http://localhost:8080/questions", true);
    xhttp.send();
}
/*
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
}*/

/*function deleteQuestion(i) {
    deleteQuestionServer(questions[i].id);
    questions.splice(i, 1);
    renderQuestions();
    hideQuestionInfo();

}*/
/*
function deleteQuestionServer(id) {
    let xhttp = new XMLHttpRequest();
    let addressToDelete = "http://localhost:8080/questions/" + id;
    xhttp.open("DELETE", addressToDelete, true);
    xhttp.send();
}*/

/*
function deleteOption(i) {
    questions[currentQuestionIndex].options.splice(i, 1);
    renderOptions();
}
*/

/*function hideQuestionInfo() {
    rightBoxView.style.visibility = 'hidden';
}*/

/*function addQuestion() {
    let newTempQuestion = emptyQuestion;
    /!*pushQuestion();*!/ /!*creates new empty question and push it to main array!*!/
    /!*currentQuestionIndex = questions.length-1;*!/ /!*increase question counter*!/
    renderQuestionBox(newTempQuestion, function() {deleteQuestion(currentQuestionIndex)}); /!*load right-sided data for the question*!/
}*/


/*
function renderQuestionBox(thisQuestion, changeBehavior) {
    rightBoxView.style.visibility = 'visible';
    const currQuestionDescriptionView = document.getElementById('adminQuestionInput');
    /!*let requiredQuestion = thisQuestion;*!/
    currQuestionDescriptionView.value = requiredQuestion.description;
    currQuestionDescriptionView.addEventListener('keyup', function() {
        updateQuestionDescription()
    });
    renderOptions();

    cancelQuestionButton.addEventListener('click', function() {
        changeBehavior
    });
    saveButton.addEventListener('click', function(){
        saveQuestionButton(questions[currentQuestionIndex])
    });

}
*/
/*

function saveQuestionButton(dataToSend) {
    postQuestion(dataToSend);
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
*/

/*
function updateOptionDescription(i, e) {
    questions[currentQuestionIndex].options[i].description = e.target.value;
}

function updateOptionIsCorrect(i, e) {
    questions[currentQuestionIndex].options[i].isCorrect = e.target.checked;
}

*/

/*function pushQuestion() {
    questions.push(JSON.parse(JSON.stringify(emptyQuestion)));
    renderQuestions();
}*/


/*
function pushOption() {
    questions[currentQuestionIndex].options.push(JSON.parse(JSON.stringify(emptyOption)));
    renderOptions();
}
*/

/*function displayQuestionDetails(index) {
    currentQuestionIndex = index;
    renderQuestionBox(function () {hideQuestionInfo()});
}*/

/*
function updateQuestionDescription(e){
    questions[currentQuestionIndex].description = e.target.value;
    renderQuestions();
}
*/

























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
