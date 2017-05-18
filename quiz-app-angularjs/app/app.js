/**
 * Created by INNA on 12.04.2017.
 */

    let app = angular.module('quizApp', ['ngRoute']);
    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/admin',
                {
                    controller: 'AdminPanelController',
                    templateUrl: 'app/partials/admin-panel.html'
                })
            .when('/quiz',
                {

                    templateUrl: 'app/partials/quiz.html',
                    controller: 'QuizController',
                })
            .otherwise({redirectTo: '/admin'})
    }]);