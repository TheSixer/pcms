/**
 * Created by huangcheng on 2017/1/16.
 */
'use strict';

/**
 * 潜客管理→统计分析→潜客意见
 *
 * @name pcmsApp.controller:CustomerCommentCtrl
 * @description
 * #CustomerCommentCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('CustomerCommentCtrl',
    function($scope) {
      $scope.chartOptions = {};
      // 后台获取的数据
      $scope.data = [];

      // 指定图表的配置项和数据
      var option = {};

      option = {
        title: {
          text: '潜客回访问题客户--潜客意见反馈汇总'
        },
        tooltip : {
          trigger: 'axis',
          // formatter: "{b}<br/>{a0} : {c0}<br/>{a1} : {c1}%",
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data:['二次进店客户汇总']
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
            data: ['销售顾问专业水平','店内服务','试驾车','便利性','环境','其他']
          }
        ],
        yAxis: [
          {
            type : 'value'
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            data: [11,12,19,3,10,1]
          },
        ],
        color: ['#406DAD','#7A2A2C']
      };

      $scope.chartOptions.option = option;

    });
