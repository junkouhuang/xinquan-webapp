<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>排课管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="90px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="班级编号" prop="classCode">
              <el-input v-model="query.classCode" placeholder="输入班级编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="query.courseName" placeholder="输入课程名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="课程包名称" prop="packageName">
              <el-input v-model="query.packageName" placeholder="输入课程包名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="上课日期">
              <el-date-picker
                v-model="queryDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadCoursePlan">查 询</el-button>
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
        :data="planData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="classCode"
          sortable
          label="班级编号">
        </el-table-column>
        <el-table-column
          prop="packageName"
          sortable
          label="课程包名称">
        </el-table-column>
        <el-table-column
          prop="courseName"
          sortable
          label="课程名称">
        </el-table-column>
        <el-table-column
          prop="classTime"
          sortable
          label="课程时间">
        </el-table-column>
        <el-table-column
          prop="classHour"
          sortable
          label="课时数">
        </el-table-column>
        <el-table-column
          prop="num"
          sortable
          label="人数（线上/线下）">
        </el-table-column>
        <el-table-column
          prop="syncStatus"
          sortable
          label="同步状态">
          <template slot-scope="scope">
            <span v-if="scope.row.syncStatus == 1" class="label label-success">已同步</span>
            <span v-else class="label label-warning">未同步</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top" v-if="scope.row.classType == 1">
              <el-button class="reset-icon" @click="$router.push({ path: `/course-plan/${scope.row.id}` })" type="text" icon="el-icon-search"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-else>
              <el-button class="reset-icon" @click="$router.push({ path: `/course-plan/${scope.row.id}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="停用" placement="top" v-if="!checkStopDisabled(scope.row)">
              <el-button class="reset-icon" @click="handleStop(scope.row)" type="text">
                <i class="iconfont">&#xe626;</i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ planData.total }} 条</span>
          <span>，共 {{ planData.pages }} 页</span>
          <span>，{{ planData.pageSize }} 条/页</span>
        </div>

        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          :total="planData.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { coursePlanList, cancelCoursePlan } from '@/api/course-plan'
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
        pageNum: 1,
        pageSize: 10,
        classCode: '',
        courseName: '',
        packageName: '',
        classTime: ''
      },
      queryDate: '',
      planData: []
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    },
    queryDate: function(val) {
      this.query.startClassTimeOn = val ? val[0] : ''
      this.query.endClassTimeOn = val ? val[1] : ''
    }
  },
  created() {
    this.loadCoursePlan()
  },
  methods: {
    loadCoursePlan() {
      this.searchKeyword = ''
      // 获取排课列表
      coursePlanList(this.query).then(res => {
        if (res.returnMsg == 'success') this.planData = res.data
      })
    },
    handleReset() {
      this.queryDate = ''
      this.query.startClassTimeOn = ''
      this.query.endClassTimeOn = ''
      this.$refs['searchForm'].resetFields()
      this.loadCoursePlan()
    },
    handleStop(row) {
      this.$confirm('停用排课，将会导致后续的课程顺延一周。此操作一旦生效，不可撤回！', '确定停用排课？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$confirm(`班级编号：${row.classCode}，课程名称：${row.courseName}，课程时间：${row.classTime}`, '确定停用该排课？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cancelCoursePlan(row.id).then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '排课停用成功',
                type: 'success'
              })
              this.loadCoursePlan()
            } else {
              this.$message.error('排课停用失败')
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 判断排课是否能停用
    checkStopDisabled(row) {
      if (row.classType === 1) {  // 线上课程
        return true
      }
      let time = row.classTime.split('~')
      let date = new Date()
      let startTime = new Date(time[0])
      if (startTime && date.getTime() >= startTime.getTime()) { // 上课时间已过
        return true
      }
      return false
    },
    // 修改分页显示数
    changePageSize(num) {
      this.query.pageSize = num
      this.loadCoursePlan()
    },
    // 切换分页
    changePageNum(page) {
      this.query.pageNum = page
      this.loadCoursePlan()
    }
  }
}
</script>
