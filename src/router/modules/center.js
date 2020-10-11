import layout from '@/components/layout'
import centerIndex from '@/views/center/Index.vue'
import centerAdd from '@/views/center/Add.vue'
import centerEdit from '@/views/center/Edit.vue'

export default {
  path: '/center',
  name: 'center',
  component: layout,
  redirect: { name: 'center-index' },
  children: [
    {
      path: 'index',
      name: 'center-index',
      component: centerIndex
    },
    {
      path: 'add',
      name: 'center-add',
      component: centerAdd
    },
    {
      path: ':id',
      name: 'center-edit',
      component: centerEdit
    }
  ]
}
