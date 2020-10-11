import layout from '@/components/layout'
import accountIndex from '@/views/account/Index.vue'
import accountAdd from '@/views/account/Add.vue'
import accountEdit from '@/views/account/Edit.vue'

export default {
  path: '/system',
  name: 'system',
  meta:{
    title:'系统基础管理'
  },
  component: layout,
  redirect: { name: 'account-index' },
  children: [
    {
      path: 'account',
      name: 'account-index',
      component: accountIndex,
      meta:{
        title:'账号管理'
      }
    },
    {
      path: 'account/add',
      name: 'account-add',
      component: accountAdd,
      meta:{
        title:'新增账号'
      }
    },
    {
      path: 'account/:id',
      name: 'account-edit',
      component: accountEdit,
      meta:{
        title:'修改账号'
      }
    }
  ]
}
