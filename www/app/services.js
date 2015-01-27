'use strict';

var myApp = angular.module('myApp.services', []);

myApp.factory("QuestionService", function($q) {
    return { 
    	_questions: [],

    	load: function() {
    		var self = this;
            var defer = $q.defer();
            $fh.cloud({
                "path": "/question/all",
                "method": "GET",
                "contentType": "application/json",
                "data": {},
                "timeout": 25000
            }, function(res) {
                self._questions = res;
                defer.resolve(res);
            }, function(msg,err) {
                defer.reject(err);
            });

            return defer.promise;
    	},

    	get: function() {
    		var i = Math.floor(Math.random() * (this._questions.length + 1 )); // pick random
    		return this._questions.length == 0 ? undefined : this._questions[i];
    	}
    }
});