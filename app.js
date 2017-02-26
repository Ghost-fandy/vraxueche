//app.js
App({
  onLaunch: function () {
    var systemInfo = wx.getSystemInfoSync()
    this.globalData.windowHeight = systemInfo.windowHeight
    this.globalData.systemInfo = systemInfo
    var userInfo = this.getUserInfo(true)
    if(userInfo) {
      this.globalData.userInfo = userInfo
      wx.redirectTo({
        url: '/page/index/index'
      })
    }
  },
  getLocationInfo: function(cb){
    var that = this;
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
        that.globalData.locationInfo = res;
        console.log(res)
        cb(that.globalData.locationInfo)
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  getUserInfo: function() {
    var reLogin = arguments[0] ? arguments[0] : false;
    var userInfo = wx.getStorageSync("userInfo")
    
    if(userInfo == undefined || userInfo == null || userInfo == NaN || userInfo == "") {
      if(reLogin) {
        wx.redirectTo({
          url: '/page/login/index'
        })
      }
      return null
    }

    return userInfo
  },
  globalData:{
    systemInfo: null,
    imgPath: "https://cdn.fandypeng.com/vraxueche/",
    windowHeight: 0,
    locationInfo: null,
    userInfo: null
  }
})