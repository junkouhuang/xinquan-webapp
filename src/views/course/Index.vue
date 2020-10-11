<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教研管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="query.courseName" placeholder="输入课程名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="消耗课时" prop="classHour">
              <el-input v-model="query.classHour" placeholder="输入消耗课时数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="课程简介" prop="description">
              <el-input v-model="query.description" placeholder="输入课程简介内容" :autosize="{ minRows: 4, maxRows: 4 }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="课程类型" prop="classType">
              <el-select v-model="query.classType" placeholder="请选择课程类型" style="width: 100%">
                <el-option label="全部" value=""></el-option>
                <el-option label="线上" value="1"></el-option>
                <el-option label="线下" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="是否启用" prop="state">
              <el-select v-model="query.state" placeholder="请选择启用状态" style="width: 100%">
                <el-option label="全部" value=""></el-option>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="handleSearch">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="$router.push({path: '/course/add'})">新增课程</el-button>
          <el-button type="danger" @click="handleDeleteSelected">删除课程</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="courseData.list"
        stripe
        @selection-change="changeSelection"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="courseName"
          sortable
          label="课程名称">
        </el-table-column>
        <el-table-column
          prop="classHour"
          sortable
          label="消耗课时">
        </el-table-column>
        <el-table-column
          prop="description"
          sortable
          label="课程简介">
        </el-table-column>
        <el-table-column
          prop="classType"
          sortable
          label="课程类型">
          <template slot-scope="scope">
            {{ scope.row.classType ? '线上' : '线下' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="qkidName"
          sortable
          label="久趣课程">
        </el-table-column>
        <el-table-column
          prop="state"
          sortable
          label="是否启用">
          <template slot-scope="scope">
            <span v-if="scope.row.state" class="label label-success">启用</span>
            <span v-else class="label label-danger">未启用</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.usedFlag == 1" class="item" effect="dark" content="查看" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/course/${scope.row.id}` })" type="text" icon="el-icon-search"></el-button>
            </el-tooltip>
            <el-tooltip v-else class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/course/${scope.row.id}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.usedFlag != 1" class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ courseData.total }} 条</span>
          <span>，共 {{ courseData.pages }} 页</span>
          <span>，{{ courseData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          :total="courseData.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import courseRequest from '@/api/course'
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
        pageNum: 1,
        pageSize: 10,
        courseName: '',
        classHour: '',
        description: '',
        classType: '',
        state: ''
      },
      courseData: [],
      selectedCourse: []
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  created() {
    this.loadCourse()
  },
  methods: {
    loadCourse() {
      this.searchKeyword = ''
      courseRequest.list(this.query).then(res => {
        if (res.returnMsg == 'success') this.courseData = res.data
      })
    },
    handleSearch() {
      this.loadCourse()
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.loadCourse()
    },
    handleDelete(row) {
      this.$confirm(`是否确定删除以下课程？（${row.courseName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseRequest.del(row.id)
          .then(res => {
            if (res.returnCode == '40000049') {
              this.$message.error('课程使用后不能删除')
              return
            }
            if(res.returnMsg == 'success') {
              this.$message({
                message: '课程删除成功',
                type: 'success'
              })
              this.loadCourse()
            } else {
              this.$message.error('课程删除失败')
            }
          })
      }).catch(() => {
      })
    },
    changePageSize(num) {
      // 修改分页显示数
      this.query.pageSize = num
      this.loadCourse()
    },
    changePageNum(page) {
      // 切换分页
      this.query.pageNum = page
      this.loadCourse()
    },
    changeSelection(val) {
      this.selectedCourse = val
    },
    handleDeleteSelected() {
      if (this.selectedCourse.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的所有课程?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = []
        this.selectedCourse.forEach(item => {
          ids.push(item.id)
        })
        courseRequest.delBatch(ids.toString())
          .then(res => {
            if (res.returnCode == '40000049') {
              this.$message.error('课程使用后不能删除')
              return
            }
            if(res.returnMsg == 'success') {
              this.$message({
                message: '课程删除成功',
                type: 'success'
              })
              this.loadCourse()
            } else {
              this.$message.error('课程删除失败')
            }
          })
      })
    }
  }
}
</script>
