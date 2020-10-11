import request from '@/plugin/axios'

// 检查课程名称
function checkName(name) {
  let formData = new FormData()
  formData.append('courseName', name)
  return request ({
    url: '/edu/course/check',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'x-www-form-urlencoded'
    }
  })
}

// 课程详情
function detail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/course/details',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 课程列表
function list(data) {
  return request ({
    url: '/edu/course/query',
    method: 'get',
    params: data
  })
}

// 添加课程
function save(data) {
  return request ({
    url: '/edu/course/save',
    method: 'post',
    data
  })
}

// 删除课程
function del(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/edu/course/del',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 批量删除课程
function delBatch(ids) {
  let formData = new FormData()
  formData.append('ids', ids)
  return request({
    url: '/edu/course/delStateBatch',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'x-www-form-urlencoded'
    }
  })
}

// 更新课程
function update(data) {
  return request ({
    url: '/edu/course/update',
    method: 'post',
    data
  })
}

export { checkName, detail, list, save, del, delBatch, update }
export default { checkName, detail, list, save, del, delBatch, update }
