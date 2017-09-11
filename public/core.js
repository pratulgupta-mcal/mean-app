var mcalworkitem = angular.module('mcalworkitem', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all workitems and show them
	$scope.initialize = function() {
		$http.get('/api/workitems')
			.success(function(data) {
				$scope.workitems = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// when submitting the add form, send the text to the node API
	$scope.createWorkItem = function() {
		$http.post('/api/workitems', $scope.formData)
			.success(function(data) {
				$('input').val('');
				$scope.workitems = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a workitem after checking it
	$scope.deleteWorkItem = function(id) {
		$http.delete('/api/workitems/' + id)
			.success(function(data) {
				$scope.workitems = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}