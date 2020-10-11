import layout from '@/components/layout'
import enterpriseIndex from '@/views/enterprise/Index.vue'
import enterpriseDetail from '@/views/enterprise/detail.vue'

export default {
  path: '/enterprise',
  name: 'enterprise',
  meta:{
    title:'企业管理'
  },
  component: layout,
  redirect: { name: 'enterprise-index' },
  children: [
    {
      path: 'list',
      name: 'enterpriseList',
      meta:{
        title:'企业入驻列表',
        keepAlive: true,
      },
      component: enterpriseIndex
    },
    {
      path: 'detail/:enterpriseId',
      name: 'enterprise-detail',
      meta:{
        title:'企业入驻详情'
      },
      component: enterpriseDetail
    },
  ]
}
