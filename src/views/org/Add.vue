<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增机构</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="ruleForm" :rules="rules" ref="orgForm" label-width="110px" style="max-width: 600px">
        <el-form-item label="机构名称" prop="displayName">
          <el-input  v-model="ruleForm.displayName" placeholder="输入机构的名称"></el-input>
        </el-form-item>
        <el-form-item label="中心编码前缀" prop="code">
          <el-input v-model="ruleForm.code" maxlength="10" placeholder="比如上海徐汇='SHXH'、深圳南山='SZNS'"></el-input>
        </el-form-item>
        <el-form-item label="地址信息" prop="city">
          <el-row :gutter="10" style="overflow: hidden">
            <el-col :span="8">
                <el-select placeholder="请选择省"   @change="proChange" v-model="proValue">
                  <el-option v-for="(item,index) in proOptions"
                    :key="index"
                    :label="item.provinceName"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-col>
            <el-col :span="8">
              <el-select placeholder="请选择市"  @change="cityChange" v-model="cityValue">
                 <el-option v-for="(item,index) in cityOptions"
                  :key="index"
                  :label="item.cityName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select placeholder="请选择区" v-model="ruleForm.city">
                 <el-option v-for="(item,index) in areaOptions"
                  :key="index"
                  :label="item.district"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input type="textarea" rows="3" v-model="ruleForm.address" placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="ruleForm.contact" placeholder="机构联系方式"  maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input  placeholder="机构所在地的经度"  maxlength="10" v-model.number="ruleForm.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度"  prop="latitude">
          <el-input placeholder="机构所在地的纬度" maxlength="10" v-model.number="ruleForm.latitude"></el-input>
        </el-form-item>
        <el-form-item label="所属区域" prop="area">
          <el-select placeholder="请选择区域" style="width: 100%" v-model="ruleForm.area">
            <el-option
              v-for="item in addressData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构类别" prop="type">
          <el-select placeholder="请选择类别" style="width: 100%" v-model="ruleForm.type">
             <el-option
                v-for="item in classData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" @click="submit">保存提交</el-button>
          <el-button @click="$router.push({path: '/org/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import org from '@/api/org'
export default {
  data() {
    let validateOrgName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入机构名称'))
      }
      // 检查机构名称是否存在
      org.nameRequest({'displayName':value}).then(res => {
        if (res.returnCode != 'ERR_0000') {
          return callback(new Error('机构名称已存在'))
        } else {
          callback()
        }
      })
    }
    let validateOrgCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入机构编码'))
      }else if(!this.validate.orgCode(value)){
        return callback(new Error('中心编码前缀必须为3-10个字母'))
      }
      // 检查机构编码是否存在
      org.existRequest({'code':value}).then(res => {
        if (res.returnCode != 'ERR_0000') {
          return callback(new Error('机构编码已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      ruleForm: {city: '',},
      classData:[],
      addressData:[],
      rules: {
        displayName: [
          {required: true, validator: validateOrgName, trigger: 'blur'},
        ],
        code: [
          {required: true, validator: validateOrgCode, trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入详细地址', trigger: 'blur'},
        ],
        contact: [
          {required: true, message: '请输入联系方式', trigger: 'blur'},
        ],
        area: [
          {required: true, message: '请输入所属区域', trigger: 'change'},
        ],
        type: [
          {required: true, message: '请输入机构类别', trigger: 'change'},
        ],
        longitude: [
          {required: false},
          {type: 'number', message: '经度必须为数字'}
        ],
        latitude: [
          {required: false},
          {type:'number', message: '纬度必须为数字'},
        ],
        city: [
          {required: true, message: '请选择地址信息', trigger: 'change'},
        ],
      },
      proOptions: [], //省份
      cityOptions: [], //城市
      areaOptions: [],//城市下
      proValue: '',
      cityValue: '',
    }
  },
  created(){
    this.provinceRequest()
    this.areaQuest()
    this.typeQuest()
  },
  methods: {
    areaQuest(){
      org.areaRequest().then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.addressData = res.data
        }
      })
    },
    typeQuest(){
      org.typeRequest().then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.classData = res.data
        }
      })
    },
     // 查询省份
    provinceRequest(){
      org.provinceRequest(1).then(res =>{
        if(res.returnCode == 'ERR_0000'){
         this.proOptions = res.data
        }
      })
    },
    // 改变省份
    proChange(value){
      this.cityRequest(value)
      this.cityValue = ''
      this.ruleForm.city = ''
      this.areaOptions = []
    },
    cityChange(value){
      this.cityDown(value)
      this.ruleForm.city = ''
    },
    // 查询市
    cityRequest(value){
      org.cityRequest({'country': 1, 'province':value}).then(res =>{
        if(res.returnCode == 'ERR_0000'){
         this.cityOptions = res.data
        }
      })
    },
    // 查询城市下
    cityDown(value){
      org.cityDown({'city':value}).then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.areaOptions = res.data
        }
      })
    },
    submit() {
      this.$refs['orgForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.code = this.ruleForm.code.toUpperCase()
          org.addRequest(this.ruleForm).then(res =>{
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '机构添加成功',
                type: 'success'
              })
              this.$router.push({path: '/org'})
            }
          })
        }
      })
    },
  }
}
</script>
