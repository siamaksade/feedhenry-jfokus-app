'use strict';

var myApp = angular.module('myApp.controllers', []);

var leadController = myApp.controller('LeadForm', function($scope, $q, $timeout, QuestionService) {
      $scope.master = {};
      $scope.question = QuestionService.get();

      $scope.register = function(user) {
        if ($scope.leadForm.$invalid) {
          if ($scope.leadForm.name.$invalid) {
            $scope.showError('Please enter a valid name.');
          } else if ($scope.leadForm.email.$invalid) {
            $scope.showError('Please enter a valid email.');
          } else if ($scope.leadForm.answer.$invalid) {
            $scope.showError('Please choose an answer for the quesiton.');
          }

          return;
        }

        var defer = $q.defer();
        var promise = defer.promise;

        promise.then(function(response){
          if (response.msg != null && typeof(response.msg) !== 'undefined' && response.status == 'success') {
            $scope.messages = 'Registered successully';
            $scope.messageClass = 'alert-success';
            $scope.messagesShow = true;
            $scope.user = {};
            $scope.leadForm.$setPristine();
            $scope.question = QuestionService.get();

            $timeout(function() {
              $scope.messagesShow = false;
            }, 5000);

          } else {
            $scope.messages  = "Error: expected a message from backend.";
            $scope.messageClass = 'alert-danger';
            $scope.messagesShow = true;
          }
        }, function(err){

          if (err == '') {
            $scope.showError('Error: failed to register due to technical errors');
          } else {
            $scope.showError('Error: ' + JSON.stringify(err));
          }
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
        $scope.messagesShow = false;
      };

      $scope.showError = function (msg) {
          $scope.messages = msg;
          $scope.messageClass = 'alert-danger';
          $scope.messagesShow = true;
      }
});
