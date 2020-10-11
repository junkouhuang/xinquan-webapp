<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>学员管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改学员信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="student" :rules="rules" ref="ruleForm" label-width="110px">
        <el-form-item label="所属机构" required>
          {{ student.orgName }}
        </el-form-item>

        <div class="panel-area-line"><span class="title">学员信息</span></div>

        <el-form-item label="学员编号" required>
          {{ student.studentCode }}
        </el-form-item>
        <el-form-item label="学员姓氏" prop="surname">
          <el-input v-model="student.surname" placeholder="输入学员姓氏"></el-input>
        </el-form-item>
        <el-form-item label="学员名字" prop="realName">
          <el-input v-model="student.realName" placeholder="输入学员名字"></el-input>
        </el-form-item>
        <el-form-item label="学员英文名" prop="studentDisplayName">
          <el-input v-model="student.studentDisplayName" placeholder="输入学员英文名"></el-input>
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

        <el-form-item label="监护人手机">
          {{ student.phoneNumber }}
        </el-form-item>
        <el-form-item label="亲属关系" prop="relation">
          <el-select v-model="student.relation" placeholder="请选择亲属关系" style="width: 100%">
            <el-option label="爸爸" value="爸爸"></el-option>
            <el-option label="妈妈" value="妈妈"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监护人真实姓名">
          <el-input v-model="student.parentName" placeholder="输入监护人的真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="监护人身份证">
          <el-input v-model="student.parentIdentityNumber" placeholder="输入监护人的身份证号码"></el-input>
        </el-form-item>

        <div class="panel-area-line"><span class="title">其它信息</span></div>

        <el-form-item label="总课时数" required>
          {{ student.totalClassHour || 0 }}课时（线下{{ student.totalUnderHours || 0 }}课时+线上{{ student.totalOnHours || 0 }}课时）
        </el-form-item>
        <el-form-item label="已消耗课时数" required>
          {{ student.totalClassHourPass || 0 }}课时（线下{{ student.totalHourPassOff || 0 }}课时+线上{{ student.totalHourPassOn || 0 }}课时）
        </el-form-item>
        <el-form-item label="创建时间" required>
          {{ student.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
        </el-form-item>
        <el-form-item label="账号状态" required>
          {{ student.state == 1 ? '正常' : '停用' }}
        </el-form-item>

        <el-form-item>
          <el-button type="green" @click="handleSubmit">确认修改</el-button>
          <el-button @click="$router.push({path: '/student/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <span style="display: inline-block;margin-top: 12px">关联课程包列表</span>
        <div class="pull-right">
          <el-button type="blue" @click="$router.push({path: `/student/course-package/${$route.params.id}`})">关联课程包</el-button>
        </div>
      </div>

      <el-table
        :data="relationPackage.list"
        sortable
        style="width: 100%">
        <el-table-column
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          prop="coursePackageName"
          sortable
          label="课程包名称">
        </el-table-column>
        <el-table-column
          prop="totalHours"
          sortable
          label="总课时数">
        </el-table-column>
        <el-table-column
          prop="classId"
          sortable
          label="所在班级">
        </el-table-column>
        <el-table-column
          prop="startDate"
          sortable
          label="开班日期">
        </el-table-column>
        <el-table-column
          prop="restHours"
          sortable
          label="剩余课时数">
        </el-table-column>
        <el-table-column
          prop="remedialHour"
          sortable
          label="需补课时数">
        </el-table-column>
        <el-table-column
          prop="syncStatus"
          sortable
          label="同步状态">
          <template slot-scope="scope">
            <span v-if="scope.row.syncStatus == 1" class="label label-success">已同步</span>
            <span v-else class="label label-warning">未同步</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.status != 1" effect="dark" content="停用" placement="top">
              <el-button class="reset-icon" @click="handleStopPackage(scope.row)" type="text">
                <i class="iconfont">&#xe626;</i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { studentDetail, updateStudent, stuCoursePackage, stopStudentPackage, checkEblocksCodeExists } from '@/api/student'
export default {
  data() {
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
        let exceptStudentId = parseInt(this.$route.params.id)
        checkEblocksCodeExists({ tag: value, exceptStudentId }).then(res => {
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
        state: 1
      },
      relationPackage: [],
      rules: {
        surname: [
          { required: true, message: '请输入学员姓氏', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入学员名字', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        studentDisplayName: [
          { required: true, validator: validateDisplayName, trigger: 'blur' }
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
  created() {
    this.loadStuDetail()
    this.loadStuPackage()
  },
  methods: {
    loadStuDetail() {
      // 学员详情
      let id = parseInt(this.$route.params.id)
      studentDetail(id).then(res => {
        this.student = res.data
      })
    },
    loadStuPackage() {
      // 关联的课程包
      let id = parseInt(this.$route.params.id)
      stuCoursePackage({ studentId: id, pageNum: 1, pageSize: 200 }).then(res => {
        this.relationPackage = res.data
      })
    },
    handleSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        updateStudent(this.student).then(res => {
          if(res.returnMsg == 'success') {
            this.$confirm('是否继续关联课程包？', '学员修改成功', {
              confirmButtonText: '现在去关联',
              cancelButtonText: '稍后关联',
              type: 'warning',
              showClose: false,
              closeOnClickModal: false
            }).then(() => {
              this.$router.push({path: `/student/course-package/${this.$route.params.id}`})
            }).catch(() => {
              this.$router.push({path: '/student'})
            })
          } else if (res.returnCode == 'ERR_0029') {
            this.$message.error('易贝乐学号已存在')
          } else {
            this.$message.error('学员修改失败')
          }
        })
      })
    },
    handleStopPackage(row) {
      this.$confirm(`是否确定停用该课程包？（${row.coursePackageName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false
      }).then(() => {
        stopStudentPackage(row.id).then(res => {
          if (res.returnMsg == 'success') {
            this.$message({
              message: '课程包停用成功',
              type: 'success'
            })
            this.loadStuDetail()
            this.loadStuPackage()
          } else {
            this.$message.error('课程包停用失败')
          }
        })
      }).catch(() => {})
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
