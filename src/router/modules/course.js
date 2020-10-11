import layout from '@/components/layout'
import courseIndex from '@/views/course/Index.vue'
import courseAdd from '@/views/course/Add.vue'
import courseEdit from '@/views/course/Edit.vue'

export default {
  path: '/course',
  name: 'course',
  component: layout,
  redirect: { name: 'course-index' },
  children: [
    {
      path: 'index',
      name: 'course-index',
      component: courseIndex
    },
    {
      path: 'add',
      name: 'course-add',
      component: courseAdd
    },
    {
      path: ':id',
      name: 'course-edit',
      component: courseEdit
    }
  ]
}