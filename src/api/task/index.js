import request from '@/plugin/axios'

// 获取任务列表
export function getTaskList(data) {
  return request ({
    url: '/edu/task/query',
    method: 'get',
    params: data
  })
}

// 同步任务
export function excuteTask(id) {
  return request ({
    url: '/edu/task/excute',
    method: 'post',
    data: { id }
  })
}

// 同步类型
export function getTaskSyncTypes() {
  return request ({
    url: '/common/sync/task/types',
    params: {}
  })
}
