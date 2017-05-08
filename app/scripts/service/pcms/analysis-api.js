/**
 * Created by huangcheng on 2017/2/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name pcmsApp.controller:AnalysisEntity
 * @description
 * # AnalysisEntity
 * factory of the pcmsApp
 */

angular.module('pcmsApp')
  //线索分析
  .factory('ClueAnalysisEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getDRClueAnalyzeRpt',
      {}
    );
  })
  //线索分析
  .factory('ClueAnalysisHqEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getHQClueAnalyzeRpt',
      {}
    );
  })
  //邀约到店率
  .factory('CarModelEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getIttiModelAnaReport',
      {}
    );
  })
  //跟进战败分析
  .factory('SalesOrderEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getSalesOrderRpt',
      {}
    );
  })
  .factory('ClueLbrEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getDRSalesChanceDealRpt',
      {}
    );
  })
  .factory('KPIIndexReferenceEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getKPIRefRptForHQ',
      {}
    );
  })
  .factory('ClueLbrHqEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getHQSalesChanceDealRpt',
      {}
    );
  })
  .factory('SalesConsultantConversionRateEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getSalesConsultantConvRpt',
      {}
    );
  })
  .factory('ArriveRateEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getSignArriveRateRptForAgency',
      {}
    );
  })

  .factory('ArriveRateHqEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getSignArriveRateRptForHQ',
      {}
    );
  })

  .factory('ArriveRateDEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/exportSignArriveRateRptForAgency',
      {},
      {
        'download': {
          method: 'GET',
          responseType: 'arraybuffer',
          transformResponse: function(data, headers){
            //MESS WITH THE DATA
            var response = {};
            response.data = data;
            return response;
          },
          url: API_END_POINT.url + '/ststcs/exportSignArriveRateRptForAgency'
        }
      }
    );
  })

  .factory('TrackDefeatEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getFollowFailRptForAgency',
      {}
    );
  })
  .factory('TrackDefeatHqEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getFollowFailRptForHQ',
      {}
    );
  })
  //线索跟进反馈及时率
  .factory('TrackFeedbackRateEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getClueFeedbackRpt',
      {}
    );
  })
  //运营平台分析
  .factory('OperationPlatformEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getOprtPlatRptForHQ',
      {}
    );
  })
  //4s店运营分析
  .factory('Operation4sEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getOperationAnalysisRpt',
      {}
    );
  })
  //区域运营分析
  .factory('OperationAreaEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getRegnOprtRptForHQ',
      {}
    );
  })
  //24小时线索处理率
  .factory('HoursHandleRateEntity', function ($resource, API_END_POINT) {
    return $resource(
      API_END_POINT.url + '/ststcs/getClueDisposeRpt',
      {}
    );
  })
  //用户登录统计
  .factory('CustomerLoginEntity', function ($resource, API_END_POINT) {
    return $resource(
      '/ums2/api',
      {}, {
        getAll: { isArray: true},
      }
    );
  });

