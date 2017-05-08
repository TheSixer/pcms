'use strict';
/**
 * Created by huangcheng on 2017/2/10.
 */
/**
 * 潜客管理→客户跟进→销售活动
 * @ngdoc function
 * @name pcmsApp.controller:SaleActivityCustomerTagModalCtrl
 * @description
 * # SaleActivityCustomerTagModalCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('SaleActivityCustomerTagModalCtrl',
    function ($scope, $uibModalInstance, $uibModal, Util, REGEX, saleActivityCustomerTagEntity, data) {
      $scope.codeMaster = data.codeMaster;
      $scope.customerData = {};
      $scope.customerData.customerName = data.activityData.customerName;
      // 页面错误信息
      $scope.alerts = [];
      // 正则表达式
      $scope.pattern = REGEX;
      //客户标签数据
      $scope.customerTags = [''];
      // 确定
      $scope.returnData = function () {
        $uibModalInstance.close($('#tags').val());
      };

      // 确定
      $scope.ok = function () {
        $scope.returnData($('#tags').val());
      };

      // 取消
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      // 标签点击事件
      $scope.tagClick = function (data) {
        var tagStr = $('#tags').val();
        if(tagStr.indexOf(data)<0) {
          $('#tags').tags(data);
        } else {
        }
      };

      //加载数据
      var load = function () {
        $(function(){
          for(var i=0; i<$scope.customerTags.length; i++) {
            $('#tags').tags($scope.customerTags[i]);
          }
        });
      };
      console.log($('#tags').val());
      load();
    });
