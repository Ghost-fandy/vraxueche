//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello Fandy',
  },
  onLoad: function () {
    console.log('onLoad')
  },
  loginAction: function () {
    wx.redirectTo({
      url: '/page/index/index'
    })
  },
})
