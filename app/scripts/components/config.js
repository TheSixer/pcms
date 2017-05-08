'use strict';

angular.module('pcmsApp')

.value('cgBusyDefaults', {
  message: '正在处理，请稍候...',
  backdrop: false,
  templateUrl: 'views/template/loading.html',
  delay: 0,
  minDuration: 0,
})

.config(function(angularPromiseButtonsProvider) {
  angularPromiseButtonsProvider.extendConfig({
    spinnerTpl: '<span class="btn-spinner"><i class="fa fa-spin fa-spinner"></i></span>',
    disableBtn: true,
    btnLoadingClass: 'is-loading',
    addClassToCurrentBtnOnly: false,
    disableCurrentBtnOnly: false,
    minDuration: false,
    CLICK_EVENT: 'click',
    CLICK_ATTR: 'ngClick',
    SUBMIT_EVENT: 'submit',
    SUBMIT_ATTR: 'ngSubmit'
  });
})

.config(function ($resourceProvider) {
    $resourceProvider.defaults.actions = {
      // 新增
      create: {method: 'POST'},
      // 取得指定
      get:    {method: 'GET'},
      // 取得所有
      getAll: {method: 'GET', isArray:false},
      // 更新
      update: {method: 'PUT'},
      // 删除
      delete: {method: 'DELETE'}
    };
})

.config(function ($httpProvider,userServiceProvider) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.common = { 'access_token' : userServiceProvider.$get().getFromCookies().access_token};
  // rest of route code
})

.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('pcmsApp');
});
