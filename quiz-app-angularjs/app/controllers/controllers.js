/**
 * Created by INNA on 12.04.2017.
 */
app.controller('AdminPanelController', function ($scope, questionsService) {

    initializeQuestions();

    /*empty*/
    let emptyQuestion = {
        description: '',
        options: [
            {
                description: '',
                isCorrect: false
            }
        ]
    };
    let emptyOption = {
        description: '',
        isCorrect: false
    };
    $scope.tempQuestion = {};
    $scope.tempOption = {};

    /*left question list*/
    $scope.questions = [];
    $scope.createQuestion = function () {
        $scope.showDetails = true;
        $scope.allowToSave = true;
        $scope.tempQuestion = angular.copy(emptyQuestion);
    };
    $scope.editQuestion = function (id) {
        $scope.showDetails = true;
        $scope.allowToUpdate = true;
        $scope.tempQuestion = angular.copy($scope.questions[id]);
        $scope.operatedQuestionIndex = id;
    };
    $scope.deleteQuestion = function (id) {
        questionsService.deleteQuestion($scope.questions[id])
            .then(data => { if (data === 'success') { $scope.questions.splice(id, 1); } });
    };

        /*view*/
    $scope.showDetails = false;
    $scope.operatedQuestionIndex = null;
    $scope.isSelectedQuestion = function (id) {
        return id === $scope.operatedQuestionIndex;
    };

    /*right question list*/
    $scope.isOptionChecked = function (id) {
        if ($scope.tempQuestion.options[id].isCorrect) {
            return 'checked';
        } else {
            return '';
        }
    };
    $scope.deleteOption = function (id) {
        $scope.tempQuestion.options.splice(id, 1);
    };
    $scope.createOption = function () {
        $scope.tempQuestion.options.push(angular.copy(emptyOption));
    };
    $scope.saveNewQuestion = function () {
        questionsService.addQuestion($scope.tempQuestion)
            .then(data => $scope.questions.push(data));
        $scope.closeQuestion();
    };
    $scope.updateQuestion = function () {
        questionsService.updateQuestion($scope.tempQuestion);
        $scope.questions[$scope.operatedQuestionIndex] = angular.copy($scope.tempQuestion);
        $scope.closeQuestion();
            /*.then(function (data){
                return new Promise((resolve, reject) => {$scope.questions[$scope.operatedQuestionIndex] = data;resolve()})})
            .then($scope.closeQuestion());*/
    };
    $scope.closeQuestion = function () {
        $scope.showDetails = false;
        $scope.allowToSave = false;
        $scope.allowToUpdate = false;
        $scope.tempQuestion = {};
        $scope.operatedQuestionIndex = null;
    };
    $scope.clearAll = function () {
        $scope.tempQuestion = angular.copy(emptyQuestion);
    };

        /*view*/
    $scope.allowToSave = false;
    $scope.allowToUpdate = false;
    function initializeQuestions() {
        questionsService.getQuestions().then(data => $scope.questions = data);
    }
});

app.controller('QuizController', ['$scope', 'questionsService', 'answersService', function ($scope, questionsService, answersService) {
    initializeQuestions();
    $scope.questions = [];
    $scope.currentQuestionId = 0;

    $scope.receivedAnswers = [];
    $scope.currentAnswers = {};
    let scoredPoints = 0;

    /*box view*/
    $scope.questionBox = true;
    $scope.resultBox = false;

    /*button view*/
    $scope.allowPrevious = function () { return $scope.currentQuestionId > 0; };
    $scope.allowResult = function () { return $scope.currentQuestionId === $scope.questions.length - 1; };
    $scope.allowNext = function () { return $scope.currentQuestionId < $scope.questions.length - 1; };

    /*question changes*/
    $scope.changeQuestion = function (id) {
        saveAnswers();
        setQuestion(id);
    };
    $scope.goForward = function () {
        saveAnswers();
        $scope.currentQuestionId += 1;
        setQuestion($scope.currentQuestionId);

    };
    $scope.goBack = function () {
        saveAnswers();
        $scope.currentQuestionId -= 1;
        setQuestion($scope.currentQuestionId);

    };
    $scope.showResults = function () {
        saveAnswers();
        changeBoxes();
        scoredPoints = answersService.compareAnswers($scope.questions,$scope.receivedAnswers );
    };
    $scope.insertPoints = function () {
        switch (scoredPoints) {
            case 0: return "You've failed"; break;
            case 1: return "You've earned 1 point"; break;
            default: return "You've scored " + scoredPoints + ' points'; break;
        }
    };
    
    /*services*/

    function saveAnswers() {
        $scope.receivedAnswers[$scope.currentQuestionId] = $scope.currentAnswers;
        console.log($scope.receivedAnswers);
    }
    function setQuestion(id) {
        $scope.currentQuestionId = id;
        if ($scope.receivedAnswers[$scope.currentQuestionId]) {
            $scope.currentAnswers = $scope.receivedAnswers[$scope.currentQuestionId];
        } else {
            $scope.currentAnswers = {};
        }
    }
    function changeBoxes() {
        $scope.questionBox = false;
        $scope.resultBox = true;
    }
    function initializeQuestions() {
        questionsService.getQuestions().then(data => $scope.questions = data);
    }
}]);