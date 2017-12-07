'use strict';

/**
 * @ngdoc overview
 * @name myRetailApp
 * @description
 * # myRetailApp
 *
 * Main module of the application.
 */
angular
  .module('myRetailApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'myRetailApp.itemCatalog'

  ])

  .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {

    $routeProvider.otherwise({redirectTo: '/itemCatalog'});
  }])

  .service('itemCatalogService', ['$http', function ($http) {
    //Load catalog data from JSON file
    this.getCatalogItemDataByIndex = function (itemIndex) {
      return $http.get('assets/item-data.json').then(function (response) {
        var requestedData = response.data.CatalogEntryView[itemIndex];
        if (requestedData) {
          return new Promise(function (resolve, reject) {
            return resolve(requestedData);
          });
        } else {
          return new Promise(function (resolve, reject) {
            return reject();
          });
        }
      });
    }
  }])
  .filter('html', ['$sce', function ($sce) {
    //Sanitize HTML content for display in view template
    return function (val) {
      return $sce.trustAsHtml(val);
    };
  }])
  .filter('customerReviewDate', function () {
    //Format date for display in customer review section
    return function (val) {
      var dateObject = new Date(val);
      return dateObject.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
    };
  });
