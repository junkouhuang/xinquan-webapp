<template>
  <div>
    <el-card shadow="never" class="mt20">
      <div class="menu-wraper">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr v-for="(item1, index) in menuList" :key="index">
            <td width="25%"><el-checkbox v-model="item1.occupy" :checked="item1.occupy" @change="handleCheckbox(item1, item1)">{{ item1.name }}</el-checkbox></td>
            <td colspan="3">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr v-for="(item2, index) in item1.children" :key="index">
                  <td width="33.33%"><el-checkbox v-model="item2.occupy" :checked="item2.occupy" @change="handleCheckbox(item1, item2)">{{ item2.name }}</el-checkbox></td>
                  <td colspan="2">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr v-for="(item3, index) in item2.children" :key="index">
                        <td width="50%"><el-checkbox v-model="item3.occupy" :checked="item3.occupy" @change="handleCheckbox(item1, item3)">{{ item3.name }}</el-checkbox></td>
                        <td>
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr v-for="(item4, index) in item3.children" :key="index">
                              <td><el-checkbox v-model="item4.occupy" :checked="item4.occupy" @change="handleCheckbox(item1, item4)">{{ item4.name }}</el-checkbox></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
      <div class="mt20">
        <el-button type="blue" v-has="'res_roles_permission'" @click="handleSubmit">保存提交</el-button>
        <el-button @click="$router.push({path: '/system/roles'})">返回</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    let formData = new FormData()
    formData.append('roleKey', this.$route.params.id)
    formData.append('resKeys', '')
    this.axios.post('/authorizes/resources/permission', formData).then(res => {
      if (res.returnCode == 'ERR_0000') {
        this.menuList = res.data
      }
    })
  },
  methods: {
    // handleCheckbox1(item) {
    //   if (!item.occupy) {
    //     // 取消下级选中状态
    //     item.children && item.children.forEach(r2 => {
    //       r2.occupy = false
    //       r2.children && r2.children.forEach(r3 => {
    //         r3.occupy = false
    //         r3.children && r3.children.forEach(r4 => {
    //           r4.occupy = false
    //         })
    //       })
    //     })
    //   } else {
    //     // 选择上级菜单
    //     item.children && item.children.forEach(r2 => {
    //       r2.occupy = true
    //       r2.children && r2.children.forEach(r3 => {
    //         r3.occupy = true
    //         r3.children && r3.children.forEach(r4 => {
    //           r4.occupy = true
    //         })
    //       })
    //     })
    //   }
    // },
    // handleCheckbox2(item) {
    //   if (item.occupy) {
    //     // 选择上级菜单
    //     this.menuList.forEach(r1 => {
    //       r1.children && r1.children.forEach(r2 => {
    //         if (r2.id === item.id) {
    //           r1.occupy = true
    //         }
    //       })
    //     })
    //     // 选择下级菜单
    //     item.children && item.children.forEach(r3 => {
    //       r3.occupy = true
    //       r3.children && r3.children.forEach(r4 => {
    //         r4.occupy = true
    //       })
    //     })
    //   } else {
    //     // 判断同级是否有选择
    //     this.menuList.forEach(r1 => {
    //       let check = false
    //       r1.children && r1.children.forEach(r2 => {
    //         if (!check) check = r2.occupy
    //       })
    //       if (r1.children) r1.occupy = check
    //     })
    //     // 取消下级选中状态
    //     item.children && item.children.forEach(r3 => {
    //       r3.occupy = false
    //       r3.children && r3.children.forEach(r4 => {
    //         r4.occupy = false
    //       })
    //     })
    //   }
    // },
    // handleCheckbox3(item) {
    //   if (item.occupy) {
    //     this.menuList.forEach(r1 => {
    //       r1.children && r1.children.forEach(r2 => {
    //         r2.children && r2.children.forEach(r3 => {
    //           if (r3.id === item.id) {
    //             r1.occupy = true
    //             r2.occupy = true
    //           }
    //         })
    //       })
    //     })
    //     item.children && item.children.forEach(r4 => {
    //       r4.occupy = true
    //     })
    //   } else {
    //     // 判断同级是否有选择
    //     this.menuList.forEach(r1 => {
    //       let check1 = false
    //       r1.children && r1.children.forEach(r2 => {
    //         let check2 = false
    //         r2.children && r2.children.forEach(r3 => {
    //           if (!check2) check2 = r3.occupy
    //         })
    //         if (r2.children) r2.occupy = check2
    //         if (!check1) check1 = r2.occupy
    //       })
    //       if (r1.children) r1.occupy = check1
    //     })
    //     // 取消下级选中状态
    //     item.children && item.children.forEach(r4 => {
    //       r4.occupy = false
    //     })
    //   }
    // },
    // handleCheckbox4(item) {
    //   if (item.occupy) {
    //     this.menuList.forEach(r1 => {
    //       r1.children && r1.children.forEach(r2 => {
    //         r2.children && r2.children.forEach(r3 => {
    //           r3.children && r3.children.forEach(r4 => {
    //             if (r4.id === item.id) {
    //               r1.occupy = true
    //               r2.occupy = true
    //               r3.occupy = true
    //             }
    //           })
    //         })
    //       })
    //     })
    //   } else {
    //     // 判断同级是否有选择
    //     this.menuList.forEach(r1 => {
    //       let check1 = false
    //       r1.children && r1.children.forEach(r2 => {
    //         let check2 = false
    //         r2.children && r2.children.forEach(r3 => {
    //           let check3 = false
    //           r3.children && r3.children.forEach(r4 => {
    //             if (!check3) check3 = r4.occupy
    //           })
    //           if (r3.children) r3.occupy = check3
    //           if (!check2) check2 = r3.occupy
    //         })
    //         if (r2.children) r2.occupy = check2
    //         if (!check1) check1 = r2.occupy
    //       })
    //       if (r1.children) r1.occupy = check1
    //     })
    //   }
    // },
    // 菜单树改变状态（r1：当前改变菜单根目录，row：当前目录）
    handleCheckbox(r1, row) {
      let check1 = false
      r1.children && r1.children.forEach(r2 => {
        if (r1 === row) r2.occupy = r1.occupy // 判断是否直接修改上级
        let check2 = false
        r2.children && r2.children.forEach(r3 => {
          if (r1 === row) r3.occupy = r1.occupy
          if (r2 === row) r3.occupy = r2.occupy
          let check3 = false
          r3.children && r3.children.forEach(r4 => {
            if (r1 === row) r4.occupy = r1.occupy
            if (r2 === row) r4.occupy = r2.occupy
            if (r3 === row) r4.occupy = r3.occupy
            if (!check3) check3 = r4.occupy // 记录同级是否有选中
          })
          if (r3.children && r3.children.length > 0) { // 判断下级是否有选中，改变选择状态
            r3.occupy = check3
          }
          if (!check2) check2 = r3.occupy // 记录...
        })
        if (r2.children && r2.children.length > 0) { // 判断下级...
          r2.occupy = check2
        }
        if (!check1) check1 = r2.occupy // 记录...
      })
      if (r1.children && r1.children.length > 0) { // 判断下级...
        r1.occupy = check1
      }
    },
    handleSubmit() {
      let resourcesKeys = []
      this.menuList.forEach(a => {
        if (a.occupy) {
          resourcesKeys.push(a.resKey)
        }
        a.children && a.children.forEach(b => {
          if (b.occupy) {
            resourcesKeys.push(b.resKey)
          }
          b.children && b.children.forEach(c => {
            if (c.occupy) {
              resourcesKeys.push(c.resKey)
            }
            c.children && c.children.forEach(d => {
              if (d.occupy) {
                resourcesKeys.push(d.resKey)
              }
            })
          })
        })
      })
      if (resourcesKeys.length > 0) {
        let formData = new FormData()
        formData.append('roleKey', this.$route.params.id)
        formData.append('resKeys', resourcesKeys.toString())
        this.axios.post('/authorizes/resources/permission', formData).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$router.push({path: '/system/roles'})
          } else {
            this.$message.error('提交失败')
          }
        })
      } else {
        this.$message.error('请选择菜单')
      }
    }
  }
}
</script>

<style lang="scss">
.el-tree-node__content {
  margin: 6px 0;
  .el-tree-node__label {
    font-size: 16px;
  }
}
.menu-wraper {
  table {
    width: 100%;
    text-align: center;
  }
  & > table {
    width: 80%;
  }
  td {
    padding: 10px;
    background: #fff;
    border: 1px solid #eee;
    box-sizing: border-box;
  }
}
</style>
