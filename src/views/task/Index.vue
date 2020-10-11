<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>久趣同步任务</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form label-width="80px" :model="query" ref="searchForm">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="同步类型" prop="type">
              <el-select v-model="query.type" style="width: 100%">
                <el-option v-for="(item, index) in taskSyncTypes" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="同步状态" prop="state">
              <el-select v-model="query.state" style="width: 100%">
                <el-option label="未同步" :value="0"></el-option>
                <el-option label="同步成功" :value="1"></el-option>
                <el-option label="同步失败" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="排课ID" prop="planId">
              <el-input v-model="query.planId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="学生ID" prop="studentId">
              <el-input v-model="query.studentId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadTaskList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <el-table
        :data="taskData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="type"
          sortable
          label="同步类型">
          <template slot-scope="scope">
            {{ syncTypeFormat(scope.row.type) }}
          </template>
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
          prop="times"
          sortable
          label="同步次数">
        </el-table-column>
        <el-table-column
          prop="state"
          sortable
          label="同步状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 0" class="label label-warning">未同步</span>
            <span v-else-if="scope.row.state == 1" class="label label-success">同步成功</span>
            <span v-else-if="scope.row.state == 2" class="label label-danger">同步失败</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="planId"
          sortable
          label="排课ID">
        </el-table-column>
        <el-table-column
          prop="studentId"
          sortable
          label="学生ID">
        </el-table-column>
        <el-table-column
          prop="condition"
          sortable
          label="参数">
        </el-table-column>
        <el-table-column
          prop="extend1"
          sortable
          label="扩展参数">
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.state != 1" class="item" effect="dark" content="同步" placement="top">
              <el-button class="reset-icon" @click="handleExcuteTask(scope.row)" type="text" icon="el-icon-refresh"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20" v-if="taskData.list">
        <div class="pagination-count">
          <span>共 {{ taskData.total }} 条</span>
          <span>，共 {{ taskData.pages }} 页</span>
          <span>，{{ taskData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          @current-change="pageChange"
          @size-change="sizeChange"
          :current-page="taskData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="taskData.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="taskData.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getTaskList, excuteTask, getTaskSyncTypes } from '@/api/task'
export default {
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10
      },
      taskData: {},
      taskSyncTypes: []
    }
  },
  created() {
    this.loadTaskList()
    getTaskSyncTypes().then(res => {
      this.taskSyncTypes = res.data
    })
  },
  methods: {
    loadTaskList() {
      getTaskList(this.query).then(res => {
        if (res.returnMsg == 'success') this.taskData = res.data
      })
    },
    handleExcuteTask(row) {
      this.$confirm("确定要同步该任务?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        excuteTask(row.id).then(res => {
          if (res.returnMsg == 'success') {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.loadTaskList()
          } else {
            this.$message.error(res.returnMsg)
          }
        })
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.loadTaskList()
    },
    //改变页数
    pageChange(val){
      this.query.pageNum = val
      this.loadTaskList()
    },
    //改变每页条数
    sizeChange(val){
      this.query.pageSize = val
      this.loadTaskList()
    },
    syncTypeFormat(type) {
      let item = this.taskSyncTypes.find(item => item.id === type)
      return item ? item.name : ''
    }
  }
}
</script>
