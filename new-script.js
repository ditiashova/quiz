let questions = [];
loadData();

/*model*/
/*loads [questions] array of objects*/
const emptyQuestion = {
    description: '',
    options: []
};
const emptyOption = {
    description: '',
    isCorrect: false
};
let tempQuestion = JSON.parse(JSON.stringify(emptyQuestion));
let questionsTotal = 0;
let optionsTotal = 0;
let serverRequest = 'post';
let numberOfQuestionToPut = 0;

/*view*/
const questionsList = document.getElementById('tableOfQuestions');
const questionInfo = document.getElementById('settingsForQuestions');
const addQuestionButton = document.getElementById('addQuestionButton');
const optionsList = document.getElementById('tableOfOptions');
const addOptionButton = document.getElementById('addOptionButton');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelQuestion');
const closeButton = document.getElementById('closeQuestionInfo');

/*controller*/
addQuestionButton.addEventListener('click', addNewQuestion);
addOptionButton.addEventListener('click', addNewOption);
saveButton.addEventListener('click', saveCurrentQuestion);
cancelButton.addEventListener('click', cancelCurrentQuestion);
closeButton.addEventListener('click', cancelCurrentQuestion);

/*functions*/
function loadData() {
    let xhttp = new XMLHttpRequest();
    /*prepare questions*/
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            questions = JSON.parse(this.responseText);
            loadQuestionsData();
        }
    };
    xhttp.open("GET", "http://localhost:8080/questions", true);
    xhttp.send();
}
function loadQuestionsData() {
    renderQuestionsList();
    manageQuestionsList();
}
function renderQuestionsList() {
    questionsList.innerHTML = '';
    questionsTotal = questions.length;
    for (let i = 0; i < questionsTotal; i++) {
        questionsList.innerHTML +=
            `<tr >\
                <td>${i + 1}</td> \
                <td class="newQuestion">${questions[i].description}</td>\
                <td><img src="https://img.clipartfest.com/af46d7d23d92163b442697580e4853d2_green-plus-minus-hi-free-plus-and-minus-clipart_600-598.png" alt="minus sign" height="20px" width="20px" class="minus-question"></td>\
            </tr>`;
    }
}
function manageQuestionsList() {
    const questionDescriptions = document.getElementsByClassName('newQuestion');
    const minusSigns = document.getElementsByClassName('minus-question');
    for (let i = 0; i < questionsTotal; i++) {
        questionDescriptions[i].addEventListener('click', function (){
            manageQuestion(questionDescriptions[i], i);
        });
        minusSigns[i].addEventListener('click', function () {
            deleteQuestion(i);
        } )
    }
}
function manageQuestion(row, i) {
    if (row.style.backgroundColor !== 'aquamarine') {
        Array.from(document.getElementsByClassName("newQuestion")).forEach(el => el.style.backgroundColor = 'white');
        tempQuestion = JSON.parse(JSON.stringify(questions[i]));
        serverRequest = 'put';
        numberOfQuestionToPut = i;
        displayQuestionInfo();
        row.style.backgroundColor = 'aquamarine';
    } else {
        hideQuestionInfo();
        row.style.backgroundColor = 'white';
    }
}
function clearTempQuestion() {
    tempQuestion = JSON.parse(JSON.stringify(emptyQuestion));
    optionsTotal = 0;
}
function hideQuestionInfo() {
    clearTempQuestion();
    questionInfo.style.visibility = 'hidden';
}
function addNewQuestion() {
    clearTempQuestion();
    serverRequest = 'post';
    displayQuestionInfo();
}
function displayQuestionInfo() {
    questionInfo.style.visibility = 'visible';
    manageCurrentQuestion(tempQuestion);
}
function manageCurrentQuestion(currentQuestion) {
    const currentQuestionDescription = document.getElementById('adminQuestionInput');
    currentQuestionDescription.value = currentQuestion.description;
    manageCurrentQuestionDescription(currentQuestionDescription);
    manageCurrentQuestionOptions();
}
function manageCurrentQuestionDescription(descriptionInput) {
    descriptionInput.addEventListener('keyup', function (e) {
        tempQuestion.description = e.target.value;
        return tempQuestion;
    })
}
function manageCurrentQuestionOptions() {
    renderOptionsList();
    manageOptionsList();
}
function addNewOption() {
    tempQuestion.options.push(JSON.parse(JSON.stringify(emptyOption)));
    manageCurrentQuestionOptions();
}
function renderOptionsList() {
    optionsList.innerHTML = '';
    optionsTotal = tempQuestion.options.length;
    for (let i = 0; i < optionsTotal; i++) {
        let checked = tempQuestion.options[i].isCorrect ? 'checked' : '';
        optionsList.innerHTML +=
            `<tr class="newOption">\
                <td class="optionNumber">${i + 1}</td>\
                <td><input type="text" name="questionVariant" \
                    value="${tempQuestion.options[i].description}"\
                    class="adminOptionsInput">\
                </td>\
                <td>\
                    <input type="checkbox" class="checkbox" ${checked}>\
                </td>\
                <td>\
                    <img src="https://img.clipartfest.com/af46d7d23d92163b442697580e4853d2_green-plus-minus-hi-free-plus-and-minus-clipart_600-598.png" alt="minus sign" height="20px" width="20px" class="minus-option">\
                </td>\
            </tr>`;
    }
}
function manageOptionsList() {
    const optionDescription = document.getElementsByClassName('adminOptionsInput');
    const optionIsCorrect = document.getElementsByClassName('checkbox');
    const minusSigns = document.getElementsByClassName('minus-option');
    for (let i = 0; i < optionsTotal; i++) {
        optionDescription[i].addEventListener('keyup', function (e) {
            tempQuestion.options[i].description = e.target.value;
        });
        optionIsCorrect[i].addEventListener('click', function (e) {
            tempQuestion.options[i].isCorrect = e.target.checked;
        });
        minusSigns[i].addEventListener('click', function () {
            tempQuestion.options.splice(i, 1);
            renderOptionsList();
        });
    }
}
function saveCurrentQuestion() {
    if (serverRequest === 'post') {
        postQuestionToServer();
    } else if (serverRequest === 'put') {
        putQuestionToServer();
        questions[numberOfQuestionToPut] = tempQuestion;
        loadQuestionsData();
    }
    hideQuestionInfo();

}
function putQuestionToServer() {
    let addressToChange = 'http://localhost:8080/questions/' + tempQuestion.id;
    let myPutJSON = JSON.stringify(tempQuestion);
    let xhttp = new XMLHttpRequest();
    xhttp.open('PUT', addressToChange, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(myPutJSON);
}
function postQuestionToServer() {
    let myPostJSON = JSON.stringify(tempQuestion);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            questions.push(JSON.parse(this.responseText));
            loadQuestionsData();
        }
    };
    xhttp.open('POST', 'http://localhost:8080/questions', true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(myPostJSON);
}
function deleteQuestionFromServer(id) {
    let xhttp = new XMLHttpRequest();
    let addressToDelete = 'http://localhost:8080/questions/' + id;
    xhttp.open('DELETE', addressToDelete, true);
    xhttp.send();
}
function deleteQuestion(i) {
    deleteQuestionFromServer(questions[i].id);
    questions.splice(i, 1);
    loadQuestionsData();
}
function cancelCurrentQuestion() {
    hideQuestionInfo();
    loadQuestionsData();
}
