'use strict';

var myApp = angular.module('myApp', ['ngRoute',
    'ngSanitize',
    "ngAnimate",
    'myApp.controllers',
    'myApp.directives',
    'myApp.services',
    'myApp.filters',
    'snap',
    "mobile-angular-ui"
]);

myApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'LeadForm',
            resolve: {
                question: function($q, QuestionService) {
                    return QuestionService.load();
                }
            }
        })
});