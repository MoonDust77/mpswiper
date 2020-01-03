// pages/cart/cart.js
import regeneratorRuntime from '../../utils/runtime.js'
import { cartApi } from '../../api/index'


const app = getApp()
let _timer = null
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
    if (app.checkSignInsStatus()) {
      // 用户已登录
      this.fetchData()
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },

  async fetchData() {
    wx.showLoading({
      title: '加载中'
    })
    try {
      let res = await cartApi.getCartList()
      wx.hideLoading()
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
      wx.hideLoading()
      console.error(e)
    }
  },

  // 改变购物车商品数量
  changeNum(event) {
    if (_timer) clearTimeout(_timer)
    const id = event.currentTarget.dataset.id
    const type = event.currentTarget.dataset.type
    let productsList = this.data.productsList
    let targetIndex = null

    for (let i = 0; i < productsList.length; i++) {
      if (productsList[i].id === id) {
        targetIndex = i
        break        
      }
    }
    if (targetIndex > -1) {
      let product =  this.handleChangeNum(targetIndex, type)
      if (product) {
        // 除了删除外的情况，修改显示的数据
        productsList[targetIndex] = product
        this.setData({
          productsList
        })
        _timer = setTimeout(() => {
          this.requestChangeCartNum(product)
        }, 300)
      }
    }
  },
  handleChangeNum(targetIndex, type) {
    let product = this.data.productsList[targetIndex]
    if (type === 'minus') {
      // 减少
      if (product.quantity === 1) {
        // 只剩一件，弹窗询问用户是否删除
        const self = this
        wx.showModal({
          title: '提示',
          content: '您确定要删除此商品吗？',
          success(res) {
            if (res.confirm) {
              // 请求接口，删除
              product.quantity = 0
              self.requestChangeCartNum(product)
            }
          }
        })
      } else {
        // 普通的减少1
        product.quantity = product.quantity - 1
        return product
      }
    } else {
      // 普通的增加
      product.quantity = product.quantity + 1
      return product
    } 
  },
  // 请求后端接口，改变商品数量
  async requestChangeCartNum (product) {
    wx.showLoading({
      title: '加载中'
    })
    try {
      let { id, productId, quantity = 0 } = product
      let res = await cartApi.changeNum({ id, productId, quantity })
      wx.hideLoading()
      let {
        success,
        message = '系统繁忙，请稍后重试',
        data
      } = res
      if (success) {
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
      wx.hideLoading()
      console.error(e)
    }
  },
  // 跳转首页
  goHomePage() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
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
