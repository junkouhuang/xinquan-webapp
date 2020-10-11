<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>问卷管理</el-breadcrumb-item>
      <el-breadcrumb-item>问题管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增问题</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" style="max-width: 600px">
        <el-form-item label="问题标题" prop="question">
          <el-input v-model="form.question" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="问题表头" prop="questionnaireTableId">
          <el-select v-model="form.questionnaireTableId" placeholder="请选择表头" style="width: 100%">
            <el-option v-for="(item, index) in tableHeaderList" :key="index" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题类型" prop="questionType">
          <el-radio v-model="form.questionType" :label="1">单选</el-radio>
          <el-radio v-model="form.questionType" :label="2">多选</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/questionnaire/topic'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getTableHeaderList, addTopic } from '@/api/questionnaire'
export default {
  data() {
    return {
      tableHeaderList: [],
      form: {},
      rules: {
        question: [
          { required: true, message: '请输入问题标题', trigger: 'blur' }
        ],
        questionnaireTableId: [
          { required: true, message: '请选择问题表头', trigger: 'blur' }
        ],
        questionType: [
          { required: true, message: '请选择问题类型', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 获取表头
    getTableHeaderList({
      pageNum: 1,
      pageSize: 100,
      title: '',
      content: '',
      state: ''
    }).then(res => {
      if (res.returnCode == 'ERR_0000') {
        this.tableHeaderList = res.data.list
      }
    })
  },
  methods: {
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) return
        addTopic(this.form).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '问题添加成功',
              type: 'success'
            })
            this.$router.push('/questionnaire/topic')
          } else {
            this.$message.error('问题添加失败')
          }
        })
      })
    }
  }
}
</script>
