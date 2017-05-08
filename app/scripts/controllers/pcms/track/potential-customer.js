'use strict';

/**
 * 潜客管理→统计分析→销售机会
 * create by Lijie 2017/1/11
 *
 * @name pcmsApp.controller:PotentialCustomerCtrl
 * @description
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('PotentialCustomerCtrl',
    function ($scope, PAGE_CONST, REGEX, Util, $uibModal, PotentialCustomerGetEntity, codeMasterService, PotentialCustomerEntity, HybridUiGrid, PotentialCustomerAddEntity, PotentialCustomerUpdateEntity, localStorageService) {

      //初始化页面
      var init = function () {
        $scope.filter = {};
        $scope.customerData = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = PotentialCustomerGetEntity.getAll;
        $scope.hybridObj.filter = {};
        $scope.hybridObj.htmlId = 'mainGrid';

        $scope.codeMaster = codeMasterService.get('');

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
        //mode
        $scope.viewMode = true;

        // 正则表达式
        $scope.pattern = REGEX;
      };
      init();

      //从后台取数据(前处理)
      $scope.hybridObj.processBeforeGetDataFromBe = function () {
        var m_filter = $scope.hybridObj.processBeforeGetDataFromBeCommon();

        console.log('$scope.hybridObj.processBeforeGetDataFromBe:', m_filter);
        m_filter.dealerId = '0';
        return m_filter;
      };

      //从后台取数据(后处理)
      $scope.hybridObj.processAfterGetDataFromBe = function (result) {
        console.log('$scope.hybridObj.processAfterGetDataFromBe→cb→result', result);

        // var salesData = [{pcId:1,idNo:320688888888888888,customerName:'张杰',phone:'15266666666',age:30,sex:'男',idType:'1'}
        //   , {pcId:2,idNo:320688888888888888,customerName:'李冰冰',phone:'15277777777',age:30,sex:'男',idType:'1'}
        //   , {pcId:3,idNo:320688888888888888,customerName:'王宝强',phone:'15288888888',age:30,sex:'男',idType:'1'}];
        // result.data = salesData;
        // result.count = salesData.length;

        result.datas = [];
        for (var index in result.data) {
          result.datas[index] = result.data[index].pc;
          result.datas[index].label = '';
          for(var i in result.data[index].tags) {
            if(result.data[index].tags[i]) {
              if(i+1 < result.data[index].tags.length) {
                result.datas[index].label = result.datas[index].label + result.data[index].tags[i].name + ',';
              } else {
                result.datas[index].label = result.datas[index].label + result.data[index].tags[i].name;
              }
            }
          }
          result.datas[index].tags = result.data[index].tags;
        }

        if (result) {
          var rows = result.datas ? result.datas:[];
          var total = result.count ? result.count : rows.length;

          if (rows) {
            for (var index in rows) {
              rows[index].sex = String(rows[index].sex);
              rows[index].idType = rows[index].idType != undefined ? String(rows[index].idType) : '';
              rows[index].area = String(rows[index].area);
              rows[index].province = String(rows[index].province);
              rows[index].city = String(rows[index].city);
            }

            $scope.hybridObj.processAfterGetDataFromBeCommon(rows, total);
          }
        }
      };

      angular.extend($scope.hybridObj.gridOptions, {
        paginationPageSize: PAGE_CONST.pageList[1],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) {
              $scope.customerData = row.entity;
              //当grid的选择行变化时,取消编辑状态
              if ($scope.hybridObj.selectedRow.entity) {
                console.log('$scope.hybridObj.selectedRow:', $scope.hybridObj.selectedRow);
                $scope.currentId = $scope.hybridObj.selectedRow.entity.pc_id;

                if ($scope.currentId !== row.entity.pc_id) {
                  $scope.cancelBtnEvent();
                }
              }

              $scope.hybridObj.selectedRow = row;
              $scope.potentialCustomer = angular.copy($scope.hybridObj.selectedRow.entity);
            }
          });

          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            $scope.promise = $scope.hybridObj.onPaginationChanged(newPage, pageSize);
          });
        },
        isRowSelectable: function (row) {
          if ($scope.hybridObj.selectedRow.entity) {
            var key = 'pc_id';
            var keyVal = $scope.hybridObj.selectedRow.entity[key];

            $scope.hybridObj.selectRow(key, keyVal, row);
          }
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
          name: '姓名',
          field: 'customerName',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 75,
          enableColumnMenu: false,
        }, {
          name: '性别',
          field: 'sex',
          cellFilter: 'codeMasterFilter:\'sex\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 75,
          enableColumnMenu: false,
        }, {
          name: '出生年月',
          field: 'birthday',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 75,
          enableColumnMenu: false,
        }, {
          name: '证件类型',
          field: 'idType',
          cellFilter: 'codeMasterFilter:\'idType\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 130,
          enableColumnMenu: false,
        }, {
          name: '证件编号',
          field: 'idNo',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 150,
          enableColumnMenu: false,
        }, {
          name: '职业',
          field: 'occupation',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 150,
          enableColumnMenu: false,
        }, {
          name: '电话',
          field: 'phone',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '公司电话',
          field: 'companyPhone',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '家庭电话',
          field: 'familyPhone',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '邮件',
          field: 'email',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '微信',
          field: 'weixin',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '微博',
          field: 'weibo',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '区域',
          field: 'area',
          cellFilter: 'areaFilter:\'area\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
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
          name: '住址',
          field: 'address',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '邮编',
          field: 'zipcode',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '标签',
          field: 'label',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 160,
          enableColumnMenu: false,
        // }, {
        //   name: '新增者',
        //   field: 'creator',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '新增时间',
        //   field: 'createDate',
        //   cellFilter: 'dateFilter:\'yyyy-MM-dd\'',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '更新者',
        //   field: 'modifier',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '更新时间',
        //   field: 'modifyDate',
        //   cellFilter: 'dateFilter:\'yyyy-MM-dd\'',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        }]
      });

      var showModal = function (data) {
        // 传递参数
        var param = {};
        param.codeMaster = $scope.codeMaster;
        param.filter = data.pcId ? angular.copy(data) : {};

        // 弹出选择框
        var modalInstance = $uibModal.open({
          animation: false,
          templateUrl: 'views/pcms/modal/potential-customer-query-modal.html',
          controller: 'PotentialCustomerQueryModalCtrl',
          size: 'md',
          resolve: {
            data: function () {
              return param;
            }
          }
        });

        modalInstance.result.then(function (data) {
          if (data.pcId) {
            $scope.promise = PotentialCustomerUpdateEntity.update(data,function () {
              Util.putMainMsg('success', '客户信息更新成功!');
              load();
            });
          } else {
            $scope.promise = PotentialCustomerAddEntity.create(data, function () {
              Util.putMainMsg('success', '客户信息创建成功!');
              load();
            });
          }
        }, function () {
          console.log('cancel');
        });
      };

      //「新增」按钮按下事件
      $scope.addBtnEvent = function () {
        showModal({});
      };

      //「编辑」按钮按下事件
      $scope.editBtnEvent = function () {
        if($scope.customerData.pcId) {
          showModal($scope.customerData);
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      //「查询」按钮按下事件
      $scope.queryBtnEvent = function () {
        $scope.hybridObj.filter = $scope.filter;
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
      };

      $scope.customerBtnEvent = function () {
        if($scope.customerData.pcId) {
          // 传递参数
          var param = {};
          param.customerData = $scope.customerData;

          // 弹出选择框
          var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'views/pcms/modal/personal-modal.html',
            controller: 'PersonaModalCtrl',
            size: 'md',
            resolve: {
              data: function () {
                return param;
              }
            }
          });

          modalInstance.result.then(function (filter) {
          }, function () {
            console.log('cancel');
          });
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      //区域
      $scope.$watch('filter.area', function (newValue) {
        if(newValue) {
          $scope.province = [];
          $scope.provinceMode = false;
          for(var index in $scope.areaData) {
            if($scope.areaData[index].id === newValue) {
              for(var i in $scope.areaData[index].provinces) {
                $scope.province[i] = {};
                $scope.province[i].code = $scope.areaData[index].provinces[i].id;
                $scope.province[i].value = $scope.areaData[index].provinces[i].name;
              }
              break;
            }
          }
        } else {
          $scope.provinceMode = true;
        }
      });

      //省份
      $scope.$watch('filter.province', function (newValue) {
        if(newValue) {
          $scope.city = [];
          $scope.cityMode = false;
          for(var index in $scope.areaData) {
            if($scope.areaData[index].id === $scope.filter.area) {
              for(var i in $scope.areaData[index].provinces) {
                if($scope.areaData[index].provinces[i].id === newValue) {
                  for(var j in $scope.areaData[index].provinces[i].cities) {
                    $scope.city[j] = {};
                    $scope.city[j].code = $scope.areaData[index].provinces[i].cities[j].id;
                    $scope.city[j].value = $scope.areaData[index].provinces[i].cities[j].name;
                  }
                }
              }
            }
          }
        } else {
          $scope.city = [];
          $scope.cityMode = true;
        }
      });

      //加载数据
      var load = function () {
        $scope.hybridObj.filter = {};
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
      };
      load();
    });
