import layout from '@/components/layout'
import storeageIndex from '@/views/mmc/storeage/Index.vue'
import storeageAdd from '@/views/mmc/storeage/Add.vue'
import storeageEdit from '@/views/mmc/storeage/Edit.vue'

export default {
  path: '/mmc',
  name: 'mmc',
  meta:{
    title:'运营管理'
  },
  component: layout,
  redirect: { name: 'storeage-index' },
  children: [
    {
      path: 'storeage',
      name: 'storeage-index',
      component: storeageIndex,
      meta:{
        title:'资源库管理'
      }
    },
    {
      path: 'storeage/add',
      name: 'storeage-add',
      component: storeageAdd,
      meta:{
        title:'新增资源'
      }
    },
    {
      path: 'storeage/:id',
      name: 'storeage-edit',
      component: storeageEdit,
      meta:{
        title:'编辑资源'
      }
    },
  ]
}
