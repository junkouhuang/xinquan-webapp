<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" >
        <el-form-item label="问题类型：" prop="type" style="max-width: 600px">
          <el-select placeholder="请选择问题类型" v-model="form.type" style="width: 100%">
            <el-option v-for="item in typeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题：" prop="title" style="max-width: 600px">
          <el-input v-model="form.title" type="textarea" maxlength="200" placeholder="输入问题描述" ></el-input>
        </el-form-item>
        <el-form-item label="解决办法：" prop="content" style="max-width:900px;">
          <div ref="editor" style="text-align:left"></div>
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio v-model="form.status" :label="2">禁用</el-radio>
          <el-radio v-model="form.status" :label="1">启用</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" v-has="'res_minle_faq_add'" @click="submitForm">保存提交</el-button>
          <el-button @click="$router.push({path: '/minle/faq'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/api/minle/faq"
import E from "wangeditor"
export default {
  components: {
  },
  // name:'editor',
  data() {
    return {
      form: {
        title: "",
        type: "",
        content: "",
        status: ""
      },
      typeData: [],
      rules: {
        title: [{ required: true, message: "请选择问题类型", trigger: "blur" }],
        type: [{ required: true, message: "请输入问题描述", trigger: "blur" }],
        status: [
          { required: true, message: "请选择状态", trigger: "change" }
        ],
        content: [
          { required: true, message: "请输入问题解决方法", trigger: "blur" }
        ]
      },
    };
  },
  created() {
    this.typeRequest()
  },
  mounted() {
    this.uploadImage()
  },
  methods: {
    // 上传图片
    uploadImage() {
      let editor = new E(this.$refs.editor)
      editor.customConfig.menus = [
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
      editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024
      editor.customConfig.customUploadImg = async (files, insert) => {
        let file = files[0]
        let formData = new FormData()
        formData.append('file', file)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.axios.post('/common/image/uploads', formData, config).then(res => {
          if (res.returnCode == "ERR_0000") {
            insert(res.data)
          }
        });
      }
      editor.customConfig.onchange = html => {
        this.form.content = html
      }
      editor.create()
    },
    typeRequest() {
      request.typeFAQ({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.typeData = res.data
        }
      })
    },
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          request.save(this.form).then(res => {
            if (res.returnCode == "ERR_0000") {
              this.$message({
                message: "问题添加成功",
                type: "success"
              })
              this.$router.push({ path: "/minle/faq" })
            } else {
              this.$message({
                message: "问题添加失败",
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
