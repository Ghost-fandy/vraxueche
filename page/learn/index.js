//index.js
var util = require('../../util/util.js')
//获取应用实例
var app = getApp()
var that = this
Page({
  data: {
    runTime: "00:00:00",
    time: 0
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    setInterval(function(){
      that.data.time += 1
      that.data.runTime = util.formatTime(that.data.time)
      that.setData({
        time: that.data.time,
        runTime: that.data.runTime
      })
    }, 1000)
  },
  vrQuit: function() {
    this.setData({
      time: 0,
      runTime: 0
    })
    wx.showModal({
      title: '确定要退出吗？',
      content: '点击确定会马上结束VR模拟器的学习',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.redirectTo({
            url: '/page/index/index'
          })
        }
      }
    })
    
  }
})
