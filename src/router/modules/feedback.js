import layout from '@/components/layout'
import feedbackIndex from '@/views/operation/feedback/Index.vue'
import feedbackAdd from '@/views/operation/feedback/Add.vue'
import feedbackEdit from '@/views/operation/feedback/Edit.vue'
import feedbackDetail from '@/views/operation/feedback/Detail.vue'

export default {
  path: '/operation',
  name: 'operation',
  meta:{
    title:'运营管理'
  },
  component: layout,
  redirect: { name: 'feedback-index' },
  children: [
    {
      path: 'feedback',
      name: 'feedback-index',
      component: feedbackIndex,
      meta:{
        title:'反馈管理'
      }
    },
    {
      path: 'feedback/add',
      name: 'feedback-add',
      component: feedbackAdd,
      meta:{
        title:'新增反馈'
      }
    },
    {
      path: 'feedback/:id',
      name: 'feedback-edit',
      component: feedbackEdit,
      meta:{
        title:'编辑反馈'
      }
    },
    {
      path: 'feedback/detail/:id',
      name: 'feedback-detail',
      component: feedbackDetail,
      meta:{
        title:'反馈详情'
      }
    },
  ]
}
