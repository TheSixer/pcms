'use strict';

angular.module('pcmsApp')
  .config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise('login');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/index/login.html',
        controller: 'LoginCtrl'
      })
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        data: {
          requiresAuth: true
        }
      })
      .state('main.welcome', {
        url: 'welcome',
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeCtrl'
      })
      .state('main.query', {
        url: 'index/query?p',
        templateUrl: 'views/index/query.html'
      })
      /* ---------------潜客管理系统------------------ */
      // 线索管理
      .state('main.clue', {
        url: 'clue',
        abstract: true
      })
      // 线索管理
      .state('main.clue.manage', {
        url: '/manage',
        views: {
          '@main': {
            templateUrl: 'views/pcms/clue/clue-manage.html',
            controller: 'ClueManageCtrl',
          }
        },
      })
      // 线索管理
      .state('main.clue.4sManage', {
        url: '/4s-manage',
        views: {
          '@main': {
            templateUrl: 'views/pcms/clue/clue-4s-manage.html',
            controller: 'Clue4sManageCtrl',
          }
        },
      })
      .state('main.clue.duplicate', {
        url: '/duplicate',
        views: {
          '@main': {
            templateUrl: 'views/pcms/clue/clue-duplicate.html',
            controller: 'ClueDuplicateCtrl',
          }
        },
      })
      .state('main.clue.duplicateHeadquarters', {
        url: '/duplicate-headquarters',
        views: {
          '@main': {
            templateUrl: 'views/pcms/clue/clue-duplicate.html',
            controller: 'ClueDuplicateCtrl',
          }
        },
      })
      .state('main.clue.audit', {
        url: '/audit',
        views: {
          '@main': {
            templateUrl: 'views/pcms/clue/clue-audit.html',
            controller: 'ClueAuditCtrl',
          }
        },
      })
      .state('main.clue.assign', {
        url: '/assign',
        views: {
          '@main': {
            templateUrl: 'views/pcms/clue/clue-assign.html',
            controller: 'ClueAssignCtrl',
          }
        },
      })
      .state('main.clue.assign-dealer', {
        url: '/assign-dealer',
        views: {
          '@main': {
            templateUrl: 'views/pcms/clue/clue-4s-assign.html',
            controller: 'Clue4sAssignCtrl',
          }
        },
      })
      // 统计分析
      .state('main.analysis', {
        url: 'analysis',
        abstract: true
      })
      .state('main.analysis.intention-feedback-rate', {
        url: '/intention-feedback-rate',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/intention-feedback-rate.html',
            controller: 'IntentionFeedbackRateCtrl',
          }
        },
      })
      .state('main.analysis.track-feedback-rate', {
        url: '/track-feedback-rate',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/track-feedback-rate.html',
            controller: 'TrackFeedbackRateCtrl',
          }
        },
      })
      .state('main.analysis.operation-platform', {
        url: '/operation-platform',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/operation-platform.html',
            controller: 'OperationPlatformCtrl',
          }
        },
      })
      .state('main.analysis.clue-analysis-dealer', {
        url: '/clue-analysis-dealer',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/clue-analysis.html',
            controller: 'ClueAnalysisCtrl',
          }
        },
      })
      .state('main.analysis.clue-analysis', {
        url: '/clue-analysis',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/clue-analysis-hq.html',
            controller: 'ClueAnalysisHqCtrl',
          }
        },
      })
      .state('main.analysis.car-model-dealer', {
        url: '/car-model-dealer',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/car-model.html',
            controller: 'CarModelCtrl',
          }
        },
      })
      .state('main.analysis.car-model', {
        url: '/car-model',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/car-model.html',
            controller: 'CarModelCtrl',
          }
        },
      })
      .state('main.analysis.customer-come', {
        url: '/customer-come',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/customer-come.html',
            controller: 'CustomerComeCtrl',
          }
        },
      })
      .state('main.analysis.customer-reception', {
        url: '/customer-reception',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/customer-reception.html',
            controller: 'CustomerReceptionCtrl',
          }
        },
      })
      .state('main.analysis.customer-returned', {
        url: '/customer-returned',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/customer-returned.html',
            controller: 'CustomerReturnedCtrl',
          }
        },
      })
      .state('main.analysis.sales-twice-order', {
        url: '/sales-twice-order',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/sales-twice-order.html',
            controller: 'SalesTwiceOrderCtrl',
          }
        },
      })
      .state('main.analysis.sales-order-dealer', {
        url: '/sales-order-dealer',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/sales-order.html',
            controller: 'SalesOrderCtrl',
          }
        },
      })
      .state('main.analysis.sales-order', {
        url: '/sales-order',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/sales-order.html',
            controller: 'SalesOrderCtrl',
          }
        },
      })
      .state('main.analysis.sales-consultant-conversion-rate', {
        url: '/sales-consultant-conversion-rate',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/sales-consultant-conversion-rate.html',
            controller: 'SalesConsultantConversionRateCtrl',
          }
        },
      })
      .state('main.analysis.sales-consultant-conversion-rate-dealer', {
        url: '/sales-consultant-conversion-rate-dealer',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/sales-consultant-conversion-rate.html',
            controller: 'SalesConsultantConversionRateCtrl',
          }
        },
      })
      .state('main.analysis.sales-cross-car-summary', {
        url: '/sales-cross-car-summary',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/sales-cross-car-summary.html',
            controller: 'SalesCrossCarSummaryCtrl',
          }
        },
      })
      .state('main.analysis.customer-comment-dealer', {
        url: '/customer-comment-dealer',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/customer-comment.html',
            controller: 'CustomerCommentCtrl',
          }
        },
      })
      .state('main.analysis.customer-comment', {
        url: '/customer-comment',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/customer-comment.html',
            controller: 'CustomerCommentCtrl',
          }
        },
      })
      .state('main.analysis.KPI-index-reference', {
        url: '/KPI-index-reference',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/KPI-index-reference.html',
            controller: 'KPIIndexReferenceCtrl',
          }
        },
      })
      // 4S店运营分析
      .state('main.analysis.operation4s', {
        url: '/operation-4s',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/operation-4s.html',
            controller: 'Operation4sCtrl',
          }
        },
      })
      // 区域运营分析
      .state('main.analysis.operationArea', {
        url: '/operation-area',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/operation-area.html',
            controller: 'OperationAreaCtrl',
          }
        },
      })
      // 24小时线索处理率
      .state('main.analysis.hours24HandleRate', {
        url: '/24hours-handle-rate',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/24hours-handle-rate.html',
            controller: 'Hours24HandleRateCtrl',
          }
        },
      })
      // 用户登录统计
      .state('main.analysis.customerLogin', {
        url: '/customer-login',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/customer-login.html',
            controller: 'CustomerLoginCtrl',
          }
        },
      })
      // 跟进战败分析(销售顾问)
      .state('main.analysis.trackDefeatConsultant', {
        url: '/track-defeat-consultant',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/track-defeat.html',
            controller: 'TrackDefeatCtrl',
          }
        },
      })
      // 跟进战败分析
      .state('main.analysis.trackDefeat', {
        url: '/track-defeat',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/track-defeat.html',
            controller: 'TrackDefeatCtrl',
          }
        },
      })
      // 跟进战败分析
      .state('main.analysis.trackDefeatHq', {
        url: '/track-defeat-hq',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/track-defeat-hq.html',
            controller: 'TrackDefeatHqCtrl',
          }
        },
      })
      .state('main.analysis.clue-lbr-dealer', {
        url: '/clue-lbr-dealer',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/clue-lbr.html',
            controller: 'ClueLbrCtrl',
          }
        },
      })
      .state('main.analysis.clue-lbr', {
        url: '/clue-lbr',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/clue-lbr-hq.html',
            controller: 'ClueLbrHqCtrl',
          }
        },
      })
      .state('main.analysis.arrive-rate-dealer', {
        url: '/arrive-rate-dealer',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/arrive-rate.html',
            controller: 'ArriveRateCtrl',
          }
        },
      })
      .state('main.analysis.arrive-rate', {
        url: '/arrive-rate',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/arrive-rate-hq.html',
            controller: 'ArriveRateHqCtrl',
          }
        },
      })
      .state('main.analysis.order-feedback-rate', {
        url: '/order-feedback-rate',
        views: {
          '@main': {
            templateUrl: 'views/pcms/analysis/order-feedback-rate.html',
            controller: 'OrderFeedbackRateCtrl',
          }
        },
      })
      // 客户跟进
      .state('main.track', {
        url: 'track',
        abstract: true
      })
      // 客户画像
      .state('main.track.potentialCustomer', {
        url: '/potentialCustomer',
        views: {
          '@main': {
            templateUrl: 'views/pcms/track/potential-customer.html',
            controller: 'PotentialCustomerCtrl'
          }
        }
      })
      // 销售机会（销售顾问）
      .state('main.track.salesChanceConsultant', {
        url: '/sales-chance-consultant',
        views: {
          '@main': {
            templateUrl: 'views/pcms/track/sale-chance-sales.html',
            controller: 'SaleChanceSalesCtrl'
          }
        }
      })
      // 销售活动（销售顾问）
      .state('main.track.activityConsultant', {
        url: '/activity-consultant',
        views: {
          '@main': {
            templateUrl: 'views/pcms/track/sale-activity.html',
            controller: 'SaleActivityCtrl'
          }
        }
      })
      // 销售机会
      .state('main.track.chance', {
        url: '/chance',
        views: {
          '@main': {
            templateUrl: 'views/pcms/track/sale-chance.html',
            controller: 'SaleChanceCtrl'
          }
        }
      })
      // 销售活动
      .state('main.track.activity', {
        url: '/activity',
        views: {
          '@main': {
            templateUrl: 'views/pcms/track/sale-activity.html',
            controller: 'SaleActivityCtrl'
          }
        }
      })
      // 系统管理
      .state('main.system', {
        url: 'system',
        abstract: true
      })
      .state('main.system.import-if-mng', {
        url: '/import-if-mng',
        views: {
          '@main': {
            templateUrl: 'views/pcms/system/import-if-mng.html',
            controller: 'ImportIFMngCtrl'
          }
        }
      })
      .state('main.system.import-times-mng', {
        url: '/import-times-mng',
        views: {
          '@main': {
            templateUrl: 'views/pcms/system/import-times-mng.html',
            controller: 'ImportTimesMngCtrl'
          }
        }
      })
      .state('main.system.wash-rule-mng', {
        url: '/wash-rule-mng',
        views: {
          '@main': {
            templateUrl: 'views/pcms/system/wash-rule-mng.html',
            controller: 'WashRuleMngCtrl'
          }
        }
      })
      .state('main.system.dividend-rule-mng', {
        url: '/dividend-rule-mng',
        views: {
          '@main': {
            templateUrl: 'views/pcms/system/dividend-rule-mng.html',
            controller: 'DividendRuleMngCtrl'
          }
        }
      })
      .state('main.system.label-mng', {
        url: '/label-mng',
        views: {
          '@main': {
            templateUrl: 'views/pcms/system/label-mng.html',
            controller: 'LabelMngCtrl'
          }
        }
      })
      .state('main.system.opportunity-level-setting', {
        url: '/opportunity-level-setting',
        views: {
          '@main': {
            templateUrl: 'views/pcms/system/opportunity-level-setting.html',
            controller: 'OpportunityLevelSettingCtrl'
          }
        }
      });
  });
