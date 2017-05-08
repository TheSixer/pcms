'use strict';

/**
 * 潜客管理→统计分析→跟进战败分析
 * create by Lijie 2017/1/10
 *
 * @name pcmsApp.controller:TrackDefeatCtrl
 * @description
 * #TrackDefeatCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('TrackDefeatCtrl',
    function($scope, PAGE_CONST, REGEX, Util, CommonModalSearch, codeMasterService, HybridUiGrid, TrackDefeatEntity, localStorageService) {

      //初始化页面
      var init = function() {
        $scope.filter = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = TrackDefeatEntity.getAll;
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
        m_filter.bgnTim = m_filter.bgnTim ? Util.formatDate(m_filter.bgnTim,'YYYY-MM-DD HH:mm:ss') : '';
        m_filter.endTim = m_filter.endTim ? Util.formatDate(m_filter.endTim,'YYYY-MM-DD HH:mm:ss') : '';
        // m_filter.salesId = m_filter.salesId ? m_filter.salesId : '';
        // m_filter.activityType = m_filter.activityType ? m_filter.activityType : '';
        // m_filter.chanceOrigin = m_filter.chanceOrigin ? m_filter.chanceOrigin : '';
        // m_filter.area = m_filter.area ? m_filter.area : '';
        // m_filter.province = m_filter.province ? m_filter.province : '';
        // m_filter.city = m_filter.city ? m_filter.city : '';
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
              // rows[index].activityType = String(rows[index].activityType);
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
          name: '线索编号',
          field: 'clueId',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 80,
          enableColumnMenu: false,
        },  {
        //   name: '省份',
        //   field: 'province',
        //   cellFilter: 'codeMasterFilter:\'province\'',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 80,
        //   enableColumnMenu: false,
        // }, {
        //   name: '城市',
        //   field: 'city',
        //   cellFilter: 'codeMasterFilter:\'city\'',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
          name: '销售顾问',
          field: 'salesId',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '客户姓名',
          field: 'customerName',
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
          name: '来源活动',
          field: 'chanceOrigin',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '活动类别',
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
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '状态',
          field: 'chanceStatus',
          cellFilter: 'codeMasterFilter:\'chanceStatus\'',
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

      //导出
      $scope.exportBtnEvent =function () {
        var url = '/ststcs/exportSignArriveRateRptForAgency';
        if($scope.filter.bgnTim) {
          url = url + '?bgnTim=' + $scope.filter.bgnTim;
        } else {
          url = url + '?bgnTim=' + '';
        }
        if($scope.filter.endTim) {
          url = url + '&endTim=' + $scope.filter.endTim;
        } else {
          url = url + '&endTim=' + '';
        }
        if($scope.filter.salesId) {
          url = url + '&salesId=' + $scope.filter.salesId;
        } else {
          url = url + '&salesId=' + '';
        }
        if($scope.filter.chanceOrigin) {
          url = url + '&chanceOrigin=' + $scope.filter.chanceOrigin;
        } else {
          url = url + '&chanceOrigin=' + '';
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
        if($scope.filter.activityType) {
          url = url + '&activityType=' + $scope.filter.activityType;
        } else {
          url = url + '&activityType=' + '';
        }
        Util.exportFromUrl(url);
      };

      //加载数据
      var load = function () {
        $scope.hybridObj.filter = {};
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

      load();
    });
