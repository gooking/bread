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
    // options.hxNumber = '2005200818567533'
    this.setData({
      hxNumber: options.hxNumber
    });
    this.orderDetail()
  },
  onShow: function () {

  },
  async orderDetail() {
    const res = await WXAPI.orderDetail(wx.getStorageSync('token'), '', this.data.hxNumber)
    if (res.code == 0) {
      this.setData({
        orderDetail: res.data
      })
      // this.shopSubdetail(res.data.orderInfo.shopIdZt)
    }
  },
  async shopSubdetail(shopId) {
    const res = await WXAPI.shopSubdetail(shopId)
    if (res.code == 0) {
      this.setData({
        shopInfo: res.data.info
      })
    }
  },
  getDistance(lat1, lng1, lat2, lng2) {
    var dis = 0;
    var radLat1 = toRadians(lat1);
    var radLat2 = toRadians(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRadians(lng1) - toRadians(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;
  
    function toRadians(d) {
      return d * Math.PI / 180;
    }
  },
  async doneHx(){
    wx.showLoading({
      title: '处理中...',
    })
    const res = await WXAPI.orderHX(this.data.hxNumber)
    wx.hideLoading()
    if (res.code != 0) {
      wx.showModal({
        title: '错误',
        content: res.msg,
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '核销完成',
        content: '当前订单核销成功',
        showCancel: false
      })
      this.orderDetail()
    }
  },
})