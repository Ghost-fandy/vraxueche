// page/index/index.js
var app = getApp();
Page({
  data: {
    markers: [{
      iconPath: app.globalData.imgPath + "located@3x.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 21,
      height: 38
    }],
    controls: [{
      id: 1,
      iconPath: app.globalData.imgPath + 'sparing-icon@3x.png',
      position: {
        left: 10,
        top: app.globalData.windowHeight - 65,
        width: 50,
        height: 55
      },
      clickable: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log(res);
      }
    })
  },
  onLoad:function(options){
    console.log(app.globalData.windowHeight);
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})