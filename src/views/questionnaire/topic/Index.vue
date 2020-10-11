<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>问卷管理</el-breadcrumb-item>
      <el-breadcrumb-item>问题管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="问题标题" prop="question">
              <el-input v-model="query.question"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="getList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="$router.push('/questionnaire/topic/add')">新增问题</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="topicData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="question"
          sortable
          label="问题标题">
        </el-table-column>
        <el-table-column
          prop="questionType"
          sortable
          label="问题类型">
          <template slot-scope="scope">
            <span v-if="scope.row.questionType == 1">单选</span>
            <span v-else-if="scope.row.questionType == 2">多选</span>
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
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push(`/questionnaire/topic/${scope.row.id}`)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ topicData.total }} 条</span>
          <span>，共 {{ topicData.pages }} 页</span>
          <span>，{{ topicData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="topicData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="topicData.pageSize"
          :total="topicData.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getTopicList, deleteTopic } from '@/api/questionnaire'
export default {
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10
      },
      searchKeyword: '',
      topicData: {
        list: []
      }
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.searchKeyword = ''
      getTopicList(this.query).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.topicData = res.data
        }
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.getList()
    },
    handleDelete(row) {
      this.$confirm(`确定删除该问题？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTopic(row.id).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '问题删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message.error('问题删除失败')
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
