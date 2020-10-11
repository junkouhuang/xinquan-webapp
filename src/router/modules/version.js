import layout from '@/components/layout'
import versionIndex from '@/views/version/Index.vue'
import versionAdd from '@/views/version/Add.vue'
import versionEdit from '@/views/version/Edit.vue'
import versionDetail from '@/views/version/Detail.vue'

export default {
  path: '/version',
  name: 'version',
  meta:{
    title:'版本管理'
  },
  component: layout,
  redirect: { name: 'version-index' },
  children: [
    {
      path: 'app',
      name: 'version-index',
      component: versionIndex,
      meta:{
        title:'APP版本管理'
      }
    },
    {
      path: 'app/add',
      name: 'version-add',
      component: versionAdd,
      meta:{
        title:'新增APP版本'
      }
    },
    {
      path: 'app/:id',
      name: 'version-edit',
      component: versionEdit,
      meta:{
        title:'编辑版本'
      }
    },
    {
      path: 'app/detail/:id',
      name: 'version-detail',
      component: versionDetail,
      meta:{
        title:'版本详情'
      }
    },
  ]
}
