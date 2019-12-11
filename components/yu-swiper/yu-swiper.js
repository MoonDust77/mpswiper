// components/yu-swiper/yu-swiper.js
// 自动播放定时器
let _timer = null
const showPage = 3
const maskColorArr = ['none', '#C2C2C2', '#DCDCDC'] // 数量要和showPage数量相同
const translateYStep = 40
const scaleStep = 0.06

Component({
  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
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
    },
    itemHeight: {
      type: Number,
      value: 690
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
    touchEndX: 0,
    swiperHeight: 0,
    _nodes: [],
    _timer: null
  },

  ready: function () {
    this._initSlides()
  },

  detached() {
    let _timer = this.data._timer
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
      let nodes = this.getRelationNodes('../yu-swiper-slide/yu-swiper-slide')
      this.setData({
        _nodes: nodes
      })
      if (nodes.length <= 1) {
        nodes[0].setData({
          translateY: '0rpx',
          scale: 1,
          zIndex: nodes.length,
          opacity: 1
        })
        return
      }
      let swiperHeight = 0
      if (nodes.length < showPage) {
        // 设置高
        swiperHeight = this.data.itemHeight + (nodes.length - 1) * translateYStep
      } else {
        swiperHeight = this.data.itemHeight + (showPage - 1) * translateYStep
      }
      this.setData({
        dotslength: nodes.length,
        swiperHeight
      })
      for (let i = 0; i < nodes.length; i++) {
        let translateY = 0
        let scale = 1
        let opacity = 0
        let maskColor = maskColorArr[showPage - 1]
        if (i < showPage) {
          translateY = i * translateYStep
          scale = 1 - i * scaleStep
          opacity = 1
          maskColor = maskColorArr[i]
        } else {
          translateY = (showPage - 1) * translateYStep
          scale = 1 - (showPage - 1) * scaleStep
        }
        nodes[i].setData({
          translateY: translateY + 'rpx',
          scale,
          zIndex: nodes.length - i,
          opacity,
          maskColor
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
      let _timer = this.data._timer
      if (_timer) clearInterval(_timer)
      _timer = setInterval(() => {
        this._next()
      }, this.data.interval)
      this.setData({
        _timer
      })
    },
    _next(distance = 'left') {
      // 下一页
      let nodes = this.data._nodes
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
      let nodes = this.data._nodes
      let translateY = (showPage - 1) * translateYStep
      let scale = 1 - (showPage - 1) * scaleStep
      let opacity = 0
      let maskColor = maskColorArr[showPage - 1]
      if (nodes.length < showPage) {
        maskColor = maskColorArr[nodes.length - 1]
      }
      nodes[current].setData({
        translateX: '0rpx',
        translateY: translateY + 'rpx',
        scale,
        zIndex: 1,
        opacity,
        maskColor: maskColor
      })
    },
    _setNextSlidePosition(start) {
      let nodes = this.data._nodes
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
        let translateY = index * translateYStep
        let scale = 1 - index * scaleStep
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
            opacity: 1,
            maskColor: maskColorArr[index]
          })
        }
      }
      setTimeout(() => {
        this._setVisibleSlideIndex(nextIndexArr)
      }, 1500)
    },
    _setVisibleSlideIndex(nextIndexArr) {
      let nodes = this.data._nodes
      for (let index in nextIndexArr) {
        nodes[nextIndexArr[index]].setData({
          zIndex: nodes.length - index
        })
      }
    }
  },
})
