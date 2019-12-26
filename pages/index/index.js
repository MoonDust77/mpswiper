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
      if (res.success) {
        // 查询成功
        this.setData({
          bannerList: res.data
        })
      } else {
        console.error(res.message)
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    } catch(e) {
      console.error(e)
    }
  },
  async fetchProductionList() {
    // 获取商品数据
    wx.showLoading({
      title: '加载中'
    })
    try {
      let res = await productionApi.getList()
      if (res.success) {
        // 查询成功
        this.setData({
          productionList: res.data
        })
      } else {
        console.error(res.message)
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    } catch(e) {
      console.error(e)
    }
    wx.hideLoading()
  },
  callUS() {
    wx.makePhoneCall({
      phoneNumber: "18388292884",
    })
  },
  add2Cart(event) {
    this.setData({
      add2CartId: event.currentTarget.dataset.id,
      showAdd2Cart: !this.data.showAdd2Cart
    })
  }
})
