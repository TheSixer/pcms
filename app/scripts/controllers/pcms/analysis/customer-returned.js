/**
 * Created by huangcheng on 2017/1/16.
 */
'use strict';

/**
 * 潜客管理→统计分析→二次进店客户量
 *
 * @name pcmsApp.controller:CustomerReturnedCtrl
 * @description
 * #CustomerReturnedCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('CustomerReturnedCtrl',
    function($scope) {
      $scope.chartOptions = {};
      // 后台获取的数据
      $scope.data = [];

      // 指定图表的配置项和数据
      var option = {};

      option = {
        title : {
          text: '客户信息来源汇总'
        },
        tooltip : {
          trigger: 'axis',
          formatter: "{b}<br/>{a0} : {c0}<br/>{a1} : {c1}%",
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data:['数量','占比']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : ['网络','市场活动','亲友推荐','114/10086','路过展厅','报纸杂志','电视','电台','户外广告','短信','其他']
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:'数量',
            type:'bar',
            data:[205,123,19,3,301,23,12,23,76,6,35]
          },
          {
            name: '占比',
            type: 'bar',
            data: [25.1,15.1,2.3,0.4,36.8,2.8,1.5,2.8,8.2,0.7,4.3]
          }
        ],
        color: ['#406DAD','#7A2A2C']
      };

      $scope.chartOptions.option = option;

    });
