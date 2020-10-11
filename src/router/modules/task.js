import layout from '@/components/layout'
import taskIndex from '@/views/task/Index.vue'

export default {
  path: '/task',
  name: 'task',
  component: layout,
  redirect: { name: 'task-index' },
  children: [
    {
      path: 'index',
      name: 'task-index',
      component: taskIndex
    }
  ]
}
