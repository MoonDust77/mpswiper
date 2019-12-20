// pages/cart/cart.js
import regeneratorRuntime from '../../utils/runtime.js'
import { cartApi } from '../../api/index'


const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    productsList: [],
    operation: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.fetchData()
  },

  async fetchData() {
    wx.showLoading({
      icon: 'none'
    })
    try {
      let res = await cartApi.getCartList()
      let {
        success,
        message = '系统繁忙，请稍后重试',
        data
      } = res
      if (success) {
        // 查询成功
        this.setData({
          productsList: data.items,
          operation: data.operation
        })
      } else {
        console.error(message)
        wx.showToast({
          title: message,
          icon: 'none'
        })
      }
    } catch(e) {
      console.error(e)
    }
    wx.hideLoading()
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
