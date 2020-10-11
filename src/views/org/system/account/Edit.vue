<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="ruleForm" :rules="rules" ref="accountForm" label-width="85px" style="max-width: 600px">
        <el-form-item label="账号名" required>
          {{ ruleForm.accountName }}
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input placeholder="输入手机号码" maxlength="11" v-model="ruleForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="displayName">
          <el-input placeholder="输入账号昵称" maxlength="16" v-model="ruleForm.displayName"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input  placeholder="输入账号使用人的真实姓名" v-model="ruleForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input placeholder="请输入邮箱" maxlength="30" v-model="ruleForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <template v-if="ruleForm.state == 2">
            <span class="label label-warning">锁定</span>
          </template>
          <template v-else>
            <el-radio v-model="ruleForm.state" :label="1">启用</el-radio>
            <el-radio v-model="ruleForm.state" :label="0">禁用</el-radio>
          </template>
        </el-form-item>
        <el-form-item v-if="ruleForm.type != 0" label="所属机构" prop="organizationId">
          <el-select placeholder="请选择所属机构" v-model="ruleForm.organizationId" @change="selectChange" filterable >
            <el-option
              v-for="item in orgOptions"
              :key="item.enterpriseId"
              :label="item.enterpriseName"
              :value="item.enterpriseId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属部门" prop="departmentId">
          <el-select v-model="ruleForm.departmentId" placeholder="请选择部门">
            <el-option v-for="(item, index) in departmentList" :key="index" :label="item.departmentName" :value="item.departmentId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" v-has="'res_org_account_edit'" @click="submit">保存提交</el-button>
          <el-button @click="$router.push({path: '/organization/account'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import account from "@/api/org/system/account";
export default {
  data() {
     let validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号码"))
      }else if(!this.validate.phone(value)) {
        return callback(new Error("请输入正确的手机号"))
      }
      callback();
    };
    let validateEmail = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入邮箱'))
      } else if (value && !this.validate.email(value)) {
        return callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    };
    return {
      ruleForm: {
        phoneNumber: '',
        state: 1,
        organizationId: '',
        departmentId: ''
      },
      rules: {
        phoneNumber: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        realName: [
          { required: true, message: "请输入账号使用人真实姓名", trigger: "blur" }
        ],
        state: [
          { required: true, message: "请选择状态", trigger: "blur" }
        ],
        organizationId: [
          { required: true, message: "请选择所属机构", trigger: "blur" }
        ],
        mail: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: "请选择所属部门", trigger: 'blur' }
        ]
      },
      departmentList: [], // 部门
      orgOptions: [], //机构列表
    }
  },
  watch: {

  },
  created(){
    this.orgList()
    this.detailRequest()
  },
  methods: {
    selectChange() {
      account.getDepartmentList(this.ruleForm.organizationId).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.departmentList = res.data
        }
      })
    },
    orgList(){
      account.queryOrgRequest({
        pageNum: 1,
        pageSize: 100000
      }).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.orgOptions = res.data.list
        }
      })
    },
    //查询账号详情
    detailRequest() {
      account.detailRequest({'accountName':this.$route.params.id}).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.ruleForm = res.data
          this.selectChange()
        }
      })
    },
     //确定重置密码
    // resetConfirm() {
    //   this.$confirm('是否确定重置为初始密码？(初始密码为88888888)', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     account.pwdResetRequest({'phoneNumber':this.ruleForm.phoneNumber})
    //       .then(res => {
    //         if(res.returnMsg == 'success') {
    //           this.$message({
    //             message: '密码重置成功',
    //             type: 'success'
    //           })
    //         }else{
    //            this.$message({
    //             message: res.returnMsg,
    //             type: 'error'
    //           })
    //         }
    //       })

    //   }).catch(() => {})
    // },
    // 提交
    submit() {
      this.$refs['accountForm'].validate(valid => {
        if (!valid) return
        account.updateRequest(this.ruleForm).then(res =>{
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '账号修改成功',
              type: 'success'
            })
            this.$router.push({path: '/organization/account'})
          } else {
            this.$message({
              message: '账号修改失败',
              type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            message: '您的权限级别不够，暂无法修改',
            type: 'error'
          })
          this.searchRequest()
        })
      })
    }
  }
};
</script>
