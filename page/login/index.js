//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    phoneNum: 0,
    smsCode: 0,
    phoneFocus: true,
    smsCodeFocus: false,
    smsBtnTitle: "获取验证码",
    time: 0
  },
  onLoad: function () {
    console.log('onLoad')
  },
  getPhoneNum: function(e) {
    var that = this
    console.log(e.detail.value)
    var phoneNum = e.detail.value
    if((/^1[34578]\d{9}$/.test(phoneNum))) {
      that.setData({
        phoneNum: phoneNum,
        phoneFocus: false,
        smsCodeFocus: true
      })
    }
  },
  getSmsCode: function(e) {
    var that = this
    console.log(e.detail.value)
    var smsCode = e.detail.value
    if((/^[1-9]\d{5}$/.test(smsCode))) {
      console.log("smsCode is ok")
      wx.hideKeyboard();
      that.setData({
        smsCode: smsCode,
        phoneFocus: false,
        smsCodeFocus: false
      })
    }
  },
  //请求验证码
  requestSmsCode: function(){
    if(this.data.phoneNum == 0) {
      console.log("phone num error")
      return false
    }
    var that = this
    var time = 60
    if(this.data.time > 0) {
      console.log("still in count")
      return false;
    }
    wx.request({
      url: 'https://www.axueche.com/driverManager/driverApi/vr/register',
      data: {
         stuPhone: this.data.phoneNum ,
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          smsBtnTitle: "剩余"+ time + "秒",
          time: time
        })
        var intval = setInterval(function(){
          time --
          if(time <= 0){
            clearInterval(intval);
            that.setData({
              smsBtnTitle: "获取验证码",
              time: 0
            })
            return false
          }
          that.setData({
            smsBtnTitle: "剩余"+ time + "秒",
            time: time
          })
        }, 1000)
      }
    })
  },
  loginAction: function () {
    var that = this
    if(!(/^1[34578]\d{9}$/.test(this.data.phoneNum))) {
      wx.showModal({
        title: '错误提示',
        content: '手机号码有误，请重新输入',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.setData({
              phoneFocus: true,
              smsCodeFocus: false
            })
          }
        }
      })

      return ;
    }
    if(!(/^[0-9]\d{5}$/.test(this.data.smsCode))) {
      wx.showModal({
        title: '错误提示',
        content: '验证码有误，请重新输入',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.setData({
              phoneFocus: false,
              smsCodeFocus: true
            })
          }
        }
      })

      return ;
    }

    //发起登录请求
    wx.request({
      url: 'https://www.axueche.com/driverManager/driverApi/vr/login',
      data: {
         stuPhone: this.data.phoneNum ,
         shortVerify: this.data.smsCode,
         sessionId: ""
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.code == 200) {
          try {
            wx.setStorageSync('userInfo', res.data.data)
          } catch (e) {
            console.log(e)    
          }
        }
        console.log(res.data.data)
      }
    })

    wx.redirectTo({
      url: '/page/index/index'
    })
  },
})
