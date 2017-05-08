'use strict';

/**
 * 登录
 * added by Lijie
 * @name pcmsApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('LoginCtrl',
    function($scope, $state, md5, userService, Util, LoginApi, loginData, $http) {

      var init = function() {
        $scope.username = '';
        $scope.password = '';
        $scope.error = '';
      };
      init();

      // 登录成功 保存用户信息
      $scope.saveInfo = function(result) {
        var currentUser = {};
        currentUser.access_token = result.access_token;
        currentUser.refresh_token = result.refresh_token;
        currentUser.username = $scope.username;
        currentUser.token_type = result.token_type;

        userService.set(currentUser);
      };

      // 登录
      $scope.login = function() {

        // encode
        // var passwordCode = md5.createHash($scope.password + 'mosaic');
        var data = {};
        loginData.grant_type = 'password'; //固定
        loginData.client_id = '11'; //固定
        loginData.username = $scope.username;
        loginData.password = $scope.password;
        $scope.promise = LoginApi.login(data, function(result) {
          if (result) {
            if (result.access_token) {
              $scope.saveInfo(result);
              // 设置请求头access_token
              $http.defaults.headers.common = { 'access_token' : result.access_token};
              $state.go('main.welcome');
            } else if (result.code) {
              Util.putSysMsg('danger', '用户名或密码错误');
            } else {
              Util.putSysMsg('danger', '用户名或密码错误');
            }
          }
        });
      };
    });
