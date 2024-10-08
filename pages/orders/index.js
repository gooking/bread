const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog'
app.configLoadOK = () => {
  
}

Page({
  data: {
    cid: '',
    showCartPop: false
  },
  onLoad: function (options) {
    this.setData({
      shopInfo: wx.getStorageSync('shopInfo')
    })
    this.goodsCategory()
    this.getGoodsList()
  },
  onShow: function () {
    this.shippingCarInfo()
  },
  async goodsCategory() {
    // https://www.yuque.com/apifm/nu0f75/racmle
    const res = await WXAPI.goodsCategoryV2()
    if (res.code == 0) {
      this.setData({
        goodsCategory: res.data
      })
    }
  },
  onCategoryClick(e) {
    var id = e.target.dataset.id;
    if (!id || id == '0') {
      this.setData({
        cid: '',
      })
      return
    }
    this.setData({
      cid: id,
    })    
    this.getGoodsList()
  },
  async getGoodsList() {
    wx.showLoading({
      title: '加载中',
    })
    const shopInfo = wx.getStorageSync('shopInfo')
    // https://www.yuque.com/apifm/nu0f75/wg5t98
    const res = await WXAPI.goodsv2({
      categoryId: this.data.cid,
      shopId: shopInfo.id,
      page: 1,
      pageSize: 100000
    })
    wx.hideLoading()
    if (res.code == 700) {
      this.setData({
        goodsList: null
      });
      return
    }
    this.setData({
      goodsList: res.data.result
    });
  },
  async shippingCarInfo(){
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    // https://www.yuque.com/apifm/nu0f75/awql14
    const res = await WXAPI.shippingCarInfo(token)
    if (res.code == 0) {
      this.setData({
        shippingCarInfo: res.data
      })
    } else {
      this.setData({
        shippingCarInfo: null
      })
    }
  },
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/goods-details/index?id=' + e.currentTarget.dataset.id,
    })
  },
  async addCart(e) {
    // 判断登陆状态
    const isLogined = await AUTH.checkHasLogined()
    if (!isLogined) {
      AUTH.authorize().then(res => {
        this.addCart(e)
      })
      return
    }
    const index = e.currentTarget.dataset.index
    const curGood = this.data.goodsList[index]
    if (!curGood) {
      return
    }
    if (curGood.stores <= 0) {
      wx.showToast({
        title: '已售罄~',
        icon: 'none'
      })
      return
    }
    // https://www.yuque.com/apifm/nu0f75/et6m6m
    const res = await WXAPI.shippingCarInfoAddItemV2({
      token: wx.getStorageSync('token'),
      goodsId: curGood.id,
      number: 1,
      sku: []
    })
    if (res.code == 30002) {
      // 需要 sku
      wx.navigateTo({
        url: '/pages/goods-details/index?id=' + curGood.id,
      })
      return
    }
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    this.shippingCarInfo()
    wx.showToast({
      title: '成功加入购物车',
      icon: 'success'
    })
  },
  showCartList() {
    this.setData({
      showCartPop: true
    })
  },
  hideCartList() {
    this.setData({
      showCartPop: false
    })
  },
  async changeNumber(e) {
    const key = e.target.dataset.key
    const token = wx.getStorageSync('token')
    if (e.detail == 0) {
      // 删除
      wx.showLoading({
        title: '删除中...',
      })
      // https://www.yuque.com/apifm/nu0f75/pndgyc
      const res = await WXAPI.shippingCarInfoRemoveItem(token, key)
      wx.hideLoading()
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      } else {
        this.shippingCarInfo()
      }
    } else {
      // 修改数量
      wx.showLoading({
        title: '',
      })
      // https://www.yuque.com/apifm/nu0f75/kbi5b0
      await WXAPI.shippingCarInfoModifyNumber(token, key, e.detail)
      this.shippingCarInfo()
      wx.hideLoading()
    }
  },
  tabbarChange(e) {
    app.tabbarChange(e)
  },
})