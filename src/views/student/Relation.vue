<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>学员管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加课程包</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <span>当前学员：{{ student.studentName }}</span>
      </div>

      <el-transfer
        filterable
        target-order="push"
        filter-placeholder="请输入课程包名称"
        :titles="['所有课程包', '已选课程包']"
        v-model="selectedPackage"
        :data="packageData">
      </el-transfer>

      <div class="mt20">
        <el-button type="blue" @click="handleSubmit">保存提交</el-button>
        <el-button @click="$router.push({path: '/student/index'})">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { packageList } from '@/api/course-package'
import { studentDetail, stuCoursePackage, batchAddPackage } from '@/api/student'
export default {
  data() {
    return {
      student: {},
      selectedPackage: [],
      packageData: [],
      packageArr: []
    }
  },
  created() {
    let id = parseInt(this.$route.params.id)
    // 学员详情
    studentDetail(id).then(res => {
      this.student = res.data
    })

    let disablePackage = []
    // 已关联课程包
    stuCoursePackage({
      studentId: id,
      pageNum: 1,
      pageSize: 500
    }).then(res => {
      let list = res.data.list
      if (list && list.length > 0) {
        let data = []
        list.forEach(ele => {
          data.push(ele.coursePackageId)
        })
        disablePackage = data
      }
    })
    // 所有课程包
    packageList({
      pageNum: 1,
      pageSize: 500,
      state: 1,
      studentId: id
    }).then(res => {
      let list = res.data.list
      this.packageArr = list
      if (list && list.length > 0) {
        let data = []
        list.forEach(ele => {
          if (disablePackage.indexOf(ele.id) < 0) {
            data.push({ key: ele.id, label: `${ele.packageName}` })
          }
        })
        this.packageData = data
      }
    })
  },
  methods: {
    handleSubmit() {
      if (this.selectedPackage.length <= 0) {
        this.$message.error('请选择课程包')
        return
      }
      if (this.selectedPackage.length > 5) {
        this.$message.error('课程包不能超过5个')
        return
      }
      let studentId = parseInt(this.$route.params.id)
      let list = []
      this.selectedPackage.forEach((ele, index) => {
        // 获取当前课程包
        let coursePackage = this.packageArr.filter(item => {
          return item.id == ele
        })
        coursePackage.length > 0 && list.push({ coursePackageId: ele, displayOrder: index + 1, classHourTotal: coursePackage[0].totalHours })
      })
      batchAddPackage({
        studentId,
        studentCourseRelBoList: list
      }).then(res => {
        if (res.returnMsg === 'success') {
          this.$message({
            message: '课程包关联成功',
            type: 'success'
          })
          this.$router.push({path: `/student/${studentId}`})
        } else {
          this.$message.error('课程包关联失败')
        }
      })
    }
  }
}
</script>
