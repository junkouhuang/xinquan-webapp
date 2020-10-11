<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增放课</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="90px" style="max-width: 600px">
        <el-form-item label="机构名称" prop="organizationId">
          <select-org @change="changeOrg" style="width: 100%"></select-org>
        </el-form-item>
        <el-form-item label="请假时段" prop="datetime">
          <el-date-picker
            v-model="form.datetime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm"
            :picker-options="pickerBeginDateBefore"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="放课类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择放课的类型" style="width: 100%">
            <el-option v-for="(item, index) in leaveTypes" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="放课理由">
          <el-input v-model="form.cause" type="textarea" rows="5" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <div style="color: #F56C6C">注意：放课操作会让后续课程同步顺延，导致结班日期延后，请慎重！</div>
        </el-form-item>
        
        <el-form-item>
          <el-button type="green" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/leave/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import selectOrg from '@/components/common/select-org'
import { getLeaveTypes, addLeave } from '@/api/leave'
export default {
  components: {
    'select-org': selectOrg
  },
  data() {
    return {
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - (24 * 60 * 60 * 1000))
        }
      },
      leaveTypes: [],
      form: {
        organizationId: '',
        datetime: [],
        startTime: '',
        endTime: '',
        cause: '',
        type: ''
      },
      rules: {
        organizationId: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择放课的类型', trigger: 'blur' }
        ],
        datetime: [
          { required: true, message: '请选择放课时段', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'form.datetime': function(val) {
      if (val.length >= 2) {
        let startTime = new Date(val[0])
        let endTime = new Date(val[1])
        this.form.startTime = startTime.getTime()
        this.form.endTime = endTime.getTime()
      }
    }
  },
  created() {
    getLeaveTypes().then(res => {
      this.leaveTypes = res.data
    })
  },
  methods: {
    changeOrg(val) {
      this.form.organizationId = val
    },
    handleSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        let startTime = this.form.startTime
        if (startTime < Date.now()) {
          this.$message.error('请假时段已过，请重新选择！')
          return
        }
        this.$confirm('您确定要创建放课申请？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          closeOnClickModal: false
        }).then(() => {
          addLeave(this.form).then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '放课添加成功',
                type: 'success'
              })
              this.$router.push({path: '/leave'})
            } else {
              this.$message.error('放课添加失败')
            }
          })
        }).catch(() => {})
      })
    }
  }
}
</script>
