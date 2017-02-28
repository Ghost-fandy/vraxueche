// page/index/index.js
var app = getApp();
Page({
  data: {
    controls: [{
      id: 1,
      iconPath: '/image/yuanwei@3x.png',
      position: {
        left: 10,
        top: app.globalData.systemInfo.windowHeight - 52,
        width: 40,
        height: 40
      },
      clickable: true
    },{
      id: 4,
      iconPath: '/image/status.png',
      position: {
        left: app.globalData.systemInfo.windowWidth - 90,
        top: 10,
        width: 78,
        height: 58
      },
      clickable: false
    }],
    longitude: 0,
    latitude: 0,
    circles: null,
    markers: [],
    hasMarkers: 0
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e)
  },
  controltap(e) {
    var that = this
    //点击地图上的按钮
    switch(e.controlId) {
      case 1:
        this.locate()
        break
      case 2:
        wx.navigateTo({
          url: "/page/login/index"
        })
        break
      case 3:
        // wx.redirectTo({
        //   url: '/page/learn/index'
        // })
        // return 
        wx.scanCode({
          success: function(res){
            if(res.errMsg == "scanCode:ok") {
              that.scanVr(res)              
            }
            // wx.showToast({
            //   title: JSON.stringify(res),
            //   icon: 'loading',
            //   duration: 2000
            // })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
        break
    }
  },
  onLoad:function(options){
    
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000
    })
    var controls = this.data.controls
    var btnControls = {
      id: 2,
      iconPath: '/image/login.png',
      position: {
        left: app.globalData.systemInfo.windowWidth/2 - 46,
        top: app.globalData.systemInfo.windowHeight - 50,
        width: 94,
        height: 36
      },
      clickable: true
    }
    var userInfo = app.getUserInfo()
    if(userInfo) {
      btnControls.id = 3
      btnControls.iconPath = "/image/sacn.png"
    }
    controls.push(btnControls)

    this.locate(controls)

    console.log("页面加载")
  },
  onReady:function(){
    // 页面渲染完成
    console.log("页面渲染完成")
  },
  onShow:function(){
    // 页面显示
    console.log("页面显示")
    var userInfo = app.getUserInfo()
    var controls = this.data.controls
    var controlLengh = controls.length
    for (var i=0; i < controlLengh; i++) {
      var obj = controls[i]
      if(userInfo && obj.id == 2) {
        controls[i].id = 3
        controls[i].iconPath = "/image/sacn.png"
      }

      if(!userInfo && obj.id == 3) {
        controls[i].id = 2
        controls[i].iconPath = "/image/login.png"
      }
    }
    this.setData({
      controls: controls
    })
  },
  onHide:function(){
    // 页面隐藏
    console.log("页面隐藏")
  },
  onUnload:function(){
    // 页面关闭
    console.log("页面关闭")
  },
  //获取中间点的经纬度，并mark出来
  getLngLat: function(){
      var that = this;
      this.mapCtx = wx.createMapContext("map");
      this.mapCtx.getCenterLocation({
        success: function(res){
          console.log(res)
          that.setData({
            longitude: res.longitude
            ,latitude: res.latitude
          })

          //获取附近的学车点
          that.getCarList(res, that)
        }
      })
  },
  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置
      if(e.type == 'end'){
          this.getLngLat()
      }
  },
  locate: function(controls){
    var that = this
    var circles = []
    if(controls == undefined) {
      var controls = this.data.controls
    }
    app.getLocationInfo(function(locationInfo){
      controls.push({
        id: 4,
        iconPath: '/image/located@3x.png',
        position: {
          left: app.globalData.systemInfo.windowWidth/2 - 10,
          top: app.globalData.systemInfo.windowHeight/2 - 19,
          width: 21,
          height: 38
        },
        clickable: false
      })
      circles.push({
        longitude: locationInfo.longitude,
        latitude: locationInfo.latitude,
        color: "#BCE1F3AA",
        fillColor: "#BCE1F3AA",
        radius: 100
      })
      
      that.getCarList(locationInfo, that)

      that.setData({
        // longitude: 114.268063,
        // latitude: 30.435671,
        longitude: locationInfo.longitude,
        latitude: locationInfo.latitude,
        circles: circles,
        controls: controls,
        hasMarkers: false
      })

    })
  },
  // 根据坐标获取车的列表
  getCarList: function(locationInfo, that){
      // var markers = that.data.markers
      var markers = []
      var hasMarkers = this.data.hasMarkers
      wx.request({
        url: 'https://www.axueche.com/driverManager/driverApi/vr/vrList',
        data: {
           longitude: locationInfo.longitude,
           latitude: locationInfo.latitude,
           coachName: "",
           page: 1
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          if(res.data.code == 200 && res.data.data.list.length > 0) {
            var vrList = res.data.data.list
            vrList.forEach(function(obj){
              if(!obj.hasOwnProperty("latitude") || !obj.hasOwnProperty("longitude")) {
                return false
              }
              console.log(obj)
              markers.push({
                id: obj.id,
                iconPath: "/image/sparing-icon@3x.png",
                latitude: parseFloat(obj.latitude) + (Math.random()/100),
                longitude: parseFloat(obj.longitude) - (Math.random()/100),
                width: 50,
                height: 57
              })
            })

            that.setData({
              markers: markers,
              hasMarkers: hasMarkers + 1
            })
            wx.hideToast()
          } else {
            that.redirectToLogin(res)
          }
      },
      fail: function(res) {
        wx.showToast({
          title: 'getCarList请求失败',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  scanVr: function(scanObj) {

    var that = this
    var scanData = scanObj.result.split(",");
    var userInfo = wx.getStorageSync("userInfo")
    if(userInfo == undefined || userInfo == null || userInfo == NaN) {
      wx.redirectTo({
        url: '/page/login/index'
      })
      return false;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000
    })
    wx.request({
        url: 'https://www.axueche.com/driverManager/driverApi/vr/scanvr',
        data: {
           uuid: scanData[0],
           deviceId: scanData[1],
           id: userInfo.id,
           sessionId: userInfo.sessionId
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          if(res.data.code == 200) {
            that.vrLogin(scanData)
          } else {
            that.redirectToLogin(res)
          }
      },
      fail: function(res) {
        wx.showToast({
          title: 'scanVr请求失败',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  vrLogin: function(scanData) {
    var that = this
    wx.request({
        url: 'https://www.axueche.com/driverManager/driverApi/vr/vrlogin',
        data: {
           uuid: scanData[0]
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          if(res.data.code == 200) {
            wx.hideToast()
            wx.redirectTo({
              url: '/page/learn/index'
            })
          } else {
            that.redirectToLogin(res)
          }
      },
      fail: function(res) {
        wx.showToast({
          title: 'vrLogin请求失败',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  }, 
  redirectToLogin: function(res) {
    wx.showToast({
      title: res.data.msg,
      icon: 'loading',
      duration: 2000,
      complete: function(){
        wx.redirectTo({
          url: '/page/login/index?code=1'
        })
      }
    })
  }

})