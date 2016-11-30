// notes
(function(angular) {
    'use strict';

    let theModule = angular.module("notesView", []);

	theModule.controller("notesViewController", ["$scope", "$window", "$http",
		function($scope, $window, $http) {
			$scope.notes = [];
			$scope.newNote = createBlankNotes();
			$scope.radioModel = 'Middle';
			let urlParts = $window.location.pathname.split("/");
			let categoryName = urlParts[urlParts.length - 1];

			let notesUrl = "/api/notes/" + categoryName;
			$http.get(notesUrl)
				.then(function(result) {
					//success
					$scope.notes = result.data;
				}, function(err) {
					// Error
					// TODO
				});

			let socket = io.connect();
			//socket.on("showThis", (msg) => {
			//	alert(msg);
			//});

			socket.emit("join category", categoryName);
			socket.on("broadcast note", (note) => {
				$scope.notes.push(note);
				$scope.$apply();
			});

			$scope.save = function() {
				$http.post(notesUrl, $scope.newNote)
					.then(function(result) {
						//success
						$scope.notes.push(result.data);
						$scope.newNote = createBlankNotes();
						socket.emit("newNote", { category: categoryName, note: result.data });
					}, function(err) {
						// Error
						// TODO
					});
			};

			function createBlankNotes() {
				return {
					note: "",
					color: "yellow"
				};
			}

	}]);

}(window.angular));