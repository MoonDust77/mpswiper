// pages/login/login.js
import regeneratorRuntime from '../../utils/runtime.js'
import { commonApi } from '../../api/index'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    js_code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 根据用户授权控制页面显隐
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.login({
      success: res => {
        // 缓存code，wxSns接口需要传
        this.setData({ js_code: res.code })
      },
      fail: () => {
        console.log('获取code失败...')
      },
      complete: () => {
        setTimeout(() => {
          wx.hideLoading()
        }, 1000)
      }
    })
  },

  // 用户授权获取用户信息回调
  handleGetUserInfo(e) {
    if (e.detail.userInfo) {
      // 用户已授权
      this.handleUserInfo(e.detail, this.showChosePage)
    }
  },

  // 处理得到的用户信息
  async handleUserInfo(params) {
    const that = this
    // 缓存头像昵称性别，每次登陆都获取新的昵称头像
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 数据请求
    let paramsReq = {
      code: this.data.js_code,
      encryptedData: params.encryptedData,
      iv: params.iv
    }
    try {
      let res = await commonApi.login(paramsReq)
      wx.hideLoading()
      let {
        success,
        message = '系统繁忙，请稍后重试',
        data
      } = res
      if (success) {
        // 登录成功
        wx.setStorageSync('token', data)
        app.globalData.token = data
        wx.navigateBack()
      } else {
        console.error(message)
        wx.showToast({
          title: message,
          icon: 'none'
        })
      }
    } catch (e) {
      console.error(e)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onGotUserInfo() {
    // 获取用户信息
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
