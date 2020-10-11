import layout from '@/components/layout'
import classIndex from '@/views/class/Index.vue'
import classAdd from '@/views/class/Add.vue'
import classEdit from '@/views/class/Edit.vue'
import classStudent from '@/views/class/Relation.vue'
import auditIndex from '@/views/audit/Index.vue'
import auditEdit from '@/views/audit/Edit.vue'

export default {
  path: '/class',
  name: 'class',
  component: layout,
  redirect: { name: 'class-index' },
  children: [
    {
      path: 'index',
      name: 'class-index',
      component: classIndex
    },
    {
      path: 'add',
      name: 'class-add',
      component: classAdd
    },
    {
      path: ':id',
      name: 'class-edit',
      component: classEdit
    },
    {
      path: 'student/:id',
      name: 'class-student',
      component: classStudent
    },
    {
      path: 'audit/index',
      name: 'audit-index',
      component: auditIndex
    },
    {
      path: 'audit/:id',
      name: 'audit-edit',
      component: auditEdit
    }
  ]
}
