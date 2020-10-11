<template>
  <div style="overflow: hidden">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-select placeholder="请选择省" v-model="proValue">
          <el-option v-for="(item,index) in proOptions"
            :key="index"
            :label="item.provinceName"
            :value="item.provinceName">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select placeholder="请选择市" v-model="cityValue">
          <el-option v-for="(item,index) in cityOptions"
            :key="index"
            :label="item.cityName"
            :value="item.cityName">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select placeholder="请选择区" v-model="areaValue">
          <el-option v-for="(item,index) in areaOptions"
            :key="index"
            :label="item.district"
            :value="item.district">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const COUNTRY_ID = 1 // 国家ID（1：中国）
import { provinceRequest, cityRequest, cityDown } from '@/api/org'
export default {
  props: {
    province: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    area: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      proValue: '',
      cityValue: '',
      areaValue: '',
      proOptions: [],
      cityOptions: [],
      areaOptions: []
    }
  },
  watch: {
    // province: function(str) {
    //   if (this.proValue != str) this.proValue = str
    // },
    // city: function(str) {
    //   if (this.cityValue != str) {
    //     this.cityValue = str
    //     this.cityIndex = 1
    //   }
    // },
    // area: function(str) {
    //   if (this.areaValue != str) {
    //     this.areaValue = str
    //     this.areaIndex = 1
    //   }
    // },
    proValue: function(value) {
      this.cityIndex === 1 ? this.cityIndex = 0 : this.cityValue = ''
      this.cityOptions = []
      if (!value) return
      // 省份下的城市
      let province = this.proOptions.find(item => item.provinceName == value)
      // console.log('find province', this.proOptions, province)
      if (!province) return
      cityRequest({country: COUNTRY_ID, province: province.id}).then(res => {
        this.cityOptions = res.data || []
        this.loadAreaList()
      })
    },
    cityValue: function(value) {
      this.areaIndex === 1 ? this.areaIndex = 0 : this.areaValue = ''
      this.areaOptions = []
      if (!value) return
      this.loadAreaList()
    },
    areaValue: function() {
      this.changeHandler()
    }
  },
  created() {
    // 所有省份
    provinceRequest(COUNTRY_ID).then(res => {
      this.proOptions = res.data

      this.$watch('province', str => {
        if (this.proValue != str) this.proValue = str
      })
      this.$watch('city', str => {
        if (this.cityValue != str) {
          this.cityValue = str
          this.cityIndex = 1
        }
      })
      this.$watch('area', str => {
        if (this.areaValue != str) {
          this.areaValue = str
          this.areaIndex = 1
        }
      })
    })
  },
  methods: {
    loadAreaList() {
      // 查询城市下的区域
      if (this.cityValue && this.cityOptions.length > 0) {
        let city = this.cityOptions.find(item => item.cityName == this.cityValue)
        if (!city) return
        cityDown({city: city.id}).then(res => {
          this.areaOptions = res.data || []
        })
      }
    },
    changeHandler() {
      console.log('changeHandler', this.proValue, this.cityValue, this.areaValue)
      this.$emit('change', [this.proValue, this.cityValue, this.areaValue])
    }
  }
}
</script>
