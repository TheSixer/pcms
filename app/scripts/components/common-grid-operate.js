'use strict';

/**
 * 通用组件
 * 用于有增删改的gird，提供删除，选中等方法
 * added by Lijie 20161118
 */

angular.module('pcmsApp')
  .factory('CommonGridOperate', function($confirm, Util) {

    return function() {
      var that = {};

      // 初始化mainform
      that.clearMainform = function() {
        for (var idx in this.main) {
          this.main[idx] = '';
        }
      };

      // 初始化grid的数据源
      that.clearGridData = function() {
        // 各种grid的数据源
        for (var idx in this.data) {
          this.data[idx] = [];
        }
      };

      // 数据选中
      that.selectGridData = function(index, data) {

        for (var i = 0; i < data.length; i++) {
          if (i === index) {
            data[i].isSelect = !!!data[i].isSelect;
          } else {
            data[i].isSelect = false;
          }
        }
      };

      // 取选中的下标
      that.getSelectIndex = function(data) {
        var selectIdx = -1;
        for (var i = 0; i < data.length; i++) {
          if (data[i].isSelect) {
            selectIdx = i;
          }
        }

        return selectIdx;
      };

      // 删除选中的数据
      that.deleteGridData = function(data) {

        var selectIdx = this.getSelectIndex(data);
        // 有选中的
        if (selectIdx >= 0) {

          // 呼出modal
          var modal = {};
          modal.text = '确认删除吗？';
          modal.title = '删除';

          $confirm(modal, {
              size: 'sm'
            })
            .then(function() {
              data.splice(selectIdx, 1);
            });
        } else {

          // 请选择一行。
          Util.putMainMsg('warning', '2002');
        }
      };

      return that;
    };
  });
