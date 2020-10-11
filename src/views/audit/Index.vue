<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级审核</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所属机构" prop="itemObj1">
              <el-input v-model="query.itemObj1" placeholder="输入机构名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="申请日期">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="班级编号" prop="itemObj3">
              <el-input v-model="query.itemObj3" placeholder="请输入班级编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="城市" prop="itemObj2">
              <el-input v-model="query.itemObj2" placeholder="请输入城市名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadAuditList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="auditData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="itemObj3"
          sortable
          label="班级编号">
        </el-table-column>
        <el-table-column
          prop="itemObj1"
          sortable
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="itemObj2"
          sortable
          label="城市">
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable
          label="申请时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="auditTime"
          sortable
          label="审批时间">
          <template slot-scope="scope">
            {{ scope.row.auditTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="submitBy"
          sortable
          label="提交人">
        </el-table-column>
        <el-table-column
          prop="auditBy"
          sortable
          label="审核人">
        </el-table-column>
        <el-table-column
          prop="isAudited"
          sortable
          label="是否审核">
          <template slot-scope="scope">
            <span v-if="scope.row.isAudited == 1" class="label label-success">已审核</span>
            <span v-else class="label label-danger">未审核</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="isPassed"
          sortable
          label="是否通过">
          <template slot-scope="scope">
            <span v-if="scope.row.isPassed == 1" class="label label-success">已通过</span>
            <span v-else class="label label-danger">未通过</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="isCancel"
          sortable
          label="是否作废">
          <template slot-scope="scope">
            <span v-if="scope.row.isCancel == 0" class="label label-success">未作废</span>
            <span v-else-if="scope.row.isCancel == 1" class="label label-danger">已作废</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="审核" placement="top">
              <el-button class="reset-icon" v-if="scope.row.auditType === 1 && scope.row.isAudited === 0 && scope.row.isCancel === 0" @click="$router.push({ path: `/class/audit/${scope.row.id}?audit=1` })" type="text">
                <i class="iconfont">&#xe611;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="提交审核" placement="top">
              <el-button class="reset-icon" v-if="scope.row.auditType === 0" @click="handleSubmitAudit(scope.row)" type="text">
                <i class="iconfont">&#xe624;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="作废" placement="top">
              <el-button class="reset-icon" v-if="scope.row.isAudited === 0 && scope.row.isCancel === 0" @click="handleCancel(scope.row)" type="text">
                <i class="iconfont">&#xe623;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/class/audit/${scope.row.id}` })" type="text" icon="el-icon-search"></el-button>
            </el-tooltip>
            <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ auditData.total }} 条</span>
          <span>，共 {{ auditData.pages }} 页</span>
          <span>，{{ auditData.pageSize }} 条/页</span>
        </div>

        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          :total="auditData.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from '@/api/audit'
export default {
  data() {
    return {
      searchKeyword: '',
      dateRange: '',
      query: {
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        endTime: ''
      },
      auditData: {
        list: []
      }
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
    this.loadAuditList()
  },
  methods: {
    loadAuditList() {
      this.searchKeyword = ''
      request.auditList(this.query).then(res => {
        if (res.returnMsg == 'success') this.auditData = res.data
      })
    },
    handleReset() {
      this.dateRange = ''
      this.query.startTime = ''
      this.query.endTime = ''
      this.$refs["searchForm"].resetFields()
      this.loadAuditList()
    },
    handleSubmitAudit(row) {
      this.$confirm('是否确定提交？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.submitAudit({
          id: row.id,
          itemId: row.itemId,
          auditTable: row.auditTable
        }).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.loadAuditList()
          } else {
            this.$message.error('提交失败')
          }
        })
      })
    },
    handleCancel(row) {
      this.$confirm('是否确定作废？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.cancelAudit({
          id: row.id,
          itemId: row.itemId,
          auditTable: row.auditTable
        }).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '作废成功',
              type: 'success'
            })
            this.loadAuditList()
          } else {
            this.$message.error('作废失败')
          }
        })
      })
    },
    handleDelete(row) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.deleteAudit({
          id: row.id,
          itemId: row.itemId,
          auditTable: row.auditTable
        }).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.loadAuditList()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    changePageNum(val) {
      this.query.pageNum = val
      this.loadAuditList()
    },
    changePageSize(val) {
      this.query.pageSize = val
      this.loadAuditList()
    }
  }
}
</script>
