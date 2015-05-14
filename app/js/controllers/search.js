'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
function SearchCtrl($stateParams, $location, $http, AppSettings, SearchService) {
    var vm = this;

    // Init statues if path is a search url
    angular.element(document).ready(function() {
        console.log($stateParams);
        console.log($stateParams.timezoneOffset);
         SearchService.initData($stateParams)
            .then(function(data) {
              vm.statuses = data.statuses;
            },
            function() {
              console.log('statuses init retrieval failed');
            });   
    });

    // Change stateParams on search
    function updatePath(term) {
      $location.search({
        q: encodeURIComponent(term), 
        timezoneOffset: (new Date()).getTimezoneOffset()
      });
    }

    // Update status and path on success search
    vm.update = function(term) {
        SearchService.getData(term)
            .then(function(data) {
               vm.statuses = data.statuses;
               updatePath(term);
            },
            function() {
             console.log('statuses retrieval failed.');
            });
    };


    

}

controllersModule.controller('SearchCtrl', SearchCtrl);