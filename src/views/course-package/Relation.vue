<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教研管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程包管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程关联</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <span>当前课程包：{{ coursePackage.packageName }}</span>
      </div>

      <!-- <div v-if="!isOrderRules" style="margin-bottom: 15px">
        <el-alert
          title="已选课时排列规则错误"
          type="error"
          :closable="false"
          show-icon>
        </el-alert>
      </div> -->

      <el-transfer
        filterable
        target-order="push"
        filter-placeholder="请输入课程名"
        :titles="['所有课程', '已选课程']"
        v-model="selectedCourse"
        :data="courseData">
      </el-transfer>

      <!-- <div class="mt20">
        课程的顺序：{{ coursePackage.classOrder }}（注：A代表“线下2课时”，B代表“线上1课时”）
      </div> -->

      <div class="mt20">
        <el-button type="blue" @click="handleSubmit">保存提交</el-button>
        <el-button @click="$router.push({path: '/course-package/index'})">返回</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
import { list as courseList } from '@/api/course'
import { packageDetail, relationCourse, insertRelationCourse } from '@/api/course-package'
export default {
  data() {
    return {
      coursePackage: {},
      totalCourse: [],
      courseData: [],
      selectedCourse: [],
      isOrderRules: false
    }
  },
  // watch: {
  //   selectedCourse: function(val) {
  //     if (val.length <= 0) return
  //     let orderRule = this.coursePackage.classOrder // 课程顺序
  //     let isOrderRules = true
  //     let tempOrder = ''
  //     let tempHour = 0
  //     let tempType = null
  //     for (let i = 0; i < val.length; i++) {
  //       let course = this.totalCourse.filter(ele => {
  //         return ele.id == val[i]
  //       })

  //       if (!course.length) return false
  //       let type = course[0].classType  // 课程类型 0：线下 1：线上
  //       let hour = course[0].classHour  // 课时（线下必须2的倍数，线上必须1的倍数）

  //       const result = () => {
  //         if (tempType === 0) {
  //           // 线下必须2的倍数
  //           if (tempHour === 2) {
  //             tempOrder += 'A'
  //             tempType = null
  //             tempHour = 0
  //           } else if(tempHour > 2) {
  //             isOrderRules = false
  //             return
  //           } else if(tempHour < 2 && i >= (val.length - 1)) {
  //             isOrderRules = false
  //             return
  //           }
  //         } else {
  //           // 线上必须1的倍数
  //           if (tempHour === 1) {
  //             tempOrder += 'B'
  //             tempType = null
  //             tempHour = 0
  //           } else if(tempHour > 1) {
  //             isOrderRules = false
  //             return
  //           } else if(tempHour < 1 && i >= (val.length - 1)) {
  //             isOrderRules = false
  //             return
  //           }
  //         }
  //       }

  //       // 判断上一个课程类型是否相同
  //       if (tempType === type) {
  //         tempHour += hour
  //         result()
  //       } else {
  //         if (tempHour > 0) {
  //           isOrderRules = false
  //           break
  //         }
  //         tempType = type
  //         tempHour = hour
  //         result()
  //       }
  //     }
  //     // 对比排序规则是否正确
  //     // console.log(tempOrder)
  //     if (isOrderRules) {
  //       if (tempOrder.length == orderRule.length) {
  //         tempOrder == orderRule ? isOrderRules = true : isOrderRules = false
  //       } else if (tempOrder.length < orderRule.length) {
  //         isOrderRules = false
  //       } else if (tempOrder.length > orderRule.length) {
  //         let index = 0
  //         for (let i = 0; i < tempOrder.length; i++) {
  //           if (index % orderRule.length == 0) {
  //             index = 0
  //           }
  //           // console.log(tempOrder[i], orderRule[index], index)
  //           if (tempOrder[i] != orderRule[index]) {
  //             isOrderRules = false
  //           }
  //           index ++
  //         }
  //       }
  //     }
  //     this.isOrderRules = isOrderRules
  //   }
  // },
  created() {
    // 课程详情
    packageDetail(this.$route.params.id)
      .then(res => {
        this.coursePackage = res.data
      })
    // 所有课程
    courseList({ pageNum: 1, pageSize: 200, state: 1 })
      .then(res => {
        let list = res.data.list
        this.totalCourse = list
        if (list && list.length > 0) {
          let data = []
          list.forEach(ele => {
            data.push({ type: ele.classType, key: ele.id, label: `${ele.courseName}（${ele.classType === 0 ? '线下' : '线上'}/${ele.classHour}课时）` })
          })
          this.courseData = data
        }

        // 已选课程
        relationCourse({
          id: this.$route.params.id,
          pageNum: 1,
          pageSize: 200
        }).then(res => {
          let list = res.data.list
          if (list && list.length > 0) {
            let data = []
            list.forEach(ele => {
              data.push(ele.courseId)
            })
            this.selectedCourse = data
          }
        })
      })
  },
  methods: {
    handleSubmit() {
      if (this.selectedCourse.length <= 0) {
        this.$message.error('请选择课程')
        return
      }
      let list = []
      let id = this.$route.params.id
      this.selectedCourse.forEach((ele, index) => {
        list.push({ packageId: id, courseId: ele, displayOrder: index + 1 })
      })
      insertRelationCourse(list).then(res => {
        if (res.returnMsg == 'success') {
          this.$message({
            message: '课程关联成功',
            type: 'success'
          })
          this.$router.push({path: `/course-package/${id}`})
        } else {
          this.$message.error('课程关联失败')
        }
      })
    }
  }
}
</script>
