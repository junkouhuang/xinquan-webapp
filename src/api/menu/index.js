import request from '@/plugin/axios'

// 查询
function queryMenu(data) {
  let formData = new FormData()
  formData.append('name', data.name)
  return request({
    url: '/authorizes/resources/query',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
//查询父级
function queryParentMenu() {
  return request({
    url: '/authorizes/resources/display',
    method: 'post',
    data: {},
  })
}
// 新增
function addMenu(data){
  let formData = new FormData()
  if(data.parentId == null){
    data.parentId = ''
  }
  formData.append('parentId', data.parentId)
  formData.append('name', data.name)
  formData.append('key', data.resKey)
  formData.append('type', String(data.type))
  formData.append('url', data.resUrl)
  //图标和描述可为空
  formData.append('description', data.description)
  formData.append('icon', data.iconfont)
  formData.append('sort',data.sort)
  return request({
    url: '/authorizes/resources/create',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 编辑
function editMenu(data){
  let formData = new FormData()
  formData.append('id', data.id)
  formData.append('parentId',data.parentId)
  formData.append('name', data.name)
  formData.append('key', data.resKey)
  formData.append('type', String(data.type))
  formData.append('url', data.resUrl)
  formData.append('description', data.description)
  formData.append('icon', data.iconfont)
  formData.append('sort',data.sort)
  return request({
    url: '/authorizes/resources/save',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// // 删除
function delMenu(data){
  let formData = new FormData()
  formData.append('key', data.resKey)
  return request({
    url: '/authorizes/resources/delete',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// // 菜单详情
function detailMenu(data){
  let formData = new FormData()
  formData.append('key', data.id)
  return request({
    url: '/authorizes/resources/details',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// // 检验系统参数名是否重复
function nameExist(data){
  let formData = new FormData()
  formData.append('name', data.name)
  formData.append('key', data.resKey)
  return request({
    url: '/authorizes/resources/validate',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
 }
//  查询icon
function iconMenu(){
  return request({
    url: '/common/icon/font',
    method: 'get',
    params: {}
  })
 }

 //  查询类型
function typeMenu(){
  return request({
    url: '/common/resources/types',
    method: 'get',
    params: {}
  })
 }


export { queryMenu, editMenu , detailMenu ,addMenu ,nameExist , delMenu ,iconMenu ,typeMenu ,queryParentMenu}
export default { queryMenu, editMenu , detailMenu ,addMenu ,nameExist ,delMenu ,iconMenu ,typeMenu ,queryParentMenu}
