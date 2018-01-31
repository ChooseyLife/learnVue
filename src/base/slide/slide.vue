<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item,index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { addClass } from 'common/js/dom.js'
import BScroll from 'better-scroll'

const COMPONENT_NAME = 'slider'
export default {
  name: COMPONENT_NAME,
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    speed: {
      type: Number,
      default: 400
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    interval: {
      type: Number,
      default: 1000
    },
    isShowDots: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slide) {
        return
      }
      this._setSliderWidth(true)
      this.slide.refresh()
    })
  },
  activated() {
    // 使用keep-alive的时候重新设置它可以轮播
    if (this.autoPlay) {
      this._play()
    }
  },
  deactivated() {
    // 取消keep-alive的时候重新获取slide的dom结构
    clearTimeout(this.timer)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    init() {
      clearTimeout(this.timer)
      this._setSliderWidth()
      if (this.isShowDots) {
        this._initDots()
      }
      this._initSlide()
      if (this.autoPlay) {
        this._play()
      }
    },
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let len = this.children.length
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < len; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }

      // 根据轮播图动态设定轮播的父盒子宽度
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlide() {
      this.slide = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        },
        bounce: false,
        click: true
      })
      // 监听鼠标或者触摸 dot的当前点跟上当前图片，并使用_play方法
      this.slide.on('scrollEnd', () => {
        let pageIndex = this.slide.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        if (this.loop) {
          this._play()
        }
      })

      this.slide.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slide.next()
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin:0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
