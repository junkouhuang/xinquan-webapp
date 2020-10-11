import request from '@/plugin/axios'

// 学员列表
export function studentList(data) {
  return request ({
    url: '/edu/student/query',
    method: 'get',
    params: data
  })
}

// 添加学员
export function addStudent(data) {
  return request ({
    url: '/edu/student/add',
    method: 'post',
    data
  })
}

// 删除学员
export function deleteStudent(ids) {
  return request ({
    url: '/edu/student/delete',
    method: 'post',
    data: { idList: ids }
  })
}

// 启用学员
export function enableStudent(id) {
  return request ({
    url: '/edu/student/enable',
    method: 'post',
    data: { id }
  })
}

// 停用学员
export function stopStudent(id) {
  return request ({
    url: '/edu/student/stop',
    method: 'post',
    data: { id }
  })
}

// 学员详情
export function studentDetail(id) {
  return request ({
    url: '/edu/student/detail',
    method: 'post',
    data: { studentId: parseInt(id) }
  })
}

// 更新学员信息
export function updateStudent(data) {
  return request ({
    url: '/edu/student/update',
    method: 'post',
    data
  })
}

// 学员关联的课程包
export function stuCoursePackage(data) {
  return request ({
    url: '/edu/stuCourseRelation/query',
    method: 'get',
    params: data
  })
}

// 添加关联课程包
export function batchAddPackage(data) {
  return request ({
    url: '/edu/stuCourseRelation/batchAdd',
    method: 'post',
    data
  })
}

// 停用学员的课程包
export function stopStudentPackage(id) {
  return request ({
    url: '/edu/student/class/relation/stop',
    method: 'post',
    data: { id }
  })
}

// 发送学员信息
export function sendStudentInfo(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/student/send/userInfo',
    method: 'post',
    data: formData
  })
}

// 检查易贝乐学号是否存在
export function checkEblocksCodeExists(data) {
  return request ({
    url: '/edu/student/tag/check',
    method: 'post',
    data
  })
}

export default {
  studentList,
  addStudent,
  deleteStudent,
  enableStudent,
  stopStudent,
  studentDetail,
  updateStudent,
  stuCoursePackage,
  batchAddPackage,
  stopStudentPackage,
  sendStudentInfo,
  checkEblocksCodeExists
}
