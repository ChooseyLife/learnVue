<template>
  <div class="singer" ref="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSingerList} from '@/api/singer'
import {ERR_OK} from '@/api/config'
import ListView from '@/base/listview/listview'
export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    setTimeout(() => {
      this._getSingerList()
    })
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.singers = res.list
        }
      })
    }
  },
  components: {
    ListView
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
