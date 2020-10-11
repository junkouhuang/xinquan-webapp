<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>学员管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加学员</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="student" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="所属机构" prop="organizationId">
          <select-org @change="changeOrg" style="width: 100%"></select-org>
        </el-form-item>

        <div class="panel-area-line"><span class="title">学员信息</span></div>

        <el-form-item label="学员姓氏" prop="surname">
          <el-input v-model="student.surname" placeholder="输入学员姓氏"></el-input>
        </el-form-item>
        <el-form-item label="学员名字" prop="realName">
          <el-input v-model="student.realName" placeholder="输入学员名字"></el-input>
        </el-form-item>
        <el-form-item label="学员英文名" prop="displayName">
          <el-input v-model="student.displayName" placeholder="输入学员英文名"></el-input>
        </el-form-item>
        <el-form-item label="学员生日" prop="birthday">
          <el-date-picker
            v-model="student.birthday"
            type="date"
            :picker-options="pickerBeginDateBefore"
            placeholder="请选择日期"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="student.sex" :label="1">男孩</el-radio>
          <el-radio v-model="student.sex" :label="2">女孩</el-radio>
        </el-form-item>
        <el-form-item label="易贝乐学号" prop="tag">
          <el-input v-model="student.tag" placeholder="输入易贝乐学号"></el-input>
        </el-form-item>

        <div class="panel-area-line"><span class="title">监护人信息</span></div>

        <el-form-item label="监护人手机" prop="parentPhoneNumber">
          <el-input v-model="student.parentPhoneNumber" maxlength="11" placeholder="输入监护人的手机号码"></el-input>
        </el-form-item>
        <el-form-item label="亲属关系" prop="relation">
          <el-select v-model="student.relation" placeholder="请选择亲属关系" style="width: 100%">
            <el-option label="爸爸" value="爸爸"></el-option>
            <el-option label="妈妈" value="妈妈"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监护人真实姓名">
          <el-input v-model="student.parentRealName" placeholder="输入监护人的真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="监护人身份证">
          <el-input v-model="student.parentIdentityNumber" placeholder="输入监护人的身份证号码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/student/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import selectOrg from '@/components/common/select-org'
import { addStudent, checkEblocksCodeExists } from '@/api/student'
export default {
  components: {
    'select-org': selectOrg
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号码"))
      }else if(!this.validate.phone(value)) {
        return callback(new Error("请输入正确的手机号"))
      }
      callback()
    }
    const validateDisplayName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入学员英文名'))
      } else if (!this.validate.english(value)) {
        return callback(new Error('请输入正确的英文名'))
      }
      callback()
    }
    const validateEblocksCode = (rule, value, callback) => {
      if (value) {
        checkEblocksCodeExists({ tag: value }).then(res => {
          if (res.data) {
            return callback(new Error('易贝乐学号已存在'))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    return {
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > (Date.now())
        }
      },
      student: {
        organizationId: '',
        state: 1
      },
      rules: {
        organizationId: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ],
        surname: [
          { required: true, message: '请输入学员姓氏', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入学员名字', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        displayName: [
          { required: true, validator: validateDisplayName, trigger: 'blur' }
        ],
        parentPhoneNumber: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        relation: [
          { required: true, message: '请选择亲属关系', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请选择学员的生日', trigger: 'blur' }
        ],
        tag: [
          { validator: validateEblocksCode, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    changeOrg(val) {
      this.student.organizationId = val
    },
    addStudentHandler(studentInfo) {
      addStudent(studentInfo).then(res => {
        if (res.returnCode == 'ERR_0000') {
          let id = res.data
          this.$confirm('是否继续关联课程包？', '学员添加成功', {
            confirmButtonText: '现在去关联',
            cancelButtonText: '稍后关联',
            type: 'warning',
            showClose: false,
            closeOnClickModal: false
          }).then(() => {
            this.$router.push({path: `/student/course-package/${id}`})
          }).catch(() => {
            this.$router.push({path: '/student'})
          })
        } else if (res.returnCode == '40000028') {
          this.$confirm('家长在机构下已经存在同名学生，是否继续创建？', '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '不创建',
            type: 'warning',
            showClose: false,
            closeOnClickModal: false
          }).then(() => {
            studentInfo.createFlag = 0
            this.addStudentHandler(studentInfo)
          }).catch(() => {
          })
        } else if(res.returnCode == 'ERR_0029') {
          this.$message.error('易贝乐学号已存在')
        } else {
          this.$message.error('学员添加失败')
        }
      })
    },
    handleSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        this.addStudentHandler(this.student)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  max-width: 600px;
}
.panel-area-line {
  margin-bottom: 22px;
  line-height: 24px;
  height: 24px;
  &::after {
    content: '';
    display: block;
    margin-top: -12px;
    height: 1px;
    background: #eee;
    background: linear-gradient(90deg, #eee, #fff)
  }
  .title {
    margin-left: 10px;
    padding: 0 10px;
    background: #fff;
    color: #b9b9b9;
  }
}
</style>
