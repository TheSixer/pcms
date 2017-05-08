'use strict';
/**
 * Created by huangcheng on 2017/1/17.
 */
/**
 * 潜客管理→系统管理→机会分配(总部)
 * @ngdoc function
 * @name pcmsApp.controller:PersonaModalCtrl
 * @description
 */
angular.module('pcmsApp')
  .controller('PersonaModalCtrl',
    function($scope, Util, codeMasterService, $uibModalInstance, data) {
      // 初始化
      var init = function() {

        $scope.customerData = {};
        $scope.modeView = true;
        // 取得编码表
        $scope.codeMaster = codeMasterService.get();
        $scope.customerData = data.customerData
        $scope.labels = data.customerData.tags;

        if('0'.equals($scope.customerData.sex)) {
          $scope.modeView = true;
        } else {
          $scope.modeView = false;
        }
      };

      init();

      // 确定
      $scope.ok = function() {

        $uibModalInstance.close('ok');
      };

      // 取消
      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

    });
