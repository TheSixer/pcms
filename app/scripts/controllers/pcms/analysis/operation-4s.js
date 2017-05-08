'use strict';

/**
 * 潜客管理→统计分析→4S店运营分析
 * create by Lijie 2017/1/11
 *
 * @name pcmsApp.controller:Operation4sCtrl
 * @description
 * #Operation4sCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('Operation4sCtrl',
    function($scope, PAGE_CONST, REGEX, Util, CommonModalSearch, codeMasterService, Operation4sEntity, HybridUiGrid, localStorageService, getDealer, TICKET) {

      //初始化页面
      var init = function() {
        $scope.filter = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = Operation4sEntity.getAll;
        $scope.hybridObj.filter = {};
        $scope.hybridObj.htmlId = 'mainGrid';
        // 正则表达式
        $scope.pattern = REGEX;

        // 取得编码表
        $scope.codeMaster = codeMasterService.get();

        // $scope.filter.beginTime = new Date(moment().subtract(1, 'months'));
        // $scope.filter.endTime = new Date();

        $scope.areaData = localStorageService.get('haimaArea');
        // 区域
        $scope.area = [];
        // 省
        $scope.province = [];
        $scope.provinceMode = true;
        // 市
        $scope.city = [];
        $scope.cityMode = true;
        // 经销商
        $scope.dealer = [];
        $scope.dealerMode = true;
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

        console.log('$scope.hybridObj.processBeforeGetDataFromBe:', m_filter);
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
          name: '4S店',
          field: 'dealerName',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '成交量',
          field: 'successCount',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '流转量',
          field: 'flowCount',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '邀约到店率(%)',
          field: 'shopRatio',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '订单线索及时率(%)',
          field: 'presaleRatio',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '意向线索及时率(%)',
          field: 'aftersaleRatio',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 60,
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
        var url = '/ststcs/exportOperationAnalysisRpt';
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
        if($scope.filter.dealer) {
          url = url + '&dealer=' + $scope.filter.dealer;
        } else {
          url = url + '&dealer=' + '';
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
        Util.exportFromUrl(url);
      };

      //加载数据
      var load = function () {
        $scope.hybridObj.filter = $scope.filter;
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
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

      $scope.$watch('filter.city', function (newValue) {
        if(newValue) {
          getDealer.getAll({
            // act: 'search_department',
            ticket: TICKET,
            search: [{areaid: $scope.filter.area, provinceid: $scope.filter.province, cityid: newValue}]
          }, function (resp) {
            if (newValue) {
              $scope.dealer = [];
              $scope.dealerMode = false;
              for (var index in resp[0]) {
                $scope.dealer[index] = {};
                $scope.dealer[index].code = resp[0][index].id;
                $scope.dealer[index].value = resp[0][index].dept_name;
              }
            } else {
              $scope.dealerMode = true;
            }
          });
        }
      });

      load();
    });
