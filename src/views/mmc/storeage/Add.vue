<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" >
        <el-form-item label="资源名称" prop="storageName" style="max-width: 600px">
          <el-input v-model="form.storageName" type="text" maxlength="200" placeholder="输入资源名称（默认取上传的资源名称）" clearable></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="storageType" style="max-width: 600px">
          <el-select placeholder="选择资源类型" v-model="form.storageType" clearable>
            <el-option v-for="item in typesData"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源类别" prop="storageCategory" style="max-width: 600px">
          <el-select placeholder="选择资源类别" v-model="form.storageCategory" clearable>
            <el-option v-for="item in categoryData"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源预览" prop="uploadFileName" style="max-width: 600px">
          <span style="color:#E6A23C;font-size:12px;">资源预览可根据上传资源类型自行展示预览内容</span><br/>
          <span v-if="form.storageType == 1">                 
            <el-image :src="form.storageDetail" style="width:120px;" :preview-src-list="[`${form.storageDetail}`]" lazy>
              <span slot="error"></span>
            </el-image> 
          </span>
          <span v-if="form.storageType == 2">          
            <video controls="controls" width="380px" height="280px" playsinline="" webkit-playsinline="" x5-playsinline="" :src="form.storageDetail">
            </video>
          </span>
          <span v-if="form.storageType == 3" style="font-size:10px;width:180px;height:80px;">                    
            <img src="./images/pdf.png" style="height:22px;vertical-align:middle;" lazy> {{ uploadFileName }}</img>
          </span>
          <span v-if="form.storageType == 4" style="font-size:10px;width:180px;height:80px;">
            <img src="./images/word3.png" style="height:22px;vertical-align:middle;" lazy> {{ uploadFileName}}</img>
          </span>
          <span v-if="form.storageType == 5" style="width:180px;height:80px;">
            <img src="./images/excel.png" style="height:22px;vertical-align:middle;" lazy> {{ uploadFileName }}</img>
          </span>
        </el-form-item>
        <el-form-item label="资源上传" prop="storageDetail" style="max-width: 600px" class="upload">
          <el-upload
          class="upload-demo"
           drag
           action="string"
           :limit="1"
           :http-request="uploadStorage"
           :file-list="fileList"
           :before-upload="beforeUploadStorage"
           :on-remove="removeStorage"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">
                仅支持图片（png/jpg/jpeg），视频（mp4），文档（ word/excel/pdf），且不超过10Mb
            </div>
          </el-upload>
          <el-input v-model="form.storageDetail" type="text" maxlength="200" placeholder="" hidden clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="storageStatus">
          <el-radio v-model="form.storageStatus" :label="1">是</el-radio>
          <el-radio v-model="form.storageStatus" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="来源机构" prop="storageOrgId" style="max-width: 600px">
          <el-select placeholder="选择来源机构" v-model="form.storageOrgId" filterable clearable>
            <el-option v-for="item in orgOptions"
              :key="item.enterpriseId"
              :label="item.enterpriseName"
              :value="item.enterpriseId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源简介" prop="storageContent" style="max-width: 600px">
          <el-input v-model="form.storageContent" type="textarea" show-word-limit maxlength="200" placeholder="输入资源内容描述" clearable></el-input>
        </el-form-item>
        <br/><br/>
        <el-form-item>
          <el-button type="blue" v-has="'res_mmc_media_resource_add'" @click="submitForm">保存提交</el-button>
          <el-button @click="$router.push({path: '/mmc/storeage'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/api/mmc/storeage"

export default {
  components: {
  },
  name:"upload",
  data() {
    return {
      fileList:[],
      form: {
        storageName: '',
        storageType: '',
        storageCategory: '',    
        storageDetail: '',
        storageStatus: '',
        storageOrgId: '',
        storageContent: '',
        storageFormat: '',
        storageSize: '',
        source: 2,
      },
      uploadFileName: '',
      typesData: [],
      categoryData: [],
      orgOptions: [] ,//机构列表
      rules: {
        storageName: [{ required: true, message: "请输入资源名称", trigger: "blur" }],
        storageType: [{ required: true, message: "请选择资源类型", trigger: "blur" }],
        storageCategory: [{ required: true, message: "请选择资源类别", trigger: "blur" }],
        storageDetail: [{ required: true, message: "请上传您的素材资源", trigger: "blur" }],
        storageStatus: [{ required: true, message: "请选择资源状态", trigger: "blur" }],
        storageContent: [{ required: true, message: "请输入资源简介", trigger: "blur" }],
      },
    };
  },
  watch: {

  },
  created() {
    this.typesRequest()
    this.categoryRequest()
    this.orgList()
  },
  mounted() {

  },
  methods: {
    typesRequest() {
      request.typesData({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.typesData = res.data
        }
      })
    },
    categoryRequest() {
      request.categoryData({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.categoryData = res.data
        }
      })
    },
    orgList(){
      request.queryOrgRequest({
        pageNum: 1,
        pageSize: 100000
      }).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.orgOptions = res.data.list
        }
      })
    },
    //  覆盖默认上传行为
    uploadStorage(params) {
      request.uploadStorage(params).then(res => {
        if (res.returnCode == "ERR_0000") {
          if (this.form.storageName == '') {
            this.form.storageName = params.file.name.substring(0, params.file.name.length - 4)
          }
          this.form.storageDetail = res.data
          that.uploadFileName = this.form.storageName
        }
      }).catch(err => {
        if (err.response.status === 415) {
          this.$message.error('资源文件格式不支持，请重新上传！')
          this.fileList = []
        } else {
          this.$message.error('上传资源失败')
        } 
      })
    },
    removeStorage(){
      this.form.storageDetail = ''
    },
    // 上传文件之前的钩子,上传前对文件的大小和类型进行判断
    beforeUploadStorage(file) {
      const isApp = file.name.split(".")[1] === "png" || file.name.split(".")[1] === "jpg" || file.name.split(".")[1] === "jpeg" || file.name.split(".")[1] === "mp4" || file.name.split(".")[1] === "doc"
      || file.name.split(".")[1] === "xls" || file.name.split(".")[1] === "pdf" || file.name.split(".")[1] === "docx" || file.name.split(".")[1] === "xlsx";
      const isSize = file.size / 102400 / 102400 < 10;
      if (!isApp) {
        this.$message({
          message: "资源文件格式不支持，请重新上传！",
          type: "error"
        });
      }
      if (!isSize) {
        this.$message({
          message: "文件大小不能超过 10MB",
          type: "error"
        });
      }
      this.uploadFileName = file.name
      this.form.storageFormat = file.name.split(".")[1];
      this.form.storageSize = file.size;
      return isApp && isSize;
    },
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          request.add(this.form).then(res => {
            if (res.returnCode == "ERR_0000") {
              this.$message({
                message: "添加资源成功",
                type: "success"
              })
              this.$router.push({ path: "/mmc/storeage" })
            } else {
              this.$message({
                message: "添加资源失败",
                type: "error"
              })
            }
          })
        }
      })
    },

  }
};
</script>
<style lang="scss">
.upload {
  .el-upload{
    width:100%;
  }
  .el-upload-dragger {
    width:100%;
  }
  .el-upload-list__item:first-child {
    margin-bottom: 10px;
  }
}
</style>
