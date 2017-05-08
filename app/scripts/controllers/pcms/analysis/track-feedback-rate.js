'use strict';

/**
 * 潜客管理→统计分析→线索跟进反馈分析
 * create by Lijie 2017/1/10
 *
 * @name pcmsApp.controller:TrackFeedbackRateCtrl
 * @description
 * #TrackFeedbackRateCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('TrackFeedbackRateCtrl',
    function($scope, PAGE_CONST, REGEX, Util, CommonModalSearch, codeMasterService, TrackFeedbackRateEntity, HybridUiGrid) {

      //初始化页面
      var init = function() {
        $scope.filter = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = TrackFeedbackRateEntity.getAll;
        $scope.hybridObj.filter = {};
        $scope.hybridObj.htmlId = 'mainGrid';
        // 正则表达式
        $scope.pattern = REGEX;

        // 取得编码表
        $scope.codeMaster = codeMasterService.get();
        $scope.filter.beginTime = new Date(moment().subtract(1, 'months'));
        $scope.filter.endTime = new Date();
      };
      init();

      //从后台取数据(前处理)
      $scope.hybridObj.processBeforeGetDataFromBe = function () {
        var m_filter = $scope.hybridObj.processBeforeGetDataFromBeCommon();

        console.log('$scope.hybridObj.processBeforeGetDataFromBe:', m_filter);
        m_filter.beginTime = m_filter.beginTime ? Util.formatDate(m_filter.beginTime,'YYYY-MM-DD HH:mm:ss') : '';
        m_filter.endTime = m_filter.endTime ? Util.formatDate(m_filter.endTime,'YYYY-MM-DD HH:mm:ss') : '';
        return m_filter;
      };

      //从后台取数据(后处理)
      $scope.hybridObj.processAfterGetDataFromBe = function (result) {
        console.log('$scope.hybridObj.processAfterGetDataFromBe→cb→result', result);

        if (result) {
          var rows = result.data ? result.data : [];
          var total = result.count ? result.count : rows.length;

          console.log('rows:',rows);
          if (rows) {
            for (var index in rows) {
              // rows[index].sex = String(rows[index].sex);
            }

            $scope.hybridObj.processAfterGetDataFromBeCommon(rows, total);
          }
        }
      };

      angular.extend($scope.hybridObj.gridOptions, {
        paginationPageSize: PAGE_CONST.pageList[1],
        enableSorting: true,
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) {
            }
          });

          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            $scope.promise = $scope.hybridObj.onPaginationChanged(newPage, pageSize);
          });
        },
        // isRowSelectable: function (row) {
        //   if ($scope.hybridObj.selectedRow.entity) {
        //     var key = 'pc_id';
        //     var keyVal = $scope.hybridObj.selectedRow.entity[key];
        //
        //     $scope.hybridObj.selectRow(key, keyVal, row);
        //   }
        // },
        columnDefs: [{
          name: '序号',
          field: 'idx',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellCenter',
          width: 50,
          enableColumnMenu: false,
        }, {
          name: '省份',
          field: 'province',
          cellFilter: 'codeMasterFilter:\'province\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 80,
          enableColumnMenu: false,
        }, {
          name: '城市',
          field: 'city',
          cellFilter: 'codeMasterFilter:\'city\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '4S店',
          field: 'name',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '跟进反馈及时数量',
          field: 'inTimeCount',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '跟进反馈及时率（%）',
          field: 'timelinessRatio',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }]
      });

      //查询
      $scope.searchBtnEvent = function () {
        $scope.hybridObj.filter = $scope.filter;
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
      };

      //导出
      $scope.exportBtnEvent =function () {
        var url = '/ststcs/exportClueFeedbackRpt';
        if($scope.filter.beginTime) {
          url = url + '?beginTime=' + $scope.filter.beginTime;
        } else {
          url = url + '?beginTime=' + '';
        }
        if($scope.filter.endTime) {
          url = url + '&endTime=' + $scope.filter.endTime;
        } else {
          url = url + '&endTime=' + '';
        }
        if($scope.filter.modelName) {
          url = url + '&modelName=' + $scope.filter.modelName;
        } else {
          url = url + '&modelName=' + '';
        }
        if($scope.filter.origin) {
          url = url + '&origin=' + $scope.filter.origin;
        } else {
          url = url + '&origin=' + '';
        }
        if($scope.filter.dealerNm) {
          url = url + '&dealerNm=' + $scope.filter.dealerNm;
        } else {
          url = url + '&dealerNm=' + '';
        }
        if($scope.filter.area) {
          url = url + '&area=' + $scope.filter.area;
        } else {
          url = url + '&area=' + '';
        }
        if($scope.filter.province) {
          url = url + '&province=' + $scope.filter.province;
        } else {
          url = url + '&province=' + '';
        }
        if($scope.filter.city) {
          url = url + '&city=' + $scope.filter.city;
        } else {
          url = url + '&city=' + '';
        }
        if($scope.filter.dealer) {
          url = url + '&dealer=' + $scope.filter.dealer;
        } else {
          url = url + '&dealer=' + '';
        }
        Util.exportFromUrl(url);
      };

      //加载数据
      var load = function () {
        $scope.hybridObj.filter = $scope.filter;
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
      };

      load();
    });
