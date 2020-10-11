<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构预报名</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form label-width="75px" :model="query" ref="searchForm">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="机构名称" prop="organizationName">
              <el-input placeholder="输入机构名称" v-model="query.organizationName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="机构类别" prop="type">
              <el-select v-model="query.type" placeholder="选择机构类别" style="width: 100%">
                <el-option v-for="(item, index) in orgTypeList" :key="index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所属区域" prop="region">
              <el-select v-model="query.region" placeholder="选择机构所属区域" style="width: 100%">
                <el-option v-for="(item, index) in areaList" :key="index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="联系人" prop="contacts">
              <el-input placeholder="输入联系人" v-model="query.contacts"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所属城市" prop="city">
              <el-input placeholder="输入机构所属城市" v-model="query.city"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="申请时间" prop="createTime">
              <el-date-picker
                v-model="queryDateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadRegistrationList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="$router.push({path: '/org/registration/add'})">新增预报名</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="orglist.list"
        stripe>
        <el-table-column
          prop="id"
          sortable
          label="编号">
        </el-table-column>
        <el-table-column
          prop="organizationName"
          sortable
          label="机构名称">
        </el-table-column>
        <el-table-column
          prop="organizationType"
          sortable
          label="机构类别">
        </el-table-column>
        <el-table-column
          prop="contacts"
          sortable
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          sortable
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop="region"
          sortable
          label="区域">
        </el-table-column>
        <el-table-column
          prop="city"
          sortable
          label="城市">
        </el-table-column>
        <el-table-column
          prop="address"
          sortable
          label="详细地址">
          <template slot-scope="scope">
            {{ scope.row.province + scope.row.city + scope.row.area + scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable
          label="申请时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/org/registration/${scope.row.id}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ orglist.total }} 条</span>
          <span>，共 {{ orglist.pages }} 页</span>
          <span>，{{ orglist.pageSize }} 条/页</span>
        </div>

        <el-pagination
          @current-change="pageChange" 
          @size-change="sizeChange"
          background
          :current-page="orglist.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="orglist.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="orglist.total"
          style="float: right">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { typeRequest, areaRequest } from '@/api/org'
import { queryRegistrationList, deleteRegistration } from '@/api/org/registration'
export default {
  data() {
    return {
      searchKeyword: '',
      queryDateRange: '',
      query: {
        pageNum: 1,
        pageSize: 10
      },
      orgTypeList: [],
      areaList: [],
      orglist: []
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    },
    queryDateRange: function(val) {
      this.query.startTime = val ? val[0] : ''
      this.query.endTime = val ? val[1] : ''
    }
  },
  created() {
    // 获取机构类别
    typeRequest().then(res => {
      this.orgTypeList = res.data
    })
    // 获取地区
    areaRequest().then(res => {
      this.areaList = res.data
    })
    this.loadRegistrationList()
  },
  methods: {
    loadRegistrationList() {
      this.searchKeyword = ''
      // 报名机构
      queryRegistrationList(this.query).then(res => {
        this.orglist = res.data
      })
    },
    handleReset() {
      this.queryDateRange = ''
      this.query.startTime = ''
      this.query.endTime = ''
      this.$refs['searchForm'].resetFields()
      this.loadRegistrationList()
    },
    handleDelete(row) {
      this.$confirm(`是否确定删除机构报名信息？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRegistration(row.id).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '机构报名信息删除成功',
              type: 'success'
            })
            this.loadRegistrationList()
          } else {
            this.$message.error('机构报名信息删除失败')
          }
        })
      })
    },
    //改变页数
    pageChange(val){
      this.query.pageNum = val
      this.loadRegistrationList()
    },
    //改变每页条数
    sizeChange(val){
      this.query.pageSize = val
      this.loadRegistrationList()
    }
  }
}
</script>
