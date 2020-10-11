import layout from '@/components/layout'
import coursePackageIndex from '@/views/course-package/Index.vue'
import coursePackageAdd from '@/views/course-package/Add.vue'
import coursePackageEdit from '@/views/course-package/Edit.vue'
import coursePackageRelation from '@/views/course-package/Relation.vue'

export default {
  path: '/course-package',
  name: 'course-package',
  component: layout,
  redirect: { name: 'course-package-index' },
  children: [
    {
      path: 'index',
      name: 'course-package-index',
      component: coursePackageIndex
    },
    {
      path: 'add',
      name: 'course-package-add',
      component: coursePackageAdd
    },
    {
      path: ':id',
      name: 'course-package-edit',
      component: coursePackageEdit
    },
    {
      path: 'course/:id',
      name: 'course-package-course',
      component: coursePackageRelation
    }
  ]
}