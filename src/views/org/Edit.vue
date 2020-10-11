<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改机构</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="editData" ref="editRef" :rules="rules"  label-width="110px" style="max-width: 600px">
        <el-form-item label="机构中心编码" >
          {{editData.code}}
        </el-form-item>
        <el-form-item label="机构名称" prop="displayName">
          <el-input  placeholder="输入机构的名称" v-model="editData.displayName"></el-input>
        </el-form-item>
        <el-form-item label="地址信息" prop="cityId">
          <el-row :gutter="10" style="overflow: hidden">
            <el-col :span="8">
              <el-select placeholder="请选择省"  @change="proChange" v-model="editData.provinceId">
                <el-option v-for="(item,index) in proOptions"
                  :key="index"
                  :label="item.provinceName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select placeholder="请选择市"  @change="cityChange" v-model="editData.cityId">
                 <el-option v-for="(item,index) in cityOptions"
                  :key="index"
                  :label="item.cityName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select placeholder="请选择区" v-model="editData.areaId">
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
          <el-input type="textarea" rows="3" v-model="editData.address" placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="editData.contact" placeholder="机构联系方式" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="经度">
          <el-input  placeholder="机构所在地的经度" v-model.number="editData.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input  placeholder="机构所在地的纬度" v-model.number="editData.latitude"></el-input>
        </el-form-item>
        <el-form-item label="所属区域" prop="area">
          <el-select placeholder="请选择区域" style="width: 100%" v-model="editData.area">
            <el-option
              v-for="item in areaData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构类别" prop="type">
          <el-select placeholder="请选择类别" style="width: 100%" v-model="editData.type">
            <el-option
              v-for="item in orgTypeData"
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
    return {
      editData: {
        displayName: '',
        address: '',
        latitude: '' ,
        longitude: '',
        code: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        type:'',
        area: '',
        city: '',
      },
      rules: {
        displayName: [
          {required: true, message: '请输入机构名称', trigger: 'blur'},
        ],
        address: [
          {required: true, message: '请输入详细地址', trigger: 'blur'},
        ],
        contact: [
          {required: true, message: '请输入联系方式', trigger: 'blur'},
        ],
        area: [
          {required: true, message: '请输入所属区域', trigger: 'blur'},
        ],
        type: [
          {required: true, message: '请输入机构类别', trigger: 'blur'},
        ],
        longitude: [
          {type:'number', message: '经度必须为数字'},
        ],
        latitude: [
          {type:'number', message: '纬度必须为数字'},
        ],
        cityId: [
          {required: true, message: '请选择地址信息' , trigger: 'change'},
        ]
      },
      areaData: [], // 区域
      orgTypeData: [], // 机构类别
      proOptions: [], //省份
      cityOptions: [], //城市
      areaOptions:[] ,//城市下
    }
  },
  created(){

    this.provinceRequest()
    this.detailRequest()
    // 区域
    org.areaRequest().then(res => {
      if (res.returnCode == 'ERR_0000') {
        this.areaData = res.data
      }
    })
    // 机构类别
    org.typeRequest().then(res => {
      if (res.returnCode == 'ERR_0000') {
        this.orgTypeData = res.data
      }
    })
  },
  methods: {
    //查询机构详情
    detailRequest() {
      org.detailRequest({'id':this.$route.params.id}).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.editData = res.data
          this.editData.provinceId = res.data.provinceId - 0
          this.cityRequest(res.data.provinceId-0)
          this.cityDown(res.data.cityId-0)
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
      this.cityRequest(value-0)
      this.editData.cityId = ''
      this.editData.areaId  = ''
      this.areaOptions = []
    },
    cityChange(value){
      this.cityDown(value-0)
      this.editData.areaId = ''
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
    //提交
    submit(){
      this.editData.city = this.editData.areaId
      this.$refs['editRef'].validate(valid => {
        if (valid) {
          org.updateRequest(this.editData).then(res =>{
            if(res.returnCode == 'ERR_0000'){
              this.$message({
                message: '机构信息修改成功',
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

