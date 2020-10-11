import layout from '@/components/layout'
import mipuIndex from '@/views/minle/mipu/Index.vue'
import mipuAdd from '@/views/minle/mipu/Add.vue'
import mipuEdit from '@/views/minle/mipu/Edit.vue'
import mipuDetail from '@/views/minle/mipu/Detail.vue'

export default {
  path: '/minle',
  name: 'minle',
  meta:{
    title:'米铺管理'
  },
  component: layout,
  redirect: { name: 'mipu-index' },
  children: [
    {
      path: 'mipu',
      name: 'mipu-index',
      component: mipuIndex,
      meta:{
        title:'米铺列表'
      }
    },
    {
      path: 'mipu/add',
      name: 'mipu-add',
      component: mipuAdd,
      meta:{
        title:'新增米铺'
      }
    },
    {
      path: 'mipu/:id',
      name: 'mipu-edit',
      component: mipuEdit,
      meta:{
        title:'编辑米铺'
      }
    },
    {
      path: 'mipu/detail/:id',
      name: 'mipu-detail',
      component: mipuDetail,
      meta:{
        title:'米铺详情'
      }
    },
  ]
}
