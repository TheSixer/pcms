/**
 * Created by huangcheng on 2017/3/17.
 */
'use strict';

/**
 * 潜客管理→统计分析→邀约到店率
 * create by wenfeng 2017/1/11
 *
 * @name pcmsApp.controller:ArriveRateHqCtrl
 * @description
 * #ArriveRateCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('ArriveRateHqCtrl',
    function($scope, PAGE_CONST, REGEX, Util, CommonModalSearch, codeMasterService, HybridUiGrid, ArriveRateHqEntity, localStorageService) {

      //初始化页面
      var init = function() {
        $scope.filter = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = ArriveRateHqEntity.getAll;
        $scope.hybridObj.filter = {};
        $scope.hybridObj.htmlId = 'mainGrid';
        // 正则表达式
        $scope.pattern = REGEX;

        // 取得编码表
        $scope.codeMaster = codeMasterService.get();
        // $scope.filter.bgnTim = new Date(moment().subtract(1, 'months'));
        // $scope.filter.endTim = new Date();
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

        console.log('$scope.hybridObj.processBeforeGetDataFromBe:', m_filter);
        m_filter.bgnTim = m_filter.bgnTim ? Util.formatDate(m_filter.bgnTim,'YYYY-MM-DD HH:mm:ss') : '';
        m_filter.endTim = m_filter.endTim ? Util.formatDate(m_filter.endTim,'YYYY-MM-DD HH:mm:ss') : '';
        m_filter.intentionModel = m_filter.intentionModel ? m_filter.intentionModel : '';
        m_filter.chanceOrigin = m_filter.chanceOrigin ? m_filter.chanceOrigin : '';
        m_filter.dealerId = m_filter.dealerId ? m_filter.dealerId : '';
        m_filter.area = m_filter.area ? m_filter.area : '';
        m_filter.province = m_filter.province ? m_filter.province : '';
        m_filter.city = m_filter.city ? m_filter.city : '';

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
          field: 'dealerId',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '到店数量',
          field: 'arriveCnt',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '线索到店率',
          field: 'arriveRatio',
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
        // $scope.filter.bgnTim = $scope.filter.bgnTim ? Util.formatDate($scope.filter.bgnTim,'YYYY-MM-DD HH:mm:ss') : '';
        // $scope.filter.endTim = $scope.filter.endTim ? Util.formatDate($scope.filter.endTim,'YYYY-MM-DD HH:mm:ss') : '';
        // $scope.filter.intentionModel = $scope.filter.intentionModel ? $scope.filter.intentionModel : '';
        // $scope.filter.chanceOrigin = $scope.filter.chanceOrigin ? $scope.filter.chanceOrigin : '';
        // $scope.filter.area = $scope.filter.area ? $scope.filter.area : '';
        // $scope.filter.province = $scope.filter.province ? $scope.filter.province : '';
        // $scope.filter.city = $scope.filter.city ? m_filter.city : '';
        // $scope.promise = ArriveRateDEntity.download($scope.filter, function (resp) {
        // });

        var url = '/ststcs/exportSignArriveRateRptForHQ';
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
        if($scope.filter.intentionModel) {
          url = url + '&intentionModel=' + $scope.filter.intentionModel;
        } else {
          url = url + '&intentionModel=' + '';
        }
        if($scope.filter.chanceOrigin) {
          url = url + '&chanceOrigin=' + $scope.filter.chanceOrigin;
        } else {
          url = url + '&chanceOrigin=' + '';
        }
        if($scope.filter.dealerId) {
          url = url + '&dealerId=' + $scope.filter.dealerId;
        } else {
          url = url + '&dealerId=' + '';
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

      load();
    });
