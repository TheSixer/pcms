/**
 * Created by huangcheng on 2017/1/16.
 */
'use strict';

/**
 * 潜客管理→统计分析→车型分析
 *
 * @name pcmsApp.controller:CarModelCtrl
 * @description
 * #CarModelCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('CarModelCtrl',
    function($scope, OPTION, CarModelEntity, TOKEN_NAME) {

      var init = function () {
        $scope.xData = [];
        $scope.seriesData = {};
        $scope.seriesData.first = [];
        $scope.seriesData.second = [];
        $scope.seriesData.third = [];
        $scope.seriesData.fourth = [];
        $scope.chartOptions = {};
        var data = {};
        // data.ticket = TOKEN_NAME;
        $scope.promise = CarModelEntity.getAll(data, function (resp) {
          if(resp.data) {
            for(var index in resp.data) {

              if($scope.xData.length) {
                var flag = true;
                for(var n in $scope.xData) {
                  if($scope.xData[n] === resp.data[index].intentionModel) {
                    flag = false;
                  }
                }
                if(flag) {
                  $scope.xData[$scope.xData.length] = resp.data[index].intentionModel;
                }
              } else {
                $scope.xData[$scope.xData.length] = resp.data[index].intentionModel;
              }
            }
            var j = 0;
            for(var z in $scope.xData) {
              for (var i in resp.data) {
                if ($scope.xData[z] === resp.data[i].intentionModel) {
                  if ('0'.equals(resp.data[i].modelAttention)) {
                    $scope.seriesData.first[j] = resp.data[i].count;
                  }
                  if ('1'.equals(resp.data[i].modelAttention)) {
                    $scope.seriesData.second[j] = resp.data[i].count;
                  }
                  if ('2'.equals(resp.data[i].modelAttention)) {
                    $scope.seriesData.third[j] = resp.data[i].count;
                  }
                  if ('3'.equals(resp.data[i].modelAttention)) {
                    $scope.seriesData.fourth[j] = resp.data[i].count;
                  }
                }
              }
              j++;
            }
          }

          OPTION.title.text = '各车型冷热程度汇总';
          OPTION.legend.data = ['不感兴趣', '冷淡', '热情', '迫切'];
          OPTION.xAxis[0].data = $scope.xData;
          OPTION.series = [
            {
              name: '迫切',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: ''
                }
              },
              data: $scope.seriesData.first
            },
            {
              name: '热情',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: ''
                }
              },
              data: $scope.seriesData.second
            },
            {
              name: '冷淡',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: ''
                }
              },
              data: $scope.seriesData.third
            },
            {
              name: '不感兴趣',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: ''
                }
              },
              data: $scope.seriesData.fourth
            }
          ];

          $scope.chartOptions.option = OPTION;
        });
      };

      init();

    });
