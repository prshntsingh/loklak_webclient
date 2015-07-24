'use strict';
/* jshint unused:false */

var controllersModule = require('./_index');


controllersModule.controller('DataConnectCtrl', ['$scope', 'SearchService', 'PushService', 'SourceTypeService',
	function($scope, SearchService, PushService, SourceTypeService) {

	$scope.navItems = [
		{
			'title' : 'Data Source',
			'icon' : 'fa fa-database',
			'target' : 'data-source-tab'
		},
		{
			'title' : 'Email, Contact and Calendar',
			'icon' : 'fa fa-users',
			'target' : 'contact-tab'
		},
		{
			'title' : 'Internet of Things',
			'icon' : 'fa fa-share-alt',
			'target' : 'iot-tab'
		}
	];
	$scope.dataSourceItems = [];
	/**
	 * Add data source form inputs values, success & error message
	 */
	$scope.addForm = {};
	/**
	 * Add datasource form show state
	 */
	$scope.addFormOpen = false;

	$scope.sourceTypesList = SourceTypeService.sourceTypeList;

	$scope.mapRulesNum = 0;

	function getDataSources() {
		SearchService.getImportProfiles("FOSSASIA_API").then(function(data) {
			var profiles = data.profiles;
			profiles.forEach(function(profile) {
				$scope.dataSourceItems.push(profile);
			});
		}, function() {});
	}

	$scope.confirmAddDataSource = function() {

		function constructMapRules() {
			var mapRulesStr = '';
			const mapRules = $scope.addForm.inputs.mapRules;
			var prefix = '';
			if (!mapRules) return '';
			for (var i = 0; i < $scope.mapRulesNum; i++) {
				if (mapRules[i] && mapRules[i][0] !== '' && mapRules[i][1] !=='') {
					mapRulesStr += prefix + mapRules[i][0] + ':' + mapRules[i][1];
					prefix = ',';
				}
			}
			return mapRulesStr;
		}
		
		PushService.pushGeoJsonData($scope.addForm.inputs.url, $scope.addForm.inputs.type, constructMapRules()).then(function(data) {
			$scope.addForm.error = '';
			$scope.addForm.success = data.known + ' source(s) known, ' + data['new'] + ' new source(s) added';
		}, function(err, status) {
			$scope.addForm.success = '';
			$scope.addForm.error = 'Add new source failed. Please verify link avaibility & data format.';
		});
	};

	$scope.toggleAddForm = function() {
		$scope.addFormOpen = !$scope.addFormOpen;
	};

	$scope.addMapRule = function() {
		$scope.mapRulesNum++;
	};

	$scope.removeMapRule = function() {
		$scope.mapRulesNum--;
	};

	$scope.getMapRulesNum = function() {
		return new Array($scope.mapRulesNum);
	};

	getDataSources();
}]);
