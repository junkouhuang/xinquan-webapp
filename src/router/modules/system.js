import layout from '@/components/layout'
import SystemIndex from '@/views/system/Index.vue'
import Department from '@/views/system/Department.vue'
import Roles from '@/views/system/roles/Index.vue'
import RolesAdd from '@/views/system/roles/Add.vue'
import RolesEdit from '@/views/system/roles/Edit.vue'
import RolesMenu from '@/views/system/roles/Menu.vue'
import menuIndex from '@/views/system/menu/Index.vue'
import menuAdd from '@/views/system/menu/Add.vue'
import menuEdit from '@/views/system/menu/Edit.vue'

export default {
  path: '/system',
  name: 'system',
  meta:{
    title:'系统基础管理'
  },
  component: layout,
  redirect: { name: 'system-index' },
  children: [
    {
      path: 'index',
      name: 'system-index',
      component: SystemIndex,
      meta:{
        title:'系统基础管理'
      }
    },
    {
      path: 'department',
      name: 'system-department',
      component: Department,
      meta:{
        title:'部门管理'
      }
    },
    {
      path: 'roles',
      name: 'roles',
      meta:{
        title:'角色管理'
      },
      component: Roles,
    },
    {
      path: 'roles/add',
      name: 'roles-add',
      component: RolesAdd,
      meta:{
        title:'新增角色'
      }
    },
    {
      path: 'roles/:id',
      name: 'roles-edit',
      component: RolesEdit,
      meta:{
        title:'修改角色'
      },
    },
    {
      path: 'roles/:id/menu',
      name: 'roles-menu',
      component: RolesMenu,
      meta:{
        title:'分配角色权限'
      },
    },
    {
      path: 'menu/index',
      name: 'menu-index',
      component: menuIndex,
      meta:{
        title:'菜单管理'
      },
    },
    {
      path: 'menu/add',
      name: 'menu-add',
      component: menuAdd,
      meta:{
        title:'新增菜单'
      },
    },
    {
      path: 'menu/:id',
      name: 'menu-edit',
      component: menuEdit,
      meta:{
        title:'修改菜单'
      },
    },
  ]
}
