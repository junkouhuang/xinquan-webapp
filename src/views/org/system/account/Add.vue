<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="ruleForm" :rules="rules" ref="accountForm" label-width="100px" style="max-width: 600px">
        <el-form-item label="账号名"  prop="accountName">
          <el-input placeholder="输入账号名" maxlength="16" v-model="ruleForm.accountName" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input placeholder="输入手机号码" maxlength="11" v-model="ruleForm.phoneNumber" clearable></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="displayName">
          <el-input placeholder="输入账号昵称" maxlength="16" v-model="ruleForm.displayName" clearable></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input placeholder="输入账号使用人的真实姓名" v-model="ruleForm.realName" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input placeholder="请输入邮箱" maxlength="30" v-model="ruleForm.mail" clearable></el-input>
        </el-form-item>
        <el-form-item label="设置密码" prop="firstpassword">
          <el-input maxlength="16" placeholder="必须包含大小写字母、数字、符号，6-16位字符" v-model="ruleForm.firstpassword" :type="passVisible1 ? 'text' : 'password'" class="input-password" clearable>
            <el-button slot="append" icon="el-icon-view" title="查看密码" :class="{'active' : passVisible1}" @click="passVisible1 = !passVisible1"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="密码确认" prop="password">
          <el-input maxlength="16" placeholder="请再次输入你的密码" v-model="ruleForm.password" :type="passVisible2 ? 'text' : 'password'" class="input-password" clearable>
            <el-button slot="append" icon="el-icon-view" title="查看密码" :class="{'active' : passVisible2}" @click="passVisible2 = !passVisible2"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio v-model="ruleForm.state" :label="1">启用</el-radio>
          <el-radio v-model="ruleForm.state" :label="0">禁用</el-radio>
        </el-form-item>
        <el-form-item label="所属机构" prop="organizationId">
          <el-select placeholder="请选择所属机构" v-model="ruleForm.organizationId" @change="selectChange" filterable clearable>
            <el-option
              v-for="item in orgOptions"
              :key="item.enterpriseId"
              :label="item.enterpriseName"
              :value="item.enterpriseId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentId">
          <el-select v-model="ruleForm.departmentId" placeholder="请选择部门" clearable>
            <el-option
              v-for="(item, index) in departmentList"
              :key="index"
              :label="item.departmentName"
              :value="item.departmentId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" v-has="'res_org_account_add'" @click="submit">保存提交</el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import account from "@/api/org/system/account";
export default {
  data() {
    // 验证账户名
    let validateAccountName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入账号名"));
      } else if(!this.validate.account(value)) {
        return callback(new Error("账户名必须是大小写字母或数字，不能使用特殊字符，长度在8-20之间"));
      }
      account.checkAccountName(value).then(res => {
        if (res) {
          callback();
        } else {
          // 账号已存在
          return callback(new Error("账号名已存在"));
        }
      })
    };
    // 验证手机号
    let validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号码"));
      } else if(!this.validate.phone(value)) {
        return callback(new Error("请输入正确的手机号"));
      }
      // 检查手机号码是否存在
      account.phoneRequest({ name: value }).then(res => {
        if (res) {
          callback();
        } else {
          // 手机号码已存在
          return callback(new Error("手机号码已存在"));
        }
      });
    };
    // 验证密码
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if(!this.validate.password(value)) {
        callback(new Error('密码必须同时包含数字和字母，长度为6-16位'))
      } else {
        if (this.ruleForm.password !== '') {
          this.$refs.accountForm.validateField('password')
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.firstpassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    let validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'));
      } else if (value && !this.validate.email(value)) {
        return callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    };
    return {
      ruleForm: {
        firstpassword: '',
        password: '',
        state: 1,
        organizationId: '',
        departmentId: '',
        mail: '',
      },
      departmentList: [], // 部门
      orgOptions: [] ,//机构列表
      passVisible1: false,
      passVisible2: false,
      rules: {
        phoneNumber: [
          {required: true, validator: validatePhone, trigger: "blur" }
        ],
        accountName: [
          {required: true, validator: validateAccountName, trigger: "blur" }
        ],
        realName: [
          {required: true, message: "请输入账号使用人真实姓名", trigger: "blur" }
        ],
        firstpassword: [
          {required: true, validator: validatePass,trigger: "blur" }
        ],
        password: [
          {required: true, validator: validatePass2, trigger: "blur" }
        ],
        state: [
          {required: true, message: "请选择状态", trigger: "blur" }
        ],
        organizationId: [
          { required: true, message: "请选择所属机构", trigger: "change" }
        ],
        mail: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: "请选择所属部门", trigger: 'blur' }
        ]
      },
    };
  },
  watch: {

  },
  created(){
    this.orgList()
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
    // 提交
    submit() {
      this.$refs['accountForm'].validate(valid => {
        if (valid) {
          account.addRequest(this.ruleForm).then(res =>{
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '账号添加成功',
                type: 'success'
              })
              this.$router.push({path: '/organization/account'})
            }else{
               this.$message({
                message: '账号添加失败',
                type: 'error'
              })
            }
          })
        }
      });
    }
  }
};
</script>
