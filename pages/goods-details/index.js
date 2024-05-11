const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog'
app.configLoadOK = () => {
  
}
Page({
  data: {
    curbanner: 0,
    kouwei: [{
      pid: 0,
      pname: '规格',
      cid: 0,
      cname: '一般口味'
    }],
    kouweiIndex: 0,
    buyedNumber: 0,
    key: undefined // 购物车的key
  },
  onLoad: function (options) {
    // options.id = 427682
    this.setData({
      goodsId: options.id
    })
    this.goodsDetail()
  },
  onShow: function () {

  },
  async goodsDetail() {
    const res = await WXAPI.goodsDetail(this.data.goodsId)
    if (res.code == 0) {
      const kouwei = this.data.kouwei
      if (res.data.properties) {
        kouwei.splice(0)
        const option = res.data.properties[0]
        option.childsCurGoods.forEach(ele => {
          kouwei.push({
            pid: option.id,
            pname: option.name,
            cid: ele.id,
            cname: ele.name
          })
        })
      }
      this.setData({
        kouwei,
        goodsDetail: res.data
      })
      this.checkBuyedNumber(res.data.basicInfo.id)
    }
  },
  bannerChange(e) {
    this.setData({
      curbanner: e.detail.current
    })
  },
  bindKouweiChange(e) {
    this.setData({
      kouweiIndex: e.detail.value
    })
    this.checkBuyedNumber(this.data.goodsDetail.basicInfo.id)
  },
  async addCart() {
    // 判断登陆状态
    const isLogined = await AUTH.checkHasLogined()
    if (!isLogined) {
      AUTH.authorize().then(res => {
        this.addCart(e)
      })
      return
    }
    if (this.data.goodsDetail.basicInfo.stores <= 0) {
      wx.showToast({
        title: '已售罄~',
        icon: 'none'
      })
      return
    }
    const sku = []
    const kouwei = this.data.kouwei[this.data.kouweiIndex]
    if (kouwei.cid) {
      sku.push({
        optionId: kouwei.pid,
        optionValueId: kouwei.cid
      })
    }
    const res = await WXAPI.shippingCarInfoAddItem(wx.getStorageSync('token'), this.data.goodsDetail.basicInfo.id, 1, sku)    
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }    
    wx.showToast({
      title: '成功加入购物车',
      icon: 'success'
    })
    this.checkBuyedNumber(this.data.goodsDetail.basicInfo.id)
  },
  async checkBuyedNumber (goodsId) {
    const kouwei = this.data.kouwei[this.data.kouweiIndex]
    const token = wx.getStorageSync('token')
    const res = await WXAPI.shippingCarInfo(token)
    if (res.code != 0) {
      this.setData({
        buyedNumber: 0,
        key: null
      })
      return
    }
    const _goods = res.data.items.find(ele => {
      if (!ele.sku) {
        return false
      }
      if (ele.goodsId != this.data.goodsDetail.basicInfo.id) {
        return false
      }
      const sku = ele.sku[0]
      if (sku.optionId == kouwei.pid && sku.optionValueId == kouwei.cid) {
        return true
      }
      return false
    })
    if (!_goods) {
      this.setData({
        buyedNumber: 0,
        key: null
      })
      return
    }
    this.setData({
      buyedNumber: _goods.number,
      key: _goods.key
    })
  },
  async changeNumber(e) {
    const key = this.data.key
    const token = wx.getStorageSync('token')
    if (e.detail == 0) {
      // 删除
      wx.showLoading({
        title: '删除中...',
      })
      const res = await WXAPI.shippingCarInfoRemoveItem(token, key)
      wx.hideLoading()
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      } else {
        this.checkBuyedNumber(this.data.goodsDetail.basicInfo.id)
      }
    } else {
      // 修改数量
      wx.showLoading({
        title: '',
      })
      await WXAPI.shippingCarInfoModifyNumber(token, key, e.detail)
      this.checkBuyedNumber(this.data.goodsDetail.basicInfo.id)
      wx.hideLoading()
    }
  },
})