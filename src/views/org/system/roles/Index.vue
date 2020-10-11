<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form label-width="80px" :model="query" ref="searchForm">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="角色名称" prop="name">
              <el-input placeholder="输入角色名称" v-model="query.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所属机构" prop="orgId">
              <el-select placeholder="输入机构名称" v-model="query.orgId" filterable clearable>
                <el-option
                        v-for="item in orgOptions"
                        :key="item.enterpriseId"
                        :label="item.enterpriseName"
                        :value="item.enterpriseId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_org_roles_list'" @click="getList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_org_roles_add'" @click="$router.push('/organization/roles/add')">新增角色</el-button>
          <el-button type="danger" v-has="'res_org_roles_batch_delete'" @click="handleDeleteSelected">删除角色</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="rolesData.list"
        @selection-change="changeSelection"
        stripe
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          width="80">
          <template slot-scope="scope">
            {{ rolesData.total - scope.$index - ((query.pageNum - 1) * query.pageSize) }}
          </template>
        </el-table-column>
        <!--
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>-->
        <el-table-column
          prop="name"
          sortable
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="roleKey"
          sortable
          label="角色Key">
        </el-table-column>
        <el-table-column
          prop="status"
          sortable
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.enable" class="label label-success">启用</span>
            <span v-else class="label label-danger">禁用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          sortable
          label="描述">
        </el-table-column>
        <el-table-column
          prop="organizationName"
          sortable
          label="所属机构" width="350">
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable
          label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createBy"
          sortable
          label="创建人">
          <template slot-scope="scope">
              {{ scope.row.createBy  }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-has="'res_org_roles_menu_permission'" content="分配权限" placement="top">
              <el-button class="reset-icon" @click="$router.push(`/organization/roles/${scope.row.roleKey}/${scope.row.organizationId}/menu`)" type="text" icon="el-icon-setting"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_org_roles_details'" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push(`/organization/roles/${scope.row.roleKey}`)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_org_roles_delete'" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ rolesData.total }} 条</span>
          <span>，共 {{ rolesData.pages }} 页</span>
          <span>，{{ rolesData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          @current-change="changePageNum"
          @size-change="changePageSize"
          :current-page="rolesData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="rolesData.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="rolesData.total">
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>

<script>
import { getRolesList, deleteRole, deleteBatchRole, queryOrgRequest } from '@/api/org/system/roles'
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
        name: '',
        orgId: '',
        pageNum: 1,
        pageSize: 10
      },
      rolesData: {
        list: []
      },
      authDialogVisible: false,
      selectedRoles: [],
      orgOptions: [] ,//机构列表
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  created() {
    this.getList()
    this.orgList()
  },
  methods: {
    getList() {
      this.searchKeyword = ''
      getRolesList(this.query).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.rolesData = res.data
        }
      })
    },
    // 机构列表
    orgList(){
      queryOrgRequest({
        pageNum: 1,
        pageSize: 100000
      }).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.orgOptions = res.data.list
        }
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.getList()
    },
    handleAuthDailog() {
      this.authDialogVisible = true
    },
    handleAuthClose() {},
    changeSelection(val) {
      this.selectedRoles = val
    },
    handleDeleteSelected() {
      if (this.selectedRoles.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的所有角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let keys = []
        this.selectedRoles.forEach(item => {
          keys.push(item.roleKey)
        })
        deleteBatchRole(keys.toString())
          .then(res => {
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '角色删除成功',
                type: 'success'
              })
              this.getList()
            } else {
              this.$message.error('角色删除失败')
            }
          })
      })
    },
    handleDelete(row) {
      this.$confirm(`确定删除该角色？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.roleKey).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '角色删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message.error('角色部门删除失败')
          }
        })
      }).catch(() => {})
    },
    changePageSize(num) {
      this.query.pageSize = num
      this.getList()
    },
    changePageNum(page) {
      this.query.pageNum = page
      this.getList()
    }
  }
}
</script>
