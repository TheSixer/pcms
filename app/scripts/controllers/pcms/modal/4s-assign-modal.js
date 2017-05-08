'use strict';
/**
 * Created by huangcheng on 2017/1/17.
 */
/**
 * 潜客管理→系统管理→机会分配(总部)
 * @ngdoc function
 * @name pcmsApp.controller:City4SAssignModalCtrl
 * @description
 * # City4SAssignModalCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('City4SAssignModalCtrl',
    function ($scope, Util, codeMasterService, $uibModalInstance, localStorageService, getDealer, TICKET) {
      // 初始化
      var init = function () {

        $scope.filter = {};
        // 取得编码表
        $scope.codeMaster = codeMasterService.get();

        $scope.areaData = localStorageService.get('haimaArea');
        // 区域
        $scope.area = [];
        // 省
        $scope.province = [];
        $scope.provinceMode = true;
        // 市
        $scope.city = [];
        $scope.cityMode = true;
        // 经销商
        $scope.dealer = [];
        $scope.dealerMode = true;
        for(var index in $scope.areaData) {
          $scope.area[index] = {};
          $scope.area[index].code = $scope.areaData[index].id;
          $scope.area[index].value = $scope.areaData[index].name;
        }
      };

      init();

      // 确定
      $scope.ok = function() {

        $uibModalInstance.close($scope.filter.dealer);
      };

      // 取消
      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

      //区域
      $scope.$watch('filter.area', function (newValue) {
        if(newValue) {
          $scope.province = [];
          $scope.provinceMode = false;
          for(var index in $scope.areaData) {
            if($scope.areaData[index].id === newValue) {
              for(var i in $scope.areaData[index].provinces) {
                $scope.province[i] = {};
                $scope.province[i].code = $scope.areaData[index].provinces[i].id;
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
            if($scope.areaData[index].id === $scope.filter.area) {
              for(var i in $scope.areaData[index].provinces) {
                if($scope.areaData[index].provinces[i].id === newValue) {
                  for(var j in $scope.areaData[index].provinces[i].cities) {
                    $scope.city[j] = {};
                    $scope.city[j].code = $scope.areaData[index].provinces[i].cities[j].id;
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

      $scope.$watch('filter.city', function (newValue) {
        if(newValue) {
          getDealer.getAll({
            // act: 'search_department',
            ticket: TICKET,
            search: [{areaid: $scope.filter.area, provinceid: $scope.filter.province, cityid: newValue}]
          }, function (resp) {
            if (newValue) {
              $scope.dealer = [];
              $scope.dealerMode = false;
              for (var index in resp[0]) {
                $scope.dealer[index] = {};
                $scope.dealer[index].code = resp[0][index].id;
                $scope.dealer[index].value = resp[0][index].dept_name;
              }
            } else {
              $scope.dealerMode = true;
            }
          });
        }
      });

    });
