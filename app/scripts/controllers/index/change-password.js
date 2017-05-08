'use strict';

/**
 * 修改密码
 * added by Lijie
 * @name pcmsApp.controller:ChangePasswordCtrl
 * @description
 * # ChangePasswordCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('ChangePasswordCtrl',
    function($scope, $uibModal, $uibModalInstance, $state, Util, MainApi, data) {

      var init = function() {
        // 前页面来的参数
        $scope.param = data;

        $scope.password = {};
        $scope.alerts = [];
      };
      init();

      // 修改密码
      $scope.changePassword = function() {
        // 新密码确认
        if($scope.password.new !== $scope.password.confirm) {
          Util.putMsg($scope.alerts, 'warning', '1109');
          return false;
        }

        var data = {
          old_pwd: $scope.password.old,
          new_pwd: $scope.password.new,
          r_pwd: $scope.password.confirm
        };

        $scope.promise = MainApi.changePassword(data, function(result) {
          if (result) {
            if (result.code === 0) {
              Util.putSysMsg('success', result.msg);
              // 跳转登录
              $state.go('login');
            } else {
              Util.putSysMsg('danger', result.msg);
            }
            $uibModalInstance.close($scope.plan);
          }
        });

      };

      // 取消
      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

    });
