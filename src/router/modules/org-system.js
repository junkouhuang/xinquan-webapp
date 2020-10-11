import layout from '@/components/layout'
import accountIndex from '@/views/org/system/account/Index.vue'
import accountAdd from '@/views/org/system/account/Add.vue'
import accountEdit from '@/views/org/system/account/Edit.vue'
import Roles from '@/views/org/system/roles/Index.vue'
import RolesAdd from '@/views/org/system/roles/Add.vue'
import RolesEdit from '@/views/org/system/roles/Edit.vue'
import RolesMenu from '@/views/org/system/roles/Menu.vue'
import Department from '@/views/org/system/Department.vue'

export default {
  path: '/organization',
  name: 'organization',
  meta:{
    title:'系统管理'
  },
  component: layout,
  redirect: { name: 'account-index' },
  children: [
    {
      path: 'account',
      name: 'account-index',
      component: accountIndex,
      meta:{
        title:'账号管理'
      }
    },
    {
      path: 'account/add',
      name: 'account-add',
      component: accountAdd,
      meta:{
        title:'新增账号'
      }
    },
    {
      path: 'account/:id',
      name: 'account-edit',
      component: accountEdit,
      meta:{
        title:'修改账号'
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
      path: 'roles/:id/:orgId/menu',
      name: 'roles-menu',
      component: RolesMenu,
      meta:{
        title:'分配角色权限'
      },
    },
    {
      path: 'department',
      name: 'department-index',
      meta:{
        title:'部门管理'
      },
      component: Department,
    },
  ]
}
