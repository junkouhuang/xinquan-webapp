<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>中心管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改中心</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="centerForm" label-width="85px" style="max-width: 600px">
        <el-form-item label="中心名称" prop="centerName">
          <el-input v-model="form.centerName" placeholder="输入中心名称"></el-input>
        </el-form-item>
        <el-form-item label="中心位置" prop="cityName">
          <select-city :province="form.provinceName" :city="form.cityName" @change="changeSelectCity" />
        </el-form-item>
        <el-form-item label="中心地址" prop="address">
          <el-input v-model="form.address" type="textarea" placeholder="输入中心地址"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="地理位置" prop="latLng">
          经度：<el-input v-model="form.longitude" placeholder="输入经度" style="width: 120px"></el-input> &nbsp; 纬度：<el-input v-model="form.latitude" placeholder="输入纬度" style="width: 120px"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/center/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getCenterDetail, updateCenter } from '@/api/center'
import selectCity from '@/components/common/select-city'
export default {
  components: {
    selectCity
  },
  data() {
    const validateAddress = (rule, value, callback) => {
      if (!this.form.cityName) {
        return callback(new Error('请选择中心位置'))
      }
      callback()
    }
    const validateLatLng = (rule, value, callback) => {
      if (!this.form.latitude || !this.form.longitude) {
        return callback(new Error('请输入经纬度'))
      }
      callback()
    }
    return {
      form: {},
      rules: {
        centerName: [
          { required: true, message: '请输入中心名称', trigger: 'blur' }
        ],
        cityName: [
          { required: true, validator: validateAddress, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入中心地址', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        latLng: [
          { required: true, validator: validateLatLng, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    getCenterDetail(this.$route.params.id).then(res => {
      if (res.returnMsg == 'success') this.form = res.data
    })
  },
  methods: {
    handleSubmit() {
      this.$refs['centerForm'].validate(valid => {
        if (!valid) return
        updateCenter(this.form).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '修改中心成功',
              type: 'success'
            })
            this.$router.push({path: '/center/index'})
          } else {
            this.$message.error('修改中心失败')
          }
        })
      })
    },
    changeSelectCity(arr) {
      this.form.provinceId = arr[0].id
      this.form.provinceName = arr[0].name
      this.form.cityId = arr[1].id
      this.form.cityName = arr[1].name
      this.form.cityPrefix = arr[1].en
    }
  }
}
</script>
