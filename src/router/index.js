import Vue from 'vue'
import Router from 'vue-router'
import cookie from 'js-cookie'

import Home from '@/views/Home.vue'
import Login from '@/views/common/Login.vue'
import Profile from '@/views/common/Profile.vue'
import Password from '@/views/common/password.vue'

import layout from '@/components/layout'

import org from './modules/org'
import account from './modules/account'
import course from './modules/course'
import coursePackage from './modules/course-package'
import coursePlan from './modules/course-plan'
import student from './modules/student'
import schoolClass from './modules/class'
import leave from './modules/leave'
import article from './modules/article'
import area from './modules/area'
import system from './modules/system'
import card from './modules/card'
import url from './modules/url'
import task from './modules/task'
import center from './modules/center'
import questionnaire from './modules/questionnaire'
import complain from './modules/complain'
import drug from './modules/drug'
import authentication from './modules/authentication'
import settle from './modules/settle'
import agent from './modules/agent'
import enterprise from './modules/enterprise'
import credentials from './modules/credentials'
import build from './modules/build'
import saleOrder from './modules/saleOrder'
import bill from './modules/bill'
import operation from './modules/operation'
import feedback from './modules/feedback'
import announcement from './modules/announcement'
import version from './modules/version'
import orgsystem from './modules/org-system'
import mmcFAQ from './modules/mmc-faq'
import mmcFeedback from './modules/mmc-feedback'
import mmcOrder from './modules/mmc-order'
import mmcStoreage from './modules/mmc-storeage'
import storeage from './modules/storeage'

Vue.use(Router)

const base = [
  {
    path: '/',
    component: layout,
    redirect: 'home',
    children: [
      {
        path: '/home',
        name: 'home',
        meta:{
          title:'Home'
        },
        component: Home
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/user',
    name: 'user',
    meta:{
      title:'账号管理'
    },
    component: layout,
    children: [
      {
        path: 'profile',
        name: 'profile',
        meta:{
          title:'个人信息'
        },
        component: Profile
      },
      {
        path: 'password',
        name: 'password',
        meta:{
          title:'修改密码'
        },
        component: Password
      }
    ]
  }
]
const routes = [
  ...base,
  org,
  account,
  course,
  coursePackage,
  coursePlan,
  student,
  schoolClass,
  leave,
  article,
  system,
  area,
  card,
  url,
  task,
  center,
  questionnaire,
  complain,
  drug,
  authentication,
  settle,
  agent,
  enterprise,
  credentials,
  build,
  saleOrder,
  bill,
  operation,
  feedback,
  announcement,
  version,
  orgsystem,
  mmcFAQ,
  mmcFeedback,
  mmcOrder,
  mmcStoreage,
  storeage,
  {
    path: '*',
    redirect: '/'
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  let access_token = cookie.get('access_token')
  if (to.name === 'login') {
    access_token ? next({ path: '/' }) : next()
  } else {
    access_token ? next() : next({ path: '/login', query: { redirect: to.fullPath } })
  }
})

export default router
