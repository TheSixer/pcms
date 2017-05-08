'use strict';
/**
 * Created by huangcheng on 2017/2/16.
 */
/**
 * 潜客管理(总部)→系统管理→导入接口管理
 * @ngdoc function
 * @name pcmsApp.controller:ImportIfMngModalCtrl
 * @description
 * # ImportIfMngModalCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('ImportIfMngModalCtrl',
    function ($scope, $uibModalInstance, Util, REGEX, data) {
      $scope.codeMaster = data.codeMaster;
      if('1'.equals(data.IfData.isEnabled)) {
        data.IfData.isEnable = true;
      } else {
        data.IfData.isEnable = false;
      }
      $scope.IfData = data.IfData;
      // 页面错误信息
      $scope.alerts = [];
      // 正则表达式
      $scope.pattern = REGEX;
      // 确定
      $scope.returnData = function () {
        $uibModalInstance.close($scope.IfData);
      };

      // 确定
      $scope.ok = function () {
        $scope.returnData($scope.IfData);
      };

      // 取消
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      //加载数据
      var load = function () {

      };
      load();
    });
