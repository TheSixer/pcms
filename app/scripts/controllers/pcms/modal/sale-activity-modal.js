'use strict';
/**
 * Created by huangcheng on 2017/2/9.
 */
/**
 * 潜客管理→客户跟进→销售机会
 * @ngdoc function
 * @name pcmsApp.controller:SaleActivityModalCtrl
 * @description
 * # SaleActivityModalCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('SaleActivityModalCtrl',
    function ($scope, $uibModalInstance, $uibModal, Util, REGEX, data) {
      $scope.activityData = {};
      if (data.activityData.activityId) {
        $scope.action = '编辑';
      } else {
        $scope.action = '新增';
      }
      $scope.codeMaster = data.codeMaster;
      $scope.activityData = data.activityData;
      // 页面错误信息
      $scope.alerts = [];
      // 正则表达式
      $scope.pattern = REGEX;
      // 确定
      $scope.returnData = function () {
        $uibModalInstance.close($scope.activityData);
      };

      // 确定
      $scope.ok = function () {
        $scope.activityData.isReturned = '0';
        $scope.returnData($scope.activityData);
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
