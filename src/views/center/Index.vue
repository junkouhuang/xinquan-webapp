<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>中心管理</el-breadcrumb-item>
      <el-breadcrumb-item>中心列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="90px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="中心名称" prop="centerName">
              <el-input v-model="query.centerName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所在城市" prop="cityName">
              <el-input v-model="query.cityName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadCenterList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="$router.push({path: '/center/add'})">新增中心</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="centerData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          sortable
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="centerName"
          sortable
          label="中心名称">
        </el-table-column>
        <el-table-column
          prop="provinceName"
          sortable
          label="省份">
        </el-table-column>
        <el-table-column
          prop="cityName"
          sortable
          label="所在城市">
        </el-table-column>
        <el-table-column
          prop="address"
          sortable
          label="中心地址">
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          sortable
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop="latitude"
          sortable
          label="经纬度">
          <template slot-scope="scope">
            {{ scope.row.longitude }},{{ scope.row.latitude }}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          label="所属机构">
        </el-table-column>
        
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/center/${scope.row.id}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ centerData.total }} 条</span>
          <span>，共 {{ centerData.pages }} 页</span>
          <span>，{{ centerData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="centerData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="centerData.pageSize"
          :total="centerData.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCenterList, deleteCenter } from '@/api/center'
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
        pageNum: 1,
        pageSize: 10
      },
      centerData: {}
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  created() {
    this.loadCenterList()
  },
  methods: {
    loadCenterList() {
      getCenterList(this.query).then(res => {
        if (res.returnMsg == 'success') this.centerData = res.data
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.loadCenterList()
    },
    handleDelete(row) {
      this.$confirm(`是否确定删除该中心？（${row.centerName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCenter(row.id).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '中心删除成功',
              type: 'success'
            })
            this.loadCenterList()
          } else {
            this.$message.error('中心删除成功')
          }
        })
      }).catch(() => {})
    },
    // 修改分页显示数
    changePageSize(num) {
      this.query.pageSize = num
      this.loadCenterList()
    },
    // 切换分页
    changePageNum(page) {
      this.query.pageNum = page
      this.loadCenterList()
    }
  }
}
</script>
