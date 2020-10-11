<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加学员</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix" v-if="schoolClass.preState == 1 && schoolClass.classCode">
        <span>班级编号：{{ schoolClass.classCode }}</span>
      </div>

      <el-transfer
        filterable
        target-order="push"
        filter-placeholder="请输入学员名称"
        :titles="['所有学员', '已选学员']"
        v-model="selectedStudent"
        :data="studentData">
      </el-transfer>

      <div class="mt20">
        <el-button type="blue" @click="handleSubmit">保存提交</el-button>
        <el-button @click="$router.push({path: '/class/index'})">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { detailClass, queryStudent, addStudent } from '@/api/class'
export default {
  data() {
    return {
      schoolClass: {},
      selectedStudent: [],
      studentData: []
    }
  },
  created() {
    let id = parseInt(this.$route.params.id)
    // 班级详情
    detailClass(id).then(res => {
      this.schoolClass = res.data

      // 班级可以添加的学员
      queryStudent({
        pageNum: 1,
        pageSize: 200,
        coursePackageId: res.data.coursePackageId
      }).then(res => {
        let list = res.data
        if (list && list.length > 0) {
          let data = []
          list.forEach(ele => {
            data.push({ key: ele.id, label: `${ele.studentName}` })
          })
          this.studentData = data
        }
      })
    })
  },
  methods: {
    handleSubmit() {
      if (this.selectedStudent.length <= 0) {
        this.$message.error('请选择学员')
        return
      }
      let classId = parseInt(this.$route.params.id)
      let list = []
      this.selectedStudent.forEach(ele => {
        list.push({ id: ele, schoolClassId: classId })
      })
      addStudent({ schoolClassId: classId, coursePackageId: this.schoolClass.coursePackageId, list }).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.$message({
            message: '学员关联成功',
            type: 'success'
          })
          this.$router.push({path: `/class/${classId}`})
        } else if(res.returnCode == 'ERR_0015') {
          this.$message.error(res.returnMsg)
        } else {
          this.$message.error('学员关联失败')
        }
      })
    }
  }
}
</script>
