'use strict';

angular.module('pcmsApp')
  .factory('transformRequestAsFormPost', function() {
    function serializeData(data) {
      var source = '';
      if (!angular.isObject(data)) {
        source = (data === null || data === undefined) ? '' : data.toString();
      } else {
        var buffer = [];

        for (var name in data) {
          if (!data.hasOwnProperty(name)) {
            continue;
          }

          var value = data[name];

          if (angular.isObject(value)) {
            value = angular.toJson(value);

            buffer.push(
              encodeURIComponent(name) +
              '=' +
              encodeURIComponent(value));
          } else {
            buffer.push(
              encodeURIComponent(name) +
              '=' +
              ((value === null || value === undefined) ? '' : encodeURIComponent(value))
            );
          }
        }

        source = buffer.join('&').replace(/%20/g, '+');
      }

      // var result = ((source === '') ? 'sign=' : '&sign=') + md5.createHash(source).substring(0, 16);
      var result = '';
      return (source + result);
    }

    function transformRequest(data) {
      // var headers = getHeaders();
      // headers['Content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';

      return (serializeData(data));
    }

    return (transformRequest);
  })
  // .service('sessionService', [
  //   function() {
  //     var history = [];
  //
  //     this.getHistory = function() {
  //       this.history = angular.fromJson(sessionStorage.history);
  //       var thisHistory = history.pop();
  //       sessionStorage.history = angular.toJson(this.history);
  //       return thisHistory;
  //     };
  //
  //     this.setHistory = function(key, value) {
  //       if (history.length > 9) {
  //         history.shift();
  //       }
  //       history.push({
  //         key: key,
  //         value: value
  //       });
  //       sessionStorage.history = angular.toJson(this.history);
  //     };
  //   }
  // ])
  .service('codeMasterService',
    function($http, CommonApi, Util, localStorageService, getArea, TICKET) {

      function getCodeMaster(codeMasterAll, keys, isAddBlank) {
        var key;
        // 空元素
        var blank = {
          "code": '',
          "value": '',
          "sort": 0
        };
        // 选择条件存在
        if (keys) {
          var codeMasterPart = {};
          var keyList = keys.split(',');

          // 遍历key
          for (var i = 0; i < keyList.length; i++) {
            // 遍历codeMaster
            for (key in codeMasterAll) {
              // 匹配
              if (keyList[i] === key) {
                var each = codeMasterAll[key];
                // 在头上加空行
                if (isAddBlank) {
                  each.unshift(blank);
                }
                codeMasterPart[key] = each;
              }
            }
          }

          return codeMasterPart;

        } else {
          var list = codeMasterAll;
          // 是否在头上加空行
          if (isAddBlank) {
            // 遍历codeMaster
            for (key in list) {
              list[key].unshift(blank);
            }
          }
          return list;
        }
      }

      var formatCodeMaster = function (param) {
        var data = [];
        var codeMaster = {};
        var num = 0,flag = false;
        data[0] = param[0].type;
        for(var i in param) {
          flag = false;
          for(var j in data) {
            if(data[j] === param[i].type) {
              flag = true;
            }
          }
          if(!flag) {
            data[data.length] = param[i].type;
          }
        }
        for(var k in data) {
          num = 0;
          codeMaster[data[k]] = [];
          for(var n in param) {
            if(data[k] === param[n].type) {
              var codeData = {};
              codeData.code = param[n].code;
              codeData.value = param[n].remark;
              codeData.sort = param[n].order;
              codeMaster[data[k]][num] = codeData;
              num++;
            }
          }
        }
        return codeMaster;
      };

      // 参数1 编码类型名,复数,逗号分隔,如‘offset_type,origin’
      // 参数2:bool, 是否在头上加空行
      // 无参数则返回全部
      this.get = function(keys, isAddBlank) {
        var codeMaster = {};
        var codeMasterAll = {};

        // localStorage中不存在就取得
        if (Util.isStored('haimaCodeMaster')) {
          // localStorage中取得icon信息
          codeMasterAll = localStorageService.get('haimaCodeMaster');
          codeMaster = getCodeMaster(codeMasterAll, keys, isAddBlank);
          return codeMaster;
        } else {
          // 存储area信息
          getArea.getAll({act:'get_area_all', ticket:TICKET}, function (resp) {
            localStorageService.set('haimaArea', resp);
          });
          // 取得图标信息
          CommonApi.getAll({},function(result) {
            if (result.data) {
              codeMasterAll = formatCodeMaster(result.data);
              localStorageService.set('haimaCodeMaster', codeMasterAll);
              codeMaster = getCodeMaster(codeMasterAll, keys, isAddBlank);
              return codeMaster;
            }
          });
          // codeMasterAll = CODE_MASTER;
          // localStorageService.set('haimaCodeMaster', codeMasterAll);
          // codeMaster = getCodeMaster(codeMasterAll, keys, isAddBlank);
          // return codeMaster;
        }
      };
    })
  .service('sendRequest', ['$http', '$rootScope', '$state', 'transformRequestAsFormPost', 'Util', 'localStorageService',
    function($http, $rootScope, $state, transformRequestAsFormPost, Util, localStorageService) {
      var successCb = function(result, callback) {
        console.log(result);
        if (result) {
          if (result.code && (result.code !== 0 && result.code !== '0' && result.code !== 200 && result.code !== '200')) {
            if (result.code === 10006 || result.code === 10007) {
              Util.putSysMsg('danger', result.code);
              // 清除localStorage
              localStorageService.clearAll();

              $state.go('login');
            }
            callback(result);
          } else {
            callback(result);
          }
        } else {
          Util.putSysMsg('danger', '400');
          callback(null, '400');
        }
      };

      var errorCb = function(result, header, config, status) {
        console.log(result);
        console.log(header);
        console.log(config);
        console.log(status);
        // callback(result);
      };

      var resultCb = function(request, callback) {
        return request
          .success(function(result) {
            successCb(result, callback);
          })
          .error(function(result, header, config, status) {
            errorCb(result, header, config, status);
          });
      };

      this.send = function(url, method, data, callback) {
        var request = $http({
          method: method,
          url: url,
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              // 'Content-Type': 'application/json;charset=UTF-8'
          }
        });

        return resultCb(request, callback);

      };

      this.send2Java = function(url, method, data, callback) {
        var request = $http({
          method: method,
          url: url,
          transformRequest: transformRequestAsFormPost,
          data: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        });

        return resultCb(request, callback);

      };

      this.upload = function(url, method, fd, callback) {
        var request = $http({
          method: method,
          url: url,
          transformRequest: null,
          data: fd,
          headers: {
            'Content-Type': undefined
          }
        });

        return resultCb(request, callback);
      };
    }
  ]);
