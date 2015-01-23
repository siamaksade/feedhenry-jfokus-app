'use strict';

var myApp = angular.module('myApp.controllers', ['fhcloud']);

myApp.controller('MainCtrl', function($scope, $q, fhcloud) {
    // add function to pass userInput to cloud via
    // $fh.cloud call to controller scope
    $scope.getNumberOfCharacters = function() {
      var userInput = $scope.userInput;

      //Notifying the user that the cloud endpoint is being called.
      $scope.noticeMessage = "Calling Cloud Endpoint";
      $scope.textClassName = "text-info";

      //Creating an AngularJS promise as the $fh.cloud function is asynchronous.
      var defer = $q.defer();

      var promise = defer.promise;

      //When the promise has completed, then the notice message can be updated to include result of the $fh.cloud call.
      promise.then(function(response){
        // If successful, display the length  of the string.
        if (response.msg != null && typeof(response.msg) !== 'undefined') {
          $scope.noticeMessage = response.msg;
          $scope.textClassName = "text-success";
        } else {
          $scope.noticeMessage  = "Error: Expected a message from $fh.cloud.";
          $scope.textClassName = "text-danger";
        }
      }, function(err){
        //If the function
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
      });

      // check if userInput is defined
      if (userInput) {
        /**
         * Pass the userInput to the module containing the $fh.cloud call.
         *
         * Notice that the defer.resolve and defer.reject functions are passed to the module.
         * One of these functions will be called when the $fh.cloud function has completed successully or encountered
         * an error.
         */
        fhcloud.cloud('hello', userInput, defer.resolve, defer.reject);
      }
    };
});


myApp.controller('SubmitForm', function($scope, $q, fhcloud) {
      $scope.master = {};

     $scope.update = function(user) {
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
          "data": { "name": user.name, "email": user.email, "company": user.company, "job": user.job}, //data to send to the server
          "timeout": 25000 // timeout value specified in milliseconds. Default: 60000 (60s)
        }, defer.resolve, defer.reject);
      };

      $scope.reset = function() {
        $scope.user = {};
      };

      $scope.reset();
});