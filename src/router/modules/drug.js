import layout from '@/components/layout'
import drugIndex from '@/views/drug/Index.vue'
import drugEditor from '@/views/drug/editor.vue'
import drugDetail from '@/views/drug/detail.vue'
import deliveryAmount from '@/views/drug/delivery-amount/deliveryAmount.vue'
import serviceFee from '@/views/drug/service-fee/serviceFee.vue'

export default {
  path: '/drug',
  name: 'drug',
  meta:{
    title:'商品管理'
  },
  component: layout,
  redirect: { name: 'drug-index' },
  children: [
    {
      path: 'list',
      name: 'drugList',
      meta:{
        title:'商品列表',
        keepAlive:'true'
      },
      component: drugIndex
    },
    {
      path: 'editor/:drugNo',
      name: '商品编辑',
      meta:{
        title:'商品编辑'
      },
      component: drugEditor
    },
    {
      path: 'detail/:drugNo',
      name: '商品详情',
      meta:{
        title:'商品详情'
      },
      component: drugDetail
    },
    {
      path: 'delivery/amount',
      name: '配送金额设置',
      meta:{
        title:'配送金额设置'
      },
      component: deliveryAmount
    },
    {
      path: 'service/fee',
      name: '服务费设置',
      meta:{
        title:'服务费设置'
      },
      component: serviceFee
    },
  ]
}
