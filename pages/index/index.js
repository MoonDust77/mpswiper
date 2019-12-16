//index.js
import regeneratorRuntime from '../../utils/runtime.js'
import { commonApi, productionApi } from '../../api/index'
//获取应用实例
const app = getApp()

Page({
  data: {
    bannerList: [],
    productionList: []
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
  }
})
