import request from '@/plugin/axios'

// APP版本查询
function list(data) {
  let formData = new FormData()
  formData.append('appName', data.appName)
  formData.append('type', data.type)
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  return request({
    url: '/common/app/version/list',
    method: 'post',
    data: formData
  })
}
// 添加APP版本
function add(data) {
  let formData = new FormData()
  formData.append('appName', data.appName)
  formData.append('appDescription', data.appDescription)
  formData.append('packageName', data.packageName)
  formData.append('versionCode', data.versionCode)
  formData.append('versionName', data.versionName)
  formData.append('isForceUpdate', data.isForceUpdate)
  formData.append('isAutoUpdate', data.isAutoUpdate)
  formData.append('isRun', data.isRun)
  formData.append('type', data.type)
  if (data.type == 1 || data.type == 3) {
    formData.append('apkUrl', data.apkUrl)
  } else if (data.type == 2) {
    formData.append('apkUrl', data.iosUrl)
  }
  formData.append('apkCheckCode', data.apkCheckCode)
  formData.append('incrementalUrl', data.incrementalUrl)
  formData.append('incrementalCheckCode', data.incrementalCheckCode)
  formData.append('parentId', data.parentId)
  formData.append('content', data.content)
  return request({
    url: '/common/app/version/add',
    method: 'post',
    data: formData
  })
}
// 修改APP版本
function edit(data) {
  let formData = new FormData()
  formData.append('id', data.id)
  formData.append('appName', data.appName)
  formData.append('appDescription', data.appDescription)
  formData.append('packageName', data.packageName)
  formData.append('versionCode', data.versionCode)
  formData.append('versionName', data.versionName)
  formData.append('isForceUpdate', data.forceUpdate)
  formData.append('isAutoUpdate', data.autoUpdate)
  formData.append('isRun', data.run)
  formData.append('isDiscarded', data.discarded)
  formData.append('parentId', data.parentId)
  formData.append('content', data.content)
  return request({
    url: '/common/app/version/save',
    method: 'post',
    data: formData
  })
}
// 删除APP版本
function del(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/app/version/delete',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// APP版本详情
function detail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/app/version/edit',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// APP类型
function appTypes(data){
  return request({
    url: '/common/app/types',
    method: 'get',
    params: data
  })
}

// APP版本信息
function appVersion(data){
  return request({
    url: '/common/app/version/display',
    method: 'get',
    params: data
  })
}

// APK包上传
function uploadApk(params) {
  let formData = new FormData();
  formData.append("file", params.file);
  return request({
    url: '/common/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export {  detail, list, add, del, edit, appTypes, appVersion, uploadApk }
export default { detail, list, add, del, edit, appTypes, appVersion, uploadApk }
