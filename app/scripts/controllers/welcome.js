'use strict';

/**
 * @ngdoc function
 * @name pcmsApp.controller:WelcomeCtrl
 * @description
 * # WelcomeCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('WelcomeCtrl', ['$scope',
    function($scope) {

      //初始化页面RadioBox下拉框等
      var init = function() {
        $scope.expanders = [{
          title: '点我',
          text: 'Hi there folks, I am the content that was hidden but is now shown.'
        }, {
          title: 'Click this',
          text: 'I am even better text than you have seen previously'
        }, {
          title: 'Test',
          text: 'test'
        }];
      };
      init();

      //加载数据
      var load = function() {

      };
      load();
    }
  ])

.factory('WelcomeApi', ['API_END_POINT', 'sendRequest',
  function(API_END_POINT, sendRequest) {

    // 调用取数据的api
    var getData = function(data, callback) {
      var url = API_END_POINT.url + '/data';
      var method = 'get';

      return sendRequest.send(url, method, data, callback);
    };

    return {
      getData: getData
    };
  }
]);
