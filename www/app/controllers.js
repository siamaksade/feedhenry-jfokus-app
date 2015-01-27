'use strict';

var myApp = angular.module('myApp.controllers', []);

var leadController = myApp.controller('LeadForm', function($scope, $q, QuestionService) {
      $scope.master = {};
      $scope.question = QuestionService.get();

      $scope.register = function(user) {
        var defer = $q.defer();
        var promise = defer.promise;

        promise.then(function(response){
          if (response.msg != null && typeof(response.msg) !== 'undefined' && response.status == 'success') {
            $scope.messages = 'Registered successully';
            $scope.messageClass = 'alert-success';
            $scope.user = {};
            $scope.leadForm.$setPristine();
            $scope.question = QuestionService.get();

          } else {
            $scope.messages  = "Error: expected a message from backend.";
            $scope.messageClass = 'alert-danger';
          }
        }, function(err){
          if (err == '') {
            $scope.messages = 'Error: failed to register due to technical errors';
          } else {
            $scope.messages = 'Error: ' + JSON.stringify(err);
          }

          $scope.messageClass = 'alert-danger';
        });


        $fh.cloud({
          "path": "/lead", //only the path part of the url, the host will be added automatically
          "method": "POST",   //all other HTTP methods are supported as well. e.g. HEAD, DELETE, OPTIONS
          "contentType": "application/json",
          "data": { 
              "name": user.name, 
              "email": user.email, 
              "company": user.company, 
              "job": user.job,
              "answer": user.answer
              }, //data to send to the server
          "timeout": 25000 // timeout value specified in milliseconds. Default: 60000 (60s)
        }, defer.resolve, defer.reject);
      };

      $scope.reset = function() {
        $scope.user = {};
        $scope.leadForm.$setPristine();
        $scope.question = QuestionService.get();
        $scope.messages = "";
      };
});
