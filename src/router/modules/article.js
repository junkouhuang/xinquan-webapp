import layout from '@/components/layout'
import articleIndex from '@/views/article/Index.vue'
import articleAdd from '@/views/article/Add.vue'
import articleEdit from '@/views/article/Edit.vue'

export default {
  path: '/article',
  name: 'article',
  component: layout,
  redirect: { name: 'article-index' },
  children: [
    {
      path: 'index',
      name: 'article-index',
      component: articleIndex
    },
    {
      path: 'add',
      name: 'article-add',
      component: articleAdd
    },
    {
      path: ':id',
      name: 'article-edit',
      component: articleEdit
    },
  ]
}
