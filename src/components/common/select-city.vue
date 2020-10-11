<template>
  <div style="overflow: hidden">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-select placeholder="请选择省" v-model="proValue" style="width: 100%">
          <el-option v-for="(item,index) in proOptions"
            :key="index"
            :label="item.provinceName"
            :value="item.provinceName">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-select placeholder="请选择市" v-model="cityValue" style="width: 100%">
          <el-option v-for="(item,index) in cityOptions"
            :key="index"
            :label="item.cityName"
            :value="item.cityName">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const COUNTRY_ID = 1 // 国家ID（1：中国）
import { provinceRequest, cityRequest } from '@/api/org'
export default {
  props: {
    province: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      proValue: '',
      cityValue: '',
      proOptions: [],
      cityOptions: []
    }
  },
  watch: {
    province: function(str) {
      if (this.proValue != str) this.proValue = str
    },
    city: function(str) {
      if (this.cityValue != str) {
        this.cityValue = str
        this.cityIndex = 1
      }
    },
    proValue: function(value) {
      this.cityIndex === 1 ? this.cityIndex = 0 : this.cityValue = ''
      this.cityOptions = []
      if (!value) return
      // 省份下的城市
      let province = this.proOptions.find(item => item.provinceName == value)
      if (!province) return
      cityRequest({country: COUNTRY_ID, province: province.id}).then(res => {
        this.cityOptions = res.data || []
      })
    },
    cityValue: function() {
      this.changeHandler()
    }
  },
  created() {
    // 所有省份
    provinceRequest(COUNTRY_ID).then(res => {
      this.proOptions = res.data
    })
  },
  methods: {
    changeHandler() {
      let province = this.proOptions.find(item => item.provinceName == this.proValue)
      let city = this.cityOptions.find(item => item.cityName == this.cityValue)
      if (province && city) {
        this.$emit('change', [
          { id: province.id, name: province.provinceName },
          { id: city.id, name: city.cityName, en: city.cityNameEn }
        ])
      }
    }
  }
}
</script>
