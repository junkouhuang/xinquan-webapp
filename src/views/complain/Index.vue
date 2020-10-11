<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>建议投诉</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form label-width="50px" :model="query" ref="searchForm">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="来源" prop="complaintSource">
              <el-select v-model="query.complaintSource" style="width: 100%">
                <el-option label="公众号" :value="1"></el-option>
                <el-option label="官网" :value="2"></el-option>
                <el-option label="其它" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="用户" prop="user">
              <el-input v-model="query.user"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="fetchComplainList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <el-table
        :data="tableData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="complaintContent"
          sortable
          label="内容">
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
          prop="user"
          sortable
          label="用户">
        </el-table-column>
        <el-table-column
          prop="complaintSource"
          sortable
          label="来源">
          <template slot-scope="scope">
            <span v-if="scope.row.complaintSource == 1">公众号</span>
            <span v-else-if="scope.row.complaintSource == 2">官网</span>
            <span v-else-if="scope.row.complaintSource == 3">其它</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <!-- <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/complain/${scope.row.id}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip> -->
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ tableData.total }} 条</span>
          <span>，共 {{ tableData.pages }} 页</span>
          <span>，{{ tableData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          @current-change="pageChange"
          @size-change="sizeChange"
          :current-page="tableData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="tableData.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="tableData.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getComplainList, deleteComplain } from '@/api/complain'
export default {
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        list: []
      }
    }
  },
  created() {
    this.fetchComplainList()
  },
  methods: {
    fetchComplainList() {
      getComplainList(this.query).then(res => {
        if (res.returnCode == 'ERR_0000') this.tableData = res.data
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.fetchComplainList()
    },
    handleDelete(row) {
      this.$confirm('是否确定删除该建议投诉？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [row.id]
        deleteComplain(ids).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchComplainList()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    //改变页数
    pageChange(val){
      this.query.pageNum = val
      this.fetchComplainList()
    },
    //改变每页条数
    sizeChange(val){
      this.query.pageSize = val
      this.fetchComplainList()
    }
  }
}
</script>
