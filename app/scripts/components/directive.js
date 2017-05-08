'use strict';

angular.module('pcmsApp')
  // // 确认事件
  // .directive('mkConfirmClick', [
  //   function() {
  //     return {
  //       priority: -1,
  //       restrict: 'A',
  //       link: function(scope, element, attrs) {
  //         element.bind('click', function(e) {
  //           if (element.attr('disabled') === 'disabled') {
  //             e.stopImmediatePropagation();
  //           } else {
  //             var message = attrs.mkConfirmClick;
  //             // confirm() requires jQuery
  //             if (message && !confirm(message)) {
  //               e.stopImmediatePropagation();
  //               e.preventDefault();
  //             }
  //           }
  //         });
  //       }
  //     };
  //   }
  // ])
  // // 返回按钮
  // .directive('backButton', [
  //   '$rootScope',
  //   '$state',
  //   '$parse',
  //   'sessionService',
  //   function($rootScope, $state, $parse, sessionService) {
  //     return {
  //       restrict: 'EA',
  //       link: function(scope, el, attrs) {
  //         var defaultState, defaultStateParams;
  //
  //         el.click(function() {
  //           var stateName, stateParams;
  //           var history = sessionService.getHistory();
  //           // 存在回复Data
  //           if (history.value && history.value.data) {
  //             $rootScope.history.data = history.value.data;
  //           }
  //           $rootScope.history.isBack = true;
  //
  //           if (history.key) {
  //             stateName = history.key;
  //             stateParams = history.value.params;
  //           } else {
  //             stateName = defaultState;
  //             stateParams = defaultStateParams;
  //           }
  //
  //           if (stateName) {
  //             $state.go(stateName, stateParams);
  //           }
  //         });
  //
  //         attrs.$observe('defaultState', function() {
  //           defaultState = attrs.defaultState;
  //         });
  //         attrs.$observe('defaultStateParams', function() {
  //           defaultStateParams = $parse(attrs.defaultStateParams)(scope);
  //         });
  //
  //         // $rootScope.$watch('history', function(val) {
  //         //    el.attr('disabled', !val.key && !defaultState);
  //         // });
  //       }
  //     };
  //   }
  // ])
  .directive('expander', function() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      require: '^?accordion',
      scope: {
        title: '=expanderTitle'
      },
      template: '<div>' +
        '<div class="title" ng-click="toggle()">{{title}}</div>' +
        '<div class="body" ng-show="showMe" ng-transclude></div>' +
        '</div>',
      link: function(scope, element, attrs, accordionController) {
        scope.showMe = false;
        accordionController.addExpander(scope);
        scope.toggle = function toggle() {
          scope.showMe = !scope.showMe;
          accordionController.gotOpened(scope);
        };
      }
    };
  })
  .directive('accordion', function() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: '<div ng-transclude></div>',
      controller: function() {
        var expanders = [];
        this.gotOpened = function(selectedExpander) {
          angular.forEach(expanders, function(expander) {
            if (selectedExpander !== expander) {
              expander.showMe = false;
            }
          });
        };
        this.addExpander = function(expander) {
          expanders.push(expander);
        };
      }
    };
  })
  .directive('inputCombo', function() {

    var getTemplateUrl = function(type) {

      var templateUrl = '';

      switch (type) {
        case 'date':
          templateUrl = 'views/template/input-date.html';
          break;
        case 'text':
        case 'number':
        case 'password':
        case 'url':
        case 'tel':
        case 'email':
          templateUrl = 'views/template/input-text.html';
          break;
        case 'textarea':
          templateUrl = 'views/template/input-textarea.html';
          break;
        case 'select':
          templateUrl = 'views/template/select.html';
          break;
        case 'dialog':
          templateUrl = 'views/template/input-dialog.html';
          break;
        case 'dropdown':
          templateUrl = 'views/template/dropdown.html';
          break;
        case 'switch':
          templateUrl = 'views/template/switch.html';
          break;
      }

      return templateUrl;
    };

    return {
      restrict: 'E',
      require: '^form',
      scope: {
        type: '@',
        title: '@',
        idname: '@',
        errMsg: '@',
        placeholder: '@',
        labelClass: '@',
        inputClass: '@',
        selectIdx: '@',
        options: '@',
        maxlength: '@',
        ngModel: '=',
        isShowDropdown: '=',
        noLabel: '=?',
        sourceData: '=?',
        outputFormat: '=?',
        ngDisabled: '=?',
        ngPattern: '=?',
        ngRequired: '=?',
        ngReadonly: '=?',
        ngChange: '&',
        ngBlur: '&',
        ngFocus: '&',
        mbClick: '&'
      },
      templateUrl: function(tElement, tAttrs) {

        return getTemplateUrl(tAttrs.type);
      },

      controller: function($scope) {

        if ($scope.type === 'select') {

          $scope.options = $scope.options || 'obj.code as obj.value for obj in sourceData';
          // 默认选中项
          if($scope.selectIdx) {
            // console.log($scope.sourceData);
            // console.log($scope.selectIdx);
            $scope.ngModel = $scope.sourceData[$scope.selectIdx].code;
          }
        }

        // 控制下拉菜单显示
        $scope.dropdownSelect = function(item) {
          $scope.ngModel = item;
          $scope.isShowDropdown = false;
        };

        // 控制下拉菜单显示
        $scope.toggleDropDown = function() {
          $scope.isShowDropdown = !$scope.isShowDropdown;
        };
      },

      link: function(scope, element, attrs, formCtrl) {

        // 取得NgModelController
        scope.form = formCtrl[attrs.idname];

        if (angular.isUndefined(scope.ngDisabled) || scope.ngDisabled === null) {
          scope.ngDisabled = false;
        }
      }
    };
  })
  .directive('inputComboR', function($timeout, $confirm) {

    return {
      template: '<ng-include src="getTemplateUrl()"/>',
      restrict: 'E',
      require: '^form',
      scope: {
        type: '@',
        title: '@',
        idname: '@',
        errMsg: '@',
        placeholder: '@',
        labelClass: '@',
        inputClass: '@',
        ngModel: '=',
        sourceData: '=?',
        selectIdx: '@',
        ngDisabled: '=?',
        ngRequired: '=?'
      },
      controller: function($scope) {
        $scope.getTemplateUrl = function() {
          var templateUrl = '';

          switch ($scope.type) {
            case 'date':
              templateUrl = 'views/template/input-date-r.html';
              break;
            case 'text':
            case 'number':
            case 'url':
              templateUrl = 'views/template/input-text-r.html';
              break;
            case 'select':
              templateUrl = 'views/template/select-r.html';
              break;
            case 'dialog':
              templateUrl = 'views/template/input-dialog-r.html';
              break;
          }

          return templateUrl;
        };

        $scope.openModal = function() {
          // 传入modal参数
          var data = {};

          console.log($scope.sourceData);

          data.p = 'stat_order';

          // 呼出modal
          $confirm(data, {
              templateUrl: 'views/index/query.html',
              size: 'lg'
            })
            .then(function() {

            });
        };
      },
      link: function(scope, element, attrs, formCtrl) {

        $timeout(function() {

          // 取得NgModelController
          scope.form = formCtrl[attrs.idname];
        }, 100);

      }
    };
  })
  .directive('mbModalHeader', function() {

    return {
      restrict: 'E',
      replace: true,
      scope: {
        title: '@',
        alerts: '=?',
        cancelClick: '&'
      },
      templateUrl: 'views/template/mb-modal-header.html'
    };
  })
  .directive('mbPager', ['$timeout', function() {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/template/mb-pager.html',
      controller: function($scope) {

        // 直接输入页跳转
        $scope.gotoPage = function($event, toPage) {
          if ($event.keyCode === 13) {
            if (toPage > $scope.numPages) {
              toPage = $scope.numPages;
            } else if (toPage < 1) {
              toPage = 1;
            }
            $scope.toPage = toPage;
            $scope.currentPage = toPage;
            $scope.query();
          }
        };

        // 监控页面显示件数
        $scope.$watch('numPerPage', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            // 改变页面显示件数
            $scope.query();
          }
        });
      }
    };
  }])
  .directive('gridFilterInput', function($rootScope) {
    return {
      template: '<input type="text" class="ui-grid-filter-input" ng-model="theFilter" ng-keydown="execFilter($event)" ng-blur="execFilter()"/>',
      controller: function($scope) {
        // console.log($scope.col.grid.appScope.gridOptions.data);
        // console.log($scope.colFilter);

        $scope.execFilter = function(event) {
          if (event) {
            if (event.keyCode === 13) {
              // 过滤条件存rootScope里
              $rootScope.tempParam[$scope.col.field] = $scope.theFilter;
            }
          } else {
            // 过滤条件存rootScope里
            $rootScope.tempParam[$scope.col.field] = $scope.theFilter;
          }

          // $scope.colFilter.term = $scope.theFilter;

          // var ages = $scope.gridApi.selection.getSelectedRows();
          // $scope.colFilter.listTerm = [];
          //
          // ages.forEach(function(age) {
          //   $scope.colFilter.listTerm.push(age.age);
          // });
          //
          // $scope.colFilter.term = $scope.colFilter.listTerm.join(', ');
          // $scope.colFilter.condition = new RegExp($scope.colFilter.listTerm.join('|'));
        };
      }
    };
  })
  .directive('autoFillSync', function($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
        var origVal = elem.val();
        $timeout(function() {
          var newVal = elem.val();
          if (ngModel.$pristine && origVal !== newVal) {
            ngModel.$setViewValue(newVal);
          }
        }, 500);
      }
    }
  })
  .directive('autofillFix', function($timeout) {

    return {
      link: function(scope, elem, attrs) {
        // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
        elem.prop('method', 'POST');

        // Fix autofill issues where Angular doesn't know about autofilled inputs
        if (attrs.ngSubmit) {
          $timeout(function() {
            elem.unbind('submit').bind('submit', function(e) {
              e.preventDefault();
              var arr = elem.find('input');
              if (arr.length > 0) {
                arr.triggerHandler('input').triggerHandler('change').triggerHandler('keydown');
                scope.$apply(attrs.ngSubmit);
              }
            });
          }, 0);
        }
      }
    };
  })
  .directive("watchAutofill", [
    '$timeout',
    function($timeout) {
      var INTERVAL_MS = 500;

      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {

          var timer;

          function startTimer() {
            timer = $timeout(function() {
              var value = element.val();
              if (value && ngModel.$viewValue !== value) {
                ngModel.$setViewValue(value);
              }
              startTimer();
            }, INTERVAL_MS);
          }

          scope.$on('$destroy', function() {
            $timeout.cancel(timer);
          });

          startTimer();
        }
      };
    }
  ])
  .directive("autofill", function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        scope.$watch(function() {
          return element.val();
        }, function(nv, ov) {
          if (nv !== ov)
            ngModel.$setViewValue(nv)
        })
      }
    }
  })
  .directive("btnPermission", function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        // 菜单取得完毕
        $rootScope.menuPromise.then(function(menu) {
          // 菜单数据中存在按钮权限控制
          if ($rootScope.selectMenu && $rootScope.selectMenu.tMenu && $rootScope.selectMenu.tMenu.components) {
            var components = $rootScope.selectMenu.tMenu.components;
            var btnName = attrs.btnPermission || _.trim(element[0].innerText);
            // 移除按钮
            if (!components[btnName]) {
              element.remove();
            }
          }
        });
      }
    }
  })

  .directive('yjEchart', [function () {
    return {
      restrict: 'AE',
      scope: {
        options: '=yjEchart'
      },
      link: function(scope, element) {

        if(scope.options.data) {
          echarts.registerMap('china', scope.options.data);
        }
        // 基于准备好的DOM, 初始化echarts图表
        var myChart = echarts.init(element[0]);
        myChart.showLoading();
        scope.options.chart = myChart;

        scope.$on('chart-container-resized', function () {
          myChart.resize();
          // if(scope.options) {
          //   myChart.setOption(scope.options);
          // }
        });

        scope.$on('chart-container-initialized', function () {
          myChart.resize();
          if(scope.options.option) {
            myChart.clear();
            myChart.setOption(scope.options.option);
          }
        });

        // 为echarts对象加载数据
        var optionJustSet = false;
        scope.$watch('options.option', function (option) {
          if(option){
            optionJustSet = true;
            // 清空绘画内容，清空后实例可用
            window.onresize = myChart.resize;
            // myChart.resize();
            myChart.clear();
            myChart.hideLoading();
            myChart.setOption(option);
          }
        });
      }
    };
  }])

  .directive('highlight', function() {
    return {
      link: function(scope, element) {
        element.click(function () {
          element.addClass('highlight');
          element.siblings().removeClass('highlight');
          element.parent('tr').siblings('tr').find('td').removeClass('highlight');
        });
      }
    };
  })
  .directive('fileModel', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        element.bind('change', function() {
          scope.$apply(function() {
            model.assign(scope, element[0].files[0]);
          });
        });
      }
    };
  }]);
