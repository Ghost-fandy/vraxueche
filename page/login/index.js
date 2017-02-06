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
    smsBtnStyle: "weui-btn weui-btn_disabled weui-btn_warn"
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
    wx.request({
      url: 'https://www.axueche.com/driverManager/driverApi/vr/register',
      data: {
         stuPhone: this.data.phoneNum ,
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {

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

    wx.redirectTo({
      url: '/page/index/index'
    })
  },
})
