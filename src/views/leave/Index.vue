<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>放课记录</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}" v-if="$store.state.account.type == 0">
            <el-form-item label="机构编号" prop="orgCode">
              <el-input v-model="query.orgCode" placeholder="输入机构编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}" v-if="$store.state.account.type == 0">
            <el-form-item label="机构名称" prop="orgName">
              <el-input v-model="query.orgName" placeholder="输入机构名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="放课类型" prop="type">
              <el-select v-model="query.type" placeholder="请选择放课的类型" style="width: 100%">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item, index) in leaveTypes" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="时间">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadLeave">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="$router.push({path: '/leave/add'})">新增放课</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="leaveData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="orgCode"
          sortable
          label="机构编码">
        </el-table-column>
        <el-table-column
          prop="orgName"
          sortable
          label="机构名称">
        </el-table-column>
        <el-table-column
          prop="cause"
          sortable
          label="放课理由">
        </el-table-column>
        <el-table-column
          prop="startTime"
          sortable
          label="开始时间">
          <template slot-scope="scope">
            {{ scope.row.startTime | datefmt('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          sortable
          label="结束时间">
          <template slot-scope="scope">
            {{ scope.row.endTime | datefmt('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          sortable
          label="放课类型">
          <template slot-scope="scope">
            {{ leaveTypeFormat(scope.row.type) }}
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ leaveData.total }} 条</span>
          <span>，共 {{ leaveData.pages }} 页</span>
          <span>，{{ leaveData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          :total="leaveData.total"
          @size-change="changePageSize"
          @current-change="changePageNum"
          style="float: right">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getLeaveTypes, getLeaveList } from '@/api/leave'
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
        pageNum: 1,
        pageSize: 10,
        orgCode: '',
        orgName: '',
        type: '',
        startTime: '',
        endTime: ''
      },
      dateRange: '',
      leaveData: [],
      leaveTypes: []
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    },
    dateRange: function(val) {
      this.query.startTime = val ? val[0] : ''
      this.query.endTime = val ? val[1] : ''
    }
  },
  created() {
    this.loadLeave()
    // 获得放课类型
    getLeaveTypes().then(res => {
      this.leaveTypes = res.data
    })
  },
  methods: {
    loadLeave() {
      this.searchKeyword = ''
      getLeaveList(this.query).then(res => {
        if (res.returnMsg == 'success') this.leaveData = res.data
      })
    },
    handleReset() {
      this.dateRange = ''
      this.query.startTime = ''
      this.query.endTime = ''
      this.$refs['searchForm'].resetFields()
      this.loadLeave()
    },
    // 修改分页显示数
    changePageSize(num) {
      this.query.pageSize = num
      this.loadLeave()
    },
    // 切换分页
    changePageNum(page) {
      this.query.pageNum = page
      this.loadLeave()
    },
    leaveTypeFormat(id) {
      if (this.leaveTypes.length <= 0) return ''
      let row = this.leaveTypes.find(item => item.id == id)
      return row && row.name
    }
  }
}
</script>
