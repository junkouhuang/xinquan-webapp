import request from '@/plugin/axios'

// 获取投诉建议列表
function getComplainList(data) {
  return request ({
    url: '/edu/proposal/complaint/query',
    method: 'get',
    params: data
  })
}

// 删除投诉建议
function deleteComplain(ids) {
  return request ({
    url: '/edu/proposal/complaint/deleteBatch',
    method: 'post',
    data: ids
  })
}

export {
  getComplainList,
  deleteComplain
}
