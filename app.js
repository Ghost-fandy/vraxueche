//app.js
App({
  data: {
    
  },
  onLaunch: function () {
    var res = wx.getSystemInfoSync()
    this.globalData.windowHeight = res.windowHeight
  },
  globalData:{
    imgPath: "http://cdn.fandypeng.com/vraxueche/",
    windowHeight: 0,
  }
})