<template>
  <el-container ref="container">

    <el-header class="lucq-admin-header">
      <div class="header-brand" :class="{'narrow' : $store.state.isCollapse == 1}">
        <router-link to="/">
          <img v-if="$store.state.isCollapse == 1" src="../../assets/images/logo_min.png" alt="">
          <img v-else src="../../assets/images/logo.png" alt="">
        </router-link>
      </div>
      <div class="header-toggle-collapse">
        <div class="toggle-icon" @click="toggleCollapse"><i class="iconfont">&#xe63a;</i></div>
      </div>
      <div class="header-navbar">
        <span class="header-navbar-item fullscreen" @click="toggleFullscreen">
          <i class="iconfont">&#xe61f;</i>
        </span>
        <el-dropdown @command="handleCommand" placement="bottom">
          <span class="header-navbar-item profile">
            <img v-if="account.imageUrl" :src="account.imageUrl" alt="">
            <img v-else src="https://edm.xinquanjk.com/upload/images/202006/05/202006051838563151562056487.jpg" alt="">
            <b v-if="account.type == 1">{{ account.organizationName}}</b>
            <b v-else>{{ account.accountName }}</b>
            <i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="/user/profile"><i class="iconfont lucq-header-dropdown-icon">&#xe68f;</i> 个人信息</el-dropdown-item>
            <el-dropdown-item command="/user/password"><i class="iconfont lucq-header-dropdown-icon">&#xe637;</i> 修改密码</el-dropdown-item>
            <el-dropdown-item command="logout"><i class="iconfont lucq-header-dropdown-icon">&#xe6f7;</i> 退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="lucq-admin-content" :class="{'is-collapse': $store.state.isCollapse == 1}">
      <el-aside :width="$store.state.isCollapse == 1 ? '64px' : '200px'" class="lucq-admin-menu">
        <div class="scroll-wraper">
          <asideMenu />
        </div>
      </el-aside>

      <el-main>
        <breadCrumb/>
        <router-view/>
      </el-main>
      <el-footer class="lucq-admin-footer">
        <p>Copyright © {{year}} Xinquan Health Network Inc. All Rights Reserved</p>
      </el-footer>
    </el-container>

    <!-- 修改密码弹窗 -->
    <password />
  </el-container>
</template>

<script>
import asideMenu from './components/aside-menu'
import password from './components/password'
import breadCrumb from './components/breadCrumb'
export default {
  components: {
    asideMenu,
    password,
    breadCrumb,
  },
  data() {
    return {
      account: {},
      year:''
    }
  },
  created() {
    // 获取账号信息
    this.$store.dispatch('fetchAccountInfo').then(res => {
      this.account = res
    })

    this.year = new Date().getFullYear();

  },
  methods: {
    handleCommand(cmd) {
      if (cmd === 'logout') {
        this.$store.dispatch('logout')
        this.$router.replace('/login')
      } else {
        this.$router.push(cmd)
      }
    },
    launchFullscreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    toggleCollapse() {
      let isCollapse = this.$store.state.isCollapse == 0 ? 1 : 0
      this.$store.commit('changeCollapse', isCollapse)
    },
    toggleFullscreen() {
      var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled
      if (fullscreenEnabled) {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
          this.launchFullscreen(document.documentElement)
        } else {
          this.exitFullscreen()
        }
      }
    }
  }
}
</script>

<style lang="scss">
.lucq-admin-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #36404a;
  color: #333;
  line-height: 60px;
}
.lucq-header-dropdown-icon {
  font-size: 14px;
  margin-right: 5px;
  vertical-align: middle;
}
.header-brand {
  float: left;
  text-align: center;
  width: 160px;
  height: 60px;
  overflow: hidden;
  transition: all .5s;
  &.narrow {
    margin-left: -20px;
    width: 64px;
    img {
      margin-top: 15px;
      width: 30px;
      height: 30px;
    }
    & + .header-toggle-collapse {
      margin-left: 0;
    }
  }
  img {
    display: inline-block;
    margin-top: 12px;
    height: 36px;
  }
}
.header-toggle-collapse {
  float: left;
  margin-left: 20px;
  height: 60px;
  color: #fff;
  .toggle-icon {
    height: 60px;
    padding: 0 20px;
    cursor: pointer;
    &:active {
      background: darken(#36404a, 2%);
    }
  }
  i {
    font-size: 20px;
  }
}
.header-navbar {
  float: right;
  height: 60px;
  color: #fff;
  .el-button {
    margin-left: 15px;
    background: none !important;
    color: #fff;
  }
}
.header-navbar-item {
  display: inline-block;
  height: 60px;
  padding: 0 12px;
  cursor: pointer;
  color: #fff;
  &:active {
    background: darken(#36404a, 3%);
  }
  i {
    font-size: 20px;
    vertical-align: middle;
  }
  &.profile {
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      vertical-align: middle;
    }
    b {
      margin-left: 5px;
      font-weight: normal;
      vertical-align: middle;
    }
    i {
      margin-left: 5px;
      font-size: 12px;
    }
  }
}
.lucq-admin-menu {
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 1px 1px #ebeef5;
  transition: width .5s;
  overflow: hidden !important;
  .scroll-wraper {
    height: 100%;
    width: 100%;
    box-sizing: content-box;
    overflow-x: hidden;
    overflow-y: scroll;
    background-color:#49555F;
    &::-webkit-scrollbar {
      width: 2px;
      height: 0px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
    }
    &::-webkit-scrollbar-track {
      background: #ebeff2;
    }
  }
  .el-menu {
    border-right: none;
    overflow: hidden;
  }
  .el-menu-item {
    border-bottom: none !important;
    float: none !important;
  }
  .el-menu-item.is-active {
    background-color: #fdf2e9;
  }
  .is-opened {
    .el-submenu__title, .el-submenu__title i {
      color: #3996E1;
    }
    .el-submenu__title, .el-submenu__title span {
      color: #3996E1;
    }
  }
  .iconfont {
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
    width: 20px;
    text-align: center;
    font-size: 14px;
  }
}
.lucq-admin-content {
  padding: 60px 0 0 200px;
  min-height: 100vh;
  transition: padding .5s;
  &.is-collapse {
    padding-left: 64px;
  }
}
.lucq-admin-footer {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  line-height: 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  color: #58666e;
}
@media screen and (max-width: 768px) {
  .header-navbar-item.profile {
    b, i {
      display: none;
    }
  }
}
</style>
