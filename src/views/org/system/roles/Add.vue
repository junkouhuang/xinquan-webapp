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
        <el-form-item label="所属机构" prop="orgId">
          <el-select placeholder="请选择所属机构" v-model="form.orgId" filterable >
            <el-option
              v-for="item in orgOptions"
              :key="item.enterpriseId"
              :label="item.enterpriseName"
              :value="item.enterpriseId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" rows="3" v-model="form.description" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" v-has="'res_org_roles_add'" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/organization/roles'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { addRole, checkRoleIsExist, typeMenu, queryOrgRequest } from '@/api/org/system/roles'
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
        description: '',
        orgId: ''
      },
      orgOptions: [] ,//机构列表
      rules: {
        name: [
          { required: true, validator: validateName, trigger: 'change' }
        ],
        roleKey: [
          { required: true, validator: validateKey, trigger: 'change' }
        ],
        orgId: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
      }
    }
  },
  created() {
    queryOrgRequest({
      pageNum: 1,
      pageSize: 100000
    }).then(res => {
      if(res.returnCode == 'ERR_0000'){
        this.orgOptions = res.data.list
      }
    })
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
            this.$router.push('/organization/roles')
          } else {
            this.$message.error('角色添加失败')
          }
        })
      })
    }
  }
}
</script>
