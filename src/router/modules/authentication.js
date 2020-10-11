import layout from '@/components/layout'
import authenticationIndex from '@/views/authentication/Index.vue'
import authenticationDetail from '@/views/authentication/detail.vue'

export default {
  path: '/authentication',
  name: 'authentication',
  meta:{
    title:'实名认证管理'
  },
  component: layout,
  redirect: { name: 'authentication-index' },
  children: [
    {
      path: 'list',
      name: 'authenticationList',
      meta:{
        title:'实名认证列表',
        keepAlive: true,
      },
      component: authenticationIndex
    },
    {
      path: 'detail/:authId',
      name: 'authentication-detail',
      meta:{
        title:'实名认证详情'
      },
      component: authenticationDetail
    },
  ]
}
