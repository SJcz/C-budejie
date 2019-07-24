// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cell_datasource: null, //数据源
    playIcon: "http://120.78.124.36/wxxcx/C_BDJ/bofang.png",
    playingVideoId: 0, 
    lastCommentId: 0, //当前最后一个评论的id， 用于获取下一页评论
    commentList: []
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取传递过来的 视频/声音/段子 数据源
    console.log(options);
    var that = this;
    var cell_datasource = JSON.parse(decodeURIComponent(options.dataSource));
    that.setData({
      cell_datasource: cell_datasource
    });

    that.requestCommentapi(cell_datasource.id, 0).then((result) => {
      console.log(result);
      if (result.data && result.data.length > 0) {
        that.setData({
          commentList: result.data
        });
        that.data.lastCommentId = result.data[result.data.length - 1].id;
      }
    }).catch((err) => {
      console.log(err);
      wx.showToast({
        title: '服务器错误',
        icon: 'none',
        duration: 1000,
        mask: true
      });
    });
  },

  //点击播放视频
  playVideo: function (e) {
    var that = this;
    var videoId = e.currentTarget.dataset.videoid;
    console.log(videoId);

    if (videoId == this.data.playingVideoId) {
      return;
    }

    this.setData({
      playingVideoId: videoId
    });
    var videoContext = wx.createVideoContext(videoId);
    videoContext.play();
  },

  //点击图片 预览完整图片
  switchTodetailImagePage: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    });
  },

  //获取评论列表
  requestCommentapi: function (data_id, lastcid) {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://api.budejie.com/api/api_open.php', //
        data: {
          a: 'datalist',
          c: 'comment',
          data_id: data_id,
          lastcid: lastcid
        },
        method: 'Get',
        success(res) {
          resolve(res.data);
        },
        fail(err) {
          console.log(err);
          reject('fail');
        }
      })
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
    var that = this;
    that.requestCommentapi(this.data.cell_datasource.id, this.data.lastCommentId).then((result) => {
      console.log(result);
      if (result.data && result.data.length > 0) {
        that.setData({
          commentList: that.data.commentList.concat(result.data)
        });
        that.data.lastCommentId = result.data[result.data.length - 1].id;
      }
    }).catch((err) => {
      console.log(err);
      wx.showToast({
        title: '服务器错误...',
        icon: 'none',
        duration: 1000,
        mask: true
      });
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})