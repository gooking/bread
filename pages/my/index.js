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
    canHX: false // 当前用户是否允许核销
  },
  onLoad: function (options) {

  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.userAmount()
        this.userDetail()
      } else {
        AUTH.authorize().then(res => {
          this.userAmount()
          this.userDetail()
        })
      }
    })
    const order_hx_uids = wx.getStorageSync('order_hx_uids')
    this.setData({
      order_hx_uids
    })
  },
  async userAmount() {
    // https://www.yuque.com/apifm/nu0f75/wrqkcb
    const res = await WXAPI.userAmount(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        userAmount: res.data
      })
    }
  },
  async userDetail() {
    // https://www.yuque.com/apifm/nu0f75/zgf8pu
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        userInfo: res.data.base,
        canHX: (this.data.order_hx_uids && this.data.order_hx_uids.indexOf(res.data.base.id) != -1)
      })
    }
  },
  tabbarChange(e) {
    app.tabbarChange(e)
  },
  scanOrderCode(){
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        wx.navigateTo({
          url: '/pages/order-view/scan-result?hxNumber=' + res.result,
        })
      },
      fail(err) {
        console.error(err)
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      }
    })
  },
  updateUserInfo(e) {
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用于完善会员资料',
      success: res => {
        console.log(res);
        this._updateUserInfo(res.userInfo)
      },
      fail: err => {
        console.log(err);
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      }
    })
  },
  async _updateUserInfo(userInfo) {
    const postData = {
      token: wx.getStorageSync('token'),
      nick: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      city: userInfo.city,
      province: userInfo.province,
      gender: userInfo.gender,
    }
    // https://www.yuque.com/apifm/nu0f75/ykr2zr
    const res = await WXAPI.modifyUserInfo(postData)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '登陆成功',
    })
    this.userDetail()
  },
})