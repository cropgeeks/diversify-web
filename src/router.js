import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/plotdata',
      name: 'plotdata',
      component: () => import(/* webpackChunkName: "plotdata" */ './views/PlotData.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/speciesdata',
      name: 'speciesdata',
      component: () => import(/* webpackChunkName: "speciesdata" */ './views/SpeciesData.vue'),
      props: { baseUrl: null }
    },
    {
      path: '/traits',
      name: 'traits',
      component: () => import(/* webpackChunkName: "traits" */ './views/Traits.vue'),
      props: { baseUrl: null }
    }
  ]
})
