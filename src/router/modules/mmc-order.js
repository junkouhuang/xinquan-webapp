import layout from '@/components/layout'
import orderIndex from '@/views/mmc/order/Index.vue'
import orderAdd from '@/views/mmc/order/Add.vue'
import orderEdit from '@/views/mmc/order/Edit.vue'
import orderDetail from '@/views/mmc/order/Detail.vue'

export default {
  path: '/mmc',
  name: 'mmc',
  meta:{
    title:'订单管理'
  },
  component: layout,
  redirect: { name: 'order-index' },
  children: [
    {
      path: 'order',
      name: 'order-index',
      component: orderIndex,
      meta:{
        title:'商城订单'
      }
    },
    {
      path: 'order/add',
      name: 'feedback-add',
      component: orderAdd,
      meta:{
        title:'新增订单'
      }
    },
    {
      path: 'order/:id',
      name: 'feedback-edit',
      component: orderEdit,
      meta:{
        title:'编辑订单'
      }
    },
    {
      path: 'order/detail/:id',
      name: 'feedback-detail',
      component: orderDetail,
      meta:{
        title:'订单详情'
      }
    },
  ]
}
