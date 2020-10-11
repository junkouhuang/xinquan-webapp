<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="ruleForm" :rules="rules" ref="accountForm" label-width="85px" style="max-width: 600px">
        <el-form-item label="账号名" required>{{ ruleForm.accountName }}</el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input placeholder="输入手机号码" maxlength="11" v-model="ruleForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input placeholder="输入账号昵称" maxlength="16" v-model="ruleForm.displayName"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input  placeholder="输入账号使用人的真实姓名" v-model="ruleForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input placeholder="请输入邮箱" maxlength="30" v-model="ruleForm.mail"></el-input>
        </el-form-item>

        <el-form-item label="所属部门" prop="departmentId">
          <el-select v-model="ruleForm.departmentId" placeholder="请选择部门">
            <el-option v-for="(item, index) in departmentList" :key="index" :label="item.departmentName" :value="item.departmentId"></el-option>
          </el-select>
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
        <el-form-item label="账号类别" prop="type">
          <el-radio v-model="ruleForm.type" :label="0">系统</el-radio>
          <el-radio v-model="ruleForm.type" :label="1">机构</el-radio>
        </el-form-item>
        <el-form-item v-if="ruleForm.type != 0" label="所属机构" prop="organizationId">
          <el-select placeholder="请选择所属机构" v-model="ruleForm.organizationId">
            <el-option
              v-for="item in orgOptions"
              :key="item.id"
              :label="item.displayName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" @click="submit">保存提交</el-button>
          <el-button @click="$router.push({path: '/system/account'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import account from "@/api/account";
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
      if (value && !this.validate.email(value)) {
        return callback(new Error('请输入正确的邮箱格式'))
      }
      callback()
    }
    return {
      organizationId: '',
      ruleForm: {
        phoneNumber: '',
        state: 1,
        type: 0,
        organizationId: ''
      },
      rules: {
        phoneNumber: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        state: [
          { required: true, message: "请选择状态", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择账号类别", trigger: "blur" }
        ],
        organizationId: [
          { required: true, message: "请选择所属机构", trigger: "blur" }
        ],
        mail: [
          { validator: validateEmail, trigger: 'blur' }
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
    'ruleForm.type': function(val) {
      if (val === 0) {
        this.ruleForm.organizationId = 0
      } else {
        if (this.organizationId == 0) {
          this.ruleForm.organizationId = ''
        } else {
          this.ruleForm.organizationId = this.organizationId
        }
      }
    }
  },
  created(){
    this.orgList()
    this.detailRequest()

    // 获取部门列表
    account.getDepartmentList().then(res => {
      if (res.returnCode == 'ERR_0000') {
        this.departmentList = res.data
      }
    })
  },
  methods: {
     // 机构列表
    orgList(){
      account.queryOrgRequest({
        pageNum: 1,
        pageSize: 200
      }).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.orgOptions = res.data
        }
      })
    },
    //查询账号详情
    detailRequest() {
      account.detailRequest({'accountName':this.$route.params.id}).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.ruleForm = res.data
          this.organizationId = res.data.organizationId
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
            this.$router.push({path: '/system/account'})
          } else {
            this.$message({
              message: '账号修改失败',
              type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            message: '账号修改失败',
            type: 'error'
          })
        })
      })
    }
  }
};
</script>
