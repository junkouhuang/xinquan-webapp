import layout from '@/components/layout'
import studentIndex from '@/views/student/Index.vue'
import studentAdd from '@/views/student/Add.vue'
import studentEdit from '@/views/student/Edit.vue'
import studentCourse from '@/views/student/Relation.vue'

export default {
  path: '/student',
  name: 'student',
  component: layout,
  redirect: { name: 'student-index' },
  children: [
    {
      path: 'index',
      name: 'student-index',
      component: studentIndex
    },
    {
      path: 'add',
      name: 'student-add',
      component: studentAdd
    },
    {
      path: ':id',
      name: 'student-edit',
      component: studentEdit
    },
    {
      path: 'course-package/:id',
      name: 'student-course-package',
      component: studentCourse
    }
  ]
}