'use strict';

/**
 * 主页面
 * added by Lijie
 * @name pcmsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('MainCtrl', function($scope, $window, $location, $state, $rootScope, $uibModal, Util, HAIMA_END_POINT, Auth, userService, codeMasterService, localStorageService, MainApi, getMenuApi, TICKET, loginData, getUserInfoApi) {

    var init = function() {
      // 控制左侧菜单显示/隐藏
      $rootScope.bodyClass = '';
      $scope.menu = [];
      $scope.secondMenu = [];
      $scope.selMenu = {};
      $scope.realName = '';
      $rootScope.selectMenu = $scope.selMenu;
      $scope.iconMatrix = {};
      // 取得用户信息
      $scope.currentUser = userService.get();
      if($scope.currentUser.username) {
      } else {
        $scope.currentUser = Auth.getCurrentUser();
      }
      loginData.username = $scope.currentUser.username;
      // 取得编码表
      codeMasterService.get();

      // localStorage中存在否
      if (Util.isStored('haimaPcmsIcon')) {
        // localStorage中取得icon信息
        $scope.iconMatrix = localStorageService.get('haimaPcmsIcon');
      } else {
        // 取得图标信息
        $scope.iconPromise = MainApi.getIconMateData(function(result) {
          // 保存图标信息
          localStorageService.set('haimaPcmsIcon', result.iconMatrix);

          $scope.iconMatrix = result.iconMatrix;
        });
          // 保存图标信息
          // localStorageService.set('haimaPcmsIcon', ICON.iconMatrix);
          //
          // $scope.iconMatrix = ICON.iconMatrix;
      }

    };
    init();

    var getPath = function() {
      var path = $location.path();
      if ('/index/query'.equals(path)) {
        path = $location.url();
      }
      return path;
    }

    // 根据 当前 location.path 来 渲染菜单
    var restoreMenu = function(topMenu, path) {
      var rtn = false;

      for (var x = 0; x < topMenu.length; x++) {
        if (rtn) {
          return rtn;
        }
        var secondMenu = topMenu[x].children;
        // 循坏私有属性
        _.forOwn(secondMenu, function(sValue) {
          var thirdMenu = sValue.children;
          _.forOwn(thirdMenu, function(tValue) {
            if (!tValue.children && tValue.url === path) {

              $scope.topMenuClick(topMenu[x]);
              $scope.toggleOpen(sValue);
              $scope.activeSMenu(sValue, tValue);
              rtn = true;
              return;
            } else if (tValue.children) {
              var fourMenu = tValue.children;
              _.forOwn(fourMenu, function(fValue) {
                if (fValue.url === path) {
                  $scope.topMenuClick(topMenu[x]);
                  $scope.toggleOpen(sValue);
                  $scope.toggleOpen(tValue);
                  $scope.activeTMenu(sValue, tValue, fValue);
                  rtn = true;
                }
              });
            }
          });
        });
      }
      return rtn;
    };

    //获取用户信息
    var getUserInfo = function (token) {
      var data = {};
      data.access_token = token;
      $scope.promise = getUserInfoApi.get(data,function (resp) {
        $scope.realName = resp.attributes.realname;
      });
    };

    // 菜单数据绑定到页面
    var bindMenu = function(menuData) {

      // 主菜单对象：售后系统，销售系统等
      var topMenu = [];

      // 遍历菜单
      for (var i in menuData) {
        if (menuData[i].text) {
          // 4s销售系统->销售系统
          menuData[i].text = menuData[i].text.replace(/[0-9a-zA-Z]+/, '');
          // if ('销售系统'.equals(menuData[i].text) || '售后系统'.equals(menuData[i].text)) {
          //   topMenu.push(menuData[i]);
          // }
          // if ('客户服务平台'.equals(menuData[i].text)) {
          //   topMenu.push(menuData[i]);
          // }
          topMenu.push(menuData[i]);
        }
      }

      // 取当前路径
      var path = getPath();

      // 刷新时菜单状态回复
      var isMenu = restoreMenu(topMenu, path);

      $scope.menu = topMenu;
      // 未找到匹配的菜单，则初始化选中菜单
      if (!isMenu) {
        $scope.menu[0].active = true;
        $scope.topMenuClick($scope.menu[0]);
      }
    };

    // 取得菜单
    var getMenuList = function() {

      // localStorage中存在否
      // if (Util.isStored('haimaPcmsMenu')) {
      //
      //   var menuData = localStorageService.get('haimaPcmsMenu');
      //   getUserInfo($scope.currentUser.access_token);
      //   // 绑定到页面
      //   bindMenu(menuData);
      // } else {
        if($scope.currentUser.username) {
          getUserInfo($scope.currentUser.access_token);
          var data = {};
          data.act = 'get_usercansee_pagerese';
          data.username = $scope.currentUser.username;
          data.ticket = TICKET;
          $rootScope.menuPromise = getMenuApi.getAll(data, function (result) {
            // 无数据
            if (!result.data) {
              // console.error('menu data is empty');
              Util.putSysMsg('danger', '400');
              return;
            }
            loginData.username = $scope.currentUser.username;
            if(result.data['潜客系统']) {
              // 保存
              localStorageService.set('haimaPcmsMenu', result.data['潜客系统'].children);

              // 绑定到页面
              bindMenu(result.data['潜客系统'].children);
            } else {
              // 保存
              localStorageService.set('haimaPcmsMenu', result.data);

              // 绑定到页面
              bindMenu(result.data);
            }

          });
        } else {
          Auth.logout();
          var url = HAIMA_END_POINT.url;
          $window.location.href = url;
        }

        // 保存
        // localStorageService.set('haimaPcmsMenu', result.data);

        // 绑定到页面
        // bindMenu(result.data);
      // }
    };

    // 左侧导航菜单显示/隐藏
    $scope.navMenuToggle = function() {
      if ($rootScope.bodyClass) {
        $rootScope.bodyClass = '';
      } else {
        $rootScope.bodyClass = 'navigation-small';
      }
    };

    // 修改密码
    $scope.changePassword = function() {
      // 传递参数
      var mParam = {};

      // 弹出选择框
      $uibModal.open({
        animation: false,
        templateUrl: 'views/index/change-password.html',
        controller: 'ChangePasswordCtrl',
        size: 'sm',
        resolve: {
          data: function() {
            return mParam;
          }
        }
      });

    };

    // 登出
    $scope.logout = function() {
      // // 清除session
      // userService.logOut();

      // 清除localStorage
      localStorageService.clearAll();
      //
      // MainApi.logout(function() {
      //   console.log('user logout');
      // });
      // $scope.gotoHaima();
    };

    // 设置
    $scope.setting = function() {
      $window.open('/toolbox/settings', '系统设置');
    };

    // 迁移到旧海马系统
    $scope.gotoHaima = function() {
      Auth.logout();
      var url = HAIMA_END_POINT.url;
      // if (userService.isLogin()) {
      //   url += '?token=' + userService.getAuth().token;
      // }
      $window.location.href = url;
    };

    // 主菜单选择
    $scope.topMenuClick = function(menu) {
      // 二级菜单设置
      $scope.secondMenu = [];

      // 图标信息已取得
      if ($scope.iconMatrix.default) {
        for (var i in menu.children) {
          $scope.secondMenu.push(menu.children[i]);
          // 设置icon数据
          if ($scope.iconMatrix[menu.children[i].text]) {
            menu.children[i].icon = $scope.iconMatrix[menu.children[i].text];
          } else {
            menu.children[i].icon = $scope.iconMatrix.default;
          }
        }
      } else {
        // $scope.iconPromise.then(function() {
          for (var i in menu.children) {
            $scope.secondMenu.push(menu.children[i]);
            // 设置icon数据
            if ($scope.iconMatrix[menu.children[i].text]) {
              menu.children[i].icon = $scope.iconMatrix[menu.children[i].text];
            } else {
              menu.children[i].icon = $scope.iconMatrix.default;
            }
          }
        // });
      }

      $scope.initTopSel();
      menu.active = true;
    };

    // clear主菜单选中
    $scope.initTopSel = function() {
      for (var i = 0; i < $scope.menu.length; i++) {
        $scope.menu[i].active = false;
      }
    };

    // 二级菜单，三级菜单折叠，打开
    $scope.toggleOpen = function(menu) {
      if (menu.open) {
        menu.open = false;
      } else {
        menu.open = true;
      }
      menu.invisable = false;
    };

    // 三级菜单折叠
    $scope.clearOpen = function(menus, menu) {
      for (var i = 0; i < menus.length; i++) {
        if (menus[i].text !== menu.text) {
          menus[i].open = false;
        }
      }
    };

    // 菜单选中
    $scope.openMenu = function(menu) {
      menu.open = true;
    };

    // 二级菜单选中
    $scope.activeSMenu = function(sMenu, tMenu) {
      // 清除选中
      for (var i = 0; i < $scope.secondMenu.length; i++) {
        $scope.secondMenu[i].active = false;
        for (var j in $scope.secondMenu[i].children) {
          $scope.secondMenu[i].children[j].active = false;
        }
      }
      sMenu.active = true;
      tMenu.active = true;
      $scope.selMenu.sMenu = sMenu;
      $scope.selMenu.tMenu = tMenu;
      $scope.selMenu.fMenu = {};
      sMenu.invisable = true;
    };

    // 三级菜单选中
    $scope.activeTMenu = function(sMenu, tMenu, fMenu) {
      // 清除选中
      for (var i = 0; i < $scope.secondMenu.length; i++) {
        $scope.secondMenu[i].active = false;
        for (var j in $scope.secondMenu[i].children) {
          $scope.secondMenu[i].children[j].active = false;
          for (var k in $scope.secondMenu[i].children[j].children) {
            $scope.secondMenu[i].children[j].children[k].active = false;
          }
        }
      }

      $scope.selMenu.sMenu = sMenu;
      $scope.selMenu.tMenu = tMenu;
      sMenu.invisable = true;
      sMenu.active = true;
      tMenu.active = true;
      // 存在三级菜单
      if (fMenu) {
        $scope.selMenu.fMenu = fMenu;
        fMenu.active = true;
      } else {
        $scope.selMenu.fMenu = {};
      }
    };

    // 打开菜单
    $scope.openMenu = function(url, sMenu, tMenu, fMenu) {
      // 取当前路径
      var path = getPath();

      // 点击当前页面
      if (url.equals(path)) {
        $state.reload();
        return;
      }
      if ('/'.equals(path) || '/welcome'.equals(path) || !$scope.isNewWindow) {
        $scope.activeTMenu(sMenu, tMenu, fMenu);
        // 不跳转
        $window.location.href = '#' + url;
      } else {
        $window.open('#' + url);
      }
    };

    getMenuList();

  });
