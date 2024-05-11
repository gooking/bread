const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog'
const wxpay = require('../../utils/pay.js')
import wxbarcode from 'wxbarcode'
app.configLoadOK = () => {
  
}
Page({
  data: {

  },
  onLoad: function (options) {
    // options.id = 516189
    this.setData({
      orderId: options.id
    })
    this.orderDetail()
  },
  onShow: function () {

  },
  async orderDetail() {
    const res = await WXAPI.orderDetail(wx.getStorageSync('token'), this.data.orderId)
    if (res.code == 0) {
      if (res.data.orderInfo.status == 1) {
        res.data.orderInfo.statusStr = '制作中'
      }
      if (res.data.orderInfo.status == 3) {
        res.data.orderInfo.statusStr = '交易成功'
      }
      // 绘制核销码
      if (res.data.orderInfo.hxNumber && res.data.orderInfo.status > 0 && res.data.orderInfo.status < 3) {
        wxbarcode.qrcode('qrcode', res.data.orderInfo.hxNumber, 650, 650);
      }  
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
  }
})