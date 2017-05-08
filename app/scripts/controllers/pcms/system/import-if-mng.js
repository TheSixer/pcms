'use strict';
/**
 * Created by huangcheng on 2017/1/17.
 */
/**
 * 潜客管理→系统管理→导入接口管理
 * @ngdoc function
 * @name pcmsApp.controller:ImportIFMngCtrl
 * @description
 * # ImportIFMngCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('ImportIFMngCtrl',
    function ($scope, Util, HybridUiGrid, PAGE_CONST, codeMasterService, $uibModal, ImportIfMngEntity, ImportIfMngDeleteEntity, ImportIfMngNewEntity, loginData) {
      //初始化页面
      var init = function() {
        $scope.filter = {};
        $scope.IfData = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = ImportIfMngEntity.getAll;
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
              rows[index].frequency = String(rows[index].frequency);
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
              $scope.IfData = row.entity;
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
          name: '接口名称',
          field: 'name',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 80,
          enableColumnMenu: false,
        }, {
          name: '接口地址',
          field: 'url',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '导入频次',
          field: 'frequency',
          cellFilter: 'codeMasterFilter:\'frequency\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '是否生效',
          field: 'isEnable',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellCenter',
          cellFilter: 'codeMasterFilter:\'isEnable\'',
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
        param.codeMaster = $scope.codeMaster;
        param.IfData = data.id ? angular.copy(data) : {};

        // 弹出选择框
        var modalInstance = $uibModal.open({
          animation: false,
          templateUrl: 'views/pcms/modal/import-if-mng-model.html',
          controller: 'ImportIfMngModalCtrl',
          size: 'sm',
          resolve: {
            data: function () {
              return param;
            }
          }
        });

        modalInstance.result.then(function (result) {
          result.isEnable = result.isEnable ? '1':'0';
          if (result.id) {
            result.modifier = loginData.username;
            $scope.promise = ImportIfMngNewEntity.update(result,function (resp) {
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
            result.delFlg = '0';
            result.createDate = new Date();
            result.modifyDate = new Date();
            $scope.promise = ImportIfMngNewEntity.create(result,function (resp) {
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
        if($scope.IfData.id) {
          $scope.promise = ImportIfMngDeleteEntity.delete({id: $scope.IfData.id}, function (resp) {
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
        if($scope.IfData.id) {
          showModal($scope.IfData);
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      load();
    });
