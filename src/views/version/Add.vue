<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" >
        <el-form-item label="APP名称" prop="appName" style="max-width: 600px">
          <el-input v-model="form.appName" type="text" maxlength="200" placeholder="输入APP名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="APP描述" prop="appDescription" style="max-width: 600px">
          <el-input v-model="form.appDescription" type="text" maxlength="200" placeholder="输入APP描述" clearable></el-input>
        </el-form-item>
        <el-form-item label="包名" prop="packageName" style="max-width: 600px">
          <el-input v-model="form.packageName" type="text" maxlength="200" placeholder="输入包名" clearable></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="versionCode" style="max-width: 600px">
          <el-input v-model="form.versionCode" type="text" maxlength="200" placeholder="输入版本号" clearable></el-input>
        </el-form-item>
        <el-form-item label="版本名称" prop="versionName" style="max-width: 600px">
          <el-input v-model="form.versionName" type="text" maxlength="200" placeholder="输入版本名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否强制更新" prop="isForceUpdate">
          <el-radio v-model="form.isForceUpdate" :label="true" >是</el-radio>
          <el-radio v-model="form.isForceUpdate" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否自动更新" prop="isAutoUpdate">
          <el-radio v-model="form.isAutoUpdate" :label="true" >是</el-radio>
          <el-radio v-model="form.isAutoUpdate" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否启用" prop="isRun">
          <el-radio v-model="form.isRun" :label="true" >是</el-radio>
          <el-radio v-model="form.isRun" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio v-for="item in appTypesData" v-model="form.type" @change="changeType"
              :key="item.id"
              :label="item.id"
              :value="item.id">
              {{ item.name }}
          </el-radio>
        </el-form-item>
        <el-form-item label="选择文件" prop="apkUrl" style="max-width: 600px" class="upload" v-if="androidVisible || h5Visible">
          <el-upload
          class="upload-demo"
           drag
           action="string"
           :limit="1"
           :http-request="uploadApk"
           :file-list="fileList"
           :before-upload="beforeUploadApk"
           :on-remove="removeApk"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">仅支持上传apk、rar或zip文件，且不超过100Mb</div>
          </el-upload>
          <el-input v-model="form.apkUrl" type="text" maxlength="200" placeholder="" hidden clearable></el-input>
        </el-form-item>
        <el-form-item label="IOS URL" prop="iosUrl" style="max-width: 600px" v-if="iosVisible">
          <el-input v-model="form.iosUrl" type="text" maxlength="200" placeholder="输入IOS应用包下载路径" clearable></el-input>
        </el-form-item>
        <el-form-item label="应用包校验码" prop="apkCheckCode" style="max-width: 600px" v-if="androidVisible || h5Visible">
          <el-input v-model="form.apkCheckCode" type="text" maxlength="200" placeholder="输入完整包校验码" clearable></el-input>
        </el-form-item>
        <el-form-item label="选择增量包文件" prop="incrementalUrl" style="max-width: 600px" class="upload" v-if="h5Visible">
          <el-upload
          class="upload-demo"
           drag
           action="string"
           :limit="1"
           :http-request="uploadIncApk"
           :file-list="incFileList"
           :before-upload="beforeUploadApk"
           :on-remove="removeIpa"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">仅支持上传apk、rar或zip文件，且不超过100Mb</div>
          </el-upload>
          <el-input v-model="form.incrementalUrl" type="text" maxlength="200" placeholder="" clearable hidden></el-input>
        </el-form-item>
        <el-form-item label="增量包校验码" prop="incrementalCheckCode" style="max-width: 600px" v-if="h5Visible">
          <el-input v-model="form.incrementalCheckCode" type="text" maxlength="200" placeholder="输入增量包校验码" clearable></el-input>
        </el-form-item>
        <el-form-item label="APP版本包" prop="parentId" style="max-width: 600px" v-if="h5Visible">
          <el-select placeholder="选择APP版本包" v-model="form.parentId" style="max-width: 600px;" filterable clearable>
            <el-option v-for="item in appVersionData"
                :key="item.id"
                :label="item.appName"
                :value="item.id">
                {{ item.appName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容信息" prop="content" style="max-width: 600px">
          <el-input v-model="form.content" type="textarea" show-word-limit maxlength="200" placeholder="输入包内容信息（或版本包功能更新说明）" clearable></el-input>
        </el-form-item>
        <br/><br/>
        <el-form-item>
          <el-button type="blue" v-has="'res_version_app_add'" @click="submitForm">保存提交</el-button>
          <el-button @click="$router.push({path: '/version/app'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/api/version"

export default {
  components: {
  },
  name:"upload",
  data() {
    return {
      androidVisible: true,
      iosVisible: false,
      h5Visible: false,
      fileList:[],
      incFileList:[],
      form: {
        appName: '',
        appDescription: '',
        packageName: '',
        versionCode: '',
        versionName: '',
        isForceUpdate: true,
        isAutoUpdate: true,
        isRun: true,
        apkUrl: '',
        iosUrl: '',
        apkCheckCode: '',
        incrementalUrl: '',
        incrementalCheckCode: '',
        type: 1,
        parentId: '',
        content: '',
      },
      appVersionData: [],
      appTypesData: [],
      rules: {
        appName: [{ required: true, message: "请输入APP名称", trigger: "blur" }],
        appDescription: [{ required: true, message: "请输入APP描述", trigger: "blur" }],
        packageName: [{ required: true, message: "请输入包名", trigger: "blur" }],
        versionCode: [{ required: true, message: "请输入版本号", trigger: "blur" }],
        versionName: [{ required: true, message: "请输入版本名称", trigger: "blur" }],
        isForceUpdate: [{ required: true, message: "请选择更新执行方式", trigger: "blur" }],
        isAutoUpdate: [{ required: true, message: "请选择更新方式", trigger: "blur" }],
        isRun: [{ required: true, message: "请选择更新状态", trigger: "blur" }],
        type: [{ required: true, message: "请选择APP类型", trigger: "blur" }],
        content: [{ required: true, message: "请输入包内容信息（或版本包功能更新说明）", trigger: "blur" }],
        apkUrl: [{ required: true, message: "请上传APP应用包", trigger: "blur" }],
        iosUrl: [{ required: true, message: "请输入IOS应用包下载路径", trigger: "blur" }],
        apkCheckCode: [{ required: true, message: "请输入完整包校验码", trigger: "blur" }],
        incrementalUrl: [{ required: true, message: "请上传增量包文件", trigger: "blur" }],
        incrementalCheckCode: [{ required: true, message: "请输入增量包校验码", trigger: "blur" }],
        parentId: [{ required: true, message: "请选择APP版本包", trigger: "blur" }],
      },
    };
  },
  watch: {

  },
  created() {
    this.appVersionRequest()
    this.appTypesRequest()
  },
  mounted() {

  },
  methods: {
    appVersionRequest() {
      request.appVersion({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.appVersionData = res.data
          for (let index in this.appVersionData) {
            this.appVersionData[index].appName = this.appVersionData[index].appName + ' V' + this.appVersionData[index].versionName
          }
        }
      })
    },
    appTypesRequest() {
      request.appTypes({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.appTypesData = res.data
        }
      })
    },
    changeType(selVal) {
      if (selVal === 1) {
        this.androidVisible = true;
        this.iosVisible = false;
        this.h5Visible = false;
      } else if (selVal === 2) {
        this.androidVisible = false;
        this.iosVisible = true;
        this.h5Visible = false;
      } else if (selVal === 3) {
        this.androidVisible = false;
        this.iosVisible = false;
        this.h5Visible = true;
      }
    },
    //  覆盖默认上传行为
    uploadApk(params) {
      request.uploadApk(params).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.form.apkUrl = res.data
        }
      }).catch(err => {
        if (err.response.status === 415) {
          this.$message.error('仅支持上传apk、rar或zip文件')
          this.fileList = []
        } else {
          this.$message.error('上传应用包失败')
        }
      })
    },
    uploadIncApk(params) {
      request.uploadApk(params).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.form.incrementalUrl = res.data
        }
      }).catch(err => {
        if (err.response.status === 415) {
          this.$message.error('仅支持上传apk、rar或zip文件')
          this.incFileList = []
        } else {
          this.$message.error('上传应用包失败')
        }
      })
    },
    removeApk(){
      this.form.apkUrl = ''
    },
    removeIpa(){
      this.form.iosUrl = ''
    },
    // 上传文件之前的钩子,上传前对文件的大小和类型进行判断
    beforeUploadApk(file) {
      const isApp = file.name.split(".")[1] === "apk" || file.name.split(".")[1] === "rar" || file.name.split(".")[1] === "zip" ;
      const isSize = file.size / 102400 / 102400 < 100;
      if (!isApp) {
        this.$message({
          message: "仅支持上传apk、rar或zip文件",
          type: "error"
        });
      }
      if (!isSize) {
        this.$message({
          message: "文件大小不能超过 100MB",
          type: "error"
        });
      }
      return isApp && isSize;
    },
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          request.add(this.form).then(res => {
            if (res.returnCode == "ERR_0000") {
              this.$message({
                message: "添加APP版本成功",
                type: "success"
              })
              this.$router.push({ path: "/version/app" })
            } else {
              this.$message({
                message: "添加APP版本失败",
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
