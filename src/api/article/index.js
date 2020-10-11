import request from '@/plugin/axios'

// 文章查询
function list(data) {
  return request({
    url: '/edu/article/query',
    method: 'get',
    params: data
  })
}
// 添加文章
function save(data) {
  return request({
    url: '/edu/article/add',
    method: 'post',
    data
  })
}
// 修改文章
function update(data) {
  return request({
    url: '/edu/article/update',
    method: 'post',
    data
  })
}
// 批量删除文章
function delBatch(data){
  return request({
    url: '/edu/article/deleteBatch',
    method: 'post',
    data
  })
}
// 删除文章
function del(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/edu/article/delete',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 文章详情
function detail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/edu/article/details',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 文章类别
function typeArt(data){
  return request({
    url: '/common/article/types',
    method: 'get',
    params: data
  })
}
// 文章下架
function  down(id){
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/edu/article/down',
    data: formData,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 文章上架
function  up(id){
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/edu/article/pub/web',
    data: formData,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export {  detail, list, save, del, delBatch, update, typeArt, down ,up}
export default { detail, list, save, del, delBatch, update, typeArt, down,up }
