Page({
  data: {

  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: '关于' + wx.getStorageSync('mallName'),
    })
  },
  onShow() {

  },
})