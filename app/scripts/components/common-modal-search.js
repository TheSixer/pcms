'use strict';

/**
 * 通用组件
 * 用于有查询,选中一条数据的模态框
 * added by Lijie 20161118
 */

angular.module('pcmsApp')
  .factory('CommonModalSearch', function(PAGE_CONST, Util) {

    return function(param) {
      var that = {};

      // 页面错误信息
      that.alerts = [];

      // 过滤器
      that.filter = {};
      that.filterRules = [];

      // 数据表格对象
      that.grid = {};
      // 后端取得数据
      that.grid.data = [];
      // 前端显示的数据
      that.grid.rows = [];
      // 当前页(后端)
      that.backendPage = 1;
      // 当前页(前端)
      that.currentPage = 1;
      // 数据的总件数
      that.totalItems = 0;
      // 每页的数据件数
      that.numPerPage = PAGE_CONST.pageList[1];
      // 一次从后台取得的数据件数
      that.numPerGet = PAGE_CONST.numPerGet;
      that.pageList = PAGE_CONST.pageList;

      // 格式化数据
      that.formatData = function(rows, backendPage, pageSize) {

        // 初始化
        this.grid.data = [];

        // 数据不存在
        if(!rows) {
          return;
        }

        //分页行数
        for (var i = 0; i < rows.length; i++) {
          // 添加No.
          rows[i].no = i + 1 + (backendPage - 1) * pageSize;

        }
        this.grid.data = rows;
      };

      // 查询条件
      that.execFilter = function(key, value, event) {
        // 回车
        if (event) {
          if (event.keyCode === 13) {
            // 过滤条件保存
            this.filterWatch[key] = value;
          }
        } else {
          // 过滤条件保存
          this.filterWatch[key] = value;
        }
      };

      //加载数据
      that.load = function() {
        // 根据前页面参数过滤
        for (var key in this.filter) {
          this.execFilter(key, this.filter[key]);
        }
      };

      // 查询(参数:页面页数,是否强制刷新)
      that.query = function(isRefresh) {

        // 前台表示页的起始和终止
        var pageStart = 1 + (this.backendPage - 1) * this.numPerGet / this.numPerPage;
        var pageEnd = this.backendPage * this.numPerGet / this.numPerPage;

        if (!isRefresh && this.grid.data.length > 0 && this.currentPage >= pageStart && this.currentPage <= pageEnd) {
          // 前端数据过滤
          this.grid.rows = Util.getCurrentPageData(this.grid.data, this.currentPage, this.backendPage, this.numPerPage, this.numPerGet);

        } else {
          // 后台获取数据

          // 强制刷新则从头显示
          if (isRefresh) {
            this.currentPage = 1;
          }

          // 后台页数
          this.backendPage = Math.ceil(this.currentPage * this.numPerPage / this.numPerGet);

          // 数据取得
          param.getData();
        }
      };

      // 清除过滤条件
      that.clearFilter = function(flg) {

        if (this.filter[flg]) {
          this.filter[flg] = '';
          this.execFilter(flg, this.filter[flg]);
        }
      };

      // 确定
      that.ok = function() {
        this.alerts = [];

        for (var i = 0; i < this.grid.rows.length; i++) {
          if (this.grid.rows[i].selected === true) {
            return this.$close(this.grid.rows[i]);
          }
        }
        // 请选择一行。
        Util.putMsg(this.alerts, 'warning', '2002');
      };

      // 取消
      that.cancel = function() {
        this.$dismiss('cancel');
      };

      // table行选中
      that.selectRow = function(index) {
        Util.selectOneRow(this.grid.rows, index);
      };

      return that;
    };
  });
