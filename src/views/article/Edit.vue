<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改文章</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" >
        <el-form-item label="文章标题" prop="title" style="max-width: 600px">
          <el-input v-model="form.title" placeholder="输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="文章摘要" prop="summary" style="max-width: 600px">
          <el-input v-model="form.summary" type="textarea" placeholder="输入文章摘要"></el-input>
        </el-form-item>
        <el-form-item label="文章类别" prop="articleType" style="max-width: 600px">
          <el-select placeholder="请选择文章类别" v-model="form.articleType" style="width: 100%">
            <el-option v-for="item in typeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片" prop="coverImage" style="max-width: 600px">
          <upload-image :imageUrl="form.coverImage" @changeImage="changeImage" />
        </el-form-item>
        <el-form-item label="正文内容" prop="content">
          <div ref="editor" style="text-align:left" ></div>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" @click="submitForm">保存提交</el-button>
          <el-button @click="$router.push({path: '/article/index'})">返回</el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/api/article"
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
        title: "", //标题
        summary: "", //摘要
        coverImage: "",
        content: "", //内容
        articleType: ""
      },
      typeData: [],
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        summary: [{ required: true, message: "请输入摘要", trigger: "blur" }],
        coverImage: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入正文内容", trigger: "blur" }
        ]
      },
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
      this.editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024;
      this.editor.customConfig.uploadImgShowBase64 = true;
      this.editor.customConfig.customUploadImg = async (files, insert) => {
        let file = files[0];
        let formData = new FormData()
        formData.append('file', file)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        that.axios.post("/common/image/uploads", formData, config).then(res => {
          if (res.returnCode == "ERR_0000") {
            insert(res.data)
          }
        });
      };
      this.editor.customConfig.onchange = html => {
         this.form.content = html
      }
      this.editor.create();
    },
    typeRequest() {
      const that = this;
      request.typeArt({}).then(res => {
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
          that.editor.txt.html(res.data.content)
        }
      });
    },
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          request.update(this.form).then(res => {
            if (res.returnCode == "ERR_0000") {
              this.$message({
                message: "文章修改成功",
                type: "success"
              });
              this.$router.push({ path: "/article" });
            } else {
              this.$message({
                message: "文章修改失败",
                type: "error"
              });
            }
          });
        }
      });
    },
    changeImage(url) {
      this.form.coverImage = url;
    }
  }
};
</script>
