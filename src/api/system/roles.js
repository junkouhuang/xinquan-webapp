import request from '@/plugin/axios'

export function getRoles() {
  return request ({
    url: '/authorizes/roles/display'
  })
}

export function getRolesList(data) {
  let formData = new FormData()
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  formData.append('name', data.name)
  formData.append('orgId', data.orgId)
  // data.roleKey && formData.append('roleKey', data.roleKey)
  return request ({
    url: '/authorizes/roles/query',
    method: 'post',
    data: formData
  })
}

// 获取账号选择角色列表
export function getAccountRoles(data) {
  let formData = new FormData()
  formData.append('orgId', data.organizationId)
  formData.append('category', data.category)
  return request ({
    url: '/authorizes/roles/permission',
    method: 'post',
    data: formData
  })
}

export function deleteRole(key) {
  let formData = new FormData()
  formData.append('key', key)
  return request ({
    url: '/authorizes/roles/delete',
    method: 'post',
    data: formData
  })
}

export function deleteBatchRole(keys) {
  let formData = new FormData()
  formData.append('keys', keys)
  return request ({
    url: '/authorizes/roles/deleteBatch',
    method: 'post',
    data: formData
  })
}

export function addRole(data) {
  let formData = new FormData()
  formData.append('name', data.name)
  formData.append('key', data.roleKey)
  formData.append('enable', data.enable)
  formData.append('description', data.description)
  return request ({
    url: '/authorizes/roles/create',
    method: 'post',
    data: formData
  })
}

export function getRole(key) {
  let formData = new FormData()
  formData.append('key', key)
  return request ({
    url: '/authorizes/roles/details',
    method: 'post',
    data: formData
  })
}

export function updateRole(data) {
  let formData = new FormData()
  // formData.append('id', data.id)
  formData.append('name', data.name)
  formData.append('key', data.roleKey)
  formData.append('enable', data.enable)
  data.description && formData.append('description', data.description)
  return request ({
    url: '/authorizes/roles/save',
    method: 'post',
    data: formData
  })
}

export function checkRoleIsExist(data) {
  let formData = new FormData()
  // data.exceptId && formData.append('exceptId', data.exceptId)
  formData.append('name', data.name)
  formData.append('key', data.roleKey)
  return request ({
    url: '/authorizes/roles/validate',
    method: 'post',
    data: formData
  })
}
export function createRole(data) {
  let formData = new FormData()
  formData.append('name', data.name)
  formData.append('keys', data.keys)
  return request ({
    url: '/authorizes/account/permission',
    method: 'post',
    data: formData
  })
}

export function queryOrgRequest(data) {
  return request({
    url: '/ydh/mall/enterprise/list',
    method: 'get',
    params: data
  })
}
