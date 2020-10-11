<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" style="max-width: 600px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="角色Key" prop="roleKey">
          <el-input v-model="form.roleKey" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-radio v-model="form.enable" :label="true">是</el-radio>
          <el-radio v-model="form.enable" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" rows="3" v-model="form.description" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" v-has="'res_roles_add'" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/system/roles'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { addRole, checkRoleIsExist,typeMenu } from '@/api/system/roles'
export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入角色名称'))
      }
      checkRoleIsExist({
        name: value,
        roleKey: ''
      }).then(res => {
        if (res.data) {
          callback(new Error('角色名称已存在'))
        } else {
          callback()
        }
      })
    }
    const validateKey = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入角色Key'))
      }
      checkRoleIsExist({
        name: '',
        roleKey: value
      }).then(res => {
        if (res.data) {
          callback(new Error('角色Key已存在'))
        } else {
         callback()
        }
      })
    }
    return {
      form: {
        name: '',
        roleKey: '',
        enable: true,
        description: ''
      },
      rules: {
        name: [
          { required: true, validator: validateName, trigger: 'change' }
        ],
        roleKey: [
          { required: true, validator: validateKey, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    typeQuery(){
      this.typeMenu().then(res =>{
        console.log(res);
      })
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) return
        addRole(this.form).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '角色添加成功',
              type: 'success'
            })
            this.$router.push('/system/roles')
          } else {
            this.$message.error('角色添加失败')
          }
        })
      })
    }
  }
}
</script>
