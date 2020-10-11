import request from '@/plugin/axios'
export default {
  // 查询账号
  searchRequest: data => {
    let formData = new FormData()
    formData.append('pageNum', data.pageNum)
    formData.append('pageSize', data.pageSize)
    formData.append('phoneNumber', data.phoneNumber)
    formData.append('accountName', data.accountName)
    formData.append('realName', data.realName)
    formData.append('organizationId', data.organizationId)
    formData.append('type', data.type)
    formData.append('category', data.category)
    formData.append('state', data.state)
    return request({
      url: '/authorizes/account/query',
      method: 'post',
      data: formData
    })
  },
  // 新增账号
  addRequest: data => {
    let formData = new FormData()
    formData.append('accountName', data.accountName)
    formData.append('phoneNumber', data.phoneNumber)
    formData.append('password', data.password)
    formData.append('state', data.state)
    formData.append('type', data.type)

    data.displayName && formData.append('displayName', data.displayName)
    data.realName && formData.append('realName', data.realName)
    data.mail && formData.append('mail', data.mail)
    data.organizationId && formData.append('organizationId', data.organizationId)
    data.departmentId && formData.append('departmentId', data.departmentId)
    return request({
      url: '/authorizes/account/create',
      method: 'post',
      data: formData
    })
  },
  // 查看账号是否存在
  phoneRequest: data => {
    let formData = new FormData()
    formData.append('name', data.name)
    return request({
      url: '/authorizes/account/validate',
      method: 'post',
      data: formData
    })
  },
  // 查看账号详情
  detailRequest : data => {
    let formData = new FormData()
    formData.append('accountName', data.accountName)
    return request({
      // url: '/edu/account/details',
      url: '/authorizes/account/detail',
      method: 'post',
      data: formData
    })
  },
  // 删除账号
  delRequest: names => {
    let formData = new FormData()
    formData.append('names', names)
    return request({
      url: '/authorizes/account/delete',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  // 密码修改
  pwdRequest: data => {
    let formData = new FormData()
    formData.append('oldPassword', data.oldPassword)
    formData.append('password', data.password)
    return request({
      url: '/authorizes/account/passport',
      method: 'post',
      data: formData
    })
  },
  // 密码重置
  pwdResetRequest: data => {
    let formData = new FormData()
    formData.append('name', data.accountName)
    return request({
      url: '/authorizes/account/reset',
      method: 'post',
      data: formData
    })
  },
  // 账号修改
  updateRequest: data => {
    let organizationId = data.organizationId || 0
    let formData = new FormData()
    formData.append('accountName', data.accountName)
    formData.append('phoneNumber', data.phoneNumber)
    formData.append('password', data.password)
    formData.append('state', data.state)
    formData.append('type', data.type)

    formData.append('organizationId', organizationId)

    data.displayName && formData.append('displayName', data.displayName)
    data.realName && formData.append('realName', data.realName)
    data.mail && formData.append('mail', data.mail)
    data.imageUrl && formData.append('imageUrl', data.imageUrl)
    data.departmentId && formData.append('departmentId', data.departmentId)
    return request({
      url: '/authorizes/account/save',
      method: 'post',
      data: formData
    })
  },
  // 查询机构
  queryOrgRequest: data => {
    return request({
      url: '/ydh/mall/enterprise/list',
      method: 'get',
      params: data
    })
  },
  // 检查账号名是否存在
  checkAccountName: accountName => {
    let formData = new FormData()
    formData.append('name', accountName)
    return request({
      url: '/authorizes/account/validate',
      method: 'post',
      data: formData
    })
  },
  // 查询类别
  typeRequest : () => {
    return request({
      url: '/common/acc/types',
      method: 'get',
      params: {}
    })
  },
  //查询类型
  categoryRequest : () => {
    return request({
      url: '/common/acc/category',
      method: 'get',
      params: {}
    })
  },
  // 查询状态
  statusRequest : () => {
    return request({
      url: '/common/account/status',
      method: 'get',
      params: {}
    })
  },
  releaseAccount: (name, status) => {
    let formData = new FormData()
    formData.append('name', name)
    formData.append('status', status)
    return request ({
      url: 'authorizes/account/release',
      method: 'post',
      data: formData
    })
  },
  // 获取部门列表
  getDepartmentList: () => {
    return request ({
      url: '/authorizes/department/display',
      method: 'post'
    })
  },

  // 获取机构部门列表
  getOrgDepartmentData: (orgId) => {
    let formData = new FormData()
    formData.append('orgId', orgId)
    return request ({
      url: '/authorizes/simple/department/display',
      method: 'post',
      data: formData
    })
  }
}
