<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>审核管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级审核</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form label-width="85px" style="max-width: 600px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属机构：">
              {{ audit.itemObj1 }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请类型：">
              {{ audit.auditTable == 1 ? '申请开班' : '其它' }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请日期：">
              {{ audit.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="申请详情：">
          <el-form-item label="课程包">
            {{ audit.itemContent.packageName }}
          </el-form-item>
          <el-form-item label="班主任">
            {{ audit.itemContent.accountName }}
          </el-form-item>
          <el-form-item label="开班日期">
            {{ audit.itemContent.startDate | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </el-form-item>
          <el-form-item label="上课频率">
            {{ audit.itemContent.list.length }}次/周，{{ classCount }}课时/周
            <div v-for="(item, index) in audit.itemContent.list" :key="index">
              {{ item.type == 'A' ? '线下：': '线上：' }} {{ item.weekDay | weekDay }} {{ item.startTime }}
            </div>
          </el-form-item>
        </el-form-item>
        <el-form-item v-if="isAudit" label="操作理由：">
          <el-input v-model="auditRemark" type="textarea"></el-input>
        </el-form-item>

        <el-form-item v-if="isAudit">
          <el-button type="green" @click="passAudit">通过</el-button>
          <el-button type="yellow" @click="failedAudit">不通过</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button @click="$router.push({path: '/class/audit/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { auditDetail, passAudit, failedAudit } from '@/api/audit'
export default {
  data() {
    return {
      audit: {
        itemContent: {
          list: {}
        }
      },
      isAudit: false,
      classCount: 0,
      auditRemark: ''
    }
  },
  filters: {
    weekDay: function(val) {
      switch(val) {
        case 1:
          return '周一'
        case 2:
          return '周二'
        case 3:
          return '周三'
        case 4:
          return '周四'
        case 5:
          return '周五'
        case 6:
          return '周六'
        case 7:
          return '周日'
      }
    }
  },
  created() {
    if (this.$route.query.audit) {
      this.isAudit = true
    }
    // 审核详情
    auditDetail(this.$route.params.id).then(res => {
      this.audit = res.data
      this.audit.itemContent = JSON.parse(this.audit.itemContent)

      // console.log(this.audit.itemContent.list)
      // 计算课时数
      let classCount = 0
      if (this.audit.itemContent.list) {
        this.audit.itemContent.list.forEach(ele => {
          classCount += ele.type == 'A' ? 2 : 1
        })
      }
      this.classCount = classCount
    })
  },
  methods: {
    passAudit() {
      passAudit({
        id: this.audit.id,
        itemId: this.audit.itemId,
        auditTable: this.audit.auditTable,
        auditRemark: this.auditRemark
      }).then(res => {
        if(res.returnMsg == 'success') {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push({ path: '/class/audit/index' })
        } else if(res.returnCode == 'ERR_0014') {
          this.$message.error(res.returnMsg)
        } else {
          this.$message.error('提交失败')
        }
      })
    },
    failedAudit() {
      failedAudit({
        id: this.audit.id,
        itemId: this.audit.itemId,
        auditTable: this.audit.auditTable,
        auditRemark: this.auditRemark
      }).then(res => {
        if(res.returnMsg == 'success') {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push({ path: '/class/audit/index' })
        } else {
          this.$message.error('提交失败')
        }
      })
    }
  }
}
</script>
