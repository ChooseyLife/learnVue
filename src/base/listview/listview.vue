<template>
  <scroll class="listview"
          :data="data"
          :listenScroll='listenScroll'
          :probeType='probeType'
          ref="listview"
          @scroll="scroll">
    <ul>
      <li v-for="list in data" :key="list.title" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{list.title}}</h2>
        <ul>
          <li v-for="item in list.items"
              :key="item.id"
              class="list-group-item"
              @click="singerView(item)">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name" v-text="item.name"></span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧快速入口 -->
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"
         @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList"
            :data-index="index"
            class="item"
            :key="item.code"
            :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <!-- 歌手字母标题 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll'
import Lazy from 'vue-lazyload'
import {getData} from '@/common/js/dom'
import Loading from '@/base/loading/loading'

// anchor的高度（设计稿上的数值）
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      // 设定初始化的滚动位置 scrollY, 设定右侧的高亮 currentIndex, diff = 某个位置的上限 - scrollY
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      // 点击右侧入口 快速定位到对应的dom （利用scrollToElement方法）
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
      console.log(anchorIndex)
    },
    onShortcutTouchMove(e) {
      // 计算开始滚动前的位置 和 要滚动后的位置
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 位置偏差
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 解决在滚动时出现 1-1 3-3 的位置问题, 因为this.touch.anchorIndex是字符串
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    singerView(item) {
      this.$emit('select', item)
    },
    _calculateHeight() {
      // 计算每次listGroup的高度
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    scroll(pos) {
      // 监听scroll子组件滚动的时候的 Y 值
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      // 处理滑动时index边界情况（一直滑动，导致某个位置时Y为负值）
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // 解决点击右侧入口的歌手字母标题title的同步， 获取了listHeight保存的上限标签的索引进行定位
      this.scrollY = this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },
  watch: {
    data() {
      // 监测data的变化，重新计算高度
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      // 左右联动区块的逻辑: 实时知道滚动位置，根据滚动位置算出在listGroup的区间
      // 然后就知道右侧区间对应着的索引，然后高亮

      // 判断scrollY落到哪个区间，上限和下限对比，遍历listHeight获得
      // 逻辑：拉到最顶，拉到中间，拉到底部
      // 当滚动到顶部 newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      const listHeight = this.listHeight
      // 中间滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let heightTop = listHeight[i]
        let heightBottom = listHeight[i + 1]
        if (-newY >= heightTop && -newY < heightBottom) {
          this.currentIndex = i
          this.diff = heightBottom + newY
          return
        }
        this.currentIndex = 0
      }
      // 当滚动到底部，是-newY大于最后一个元素的上限
      this.currentIndex = listHeight - 2
    },
    diff(newVal) {
      // 修改fixed的top，有过渡效果  顶出fixedTitle时有过渡效果
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Lazy,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          font-size: $font-size-medium
          color: $color-text-l
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      transform: translateY(-1px)
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
