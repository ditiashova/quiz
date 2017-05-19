const colors = ['chocolate', 'midnightblue', 'darkcyan', 'darkviolet', 'sienna'];
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
let questionsServer = [];
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

    document.getElementById('confirm').onclick = processClick;
    document.getElementById('return').onclick = processClick;
    numbers.forEach(key => key.addEventListener('click', processClick));
}

function processClick(e) {
  saveAnswers();
  changeQuestionNumber(e);
  changeCard();
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
        DomHelper.setElementText('confirm', 'Results');
    } else {
        DomHelper.setElementText('confirm', 'Confirm');
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
    DomHelper.hideFromDom(document.getElementById('confirm'));
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
      if (correctInOneQuestion > 0 && correctInOneQuestion === allQuestions[i].correctAnswer.length) {
          totalResult++;
      }
  }
  return totalResult;
}

function showResults() {
    DomHelper.setElementText('question', "You've answered " + totalResult + " questions correctly");
}

function changeQuestionNumber(e) {
    if (e.target.id === 'confirm')     {
        curQuestion++;
    } else if (e.target.id === 'return') {
        curQuestion--;
    } else if (e.target.className === 'questionNumber btn btn-info') {
        curQuestion = +e.target.innerHTML-1;
    }
}

/**
 * Admin Panel
 */

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
addQuestionButtonView.addEventListener('click', createEmptyQuestion);
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
    for (let i = 0; i < allQuestions.length; i++) {
        questionsView.innerHTML +=
            `<tr >\
                <td>${i + 1}</td> \
                <td class="newQuestion">${allQuestions[i].description}</td>\
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

function cancelChanges() {
    renderQuestions();
    hideQuestionInfo();
}
