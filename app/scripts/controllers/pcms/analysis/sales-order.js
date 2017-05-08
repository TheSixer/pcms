/**
 * Created by huangcheng on 2017/1/16.
 */
'use strict';

/**
 * 潜客管理→统计分析→销售顾问订单
 *
 * @name pcmsApp.controller:SalesOrderCtrl
 * @description
 * #SalesOrderCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('SalesOrderCtrl',
    function($scope, OPTION, SalesOrderEntity, Util) {
      var init = function () {
        $scope.filter = {};
        $scope.chartOptions = {};
        $scope.xdata = [];
        $scope.firstData = [];
        $scope.secondData = [];
        $scope.total = [];
        $scope.filter.beginTime = new Date(moment().subtract(1, 'months'));
        $scope.filter.endTime = new Date();
      };

      init();

      var getData = function () {
        var data = angular.copy($scope.filter);
        data.beginTime = Util.formatDate(data.beginTime,'YYYY-MM-DD HH:mm:ss');
        data.endTime = Util.formatDate(data.endTime,'YYYY-MM-DD HH:mm:ss');
        $scope.promise = SalesOrderEntity.getAll(data, function (resp) {
          if(resp.data) {
            for (var index in resp.data) {
              $scope.xdata[index] = resp.data[index].salesName;
              $scope.firstData[index] = resp.data[index].chanceCount;
              $scope.secondData[index] = resp.data[index].successCount;
              $scope.total[index] = resp.data[index].ratio;
            }
          }

          OPTION.title.text = '销售顾问订单汇总';
          OPTION.legend.data = ['机会数','成功数','比率'];
          OPTION.xAxis[0].data = $scope.xdata;
          OPTION.series = [
            {
              name: '机会数',
              type: 'bar',
              data: $scope.firstData
            },
            {
              name: '成功数',
              type: 'bar',
              data: $scope.secondData
            },
            {
              name: '比率',
              type: 'bar',
              data: $scope.total
            }
          ];
          OPTION.color = ['#406DAD','#7A2A2C'];

          $scope.chartOptions.option = OPTION;
        });
      };

      $scope.searchBtnEvent = function () {
        load();
      };

      var load = function () {
        getData();
      };

      load();
    });
