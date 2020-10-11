<template>
  <div class="upload-wraper">
    <div class="image-card">
      <img v-if="imageUrl" class="item-thumbnail" :src="imageUrl" alt="">
      <img v-else class="item-thumbnail" src="../../assets/images/avatar.jpg" alt="">
      <div class="upload-actions">
        <span>选择图片</span>
        <input type="file" name="file" @change="onChangeFile">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    onChangeFile(e) {
      let files = e.target.files
      let file = files[0]

      if (file.size > 500000) {
        this.$message.error('图片不超过500KB')
        return false
      }
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        this.$message.error('只能上传jpg或png文件')
        return false
      }
      
      let formData = new FormData()
      formData.append('file', file)

      this.axios.post('/common/image/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.returnCode == 'ERR_0026') {
          this.$message.error('只能上传jpg或png文件')
        } else if (res.data) {
          this.$emit('changeImage', res.data)
        } else {
          this.$message.error('图片上传失败')
        }
      })
      
    }
  }
}
</script>

<style lang="scss" scoped>
.image-card {
  display: inline-block;
  img {
    display: block;
    width: 100px;
    height: 100px;
    border-radius: 2px;
  }
}
.upload-actions {
  margin-top: 15px;
  position: relative;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  width: 100px;
  height: 30px;
  line-height: 30px;
  border-radius: 2px;
  border: 1px solid #eee;
  background: #f8f8f8;
  input {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    width: 100%;
  }
}
</style>
