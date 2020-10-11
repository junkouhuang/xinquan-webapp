<template>
  <div>
    <!--<el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>-->

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px" style="max-width: 600px">
        <el-form-item>
          <upload-avatar :imageUrl="form.imageUrl" @changeImage="changeImage"></upload-avatar>
          <div class="el-upload__tip" style="margin-top: -10px;color: #909399">只能上传jpg/png文件，且不超过500kb</div>
        </el-form-item>
        <el-form-item label="账号名">
          <el-input v-model="form.accountName" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input placeholder="输入您的真实姓名" v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input placeholder="输入您的昵称" v-model="form.displayName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input placeholder="输入您的邮箱地址" v-model="form.mail"></el-input>
        </el-form-item>
        <el-form-item label="所属机构" v-if="form.type == 1">
          <div style="color: #909399">{{ form.organizationName }}</div>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import account from '@/api/account'
import uploadAvatar from '@/components/upload/single-image'
export default {
  components: {
    'upload-avatar': uploadAvatar
  },
  data() {
    // 验证手机号
    let validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号码'))
      } else if(!this.validate.phone(value)) {
        return callback(new Error('请输入正确的手机号'))
      }
      // 判断手机号是否修改
      if (this.phoneNumber == value) {
        return callback()
      }
      // 检查手机号码是否存在
      account.phoneRequest({ name: value }).then(res => {
        if (res) {
          // 手机号码已存在
          return callback(new Error('手机号码已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      phoneNumber: '',
      form: {
        imageUrl: '',
        phoneNumber: ''
      },
      rules: {
        phoneNumber: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    '$store.state.account.accountName': function(name) {
      this.loadAccountProfile(name)
    }
  },
  created() {
    let accountName = this.$store.state.account.accountName
    accountName && this.loadAccountProfile(accountName)
  },
  methods: {
    loadAccountProfile(name) {
      account.detailRequest({ accountName: name }).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.form = res.data
          this.phoneNumber = res.data.phoneNumber
        }
      })
    },
    handleSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        account.updateRequest(this.form).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '个人信息修改成功',
              type: 'success'
            })
            // 如果个人头像修改，更改顶部头像显示
            let account = this.$store.state.account
            if (account.imageUrl != this.form.imageUrl) {
              account.imageUrl = this.form.imageUrl
              this.$store.commit('setAccountInfo', account)
            }
          } else {
            this.$message.error('个人信息修改失败')
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
