<template>
  <el-upload
    action=""
    ref="pictureCard"
    list-type="picture-card"
    :limit="1"
    :file-list="fileList"
    :before-upload="uploadImageBefore"
    :on-remove="removeHandler"
    :on-success="uploadImageSuccess"
    :http-request="uploadImage"
    :class="{'hidden-upload-card': imageUrl}">
    <i class="el-icon-plus"></i>
    <div slot="tip" class="el-upload__tip"><slot name="tip">只能上传jpg/png文件，且不超过1M</slot></div>
  </el-upload>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    fileList: function() {
      let list = []
			debugger
      this.imageUrl && list.push({url: this.imageUrl})
      // console.log('imageUrl', this.imageUrl)
      return list
    }
  },
  methods: {
    uploadImageBefore(file) {
      if (file.size > 1024000) {
        this.$message.error('图片不超过1MB')
        return false
      }
      /*if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        this.$message.error('只能上传jpg或png文件')
        return false
      }*/
    },
    removeHandler() {
      this.$emit('changeImage', '')
      let formData = new FormData()
      formData.append('source', this.imageUrl)
      formData.append('type', 0)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.axios.post('/common/remove', formData, config)
        .then(() => {
          // this.$emit('changeImage', '')
        })
    },
    uploadImageSuccess(res) {

      if (res.returnCode == 'ERR_0026') {
        this.$message.error('只能上传jpg或png文件')
        this.$refs['pictureCard'].clearFiles()
      } else if (res.data) {
        // console.log('uploadImageSuccess', res.data)
        this.$emit('changeImage', res.data)
      } else {
        this.$refs['pictureCard'].clearFiles()
      }
    },
    uploadImage(options) {
      let file = options.file
      let formData = new FormData()
      formData.append('file', file)

      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.axios.post('/common/image/uploads', formData, config)
        .then(res => {
          options.onSuccess(res, file)


        })
        .catch(err => {
          this.$message.error('只能上传jpg或png文件')
          options.onError(err)
        })
    }
  }
}
</script>

<style lang="scss">
.el-upload-list__item {
  transition: none !important;
}
.hidden-upload-card .el-upload--picture-card {
  display: none;
}
</style>
