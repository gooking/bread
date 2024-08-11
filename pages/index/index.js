const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const app = getApp()


Page({
  data: {
    wxlogin: false,
    userAmount: {
      score: 0
    },
    curbanner: 0
  },  
  onLoad: function () {
    this.configLoadOK()
    this.banners()
    wx.getLocation({
      type: 'gcj02', //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: (res) => {
        this.data.latitude = res.latitude
        this.data.longitude = res.longitude
        this.fetchShops(res.latitude, res.longitude)
      },
      fail(e){
        console.error(e)
        AUTH.checkAndAuthorize('scope.userLocation')
      }
    })
    getApp().configLoadOK = () => {
      this.configLoadOK()
    }
  },
  configLoadOK() {
    const mallName = wx.getStorageSync('mallName')
    if (mallName) {
      wx.setNavigationBarTitle({
        title: wx.getStorageSync('mallName'),
      })
    }
  },
  onShow() {
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        this.userAmount()        
      }
    })
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh({
      success: () => {
        wx.navigateTo({
          url: '/pages/card/index',
        })
      }
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
  async banners() {
    // https://www.yuque.com/apifm/nu0f75/ms21ki
    const res = await WXAPI.banners()
    if (res.code == 0) {
      this.setData({
        banners: res.data
      })
    }
  },
  bannerChange(e) {
    this.setData({
      curbanner: e.detail.current
    })
  },
  async fetchShops(latitude, longitude){
    // https://www.yuque.com/apifm/nu0f75/vvgeq9
    const res = await WXAPI.fetchShops({
      curlatitude: latitude,
      curlongitude: longitude,
      pageSize: 1
    })
    if (res.code == 0) {
      res.data.forEach(ele => {
        ele.distance = ele.distance.toFixed(3) // 距离保留3位小数
      })
      wx.setStorageSync('shopInfo', res.data[0])
      this.setData({
        shop: res.data[0]
      })
    }
  },
  tabbarChange(e) {
    app.tabbarChange(e)
  },
})
