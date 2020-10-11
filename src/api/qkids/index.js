import request from '@/plugin/axios'

// 获取久趣课程包
function getCoursePackageList() {
  return request ({
    url: '/edu/qkids/course/package/list',
    params: {}
  })
}

// 获取课程包下的课程
function getCourseList(id) {
  return request ({
    url: `/edu/qkids/course/package/details/${id}`,
    params: {}
  })
}

export {
  getCoursePackageList,
  getCourseList
}
