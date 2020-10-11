<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>卡券管理</el-breadcrumb-item>
      <el-breadcrumb-item>更新卡券</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="cardForm" label-width="100px" style="max-width: 600px">
        <el-form-item label="卡券名称" prop="cardName">
          <el-input v-model="form.cardName" placeholder="卡券名称"></el-input>
        </el-form-item>
        <el-form-item label="卡券类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择卡券类型" style="width: 100%">
            <el-option label="体验卡" :value="1"></el-option>
            <el-option label="活动卡" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡券内容" prop="cardContent">
          <el-input type="textarea" rows="3" v-model="form.cardContent"></el-input>
        </el-form-item>
        <el-form-item label="课程包选择" prop="coursePackage">
          <select-package :packageName="form.packageName" @change="changeCoursePackage"/>
        </el-form-item>
        <el-form-item label="有效期" prop="effectiveDate">
          <el-date-picker
            v-model="effectiveDate"
            type="daterange"
            align="left"
            unlink-panels
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="封面图片" prop="coverImage">
          <upload-image :imageUrl="form.coverImage" @changeImage="changeImage" />
        </el-form-item>
        <el-form-item label="使用说明" prop="cardUseRules">
          <el-input type="textarea" rows="3" v-model="form.cardUseRules"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" @click="handleSubmit">提交保存</el-button>
          <el-button @click="$router.push({path: '/card/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import uploadImage from '@/components/upload/image'
import selectPackage from '@/components/common/select-package'
import { updateCard, getCardDetail } from '@/api/card'
export default {
  components: {
    'upload-image': uploadImage,
    'select-package': selectPackage
  },
  data() {
    const validateCoursePackage = (rule, value, callback) => {
      if (!this.form.coursePackageId) {
        return callback(new Error('请选择课程包'))
      }
      callback()
    }
    const validateEffectiveDate = (rule, value, callback) => {
      if (!this.effectiveDate) {
        return callback(new Error('请选择有效期'))
      }
      callback()
    }
    return {
      form: {},
      effectiveDate: '',
      rules: {
        cardName: [
          { required: true, message: '请输入卡券名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择卡券类型', trigger: 'blur' }
        ],
        coursePackage: [
          { required: true, validator: validateCoursePackage, trigger: 'blur' }
        ],
        effectiveDate: [
          { required: true, validator: validateEffectiveDate, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    effectiveDate: function(val) {
      this.form.effectiveStartDate = val ? val[0] : ''
      this.form.effectiveEndDate = val ? val[1] : ''
    }
  },
  created() {
    let id = this.$route.params.id
    getCardDetail(id).then(res => {
      this.form = res.data
      if (res.data.effectiveStartDate && res.data.effectiveEndDate) {
        let startDate = new Date(res.data.effectiveStartDate)
        let endDate = new Date(res.data.effectiveEndDate)
        this.effectiveDate = [startDate, endDate]
      }
    })
  },
  methods: {
    handleSubmit() {
      this.$refs['cardForm'].validate(valid => {
        if (!valid) return
        updateCard(this.form).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '卡券更新成功',
              type: 'success'
            })
            this.$router.push({path: '/card/index'})
          } else {
            this.$message.error('卡券更新失败')
          }
        })
      })
    },
    changeCoursePackage(row) {
      this.form.packageName = row.packageName
      this.form.coursePackageId = row.id
    },
    changeImage(url) {
      this.form.coverImage = url
    }
  }
}
</script>
