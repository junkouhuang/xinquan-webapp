import layout from '@/components/layout'
import agentIndex from '@/views/agent/Index.vue'
import agentDetail from '@/views/agent/detail.vue'
import agentSalesIndex from '@/views/agent/sales/Index.vue'

export default {
  path: '/agent',
  name: 'agent',
  meta:{
    title:'合伙人管理'
  },
  component: layout,
  redirect: { name: 'agent-index' },
  children: [
    {
      path: 'list',
      name: 'agent-index',
      meta:{
        title:'合伙人列表'
      },
      component: agentIndex
    },
    {
      path: 'detail/:applyId',
      name: 'agent-detail',
      meta:{
        title:'合伙人详情'
      },
      component: agentDetail
    },
    {
          path: 'sales',
          name: 'agent-sales',
          meta:{
            title:'团队业绩'
          },
          component: agentSalesIndex
        },
  ]
}
