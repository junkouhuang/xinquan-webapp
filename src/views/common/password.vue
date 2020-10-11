<template>
  <div>
<!--    <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--      <el-breadcrumb-item>账号管理</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>修改密码</el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px" style="max-width: 600px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" :type="passVisible1 ? 'text' : 'password'" placeholder="输入您的旧密码" class="input-password" clearable>
            <el-button slot="append" icon="el-icon-view" title="查看密码" :class="{'active' : passVisible1}" @click="passVisible1 = !passVisible1"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="form.password" :type="passVisible2 ? 'text' : 'password'" placeholder="输入您的新密码" class="input-password" clearable>
            <el-button slot="append" icon="el-icon-view" title="查看密码" :class="{'active' : passVisible2}" @click="passVisible2 = !passVisible2"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input v-model="form.rePassword" :type="passVisible3 ? 'text' : 'password'" placeholder="确认您的新密码" class="input-password" clearable>
            <el-button slot="append" icon="el-icon-view" title="查看密码" :class="{'active' : passVisible3}" @click="passVisible3 = !passVisible3"></el-button>
          </el-input>
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
export default {
  data() {
    const validateNewPass = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('请输入您的新密码'))
      } else if(!this.validate.password(value)) {
        return callback(new Error('密码必须同时包含数字和字母，长度为6-16位'))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('请确认您的新密码'))
      } else if (value != this.form.password) {
        return callback(new Error('两次密码输入不一致'))
      }else if(value == this.form.oldPassword){
        return callback(new Error('新密码不能与原始密码相同'))
      }
      callback()
    }
    return {
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
  methods: {
    handleSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        account.pwdRequest(this.form).then(res => {
          if (res.returnMsg == 'success') {
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
          } else if (code === 'ERR_0024') {
            this.$message.error('原密码错误')
          } else if (code === 'ERR_0025') {
            this.$message.error('新密码与原密码相同')
          } else {
            this.$message.error('密码修改失败')
          }
        })
      })
    }
  }
}
</script>
