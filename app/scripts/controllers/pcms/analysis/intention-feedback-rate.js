'use strict';

/**
 * 潜客管理→统计分析→意向跟进反馈分析
 * create by Lijie 2017/1/10
 *
 * @name pcmsApp.controller:IntentionFeedbackRateCtrl
 * @description
 * #IntentionFeedbackRateCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('IntentionFeedbackRateCtrl',
    function($scope, PAGE_CONST, REGEX, Util, CommonModalSearch, codeMasterService) {

      //初始化页面
      var init = function() {
        // 正则表达式
        $scope.pattern = REGEX;

        // 取得编码表
        $scope.codeMaster = codeMasterService.get('activityType');

        $scope.testData = [];

        for (var i = 0; i < 150; i++) {
          var obj = {};
          obj.no = i + 1;
          obj.province = '湖北省';
          obj.city = '武汉';
          obj.storeNm = '武汉建银欣马';
          obj.trackFeedbackRateNm = (i + 3)*3 - 7;
          obj.auditNum = (i + 3)*3 - 6;
          obj.trackFeedbackRate = 99.00;

          $scope.testData.push(obj);

        }

        // 数据取得
        var getData = function() {

          // 格式化数据
          $scope.formatData($scope.testData, $scope.backendPage, $scope.numPerGet);

          // 取得当前页面数据
          $scope.grid.rows = Util.getCurrentPageData($scope.grid.data, $scope.currentPage, $scope.backendPage, $scope.numPerPage, $scope.numPerGet);

          // 总行数
          $scope.totalItems = $scope.testData.length;
        };

        // 载入模板的参数
        var param = {
          getData: getData
        };

        // 引入通用模板
        angular.extend($scope, new CommonModalSearch(param));

      };
      init();

      $scope.query();

    });
