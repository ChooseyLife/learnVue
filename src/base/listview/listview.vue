<template>
  <scroll class="listview">
    <ul>
      <li></li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll'

export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
