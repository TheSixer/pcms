'use strict';
/**
 * Created by huangcheng on 2017/2/16.
 */
/**
 * 潜客管理(总部)→系统管理→分配规则管理
 * @ngdoc function
 * @name pcmsApp.controller:DividendRuleMngModalCtrl
 * @description
 * # DividendRuleMngModalCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('DividendRuleMngModalCtrl',
    function ($scope, $uibModalInstance, Util, REGEX, data) {
      $scope.codeMaster = data.codeMaster;
      $scope.ruleData = data.ruleData;
      // 页面错误信息
      $scope.alerts = [];
      // 正则表达式
      $scope.pattern = REGEX;
      // 确定
      $scope.returnData = function () {
        $uibModalInstance.close($scope.ruleData);
      };

      // 确定
      $scope.ok = function () {
        if('0'.equals($scope.ruleData.value)) {
          $scope.ruleData.key = 'average';
        } else if('1'.equals($scope.ruleData.value)) {
          $scope.ruleData.key = 'weighting';
        } else {
          $scope.ruleData.key = 'other';
        }
        $scope.ruleData.remark = $scope.ruleData.remark ? $scope.ruleData.remark : '';
        $scope.returnData($scope.ruleData);
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
