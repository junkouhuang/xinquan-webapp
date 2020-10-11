<template>
  <div class="wraper">
    <el-card shadow="never" class="login-box" :class="{'left': agreementVisible}">
      <div class="logo"><img src="../../assets/images/logo.png" width="150" alt=""></div>
      <el-form :model="form" :rules="rules" ref="loginForm" @submit.native.prevent>
        <el-form-item prop="accountName">
          <el-input v-model="form.accountName" autocomplete="off" maxlength="20" placeholder="输入手机号或账号名"></el-input>
          <i class="el-icon-error" v-if="form.accountName.length > 0" @click="form.accountName = ''"></i>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" placeholder="输入密码" autocomplete="off"></el-input>
          <i class="el-icon-error" v-if="form.password.length > 0" @click="form.password = ''"></i>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="remember">自动登录</el-checkbox>
          <el-button class="btn-link" type="text" style="float: right" @click="handleClickAgreement">《鑫健康网络服务协议》</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleLogin" native-type="submit" type="primary" style="width: 100%">登 录</el-button>
        </el-form-item>
      </el-form>
      <div class="copyright">Copyright © 2016-2020 Xinquanjk All Rights Reserved</div>
    </el-card>
    <div class="agreement" ref="agreement" v-show="agreementVisible">
      <div class="wrap">

        <div class="title">鑫健康网络服务协议</div>
        <div class="content"><br/>
          <p class="protocol">
          </p>
          <p class="protocol"><strong>一、帐号注册</strong></p>
          <p class="protocol">
            1、用户在使用本服务前需要注册一个“鑫健康”帐号。“鑫健康”帐号应当使用手机号码绑定注册，请用户使用尚未与“鑫健康”帐号绑定的手机号码，以及未被鑫健康根据本协议封禁的手机号码注册“鑫健康”帐号。鑫健康可以根据用户需求或产品需要对帐号注册和绑定的方式进行变更，而无须事先通知用户。
          </p>
          <p class="protocol">
            2、鉴于“鑫健康”帐号的绑定注册方式，您同意鑫健康在注册时将使用您提供的手机号码及/或自动提取您的手机号码及自动提取您的手机设备识别码等信息用于注册。
          </p>
          <p class="protocol">
            3、在用户注册及使用本服务时，鑫健康需要搜集能识别用户身份的个人信息以便鑫健康可以在必要时联系用户，或为用户提供更好的使用体验。鑫健康搜集的信息包括但不限于用户的姓名、性别、年龄、出生日期、身份证号、地址、个人说明；鑫健康同意对这些信息的使用将受限于第三条用户个人或隐私信息保护的约束。
          </p>
          <p class="protocol"><strong>二、服务内容</strong></p>
          <p class="protocol">
            本服务的具体内容由鑫健康根据实际情况提供，包括但不限于授权用户通过其帐号进行即时通讯、购买商品、发布留言。鑫健康可以对其提供的服务予以变更，且鑫健康提供的服务内容可能随时变更；用户将会收到鑫健康关于服务变更的通知。
          </p>
          <p class="protocol"><strong>三、用户个人或企业隐私信息保护</strong></p>
          <p class="protocol">
            1、用户在注册帐号或使用本服务的过程中，可能需要填写或提交一些必要的信息，如法律法规、规章规范性文件（以下称“法律法规”）规定的需要填写的身份信息。如用户提交的信息不完整或不符合法律法规的规定，则用户可能无法使用本服务或在使用本服务的过程中受到限制。
          </p>
          <p class="protocol">
            2、个人或企业隐私信息是指涉及用户个人或企业隐私的信息，比如，用户真实姓名、证件号、手机号码、手机设备识别码、IP地址、企业资质、企业营业执照等。非个人或企业隐私信息是指用户对本服务的操作状态以及使用习惯等明确且客观反映在鑫健康服务器端的基本记录信息、个人或企业隐私信息范围外的其它普通信息，以及用户同意公开的上述隐私信息。
          </p>
          <p class="protocol">
            3、尊重用户个人或企业隐私信息的私有性是鑫健康的一贯制度，鑫健康将采取技术措施和其他必要措施，确保用户个人或企业隐私信息安全，防止在本服务中收集的用户个人或企业隐私信息泄露、毁损或丢失。在发生前述情形或者鑫健康发现存在发生前述情形的可能时，将及时采取补救措施。
          </p>
          <p class="protocol">
            4、鑫健康未经用户同意不向任何第三方公开、透露用户个人或企业的隐私信息。但以下特定情形除外：
          </p>
          <p class="protocol">
            (1) 鑫健康根据法律法规规定或有权机关的指示提供用户的个人或企业隐私信息；
          </p>
          <p class="protocol">
            (2) 由于用户将其用户密码告知他人或与他人共享注册帐户与密码，由此导致的任何个人或企业信息的泄漏，或其他非因鑫健康原因导致的个人或企业隐私信息的泄露；
          </p>
          <p class="protocol">
            (3) 用户自行向第三方公开其个人或企业隐私信息；
          </p>
          <p class="protocol">
            (4) 用户与鑫健康及合作单位之间就用户个人或企业隐私信息的使用公开达成约定，鑫健康因此向合作单位公开用户个人或企业隐私信息；
          </p>
          <p class="protocol">
            (5) 任何由于黑客攻击、电脑病毒侵入及其他不可抗力事件导致用户个人或企业隐私信息的泄露。
          </p>
          <p class="protocol">
            5、用户同意鑫健康可在以下事项中使用用户的个人或企业隐私信息：
          </p>
          <p class="protocol">
            (1) 鑫健康向用户及时发送重要通知，如软件更新、本协议条款的变更；
          </p>
          <p class="protocol">
            (2) 鑫健康内部进行审计、数据分析和研究等，以改进鑫健康的产品、服务和与用户之间的沟通；
          </p>
          <p class="protocol">
            (3) 依本协议约定，鑫健康管理、审查用户信息及进行处理措施；
          </p>
          <p class="protocol">
            (4) 适用法律法规规定的其他事项。
          </p>
          <p class="protocol">
            除上述事项外，如未取得用户事先同意，鑫健康不会将用户个人或企业隐私信息使用于任何其他用途。
          </p>
        </div>
      </div>
      <a href="javascript:;" class="close" @click="agreementVisible = false"><i class="el-icon-close"></i></a>
    </div>
    <p style="display: none;">粤ICP备17132607号 互联网药品信息服务资格证书：(粤)-经营性-2018-0044 2016-2018 深圳鑫泉健康网络有限公司版权所有粤公网安备 44030502002190号</p>
  </div>

</template>

<script>
import BScroll from 'better-scroll'
export default {
  data() {
    const validateAccountName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入账户名"))
      }
      // else if(!(this.validate.phone(value)) && !(this.validate.account(value))) {
      //   return callback(new Error("请输入正确的手机号或账户名"))
      // }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入登录密码"))
      } else if (value.length < 6) {
        return callback(new Error("密码不能少于6位"))
      }
      callback()
    }
    return {
      rules: {
        accountName: [
          { required: true, validator: validateAccountName, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ]
      },
      form: {
        accountName: '',
        password: '',
        checkCode: '123456'
      },
      remember: false,
      agreementVisible: false
    }
  },
  created() {
    let user = this.cookie.get('remember')
    if (user) {
      this.form.accountName = user
      this.remember = true
    }
    // let arr = user ? user.split(',') : []
    // if (arr.length >= 2) {
    //   this.remember = true
    //   this.form.accountName = arr[0]
    //   this.form.password = arr[1]
    // }
  },
  methods: {
    handleLogin() {
      this.$refs['loginForm'].validate(valid => {
        if (!valid) return
        // login
        this.$store.dispatch('login', this.form).then(res => {
          // 记住密码
          if (this.remember) {
            let user = this.form.accountName
            this.cookie.set('remember', user)
          } else {
            this.cookie.remove('remember')
          }

          // 登陆成功，跳转到上一个页面或
          // let path = this.$route.query.redirect || '/'

          this.$router.push('/')
        }).catch(err => {
          if (!err) {
            this.$message.error('用户名或密码错误')
          } else if (err.response.status === 400) {
            this.$message.error('请输入用户名或密码')
          } else if (err.response.status === 423) {
            this.$message.error('账号已被锁定')
          } else if (err.response.status === 401) {
            this.$message.error('用户名或密码错误')
          }
          this.form.password = ''
        })
      })
    },
    handleClickAgreement() {
      this.agreementVisible = true
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.agreement, {
            startY: 50,
            // scrollbar: {
            //   fade: false,
            //   interactive: true
            // },
            // zoom: true,
            // mouseWheel: true,
            // bounce: false
          })
        } else {
          this.scroll.refresh()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wraper {
  height: 100vh;
  background: url('../../assets/images/bg.jpg') center no-repeat;
  // background: #f7fafc;
  background-size: cover;
}
.login-box {
  position: fixed;
  left: 50%;
  top: 0;
  bottom: 0;
  margin: auto;
  margin-left: -210px;
  width: 420px;
  height: 435px;
  border: none;
  background: rgba(255,255,255,0.85);
  box-shadow: 0 0 4px rgba(0, 0, 0, .15);
  &.left {
    left: 30%;
  }
  .logo {
    margin: 20px 0 35px;
    text-align: center;
  }
  .copyright {
    text-align: center;
    color: #999;
  }
}
.el-form-item__content {
  i {
    position: absolute;
    top: 13px;
    right: 13px;
    cursor: pointer;
    color: #bbb;
  }
}
.agreement {
  position: fixed;
  left: 60%;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(255,255,255,0.85);
  // overflow-y: scroll;
  .wrap {
    padding: 20px;
  }
  .close {
    display: block;
    position: fixed;
    right: 20px;
    top: 20px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    color: #419ae2;
    // background: rgba(255, 255, 255, 0.35);
    i {
      vertical-align: middle;
      display: inline;
      font-size: 24px;
    }
  }
  .title {
    margin-bottom: 15px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
  .content {
    line-height: 1.6;
    .protocol {
      text-align: justify;
      line-height: 1.5em;
      font-size: 14px;
      font-family: Microsoft YaHei;
    }
  }
}
.btn-link {
  color: #909399;
  &:hover {
    color: #419ae2;
  }
}
@media screen and (max-width: 960px) {
  .login-box {
    left: 50% !important;
  }
  .agreement {
    left: 0;
    background: #fff;
    z-index: 100;
    .close {
      right: 10px;
    }
  }
}
@media screen and (max-width: 640px) {
  .wraper {
    background: #f7fafc;
  }
  .login-box {
    position: relative;
    width: 100%;
    left: 0 !important;
    margin-left: 0;
    border-radius: 0;
    background: none;
  }
}
</style>
