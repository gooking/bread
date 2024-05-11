const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog'
const wxpay = require('../../utils/pay.js')
app.configLoadOK = () => {
  
}
Page({
  data: {
    tabIndex: 0
  },
  onLoad: function (options) {

  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.orderList()
      } else {
        AUTH.authorize().then(res => {
          this.orderList()
        })
      }
    })
  },
  async orderList() {
    let statusBatch = ''
    if (this.data.tabIndex == 0) {
      statusBatch = '0, 1, 2'
    } else {
      statusBatch = '-1, 3, 4'
    }
    wx.showLoading({
      title: '...',
    })
    const res = await WXAPI.orderList({
      token: wx.getStorageSync('token'),
      statusBatch
    })
    wx.hideLoading()
    if (res.code == 0) {
      res.data.orderList.forEach(ele => {
        if (ele.status == 1) {
          ele.statusStr = '制作中'
        }
        if (ele.status == 3) {
          ele.statusStr = '交易成功'
        }
      })
      this.setData({
        orderList: res.data.orderList,
        logisticsMap: res.data.logisticsMap,
        goodsMap: res.data.goodsMap
      })
    } else {
      this.setData({
        orderList: null
      })
    }
  },
  changeTab(e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex
    })
    this.orderList()
  },
  tabbarChange(e) {
    app.tabbarChange(e)
  },
  cancelOrderTap: function(e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          WXAPI.orderClose(wx.getStorageSync('token'), orderId).then(function(res) {
            if (res.code == 0) {
              that.orderList();
            }
          })
        }
      }
    })
  },
  deleteorder: function(e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要删除该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          WXAPI.orderDelete(wx.getStorageSync('token'), orderId).then(function(res) {
            if (res.code == 0) {
              that.orderList();
            }
          })
        }
      }
    })
  },
  async callShop(e) {
    const id = e.currentTarget.dataset.id
    const res = await WXAPI.shopSubdetail(id)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: res.data.info.linkPhone,
    })
  },
  toPayTap: function(e) {
    // 防止连续点击--开始
    if (this.data.payButtonClicked) {
      wx.showToast({
        title: '休息一下~',
        icon: 'none'
      })
      return
    }
    this.data.payButtonClicked = true
    setTimeout(() => {
      this.data.payButtonClicked = false
    }, 3000)  // 可自行修改时间间隔（目前是3秒内只能点击一次支付按钮）
    // 防止连续点击--结束
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    let money = e.currentTarget.dataset.money;
    const needScore = e.currentTarget.dataset.score;
    WXAPI.userAmount(wx.getStorageSync('token')).then(function(res) {
      if (res.code == 0) {
        // 增加提示框
        if (res.data.score < needScore) {
          wx.showToast({
            title: '您的积分不足，无法支付',
            icon: 'none'
          })
          return;
        }
        let _msg = '订单金额: ' + money +' 元'
        if (res.data.balance > 0) {
          _msg += ',可用余额为 ' + res.data.balance +' 元'
          if (money - res.data.balance > 0) {
            _msg += ',仍需微信支付 ' + (money - res.data.balance) + ' 元'
          }          
        }
        if (needScore > 0) {
          _msg += ',并扣除 ' + needScore + ' 积分'
        }
        money = money - res.data.balance
        wx.showModal({
          title: '请确认支付',
          content: _msg,
          confirmText: "确认支付",
          cancelText: "取消支付",
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              that._toPayTap(orderId, money)
            } else {
              console.log('用户点击取消支付')
            }
          }
        });
      } else {
        wx.showModal({
          title: '错误',
          content: '无法获取用户资金信息',
          showCancel: false
        })
      }
    })
  },
  _toPayTap: function (orderId, money){
    const _this = this
    if (money <= 0) {
      // 直接使用余额支付
      WXAPI.orderPay(wx.getStorageSync('token'), orderId).then(function (res) {
        _this.onShow();
      })
    } else {
      wxpay.wxpay('order', money, orderId, "/pages/current-order/index");
    }
  },
})