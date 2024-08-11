const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog'
const wxpay = require('../../utils/pay.js')
app.configLoadOK = () => {
  
}

Date.prototype.format = function(format)
{
  var o = {
    "M+" : this.getMonth()+1, //month
    "d+" : this.getDate(),    //day
    "h+" : this.getHours(),   //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
    "S" : this.getMilliseconds() //millisecond
  }
  if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
  (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)if(new RegExp("("+ k +")").test(format))
  format = format.replace(RegExp.$1,
  RegExp.$1.length==1 ? o[k] :
  ("00"+ o[k]).substr((""+ o[k]).length));
  return format;
}

Page({
  data: {
    userAmount: {
      score: 0
    },
    sexs: ['保密', '男', '女'],
    sexIndex: 0,
    birthday: undefined,
    showbirthday: false
  },
  onLoad: function (options) {
    this.userDetail()
  },
  onShow: function () {
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
  },
  async userDetail() {
    // https://www.yuque.com/apifm/nu0f75/zgf8pu
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        id: res.data.base.id,
        nick: res.data.base.nick,
        mobile: res.data.base.mobile ? res.data.base.mobile : '点击自动获取',
        sexIndex: res.data.base.gender,
        birthday: res.data.base.birthday
      })
    }
  },
  bindSexChange(e) {
    this.setData({
      sexIndex: e.detail.value
    })
  },
  showbirthday() {
    this.setData({
      showbirthday: true
    })
  },
  hidebirthday() {
    this.setData({
      showbirthday: false
    })
  },
  birthdayChange(e) {
    const date = new Date(e.detail)
    this.setData({
      birthday: date.format('yyyy-MM-dd')
    })
    this.hidebirthday()
  },
  async modifyUserInfo() {
    wx.showLoading({
      title: '...',
    })
    // https://www.yuque.com/apifm/nu0f75/ykr2zr
    const res = await WXAPI.modifyUserInfo({
      token: wx.getStorageSync('token'),
      nick: this.data.nick,
      gender: this.data.sexIndex,
      birthday: this.data.birthday,
    })
    wx.hideLoading()
    if (res.code == 0) {
      wx.showToast({
        title: '编辑成功',
        icon: 'success'
      })
      wx.navigateBack({
        complete: (res) => {},
      })
    }
  },
  copyID() {
    wx.setClipboardData({
      data: this.data.id + '',
    })
  },
  bindMobile() {
    this.setData({
      bindMobileShow: true
    })
  },
  bindMobileOk(e) {
    console.log(e.detail); // 这里是组件里data的数据
    this.setData({
      bindMobileShow: false,
      mobile: e.detail.mobile
    })
  },
  bindMobileCancel() {
    this.setData({
      bindMobileShow: false
    })
  },
})