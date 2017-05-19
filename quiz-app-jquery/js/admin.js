let questions = [];

loadData();

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
const questionsList = $('#tableOfQuestions');
const questionInfo = $('#settingsForQuestions');
const addQuestionButton = $('#addQuestionButton');
const optionsList = $('#tableOfOptions')[0];
const addOptionButton = $('#addOptionButton');
const saveButton = $('#saveButton');
const cancelButton = $('#cancelQuestion');
const closeButton = $('#closeQuestionInfo');
const confirmChangesButton = $('#confirmChangesButton');
const backToEditButton = $('#backToEditButton');
const confirmationWindow = $('#confirmationWindow')[0];

/*controller*/
addQuestionButton.on('click', addNewQuestion);
addOptionButton.on('click', addNewOption);
saveButton.on('click', displayPopUpWindow);
cancelButton.on('click', cancelCurrentQuestion);
closeButton.on('click', cancelCurrentQuestion);
confirmChangesButton.on('click', function() {
    hidePopUpWindow();
    saveCurrentQuestion();
});
backToEditButton.on('click', hidePopUpWindow);


/*functions*/
function displayPopUpWindow() {
    $(confirmationWindow).fadeIn('slow');
    setInterval(blinkItem, 600);
}

function hidePopUpWindow() {
    $('#confirmationWindow').fadeOut('slow');
}

function blinkItem() {
    $(confirmChangesButton[0]).fadeOut(1000);
    $(confirmChangesButton[0]).fadeIn(1000);
    setInterval(blinkItem, 2000);
}

function loadData() {
        $.ajax({
            url: "http://localhost:8080/questions",
            type: 'GET',
            success: function(responseText) {
                questions = responseText;
                loadQuestionsData();
            }
        })
}

function loadQuestionsData() {
    renderQuestionsList();
    manageQuestionsList();
}

function renderQuestionsList() {
    questionsList.html('');
    questionsTotal = questions.length;
    for (let i = 0; i < questionsTotal; i++) {
        let tableLine  = Handlebars.compile($('#templateQuestionList').html());
        let tableData = {
            number: i+1,
            questionsDescription: questions[i].description
        };
        questionsList.append(tableLine(tableData));
    }
}

function manageQuestionsList() {
    const questionDescriptions = $('.newQuestion');
    const minusSigns = $('.minus-question');
    for (let i = 0; i < questionsTotal; i++) {
        $(questionDescriptions[i]).on('click', function (){
            manageQuestion(questionDescriptions[i], i);
        });
        $(minusSigns[i]).on('click', function () {
            deleteQuestion(i);
        } )
    }
}

function manageQuestion(row, i) {
    if (row.style.backgroundColor !== 'aquamarine') {
        Array.from($(".newQuestion")).forEach(function(el) {
            el.style.backgroundColor ='white'});
        tempQuestion = JSON.parse(JSON.stringify(questions[i]));
        serverRequest = 'put';
        numberOfQuestionToPut = i;
        displayQuestionInfo();
        $(row).css('backgroundColor', 'aquamarine');
    } else {
        hideQuestionInfo();
        $(row).css('backgroundColor', 'white');
    }
}

function clearTempQuestion() {
    tempQuestion = JSON.parse(JSON.stringify(emptyQuestion));
    optionsTotal = 0;
}

function hideQuestionInfo() {
    clearTempQuestion();
    questionInfo.css('visibility', 'hidden');
}

function addNewQuestion() {
    clearTempQuestion();
    serverRequest = 'post';
    displayQuestionInfo();
}

function displayQuestionInfo() {
    $(questionInfo).css('visibility', 'visible');
    manageCurrentQuestion(tempQuestion);
}

function manageCurrentQuestion(currentQuestion) {
    const currentQuestionDescription = $('#adminQuestionInput')[0];
    $(currentQuestionDescription).val(currentQuestion.description);
    manageCurrentQuestionDescription(currentQuestionDescription);
    manageCurrentQuestionOptions();
}

function manageCurrentQuestionDescription(descriptionInput) {
    $(descriptionInput).on('keyup', function (e) {
        tempQuestion.description = e.target.value;
        return tempQuestion;
    })
}

function manageCurrentQuestionOptions() {
    renderOptionsList();
}

function addNewOption() {
    tempQuestion.options.push(JSON.parse(JSON.stringify(emptyOption)));
    manageCurrentQuestionOptions();
}

function renderOptionsList() {
    $(optionsList).html('');
    optionsTotal = tempQuestion.options.length;
    for (let i = 0; i < optionsTotal; i++) {
        let tableLine = Handlebars.compile($('#templateOptionsList').html());
        let isChecked = tempQuestion.options[i].isCorrect ? 'checked' : '';
        let tableData = {
            number: i+1,
            optionDescription: tempQuestion.options[i].description,
            checked: isChecked,
            i: i
        };
        $(optionsList).append(tableLine(tableData));
    }
    const optionDescription = $('.adminOptionsInput');
    const optionIsCorrect = $('.checkbox');
    const minusSigns = $('.minus-option');
    for (let i = 0; i < optionsTotal; i++) {
        $(optionDescription[i]).on('keyup', function (e) {
            tempQuestion.options[i].description = e.target.value;
        });
        $(optionIsCorrect[i]).on('click', function (e) {
            tempQuestion.options[i].isCorrect = e.target.checked;
        });
        $(minusSigns[i]).on('click', function () {
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
    $.ajax({
        url: addressToChange,
        type: "PUT",
        data: myPutJSON,
        dataType: 'json',
        headers: {'Content-type': 'application/json'}
    });
}

function postQuestionToServer() {
    let myPostJSON = JSON.stringify(tempQuestion);
    $.ajax({
        url: 'http://localhost:8080/questions',
        type: 'POST',
        data: myPostJSON,
        dataType: 'json',
        headers: {'Content-type': 'application/json'},
        success: function(responseText) {
            questions.push(responseText);
            loadQuestionsData();
        }
    });
}

function deleteQuestionFromServer(id) {
    let addressToDelete = 'http://localhost:8080/questions/' + id;
    $.ajax({
        url: addressToDelete,
        type: 'DELETE',
    });
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

;