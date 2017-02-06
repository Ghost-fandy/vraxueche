// page/index/index.js
var app = getApp();
Page({
  data: {
    controls: [{
      id: 1,
      iconPath: '/image/yuanwei@3x.png',
      position: {
        left: 10,
        top: app.globalData.systemInfo.windowHeight - 50,
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
    markers: null
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
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
        wx.scanCode({
          success: function(res){
            // success
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
    if(app.globalData.userInfo != null) {
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
    var markers = [], circles = []
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
        latitude: locationInfo.latitude,
        longitude: locationInfo.longitude,
        color: "#BCE1F3AA",
        fillColor: "#BCE1F3AA",
        radius: 100
      })

      //请求所有的学车点


      that.setData({
        longitude: locationInfo.longitude,
        latitude: locationInfo.latitude,
        markers: markers,
        circles: circles,
        controls: controls,
      })

    })
  },
  // 根据坐标获取车的列表
  getCarList: function(){

  }

})