'use strict';
/**
 * Created by huangcheng on 2017/2/16.
 */
/**
 * 潜客管理(总部)→系统管理→机会级别设置
 * @ngdoc function
 * @name pcmsApp.controller:OpportunityLevelSettingModalCtrl
 * @description
 * # OpportunityLevelSettingModalCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('OpportunityLevelSettingModalCtrl',
    function ($scope, $uibModalInstance, Util, REGEX, codeMasterService, data) {
      $scope.codeMaster = data.codeMaster;
      $scope.ruleData = data.ruleData;
      // 取得编码表
      $scope.codeMaster = codeMasterService.get();
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
        $scope.ruleData.value = $scope.ruleData.key;
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
