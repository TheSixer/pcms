'use strict';
/**
 * 用户验证相关的服务
 */

angular.module('pcmsApp')
  .factory('authInterceptor', function($rootScope, $q, $cookies, $injector, Util, TOKEN_NAME, $window, HAIMA_END_POINT) {
    var state;
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookies.get(TOKEN_NAME) && Util.isSameOrigin(config.url)) {
          var currentUser;
          try {
            currentUser = JSON.parse(decodeURIComponent($cookies.get(TOKEN_NAME)));
          } catch (e) {
            console.error(e);
            currentUser = {};
          }
          config.headers.token = currentUser.token;
        }
        return config;
      },

      responseError: function(response) {
        // Intercept 401s and redirect you to login
        console.log(response);
        if (response.status === 401) {
          // (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          $cookies.remove(TOKEN_NAME);
          var url = HAIMA_END_POINT.url;
          // 回登录页面
          console.log(url);
          console.log('未登录 token无效');
          window.alert('token无效，请重新登录');
          $window.location.href = url;

        } else if (response.status === -1 || response.status === 400 || response.status === 403 || response.status === 404 || response.status === 500 || response.status === 501 || response.status === 502 || response.status === 503 || response.status === 504) {
          if (response.status === 400) {
            Util.putSysMsg('danger', (response.data && response.data.message) || '400');
          } else {
            Util.putSysMsg('danger', response.status);
          }
        }
        return $q.reject(response);
      }
    };
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  })
  .service('Auth', function(TOKEN_NAME, $cookies, $q) {
    var currentUser = {};
    try {
      currentUser = JSON.parse(decodeURIComponent($cookies.get(TOKEN_NAME)));
    } catch (e) {
      // console.info(e);
      currentUser = {};
    }

    //退出
    this.logout = function() {
      $cookies.remove(TOKEN_NAME);
      currentUser = {};
    };

    var getUserPromise = function(user) {
      if (user && user.token) {
        return $q.when(user);
      }
      if (user && user.$promise) {
        return user.$promise;
      }
      return $q.reject(new Error('user not exist'));
    };

    this.getCurrentUser = function() {
      return currentUser;
    };

    //获取当前登录的用户
    this.getCurrentUserPromise = function() {
      return getUserPromise(currentUser);
    };

    //判断是否登录了
    this.isAuthenticated = function() {
      return this.getCurrentUserPromise().then(function(_currentUser) {
          if (_currentUser && _currentUser.token) {
            return true;
          } else {
            return false;
          }
        })
        .catch(function() {
          return false;
        });
    };

  })
  .service('userService',
    function($rootScope, $cookies, $state, TOKEN_NAME) {
      var currentUser = {};

      function saveToCookies() {
        try {
          if (currentUser) {
            $cookies.put(TOKEN_NAME, JSON.stringify(currentUser));
          } else {
            $cookies.put(TOKEN_NAME, '');
          }
        } catch (e) {
          console.log(e);
          currentUser = {};
          $cookies.put(TOKEN_NAME, '');
        }
      }

      function setItem(key, value) {
        currentUser[key] = value;
        saveToCookies();
      }

      function setObj(obj) {
        currentUser = obj;
        saveToCookies();
      }

      function getItem(key) {
        return currentUser[key];
      }

      // 存在 key 获取此属性值, 不存在key返回 currentUser对象
      this.get = function(key) {
        if (key) {
          return getItem(key);
        }
        return currentUser;
      };

      this.getFromCookies = function () {
        if($cookies.get(TOKEN_NAME)) {
          return JSON.parse($cookies.get(TOKEN_NAME))
        } else {
          return '';
        }
      };

      // 保存整个 currentUser对象 或 保存 属性值
      this.set = function(key, value) {
        if (angular.isObject(key)) {
          return setObj(key);
        }
        setItem(key, value);
      };

      this.isLogin = function() {
        // return !!currentUser.token;
        return true;
      };

      this.logOut = function() {
        setObj({});
      };

      this.getAuth = function() {
        return {
          token: currentUser.token
        };
      };

      // 从cookies获取 currentUser对象, 用于app退出重新进入时
      this.initFromCookies = function() {
        try {
          currentUser = JSON.parse($cookies.get(TOKEN_NAME)) || {};

        } catch (e) {
          console.log(e);
          currentUser = {};
          $cookies.put(TOKEN_NAME, '');
        }
        return currentUser;
      };

      $rootScope.userService = this;
    });
