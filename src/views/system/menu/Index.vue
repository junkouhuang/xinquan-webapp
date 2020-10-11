<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form label-width="45px" :model="menuData" ref="menuRef">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="名称">
              <el-input placeholder="输入名称" v-model="menuData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_menu_list'" @click="searchAccount">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_menu_add'" @click="$router.push({path: '/system/menu/add'})">新增菜单</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table @selection-change="changeSelection" class="nextTable"
        stripe
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table @selection-change="changeSelection" class="nextForm"
            stripe
            v-if="props.row.children.length>0"
            :data="props.row.children"
            style="width: 100%">
              <el-table-column  type="expand">
                <template slot-scope="props">
                  <el-table @selection-change="changeSelection" class="nextForm1"
                  stripe
                  v-if="props.row.children.length>0"
                  :data="props.row.children"
                  style="width: 100%">
                    <el-table-column  type="expand">
                      <template slot-scope="props">
                        <el-table @selection-change="changeSelection" class="nextForm2"
                        stripe
                        v-if="props.row.children.length>0"
                        :data="props.row.children"
                        style="width: 100%">
                          <el-table-column  type="expand">
                          </el-table-column>
                          <el-table-column
                            prop="id"
                            sortable
                            label="编号"
                            width="80">
                          </el-table-column>
                          <el-table-column
                            prop="name"
                            sortable
                            label="名称">

                          </el-table-column>
                          <el-table-column
                            prop="parentId"
                            sortable
                            label="parentId">
                          </el-table-column>
                          <el-table-column
                            prop="resKey"
                            sortable
                            label="菜单标识">
                          </el-table-column>
                          <el-table-column
                            prop="type"
                            sortable
                            label="类型">
                            <template slot-scope="scope">
                               {{scope.row.type ? typeFormat(scope.row.type): ''}}
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="resUrl"
                            sortable
                            label="resUrl">
                          </el-table-column>
                          <el-table-column
                            prop="description"
                            sortable
                            label="描述">
                            <template slot-scope="scope">
                              {{ scope.row.description=="null" ? '': scope.row.description}}
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" width="120">
                            <template slot-scope="scope">
                              <!-- <el-tooltip class="item" v-has="'res_menu_add_sub'" effect="dark" content="添加子菜单" placement="top">
                                <el-button class="reset-icon" @click="$router.push({ path: `/system/menu/${scope.row.id}` })" type="text" icon="el-icon-circle-plus-outline"></el-button>
                              </el-tooltip> -->
                              <el-tooltip class="item" v-has="'res_menu_edit'" effect="dark" content="编辑" placement="top">
                                <el-button class="reset-icon" @click="$router.push({ path: `/system/menu/${scope.row.resKey}` })" type="text" icon="el-icon-edit-outline"></el-button>
                              </el-tooltip>
                              <el-tooltip class="item" v-has="'res_menu_delete'" effect="dark" content="删除" placement="top">
                                <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
                              </el-tooltip>
                            </template>
                          </el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="id"
                      sortable
                      label="编号"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      sortable
                      label="名称">
                      <template slot-scope="scope">
                        <div>
                          <!-- <i class="iconfont">&#xe656;</i> -->
                          {{ scope.row.name}}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="parentId"
                      sortable
                      label="parentId">
                    </el-table-column>
                    <el-table-column
                      prop="resKey"
                      sortable
                      label="菜单标识">
                    </el-table-column>
                    <el-table-column
                      prop="type"
                      sortable
                      label="类型">
                      <template slot-scope="scope">
                         {{scope.row.type ? typeFormat(scope.row.type): ''}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="resUrl"
                      sortable
                      label="resUrl">
                    </el-table-column>
                    <el-table-column
                      prop="description"
                      sortable
                      label="描述">
                      <template slot-scope="scope">
                        {{ scope.row.description=="null" ? '': scope.row.description}}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                      <template slot-scope="scope">
                        <el-tooltip class="item" v-has="'res_menu_add_sub'" effect="dark" content="添加子菜单" placement="top">
                          <el-button class="reset-icon" @click="$router.push({ path: `/system/menu/add?id=${scope.row.id}` })" type="text" icon="el-icon-circle-plus-outline"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" v-has="'res_menu_edit'" effect="dark" content="编辑" placement="top">
                          <el-button class="reset-icon" @click="$router.push({ path: `/system/menu/${scope.row.resKey}` })" type="text" icon="el-icon-edit-outline"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" v-has="'res_menu_delete'" effect="dark" content="删除" placement="top">
                          <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                sortable
                label="编号"
                width="80">
              </el-table-column>
              <el-table-column
                prop="name"
                sortable
                label="名称">
                <template slot-scope="scope">
                  <div>
                    <!-- <i class="iconfont">&#xe60e;</i> -->
                    {{ scope.row.name}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="parentId"
                sortable
                label="parentId">
              </el-table-column>
              <el-table-column
                prop="resKey"
                sortable
                label="菜单标识">
              </el-table-column>
              <el-table-column
                prop="type"
                sortable
                label="类型">
                <template slot-scope="scope">
                  {{scope.row.type ? typeFormat(scope.row.type): ''}}
                </template>
              </el-table-column>
              <el-table-column
                prop="resUrl"
                sortable
                label="resUrl">
              </el-table-column>
              <el-table-column
                prop="description"
                sortable
                label="描述">
                <template slot-scope="scope">
                  {{ scope.row.description=="null" ? '': scope.row.description}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-tooltip class="item" v-has="'res_menu_add_sub'" effect="dark" content="添加子菜单" placement="top">
                    <el-button class="reset-icon" @click="$router.push({ path: `/system/menu/add?id=${scope.row.id}` })" type="text" icon="el-icon-circle-plus-outline"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" v-has="'res_menu_edit'" effect="dark" content="编辑" placement="top">
                    <el-button class="reset-icon" @click="$router.push({ path: `/system/menu/${scope.row.resKey}` })" type="text" icon="el-icon-edit-outline"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" v-has="'res_menu_delete'" effect="dark" content="删除" placement="top">
                    <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          sortable
          label="编号"
          width="80">
          </el-table-column>
        <el-table-column
          prop="name"
          sortable
          label="名称">
        </el-table-column>
        <el-table-column
          prop="parentId"
          sortable
          label="parentId">
        </el-table-column>
        <el-table-column
          prop="resKey"
          sortable
          label="菜单标识">
        </el-table-column>
         <el-table-column
          prop="type"
          sortable
          label="类型">
          <template slot-scope="scope">
            {{scope.row.type ? typeFormat(scope.row.type): ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="resUrl"
          sortable
          label="resUrl">
        </el-table-column>
         <el-table-column
          prop="description"
          sortable
          label="描述">
           <template slot-scope="scope">
            {{ scope.row.description=="null" ? '': scope.row.description}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" v-has="'res_menu_add_sub'" effect="dark" content="添加子菜单" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/system/menu/add?id=${scope.row.id}` })" type="text" icon="el-icon-circle-plus-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" v-has="'res_menu_edit'" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/system/menu/${scope.row.resKey}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" v-has="'res_menu_delete'" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import utils from '@/utils'
import menu from '@/api/menu'
export default {
  data() {
    return {
      searchKeyword: '',
      typeData: [],
      tableData: [],
      menuData:{
        name: '', //名字
      },
      selectedAccount: [],

    }
  },
  watch: {
    searchKeyword: function(val) {
      utils.searchKeyword(val)
    }
  },
  created(){
    this.searchRequest()
  },
  methods: {
    // 页面数据加载
    searchRequest(){
      this.searchKeyword = ''
      menu.queryMenu(this.menuData).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.tableData = res.data
          this.typeQuery()
        }
      })
    },
    typeQuery(){
      menu.typeMenu().then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.typeData = res.data
        }
      })
    },
    typeFormat(type) {
      let object = this.typeData.find(item => item.id == type)
      return  object? object.name: ''
    },
    // 点击查询
    searchAccount() {
      this.searchRequest()
    },
    changeSelection(val) {
      this.selectedAccount = val
    },

    //删除一条
    handleDelete(row) {
      this.$confirm(`是否确定删除该菜单？（${row.name}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        menu.delMenu({'resKey':row.resKey}).then(res => {
          if(res.returnCode == "ERR_0000") {
            this.$message({
              message: `${row.name}删除成功`,
              type: 'success'
            })
            this.searchRequest()
          }
        })
      }) .catch(() => { })
    },
    //点击重置
    handleReset() {
      this.menuData.name = ''
      this.$refs['menuRef'].resetFields()
      this.searchRequest()
    },
  },
}
</script>
<style lang="scss">
.nextForm{
  .has-gutter{
    display: none;
  }
  .el-table__expand-icon {
    margin-left: 15px;
  }
  .el-table__body  .el-table__row td:nth-child(2) .cell{
    margin-left: 10px;
  }
}
.nextForm1 {
  .has-gutter{
    display: none;
  }
  .el-table__expand-icon {
    margin-left: 30px;
  }
  .el-table__body  .el-table__row td:nth-child(2) .cell{
    margin-left: 20px;
  }
}
.nextForm2 {
  .has-gutter{
    display: none;
  }
  .el-table__expand-icon {
    margin-left:50px;
  }
  .el-table__body  .el-table__row td:nth-child(2) .cell{
    margin-left: 30px;
  }
}
.nextTable{
  .el-table__expanded-cell[class*=cell]{
    padding: 0;
  }
  .el-table__expand-icon > .el-icon{
    border-left: 6px solid  #999;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
  .el-icon-arrow-right:before{
    content: ''
  }
}


</style>
