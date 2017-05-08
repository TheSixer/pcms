/**
 * Created by huangcheng on 2017/1/16.
 */
'use strict';

/**
 * 潜客管理→统计分析→销售顾问转化率
 *
 * @name pcmsApp.controller:SalesConsultantConversionRateCtrl
 * @description
 * #SalesConsultantConversionRateCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('SalesConsultantConversionRateCtrl',
    function($scope, SalesConsultantConversionRateEntity, Util) {
      var init = function () {
        $scope.filter = {};
        $scope.chartOptions = {};
        $scope.xdata = [];
        $scope.data = [];
        $scope.filter.bgnTim = new Date(moment().subtract(1, 'months'));
        $scope.filter.endTim = new Date();
      };

      init();

      var getData = function () {
        var data = angular.copy($scope.filter);
        data.beginTime = Util.formatDate(data.beginTime,'YYYY-MM-DD HH:mm:ss');
        data.endTime = Util.formatDate(data.endTime,'YYYY-MM-DD HH:mm:ss');
        $scope.promise = SalesConsultantConversionRateEntity.getAll(data, function (resp) {
          if(resp.data) {
            for (var index in resp.data) {
              $scope.xdata[index] = resp.data[index].salesId;
              $scope.data[index] = Util.toDecimal2(resp.data[index].orderCnt/resp.data[index].chanceCnt*100);
            }
          }
          // 指定图表的配置项和数据
          var option = {
            title: {
              text: '销售顾问转化率',
              x:'center'
            },
            color: ['#3398DB'],
            tooltip : {
              trigger: 'axis',         // 触发类型，可选为：'item(数据项图形触发)' | 'axis(坐标轴触发)'
              formatter: "{b}<br/>{a0} : {c0}%",
              axisPointer : {          // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true      // grid 区域是否包含坐标轴的刻度标签，默认为false
            },
            xAxis : [
              {
                type : 'category',    // 坐标轴类型
                data: $scope.xdata,
                axisTick: {   // 坐标轴刻度相关设置
                  alignWithLabel: true
                }
              }
            ],
            yAxis : [
              {
                type : 'value'
              }
            ],
            series : [  // 系列列表
              {
                name:'转化率',
                type:'bar',
                // barWidth: '60%',  // 柱条的宽度
                data: $scope.data // 柱条对应数据
              }
            ]
          };
          $scope.chartOptions.option = option;
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
