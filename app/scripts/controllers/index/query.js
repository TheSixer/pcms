'use strict';

/**
 * 通用query页面
 * added by Lijie
 * @name pcmsApp.controller:QueryCtrl
 * @description
 * # QueryCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('QueryCtrl', ['$scope', '$stateParams', '$state', '$window', 'Util', 'PAGE_CONST', 'PublicApi', 'QueryApi',
    function ($scope, $stateParams, $state, $window, Util, PAGE_CONST, PublicApi, QueryApi) {

      //初始化页面RadioBox下拉框等
      var init = function () {
        // console.log($stateParams);
        // 页面显示的表头
        $scope.tableHead = [];
        // 数据的表头
        $scope.dataHead = [];
        // 表格标题
        $scope.tableTitle = '';
        // 经销商id
        $scope.dealerId = '';
        // 前端查询条件组
        $scope.filters = [];
        // 数据表格对象
        $scope.grid = {};
        // 当前页数据
        $scope.grid.rows = [];
        // 后端取得数据
        $scope.grid.data = [];
        // 当前页(前端)
        $scope.currentPage = 1;
        // 当前页(后端)
        $scope.backendPage = 1;
        // 数据的总件数
        $scope.totalItems = 0;
        // 每页的数据件数
        $scope.numPerPage = PAGE_CONST.pageList[1];
        // 一次从后台取得的数据件数
        $scope.numPerGet = PAGE_CONST.numPerGet;
        $scope.pageList = PAGE_CONST.pageList;

      };
      init();

      //加载数据
      var load = function () {
        var data = {};
        // query的参数p
        if ($scope.data) {
          data.p = $scope.data.p;
        } else {
          data.p = $stateParams.p;
        }

        $scope.promise = QueryApi.getQueryCondition(data, function (result) {
          if (result) {
            // 表头
            if (result.columnJson) {
              // 页面显示用的表头
              $scope.tableHead = getTableHead(result);
              // console.log($scope.tableHead);
              // 取得实际的数据列标题
              $scope.dataHead = getDataHead();
              // console.log($scope.dataHead);
            }

            // 经销商id
            $scope.dealerId = result.dealer_id;

            // 前端查询条件组取得
            getFilters(result.rows);
          }
        });
      };
      load();

      // 报表数据取得
      var getReportData = function (condition) {
        // query api调用
        $scope.promise = QueryApi.getReportData(condition, function (result) {
          if (result) {
            // 取得数据处理 result->grid.data
            formatGridData(result, $scope.backendPage);

            // 前端数据过滤
            $scope.grid.rows = Util.getCurrentPageData($scope.grid.data, $scope.currentPage, $scope.backendPage, $scope.numPerPage, $scope.numPerGet);

            // 总数
            $scope.totalItems = result.total;

          }
        });
      };

      // 表头处理，增加No列
      var getTableHead = function (result) {
        var tableHead = [];
        tableHead = angular.fromJson(result.columnJson);

        // No列
        var head = {};
        head.align = 'center';
        head.colspan = 1;
        head.field = 'No';
        head.rowspan = tableHead.length;
        head.title = 'No';

        tableHead[0].unshift(head);
        return tableHead;
      };

      // 取得表头的实际值
      // 按照页面表头从左到右，从上到下的顺序遍历，取得匹配数据的表头，并且记录位置信息
      var getDataHead = function () {
        var dataHead = [];
        // 带位置信息的表头
        var sortHead = {};
        // 前一行及以前的表头，用来定位
        var historyHead = {};
        var headLength = $scope.tableHead.length;

        // 单行表头
        if ('1'.equals(headLength)) {
          dataHead = angular.copy($scope.tableHead[0]);
        } else {
          // 遍历多行表头
          for (var i = 0; i < $scope.tableHead.length; i++) {
            // 列位置
            var col = 0;

            // 列遍历
            for (var j = 0; j < $scope.tableHead[i].length; j++) {
              var head = angular.copy($scope.tableHead[i][j]);
              // colspan默认为1
              if (!head.colspan) {
                head.colspan = 1;
              }
              // 列定位
              col = col + head.colspan;

              // 非最后一行则看rowspan，或者最后一行
              if ((i < headLength - 1 && head.rowspan && head.rowspan === (headLength - i) && '1'.equals(head.colspan)) || (i === headLength - 1)) {

                // 根据历史行数据 计算列偏移量
                var colOffset = 0;
                for (var k in historyHead) {
                  if (k <= col) {
                    colOffset++;
                  }
                }
                // 设置带位置的表头
                setSortHead(sortHead, head, col + colOffset);
              }
            }

            // 保存前次head对象，用来取列偏移量
            historyHead = angular.copy(sortHead);
          }

          // 从带位置的表头中取得
          for (var x in sortHead) {
            dataHead.push(sortHead[x]);
          }
        }

        return dataHead;
      };

      // 递归向对象中插值-存在则key+1，值存储在下一个key上
      var setSortHead = function (targetObj, obj, col) {
        if (targetObj[col]) {
          setSortHead(targetObj, obj, col + 1);
        } else {
          targetObj[col] = obj;
          return;
        }
      };

      // 取得前端查询条件组
      var getFilters = function (rows) {
        for (var idx in rows) {
          // 表格标题
          if (!$scope.tableTitle) {
            $scope.tableTitle = rows[idx].title;
          }
          // 前端查询条件
          var filter = {};
          filter.title = rows[idx].fieldDisplayName;
          filter.model = {};
          filter.sortNum = rows[idx].sort_num;
          filter.operator = rows[idx].operator;
          filter.idname = 'item' + idx;
          // 控制条件解析
          var optionObj = {};
          if (rows[idx].easyuioption) {
            // console.log(rows[idx].easyuioption);
            // 数据格式化成Object的属性
            var str = '';
            if ('{'.equals(rows[idx].easyuioption.substring(0, 1))) {
              str = rows[idx].easyuioption;
            } else {
              str = '{' + rows[idx].easyuioption + '}';
            }
            str = str.replace(/\'/g, '"').replace(/title/g, '"title"').replace(/href/g, '"href"').replace(/prompt/g, '"prompt"').replace(/required/g, '"required"').replace(/validType/g, '"validType"');
            optionObj = JSON.parse(str);
          }
          // 必须输入
          if ('true'.equals(optionObj.required)) {
            filter.required = true;
          }

          switch (rows[idx].controller_type) {
            case 'date':
              filter.errMsg = '请按照指定格式输入时间。例如:2016-01-01';
              filter.type = rows[idx].controller_type;
              break;
            case 'dialog':
              // 弹出框
              filter.type = 'dialog';
              // 不存在设置信息就当text框
              if (!rows[idx].easyuioption) {
                filter.type = 'text';
                break;
              }
              filter.sourceData = optionObj;
              break;
            case 'num':
              filter.type = 'number';
              if (rows[idx].defaultValue) {
                filter.model.value = parseInt(rows[idx].defaultValue);
              }
              break;
            case 'url':
              filter.type = 'url';
              if (rows[idx].defaultValue) {
                filter.model.value = rows[idx].defaultValue;
              }
              filter.errMsg = '请按照正确的格式输入网址。';
              break;
            case 'dropdown':
              filter.type = 'select';
              filter.sourceData = [];
              // 设置下拉框的内容
              var sel = getSelectData(rows[idx].easyuioption, filter.sourceData, rows[idx].defaultValue);
              filter.model.value = filter.sourceData[sel];
              // console.log(filter.model.value);
              break;
            default:
              filter.type = rows[idx].controller_type;

              if (rows[idx].defaultValue) {
                filter.model.value = rows[idx].defaultValue;
              }
          }

          $scope.filters.push(filter);
        }
      };

      // 取得下拉框的数据,返回值:选中行
      var getSelectData = function (source, target, defaultValue) {
        var sData;
        // 选中行
        var selectIdx = 1;
        // 增加空行
        var iid = 1;
        var obj = {
          id: iid,
          value: ''
        };
        target.push(obj);

        try {
          // easyuioption里各种奇葩类型
          if (source) {
            if (angular.fromJson(source).data) {
              sData = angular.fromJson(source).data;
            } else if (angular.fromJson(source).url) {
              // ajax取得
              // public api调用
              var data = {};
              data.url = angular.fromJson(source).url;
              $scope.promise = PublicApi.getPublicData(data, function (result) {
                if (result) {
                  sData = angular.copy(result);

                  // 下拉框数据
                  for (var i in sData) {

                    obj = {};
                    obj.id = ++iid;
                    obj.value = sData[i].name;
                    target.push(obj);

                    // 默认选中
                    if (sData[i].name === defaultValue) {
                      selectIdx = iid - 1;
                    }
                  }
                  return selectIdx;
                }
              });

            } else {
              sData = angular.fromJson(source);
            }
          }

          // 下拉框数据
          for (var i in sData) {
            // 跳过空行
            if ('&nbsp;'.equals(sData[i])) {
              continue;
            }

            obj = {};
            obj.id = ++iid;
            obj.value = sData[i];
            target.push(obj);

            // 默认选中
            if (sData[i] === defaultValue) {
              selectIdx = iid - 1;
            }
          }
        } catch (err) {
          selectIdx = 0;
        }
        return selectIdx;
      };

      // 做成后端用查询条件
      var getQueryData = function (page) {
        var data = {};
        // page区分
        data.p = $stateParams.p;
        // 经销商id
        data.dealerId = $scope.dealerId;
        data.title = $scope.tableTitle + '&';

        for (var idx in $scope.filters) {
          var value = '';

          if (!$scope.filters[idx].model.value) {
            continue;
          }
          // console.log($scope.filters[idx].model.value);

          switch ($scope.filters[idx].type) {
            case 'date':
              value = Util.formatDate($scope.filters[idx].model.value, 'YYYY-MM-DD');
              break;
            case 'select':
              value = $scope.filters[idx].model.value.value;
              break;
            default:
              value = $scope.filters[idx].model.value;
          }

          if (value) {
            data.title += '&' + $scope.filters[idx].sortNum + '=' + value;
          }
        }
        data.page = page;
        data.rows = $scope.numPerGet;
        return data;
      };

      // 取得数据渲染到页面上，根据列标题匹配
      var formatGridData = function (result, backendPage) {
        // 初始化
        $scope.grid.data = [];

        //分页行数
        for (var i = 0; i < result.rows.length; i++) {

          var dataRow = [];
          // 添加No.
          dataRow.push({
            id: 0,
            value: i + 1 + (backendPage - 1) * $scope.numPerGet
          });

          // 按照table的列顺序查找
          for (var j in $scope.dataHead) {
            var cell = {};
            cell.id = j;
            for (var key in result.rows[i]) {

              // 取得数据和列标题匹配
              if (key === $scope.dataHead[j].field) {
                cell.value = result.rows[i][key];
                dataRow.push(cell);
                break;
              }
            }
          }
          $scope.grid.data.push(dataRow);
          // console.log(dataRow);
        }
      };

      // 查询(参数:页面页数,是否强制刷新)
      $scope.query = function (isRefresh) {
        // 前台表示页的起始和终止
        var pageStart = 1 + ($scope.backendPage - 1) * $scope.numPerGet / $scope.numPerPage;
        var pageEnd = $scope.backendPage * $scope.numPerGet / $scope.numPerPage;

        if (!isRefresh && $scope.grid.data.length > 0 && $scope.currentPage >= pageStart && $scope.currentPage <= pageEnd) {
          // 前端数据过滤
          $scope.grid.rows = Util.getCurrentPageData($scope.grid.data, $scope.currentPage, $scope.backendPage, $scope.numPerPage, $scope.numPerGet);

        } else {
          // 后台获取数据

          // 强制刷新则从头显示
          if (isRefresh) {
            $scope.currentPage = 1;
          }

          // 后台页数
          $scope.backendPage = Math.ceil($scope.currentPage * $scope.numPerPage / $scope.numPerGet);

          // 后端查询条件取得
          var condition = getQueryData($scope.backendPage);

          getReportData(condition);
        }
      };

      // excel输出
      $scope.exportExcel = function (href, print) {
        // 后端查询条件取得
        var condition = getQueryData($scope.backendPage);
        // console.log(condition);

        var url = '/index/Index/report?p=' + $stateParams.p + '&dealer_id=' + $scope.dealerId + '&print=' + print + '&excel=' + '&title=' + condition.title;

        if ('1'.equals(print)) {
          $window.open(url);
        } else {
          // Util.exportFromUrl(url);
          $window.location.href = url;
        }
      };

      // 刷新页面
      $scope.refresh = function () {
        // $state.go($state.current, {}, {reload: true});
        $state.reload();
      };
    }
  ]);
