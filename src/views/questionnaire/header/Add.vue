<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>问卷管理</el-breadcrumb-item>
      <el-breadcrumb-item>表头管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增表头</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" style="max-width: 600px">
        <el-form-item label="封面图" prop="imageUrl">
          <upload-image :imageUrl="form.imageUrl" @changeImage="changeImage" />
        </el-form-item>
        <el-form-item label="问卷标题" prop="title">
          <el-input v-model="form.title" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="问卷描述" prop="content">
          <el-input type="textarea" rows="3" v-model="form.content" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/questionnaire/header'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { addTableHeader } from '@/api/questionnaire'
import uploadImage from '@/components/upload/image'
export default {
  components: {
    uploadImage
  },
  data() {
    return {
      form: {
        title: '',
        content: '',
        imageUrl: ''
      },
      rules: {
        imageUrl: [
          { required: true, message: '请上传表头封面', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入表头标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入表头内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) return
        addTableHeader(this.form).then(res => {
          if (res.returnMsg == 'success') {
            this.$message({
              message: '表头添加成功',
              type: 'success'
            })
            this.$router.push('/questionnaire/header')
          } else {
            this.$message.error('表头添加失败')
          }
        })
      })
    },
    changeImage(url) {
      this.form.imageUrl = url
    }
  }
}
</script>
