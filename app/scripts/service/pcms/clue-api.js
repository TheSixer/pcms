/**
 * Created by huangcheng on 2017/2/8.
 */
'use strict';

/**
 * @ngdoc function
 * @name pcmsApp.controller:ClueEntity
 * @description
 * # ClueEntity
 * factory of the pcmsApp
 */

angular.module('pcmsApp')
//线索管理
  .factory('ClueManageEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/clue//:pageNo/:pageSize',
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
  //线索管理 新增修改
  .factory('ClueManageNewEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/clue',
      {}
    );
  })
  //线索管理 订单线索 立刻导入
  .factory('ClueManageApi', function($http, $state, API_END_POINT, sendRequest) {
    //订单线索
    var orderClues = function(callback) {

      var url = API_END_POINT.url + '';
      var method = 'post';
      var data = {};
      return sendRequest.send(url, method, data, callback);
    };
    //立刻导入
    var importData = function(callback) {

      var url = API_END_POINT.url + '';
      var method = 'post';
      var data = {};
      return sendRequest.send(url, method, data, callback);
    };

    return {
      orderClues: orderClues,
      importData: importData,
    };
  })

  //机会分配 查询
  .factory('ClueAssignEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/chance/:pageNo/:pageSize',
      {pageNo: '@pageNo',pageSize: '@pageSize'}
    );
  })
  //机会分配 手动分配机会
  .factory('ClueAssignHandelEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/chance/handAllocChance/:allocType',
      {allocType: '@allocType'}
    );
  })
  //机会分配 自动分配机会
  .factory('ClueAssignAutoEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/chance/autoAllocDealer',
      {}
    );
  })
