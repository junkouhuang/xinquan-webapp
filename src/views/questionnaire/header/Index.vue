<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>问卷管理</el-breadcrumb-item>
      <el-breadcrumb-item>表头管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="问卷标题" prop="title">
              <el-input v-model="query.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="问卷描述" prop="content">
              <el-input v-model="query.content"></el-input>
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
          <el-button type="blue" @click="$router.push('/questionnaire/header/add')">新增表头</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="headerData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="title"
          sortable
          label="问卷标题">
        </el-table-column>
        <el-table-column
          prop="content"
          sortable
          label="问卷描述">
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
            <el-tooltip class="item" effect="dark" content="预览" placement="top">
              <el-button class="reset-icon" @click="handlePreview(scope.row)" type="text" icon="el-icon-search"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push(`/questionnaire/header/${scope.row.id}`)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ headerData.total }} 条</span>
          <span>，共 {{ headerData.pages }} 页</span>
          <span>，{{ headerData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="headerData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="headerData.pageSize"
          :total="headerData.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      title="预览"
      :visible.sync="previewVisible"
      width="375px">
      <div slot="title"></div>
      <div class="">
        <div class="question-header">
          <img :src="previewInfo.imageUrl" width="100%" alt="">
          <div class="title">{{ previewInfo.title }}</div>
          <div class="content">{{ previewInfo.content }}</div>
        </div>
        <div class="question-list">
          <div class="question-box" v-for="(item, index) in previewInfo.questionnaireList" :key="index">
            <div class="title">{{ index + 1 }}.{{ item.question }}</div>
            <div class="option" v-for="(options, index) in item.optionsList" :key="index">
              <el-radio v-if="item.questionType == 1" v-model="item.selected" :label="options.choiceItem">{{ options.optionContent }}</el-radio>
              <el-checkbox v-else-if="item.questionType == 2" v-model="options.selected">{{ options.optionContent }}</el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTableHeaderList, previewTableHeader, deleteTableHeader } from '@/api/questionnaire'
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        content: '',
        state: ''
      },
      headerData: {
        list: []
      },
      previewVisible: false,
      previewInfo: {}
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
      getTableHeaderList(this.query).then(res => {
        if (res.returnCode == 'ERR_0000') this.headerData = res.data
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.getList()
    },
    handlePreview(row) {
      previewTableHeader(row.id).then(res => {
        this.previewInfo = res
        this.previewVisible = true
      })
    },
    handleDelete(row) {
      this.$confirm(`确定删除该表头？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTableHeader(row.id).then(res => {
          if (res.returnMsg == 'success') {
            this.$message({
              message: '表头删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message.error('表头删除失败')
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

<style lang="scss">
.question-header {
  .title {
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    color: #333;
    border-bottom: 1px solid #eee;
  }
  .content {
    margin-top: 10px;
    text-indent: 2em;
    line-height: 1.5;
  }
}
.question-list {
  .question-box {
    margin-top: 20px;
  }
  .title {
    font-size: 16px;
    color: #333;
  }
  .option {
    margin-top: 15px;
    color: #666;
  }
}
</style>
