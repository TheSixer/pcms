'use strict';

/**
 * 潜客管理→统计分析→销售机会
 * create by Lijie 2017/1/11
 *
 * @name pcmsApp.controller:SaleChanceCtrl
 * @description
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('SaleChanceCtrl',
    function($scope, PAGE_CONST, REGEX, Util, saleActivityNewEntity, codeMasterService, saleChanceEntity, HybridUiGrid, $uibModal, $confirm, loginData, localStorageService, toOrderEntity) {

      //初始化页面
      var init = function() {
        $scope.filter = {};
        $scope.chanceData = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = saleChanceEntity.getAll;
        $scope.hybridObj.filter = {};
        $scope.hybridObj.htmlId = 'mainGrid';
        // 正则表达式
        $scope.pattern = REGEX;

        // 取得编码表
        $scope.codeMaster = codeMasterService.get();

        $scope.areaData = localStorageService.get('haimaArea');

        // 区域
        $scope.area = [];
        // 省
        $scope.province = [];
        $scope.provinceMode = true;
        // 市
        $scope.city = [];
        $scope.cityMode = true;
        for(var index in $scope.areaData) {
          $scope.area[index] = {};
          $scope.area[index].code = $scope.areaData[index].id;
          $scope.area[index].value = $scope.areaData[index].name;
        }

      };
      init();

      //从后台取数据(前处理)
      $scope.hybridObj.processBeforeGetDataFromBe = function () {
        var m_filter = $scope.hybridObj.processBeforeGetDataFromBeCommon();

        // m_filter.first_comedateFrom = m_filter.first_comedateFrom ? Util.formatDate(m_filter.first_comedateFrom, 'YYYY-MM-DD HH:mm:ss') : '';
        // m_filter.first_comedateTo = m_filter.first_comedateTo ? Util.formatDate(m_filter.first_comedateTo, 'YYYY-MM-DD HH:mm:ss') : '';

        console.log('$scope.hybridObj.processBeforeGetDataFromBe:', m_filter);

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
              $scope.chanceData = row.entity;
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
          name: '机会编号',
          field: 'chanceId',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 70,
          enableColumnMenu: false,
        }, {
          name: '机会来源',
          field: 'chanceOrigin',
          cellFilter: 'codeMasterFilter:\'clueOrigin\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
        //   name: '经销商ID',
          //   field: 'dealerId',
          //   headerCellClass: 'gridHeadCenter',
          //   cellClass: 'gridCellLeft',
          //   minWidth: 110,
          //   enableColumnMenu: false,
          // }, {
          name: '业务类别',
          field: 'businessType',
          cellFilter: 'codeMasterFilter:\'businessType\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '机会状态',
          field: 'chanceStatus',
          cellFilter: 'codeMasterFilter:\'chanceStatus\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '机会级别',
          field: 'chanceLevel',
          // cellFilter: 'codeMasterFilter:\'chanceLevel\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '战败原因',
          field: 'defeatReason',
          // cellFilter: 'codeMasterFilter:\'chanceLevel\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '目标车型',
          field: 'intentionModel',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '装备',
          field: 'carSetup',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '颜色',
          field: 'carColor',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '目标车型关注度',
          field: 'modelAttention',
          cellFilter: 'codeMasterFilter:\'modelAttention\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '目标车型备注',
          field: 'intentionDetail',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 160,
          enableColumnMenu: false,
        }, {
          name: '客户姓名',
          field: 'customerName',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '性别',
          field: 'sex',
          cellFilter: 'codeMasterFilter:\'sex\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '手机',
          field: 'phone',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '省份',
          field: 'province',
          cellFilter: 'areaFilter:\'province\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '城市',
          field: 'city',
          cellFilter: 'areaFilter:\'city\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '区',
          field: 'area',
          cellFilter: 'areaFilter:\'area\'',
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
        param.chanceData = data.chanceId ? angular.copy(data) : {};

        // 弹出选择框
        var modalInstance = $uibModal.open({
          animation: false,
          templateUrl: 'views/pcms/modal/sale-chance-modal.html',
          controller: 'SaleChanceModalCtrl',
          size: 'lg',
          resolve: {
            data: function () {
              return param;
            }
          }
        });

        modalInstance.result.then(function (result) {
          if (result.chanceId) {
            $scope.promise = saleChanceEntity.update(result,function (resp) {
              if ('1'.equals(resp.status)) {
                Util.putSysMsg('success', '1003');
                load();
              } else {
                Util.putSysMsg('warning', '1110');
              }
            });
          }
        }, function () {
          console.log('cancel');
        });
      };

      //编辑
      $scope.editBtnEvent = function () {
        if($scope.chanceData.chanceId) {
          showModal($scope.chanceData);
        } else {
          Util.putMainMsg('warning','2002');
        }
      };

      //新建活动
      $scope.addBtnEvent = function () {
        if($scope.chanceData.chanceId) {
          // 传递参数
          var param = {};
          param.codeMaster = $scope.codeMaster;
          param.activityData = $scope.chanceData.chanceId ? angular.copy($scope.chanceData) : {};

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
            result.del_flg = '0';
            result.creator = loginData.username;
            result.modifier = loginData.username;
            result.customerNum = '1';
            result.trackResult = '';
            result.isOrdered = '';
            $scope.promise = saleActivityNewEntity.create(result, function (resp) {
              if ('1'.equals(resp.status)) {
                Util.putSysMsg('success', '1002');
                load();
              } else {
                Util.putSysMsg('warning', '1111');
              }
            });
          }, function () {
            console.log('cancel');
          });
        } else {
          Util.putMainMsg('warning','2002');
        }
      };

      //转发
      $scope.transmitBtnEvent = function () {
        if($scope.chanceData.chanceId) {
          // 传递参数
          var param = {};
          param.codeMaster = $scope.codeMaster;
          param.chanceData = $scope.chanceData.chanceId ? angular.copy($scope.chanceData) : {};

          // 弹出选择框
          var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'views/pcms/modal/sale-chance-transmit-modal.html',
            controller: 'SaleChanceTransmitModalCtrl',
            size: 'md',
            resolve: {
              data: function () {
                return param;
              }
            }
          });

          modalInstance.result.then(function (result) {
            var data = {};
            $scope.chanceData.dealerId = result;
            $scope.promise = saleChanceEntity.update($scope.chanceData,function (resp) {
              if('1'.equals(resp.status)) {
                Util.putSysMsg('success', '转发成功');
                load();
              } else {
                Util.putSysMsg('warning', '转发失败');
              }
            });
          }, function () {
            console.log('cancel');
          });
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      //打开销售机会
      $scope.startBtnEvent = function () {

        if($scope.chanceData.chanceId) {
          // 传递参数
          var param = {};
          param.codeMaster = $scope.codeMaster;
          param.chanceData = $scope.chanceData.chanceId ? angular.copy($scope.chanceData) : {};

          // 弹出选择框
          var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'views/pcms/modal/sale-chance-transmit-modal.html',
            controller: 'SaleChanceTransmitModalCtrl',
            size: 'md',
            resolve: {
              data: function () {
                return param;
              }
            }
          });

          modalInstance.result.then(function (result) {
            $scope.chanceData.chanceStatus = '2';
            $scope.chanceData.dealerId = result.id;
            $scope.promise = saleChanceEntity.update($scope.chanceData, function (resp){
              if('1'.equals(resp.status)) {
                Util.putSysMsg('success', '打开销售机会成功');
                load();
              } else {
                Util.putSysMsg('warning', '打开销售机会失败');
              }
            });
          }, function () {
            console.log('cancel');
          });
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      //关闭销售机会
      $scope.endBtnEvent = function () {
        if($scope.chanceData.chanceId) {

          // 呼出modal
          var modal = {};
          modal.text = '确定关闭该销售机会吗？';
          modal.title = '提示';

          $confirm(modal, {
            size: 'xs'
          })
            .then(function (param) {
              $scope.chanceData.chanceStatus = '9';
              $scope.promise = saleChanceEntity.update($scope.chanceData, function (resp){
                if('1'.equals(resp.status)) {
                  Util.putSysMsg('success', '关闭销售机会成功');
                  load();
                } else {
                  Util.putSysMsg('warning', '关闭销售机会失败');
                }
              });
            });
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      //导出
      $scope.exportBtnEvent =function () {
        var url = '/chance/file/1/99999';
        if($scope.filter.businessType) {
          url = url + '?businessType=' + $scope.filter.businessType;
        } else {
          url = url + '?businessType=' + '';
        }
        if($scope.filter.chanceStatus) {
          url = url + '&chanceStatus=' + $scope.filter.chanceStatus;
        } else {
          url = url + '&chanceStatus=' + '';
        }
        if($scope.filter.chanceLevel) {
          url = url + '&chanceLevel=' + $scope.filter.chanceLevel;
        } else {
          url = url + '&chanceLevel=' + '';
        }

        if($scope.filter.chanceId) {
          url = url + '&chanceId=' + $scope.filter.chanceId;
        } else {
          url = url + '&chanceId=' + '';
        }
        if($scope.filter.intentionModel) {
          url = url + '&intentionModel=' + $scope.filter.intentionModel;
        } else {
          url = url + '&intentionModel=' + '';
        }
        if($scope.filter.customerName) {
          url = url + '&customerName=' + $scope.filter.customerName;
        } else {
          url = url + '&customerName=' + '';
        }
        if($scope.filter.phone) {
          url = url + '&phone=' + $scope.filter.phone;
        } else {
          url = url + '&phone=' + '';
        }
        Util.exportFromUrl(url);
      };

      // 转订单
      $scope.toOrderBtnEvent = function () {
        var param = {};
        if($scope.chanceData.carSetup && $scope.chanceData.carColor) {
          if ($scope.chanceData.chanceId) {
            // 弹出选择框
            var modalInstance = $uibModal.open({
              animation: false,
              templateUrl: 'views/pcms/modal/to-order-model.html',
              controller: 'ToOrderModel',
              size: 'sm',
              resolve: {
                data: function () {
                  return param;
                }
              }
            });

            modalInstance.result.then(function (result) {
              var data = {};
              data.retail_price = result.retail_price;
              data.sales_id = $scope.chanceData.chanceId;
              toOrderEntity.create(data, function (resp) {
                if ('200'.equals(resp.msgCod)) {
                  Util.putSysMsg('success', '转订单成功');
                  load();
                } else {
                  Util.putSysMsg('warning', '转订单失败');
                }
              });
            }, function () {
              console.log('cancel');
            });
          } else {
            Util.putSysMsg('warning', '2002');
          }
        } else {
          Util.putSysMsg('warning', '装备和颜色不能为空');
        }

      };

      load();
    });
