const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog'
const wxpay = require('../../utils/pay.js')
app.configLoadOK = () => {
  
}
Page({
  data: {
    userAmount: {
      score: 0
    },
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.userAmount()
        this.scoreLogs()
      } else {
        AUTH.authorize().then(res => {
          this.userAmount()
        this.scoreLogs()
        })
      }
    })
  },
  async userAmount() {
    const res = await WXAPI.userAmount(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        userAmount: res.data
      })
    }
  },
  async scoreLogs() {
    const res = await WXAPI.scoreLogs({
      token: wx.getStorageSync('token'),
      page:1,
      pageSize:10000
    })
    if (res.code == 0) {
      this.setData({
        logs: res.data.result
      })
    }
  },
})