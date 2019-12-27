// components/add2Cart/add2Cart.js
import regeneratorRuntime from '../../utils/runtime.js'
import { productionApi, cartApi } from '../../api/index'
Component({
  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  /**
   * 组件的属性列表
   */
  properties: {
    productionId: {
      type: String,
      value: '1'
    },
    show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedId: '',
    name: '',
    images: [],
    price: '',
    color: {},
    size: {},
    animationMask: null,
    animationPannel: null
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        selectedId: this.data.productionId
      })
      this.fetchData()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      // console.log('detached...')
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 空白函数 禁止滚动
    preventTouchMove: function (e) {
    },
    hideAdd2Cart() {
      this.triggerEvent('hideAdd2Cart')
    },
    async fetchData() {
      wx.showLoading({
        title: '加载中'
      })
      try {
        let res = await productionApi.getDetail(this.data.selectedId)
        if (res.success) {
          let {
            name = '',
            images = [],
            price = '',
            color = {},
            size = {}
          } = res.data
          // 查询成功
          this.setData({
            name,
            images,
            price,
            color,
            size
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
      this.showPannel()
    },
    // 显示
    showPannel() {
      // mask动画
      let animationMask = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
        delay: 0
      })
      animationMask.opacity(1).step()
      // 抽屉动画
      let animationPannel = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
        delay: 0
      })
      animationPannel.translateY(0).step()
      this.setData({
        animationData: animationMask.export(),
        animationPannel: animationPannel.export()
      })
    },
    // 改变sku
    changeSku(event) {
      this.setData({
        selectedId: event.currentTarget.dataset.id || ''
      })
      this.fetchData()
    },
    // 加入购物车
    async add2Cart() {
      // wx.showLoading({
      //   title: '加载中'
      // })
      wx.showToast({
        title: '花花在购物车等你哟~',
        icon: 'none'
      })
      try {
        let res = await cartApi.add({
          productId: this.data.selectedId,
          quantity: 1
        })
        wx.hideLoading()
        if (res.success) {
          wx.showToast({
            title: '花花在购物车等你哟~',
            icon: 'none'
          })
        } else {
          console.error(res.message)
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      } catch (e) {
        wx.hideLoading()
        console.error(e)
      }
      this.hideAdd2Cart()
    }
  }
})
