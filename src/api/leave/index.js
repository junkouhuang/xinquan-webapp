import request from '@/plugin/axios'

// 请假记录列表
function getLeaveList(data) {
  return request ({
    url: '/edu/leave/query',
    method: 'get',
    params: data
  })
}

// 添加请假申请
function addLeave(data) {
  return request ({
    url: '/edu/leave/add',
    method: 'post',
    data
  })
}

// 请假类型
function getLeaveTypes() {
  return request ({
    url: '/common/leave/types',
    method: 'get',
    params: {}
  })
}

export {
  getLeaveList,
  addLeave,
  getLeaveTypes
}
