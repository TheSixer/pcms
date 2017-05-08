'use strict';

/**
 * @ngdoc function
 * @name pcmsApp.controller:PotentialCustomerEntity
 * @description
 * # PotentialCustomerEntity
 * factory of the pcmsApp
 */

angular.module('pcmsApp')
  .factory('PotentialCustomerEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/potentialCustomer/:id',
      // 'http://172.16.20.220:8080/scrm/customer/:id',
      {id: '@pcId'}
    );
  })
  .factory('PotentialCustomerAddEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/potentialCustomer',
      {}
    );
  })
  .factory('PotentialCustomerGetEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/potentialCustomer/:pageNo/:pageSize',
      {pageNo: '@pageNo',pageSize: '@pageSize'}
    );
  })
  .factory('PotentialCustomerUpdateEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/potentialCustomer',
      {}
    );
  })
  .factory('PotentialCustomerApi',
    function (API_END_POINT, sendRequest) {
      var baseUrl = API_END_POINT.url + '/potentialCustomer';

      var doUpload = function (data, callback) {
        var url = baseUrl + '/doUpload';
        var method = 'post';

        var fd = new FormData();
        fd.append('file', data);

        console.log('data', data);
        console.log('fd', fd);

        return sendRequest.upload(url, method, fd, callback);
      };

      return {
        doUpload: doUpload,
      };
    })
  //文件上传服务 上传图片
  .factory('FileEntity', function ($q, Upload, API_END_POINT) {
    return {
      upload: function (file) {
        var deferred = $q.defer();

        Upload.upload({
          url:  API_END_POINT.url + '/potentialCustomer/doUpload',
          data: { file: file }
        }).then(function (resp) {
          deferred.resolve(resp);
        }, function (resp) {
          deferred.reject(resp);
        }, function (evt) {
          deferred.notify(evt);
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
        return deferred.promise;
      }
    };
  })
  .factory('saleChanceEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/chance/:pageNo/:pageSize',
      {pageNo: '@pageNo',pageSize: '@pageSize'}
    );
  })
  .factory('toOrderEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/chance/setSalesOrder',
      {}
    );
  })
  .factory('getSalesEntity', function ($resource, API_END_POINT) {
    return $resource(
      '/ums2/api',
      {}, {
        getAll: {method: 'GET',isArray:true}
      }
    );
  })
  .factory('saleChanceSalesEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/chance/:pageNo/:pageSize',
      {pageNo: '@pageNo',pageSize: '@pageSize'}
    );
  })
  .factory('saleActivityNewEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/activity/:chanceId',
      {chanceId: '@chanceId'}
    );
  })
  .factory('saleActivityUpdateEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/activity',
      {}
    );
  })
  .factory('saleActivityEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/activity/getByConds/:pageNo/:pageSize',
      {pageNo: '@pageNo',pageSize: '@pageSize'}
    );
  })
  .factory('saleActivityTagEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/potentialCustomer/tagCust/:pcId/:tags',
      {pcId: '@pcId',tags: '@tags'}
    );
  })
  .factory('saleActivityCustomerTagEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/potentialCustomer/:id',
      {id: '@pcId'}
    );
  });
