<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" >
      <el-form-item label="问题类型：" prop="questionType" style="max-width: 600px">
        <el-select placeholder="请选择问题类型" v-model="form.questionType" style="width: 100%">
          <el-option v-for="item in typeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题：" prop="questionTitle" style="max-width: 600px">
        <el-input v-model="form.questionTitle" type="textarea" maxlength="200" placeholder="输入问题描述" ></el-input>
      </el-form-item>
      <el-form-item label="解决办法：" prop="questionContent" style="max-width:900px;">
        <div ref="editor" style="text-align:left"></div>
      </el-form-item>
      <el-form-item label="是否启用：" prop="status">
        <el-radio v-model="form.status" :label="2">禁用</el-radio>
        <el-radio v-model="form.status" :label="1">启用</el-radio>
      </el-form-item>
        <el-form-item>
          <el-button @click="$router.push({path: '/mmc/faq'})">返回</el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/api/mmc/faq"
import uploadImage from "@/components/upload/image"
import E from "wangeditor"
export default {
  name: 'editor',
  components: {
    "upload-image": uploadImage
  },
  data() {
    return {
      form: {
        id:"",
        questionTitle: "",
        questionContent: "",
        questionType: "",
        status: "",
      },
      typeData: [],
      editorOption: {}, //文本编辑
      editor: ''
    };
  },
  created() {
    this.queryRequest()
    this.typeRequest()
  },
  mounted() {
    this.uploadImage()
  },
  methods: {
      // 上传图片
    uploadImage() {
      const that = this;
      this.editor = new E(this.$refs.editor);
      this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'list',  // 列表
        'justify',  // 对齐方式
        'image',  // 插入图片
        'undo',  // 撤销
        'redo'  // 重复
      ]
      this.editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024;
      this.editor.customConfig.uploadImgShowBase64 = true;
      this.editor.customConfig.onchange = html => {
         this.form.questionContent = html
      }
      this.editor.create();
    },
    typeRequest() {
      const that = this;
      request.typeFAQ({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          that.typeData = res.data
        }
      });
    },
    queryRequest() {
      const that = this;
      request.detail(this.$route.params.id).then(res => {
        if (res.returnCode == "ERR_0000") {
          that.form = res.data
          that.editor.txt.html(res.data.questionContent)
        }
      });
    },

  }
};
</script>
