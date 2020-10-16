import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
    },
    {
      path: '/plotdata',
      name: 'plotdata',
      component: () => import(/* webpackChunkName: "plotdata" */ './views/PlotData.vue')
    },
    {
      path: '/speciesdata',
      name: 'speciesdata',
      component: () => import(/* webpackChunkName: "speciesdata" */ './views/SpeciesData.vue')
    },
    {
      path: '/traits',
      name: 'traits',
      component: () => import(/* webpackChunkName: "traits" */ './views/Traits.vue')
    },
    {
      path: '/varieties',
      name: 'varieties',
      component: () => import(/* webpackChunkName: "varieties" */ './views/Varieties.vue')
    }
  ]
})
