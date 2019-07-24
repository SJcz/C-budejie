// pages/follow/follow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingIcon: "http://120.78.124.36/wxxcx/C_BDJ/loading.gif",
    categoryList: [], //左边的主分类列表, 类似{"count": 65,"id": 5, "name": "搞笑原创"}形式
    selectedCategoryIndex: 0, //当前选中的分类下标
    userList: [], //右边的用户列表, 形式如下
    currentUserPage: 1, //当前的用户列表页数, 主要是作为加载用户数据的参数.
    scrollViewHeight: 0, //scroll-view的高度
    showLoadingTip: true, //是否显示 加载数据的提示, 当没有更多数据时, 不显示
    /*
    {
            "fans_count": 41300,
            "header": "http://wimg.spriteapp.cn/profile/large/2015/07/10/559f25fde479a_mini.jpg",
            "uid": 3532795,
            "is_vip": false,
            "is_follow": 0,
            "introduction": "",
            "gender": 2,
            "tiezi_count": 207,
            "screen_name": "一风之音"
        },
    */
  },

  followUser: function () {
    wx.showModal({
      content: '暂未开放',
      showCancel: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCategotyList();
    this.getScrollViewHeight();
  },

  //计算scroll-view高度，
  getScrollViewHeight: function () {
    var pageHeight = wx.getSystemInfoSync().windowHeight;
    console.log(pageHeight);
    this.setData({
      scrollViewHeight: pageHeight
    });
  },

  //加载左边分类列表
  loadCategotyList: function () {
    var that = this;
    wx.request({
      url: 'https://api.budejie.com/api/api_open.php', 
      data: {
        a: 'category',
        c: 'subscribe',
      },
      method: 'Get',
      success(res) {
        console.log(res);
        that.setData({
          categoryList: res.data.list
        });

        that.requestBDJapi(that.data.categoryList[that.data.selectedCategoryIndex].id, 1).then((result) => {
          console.log(result);
          that.setData({
            userList: result.list
          });
        }).catch((err) => {
          console.log(err);
          wx.showToast({
            title: '服务器错误',
            icon: 'none'
          });
        });

        that.requestBDJapi(that.data.categoryList[that.data.selectedCategoryIndex].id, 2).then((result) => {
          if (result.list.length == 0) {
            that.setData({
              showLoadingTip: false //表示没有下一页数据了
            });
          } else {
            that.setData({
              showLoadingTip: true //表示有下一页数据
            });
          }
        }).catch(console.error());
      },
      fail(err) {
        console.log(err);
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        });
      }
    });
  },

  //点击左边主分类列表
  changeSelectedCategory: function (e) {
    var categoryIndex = e.currentTarget.dataset.categoryindex;
    var that = this;
    if (categoryIndex != this.data.selectedCategoryIndex) {
      that.setData({
        userList: [],
        showLoadingTip: true
      });
      console.log(this.data.categoryList[categoryIndex].id);
      this.requestBDJapi(this.data.categoryList[categoryIndex].id, 1).then((result) => {
        console.log(result);
        that.setData({
          userList: result.list
        });
      }).catch((err) => {
        console.log(err);
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        });
      });

      this.requestBDJapi(this.data.categoryList[categoryIndex].id, 2).then((result) => {
        if (result.list.length == 0) {
          that.setData({
            showLoadingTip: false //表示没有下一页数据了
          });
        } else {
          that.setData({
            showLoadingTip: true //表示有下一页数据
          });
        }
      }).catch(console.error());

      this.setData({
        selectedCategoryIndex: categoryIndex,
        currentUserPage: 1
      });
    }
  },

  //request 不得姐 api
  requestBDJapi: function (categotyId, page) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://api.budejie.com/api/api_open.php', 
        data: {
          a: 'list',
          c: 'subscribe',
          category_id: categotyId,
          page: page
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

  lowerMoreData: function () {
    var that = this;
    this.data.currentUserPage++;

    this.requestBDJapi(this.data.categoryList[this.data.selectedCategoryIndex].id, this.data.currentUserPage).then((result) => {
      console.log(result);
      that.setData({
        userList: that.data.userList.concat(result.list),
        currentUserPage: that.data.currentUserPage
      });
    }).catch((err) => {
      console.log(err);
      wx.showToast({
        title: '服务器错误',
        icon: 'none'
      });
    });

    this.requestBDJapi(this.data.categoryList[this.data.selectedCategoryIndex].id, this.data.currentUserPage + 1).then((result) => {
      if (result.list.length == 0) {
        that.setData({
          showLoadingTip: false //表示没有下一页数据了
        });
      } else {
        that.setData({
          showLoadingTip: true //表示有下一页数据
        });
      }
    }).catch(console.error());
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})