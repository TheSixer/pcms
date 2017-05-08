'use strict';

/**
 * 潜客管理→线索管理(总部)→线索审核
 * create by wenfeng 2017/1/11
 *
 * @name pcmsApp.controller:ClueAuditCtrl
 * @description
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('ClueAuditCtrl',
    function($scope, PAGE_CONST, REGEX, Util, CommonModalSearch, codeMasterService) {

      //初始化页面
      var init = function() {
        // 正则表达式
        $scope.pattern = REGEX;

        // 取得编码表
        $scope.codeMaster = codeMasterService.get('clueType,clueStatus');

        $scope.testData = [];
        for (var i = 0; i < 150; i++) {
          var obj = {};
          obj.no = i + 1;
          obj.clueNo = i + 10000;
          obj.province = '湖北省';
          obj.storeNm = '武汉建银欣马';
          obj.city = "武汉市";
          obj.customerNm = '黄晓辉';
          obj.mobilePhone = '13333334444';
          obj.activityNm = '车秒贷';
          obj.activityType = '车秒贷';
          obj.track = '客户不买了';
          obj.trackDate = moment().format('YYYY-MM-DD');
          obj.status = '战败';
          obj.donenNb = "10";
          obj.followNb = "50";
          obj.pendingNb = "20";
          obj.orderNb = "20";
          obj.auditNb = "30";
          obj.closeNb = "100%";
          obj.clueID = "9527";
          obj.clueGenre = "订单线索";
          obj.clueTerrace = "天猫商城";
          obj.clueStatus = "未审核";
          obj.clueLevel = "A级别";
          obj.clueSex = "男";
          obj.clueArea = "华中区";
          obj.clueCar = "海马S5";
          obj.clueModel = "1.6T舒适型";
          obj.clueRemark = "海马S5 1.5T";
          obj.clueActivity = "微信";
          obj.clueMoney = "200.00";
          obj.clueCode = "las";


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

      $scope.isAllChecked = false;

      $scope.selectAll = function(){
        $scope.isAllChecked = !$scope.isAllChecked;

        for(var i = 0;i < $scope.testData.length;i ++){
          $scope.testData[i].isChecked = $scope.isAllChecked;
        }
      };

      $scope.query();

    });
