'use strict';
/**
 * Created by huangcheng on 2017/1/23.
 */
/**
 * 潜客管理→系统管理→导入频次管理
 * @ngdoc function
 * @name pcmsApp.controller:ImportTimesModalCtrl
 * @description
 * # ImportTimesModalCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('ImportTimesModalCtrl',
    function ($scope, Util, codeMasterService, $uibModalInstance) {
      // 初始化
      var init = function () {

        $scope.frequency = {};
        // 取得编码表
        $scope.codeMaster = codeMasterService.get();

        $scope.miniuteMode = true;
        $scope.miniuteDMode = true;

        $scope.hourMode = true;
        $scope.hourDMode = true;

        $scope.dayMode = true;
        $scope.dayDMode = true;

        $scope.weekendMode = true;
        $scope.weekendDMode = true;

        $scope.monthMode = true;
        $scope.monthDMode = true;
      };

      init();

      // 确定
      $scope.ok = function() {

        $uibModalInstance.close($scope.plan);
      };

      // 取消
      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.$watch('frequency.useMiniute', function (newValue) {
        if(newValue) {
          $scope.miniuteMode = false;
          $scope.miniuteDMode = false;
        } else {
          $scope.miniuteMode = true;
          $scope.miniuteDMode = true;
        }
      });
      $scope.changeMiniuteSelect = function (value) {
        if(value) {
          $scope.miniuteDMode = false;
        } else {
          $scope.miniuteDMode = true;
        }
      };

      $scope.$watch('frequency.useHour', function (newValue) {
        if(newValue) {
          $scope.hourMode = false;
          $scope.hourDMode = false;
        } else {
          $scope.hourMode = true;
          $scope.hourDMode = true;
        }
      });
      $scope.changeHourSelect = function (value) {
        if(value) {
          $scope.hourDMode = false;
        } else {
          $scope.hourDMode = true;
        }
      };

      $scope.$watch('frequency.useDay', function (newValue) {
        if(newValue) {
          $scope.dayMode = false;
          $scope.dayDMode = false;
        } else {
          $scope.dayMode = true;
          $scope.dayDMode = true;
        }
      });
      $scope.changeDaySelect = function (value) {
        if(value) {
          $scope.dayDMode = false;
        } else {
          $scope.dayDMode = true;
        }
      };

      $scope.$watch('frequency.useWeekend', function (newValue) {
        if(newValue) {
          $scope.weekendMode = false;
          $scope.weekendDMode = false;
        } else {
          $scope.weekendMode = true;
          $scope.weekendDMode = true;
        }
      });
      $scope.changeWeekendSelect = function (value) {
        if(value) {
          $scope.weekendDMode = false;
        } else {
          $scope.weekendDMode = true;
        }
      };

      $scope.$watch('frequency.useMonth', function (newValue) {
        if(newValue) {
          $scope.monthMode = false;
          $scope.monthDMode = false;
        } else {
          $scope.monthMode = true;
          $scope.monthDMode = true;
        }
      });
      $scope.changeMonthSelect = function (value) {
        if(value) {
          $scope.monthDMode = false;
        } else {
          $scope.monthDMode = true;
        }
      };

    });
