// pages/my/my.js
const AV = require('../../libs/av-weapp-min.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    updateLogIcon: 'http://120.78.124.36/wxxcx/c_note/gengxin.png',
    adviceIcon: 'http://120.78.124.36/wxxcx/c_note/yijian.png',
    guanyuIcon: 'http://120.78.124.36/wxxcx/c_note/guanyu.png',
    dayuhaoIcon: 'http://120.78.124.36/wxxcx/c_note/dayuhao.png',
    squareList: [], //广场列表
    squareWidth: 0, //每一个广场的宽度， 理论上为 页面宽度/4 - padding - border * 2
    userHasLogin: false, //用户已经登录, 意味着绑定了电话号码
    userInfo: {} //用户基本信息, 头像和名字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  
    this.getPageWidth();

    /*
    this.requestBDJapi().then((result) => {
      console.log(result);
      var arr = [];
      result.square_list.forEach((item) => {
        //item.icon = item.icon ? item.icon.replace("http:", "https:") : '';
      });
      
      that.setData({
        squareList: that.filterSquare(result.square_list)
      });
    }).catch((err) => {
      wx.showToast({
        title: '服务器错误',
        icon: 'none'
      });
    });
    */

    if (app.globalData.user.get("mobilePhoneNumber") && app.globalData.user.get("mobilePhoneVerified")) {
      this.setData({
        userHasLogin: true,
        userInfo: {
          name: app.globalData.user.get("nickName"),
          avatar: app.globalData.user.get("avatarUrl")
        }
      });
    }
  },

  filterSquare: function (squareList) {
    var returnArr = [];

    for (var i = 0; i < squareList.length; i++) {
      var exists = false;
      for (var j = 0; j < returnArr.length; j++) {
        if (returnArr[j].name == squareList[i].name) {
          exists = true;
        }
      }
      if (!exists) {
        returnArr.push(squareList[i]);
      }
    } 

    return returnArr.slice(0, returnArr.length - 1);
  },

  //获取用户信息
  getUserInfo: function(e) {
    //使用leancloud 一键登录
    var that = this;
    var userInfo = e.detail.userInfo;
    console.log(userInfo);

    AV.User.loginWithWeapp().then(user => {
      return user.set(userInfo).save();
    }).then(user => {
      app.globalData.user = user;
      console.log(user);

      wx.navigateTo({
        url: '/pages/login/login',
      })
    }).catch(console.error);
  },

  getPageWidth: function () {
    //计算页面宽度，
    var pageWidth = wx.getSystemInfoSync().windowWidth;
    console.log(pageWidth);

    this.setData({
      squareWidth: pageWidth/4 - 10 - 2
    });
  },

  //request 不得姐 api
  requestBDJapi: function () {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://api.budejie.com/api/api_open.php',
        data: {
          a: 'square',
          c: 'topic'
        },
        method: 'Get',
        success(res) {
          resolve(res.data);
        },
        fail(err) {
          console.log(err);
          reject('fail');
        }
      });
    });
  },

  //切换到建议页面
  switchToAdvicePage: function () {
    wx.navigateTo({
      url: '/pages/advice/advice'
    });
  },

  //切换到更新日志页面
  switchToUpdateLogPage: function () {
    wx.showModal({
      title: '更新公告',
      content: '暂无更新',
      showCancel: false
    });
  },

  //显示项目说明
  showProjectIntroduction: function () {
    wx.showModal({
      title: '关于忘忧段子',
      content: '一个带来快乐的小程序 \n' +
        '有建议可以反馈哦 \n' +
        '\n\n' +
        '希望快乐能让时光慢些',
      showCancel: false
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.user.get("mobilePhoneNumber") && app.globalData.user.get("mobilePhoneVerified")) {
      this.setData({
        userHasLogin: true,
        userInfo: {
          name: app.globalData.user.get("nickName"),
          avatar: app.globalData.user.get("avatarUrl")
        }
      });
    }
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