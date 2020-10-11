import layout from '@/components/layout'
import buildIndex from '@/views/build/Index.vue'
import buildDetail from '@/views/build/detail.vue'

export default {
  path: '/build',
  name: 'build',
  meta:{
    title:'建档管理'
  },
  component: layout,
  redirect: { name: 'build-index' },
  children: [
    {
      path: 'list',
      name: 'buildList',
      meta:{
        title:'建档列表',
        keepAlive: true,
      },
      component: buildIndex
    },
    {
      path: 'detail/:enterpriseId/:id',
      name: 'build-detail',
      meta:{
        title:'建档详情'
      },
      component: buildDetail
    },
  ]
}
