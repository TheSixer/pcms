'use strict';
/**
 * Created by huangcheng on 2017/2/9.
 */
/**
 * 潜客管理→客户跟进→销售机会
 * @ngdoc function
 * @name pcmsApp.controller:SaleChanceTransmitModalCtrl
 * @description
 * # SaleChanceTransmitModalCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('SaleChanceTransmitModalCtrl',
    function ($scope, Util, codeMasterService, $uibModalInstance, saleChanceEntity, HybridUiGrid, PAGE_CONST, getSalesEntity, loginData, TICKET) {
      // 初始化
      var init = function () {

        $scope.filter = {};
        $scope.workerData = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = getSalesEntity.getAll;
        $scope.hybridObj.filter = {};
        $scope.hybridObj.htmlId = 'mainGrid';
        // 取得编码表
        $scope.codeMaster = codeMasterService.get();
      };

      init();

      //从后台取数据(前处理)
      $scope.hybridObj.processBeforeGetDataFromBe = function () {
        var m_filter = $scope.hybridObj.processBeforeGetDataFromBeCommon();

        console.log('$scope.hybridObj.processBeforeGetDataFromBe:', m_filter);
        m_filter.act = 'get_usercansee_user';
        m_filter.username = loginData.username;
        m_filter.ticket = TICKET;
        return m_filter;
      };

      //从后台取数据(后处理)
      $scope.hybridObj.processAfterGetDataFromBe = function (result) {
        console.log('$scope.hybridObj.processAfterGetDataFromBe→cb→result', result);
        if (result) {
          var rows = result;
          var total = result.length;

          console.log('rows:',rows);
          if (rows) {
            for (var index = 0; index< rows.length; index++) {
              rows[index].sex = String(rows[index].sex);
            }

            $scope.hybridObj.processAfterGetDataFromBeCommon(rows, total);
          }
        }
      };

      angular.extend($scope.hybridObj.gridOptions, {
        enableRowSelection: true,        // 能否选择行
        paginationPageSize: PAGE_CONST.pageList[1],
        enableSorting: true,
        rowTemplate: '<div ng-dblclick=\'grid.appScope.onSelectGridDblClick(row)\' ng-repeat=\'(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\' class=\'ui-grid-cell\' ng-class=\'{ "ui-grid-row-header-cell": col.isRowHeader }\' ui-grid-cell dbl-click-row></div>',
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          console.log('gridApi',gridApi);
          gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) {
              $scope.workerData = row.entity;
            }
          });

          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            $scope.promise = $scope.hybridObj.onPaginationChanged(newPage, pageSize);
          });
        },
        columnDefs: [{
          name: '序号',
          field: 'idx',
          type: 'number',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellCenter',
          width: 50,
          enableColumnMenu: false,
        }, {
          name: '工号',
          field: 'id',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 70,
          enableColumnMenu: false,
        }, {
          name: '姓名',
          field: 'realName',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 70,
          enableColumnMenu: false,
        }, {
          name: '电话',
          field: 'mobilePhone',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '性别',
          field: 'sex',
          cellFilter: 'codeMasterFilter:\'sex\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }]
      });

      //加载数据
      var load = function () {
        $scope.hybridObj.filter = {};
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
      };

      // 确定
      $scope.ok = function() {
        if($scope.workerData.id) {
          $uibModalInstance.close($scope.workerData.id);
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      $scope.onSelectGridDblClick = function (row) {
        $uibModalInstance.close(row.entity.id);
      };

      $scope.searchBtnEvent = function () {
        $scope.hybridObj.filter = $scope.filter;
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
      };

      // 取消
      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

      load();

    });
