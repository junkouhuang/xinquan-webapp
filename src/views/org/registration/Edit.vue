<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构报名信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="orgData" ref="orgForm" :rules="rules"  label-width="95px" style="max-width: 600px">
        <el-form-item label="机构名称" prop="organizationName">
          <el-input placeholder="请输入机构的名称" v-model="orgData.organizationName"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="orgData.contacts" placeholder="请输入机构联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系人职位" prop="position">
          <el-input v-model="orgData.position" placeholder="请输入联系人职位"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="orgData.phoneNumber" placeholder="请输入联系人手机号"></el-input>
        </el-form-item>
        <el-form-item label="学员规模" prop="studentsNumber">
          <el-select v-model="orgData.studentsNumber" placeholder="请选择学员规模" style="width: 100%">
            <el-option v-for="(item, index) in populationTypeList" :key="index" :label="item.name" :value="item.id + ''"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构类别" prop="organizationType">
          <el-select v-model="orgData.organizationType" placeholder="请选择机构类别" style="width: 100%">
            <el-option v-for="(item, index) in orgTypeList" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域" prop="region">
          <el-select v-model="orgData.region" placeholder="请选择区域" style="width: 100%">
            <el-option v-for="(item, index) in orgAreaList" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址信息" prop="area">
          <select-address :province="orgData.province" :city="orgData.city" :area="orgData.area" @change="changeAddressHandler"/>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="orgData.address" type="textarea" placeholder="输入机构详细地址"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱" prop="mailAddress">
          <el-input v-model="orgData.mailAddress" placeholder="输入联系邮箱"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/org/registration/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import selectAddress from '@/components/common/select-address.vue'
import { typeRequest, areaRequest } from '@/api/org'
import { registrationDetail, getPopulationTypes, addRegistration, updateRegistration } from '@/api/org/registration'
export default {
  components: {
    selectAddress
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入联系人手机号'))
      } else if (!this.validate.phone(value)) {
        return callback(new Error('手机号格式不正确'))
      }
      callback()
    }
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入邮箱地址'))
      } else if (!this.validate.email(value)) {
        return callback(new Error('邮箱格式不正确'))
      }
      callback()
    }
    return {
      orgData: {
        area: ''
      },
      orgTypeList: [],
      orgAreaList: [],
      populationTypeList: [],
      rules: {
        organizationName: [
          {required: true, message: '请输入机构名称', trigger: 'blur'}
        ],
        contacts: [
          {required: true, message: '请输入联系人', trigger: 'blur'}
        ],
        position: [
          {required: true, message: '请输入联系人职位', trigger: 'blur'}
        ],
        phoneNumber: [
          {required: true, validator: validatePhone, trigger: 'blur'}
        ],
        studentsNumber: [
          {required: true, message: '请选择学员规模', trigger: 'blur'}
        ],
        organizationType: [
          {required: true, message: '请选择机构类别', trigger: 'blur'}
        ],
        region: [
          {required: true, message: '请选择机构所属区域', trigger: 'blur'}
        ],
        area: [
          {required: true, message: '请选择地址信息', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入机构详细地址', trigger: 'blur'}
        ],
        mailAddress: [
          {required: true, validator: validateEmail, trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    // 机构类别
    typeRequest().then(res => {
      this.orgTypeList = res.data
    })
    // 机构区域
    areaRequest().then(res => {
      this.orgAreaList = res.data
    })
    // 人员规模
    getPopulationTypes().then(res => {
      this.populationTypeList = res.data
    })
    let id = this.$route.params.id
    // 机构详情
    if (id) {
      registrationDetail(id).then(res => {
        this.orgData = res.data
      })
    }
  },
  methods: {
    handleSubmit() {
      console.log(this.orgData)
      this.$refs['orgForm'].validate(valid => {
        if (!valid) return
        if (this.$route.params.id) {
          updateRegistration(this.orgData).then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '机构报名信息修改成功',
                type: 'success'
              })
              this.$router.push({path: '/org/registration/index'})
            } else {
              this.$message.error('机构报名信息修改失败')
            }
          })
        } else {
          addRegistration(this.orgData).then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '机构报名信息添加成功',
                type: 'success'
              })
              this.$router.push({path: '/org/registration/index'})
            } else {
              this.$message.error('机构报名信息添加失败')
            }
          })
        }
      })
    },
    changeAddressHandler(arr) {
      this.orgData.province = arr[0]
      this.orgData.city = arr[1]
      this.orgData.area = arr[2]
    }
  }
}
</script>
