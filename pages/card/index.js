const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
import wxbarcode from 'wxbarcode'
Page({
  data: {
    canshow: false,
    userAmount: {
      score: 0
    }
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName'),
    })
  },
  onShow() {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.userAmount()
        this.userDetail()
        this.setData({
          canshow: true
        })
      } else {
        AUTH.authorize().then(res => {
          this.userAmount()
          this.userDetail()
          this.setData({
            canshow: true
          })
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
  async userDetail() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        userInfo: res.data.base,
        cardNumber: res.data.base.cardNumber
      })
      wxbarcode.qrcode('qrcode', res.data.base.cardNumber, 330, 330)
    }
  },
  goback() {
    wx.reLaunch({
      url: '/pages/index/index'
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