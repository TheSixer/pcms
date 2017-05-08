/**
 * Created by huangcheng on 2017/1/16.
 */
'use strict';

/**
 * 潜客管理→统计分析→客户来店时间
 *
 * @name pcmsApp.controller:CustomerComeCtrl
 * @description
 * #CustomerComeCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('CustomerComeCtrl',
    function($scope) {
      $scope.chartOptions = {};
      // 后台获取的数据
      $scope.data = [];

      // 指定图表的配置项和数据
      var option = {};

      option = {
        title : {
          text: '客户来店时间段汇总',
          x:'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top: 'middle',
          data: ['9:00-10:00','11:00-13:00','13:00-15:00','15:00-17:00','17点以后']
        },
        series : [
          {
            name: '访问人数',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
              {value:335, name:'9:00-10:00'},
              {value:310, name:'11:00-13:00'},
              {value:234, name:'13:00-15:00'},
              {value:135, name:'15:00-17:00'},
              {value:1548, name:'17点以后'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      $scope.chartOptions.option = option;
    });
