import layout from '@/components/layout'
import orderIndex from '@/views/minle/order/Index.vue'
import orderAdd from '@/views/minle/order/Add.vue'
import orderEdit from '@/views/minle/order/Edit.vue'
import orderDetail from '@/views/minle/order/Detail.vue'

export default {
  path: '/minle',
  name: 'minle',
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
