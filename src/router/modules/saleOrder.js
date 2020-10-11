import layout from '@/components/layout'
import saleOrderIndex from '@/views/sale-order/Index.vue'
import saleOrderDetailIndex from '@/views/sale-order/detail/Index.vue'

export default {
  path: '/sale',
  name: 'sale',
  meta:{
    title:'销售单管理'
  },
  component: layout,
  redirect: { name: 'saleOrder-index' },
  children: [
    {
      path: 'list',
      name: '销售单列表',
      meta:{
        title:'销售单列表'
      },
      component: saleOrderIndex
    },
    {
      path: 'detail/:id',
      name: '销售单详情',
      meta:{
        title:'销售单详情'
      },
      component: saleOrderDetailIndex
    },

  ]
}
