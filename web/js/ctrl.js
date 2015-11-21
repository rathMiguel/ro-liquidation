angular.module('myApp', [])
	.controller('myController', ['$scope', function ($scope) {
		$scope.member = 2;
		$scope.money = 0;
	}])