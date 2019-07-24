// pages/login/login.js
const AV = require('../../libs/av-weapp-min.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoIcon: "http://120.78.124.36/wxxcx/C_BDJ/logo.png",
    mobileNumber: '',
    verCode: '',
    disableGetVer: true, //获取验证码按钮 默认未激活, 只有电话号码长度为11才激活
    disableLoginBtn: true, //登陆按钮 默认未激活, 只有电话号码长度为11 以及 验证码为6才激活
    isCountdown: false, //是否正在倒计时
    btnValue: '获取验证码'  //获取验证码按钮的值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //获取验证码倒计时
  countdown: function () {
    var that = this;
    this.data.btnValue = 61;
    var interval = setInterval(() => {
      if (that.data.btnValue != 0) {
        that.data.btnValue -= 1;
        that.setData({
          btnValue: that.data.btnValue,
          disableGetVer: true
        });
      } else {
        that.setData({
          btnValue: '获取验证码',
          disableGetVer: false
        });
        clearInterval(interval);
      }
    }, 1000);
  },

  //获取验证码
  getVerCode: function (e) {
    console.log(e);
    var that = this;
    if (this.data.btnValue != '获取验证码') {
      return;
    }

    var reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
    if (!reg.test(this.data.mobileNumber)) {
      wx.showToast({
        title: '电话号码不正确',
        icon: 'none'
      });
      return;
    }

    //如果用户已经绑定手机号,并且验证通过了, 那么直接调用验证码登录相关接口
    if (app.globalData.user.get("mobilePhoneNumber") && app.globalData.user.get("mobilePhoneVerified")) {
      AV.User.requestLoginSmsCode(this.data.mobileNumber).then((result) => {
        console.log(result);
        that.countdown();
      }).catch((err) => {
        console.log(err);
        wx.showToast({
          title: '获取验证码失败',
          icon: 'none'
        });
      });
    } else {
      //如果用户为绑定手机号,或者未验证, 那么调用验证码注册相关接口
      app.globalData.user.setMobilePhoneNumber(this.data.mobileNumber)
      app.globalData.user.save().then((user) => {
        return user.save();
      }).then((user) => {
        // 发送验证短信
        return AV.User.requestMobilePhoneVerify(user.getMobilePhoneNumber());
      }).then((result) => {
        console.log(result);
        that.countdown();
      }).catch((err) => {
        console.log(err);
        wx.showToast({
          title: '获取验证码失败',
          icon: 'none'
        });
      });
    }
  },

  login: function () {
    var reg = /^[0-9]{6}$/;
    if (!reg.test(this.data.verCode)) {
      wx.showToast({
        title: '验证码格式不对',
        icon: 'none'
      });
      return;
    }

    if (app.globalData.user.get("mobilePhoneNumber") && app.globalData.user.get("mobilePhoneVerified")) {
      AV.User.logInWithMobilePhoneSmsCode(this.data.mobileNumber, this.data.verCode).then(function (success) {
        console.log(success);
        wx.navigateBack({
          url: "/pages/my/my"
        });
      }).catch((err) => {
        console.log(err);
        wx.showToast({
          title: '验证失败',
          icon: 'none'
        });
      })
    } else {
      AV.User.verifyMobilePhone(this.data.verCode).then((result) => {
        wx.showToast({
          title: '登陆成功',
        });
        wx.navigateBack({
          url: "/pages/my/my"
        });
      }).catch((err) => {
        console.log(err);
        wx.showToast({
          title: '验证失败',
          icon: 'none'
        });
      });
    }
  },

  changeMN: function (e) {
    this.setData({
      mobileNumber: e.detail.value
    });

    if (e.detail.value.length == 11) {
      this.setData({
        disableGetVer: false
      });
    } else {
      this.setData({
        disableGetVer: true
      });
    }
  },

  changeVerCode: function (e) {
    this.setData({
      verCode: e.detail.value
    });

    if (this.data.mobileNumber.length == 11 && e.detail.value.length == 6) {
      this.setData({
        disableLoginBtn: false
      });
    } else {
      this.setData({
        disableLoginBtn: true
      });
    }
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})