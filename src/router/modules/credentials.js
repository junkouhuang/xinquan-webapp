import layout from '@/components/layout'
import credentialsIndex from '@/views/credentials/Index.vue'
import credentialsDetail from '@/views/credentials/detail.vue'

export default {
  path: '/credentials',
  name: 'credentials',
  meta:{
    title:'证件列表'
  },
  component: layout,
  redirect: { name: 'credentials-index' },
  children: [
    {
      path: 'list',
      name: 'credentialsList',
      meta:{
        title:'证件列表',
        keepAlive: true,
      },
      component: credentialsIndex
    },
    {
      path: 'detail/:enterpriseId',
      name: 'credentials-detail',
      meta:{
        title:'证件列表详情'
      },
      component: credentialsDetail
    },
  ]
}
