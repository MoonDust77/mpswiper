//index.js
import regeneratorRuntime from '../../utils/runtime.js'
import { commonApi, productionApi } from '../../api/index'
//获取应用实例
const app = getApp()

Page({
  data: {
    ready: false,
    bannerList: [],
    productionList: [],
    showAdd2Cart: false,
    add2CartId: ''
  },
  onLoad: function () {
    this.fetchBannerList()
    this.fetchProductionList()
  },
  async fetchBannerList() {
    // 获取Banner数据
    try {
      let res = await commonApi.getBannerList()
      let {
        success,
        message = '系统繁忙，请稍后重试',
        data
      } = res
      if (success) {
        // 查询成功
        this.setData({
          bannerList: data
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
  },
  async fetchProductionList() {
    // 获取商品数据
    try {
      wx.showLoading({
        title: '加载中'
      })
      let res = await productionApi.getList()
      wx.hideLoading()
      let {
        success,
        message = '系统繁忙，请稍后重试',
        data
      } = res
      if (success) {
        // 查询成功
        this.setData({
          productionList: data
        })
      } else {
        console.error(message)
        wx.showToast({
          title: message,
          icon: 'none'
        })
      }
    } catch(e) {
      // wx.hideLoading()
      console.error(e)
    }
  },
  callUS() {
    wx.makePhoneCall({
      phoneNumber: "18388292884",
    })
  },
  add2Cart(event) {
    this.setData({
      add2CartId: event.currentTarget.dataset.id || '',
      showAdd2Cart: !this.data.showAdd2Cart
    })
  }
})
