'use strict';

angular.module('frankbilleApp').controller('FooterCtrl', function ($scope) {
  $scope.currentYear = new Date().getFullYear();
});
