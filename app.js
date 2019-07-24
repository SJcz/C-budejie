//app.js
const AV = require('./libs/av-weapp-min.js');

AV.init({
  appId: 'xxxxxxxxxxxxx-gzGzoHsz',
  appKey: 'xxxxxxxxxxxxx',
});

AV.Advice = AV.Object.extend('Advice');

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var user = AV.User.current();
    console.log(user);

    if (user) {
      this.globalData.user = user;
    }
  },
  globalData: {
    user: null
  }
})