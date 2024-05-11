const WXAPI = require('apifm-wxapi')
const AUTH = require('utils/auth')
App({
  onLaunch: function () {
    WXAPI.init('yuanqibread')
    // 加载字体
    wx.loadFontFace({
      global: true,
      family: 'LxgwWenKai',
      source: 'url("https://ns.s2m.cc/xwwk.ttf")'
    })
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    WXAPI.queryConfigBatch('mallName,order_remark_msg,order_hx_uids').then(res => {
      if (res.code == 0) {
        res.data.forEach(config => {
          wx.setStorageSync(config.key, config.value);
        })
        if (this.configLoadOK) {
          this.configLoadOK()
        }
      }
    })
  },
  onShow(e){
    // 保存邀请人
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync('referrer', e.query.inviter_id)
      if (e.shareTicket) {
        wx.getShareInfo({
          shareTicket: e.shareTicket,
          success: res => {
            console.log(res)
            console.log({
              referrer: e.query.inviter_id,
              encryptedData: res.encryptedData,
              iv: res.iv
            })
            wx.login({
              success(loginRes) {
                if (loginRes.code) {
                  WXAPI.shareGroupGetScore(
                    loginRes.code,
                    e.query.inviter_id,
                    res.encryptedData,
                    res.iv
                  ).then(_res => {
                    console.log(_res)
                  }).catch(err => {
                    console.error(err)
                  })
                } else {
                  console.error('登录失败！' + loginRes.errMsg)
                }
              }
            })
          }
        })
      }
    }
    // 自动登录
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.login()
      }
    })
  },
  tabbarChange(e, curIndex) {
    if (e.detail == curIndex) {
      return
    }
    const pages = [
      '/pages/index/index',
      '/pages/orders/index',
      '/pages/current-order/index',
      '/pages/my/index',
    ]
    wx.reLaunch({
      url: pages[e.detail]
    })
  },
})