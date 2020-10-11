<template>
  <div>
    <el-card shadow="never" class="mt20">
      <div class="dwz-resolve">
        <h1 class="title">短网址解析</h1>
        <el-form class="resolve-form" :model="form" :rules="rules" ref="resolveForm" @submit.native.prevent>
          <el-form-item prop="dwz">
            <el-input v-model="form.dwz" autocomplete="off" placeholder="请输入以https://mlh.xinquanjk.com/或http://mlh.xinquanjk.com/开头的短网址">
              <el-button slot="append" @click="handleResolve" native-type="submit">还原网址</el-button>
            </el-input>
          </el-form-item>
          <div class="clearfix"></div>
          <el-form-item v-if="source">
            <p style="margin: 0px">短网址：{{ dwz }}</p>
            <p style="margin: 0px">原网址：{{ source }}</p>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { dwzResolve } from '@/api/url'
export default {
  data() {
    const validateURL = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入短网址'))
      } else if (!this.validate.url(value)) {
        return callback(new Error('请输入正确的网址'))
      }
      callback()
    }
    return {
      form: {
        dwz: ''
      },
      dwz: '',
      source: '',
      rules: {
        dwz: [
          { required: true, validator: validateURL, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleResolve() {
      this.$refs['resolveForm'].validate(valid => {
        if (!valid) return
        dwzResolve(this.form.dwz).then(res => {
          if (res.returnMsg == 'success') {
            this.dwz = this.form.dwz
            this.source = res.data
            this.form.dwz = ''
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.dwz-resolve {
  min-height: 300px;
  overflow: hidden;
  h1.title {
    text-align: center;
    font-weight: normal;
    font-size: 24px;
    margin-bottom: 50px;
  }
}
.resolve-form {
  .el-form-item {
    width: 660px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
