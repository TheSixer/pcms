'use strict';

/**
 * 潜客管理→统计分析→销售活动
 * create by Lijie 2017/1/11
 *
 * @name pcmsApp.controller:SaleActivityCtrl
 * @description
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('SaleActivityCtrl',
    function($scope, PAGE_CONST, REGEX, Util, saleActivityTagEntity, codeMasterService, saleActivityUpdateEntity, saleActivityEntity, HybridUiGrid, $uibModal, loginData) {

      //初始化页面
      var init = function() {
        $scope.filter = {};
        $scope.activityData = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = saleActivityEntity.getAll;
        $scope.hybridObj.filter = {};
        $scope.hybridObj.htmlId = 'mainGrid';
        // 正则表达式
        $scope.pattern = REGEX;

        // 取得编码表
        $scope.codeMaster = codeMasterService.get();

      };
      init();

      //从后台取数据(前处理)
      $scope.hybridObj.processBeforeGetDataFromBe = function () {
        var m_filter = $scope.hybridObj.processBeforeGetDataFromBeCommon();

        m_filter.dealerId = '0';
        console.log('$scope.hybridObj.processBeforeGetDataFromBe:', m_filter);
        m_filter.trackDateStart = m_filter.trackDateStart ? Util.formatDate(m_filter.trackDateStart,'YYYY-MM-DD HH:mm:ss') : '';
        m_filter.trackDateEnd = m_filter.trackDateEnd ? Util.formatDate(m_filter.trackDateEnd,'YYYY-MM-DD HH:mm:ss') : '';
        return m_filter;
      };

      //从后台取数据(后处理)
      $scope.hybridObj.processAfterGetDataFromBe = function (result) {
        console.log('$scope.hybridObj.processAfterGetDataFromBe→cb→result', result);

        if (result) {
          var rows = result.data;
          var total = result.count;

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
              $scope.activityData = row.entity;
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
          type: 'number',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellCenter',
          width: 50,
          enableColumnMenu: false,
        }, {
          name: '活动编号',
          field: 'activityId',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 70,
          enableColumnMenu: false,
        }, {
          name: '活动类型',
          field: 'activityType',
          cellFilter: 'codeMasterFilter:\'activityType\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '跟进内容',
          field: 'trackContent',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '跟进时间',
          field: 'trackDate',
          cellFilter: 'dateFilter:\'yyyy-MM-dd\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '跟进结果',
          field: 'trackResult',
          cellFilter: 'codeMasterFilter:\'trackResult\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '客户姓名',
          field: 'customerName',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '客户人数',
          field: 'customerNum',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '是否二次进店',
          field: 'isReturned',
          cellFilter: 'codeMasterFilter:\'isOrdered\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '转订单',
          field: 'isOrdered',
          cellFilter: 'codeMasterFilter:\'isOrdered\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '来店时间',
          field: 'comeDate',
          cellFilter: 'dateFilter:\'yyyy-MM-dd\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '客户意见',
          field: 'customerComment',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
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

      //加载数据
      var load = function () {
        $scope.hybridObj.filter = {};
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
      };

      var showModal = function (data) {
        // 传递参数
        var param = {};
        param.codeMaster = $scope.codeMaster;
        param.activityData = data.activityId ? angular.copy(data) : {};

        // 弹出选择框
        var modalInstance = $uibModal.open({
          animation: false,
          templateUrl: 'views/pcms/modal/sale-activity-modal.html',
          controller: 'SaleActivityModalCtrl',
          size: 'md',
          resolve: {
            data: function () {
              return param;
            }
          }
        });

        modalInstance.result.then(function (result) {
          result.modifier = loginData.username;
          $scope.promise = saleActivityUpdateEntity.update(result,function (resp) {
            if ('1'.equals(resp.status)) {
              Util.putSysMsg('success', '1003', 'activity');
              load();
            } else {
              Util.putSysMsg('warning', '1110', 'activity');
            }
          });
        }, function () {
          console.log('cancel');
        });
      };

      //编辑
      $scope.editBtnEvent = function () {
        if($scope.activityData.activityId) {
          showModal($scope.activityData);
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      //转意向客户
      $scope.toIntentionBtnEvent = function () {
        if($scope.activityData.activityId) {
          if('2'.equals($scope.activityData.activityType)) {
            $scope.activityData.isOrdered = '0';
            //需修改
            $scope.promise = saleActivityUpdateEntity.update($scope.activityData,function (resp){
              if('1'.equals(resp.status)) {
                Util.putSysMsg('success', '转订单成功');
                load();
              } else {
                Util.putSysMsg('warning', '转订单失败');
              }
            });
          } else {
            Util.putSysMsg('warning','无法转订单,活动类型不是到店');
          }
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      //转订单
      $scope.toOrderBtnEvent = function () {
        if($scope.activityData.activityId) {
          $scope.promise = saleActivityEntity.update($scope.activityData,function (resp){

            if('1'.equals(resp.status)) {
              Util.putSysMsg('success', '转订单成功');
              load();
            } else {
              Util.putSysMsg('warning', '转订单失败');
            }
          });
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      var showTagModal = function (data) {
        // 传递参数
        var param = {};
        param.codeMaster = $scope.codeMaster;
        param.activityData = data.activityId ? angular.copy(data) : {};

        // 弹出选择框
        var modalInstance = $uibModal.open({
          animation: false,
          templateUrl: 'views/pcms/modal/sale-activity-customer-tag-modal.html',
          controller: 'SaleActivityCustomerTagModalCtrl',
          size: 'md',
          resolve: {
            data: function () {
              return param;
            }
          }
        });

        modalInstance.result.then(function (result) {
          // $scope.activityData.pcId = '1';
          $scope.promise = saleActivityTagEntity.update({pcId:$scope.activityData.pcId, tags:result},function (resp){

              if('1'.equals(resp.status)) {
                Util.putSysMsg('success', '打标签成功');
                load();
              } else {
                Util.putSysMsg('warning', '打标签失败');
              }
          });
        }, function () {
          console.log('cancel');
        });
      };

      //给客户打标签
      $scope.tagBtnEvent = function () {
        if($scope.activityData.activityId) {
          showTagModal($scope.activityData);
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      load();
    });
