// components/yu-swiper/yu-swiper.js
// 自动播放定时器
let _timer = null
let nodes = null
const showPage = 3
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    autoplay: {
      type: Boolean,
      value: false
    },
    interval: {
      type: Number,
      value: 5000
    },
    indicatorDots: {
      type: Boolean,
      value: true
    }
  },
  relations: {
    '../yu-swiper-slide/yu-swiper-slide': {
      type: 'child', // 关联的目标节点应为子节点
      linked: function (target) {
        // 每次有yu-swiper-slide/yu-swiper-slide被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
      },
      linkChanged: function (target) {
        // 每次有yu-swiper-slide/yu-swiper-slide被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function (target) {
        // 每次有yu-swiper-slide/yu-swiper-slide被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 0,
    dotslength: 0,
    isTouching: false,
    touchStartX: 0,
    touchEndX: 0
  },

  ready: function () {
    this._initSlides()
  },

  detached() {
    if (_timer) clearInterval(_timer)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTouchStart(e) {
      this.setData({
        isTouching: true,
        touchStartX: e.touches[0].clientX,
      })
    },
    handleTouchEnd(e) {
      this.setData({
        isTouching: true,
        touchEndX: e.changedTouches[0].clientX,
      })
      let distance = this.data.touchEndX - this.data.touchStartX
      if (Math.abs(distance) > 90) {
        let direction = distance > 0 ? 'right' : 'left'
        this._next(direction)
      }
    },
    _initSlides () {
      // 使用getRelationNodes可以获得nodes数组，包含所有已关联的custom-li，且是有序的
      nodes = this.getRelationNodes('../yu-swiper-slide/yu-swiper-slide')
      if (nodes.length <= 1) {
        nodes[0].setData({
          translateY: '0rpx',
          scale: 1,
          zIndex: nodes.length,
          opacity: 1
        })
        return
      }
      this.setData({
        dotslength: nodes.length
      })
      for (let i = 0; i < nodes.length; i++) {
        let translateY = 0
        let scale = 1
        let opacity = 0
        if (i < showPage) {
          translateY = i * 25
          scale = 1 - i * 0.02
          opacity = 1
        } else {
          translateY = (showPage - 1) * 25
          scale = 1 - (showPage - 1) * 0.02
        }
        nodes[i].setData({
          translateY: translateY + 'rpx',
          scale,
          zIndex: nodes.length - i,
          opacity
        })
      }
      // setTimeout(() => {
      //   this._next()
      // }, 3000)
      if (this.data.autoplay) {
        this._initAutoPlay()
      }
    },
    // 初始化自动轮播
    _initAutoPlay () {
      if (_timer) clearInterval(_timer)
      _timer = setInterval(() => {
        this._next()
      }, this.data.interval)
    },
    _next(distance = 'left') {
      // 下一页
      let current = this.data.current
      let translateX = '-100%'
      if (distance === 'right') {
        translateX = '100%'
      }
      nodes[current].setData({
        translateX,
        opacity: 0
      })
      // 1.5s动画结束后，放到最后一张
      setTimeout(() => {
        this._setCurrentSlidePosition(current)
      }, 1500)

      if (this.data.current + 1 === nodes.length) {
        this.setData({
          current: 0
        })
      } else {
        this.setData({
          current: current + 1
        })
      }
      this._setNextSlidePosition(this.data.current)
    },
    // 设置当前项移动后的位置，总数大于三项时，叠放在第三张后，并且隐藏，少于三张，则根据具体张数计算
    _setCurrentSlidePosition(current) {
      let translateY = (showPage - 1) * 25
      let scale = 1 - (showPage - 1) * 0.02
      let opacity = 0
      nodes[current].setData({
        translateX: '0rpx',
        translateY: translateY + 'rpx',
        scale,
        zIndex: 1,
        opacity
      })
    },
    _setNextSlidePosition(start) {
      let nextIndexArr = []
      let size = showPage
      if (nodes.length < showPage) {
        size = nodes.length
      }

      for (let i = 0; i < size; i++) {
        if (start < nodes.length) {
          nextIndexArr.push(start++)
        } else {
          start = 1
          nextIndexArr.push(0)
        }
      }
      for (let index = 0; index < nextIndexArr.length; index++) {
        index = parseInt(index)
        let translateY = index * 25
        let scale = 1 - index * 0.02
        if (nodes.length <= showPage && index === nextIndexArr.length - 1) {
          setTimeout(() => {
            nodes[nextIndexArr[index]].setData({
              translateX: '0rpx',
              translateY: translateY + 'rpx',
              scale,
              opacity: 1
            })
          }, 1500)
        } else {
          nodes[nextIndexArr[index]].setData({
            translateX: '0rpx',
            translateY: translateY + 'rpx',
            scale,
            opacity: 1
          })
        }
      }
      setTimeout(() => {
        this._setVisibleSlideIndex(nextIndexArr)
      }, 1500)
    },
    _setVisibleSlideIndex(nextIndexArr) {
      for (let index in nextIndexArr) {
        nodes[nextIndexArr[index]].setData({
          zIndex: nodes.length - index
        })
      }
    }
  },
})
