const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog'
const wxpay = require('../../utils/pay.js')
app.configLoadOK = () => {
  
}
Page({
  data: {

  },
  onLoad: function (options) {
    // options.key = 'qa'
    this.cmsPage(options.key)
  },
  onShow: function () {

  },
  async cmsPage(key) {
    const res = await WXAPI.cmsPage(key)
    if (res.code == 0) {
      this.setData({
        cmsPage: res.data
      })
      wx.setNavigationBarTitle({
        title: res.data.info.title,
      })
    }
  },
})