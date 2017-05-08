'use strict';

/**
 * 通用组件
 * 用于有ui-grid的页面
 * added by Xuyq 20161118
 */

angular.module('pcmsApp')
  .factory('HybridUiGrid', function (PAGE_CONST,$injector) {

    return function () {
      var mHybridObj = {};

      //当前页数(前台)
      mHybridObj.fePageNo = 1;
      //当前页数(后台)
      mHybridObj.bePageNo = 1;
      //分页数(前台)
      // mHybridObj.fePageSize = PAGE_CONST.pageList[1];  //init时不再需要设置fePageSize的初始值
      //分页数(后台)
      mHybridObj.bePageSize = PAGE_CONST.numPerGet;
      //数据总数
      mHybridObj.totalItems = 0;
      //前台数据缓存对象
      mHybridObj.feData = [];
      //查询条件对象
      mHybridObj.filter = {};
      // 页面错误信息
      mHybridObj.alerts = [];

      mHybridObj.htmlId = 'grid';
      mHybridObj.useAutoFitHeight = true;
      mHybridObj.rowHeight = 30;
      mHybridObj.titleHeight = 30;
      mHybridObj.pagingHeight = 45;
      mHybridObj.horizonScrollbarHeight = 5;

      mHybridObj.selectedRow = {};

      mHybridObj.gridOptions = {
        enableRowSelection: true,        // 能否选择行
        enableRowHeaderSelection: false,  // 每行头部的勾选图标是否显示
        enableSelectAll: false,           // 能否全选
        multiSelect: false,               // 多选
        noUnselect: true,                // 只允许切换对行的选中,而不允许取消对行的选中
        enableSorting: false,             // 是否允许排序
        enableFiltering: false,           // 是否显示过滤器
        paginationPageSizes: PAGE_CONST.pageList,     // 分页下拉列表
        paginationPageSize: PAGE_CONST.pageList[1],   // 默认每页行数
        useExternalPagination: true,      // 是否使用外部分页
        useExternalSorting: false         // 是否使用外部排序
      };

      //本处理
      mHybridObj.getData = function () {
        console.log('hybridObj.isOverFeRange:', mHybridObj.isOverFeRange());

        mHybridObj.fePageSize = mHybridObj.gridOptions.paginationPageSize;

        if (mHybridObj.isOverFeRange()) {
          // 当请求的数据范围超过前端缓存的数据范围时,从API端获取数据
          return mHybridObj.getDataFromBe();
        } else {
          // 当请求的数据范围未超过前端缓存的数据范围时,从前端缓存中获取数据
          mHybridObj.getDataFromFe();
        }
      };

      //从前台缓存中获取数据(本处理)
      mHybridObj.getDataFromFe = function () {
        var rows = [];

        // 行起始位置 如总1-10行则为0-9,总151-160也为0-9
        var rowStart = (mHybridObj.fePageNo - 1) * mHybridObj.fePageSize - (mHybridObj.bePageNo - 1) * mHybridObj.bePageSize;

        for (var i = rowStart; i < rowStart + mHybridObj.fePageSize; i++) {
          if (mHybridObj.feData[i]) {
            rows.push(mHybridObj.feData[i]);
          }
        }

        mHybridObj.gridOptions.data = rows;
        mHybridObj.gridOptions.totalItems = mHybridObj.totalItems;

        if(mHybridObj.useAutoFitHeight){
          mHybridObj.autoFitHeight();
        }
      };

      //从后台API端获取数据(本处理)
      mHybridObj.getDataFromBe = function () {
        // 查询参数设置
        var filter = mHybridObj.processBeforeGetDataFromBe();

        return mHybridObj.beApi(filter, function (result) {
          mHybridObj.processAfterGetDataFromBe(result);
        });
      };

      //从API端获取数据(本处理)前,对filter的共通处理
      mHybridObj.processBeforeGetDataFromBeCommon = function () {
        var mFilter = angular.copy(mHybridObj.filter) || {};

        // 计算本次请求的后台页数
        mFilter.pageNo = mHybridObj.calcBePageNoBeforeGetDataFromBe();
        mFilter.pageSize = mHybridObj.bePageSize;

        return mFilter;
      };

      //从API端获取数据(本处理)后,对result的共通处理
      mHybridObj.processAfterGetDataFromBeCommon = function (rows, total) {
        mHybridObj.feData = rows;
        mHybridObj.totalItems = total;
        mHybridObj.bePageNo = mHybridObj.calcBePageNoBeforeGetDataFromBe();

        mHybridObj.calcIdx();
        mHybridObj.getDataFromFe();
      };

      mHybridObj.calcIdx = function (){
        var Util = $injector.get('Util');

        var bePageNo = mHybridObj.bePageNo;
        var bePageSize = mHybridObj.bePageSize;

        for(var i = 0;i < mHybridObj.feData.length;i ++){
          mHybridObj.feData[i].idx = Util.getIdxForUiGrid(i + 1,bePageNo,bePageSize);
        }
      };

      //判断页面请求的数据,是否超过了前台缓存的数据范围
      mHybridObj.isOverFeRange = function () {
        var isOverFeRange = false;

        if (!mHybridObj.feData || mHybridObj.feData.length === 0) {
          isOverFeRange = true;
        } else if (mHybridObj.fePageNo * mHybridObj.fePageSize > mHybridObj.bePageNo * mHybridObj.bePageSize) {
          isOverFeRange = true;
        } else if (mHybridObj.fePageNo * mHybridObj.fePageSize <= (mHybridObj.bePageNo - 1) * mHybridObj.bePageSize) {
          isOverFeRange = true;
        }

        return isOverFeRange;
      };

      //计算API端请求时的起始页数
      mHybridObj.calcBePageNoBeforeGetDataFromBe = function () {
        return Math.ceil(mHybridObj.fePageNo * mHybridObj.fePageSize / mHybridObj.bePageSize);
      };

      //换页时的处理
      mHybridObj.onPaginationChanged = function (newPage, pageSize) {
        mHybridObj.fePageNo = newPage;
        mHybridObj.fePageSize = pageSize;
        return mHybridObj.getData();
      };

      var calcGridHeight = function(){
        return mHybridObj.fePageNo * mHybridObj.fePageSize <= mHybridObj.gridOptions.totalItems ? mHybridObj.fePageSize : Math.floor(mHybridObj.gridOptions.totalItems % mHybridObj.fePageSize);
      };

      mHybridObj.autoFitHeight = function () {
        var displayNum = calcGridHeight();
        var newHeight = displayNum * mHybridObj.rowHeight + mHybridObj.titleHeight + mHybridObj.pagingHeight + mHybridObj.horizonScrollbarHeight;

        var mHybridAngularObj = angular.element(document.querySelector('#' + mHybridObj.htmlId));
        mHybridAngularObj.css('height', newHeight + 'px');
      };

      mHybridObj.initForNoPaging = function () {
        mHybridObj.bePageSize = 9999999;
        mHybridObj.gridOptions.paginationPageSize = mHybridObj.bePageSize;
        mHybridObj.useAutoFitHeight = false;
      };

      mHybridObj.selectRow = function (key, keyVal, row) {
        if (keyVal && keyVal === row.entity[key]) {
          mHybridObj.gridApi.selection.selectRow(row.entity);
        }
      };

      return mHybridObj;
    };
  });
