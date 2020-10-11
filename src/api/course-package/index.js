import request from '@/plugin/axios'

// 课程包列表
function packageList(data) {
  return request ({
    url: '/edu/coursePackage/query',
    method: 'get',
    params: data
  })
}

// 获取机构课程包
function getOrgPackageList(data) {
  let formData = new FormData()
  formData.append('organizationId', data.organizationId)
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  formData.append('packageName', data.packageName)
  return request ({
    url: '/edu/coursePackage/class/choice/package',
    method: 'post',
    data: formData
  })
}

// 检查课程表名称
function checkPackageName(name) {
  let formData = new FormData()
  formData.append('packageName', name)
  return request ({
    url: '/edu/coursePackage/check',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 添加课程包
function savePackage(data) {
  return request ({
    url: '/edu/coursePackage/save',
    method: 'post',
    data
  })
}

// 删除课程包
function deletePackage(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/edu/coursePackage/del',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 批量删除课程包
function deletePackageBatch(ids) {
  let formData = new FormData()
  formData.append('ids', ids)
  return request({
    url: '/edu/coursePackage/deleteBatch',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 课程表详情
function packageDetail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/coursePackage/detail',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 更新课程包
function updatePackage(data) {
  return request ({
    url: '/edu/coursePackage/update',
    method: 'post',
    data
  })
}

// 查询课程包关联的课程
function relationCourse(data) {
  return request ({
    url: '/edu/coursePackage/query/course',
    method: 'get',
    params: data
  })
}

function insertRelationCourse(data) {
  return request ({
    url: '/edu/coursePackageRel/insertBatch',
    method: 'post',
    data
  })
}

// 课程包类型
function getPackageTypes() {
  return request ({
    url: '/common/course/packages',
    params: {}
  })
}
// 课程包级别
function getPackageLevel() {
  return request ({
    url: '/common/course/package/level',
    params: {}
  })
}

// 教学类型
function getTeachingTypes() {
  return request ({
    url: '/common/teaching/types',
    method: 'get',
    params: {}
  })
}

// 教研类型
function getResearchTypes() {
  return request ({
    url: '/common/teaching/research/types',
    method: 'get',
    params: {}
  })
}

export {
  packageList,
  getOrgPackageList,
  checkPackageName,
  savePackage,
  deletePackage,
  deletePackageBatch,
  packageDetail,
  updatePackage,
  relationCourse,
  insertRelationCourse,
  getTeachingTypes,
  getResearchTypes,
  getPackageTypes,
  getPackageLevel
}
export default {
  packageList,
  getOrgPackageList,
  checkPackageName,
  savePackage,
  deletePackage,
  deletePackageBatch,
  packageDetail,
  updatePackage,
  relationCourse,
  insertRelationCourse,
  getTeachingTypes,
  getResearchTypes,
  getPackageTypes,
  getPackageLevel
}
