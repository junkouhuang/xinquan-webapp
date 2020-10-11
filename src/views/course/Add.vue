<template>
  <div class="course-wraper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教研管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增课程</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" style="max-width: 600px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="课程介绍">
          <el-input v-model="form.description" type="textarea" rows="5" placeholder="输入课程的介绍信息"></el-input>
        </el-form-item>
        <el-form-item label="课程类型" prop="classType">
          <el-radio v-model="form.classType" :label="1">线上</el-radio>
          <el-radio v-model="form.classType" :label="0">线下</el-radio>
        </el-form-item>
        <el-form-item label="缩略图" prop="imageUrl">
          <upload-image :imageUrl="form.imageUrl" @changeImage="changeImage">
            <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </upload-image>
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
            :options="qKidOptions"
            @visible-change="handleQkidVisibleChange"
            @change="handleQkidChange"
            @active-item-change="handleQkidItemChange"
            placeholder="请选择关联课程"
            style="width: 100%"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" @click="submitForm">保存提交</el-button>
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
    var validateCourseName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入课程名称'))
      }
      // 检查课程名是否存在
      courseRequest.checkName(value)
        .then(res => {
          if (res.returnMsg != 'success') {
            // 课程名称已存在
            return callback(new Error('课程名称已存在'))
          } else {
            callback()
          }
        })
    }
    return {
      form: {
        classType: 1,
        classHour: 1,
        state: 1,
        imageUrl: ''
      },
      fileReader: '',
      qKidOptions: [],
      rules: {
        courseName: [
          { required: true, validator: validateCourseName, trigger: 'blur' }
        ],
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
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        courseRequest.save(this.form)
          .then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '课程添加成功',
                type: 'success'
              })
              this.$router.push({path: '/course/index'})
            } else {
              this.$message.error('课程添加失败')
            }
          })
      })
    },
    changeImage(url) {
      this.form.imageUrl = url
    },
    handleQkidVisibleChange(vis) {
      if (!vis || this.qKidOptions.length > 0) return
      // 久趣课程包
      getCoursePackageList().then(res => {
        let data = []
        res.data.forEach(ele => {
          data.push({label: ele.name, value: ele.id, children: []})
        })
        this.qKidOptions = data
      })
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
