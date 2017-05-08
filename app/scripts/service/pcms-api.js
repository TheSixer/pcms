'use strict';

angular.module('pcmsApp')
  //普通发票
  .factory('CommonTestEntity', function ($resource, API_END_POINT) {
    return $resource(
      'http://ums.tongter.com:8090/ums2/api',
      { act: '@act',username: '@username',ticket: '@ticket' },
      { getAll:
      {
        headers: {
          'ticket': '41b99d404b74f5f8bcaa224fa4e40135'
        },
      }
      }
    );
  })
  //增值发票
  .factory('VatInvoiceEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/addedTaxInvoice/:id',
      { id: '@id' },
      { query: {isArray: false},
        update: {
          method: 'PUT'
        },
        //获取所有的快递公司
        getExpressCompanyList: {
          method: 'GET',
          params:{
            id: 'expressCompany'
          }
        }
      }
    );
  })
  //增值税发票资质
  .factory('AddedTaxInvoiceEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/addedTaxInvoice/model/:id',
      { id: '@id' },
      { query: {isArray: false},
        update: {
          method: 'PUT'
        }
      }
    );
  })
  //车辆解除绑定审核
  .factory('UnbindvehicleEntity', function ($resource, API_END_POINT) {
    return $resource(
        API_END_POINT.url + '/userCars/:id',
        { id: '@id' },
        { query: {isArray: false},
          updateStatus: {
            method: 'POST',
          }
        }
    );
  })
  //用户分析
    .factory('UserAnalysisEntity', function ($resource, API_END_POINT) {
      return $resource(
          API_END_POINT.url + '/information/daily/:id',
          { id: '@id' },
          { query: {isArray: false},
              updateStatus: {
                  method: 'POST',
              }
          }
      );
    })
    //用户分析
    .factory('UserPackageStatusReportEntity', function ($resource, API_END_POINT) {
      return $resource(
          API_END_POINT.url + '/user/report',
          {},
          { query: {isArray: false}}
      );
    })
    //用户分析
    .factory('ReserveAnalysisEntity', function ($resource, API_END_POINT) {
      return $resource(
          API_END_POINT.url + '/information/retention/:id',
          { id: '@id' },
          { query: {isArray: false},
              updateStatus: {
                  method: 'POST',
              }
          }
      );
    })
  //广告条
  .factory('BannersEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/banners/:id',
      { id: '@id' },
      { query: {isArray: false},
        update: {
          method: 'PUT'
        }
      }
    );
  })
  //moofun用户
  .factory('UserEntitiy', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/user/:id',
      { id: '@id' },
      { query: {isArray: false}}
    );
  })
  //文件上传服务 上传图片 返回地址
  .factory('FileEntityPc', function ($q, Upload, API_END_POINT) {
    return {
      upload: function (file) {
        var deferred = $q.defer();

        Upload.upload({
          url: API_END_POINT.url + '/banners/uploadImage',
          data: { file: file }
        }).then(function (resp) {
          deferred.resolve(resp);
          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
          deferred.reject(resp);
          console.log('Error status: ' + resp.status);
        }, function (evt) {
          deferred.notify(evt);
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
        return deferred.promise;
      }
    };
  });
