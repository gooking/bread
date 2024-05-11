const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const app = getApp()
app.configLoadOK = () => {
  
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    columns: [],
  },
  onChange(event) {
    // const { picker, value, index } = event.detail;
    // picker.setColumnValues(1, citys[value[0]]);
  },
  onLoad: function (options) {
    const shopInfo = wx.getStorageSync('shopInfo')
    const days = ['今天']
    let hours = []
    let minutes = []
    if (shopInfo && shopInfo.openingHours) {
      // 07:30-22:30
      const a = shopInfo.openingHours.split('-')[0]
      const b = shopInfo.openingHours.split('-')[1]
      for (let index = a.split(':')[0]*1; index <= b.split(':')[0]; index++) {        
        hours.push(index + '时')
      }
    } else {
      for (let index = 7; index <= 22; index++) {
        hours.push(index + '时')
      }
    }
    for (let index = 0; index < 60; index=index+10) {
      minutes.push(index + '分')        
    }
    const columns = []
    columns.push({
      values: days
    })
    const date = new Date()
    const dangqian=date.toLocaleTimeString('chinese',{hour12:false})
    let hIndex = hours.findIndex(ele => {
      return ele == dangqian.split(":")[0]*1 + '时'
    })
    let mIndex = minutes.findIndex(ele => {
      return ele.substring(0, ele.length-1)*1 > dangqian.split(":")[1]*1
    })
    if (mIndex == -1) {
      mIndex = 0
      hIndex++
    }
    hours.splice(0, hIndex)
    hIndex=0
    columns.push({
      values: hours,
      defaultIndex: hIndex
    })    
    columns.push({
      values: minutes,
      defaultIndex: mIndex
    })
    this.setData({
      columns
    })
  },
  onShow: function () {

  },
  back() {
    wx.navigateBack()
  },
  ok() {
    const gooking = this.selectComponent("#gooking")
    console.log(gooking.getValues());
    wx.setStorageSync('fetchTime', gooking.getValues().join(''))
    wx.navigateBack()
  },
})