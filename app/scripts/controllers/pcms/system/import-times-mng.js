'use strict';

/**
 * 潜客管理→系统管理→导入频次管理
 * create by huangcheng 2017/1/22
 *
 * @name pcmsApp.controller:ImportTimesMngCtrl
 * @description
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('ImportTimesMngCtrl',
    function($scope, PAGE_CONST, REGEX, Util, HybridUiGrid, $uibModal, ImportTimesMngEntity, loginData) {

      //初始化页面
      var init = function() {
        $scope.filter = {};
        $scope.RuleData = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = ImportTimesMngEntity.getAll;
        $scope.hybridObj.filter = {};
        $scope.hybridObj.htmlId = 'mainGrid';

      };
      init();

      //从后台取数据(前处理)
      $scope.hybridObj.processBeforeGetDataFromBe = function () {
        var m_filter = $scope.hybridObj.processBeforeGetDataFromBeCommon();

        console.log('$scope.hybridObj.processBeforeGetDataFromBe:', m_filter);

        return m_filter;
      };

      //从后台取数据(后处理)
      $scope.hybridObj.processAfterGetDataFromBe = function (result) {
        console.log('$scope.hybridObj.processAfterGetDataFromBe→cb→result', result);

        if (result) {
          var rows = result.data;
          var total = result.count;

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
              $scope.RuleData = row.entity;
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
          name: '接口频次',
          field: 'If_times',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 80,
          enableColumnMenu: false,
        }, {
          name: '是否生效',
          field: 'If_isValid',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellCenter',
          cellFilter: 'codeMasterFilter:\'flgDisplay\'',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '备注',
          field: 'If_comment',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
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

      var showModal = function (data) {
        // 传递参数
        var param = {};
        param.RuleData = data.RuleId ? angular.copy(data) : {};

        // 弹出选择框
        var modalInstance = $uibModal.open({
          animation: false,
          templateUrl: 'views/pcms/modal/import-times-modal.html',
          controller: 'ImportTimesModalCtrl',
          size: 'md',
          resolve: {
            data: function () {
              return param;
            }
          }
        });

        modalInstance.result.then(function (result) {
          if (result.clueId) {
            result.modifier = loginData.username;
            $scope.promise = ImportTimesMngEntity.update(result,function (resp) {
              if('1'.equals(resp.status)) {
                Util.putSysMsg('success', '1003');
                load();
              } else {
                Util.putSysMsg('warning', '1110');
              }
            });
          } else {
            result.creator = loginData.username;
            result.modifier = loginData.username;
            $scope.promise = ImportTimesMngEntity.create(result,function (resp) {
              if ('1'.equals(resp.status)) {
                Util.putSysMsg('success', '1002');
                load();
              } else {
                Util.putSysMsg('warning', '1111');
              }
            });
          }
        }, function () {
          console.log('cancel');
        });
      };

      //新建接口
      $scope.addBtnEvent = function () {
        showModal({});
      };

      //删除
      $scope.deleteBtnEvent = function () {
        if($scope.RuleData.RuleId) {
          $scope.promise = ImportTimesMngEntity.delete({RuleId: $scope.RuleData.RuleId}, function (resp) {
            if('1'.equals(resp.status)) {
              Util.putSysMsg('success', '2103');
              load();
            } else {
              Util.putSysMsg('warning', '2072');
            }
          });
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      //修改
      $scope.editBtnEvent = function () {
        if($scope.RuleData.RuleId) {
          showModal($scope.RuleData);
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      load();
    });
