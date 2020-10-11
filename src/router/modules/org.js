import layout from '@/components/layout'
import orgIndex from '@/views/org/Index.vue'
import orgAdd from '@/views/org/Add.vue'
import orgEdit from '@/views/org/Edit.vue'
import orgRegistration from '@/views/org/registration/Index.vue'
import orgRegistrationEdit from '@/views/org/registration/Edit.vue'

export default {
  path: '/org',
  name: 'org',
  component: layout,
  redirect: { name: 'org-index' },
  children: [
    {
      path: 'index',
      name: 'org-index',
      component: orgIndex
    },
    {
      path: 'add',
      name: 'org-add',
      component: orgAdd
    },
    {
      path: ':id',
      name: 'org-edit',
      component: orgEdit
    },
    {
      path: 'registration/index',
      name: 'org-registration',
      component: orgRegistration
    },
    {
      path: 'registration/add',
      name: 'org-registration-add',
      component: orgRegistrationEdit
    },
    {
      path: 'registration/:id',
      name: 'org-registration-edit',
      component: orgRegistrationEdit
    }
  ]
}