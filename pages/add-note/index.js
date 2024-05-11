const app = getApp()
app.configLoadOK = () => {
  
}
Page({
  data: {
    remark: ''
  },
  onLoad: function (options) {
    const order_remark_msg = wx.getStorageSync('order_remark_msg')
    if (order_remark_msg) {
      this.setData({
        list: order_remark_msg.split('\n')
      })
    }
  },
  onShow: function () {
    const remark = wx.getStorageSync('remark')
    if (remark) {
      this.setData({
        remark
      })
    }
  },
  msgTap(e) {
    const remark = e.currentTarget.dataset.msg
    wx.setStorageSync('remark', remark)
    this.setData({
      remark
    })
  },
  ok() {
    wx.setStorageSync('remark', this.data.remark)
    wx.navigateBack()
  },
})