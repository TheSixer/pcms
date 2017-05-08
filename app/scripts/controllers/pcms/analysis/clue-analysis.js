/**
 * Created by huangcheng on 2017/1/16.
 */
'use strict';

/**
 * 潜客管理→统计分析→线索分析
 *
 * @name pcmsApp.controller:ClueAnalysisCtrl
 * @description
 * #ClueAnalysisCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('ClueAnalysisCtrl',
    function($scope, OPTION, ClueAnalysisEntity, Util) {

      var init = function () {
        $scope.filter = {};

        $scope.chartOptions = {};

        $scope.xdata = [];
        $scope.clueData = [];
        $scope.chanceData = [];

        $scope.filter.beginTime = new Date(moment().subtract(1, 'months'));
        $scope.filter.endTime = new Date();
      }

      init();

      var getData = function () {
        var data = angular.copy($scope.filter);
        data.beginTime = Util.formatDate(data.beginTime,'YYYY-MM-DD HH:mm:ss');
        data.endTime = Util.formatDate(data.endTime,'YYYY-MM-DD HH:mm:ss');
        $scope.promise = ClueAnalysisEntity.getAll(data, function (resp) {
          if(resp.data) {
            for (var index in resp.data) {
              $scope.xdata[index] = resp.data[index].name;
              $scope.clueData[index] = resp.data[index].clueCount;
              $scope.chanceData[index] = resp.data[index].chanceCount;
            }
          }

          OPTION.title.text = '销售线索汇总';
          OPTION.legend.data = ['线索','机会'];
          OPTION.xAxis[0].data = $scope.xdata;
          OPTION.series = [
            {
              name:'线索',
              type:'bar',
              data: $scope.clueData // 柱条对应数据
            },
            {
              name:'机会',
              type:'bar',
              data: $scope.chanceData // 柱条对应数据
            }
          ];

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
