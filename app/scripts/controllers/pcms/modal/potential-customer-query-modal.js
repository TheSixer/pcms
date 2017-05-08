'use strict';

/**
 * 售后系统→理赔保养→服务活动车辆检查：定位
 * 徐毓卿
 * @ngdoc function
 * @name pcmsApp.controller:PotentialCustomerQueryModalCtrl
 * @description
 * # PotentialCustomerQueryModalCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('PotentialCustomerQueryModalCtrl',
    function ($scope, $uibModalInstance,$uibModal, Util, REGEX, data, localStorageService) {
      $scope.areaData = localStorageService.get('haimaArea');
      // 区域
      $scope.area = [];
      // 省
      $scope.province = [];
      $scope.provinceMode = true;
      // 市
      $scope.city = [];
      $scope.cityMode = true;
      for(var index in $scope.areaData) {
        $scope.area[index] = {};
        $scope.area[index].code = String($scope.areaData[index].id);
        $scope.area[index].value = $scope.areaData[index].name;
      }

      // 正则表达式
      $scope.pattern = REGEX;
      // 页面错误信息
      $scope.alerts = [];

      // 确定
      $scope.returnData = function () {
        $uibModalInstance.close($scope.filter);
      };

      // 确定
      $scope.ok = function () {
        $scope.returnData($scope.filter);
      };

      // 取消
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      //区域
      $scope.$watch('filter.area', function (newValue) {
        if(newValue) {
          $scope.province = [];
          $scope.provinceMode = false;
          for(var index in $scope.areaData) {
            if($scope.areaData[index].id == newValue) {
              for(var i in $scope.areaData[index].provinces) {
                $scope.province[i] = {};
                $scope.province[i].code = String($scope.areaData[index].provinces[i].id);
                $scope.province[i].value = $scope.areaData[index].provinces[i].name;
              }
              break;
            }
          }
        } else {
          $scope.provinceMode = true;
        }
      });

      //省份
      $scope.$watch('filter.province', function (newValue) {
        if(newValue) {
          $scope.city = [];
          $scope.cityMode = false;
          for(var index in $scope.areaData) {
            if($scope.areaData[index].id == $scope.filter.area) {
              for(var i in $scope.areaData[index].provinces) {
                if($scope.areaData[index].provinces[i].id == newValue) {
                  for(var j in $scope.areaData[index].provinces[i].cities) {
                    $scope.city[j] = {};
                    $scope.city[j].code = String($scope.areaData[index].provinces[i].cities[j].id);
                    $scope.city[j].value = $scope.areaData[index].provinces[i].cities[j].name;
                  }
                }
              }
            }
          }
        } else {
          $scope.city = [];
          $scope.cityMode = true;
        }
      });

      //加载数据
      var load = function () {
        $scope.codeMaster = data.codeMaster;
        $scope.filter = data.filter;
      };
      load();
    });
