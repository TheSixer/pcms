'use strict';

angular.module('pcmsApp')
  .factory('Util', function ($window, $rootScope, $translate, API_END_POINT, $injector) {
    var Util = {
      /**
       * Return a callback or noop function
       *
       * @param  {Function|*} cb - a 'potential' function
       * @return {Function}
       */
      safeCb: function (cb) {
        return (angular.isFunction(cb)) ? cb : angular.noop;
      },

      /**
       * Parse a given url with the use of an anchor element
       *
       * @param  {String} url - the url to parse
       * @return {Object}     - the parsed url, anchor element
       */
      urlParse: function (url) {
        var a = document.createElement('a');
        a.href = url;

        // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
        if (a.host === '') {
          a.href = a.href;
        }

        return a;
      },

      /**
       * Test whether or not a given url is same origin
       *
       * @param  {String}           url       - url to test
       * @param  {String|String[]}  [origins] - additional origins to test against
       * @return {Boolean}                    - true if url is same origin
       */
      isSameOrigin: function (url, origins) {
        url = Util.urlParse(url);
        origins = (origins && [].concat(origins)) || [];
        origins = origins.map(Util.urlParse);
        origins.push($window.location);
        origins = origins.filter(function (o) {
          return url.hostname === o.hostname &&
            url.port === o.port &&
            url.protocol === o.protocol;
        });
        return (origins.length >= 1);
        // return true;
      },

      deleteRow: function (row, grid) {
        var i = grid.options.data.indexOf(row.entity);
        grid.options.data.splice(i, 1);
      },

      // 输出消息
      // 参数 输出消息对象，消息类型，消息编码（参照translate.js）,消息的参数
      putMsg: function (alert, type, code, param) {

        var dup = false;
        for (var i in alert) {
          // null !== undifined
          if (alert[i].type === type && alert[i].code === code && alert[i].param === param) {
            dup = true;
          }
        }
        if (!dup) {
          if (param) {
            $translate(param).then(function (p) {
              alert.push({
                type: type,
                code: code,
                param: {
                  param: p
                }
              });
            });
          } else {
            alert.push({
              type: type,
              code: code,
              param: null
            });
          }
        }

        // console.log(alert);
      },

      // 输出系统信息
      // 参数 消息类型，消息编码（参照translate.js）,消息的参数
      putSysMsg: function (type, code, param) {
        this.putMsg($rootScope.systemAlert, type, code, param);
        // $rootScope.systemAlert = [];

        // if (param) {
        //   $translate(param).then(function(p) {
        //     $rootScope.systemAlert.push({
        //       type: type,
        //       code: code,
        //       param: {
        //         param: p
        //       }
        //     });
        //   });
        // } else {
        //   $rootScope.systemAlert.push({
        //     type: type,
        //     code: code,
        //     param: null
        //   });
        // }

      },

      // 输出页面信息
      // 参数 消息类型，消息编码（参照translate.js）,消息的参数
      putMainMsg: function (type, code, param) {
        this.putMsg($rootScope.mainAlert, type, code, param);
      },

      formatDate: function (date, format) {
        if (!format) {
          // format = 'YYYY-MM-DD HH:mm:ss.SSS';
          format = 'YYYY-MM-DD';
        }
        // format = format.replace(/YYYY/g, date.getFullYear());
        // format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        // format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
        // format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
        // format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
        // format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
        // if (format.match(/S/g)) {
        //   var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        //   var length = format.match(/S/g).length;
        //   for (var i = 0; i < length; i++) {
        //     format = format.replace(/S/, milliSeconds.substring(i, i + 1));
        //   }
        // }
        return moment(date).format(format);
      },

      getValueByCodeOfCodeMaster: function (list, code) {
        for (var i = 0; i < list.length; i++) {
          var obj = list[i];

          if (code === obj.code) {
            return obj.value;
          }
        }
        // code not find
        return code;
      },

      getIdxForUiGrid: function (index,pageNo,pageSize) {
        return (pageNo - 1) * pageSize + index ;
      },

      // 取得当前页面数据
      // 参数 后台取得数据，当前页数，后台页数，每页显示条数，一次从后台取得条数
      getCurrentPageData: function (data, currentPage, backendPage, numPerPage, numPerGet) {

        var rows = [];

        // 行起始位置 如总1-10行则为0-9,总151-160也为0-9
        var rowStart = (currentPage - 1) * numPerPage - (backendPage - 1) * numPerGet;

        for (var i = rowStart; i < rowStart + numPerPage; i++) {
          if (data[i]) {
            rows.push(data[i]);
          }
        }

        // 数据绑定
        return rows;
      },

      // grid行选中
      // 参数 grid数据的数组 选中的行下标
      selectOneRow: function (rows, index) {
        for (var i = 0; i < rows.length; i++) {
          if (i === index) {
            rows[i].selected = true;
          } else {
            rows[i].selected = false;
          }
        }
      },

      // 添加过滤条件
      // 参数 监视变量，原始值，条件输出目标
      getFilterRulesStr: function (watchValue, org, target) {

        for (var filter in watchValue) {
          if (watchValue[filter]) {
            target.push({
              'field': filter,
              'op': 'contains',
              'value': org[filter]
            });
          }
        }
      },

      // 按key排序
      sortByKey: function (array, key) {
        return array.sort(function (a, b) {
          var x = a[key];
          var y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
      },

      //保留两位小数
      //功能：将浮点数四舍五入，取小数点后2位
      toDecimal: function (x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
          return;
        }
        f = Math.round(x * 100) / 100;
        return f;
      },

      // 强制保留2位小数，如：2，会在2后面补上00.即2.00
      toDecimal2: function (x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
          return;
        }
        f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
      },

      //clear tree's selection
      clearTreeSelection: function (treeData) {
        // clear active
        for (var i = 0; i < treeData.length; i++) {
          for (var j = 0; j < treeData[i].child.length; j++) {
            // 只有分类有3层菜单
            treeData[i].child[j].active = false;
          }
          treeData[i].active = false;
        }
      },

      inheritObj: function (o) {
        var F = function () {
        };
        F.prototype = o;
        return new F();
      },

      formatDateToMinTime: function (date) {
        var result = '';
        if (date) {
          var year = date.getFullYear();
          var month = date.getMonth();
          var day = date.getDate();
          result = new Date(year, month, day, 0, 0, 0, 0);
        }
        return result;
      },

      formatDateToMaxTime: function (date) {
        var result = '';
        if (date) {
          var year = date.getFullYear();
          var month = date.getMonth();
          var day = date.getDate();
          result = new Date(year, month, day, 23, 59, 59, 999);
        }
        return result;
      },

      formatDateFromBe:function(dateFromBe){
        if('0000-00-00 00:00:00'.equals(dateFromBe)){
          dateFromBe = null;
        }

        return dateFromBe ? new Date(dateFromBe) : null;
      },

      formatDateToBe:function(dateToBe){
        return dateToBe ? Util.formatDate(dateToBe, 'YYYY-MM-DD') : '';
      },

      isStored: function (key) {
        var userService = $injector.get('userService');
        var localStorageService = $injector.get('localStorageService');

        // 用户登录否，浏览器支持否，localStorage中存在否
        if (userService.isLogin() && localStorageService.isSupported && localStorageService.get(key)) {
          return true;
        } else {
          return false;
        }
      },

      isEmpty: function (val) {
        var isEmpty = false;

        if (val === null || val === undefined || val === '') {
          isEmpty = true;
        }

        return isEmpty;
      },

      isNotEmpty: function (val) {
        var isNotEmpty = false;

        if (val !== null && val !== undefined && val !== '') {
          isNotEmpty = true;
        }

        return isNotEmpty;
      },

      exportFromUrl:function(url){
        var userService = $injector.get('userService');
        var state = $injector.get('$state');

        if(url){
          url = API_END_POINT.url + url;

          if (userService.isLogin()) {
            if(url.lastIndexOf('?') !== -1){
              url += '&';
            } else{
              url += '?';
            }

            url += 'token=' + userService.getAuth().token;
          } else {
            state.go('login');
          }

          $window.open(url);
        }
      },

      printFromUrl:function(url){
        this.exportFromUrl(url);
      },

      getSelectTextByValue:function(list,valueKey,value,textKey){
        for(var objKey in list){
          var obj = list[objKey];

          if(Util.isNotEmpty(value) && value.equals(obj[valueKey])){
            return obj[textKey];
          }
        }
      },

      convertForFlgDisplay : function (val) {
        return Util.isNotEmpty(val) && '0'.notEquals(val) ? '1' : '0';
      }
    };

    return Util;
  });
