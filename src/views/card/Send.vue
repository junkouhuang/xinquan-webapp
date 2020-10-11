<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>卡券管理</el-breadcrumb-item>
      <el-breadcrumb-item>发送卡券</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="sendForm" label-width="80px" style="max-width: 600px">
        <el-form-item label="选择机构" prop="organizationId">
          <select-org @change="changeOrganizationHandler" />
        </el-form-item>
        <el-form-item label="选择卡券" prop="couponParentId">
          <el-select v-model="form.couponParentId" placeholder="请选择卡券" :no-data-text="form.organizationId ? '机构暂无卡券' : '请选择机构'" style="width: 100%" filterable>
            <el-option v-for="(item, index) in cardList" :key="index" :label="item.cardName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumberList">
          <el-input v-model="phoneNumberList" type="textarea" rows="5" placeholder="手机号码清单，每行一个号码，每次最多100个"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/card/list'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getOrgCardList, sendCoupon } from '@/api/card'
import selectOrg from '@/components/common/select-org'
export default {
  components: {
    selectOrg
  },
  data() {
    const validatePhoneList = (rule, value, callback) => {
      if (!this.form.phoneNumberList) {
        return callback(new Error('请输入手机号码'))
      } else {
        let phoneList = this.form.phoneNumberList
        phoneList.forEach(item => {
          if (!this.validate.phone(item.trim())) {
            return callback(new Error('请输入正确的手机号码'))
          }
        })
      }
      callback()
    }
    return {
      form: {
        organizationId: '',
        couponParentId: ''
      },
      cardList: [],
      phoneNumberList: '',
      rules: {
        organizationId: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ],
        couponParentId: [
          { required: true, message: '请选择卡券', trigger: 'blur' }
        ],
        phoneNumberList: [
          { required: true, validator: validatePhoneList, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    phoneNumberList: function(val) {
      this.form.phoneNumberList = val.split('\n')
    }
  },
  // created() {
  //   getCardList({pageSize: 200, pageNum: 1}).then(res => {
  //     this.cardList = res.data.list
  //   })
  // },
  methods: {
    handleSubmit() {
      this.$refs['sendForm'].validate(valid => {
        if (!valid) return
        sendCoupon(this.form).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '卡券发送成功',
              type: 'success'
            })
            this.$router.push({path: '/card/list'})
          } else if (res.returnCode == 'ERR_0006') {
            this.$message.error('未给该机构分配卡券')
          } else if (res.returnCode == '40000080') {
            this.$message.error('卡券总数量不足，请重新设置数量')
          } else if (res.returnCode == '40000077') {
            this.$message.error('卡券已经过期')
          } else {
            this.$message.error('卡券发送失败')
          }
        })
      })
    },
    changeOrganizationHandler(id) {
      this.form.organizationId = id
      this.form.couponParentId = ''
      // 查询机构可使用的卡券
      getOrgCardList(id).then(res => {
        if (res.returnMsg == 'success') this.cardList = res.data
      })
    }
  }
}
</script>

