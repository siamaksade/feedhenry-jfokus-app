'use strict';

var myApp = angular.module('myApp.controllers', []);

myApp.controller('SubmitForm', function($scope, $q) {
      $scope.master = {};

      // get the question
      $fh.cloud({
        "path": "/question",
        "method": "GET",
        "contentType": "application/json",
        "data": {},
        "timeout": 25000
      }, function(res) {
        console.log(res);
        $scope.question = res;
      }, function(msg,err) {
        console.log(err)
      });

      $scope.update = function(user) {
        console.log(user);

        var defer = $q.defer();
        var promise = defer.promise;

        promise.then(function(response){
          if (response.msg != null && typeof(response.msg) !== 'undefined' && response.status == 'success') {
            $scope.messages = 'Registered successully';
            $scope.messageClass = 'alert-success';
            $scope.user = {};

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
      };

      $scope.reset();
});