'use strict';
/**
 * Created by huangcheng on 2017/2/7.
 */
/**
 * 潜客管理→线索管理→线索管理
 * @ngdoc function
 * @name pcmsApp.controller:ClueManageModalCtrl
 * @description
 * # ClueManageModalCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('ClueManageModalCtrl',
    function ($scope, $uibModalInstance, $uibModal, Util, REGEX, data) {
      $scope.codeMaster = data.codeMaster;
      $scope.clueData = data.clueData;
      // 页面错误信息
      $scope.alerts = [];
      // 正则表达式
      $scope.pattern = REGEX;
      // 确定
      $scope.returnData = function () {
        $uibModalInstance.close($scope.clueData);
      };

      // 确定
      $scope.ok = function () {
        $scope.returnData($scope.clueData);
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
