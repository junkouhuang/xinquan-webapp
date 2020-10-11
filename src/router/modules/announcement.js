import layout from '@/components/layout'
import announcementAddIndex from '@/views/announcement/add.vue'
import announcementIndex from '@/views/announcement/Index.vue'
import announcementDetailIndex from '@/views/announcement/detail.vue'
import announcementEditorIndex from '@/views/announcement/editor.vue'

export default {
  path: '/announcement',
  name: 'drug',
  meta:{
    title:'公告管理'
  },
  component: layout,
  redirect: { name: 'announcement-index' },
  children: [
    {
      path: 'add',
      name: '公告管理',
      meta:{
        title:'公告新增'
      },
      component: announcementAddIndex
    },
    {
      path: 'list',
      name: '公告管理',
      meta:{
        title:'公告列表'
      },
      component: announcementIndex
    },
    {
      path: 'detail/:id',
      name: '公告管理',
      meta:{
        title:'公告详情'
      },
      component: announcementDetailIndex
    },
    {
      path: 'editor/:id',
      name: '公告管理',
      meta:{
        title:'公告编辑'
      },
      component: announcementEditorIndex
    },
  ]
}
