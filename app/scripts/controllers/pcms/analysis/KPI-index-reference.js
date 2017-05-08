/**
 * Created by huangcheng on 2017/1/16.
 */
'use strict';

/**
 * 潜客管理→统计分析→KPI指标参考
 *
 * @name pcmsApp.controller:KPIIndexReferenceEntity
 * @description
 * #KPIIndexReferenceEntity
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('KPIIndexReferenceCtrl',
    function($scope, Util, KPIIndexReferenceEntity) {

      var init = function () {
        $scope.filter = {};

        $scope.xAxisData = [];
        $scope.seriesData = [];

        // 地图
        $scope.chartOptions0 = {};
        // 销售实绩
        $scope.chartOptions1 = {};
        // 销售比率
        $scope.chartOptions2 = {};

        $scope.xAxis = [];
        $scope.yAxis1 = [];
        $scope.yAxis2 = [];

        $scope.data0 = [];
        $scope.data1 = [];
        $scope.data2 = [];

        $scope.filter.bgnTim = new Date(moment().subtract(1, 'months'));
        $scope.filter.endTim = new Date();
      }

      init();

      // 获取随机数
      var randomData = function () {
        return Math.round(Math.random()*100);
      }

      var getData = function () {
        var data = angular.copy($scope.filter);
        data.bgnTim = Util.formatDate(data.bgnTim,'YYYY-MM-DD');
        data.endTim = Util.formatDate(data.endTim,'YYYY-MM-DD');
        $scope.promise = KPIIndexReferenceEntity.getAll(data, function (resp) {
          if(resp.data) {
            for(var i in resp.data.kpiRefRptOfArea) {
              $scope.xAxis[i] = resp.data.kpiRefRptOfArea[i].areaName;
              $scope.yAxis1[i] = resp.data.kpiRefRptOfArea[i].sucCnt;
              $scope.yAxis2[i] = resp.data.kpiRefRptOfArea[i].sucRatio;
            }
            var num0 = 0,num1 = 0,num2 = 0;
            for(var j in resp.data.kpiRefRptOfProvince) {
              if(resp.data.kpiRefRptOfProvince[j].sucRatio < 0.5) {
                $scope.data0[num0] = {};
                $scope.data0[num0].name = resp.data.kpiRefRptOfProvince[j].provinceName;
                $scope.data0[num0].value = resp.data.kpiRefRptOfProvince[j].sucCnt;
                num0 ++;
              }
              if(resp.data.kpiRefRptOfProvince[j].sucRatio >= 0.5 && resp.data.kpiRefRptOfProvince[j].sucRatio < 1) {
                $scope.data1[num1] = {};
                $scope.data1[num1].name = resp.data.kpiRefRptOfProvince[j].provinceName;
                $scope.data1[num1].value = resp.data.kpiRefRptOfProvince[j].sucCnt;
                num1 ++;
              }
              if(resp.data.kpiRefRptOfProvince[j].sucRatio >= 1) {
                $scope.data2[num2] = {};
                $scope.data2[num2].name = resp.data.kpiRefRptOfProvince[j].provinceName;
                $scope.data2[num2].value = resp.data.kpiRefRptOfProvince[j].sucCnt;
                num2 ++;
              }
            }
            // 指定图表的配置项和数据
            var option0 = {};
            option0 = {
              title: {
                text: '代理店销售状况',
                left: 'center'
              },
              tooltip: {
                trigger: 'item',
              },
              legend: {
                orient: 'vertical',
                left: 'left',
                data: ['0%<=达成率<50%', '50%<=达成率<100%', '达成率>=100%']
              },
              visualMap: {
                min: 0,
                max: 10000,
                left: 'left',
                top: 'bottom',
                text: ['高', '低'],
                calculable: true
              },
              series: [
                {
                  name: '0%<=达成率<50%',
                  type: 'map',
                  mapType: 'china',
                  roam: false,
                  label: {
                    normal: {
                      show: true
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: $scope.data0
                },
                {
                  name: '50%<=达成率<100%',
                  type: 'map',
                  mapType: 'china',
                  label: {
                    normal: {
                      show: true
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: $scope.data1
                },
                {
                  name: '达成率>=100%',
                  type: 'map',
                  mapType: 'china',
                  label: {
                    normal: {
                      show: true
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: $scope.data2
                }
              ],
              color: ['#FC8909', '#22FF06', '#0100FF']
            };
            $scope.chartOptions0.option = option0;


            // 指定图表的配置项和数据
            var option1 = {};

            option1 = {
              title: {
                text: '销售实绩'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                // data:['预算','实际','去年实际']
                data: ['实际']
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
                  data: $scope.xAxis
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: '实际',
                  type: 'bar',
                  data: $scope.yAxis1
                },
              ],
              color: ['#0100C3', '#3E98BE', '	#9AC7FE']
            };
            $scope.chartOptions1.option = option1;


            // 指定图表的配置项和数据
            var option2 = {};

            option2 = {
              title: {
                text: '销售比率'
              },
              tooltip: {
                trigger: 'axis',
                // formatter: "{b}<br/>{a0} : {c0}<br/>{a1} : {c1}%",
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                // data:['预算比','去年比']
                data: ['比率']
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
                  data: $scope.xAxis
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: '比率',
                  type: 'bar',
                  data: $scope.yAxis2
                },
              ],
              color: ['#3E98BE', '#9AC7FE']
            };
            $scope.chartOptions2.option = option2;
          }
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
