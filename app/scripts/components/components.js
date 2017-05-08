'use strict';
/**
 * 存放系统中 使用的常量
 */
angular.module('pcmsApp')
  .constant('API_END_POINT', {
<<<<<<< HEAD
    // url: '/pcms'
=======
    url: '/pcms/api'
>>>>>>> b1a7b1c952408f670b96c4c387bbc537125c43e9
    // 发布用
    url: '/pcms/api'
  })
  .constant('HAIMA_END_POINT', {
    url: '/'
  })
  .constant('TOKEN_NAME', 'pcms')
  .constant('REGEX', {
    idCard: '^(\\d{15}|\\d{17}[\\d|X])$',
    number: '^\\d+$',
    // 非负整数
    nnInt: '^\\d+$',
    // 非0正整数
    pInt: '^\\+?[1-9][0-9]*$',
    // 带2位小数
    decimal1: '^\\d+(\\.\\d{1})?$',
    // 带2位小数
    decimal2: '^\\d+(\\.\\d{1,2})?$',
    phone: '(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^1[3|4|5|6|7|8|9]\\d{9}$)',
    mobile1: '^(\\+?\\d{2，4})?1[34578]\\d{9}$',
    mobile2: '^1[3|4|5|6|7|8|9]\\d{9}$',
    birthday: '^[12][0-9]{3}[01][0-9][0123][0-9]$',
    birthday2: '^\\d{8}$',
    tel: '^(\\+?\\d{2,4})?((\\d{3,4}\\-?)?\\d{7,8}|1[34578]\\d{9})$',
    vin: '^[A-Z0-9]{17}$',
    //邮政编码
    zipcode: '^\\d{6}$',
    email: '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'
  })
  .constant('PAGE_CONST', {
    numPerGet: 150,
    max: 9999,
    pageList: [5, 10, 15, 25, 50]
  })
  .constant('TICKET', '41b99d404b74f5f8bcaa224fa4e40135')
  .constant('loginData', {
    grant_type: '',
    client_id: '',
    username: '',
    password: ''
  })
  .constant('OPTION', {
    title: {
      text: ''
    },
    tooltip : {
      trigger: 'axis',
      // formatter: "{b}<br/>{a0} : {c0}<br/>{a1} : {c1}%",
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data:[]
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: []
      }
    ],
    yAxis: [
      {
        type : 'value'
      }
    ],
    series: [],
    color: []
  });
