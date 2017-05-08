'use strict';
/**
 * Created by huangcheng on 2017/1/17.
 */
/**
 * 潜客管理→系统管理→分配规则管理
 * @ngdoc function
 * @name pcmsApp.controller:DividendRuleMngCtrl
 * @description
 * # DividendRuleMngCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('DividendRuleMngCtrl',
    function ($scope, Util, DividendRuleMngEntity, HybridUiGrid, PAGE_CONST, $uibModal, DividendRuleDeleteMngEntity, codeMasterService, $confirm, loginData) {
      //初始化页面
      var init = function() {
        $scope.filter = {};
        $scope.ruleData = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = DividendRuleMngEntity.getAll;
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
        m_filter.cls = 'dividendRule';
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
              rows[index].value = String(rows[index].value);
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
              $scope.ruleData = row.entity;
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
          name: '规则名',
          field: 'nam',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 80,
          enableColumnMenu: false,
        }, {
          name: '规则内容',
          field: 'value',
          cellFilter: 'codeMasterFilter:\'dividendRule\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '备注',
          field: 'remark',
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
        param.ruleData = data.id ? angular.copy(data) : {};
        param.codeMaster = $scope.codeMaster;
        // 弹出选择框
        var modalInstance = $uibModal.open({
          animation: false,
          templateUrl: 'views/pcms/modal/dividend-rule-mng-modal.html',
          controller: 'DividendRuleMngModalCtrl',
          size: 'sm',
          resolve: {
            data: function () {
              return param;
            }
          }
        });

        modalInstance.result.then(function (result) {
          if (result.id) {
            result.modifier = loginData.username;
            $scope.promise = DividendRuleMngEntity.update(result,function (resp) {
              if('1'.equals(resp.status)) {
                Util.putSysMsg('success', '1003');
                load();
              } else {
                Util.putSysMsg('warning', '1110');
              }
            });
          } else {
            result.cls = 'dividendRule';
            result.order = '0';
            result.value = result.value ? result.value : '';
            result.createDate = new Date();
            result.modifyDate = new Date();
            result.creator = loginData.username;
            result.modifier = loginData.username;
            $scope.promise = DividendRuleMngEntity.create(result,function (resp) {
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
        if($scope.ruleData.id) {
          // 呼出modal
          var modal = {};
          modal.text = '确定删除该条记录吗？';
          modal.title = '提示';

          $confirm(modal, {
            size: 'xs'
          })
            .then(function (param) {
              $scope.promise = DividendRuleDeleteMngEntity.delete({id: $scope.ruleData.id}, function (resp) {
                if('1'.equals(resp.status)) {
                  Util.putSysMsg('success', '1004');
                  load();
                } else {
                  Util.putSysMsg('warning', '1112');
                }
              });
            });
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      //修改
      $scope.editBtnEvent = function () {
        if($scope.ruleData.id) {
          showModal($scope.ruleData);
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      load();
    });
