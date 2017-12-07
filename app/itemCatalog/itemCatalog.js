'use strict';

angular.module('myRetailApp.itemCatalog', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/itemCatalog', {
      templateUrl: 'itemCatalog/itemCatalog.html',
      controller: 'ItemCatalogCtrl'
    });
  }])

  .controller('ItemCatalogCtrl', ['$scope', '$timeout', 'itemCatalogService', function ($scope, $timeout, itemCatalogService) {
    function fetchContent() {
      itemCatalogService.getCatalogItemDataByIndex(0)
        .then(function (response) {
          //Make catalog data available in local scope
          $scope.catalogItem = response;

          //Build carousel
          initializeCarouselData();
        })
        .catch(function (err) {
          //Show error message
          console.log("unable to fetch the content", err);
        });
    }

    function initializeCarouselData () {
      //Set up array of all images for carousel
      $scope.catalogItemImages = $scope.catalogItem.Images[0].AlternateImages;
      $scope.catalogItemImages.unshift($scope.catalogItem.Images[0].PrimaryImage[0]);

      initializeCarouselView();
    }

   function initializeCarouselView () {
      //Wait until DOM elements are rendered
      $timeout(function () {
        //Set properties for main image display management
        $scope.carouselCurrentIndex = 0;
        $scope.isCarouselImgTransitioning = false;

        //Measure carousel DOM elements
        $scope.carouselItemWidth = window.document.getElementsByClassName('carousel__nav-button')[0].offsetWidth;
        $scope.carouselNavInnerWidth = $scope.catalogItemImages.length * $scope.carouselItemWidth;
        $scope.carouselNavOuterWidth = window.document.getElementById('CarouselStripOuter').offsetWidth;

        //Set properties for carousel nav management
        $scope.carouselNavCurrentXPosition = 0;
        $scope.carouselNavMaxXPosition = $scope.carouselNavInnerWidth - $scope.carouselNavOuterWidth;
        $scope.carouselPreviousButtonEnabled = false;
        $scope.carouselNextButtonEnabled = true;

        updateCarouselNavStyles();
      }, 0);
    }

    function updateCarouselNavStyles () {
      //Apply style values to carousel nav
      $scope.carouselNavInnerStyle = {
        'width': $scope.carouselNavInnerWidth.toString() + 'px',
        'left': ($scope.carouselNavCurrentXPosition * -1).toString() + 'px'
      };

      updateCarouselNavEnabled();
    }

   function updateCarouselNavEnabled () {
      //Updated enabled status for previous and next carousel nav buttons
      if ($scope.carouselNavCurrentXPosition <= 0) {
        $scope.carouselPreviousButtonEnabled = false;
      } else {
        $scope.carouselPreviousButtonEnabled = true;
      }
      if ($scope.carouselNavCurrentXPosition >= $scope.carouselNavInnerWidth - $scope.carouselNavOuterWidth) {
        $scope.carouselNextButtonEnabled = false;
      } else {
        $scope.carouselNextButtonEnabled = true;
      }
    }

    $scope.onCarouselNextPrevButtonClick = function (isNext) {
      //Calculate new scroll position value
      if (isNext) {
        $scope.carouselNavCurrentXPosition += ($scope.carouselItemWidth * 3);
      } else {
        $scope.carouselNavCurrentXPosition -= ($scope.carouselItemWidth * 3);
      }
      $scope.carouselNavCurrentXPosition = Math.max(0, Math.min($scope.carouselNavCurrentXPosition, $scope.carouselNavInnerWidth - $scope.carouselNavOuterWidth));

      updateCarouselNavStyles();
    }

    $scope.onCarouselItemClick = function (itemIndex) {
      //Set transitioning state on main image to begin fade out
      $scope.isCarouselImgTransitioning = true;
      $timeout(function () {
        //Swap image and fade main image in
        $scope.carouselCurrentIndex = itemIndex;
        $scope.isCarouselImgTransitioning = false;
      }, 300);
    }

    fetchContent();
  }]);
