app.service('questionsService', ['$http', function ($http) {

    this.getQuestions = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/questions'
        }).then(successCallback, errorCallback);
    };

    this.addQuestion = function (item) {
        return $http({
            method: 'POST',
            url: 'http://localhost:8080/questions',
            data: item
        }).then(function (data) {
            console.log(data);
            return data.data;
        });
    };

    this.deleteQuestion = function (item) {
        return $http({
            method: 'DELETE',
            url: 'http://localhost:8080/questions/' + item.id
        }).then(data => { return 'success' });
    };
    this.updateQuestion = function (item) {
        return $http({
            method: 'PUT',
            url: 'http://localhost:8080/questions/' + item.id,
            data: item
        }).then(data => { return data.data });
    };

    function successCallback(data) { return data.data; }
    function errorCallback(error) { $log(error); $scope.questions = []; }


}]);