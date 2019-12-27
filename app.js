//app.js
require('./mixins/mixin.js')
import { compareVersion } from './utils/util'

App({
  onLaunch: function () {
    // 版本更新提示
    this.updateApp()
    // 存储系统信息
    this.getSystemInfo()
    // 存储全局微信认证信息
    this.setWxSnsInfo()
    // 初始化用户信息
    this.setUserToken()
  },
  /**
   * 版本更新提示
   */
  updateApp() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          // 请求完新版本信息的回调
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          });
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 存储系统信息
  getSystemInfo() {
    let systemInfo = wx.getSystemInfoSync() || {}
    wx.setStorageSync('systemInfo', systemInfo)
    this.globalData.systemInfo = systemInfo
    var isIphoneX = this.globalData.systemInfo.model.indexOf('iPhone X') != -1 ? true : false;
    this.globalData.isIphoneX = isIphoneX
    // 初始化用户基础库版本是否大于2.8.2，2.8.2以上版本才可以使用订阅消息，若线上最低基础库版本设置大于2.8.2可以删除
    let version = parseInt(this.globalData.systemInfo.version.split('.').join(''))
    if (this.globalData.systemInfo.system.toUpperCase().indexOf('IOS') !== -1) {
      // IOS
      if (version < 706) this.globalData.supportMultipleMessage = false
    } else {
      // 安卓
      if (version < 707) this.globalData.supportMultipleMessage = false
    }
    // 当IOS微信版本大于7.0.6，安卓版本大于7.0.7并且小程序库版本大于2.8.2时，才能使用订阅消息，其他的用户会提示微信版本太低，无法接收，但不影响支付流程
    compareVersion(systemInfo.SDKVersion, '2.8.2') >= 0 ? this.globalData.canUseSubscribeMessage = true : this.globalData.canUseSubscribeMessage = false
  },
  /**
   * 用户登陆状态
   */
  setUserToken() {
    this.globalData.token = wx.getStorageSync('token') || ''
  },
  /**
     * 设置全局微信认证信息
     */
  setWxSnsInfo() {
    this.globalData.wxSnsInfo = wx.getStorageSync('wxSnsInfo') || {}
  },
  /**
     * 登陆
     */
  signIn() {
    if (!this.checkSignInsStatus()) {
      wx.navigateTo({
        url: '/pages/signIn/index/index'
      })
    }
  },
  /**
    * 退出登陆
    */
  signOut() {
    this.resetGlobalUserInfo()
    wx.removeStorageSync('user')
    wx.removeStorageSync('wxSnsInfo')
  },
  /**
   * 判断用户登录状态
   */
  checkSignInsStatus() {
    return this.globalData.token
  },
  /**
   * 重置全局存储用户信息
   */
  resetGlobalUserInfo() {
    Object.assign(this.globalData, {
      wxSnsInfo: {},
      token: ''
    })
  },
  globalData: {
    token: '',
    systemInfo: {},
    wxSnsInfo: {},
    isIphoneX: false,
    canUseSubscribeMessage: true,
    supportMultipleMessage: true
  }
})
