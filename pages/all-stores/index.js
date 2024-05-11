const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
let mapCtx
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: ''
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName'),
    })
    wx.getLocation({
      type: 'wgs84', //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: (res) => {
        this.data.latitude = res.latitude
        this.data.longitude = res.longitude
        this.fetchShops(res.latitude, res.longitude, '')
        mapCtx = wx.createMapContext('myMap')
        mapCtx.moveToLocation({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
      fail(e){
        console.error(e)
        AUTH.checkAndAuthorize('scope.userLocation')
      }
    }) 
  },
  onShow: function () {

  },
  async fetchShops(latitude, longitude, kw){
    const res = await WXAPI.fetchShops({
      curlatitude: latitude,
      curlongitude: longitude,
      nameLike: kw
    })
    if (res.code == 0) {
      res.data.forEach(ele => {
        ele.distance = ele.distance.toFixed(3) // 距离保留3位小数
        ele.isOpening = this.checkIsOpened(ele.openingHours)
      })
      this.setData({
        shops: res.data
      })
    } else {
      this.setData({
        shops: null
      })
    }
  },
  searchChange(event){
    this.setData({
      searchValue: event.detail
    })
  },
  search(event){
    console.log('search')
    this.setData({
      searchValue: event.detail
    })
    this.fetchShops(this.data.latitude, this.data.longitude, event.detail)
  },
  goShop(e){
    const idx = e.currentTarget.dataset.idx
    wx.setStorageSync('shopInfo', this.data.shops[idx])
    wx.navigateTo({
      url: '/pages/orders/index',
    })
  },
  clearsearch(){
    this.setData({
      searchValue: ''
    })
    this.fetchShops(this.data.latitude, this.data.longitude, '')
  },
  mapchange(e) {
    if (e.type == 'end') {
      mapCtx.getCenterLocation({
        success: (res) => {
          this.fetchShops(res.latitude, res.longitude, this.data.searchValue)
        }
      })      
    }
  },
  checkIsOpened(openingHours) {
    const date = new Date();
    const startTime = openingHours.split('-')[0]
    const endTime = openingHours.split('-')[1]
    const dangqian=date.toLocaleTimeString('chinese',{hour12:false})
    
    const dq=dangqian.split(":")
    const a = startTime.split(":")
    const b = endTime.split(":")

    const dqdq=date.setHours(dq[0],dq[1])
    const aa=date.setHours(a[0],a[1])
    const bb=date.setHours(b[0],b[1])
    
    return aa<dqdq && dqdq<bb
  },
})