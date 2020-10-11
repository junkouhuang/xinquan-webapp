import layout from '@/components/layout'
import billIndex from '@/views/bill/Index.vue'


export default {
  path: '/bill',
  name: 'bill',
  meta:{
    title:'会员中心'
  },
  component: layout,
  redirect: { name: 'bill-index' },
  children: [
    {
      path: 'list',
      name: '账单列表',
      meta:{
        title:'账单列表'
      },
      component: billIndex
    },
  ]
}
