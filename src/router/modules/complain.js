import layout from '@/components/layout'
import Index from '@/views/complain/Index.vue'

export default {
  path: '/complain',
  name: 'complain',
  component: layout,
  redirect: { name: 'complain-index' },
  children: [
    {
      path: 'index',
      name: 'complain-index',
      component: Index
    }
  ]
}
