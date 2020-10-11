<template>
  <div class="course-wraper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教研管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ form.usedFlag == 1 ? '查看课程' : '修改课程' }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-alert
        v-if="form.usedFlag == 1"
        title="课程已被使用，不能修改"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" style="max-width: 600px">
        <el-form-item label="课程名称" prop="courseName">
          {{ form.courseName }}
        </el-form-item>
        <el-form-item label="课程介绍" prop="description">
          <el-input v-model="form.description" type="textarea" rows="5" placeholder="输入课程的介绍信息"></el-input>
        </el-form-item>
        <el-form-item label="课程类型" prop="classType">
          <el-radio v-model="form.classType" :label="1">线上</el-radio>
          <el-radio v-model="form.classType" :label="0">线下</el-radio>
        </el-form-item>
        <el-form-item label="缩略图" prop="imageUrl">
          <upload-image :imageUrl="form.imageUrl" @changeImage="changeImage" />
        </el-form-item>
        <el-form-item label="消耗课时" prop="classHour">
          <el-input-number controls-position="right" v-model="form.classHour" :min="0" :max="100" :step="0.5" style="width: 145px"></el-input-number>
          <span style="margin-left: 10px">课时</span>
        </el-form-item>
        <el-form-item label="是否启用" prop="state">
          <el-radio v-model="form.state" :label="1">是</el-radio>
          <el-radio v-model="form.state" :label="0">否</el-radio>
        </el-form-item>

        <el-form-item label="QKid关联" prop="qkidsId">
          <el-cascader
            :value="qKidValue"
            :options="qKidOptions"
            @change="handleQkidChange"
            @active-item-change="handleQkidItemChange"
            placeholder="请选择关联课程"
            style="width: 100%"
            filterable
          ></el-cascader>
        </el-form-item>

        <el-form-item>
          <el-button v-if="form.usedFlag != 1" type="blue" @click="submitForm">保存提交</el-button>
          <el-button @click="$router.push({path: '/course/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import courseRequest from '@/api/course'
import { getCoursePackageList, getCourseList } from '@/api/qkids'
import uploadImage from '@/components/upload/image'
export default {
  components: {
    'upload-image': uploadImage
  },
  data() {
    return {
      form: {
        classType: 0,
        state: 1,
        imageUrl: ''
      },
      imageList: [],
      fileReader: '',
      qKidValue: [],
      qKidOptions: [],
      rules: {
        classType: [
          { required: true, message: '请选择课程类型', trigger: 'blur' }
        ],
        classHour: [
          { required: true, message: '请选择消耗课时', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择启用状态', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

    // 课程详情
    this.loadCourse()
  },
  methods: {
    loadCourse() {
      courseRequest.detail(this.$route.params.id).then(res => {
        if (res.data) {
          this.form = res.data
          let packageId = parseInt(res.data.qkidsId)
          let courseId = parseInt(res.data.qkidId)
          // 久趣课程包
          getCoursePackageList().then(res => {
            let data = []
            res.data.forEach(ele => {
              let children = []
              if (ele.id == packageId) {
                // 获取默认课程表的课程
                getCourseList(packageId).then(res => {
                  if (!res.data.lessons) return
                  res.data.lessons.forEach(ele => {
                    children.push({label: ele.name, value: ele.id})
                  })
                })
              }
              data.push({label: ele.name, value: ele.id, children})
            })
            this.qKidOptions = data

          })

          this.qKidValue = [packageId, courseId]
        }
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        courseRequest.update(this.form)
          .then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '课程修改成功',
                type: 'success'
              })
              this.$router.push({path: '/course'})
            } else if(res.returnCode == '40000067') {
              this.$message.error('课程已被使用，不能修改')
            } else {
              this.$message.error('课程修改失败')
            }
          })
      })
    },
    changeImage(url) {
      this.form.imageUrl = url
    },
    // 选择课程
    handleQkidChange(val) {
      if (val.length < 2) return
      this.form.qkidsId = val[0]
      this.form.qkidId = val[1]

      let coursePackage = this.qKidOptions.find(item => item.value == val[0])
      let course = coursePackage.children.find(item => item.value == val[1])
      this.form.qkidName = course.label
    },
    // 选择课程表
    handleQkidItemChange(val) {
      let itemIndex
      let coursePackage = this.qKidOptions.find((item, index) => {
        itemIndex = index
        return item.value === val[0]
      })
      if (coursePackage.value && !this.qKidOptions[itemIndex].children.length) {
        let data = []
        getCourseList(coursePackage.value).then(res => {
          if (!res.data.lessons) return
          res.data.lessons.forEach(ele => {
            data.push({label: ele.name, value: ele.id})
          })
        })
        this.qKidOptions[itemIndex].children = data
      }
    }
  }
}
</script>
