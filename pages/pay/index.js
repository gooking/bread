const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const wxpay = require('../../utils/pay.js')
const app = getApp()
app.configLoadOK = () => {
  
}
Page({
  data: {
    purchaseNotes: undefined,
    mobile: '-',
    fetchTime: '请选择',
    remark: '未填写'
  },
  onLoad: function (options) {
    AUTH.login() // 这句不能省略
    this.setData({
      shopInfo: wx.getStorageSync('shopInfo')
    })
    this.shippingCarInfo()
  },
  onShow: function () {
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
    this.userDetail()
    const fetchTime = wx.getStorageSync('fetchTime')
    if (fetchTime) {
      this.setData({
        fetchTime
      })
    }
    const remark = wx.getStorageSync('remark')
    if (remark) {
      this.setData({
        remark
      })
    }
  },
  async shippingCarInfo(){
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateBack()
      return
    }
    const res = await WXAPI.shippingCarInfo(token)
    if (res.code == 0) {
      let purchaseNotes = ''
      for (let index = 0; index < res.data.items.length; index++) {
        const element = res.data.items[index];
        const goodsId = element.goodsId
        const resGoods = await WXAPI.goodsDetail(goodsId)
        if (resGoods.code == 0 && resGoods.data.basicInfo.purchaseNotes) {
          purchaseNotes += resGoods.data.basicInfo.purchaseNotes
        }
      }
      this.setData({
        purchaseNotes,
        shippingCarInfo: res.data
      })
    }
  },
  async userDetail() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0 && res.data.base.mobile) {
      this.setData({
        mobile: res.data.base.mobile
      })
    }
  },
  async getPhoneNumber(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: e.detail.errMsg,
        showCancel: false
      })
      return;
    }
    WXAPI.bindMobileWxapp(wx.getStorageSync('token'), this.data.code, e.detail.encryptedData, e.detail.iv).then(res => {
      AUTH.wxaCode().then(code => {
        this.data.code = code
      })
      if (res.code === 10002) {
        this.setData({
          wxlogin: false
        })
        return
      }
      if (res.code == 0) {
        wx.showToast({
          title: '绑定成功',
          icon: 'success'
        })
        this.userDetail();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'success'
        })
      }
    })
  },
  async createorder() {
    const token = wx.getStorageSync('token')
    // 创建订单
    const goodsJson = []
    this.data.shippingCarInfo.items.forEach(ele => {
      const _ele = {
        goodsId: ele.goodsId,
        number: ele.number,
        propertyChildIds: '',
      }
      if (ele.sku) {
        _ele.propertyChildIds = ele.sku[0].optionId + ':' + ele.sku[0].optionValueId
      }
      goodsJson.push(_ele)
    })
    const extJsonStr = {}
    extJsonStr['自取门店'] = this.data.shopInfo.name
    extJsonStr['联络电话'] = this.data.mobile
    extJsonStr['自取时间'] = this.data.fetchTime
    const postData = {
      token,
      goodsJsonStr: JSON.stringify(goodsJson),
      isCanHx: true,
      remark: this.data.remark,
      extJsonStr: JSON.stringify(extJsonStr),
      shopIdZt: this.data.shopInfo.id,
      shopNameZt: this.data.shopInfo.name
    }
    const res = await WXAPI.orderCreate(postData)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return;
    }
    await WXAPI.shippingCarInfoRemoveAll(token)
    wx.showToast({
      title: '下单成功！',
      icon: 'success'
    })
    // 直接弹出微信支付
    const res1 = await WXAPI.userAmount(wx.getStorageSync('token'))
    if (res1.code != 0) {
      wx.showToast({
        title: '无法获取用户资金信息',
        icon: 'none'
      })
      wx.redirectTo({
        url: "/pages/current-order/index"
      });
      this.data.pageIsEnd = false
      return
    }
    const money = res.data.amountReal * 1 - res1.data.balance*1
    if (money <= 0) {
      // 直接用余额支付
      wx.showModal({
        title: '请确认支付',
        content: `您当前可用余额¥${res1.data.balance}，使用余额支付¥${res.data.amountReal}？`,
        confirmText: "确认支付",
        cancelText: "暂不付款",
        success: res2 => {
          if (res2.confirm) {
            // 使用余额支付
            WXAPI.orderPay(wx.getStorageSync('token'), res.data.id).then(res3 => {
              if (res3.code != 0) {
                wx.showToast({
                  title: res3.msg,
                  icon: 'none'
                })
                return
              }
              wx.redirectTo({
                url: "/pages/current-order/index"
              })
            })
          } else {
            wx.redirectTo({
              url: "/pages/current-order/index"
            })
          }
        }
      })      
    } else {
      wxpay.wxpay('order', money, res.data.id, "/pages/current-order/index");
    }
  },
})