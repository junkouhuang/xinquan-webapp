import layout from '@/components/layout'
import faqIndex from '@/views/minle/faq/Index.vue'
import faqAdd from '@/views/minle/faq/Add.vue'
import faqEdit from '@/views/minle/faq/Edit.vue'
import faqDetail from '@/views/minle/faq/Detail.vue'

export default {
  path: '/minle',
  name: 'minle',
  meta:{
    title:'运营管理'
  },
  component: layout,
  redirect: { name: 'faq-index' },
  children: [
    {
      path: 'faq',
      name: 'faq-index',
      component: faqIndex,
      meta:{
        title:'FAQ管理'
      }
    },
    {
      path: 'faq/add',
      name: 'faq-add',
      component: faqAdd,
      meta:{
        title:'新增问题'
      }
    },
    {
      path: 'faq/:id',
      name: 'faq-edit',
      component: faqEdit,
      meta:{
        title:'编辑问题'
      }
    },
    {
      path: 'faq/detail/:id',
      name: 'faq-detail',
      component: faqDetail,
      meta:{
        title:'问题详情'
      }
    },
  ]
}
