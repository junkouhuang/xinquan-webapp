import request from '@/plugin/axios'

// 获取问卷表头
export function getTableHeaderList(data) {
  let formData = new FormData()
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  formData.append('title', data.title)
  formData.append('content', data.content)
  formData.append('state', data.state)
  return request ({
    url: '/edu/questionnaire/table/query',
    method: 'post',
    data: formData
  })
}

// 获取表头详情
export function getTableHeaderDetail(id) {
  let formData = new FormData()
  formData.append('tid', id)
  return request ({
    url: '/edu/questionnaire/table/detail',
    method: 'post',
    data: formData
  })
}

// 预览
export function previewTableHeader(id) {
  let formData = new FormData()
  formData.append('tid', id)
  return request ({
    url: '/edu/questionnaire/table/preview',
    method: 'post',
    data: formData
  })
}

// 删除表头
export function deleteTableHeader(id) {
  let formData = new FormData()
  formData.append('tid', id)
  return request ({
    url: '/edu/questionnaire/table/delete',
    method: 'post',
    data: formData
  })
}

// 添加表头
export function addTableHeader(data) {
  let formData = new FormData()
  formData.append('title', data.title)
  formData.append('content', data.content)
  formData.append('imageUrl', data.imageUrl)
  return request ({
    url: '/edu/questionnaire/table/create',
    method: 'post',
    data: formData
  })
}

// 更新表头
export function updateTableHeader(data) {
  let formData = new FormData()
  formData.append('tid', data.id)
  formData.append('title', data.title)
  formData.append('content', data.content)
  formData.append('imageUrl', data.imageUrl)
  return request ({
    url: '/edu/questionnaire/table/save',
    method: 'post',
    data: formData
  })
}

// 获取问题列表
export function getTopicList(data) {
  return request ({
    url: '/edu/questionnaire/query',
    method: 'get',
    params: data
  })
}

// 添加问题
export function addTopic(data) {
  return request ({
    url: '/edu/questionnaire/add',
    method: 'post',
    data
  })
}

// 删除问题
export function deleteTopic(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/questionnaire/delete',
    method: 'post',
    data: formData
  })
}

// 问题详情
export function getTopic(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/questionnaire/detail',
    method: 'post',
    data: formData
  })
}

// 更新问题
export function updateTopic(data) {
  return request ({
    url: '/edu/questionnaire/update',
    method: 'post',
    data
  })
}
