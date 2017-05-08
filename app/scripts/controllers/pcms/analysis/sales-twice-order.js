/**
 * Created by huangcheng on 2017/1/16.
 */
'use strict';

/**
 * 潜客管理→统计分析→销售顾问二次订单
 *
 * @name pcmsApp.controller:SalesTwiceOrderCtrl
 * @description
 * #SalesTwiceOrderCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('SalesTwiceOrderCtrl',
    function($scope) {
      $scope.chartOptions = {};
      // 后台获取的数据
      $scope.data = [];

      // 指定图表的配置项和数据
      var option = {};

      option = {
        title: {
          text: '销售顾问二次进店客户转让订单汇总'
        },
        tooltip : {
          trigger: 'axis',
          // formatter: "{b}<br/>{a0} : {c0}<br/>{a1} : {c1}%",
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data:['二次进店客户汇总','订单']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['贾明','王月圆','都辉','李磊','薛奇']
          }
        ],
        yAxis: [
          {
            type : 'value'
          }
        ],
        series: [
          {
            name: '二次进店客户汇总',
            type: 'bar',
            data: [11,12,19,3,10]
          },
          {
            name: '订单',
            type: 'bar',
            data: [2,8,9,3,6]
          }
        ],
        color: ['#406DAD','#7A2A2C']
      };

      $scope.chartOptions.option = option;

    });
