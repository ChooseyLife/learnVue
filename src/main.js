// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import lazyLoad from 'vue-lazyload'
import router from './router'
import fastclick from 'fastclick'

import '../../learnvue-admin/src/common/stylus/index.styl'
// Vue.config.productionTip = false

Vue.use(lazyLoad, {
  loading: require('common/images/default.png')
})

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
