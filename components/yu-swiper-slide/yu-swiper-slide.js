// components/yu-swiper-slide/yu-swiper-slide.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    translateX: '0rpx',
    translateY: '0rpx',
    scale: 1,
    zIndex: 1,
    opacity: 0
  },

  relations: {
    '../yu-swiper/yu-swiper': {
      type: 'parent', // 关联的目标节点应为父节点
      linked: function (target) {
        // 每次被插入到custom-ul时执行，target是yu-swiper节点实例对象，触发在attached生命周期之后
      },
      linkChanged: function (target) {
        // 每次被移动后执行，target是yu-swiper节点实例对象，触发在moved生命周期之后
      },
      unlinked: function (target) {
        // 每次被移除时执行，target是yu-swiper节点实例对象，触发在detached生命周期之后
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
