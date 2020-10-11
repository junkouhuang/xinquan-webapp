import layout from '@/components/layout'
import coursePlanIndex from '@/views/course-plan/Index.vue'
import coursePlanEdit from '@/views/course-plan/Edit.vue'
import coursePlanSchedule from '@/views/course-plan/Schedule.vue'

export default {
  path: '/course-plan',
  name: 'course-plan',
  component: layout,
  redirect: { name: 'course-plan-index' },
  children: [
    {
      path: 'index',
      name: 'course-plan-index',
      component: coursePlanIndex
    },
    {
      path: ':id',
      name: 'course-plan-edit',
      component: coursePlanEdit
    },
    {
      path: 'schedule/:id',
      name: 'course-plan-schedule',
      component: coursePlanSchedule
    }
  ]
}