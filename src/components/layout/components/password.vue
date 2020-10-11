<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogFormVisible"
    width="500px"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      style="max-width: 600px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" class="input-password" :type="passVisible1 ? 'text' : 'password'" placeholder="输入您的旧密码" @keyup.enter.native="handleSubmit">
          <el-button slot="append" icon="el-icon-view" title="查看密码" :class="{'active' : passVisible1}" @click="passVisible1 = !passVisible1"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" class="input-password" :type="passVisible2 ? 'text' : 'password'" placeholder="输入您的新密码" @keyup.enter.native="handleSubmit">
          <el-button slot="append" icon="el-icon-view" title="查看密码" :class="{'active' : passVisible2}" @click="passVisible2 = !passVisible2"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassword">
        <el-input v-model="form.rePassword" class="input-password" :type="passVisible3 ? 'text' : 'password'" placeholder="确认您的新密码" @keyup.enter.native="handleSubmit">
          <el-button slot="append" icon="el-icon-view" title="查看密码" :class="{'active' : passVisible3}" @click="passVisible3 = !passVisible3"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import account from '@/api/account'
export default {
  data() {
    const validateNewPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入您的新密码'))
      } else if(!this.validate.password(value)) {
        return callback(new Error('密码必须同时包含数字和字母，长度为6-16位'))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请确认您的新密码'))
      } else if (value != this.form.password) {
        return callback(new Error('两次密码输入不一致'))
      }
      callback()
    }
    return {
      // dialogFormVisible: this.$store.state.firstLogin,
      form: {},
      rules: {
        oldPassword: [
          { required: true, message: '请输入您的旧密码', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validateNewPass, trigger: 'blur' }
        ],
        rePassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      },
      passVisible1: false,
      passVisible2: false,
      passVisible3: false
    }
  },
  computed: {
    dialogFormVisible () {
      return this.$store.state.firstLogin
    }
  },
  methods: {
    handleSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        account.pwdRequest(this.form).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '密码修改成功，请重新登录',
              type: 'success'
            })
            // this.$refs['ruleForm'].resetFields()
            this.cookie.remove('access_token')
            this.$router.push('/login')
          } else {
            this.$message.error('密码修改失败')
          }
        }).catch(err => {
          // ERR_0004 参数为空
          // ERR_0024 原密码错误
          // ERR_0025 新密码与原密码相同
          let code = err.response.data.returnCode
          if (code === 'ERR_0004') {
            this.$message.error('参数为空')
          }else if (code == 'ERR_0012'){
            this.$message.error('新密码与原密码相同')
          } else if (code === 'ERR_0024') {
            this.$message.error('原密码错误')
          } else {
            this.$message.error('密码修改失败')
          }
        })
      })
    },
    handleCancel() {
      // this.dialogFormVisible = false
      this.$store.commit('changeFirstLogin', false)
    }
  }
}
</script>
