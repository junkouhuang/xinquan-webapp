<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>卡券管理</el-breadcrumb-item>
      <el-breadcrumb-item>卡券发布</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="releaseForm" label-width="80px" style="max-width: 600px">
        <el-form-item label="选择机构" prop="organizationId">
          <select-org @change="changeOrganizationHandler" style="width: 100%" />
        </el-form-item>
        <el-form-item label="选择卡券" prop="couponParentId">
          <el-select v-model="form.couponParentId" placeholder="请选择卡券" :no-data-text="form.organizationId ? '机构暂无卡券' : '请选择机构'" style="width: 100%">
            <el-option v-for="(item, index) in cardList" :key="index" :label="item.cardName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配数量" prop="cardDetailsNum">
          <el-input v-model="form.cardDetailsNum" placeholder="请输入正整数" style="width: 200px"></el-input> 张
        </el-form-item>
        <el-form-item>
          <el-button type="blue" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/card/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getCardList, releaseCoupon } from '@/api/card'
import selectOrg from '@/components/common/select-org'
export default {
  components: {
    selectOrg
  },
  data() {
    const validateCardNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入分配数量'))
      } else if (!this.validate.integer(value)) {
        return callback(new Error('请输入正整数'))
      }
      callback()
    }
    return {
      form: {
        organizationId: '',
        couponParentId: ''
      },
      cardList: [],
      rules: {
        organizationId: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ],
        couponParentId: [
          { required: true, message: '请选择卡券', trigger: 'blur' }
        ],
        cardDetailsNum: [
          { required: true, validator: validateCardNum, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    getCardList({pageSize: 200, pageNum: 1}).then(res => {
      if (res.returnMsg == 'success') this.cardList = res.data.list
    })
  },
  methods: {
    handleSubmit() {
      this.$refs['releaseForm'].validate(valid => {
        if (!valid) return
        releaseCoupon(this.form).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '卡券发布成功',
              type: 'success'
            })
            this.$router.push({path: '/card/index'})
          } else if (res.returnCode == 'ERR_0006') {
            this.$message.error('未给该机构分配卡券')
          } else if (res.returnCode == '40000079') {
            this.$message.error('卡券总数量不足，请重新设置数量')
          } else if (res.returnCode == '40000077') {
            this.$message.error('卡券已经过期')
          } else {
            this.$message.error('卡券发布失败')
          }
        })
      })
    },
    changeOrganizationHandler(id) {
      this.form.organizationId = id
    }
  }
}
</script>
