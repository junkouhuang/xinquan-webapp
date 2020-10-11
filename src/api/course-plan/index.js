import request from '@/plugin/axios'

// 排课信息列表
function coursePlanList(data) {
  return request ({
    url: '/edu/course/plan/list',
    method: 'get',
    params: data
  })
}

// 取消排课
function cancelCoursePlan(planId) {
  let formData = new FormData()
  formData.append('planId', planId)
  return request ({
    url: '/edu/course/plan/cancel',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 排课详情
function coursePlanDetail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/course/plan/details',
    method: 'post',
    data: formData
  })
}

// 上课记录
function attendanceRecords(id) {
  return request ({
    url: '/edu/attendance/records/find',
    method: 'post',
    data: {
      schoolClassCoursePlanId: id
    }
  })
}

// 更新出勤情况
function updateAttendance(data) {
  return request ({
    url: '/edu/attendance/update',
    method: 'post',
    data
  })
}

// 更新排课信息
function updateCoursePlan(data) {
  return request ({
    url: '/edu/course/plan/modify',
    method: 'post',
    data
  })
}

// 排课表详情
function queryPrePlan(id) {
  return request ({
    url: '/edu/course/plan/preClassPlan',
    method: 'post',
    data: { schoolClassId: id }
  })
}

// 导出排课表
function exportPrePlan(id) {
  return request ({
    url: '/edu/class/pre/plan/exports',
    params: { schoolClassId: id },
    responseType: 'arraybuffer'
  })
}

export {
  coursePlanList,
  cancelCoursePlan,
  coursePlanDetail,
  updateCoursePlan,
  queryPrePlan,
  exportPrePlan,
  attendanceRecords,
  updateAttendance
}
export default {
  coursePlanList,
  cancelCoursePlan,
  coursePlanDetail,
  updateCoursePlan,
  queryPrePlan,
  exportPrePlan,
  attendanceRecords,
  updateAttendance
}
