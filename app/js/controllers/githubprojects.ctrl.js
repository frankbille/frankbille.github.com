'use strict';

angular.module('frankbilleApp').controller('GitHubProjectsCtrl', function ($scope, $http) {
  $http.jsonp('https://api.github.com/users/frankbille/repos?callback=JSON_CALLBACK', {responseType: 'json'})
    .success(function (data) {
      $scope.repos = data.data;
    });
});
