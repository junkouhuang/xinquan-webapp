<template>
  <el-menu
    :default-active="activeMenu"
    :default-openeds="activeOpen"
    :unique-opened="true"
    :collapse="$store.state.isCollapse == 1"
    ref="menu"
    @select="changeVal"
    background-color="#49555F"
    text-color="#BCBEC1"
    active-text-color="#3996E1"
    style=""
    router>
    <el-menu-item index="/home">
      <i class="iconfont">&#xe658;</i>
      <span slot="title">首页</span>
    </el-menu-item>
    <template v-if="$store.state.account.resources">
      <el-menu-item-group v-for="item in $store.state.account.resources" :key="item.id" :title="item.name">
        <el-submenu :index="item2.resUrl" v-for="item2 in item.children" :key="item2.id">
          <template slot="title">
            <i class="iconfont" v-html="item2.iconFont"></i>
            <span>{{item2.name}}</span>
          </template>
          <el-menu-item v-for="item3 in item2.children" :key="item3.id" :index="item3.resUrl" ><span  style="margin-left: 8px;">{{item3.name}}</span></el-menu-item>
        </el-submenu>
      </el-menu-item-group>
    </template>
  </el-menu>
</template>

<script>
import menu from '@/api/menu'
export default {
  data() {
    return {
      activeMenu: '/',
      activeOpen: [],
      tableData: []
    }
  },
  watch: {
    '$route.matched': {
      handler (val) {
        let len = val.length
        this.activeMenu = val[len-1].path || '/'
        this.activeOpen = [val[1].name]
      },
      immediate: true,
    },
  },
  methods: {
    changeVal(index,indexPath){
      let options = this.$store.state.account.resources
      let arr = []
      options.forEach(item =>{
        item.children && item.children.forEach(item2 =>{
          if(item2.name == indexPath[0]){
            item2.children && item2.children.forEach(item3 =>{
              if(item3.resUrl == index){
              item3.children && item3.children.forEach(i => {
                arr.push(i.resKey)
              })
              }
            })
          }
        })
      })
      // 保存到状态
      this.$store.commit('setMenuDetail', arr)

    }
  },
}
</script>

<style lang="scss">
.el-menu--collapse .el-menu-item-group__title {
  display: none;
}
.el-menu--collapse .el-menu-item .iconfont,
.el-menu--collapse .el-submenu .el-submenu__title .iconfont {
  display: inline-block;
  margin: 0;
  vertical-align: middle;
  width: 24px;
  text-align: center;
}
.el-menu--collapse .el-menu-item span,
.el-menu--collapse .el-submenu .el-submenu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
.el-menu--collapse .el-submenu__icon-arrow {
  display: none;
}
</style>
