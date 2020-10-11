import layout from '@/components/layout'
import leaveIndex from '@/views/leave/Index.vue'
import leaveAdd from '@/views/leave/Add.vue'

export default {
  path: '/leave',
  name: 'leave',
  component: layout,
  redirect: { name: 'leave-index' },
  children: [
    {
      path: 'index',
      name: 'leave-index',
      component: leaveIndex
    },
    {
      path: 'add',
      name: 'leave-add',
      component: leaveAdd
    }
  ]
}
