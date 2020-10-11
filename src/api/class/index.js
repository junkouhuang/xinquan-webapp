import request from '@/plugin/axios'
// 查询机构班级
let queryClass = data=> {
    return request ({
      url: '/edu/schoolClass/find',
      method: 'get',
      params: data
      
    })
  }
// 查询机构班级详情
let detailClass = id=> {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/schoolClass/details',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  }
  // 新增班级接口
let addClass = data =>{
  return request ({
    url: '/edu/schoolClass/add',
    method: 'post',
    data
  })
}
// 预开班申请开班接口
let openClass = data => {
  let formData = new FormData()
  formData.append('id', data.id)
  formData.append('createRemark', data.createRemark)
  return request ({
    url: '/edu/schoolClass/audit',
    method: 'post',
    data: formData
  })
}
// 修改班级接口
let modifyClass = data => {
    return request ({
      url: '/edu/schoolClass/update',
      method: 'post',
      data
    })
  }
// 删除班级接口
let delClass = id => {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/schoolClass/del',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 查询班级下的可添加的学员接口
let queryStudent = data => {
    return request ({
      url: '/edu/schoolClass/match/students',
      method: 'get',
      params: data
    })
  }
let classStudent = data => {
  return request ({
    url: '/edu/schoolClass/query/students',
    method: 'get',
    params: data
  })
}
// 班级添加学员接口
let addStudent = data =>{
    return request ({
      url: '/edu/schoolClass/add/students',
      method: 'post',
      data
    })
  }
  //班级学员删除
let delStudent = data =>{
    return request ({
      url: '/edu/schoolClass/delete/students',
      method: 'post',
      data
    })
  }
// 停用班级
let stopClass = id => {
  return request ({
    url: '/edu/schoolClass/stop',
    method: 'post',
    data: { id }
  })
}
// 启用班级
let reopenClass = id => {
  return request ({
    url: '/edu/schoolClass/reopen',
    method: 'post',
    data: { id }
  })
}
// 班级操作记录
let getClassHistoryList = data => {
  return request ({
    url: '/edu/schoolClass/his/query',
    params: data
  })
}
// 班级操作类型
let getClassOperateTypes = () => {
  return request ({
    url: '/common/class/operate/type',
    params: {}
  })
}

export {queryClass,addClass,detailClass,openClass,modifyClass,delClass,queryStudent,addStudent,delStudent, classStudent, stopClass, reopenClass, getClassHistoryList, getClassOperateTypes}
export default{queryClass,addClass,detailClass,openClass,modifyClass,delClass,queryStudent,addStudent,delStudent, classStudent, stopClass, reopenClass, getClassHistoryList, getClassOperateTypes}
