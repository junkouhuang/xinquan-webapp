import request from '@/plugin/axios'

// 查询预报名机构
function queryRegistrationList(data){
  return request({
    url: '/edu/pre/registration/query',
    method: 'get',
    params: data
  })
}

// 预报名机构详情
function registrationDetail(id) {
  return request ({
    url: '/edu/pre/registration/details',
    method: 'post',
    data: { id }
  })
}

// 修改机构报名信息
function updateRegistration(data) {
  return request ({
    url: '/edu/pre/registration/edit',
    method: 'post',
    data
  })
}

// 添加机构报名信息
function addRegistration(data) {
  return request ({
    url: '/edu/pre/registration/add',
    method: 'post',
    data
  })
}

// 删除机构报名信息
function deleteRegistration(id) {
  return request ({
    url: '/edu/pre/registration/delete',
    method: 'post',
    data: { id }
  })
}

// 机构人员规模
function getPopulationTypes() {
  return request ({
    url: '/common/population/types',
    method: 'get',
    params: {}
  })
}

export {
  queryRegistrationList,
  registrationDetail,
  addRegistration,
  updateRegistration,
  deleteRegistration,
  getPopulationTypes
}
