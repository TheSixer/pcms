/**
 * Created by huangcheng on 2017/1/16.
 */
'use strict';

/**
 * 潜客管理→统计分析→交车汇总
 *
 * @name pcmsApp.controller:SalesCrossCarSummaryCtrl
 * @description
 * #SalesCrossCarSummaryCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('SalesCrossCarSummaryCtrl',
    function($scope) {
      $scope.chartOptions = {};
      // 后台获取的数据
      $scope.data = [39, 40, 20, 15, 39];
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '销售顾问交车汇总',
          x:'center'
        },
        color: ['#3398DB'],
        tooltip : {
          trigger: 'axis',         // 触发类型，可选为：'item(数据项图形触发)' | 'axis(坐标轴触发)'
          // formatter: "{b}<br/>{a0} : {c0}%",
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
            data: ['贾明','王月圆','都辉','李磊','薛奇'],
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
            name:'交车',
            type:'bar',
            barWidth: '60%',  // 柱条的宽度
            data: $scope.data // 柱条对应数据
          }
        ]
      };

      $scope.chartOptions.option = option;

    });
