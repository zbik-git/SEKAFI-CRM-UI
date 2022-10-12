import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RegisterActions from '../components/RegisterActions.vue'

import Deregistering from '../views/Deregistering.vue'
import RegistersDeregistering from '../components/RegistersDeregistering.vue'

import JobsCompleted from '../views/JobsCompleted.vue'
import JobsCompletedActions from '../components/JobsCompletedActions.vue'

import NewFiscalizations from '../views/NewFiscalizations.vue'
import NewFiscalizationsList from '../components/NewFiscalizationsList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: '',
        component: RegisterActions
      }
    ]
  },
  {
    path: '/Deregistering',
    name: 'Deregistering',
    component: Deregistering,
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: '',
        component: RegistersDeregistering
      }
    ]
  },
  {
    path: '/JobsCompleted',
    name: 'JobsCompleted',
    component: JobsCompleted,
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: '',
        component: JobsCompletedActions
      }
    ]
  },
  {
    path: '/Newfiscalizations',
    name: 'Newfiscalizations',
    component: NewFiscalizations,
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: '',
        component: NewFiscalizationsList
      }
    ]
  },
 
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
