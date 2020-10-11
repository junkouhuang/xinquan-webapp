<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" >
        <el-form-item label="APP名称" prop="appName" style="max-width: 600px">
          <el-input v-model="form.appName" type="text" maxlength="200" placeholder="输入APP名称" clearable readonly></el-input>
        </el-form-item>
        <el-form-item label="APP描述" prop="appDescription" style="max-width: 600px">
          <el-input v-model="form.appDescription" type="text" maxlength="200" placeholder="输入APP描述" clearable readonly></el-input>
        </el-form-item>
        <el-form-item label="包名" prop="packageName" style="max-width: 600px">
          <el-input v-model="form.packageName" type="text" maxlength="200" placeholder="输入包名" clearable readonly></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="versionCode" style="max-width: 600px">
          <el-input v-model="form.versionCode" type="text" maxlength="200" placeholder="输入版本号" clearable readonly></el-input>
        </el-form-item>
        <el-form-item label="版本名称" prop="versionName" style="max-width: 600px">
          <el-input v-model="form.versionName" type="text" maxlength="200" placeholder="输入版本名称" clearable readonly></el-input>
        </el-form-item>
        <el-form-item label="是否强制更新" prop="forceUpdate">
          <el-radio v-model="form.forceUpdate" :label="true" disabled>是</el-radio>
          <el-radio v-model="form.forceUpdate" :label="false" disabled>否</el-radio>
        </el-form-item>
        <el-form-item label="是否自动更新" prop="autoUpdate">
          <el-radio v-model="form.autoUpdate" :label="true" disabled>是</el-radio>
          <el-radio v-model="form.autoUpdate" :label="false" disabled>否</el-radio>
        </el-form-item>
        <el-form-item label="是否启用" prop="run">
          <el-radio v-model="form.run" :label="true" disabled>是</el-radio>
          <el-radio v-model="form.run" :label="false" disabled>否</el-radio>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio v-for="item in appTypesData" v-model="form.type"
              :key="item.id"
              :label="item.id"
              :value="item.id" disabled>
              {{ item.name }}
          </el-radio>
        </el-form-item>
        <el-form-item label="是否废弃" prop="discarded">
          <el-radio v-model="form.discarded" :label="true" disabled>是</el-radio>
          <el-radio v-model="form.discarded" :label="false" disabled>否</el-radio>
        </el-form-item>
        <el-form-item label="二维码" prop="qrcode">
          <img v-if="form.qrcode" :src="form.qrcode" width="160" height="160" alt="">
        </el-form-item>
        <el-form-item label="应用包" prop="apkUrl" v-if="form.type==1 || form.type==3" style="max-width: 600px" >
          <el-input v-model="form.apkUrl" type="text" maxlength="200" placeholder="" clearable readonly></el-input>
        </el-form-item>
        <el-form-item label="IOS URL" prop="apkUrl" v-if="form.type==2" style="max-width: 600px" >
          <el-input v-model="form.apkUrl" type="text" maxlength="200" placeholder="" clearable readonly></el-input>
        </el-form-item>
        <el-form-item label="应用包校验码" prop="apkCheckCode" style="max-width: 600px" >
          <el-input v-model="form.apkCheckCode" type="text" maxlength="200" placeholder="" clearable readonly></el-input>
        </el-form-item>
        <el-form-item label="增量包" prop="incrementalUrl" v-if="form.type==3" style="max-width: 600px" >
          <el-input v-model="form.incrementalUrl" type="text" maxlength="200" placeholder="" clearable readonly></el-input>
        </el-form-item>
        <el-form-item label="增量包校验码" prop="incrementalCheckCode" v-if="form.type==3" style="max-width: 600px">
          <el-input v-model="form.incrementalCheckCode" type="text" maxlength="200" placeholder="" clearable readonly></el-input>
        </el-form-item>
        <el-form-item label="APP版本包" prop="parentId" v-if="form.type==3" style="max-width: 600px" >
          <el-select placeholder="选择APP版本包" v-model="form.parentId" style="max-width: 600px;" filterable readonly>
            <el-option v-for="item in appVersionData"
                :key="item.id"
                :label="item.appName"
                :value="item.id">
                {{ item.appName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容信息" prop="content" style="max-width: 600px">
          <el-input v-model="form.content" type="textarea" show-word-limit maxlength="200" placeholder="" clearable readonly></el-input>
        </el-form-item>
        <br/><br/>
        <el-form-item>
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
  data() {
    return {
    form: {
      appName: '',
      appDescription: '',
      packageName: '',
      versionCode: '',
      versionName: '',
      forceUpdate: '',
      autoUpdate: '',
      run: '',
      discarded: '',
      apkUrl: '',
      iosUrl: '',
      apkCheckCode: '',
      incrementalUrl: '',
      incrementalCheckCode: '',
      type: '',
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
      forceUpdate: [{ required: true, message: "请选择更新执行方式", trigger: "blur" }],
      autoUpdate: [{ required: true, message: "请选择更新方式", trigger: "blur" }],
      run: [{ required: true, message: "请选择更新状态", trigger: "blur" }],
      discarded: [{ required: true, message: "请选择有效状态", trigger: "blur" }],
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
  created() {
    this.queryRequest()
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
    queryRequest() {
      const that = this;
      request.detail(this.$route.params.id).then(res => {
        if (res.returnCode == "ERR_0000") {
          that.form = res.data
        }
      });
    },
  }
};
</script>
