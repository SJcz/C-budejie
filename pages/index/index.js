//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util');


Page({
  data: {
    loadingIcon: "http://120.78.124.36/wxxcx/C_BDJ/loading.gif",
    playIcon: "http://120.78.124.36/wxxcx/C_BDJ/bofang.png",
    titleList: ['全部', '图片', '段子'],
    topScrollViewHeight: 45, //顶部菜单栏高度
    swiperHeight: 0, //spiwer高度, 需要通过计算得到， 因为内置了y轴滑动scroll-view, 所以设置scroll-view高度为100%即可
    selectedTitleIndex: 0, //顶部选中的标题下标

    //记录5个tab的maxtime参数，这个用来获取不得姐的更多数据
    BDJquanbuTagMaxtime: 0,
    BDJshipinTagMaxtime: 0,
    BDJtupianTagMaxtime: 0,
    BDJduanziTagMaxtime: 0,
    BDJshengyinTagMaxtime: 0,

    playingVideoId: 0, //正在播放的视频id

    quanbuDataList: [],
    tupianDataList: [],
    duanziDataList: [],
    shipinDataList: [],
    shengyinDataList: [],
  },

  //单击切换首页顶部tab栏
  changeTopTab: function(e) {
    var index = e.currentTarget.dataset.index;

    this.setData({
      selectedTitleIndex: index
    });
  },

  //切换swiper的item
  swiperContent: function(e) {
    this.stopVideo(); //切换swiper时停止视频

    var current = e.detail.current;
    this.setData({
      selectedTitleIndex: current
    });

    //一下均设置延迟请求是因为，swiper转换过程中发生请求和渲染时，卡顿现象严重
    //所以设置0.5s延迟, 等swiper切换完再请求刷新数据
    if (current == 0 && this.data.BDJquanbuTagMaxtime == 0) {
      console.log("get quanbu shipin data")
      setTimeout(() => {
        this.loadTabContentData(1, 0, 0); //获取 全部 tab第一页数据
      }, 500);
    }
    if (current == 1 && this.data.BDJtupianTagMaxtime == 0) {
      console.log("get budejie tupian data");
      setTimeout(() => {
        this.loadTabContentData(10, 0, 1); //获取 图片 tab第一页数据
      }, 500);
    }
    if (current == 2 && this.data.BDJduanziTagMaxtime == 0) {
      console.log("get duanzi tupian data");
      setTimeout(() => {
        this.loadTabContentData(29, 0, 2); //获取 段子 tab第一页数据
      }, 500);
    }
    if (current == 3 && this.data.BDJshipinTagMaxtime == 0) {
      console.log("get budejie shipin data");
      setTimeout(() => {
        this.loadTabContentData(41, 0, 3); //获取 视频 tab第一页数据
      }, 500);
    }
    if (current == 4 && this.data.BDJshengyinTagMaxtime == 0) {
      console.log("get budejie shengyin data");
      setTimeout(() => {
        this.loadTabContentData(31, 0, 4); //获取 声音 tab第一页数据
      }, 500);
    }
  },
  
  //点击内容区每一个cell, 转入包含评论的详细界面
  switchTodetailPage: function (e) {
    //获取原始数据源
    console.log(e);
    var source = e.currentTarget.dataset.source;
    wx.navigateTo({
      url: '/pages/detail/detail?dataSource=' + encodeURIComponent(JSON.stringify(source)),
    })
  },

  //点击图片 预览完整图片
  switchTodetailImagePage: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    });
  },

  onLoad: function () {
    this.getSwiperHeight();
    this.loadTabContentData(1, 0, 0); //表示加载 全部 的第一页数据
  },

  //计算swiper高度，也是为了设置scroll-view的高度
  getSwiperHeight: function () {
    var query = wx.createSelectorQuery();
    var that = this;
    query.select('.top-scroller-view').boundingClientRect((rect) => {
      var topHeight = rect.height;
      var pageHeight = wx.getSystemInfoSync().windowHeight;
      console.log(pageHeight - topHeight)
      that.setData({
        swiperHeight: pageHeight - topHeight
      });
    }).exec();
  },

  //加载对应tab的数据
  loadTabContentData: function (type, maxtime, currentTabIndex) {
    var that = this;
    this.requestBDJapi(type, maxtime).then((result) => {
      console.log(result);
      switch (currentTabIndex) {
        case 0:
          result.list.forEach((item) => {
            if (item.type == 41) {
              item.videotime = util.formatMinSec(item.videotime);
            }
          });
          if (maxtime == 0) {
            that.setData({
              quanbuDataList: result.list
            });
          } else {
            that.setData({
              quanbuDataList: that.data.quanbuDataList.concat(result.list)
            });
          }
          that.data.BDJquanbuTagMaxtime = result.info.maxtime;
          break;
        case 1:
          if (maxtime == 0) {
            that.setData({
              tupianDataList: result.list
            });
          } else {
            that.setData({
              tupianDataList: that.data.tupianDataList.concat(result.list)
            });
          }
          that.data.BDJtupianTagMaxtime = result.info.maxtime;
          break;
        case 2:
          if (maxtime == 0) {
            that.setData({
              duanziDataList: result.list
            });
          } else {
            that.setData({
              duanziDataList: that.data.duanziDataList.concat(result.list)
            });
          }
          that.data.BDJduanziTagMaxtime = result.info.maxtime;
          break;
        case 3:
          result.list.forEach((item) => {
              item.videotime = util.formatMinSec(item.videotime);
          });
          if (maxtime == 0) {
            that.setData({
              shipinDataList: result.list
            });
          } else {
            that.setData({
              shipinDataList: that.data.shipinDataList.concat(result.list)
            });
          }
          that.data.BDJshipinTagMaxtime = result.info.maxtime;
          break;
        case 4:
          if (maxtime == 0) {
            that.setData({
              shengyinDataList: result.list
            });
          } else {
            that.setData({
              shengyinDataList: that.data.shengyinDataList.concat(result.list)
            });
          }
          that.data.BDJshengyinTagMaxtime = result.info.maxtime;
          break;
      }
    }).catch((err) => {
      wx.showToast({
        title: '服务器错误',
        icon: 'none'
      });
    })
  },

  //点击播放视频
  playVideo: function (e) {
    var that = this;
    var videoId = e.currentTarget.dataset.videoid;
    console.log(videoId);

    if (videoId == this.data.playingVideoId) {
      return;
    } 
    
    this.stopVideo();

    this.setData({
      playingVideoId: videoId
    });

    console.log(this.data.playingVideoId);

    var videoContext = wx.createVideoContext(videoId);
    videoContext.play();
  },

  //暂停正在播放的其他视频
  stopVideo: function () {
    if (this.data.playingVideoId != 0) {
      var videoContext = wx.createVideoContext(this.data.playingVideoId);
      videoContext.seek(0);  //跳到开头
      videoContext.pause(); //暂停视频
    }
  },

  //tab下拉到底时触发， 得到当前tab下一页数据
  lowerMoreData: function () {
    var that = this;
    var type = 0;
    var maxtime = 0;
    var currentTabIndex = that.data.selectedTitleIndex;
    switch (currentTabIndex) {
      case 0:
        type = 1;
        maxtime = that.data.BDJquanbuTagMaxtime;
        break;
      case 1:
        type = 10;
        maxtime = that.data.BDJtupianTagMaxtime;
        break;
      case 2:
        type = 29;
        maxtime = that.data.BDJduanziTagMaxtime;
        break;
      case 3:
        type = 41;
        maxtime = that.data.BDJshipinTagMaxtime;
        break;
      case 4:
        type = 31;
        maxtime = that.data.BDJshengyinTagMaxtime;
        break;
    }
    that.loadTabContentData(type, maxtime, currentTabIndex); //type, maxtime, curretnTabIndex
  },

  //request 不得姐 api
  requestBDJapi: function (type, maxtime) {
    /*
    type = 1 : 全部
    type = 41 : 视频
    type = 10 : 图片
    type = 29 : 段子
    type = 31 : 声音
    */
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://api.budejie.com/api/api_open.php', //
        data: {
          a: 'list',
          c: 'data',
          type: type,
          maxtime: maxtime
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

})
