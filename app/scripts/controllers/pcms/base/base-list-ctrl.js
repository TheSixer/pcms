'use strict';

/**
 * 【列表】 常用的操作封装   父 controller
 *
 *
 * //最后可传入自定义的配置项
 * config {
 *  formatData(row, n)
 *  queryPromiseAlias
 *  CRUDServicesMethodName
 *  filter
 *  //从后台拿到的原数据 (当数据载入成功时触发。)
 *  onLoadSuccess (result)
 *  //在请求载入数据之前触发
 *  onBeforeLoad (param)
 * }
 */
angular.module('pcmsApp')
  .controller('BaseListCtrl', function ($scope, $injector, CRUDServices, config) {
    var Util = $injector.get('Util');
    var pageConst = $injector.get('PAGE_CONST');
    //可自定义的配置
    config = config || {};
    //function : config.formatData  //格式化数据的函数
    config.queryPromiseAlias = config.queryPromiseAlias || 'queryPromise';
    config.CRUDServicesMethodName =  config.CRUDServicesMethodName || 'query';
    //Object: config.filter  //查询过滤参数
    //function: config.onLoadSuccess ()

    // 数据表格对象
    $scope.grid = {
      data: [], //后端取得数据
      rows: []  //前端显示的数据
    };

    //查询过滤条件（api)
    $scope.filter = config.filter || {};
    // 当前页(后端)
    $scope.backendPage = 1;
    // 当前页(前端)
    $scope.currentPage = 1;

    // 一次从后台取得的数据件数
    $scope.numPerGet = pageConst.numPerGet;

    // 前端（每页显示数据数）下拉列表 list
    $scope.pageList = pageConst.pageList;
    // 每页的数据件数
    $scope.numPerPage = $scope.pageList[0];
    // 数据的总件数
    $scope.totalItems = 0;



    // 格式化数据
    var formatData = function (rows, backendPage, pageCount) {
      _.forEach(rows, function (row, n) {
        row.no = n + 1 + (backendPage - 1) * pageCount;

        //自定义的格式化数据
        if(config.formatData){
          config.formatData(row, n);
        }
        // row.operationTime = new Date(row.operationTime);
      });
    };


    //格式化统计数据
    var formatstatistData = function(result,key) {

        var statisticarr = [];

        if(result[key].hasOwnProperty('message')) {
          delete result[key].message;
        }

        for (var i in result[key]) {
            var obj = {};
            for (var j in result) {
                if (typeof result[j] === 'object') {
                  if(result[j][i] === undefined) {
                    obj[j] = '';
                  } else {
                    obj[j] = result[j][i];
                  }
                  obj.date = i;
                }
            }
        statisticarr.push(obj);
    }

      return {
          code:200,
          data:{

              list:statisticarr,
              total:statisticarr.length
          }

      };

    };

      var formateDate = function(queryobj)
      {
          var obj = {};
          Object.assign(obj,queryobj);

          if(queryobj.hasOwnProperty('startDate')) {
            obj.startDate = moment(queryobj.startDate).format('YYYY-MM-DD');
          }

          if(queryobj.hasOwnProperty('endDate')) {
            obj.endDate = moment(queryobj.endDate).format('YYYY-MM-DD');
          }

          return obj;
      };


    var loadData = function () {
      var param = {
        pageSize:$scope.numPerGet, //每页条数
        pageNo:$scope.backendPage //页数
      };





      //加上过滤查询条件
      //angular.merge(param, formateDate($scope.filter));
      //angular.merge(param, $scope.filter);


      if(config.onBeforeLoad){
        config.onBeforeLoad(param);
      }
      $scope[config.queryPromiseAlias] = CRUDServices[config.CRUDServicesMethodName](param, function (result) {
        //格式化数据


          if(result.data === undefined)
          {
              var obj = formatstatistData(result,'date');
              Object.assign(result,obj);
          }


        formatData(result.data.list, param.pageNo, param.pageSize);
        if(config.onLoadSuccess) {
          config.onLoadSuccess(result);
        }
        $scope.grid.data = result.data.list;
        $scope.grid.rows = Util.getCurrentPageData($scope.grid.data, $scope.currentPage, $scope.backendPage, $scope.numPerPage, $scope.numPerGet);
        $scope.totalItems = result.data.total;
      });
      return $scope[config.queryPromiseAlias];
    };


    // 查询(参数:是否强制刷新)
    $scope.dataQuery = function (isRefresh) {

      // 前台表示页的起始和终止
      var pageStart = 1 + ($scope.backendPage - 1) * $scope.numPerGet / $scope.numPerPage;
      var pageEnd = $scope.backendPage * $scope.numPerGet / $scope.numPerPage;

      if (!isRefresh && $scope.grid.data.length > 0 && $scope.currentPage >= pageStart && $scope.currentPage <= pageEnd) {
        // 前端数据过滤
        $scope.grid.rows = Util.getCurrentPageData($scope.grid.data, $scope.currentPage, $scope.backendPage, $scope.numPerPage, $scope.numPerGet);

      } else {
        // 强制刷新则从头显示
        if (isRefresh) {
          $scope.currentPage = 1;
        }
        // 后台页数
        $scope.backendPage = Math.ceil($scope.currentPage * $scope.numPerPage / $scope.numPerGet);
        // do查询数据
        return loadData();
      }
    };
  });
