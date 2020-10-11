<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" style="max-width: 600px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="角色Key" prop="roleKey">
          <el-input v-model="form.roleKey" disabled="" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-radio v-model="form.enable" :label="true">是</el-radio>
          <el-radio v-model="form.enable" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" rows="3" v-model="form.description" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" v-has="'res_org_roles_edit'" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/organization/roles'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getRole, updateRole, checkRoleIsExist } from '@/api/org/system/roles'
export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入角色名称'))
      }
      checkRoleIsExist({
        exceptId: this.$route.params.id,
        name: value
      }).then(res => {
        if (res.data) {
          callback()
        } else {
          callback(new Error('角色名称已存在'))
        }
      })
    }
    const validateKey = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入角色Key'))
      }
      checkRoleIsExist({
        exceptId: this.$route.params.id,
        roleKey: value
      }).then(res => {
        if (res.data) {
          callback()
        } else {
          callback(new Error('角色Key已存在'))
        }
      })
    }
    return {
      form: {},
      rules: {
        // name: [
        //   { required: true, validator: validateName, trigger: 'change' }
        // ],
        // roleKey: [
        //   { required: true, validator: validateKey, trigger: 'change' }
        // ]
        name: [
          { required: true, message: '请输入角色名称', trigger: 'change' }
        ],
        roleKey: [
          { required: true, message: '请输入角色Key', trigger: 'change' }
        ],
        enable: [
          { required: true, message: '请选择启用状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    getRole(this.$route.params.id).then(res => {
      if (res.returnCode == 'ERR_0000') {
        this.form = res.data
      }
    })
  },
  methods: {
    validateName(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入角色名称'))
      }
      checkRoleIsExist({
        exceptId: this.$route.params.id,
        name: value
      }).then(res => {
        if (res.data) {
          callback(new Error('角色名称已存在'))
        } else {
          callback()
        }
      })
    },
    handleSubmit() {
      this.rules.name = [
        { required: true, validator: this.validateName, trigger: 'change' }
      ]
      this.$refs['form'].validate(valid => {
        if (!valid) return
        updateRole(this.form).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '角色更新成功',
              type: 'success'
            })
            this.$router.push('/organization/roles')
          } else {
            this.$message.error('角色更新失败')
          }
        })
      })
    }
  }
}
</script>
