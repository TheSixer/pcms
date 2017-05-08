/**
 * Created by huangcheng on 2017/2/13.
 */
'use strict';

/**
 * @ngdoc function
 * @name pcmsApp.controller:SystemEntity
 * @description
 * # SystemEntity
 * factory of the pcmsApp
 */

angular.module('pcmsApp')
  .factory('ImportIfMngEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/mInterface/:pageNo/:pageSize',
      {pageNo: '@pageNo', pageSize: '@pageSize'}
    );
  })
  .factory('ImportIfMngDeleteEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/mInterface/:id',
      {id: '@id'}
    );
  })
  .factory('ImportIfMngNewEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/mInterface',
      {}
    );
  })
  .factory('ImportTimesMngEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/track/potentialCustomer/:id',
      {id: '@pcId'}
    );
  })
  .factory('DividendRuleMngEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/rule',
      {}
    );
  })
  .factory('DividendRuleDeleteMngEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/rule/:id',
      {id:'@id'}
    );
  })
  .factory('LabelMngEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/tag',
      {}
    );
  })
  .factory('LabelMngDeleteEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/tag/:tagId',
      {tagId:'@tagId'}
    );
  })
  .factory('OpportunityLevelSettingEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/rule',
      {}
    );
  })
  .factory('OpportunityLevelSettingDeleteEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/rule/:id',
      {id:'@id'}
    );
  })
  .factory('WashRuleMngEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/rule',
      {}
    );
  })
  .factory('WashRuleDeleteMngEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/rule/:id',
      {id:'@id'}
    );
  });
