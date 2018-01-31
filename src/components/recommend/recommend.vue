<template>
  <div class="recommend" ref="recommend">
    <div class="slider-wrapper" ref="sliderWrapper" v-if="recommends.length">
      <slide>
        <div v-for="item in recommends" :key="item.code">
          <a :href="item.linkUrl">
            <img :src="item.picUrl">
          </a>
        </div>
      </slide>
    </div>
    <div class="recommend-list">
      <h1 class="list-title">热门歌单推荐</h1>
      <ul>
        <li v-for="item in discList" :key="item.code" class="item">
          <div class="icon">
            <img :src="item.imgurl" width="60" height="60">
          </div>
          <div class="text">
            <h2 class="name" v-text="item.creator.name"></h2>
            <p class="desc" v-text="item.dissname"></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Slide from 'base/slide/slide'
import {getRecommend, getDiscList} from '@/api/recommends'
export default {
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  created() {
    this._getRecommends()
    this._getDiscList()
  },
  methods: {
    _getRecommends() {
      getRecommend().then((res) => {
        this.recommends = res.data.slider
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        console.log(res)
        this.discList = res.data.list
      })
    }
  },
  components: {
    Slide
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          padding-right: 20px
          width: 60px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: #ffffff
          .desc
            color: $color-text-d
</style>
