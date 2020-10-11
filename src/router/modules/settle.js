import layout from '@/components/layout'
import settleIndex from '@/views/settle/Index.vue'
import settleDetail from '@/views/settle/detail.vue'



export default {
  path: '/settle',
  name: 'settle',
  meta:{
    title:'结算管理'
  },
  component: layout,
  redirect: { name: 'settle-index' },
  children: [
    {
      path: 'list',
      name: 'settle-index',
      meta:{
        title:'结算列表'
      },
      component: settleIndex
    },
    {
      path: 'detail/:settlementId',
      name: 'settle-detail',
      meta:{
        title:'结算详情'
      },
      component: settleDetail
    },
  ]
}
