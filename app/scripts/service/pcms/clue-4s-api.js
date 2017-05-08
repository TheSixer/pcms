/**
 * Created by huangcheng on 2017/2/7.
 */
'use strict';

/**
 * @ngdoc function
 * @name pcmsApp.controller:Clue4sEntity
 * @description
 * # Clue4sEntity
 * factory of the pcmsApp
 */

angular.module('pcmsApp')
  //线索管理 查询
  .factory('Clue4sManageEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/clue/:pageNo/:pageSize',
      {pageNo: '@pageNo',pageSize: '@pageSize'}
    );
  })
  //线索管理 作废
  .factory('Clue4sManageDeleteEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/clue/:clueId',
      {clueId: '@clueId'}
    );
  })
  //线索管理 新增 更新
  .factory('Clue4sManageNewEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/clue',
      {}
    );
  })
  //线索清洗
  .factory('ClueDuplicateEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/clue/cleanClue',
      {}
    );
  })
  //机会分配 查询
  .factory('Clue4sAssignEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/chance/:pageNo/:pageSize',
      {pageNo: '@pageNo',pageSize: '@pageSize'}
    );
  })
  //机会分配 手动分配机会
  .factory('Clue4sAssignHandelEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/chance/handAllocChance/:allocType',
      {allocType: '@allocType'}
    );
  })
  //机会分配 自动分配机会
  .factory('Clue4sAssignAutoEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/chance/autoAllocSale',
      {}
    );
  })
  //文件上传服务 上传图片
  .factory('ClueFileEntity', function ($q, Upload, API_END_POINT) {
    return {
      upload: function (file) {
        var deferred = $q.defer();

        Upload.upload({
          url:  API_END_POINT.url + '/file/clue',
          data: { uploadFile: file }
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
  });
