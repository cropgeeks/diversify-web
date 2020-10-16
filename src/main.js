import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { ClientTable } from 'vue-tables-2'
import api from './mixin/api.js'
import mixin from './mixin/mixin.js'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import VueAnalytics from 'vue-analytics'

let axiosDefaults = require('axios/lib/defaults')

Vue.use(BootstrapVue)
Vue.mixin(mixin)
Vue.mixin(api)
Vue.use(ClientTable, {}, false, 'bootstrap4', 'default')

Vue.component('l-map', LMap)
Vue.component('l-tile-layer', LTileLayer)
Vue.component('l-marker', LMarker)
Vue.component('l-popup', LPopup)

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.config.productionTip = false

// Set base URL based on environment
let baseUrl = './api/'

if (process.env.VUE_APP_BASE_URL) {
  baseUrl = process.env.VUE_APP_BASE_URL
}

axiosDefaults.baseURL = baseUrl

store.commit('ON_BASE_URL_CHANGED_MUTATION', baseUrl)

Vue.use(VueAnalytics, {
  id: 'UA-49362218-11',
  router,
  autoTracking: {
    exceptions: true
  },
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production'
  }
})

// Make sure jQuery is available
Vue.use({
  install: function (Vue, options) {
    Vue.prototype.$plotly = require('@/plugins/charts/custom-plotly')
    window.Plotly = Vue.prototype.$plotly
    Vue.prototype.$_ = require('lodash')
    window._ = Vue.prototype.$_
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
