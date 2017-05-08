/**
 * Created by huangcheng on 2017/2/28.
 */
'use strict';
/**
 * 潜客管理(总部)→系统管理→清洗规则管理
 * @ngdoc function
 * @name pcmsApp.controller:WashRuleMngModalCtrl
 * @description
 * # WashRuleMngModalCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('WashRuleMngModalCtrl',
    function ($scope, $uibModalInstance, Util, REGEX, data) {
      $scope.viewMode = true;
      if(data.ruleData.nam === '默认值规则') {
        data.ruleData.nam = '0';
      }
      if(data.ruleData.nam === '必填规则') {
        data.ruleData.nam = '1';
      }
      if(data.ruleData.nam === '重复规则') {
        data.ruleData.nam = '2';
      }
      $scope.ruleData = data.ruleData;
      $scope.codeMaster = data.codeMaster;
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
        $scope.ruleData.remark = $scope.ruleData.remark ? $scope.ruleData.remark : '';
        if($scope.ruleData.nam === '0') {
          $scope.ruleData.nam = 'default';
        }
        if($scope.ruleData.nam === '1') {
          $scope.ruleData.nam = 'required';
        }
        if($scope.ruleData.nam === '2') {
          $scope.ruleData.nam = 'duplicate';
        }
        $scope.returnData($scope.ruleData);
      };

      // 取消
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.$watch('ruleData.nam', function (newValue) {
        if('0'.equals(newValue)) {
          $scope.viewMode = false;
        } else {
          $scope.viewMode = true;
        }
      });
      //加载数据
      var load = function () {

      };
      load();
    });
