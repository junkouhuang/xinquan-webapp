<template>
  <div class="package-wraper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教研管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程包管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增课程包</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" style="max-width: 600px">
        <el-form-item label="课程包名称" prop="packageName">
          <el-input v-model="form.packageName" placeholder="输入课程包名称"></el-input>
        </el-form-item>
        <el-form-item label="课程包编号" prop="packageCode">
          <el-input v-model="form.packageCode" placeholder="输入课程包编号"></el-input>
        </el-form-item>
        <el-form-item label="课程包级别" prop="level">
          <el-select v-model="form.level" placeholder="选择课程包级别" style="width: 100%">
            <el-option v-for="(item, index) in packageLevel" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程包类型" prop="type">
          <el-select v-model="form.type" placeholder="选择课程包类型" style="width: 100%">
            <el-option v-for="(item, index) in packageTypes" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程包介绍">
          <el-input v-model="form.description" type="textarea" rows="5" placeholder="输入课程包的介绍信息"></el-input>
        </el-form-item>
        <el-form-item label="缩略图" prop="imageUrl">
          <upload-image :imageUrl="form.imageUrl" @changeImage="changeImage" />
        </el-form-item>
        <el-form-item label="上课次数" prop="classTimes">
          <el-input-number v-model="form.classTimes" controls-position="right" :min="0" :max="100"></el-input-number>
          次/每周
        </el-form-item>
        <el-form-item label="教学类型" prop="teachingTypes">
          <el-radio v-for="(item, index) in teachingList" :key="index" :label="item.id" v-model="form.teachingTypes">{{ item.name }}</el-radio>
        </el-form-item>
        <el-form-item label="教研类型" prop="teachingResearchTypes">
          <el-select placeholder="请选择教研类型" v-model="form.teachingResearchTypes">
            <el-option v-for="(item, index) in researchList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="QKid关联" v-if="qKidRelation" prop="qkidsId">
          <el-select v-model="form.qkidsId" @change="changePackageHandler" style="width: 100%" placeholder="请选择关联课程包" filterable>
            <el-option v-for="(item, index) in qKidPackageList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" @click="submitForm">保存提交</el-button>
          <el-button @click="$router.push({path: '/course-package/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import request from '@/api/course-package'
import { getCoursePackageList } from '@/api/qkids'
import uploadImage from '@/components/upload/image'
export default {
  components: {
    'upload-image': uploadImage
  },
  watch: {
    'form.teachingResearchTypes': function(value) {
      let research = this.researchList.find(item => item.id === value)
      if (research && research.value === 'Qkids Cooperation') {
        this.qKidRelation = true
      } else {
        this.qKidRelation = false
        this.form.qkidsId = ''
        this.form.qkidsName = ''
      }
    }
  },
  data() {
    const validatePackageName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入课程包名称'))
      }
      // 检查课程包名是否存在
      request.checkPackageName(value)
        .then(res => {
          if (res.returnMsg != 'success') {
            // 已存在
            return callback(new Error('课程包名称已存在'))
          } else {
            callback()
          }
        })
    }
    return {
      form: {
        packageName: '',
        description: '',
        imageUrl: ''
      },
      rules: {
        packageName: [
          { required: true, validator: validatePackageName, trigger: 'blur' }
        ],
        packageCode: [
          { required: true, message: '请输入课程包编号', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择课程包类型', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        classTimes: [
          { required: true, message: '请选择上课次数', trigger: 'change' }
        ],
        teachingTypes: [
          { required: true, message: '请选择教学类型', trigger: 'change' }
        ],
        teachingResearchTypes: [
          { required: true, message: '请选择教研类型', trigger: 'change' }
        ],
        qkidsId: [
          { required: true, message: '请选择关联课程包', trigger: 'change' }
        ]
      },
      teachingList: [], // 教学类型
      researchList: [],  // 教研类型
      qKidRelation: false,
      qKidPackageList: [],
      packageLevel: [],
      packageTypes: []
    }
  },
  created() {
    // 课程包级别
    request.getPackageLevel().then(res => {
      this.packageLevel = res.data
    })
    // 课程包类型
    request.getPackageTypes().then(res => {
      this.packageTypes = res.data
    })
    // 教学类型
    request.getTeachingTypes().then(res => {
      this.teachingList = res.data
    })
    // 教研类型
    request.getResearchTypes().then(res => {
      this.researchList = res.data
    })
    // 久趣课程包
    getCoursePackageList().then(res => {
      this.qKidPackageList = res.data
    })
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        request.savePackage(this.form)
          .then(res => {
            if(res.returnMsg == 'success' && res.data) {
              this.$confirm('是否继续关联课程？', '课程包添加成功', {
                confirmButtonText: '现在去关联',
                cancelButtonText: '稍后关联',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false
              }).then(() => {
                this.$router.push({path: `/course-package/course/${res.data}`})
              }).catch(() => {
                this.$router.push({path: '/course-package'})
              })
            } else {
              this.$message.error('课程包添加失败')
            }
          })
      })
    },
    changeImage(url) {
      this.form.imageUrl = url
    },
    changePackageHandler(id) {
      let item = this.qKidPackageList.find(item => item.id === id)
      this.form.qkidsName = item.name
    }
  }
}
</script>
