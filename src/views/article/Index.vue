<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="75px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="标题" prop="title">
              <el-input v-model="query.title" placeholder="输入标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="发布状态" prop="pubState">
              <el-select placeholder="请选择状态" v-model="query.pubState" style="width: 100%">
                <el-option label="未发布" :value="0"></el-option>
                <el-option label="已发布" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="摘要" prop="summary">
              <el-input v-model="query.summary" placeholder="输入摘要"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
           <el-form-item label="发布时间">
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
            <el-button type="blue" @click="loadCoursePackage">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="$router.push({path: '/article/add'})">新增文章</el-button>
          <el-button type="danger" @click="handleDeleteSelected">删除文章</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
      <el-table
        :data="packageData.list"
        stripe
        @selection-change="changeSelection"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          sortable
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="title"
          sortable
          label="文章标题">
        </el-table-column>
        <el-table-column
          prop="summary"
          sortable
          label="文章摘要">
        </el-table-column>
        <el-table-column
          prop="coverImage"
          sortable
          label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.coverImage" alt="" style="width:80px">
          </template>
        </el-table-column>

        <el-table-column
          prop="pubState"
          sortable
          label="发布状态">
          <template slot-scope="scope">
            {{ scope.row.pubState | pubState }}
          </template>
        </el-table-column>
        <el-table-column
          prop="pubTime"
          sortable
          label="发布时间">
           <template slot-scope="scope">
            {{ scope.row.pubTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="pubBy"
          sortable
          label="发布人">
        </el-table-column>
        <el-table-column label="操作" width="135">
          <template slot-scope="scope">
             <el-tooltip class="item" effect="dark" content="上架" placement="top" v-if="scope.row.pubState===0">
              <el-button class="reset-icon" @click="upDown(scope.row)"  type="text" icon="el-icon-upload2" ></el-button>
            </el-tooltip>
             <el-tooltip class="item" effect="dark" content="下架" placement="top" v-else>
              <el-button class="reset-icon" @click="upDown(scope.row)"  type="text" icon="el-icon-download"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="预览" placement="top">
              <el-button class="reset-icon" @click="handlePreview(scope.row)"  type="text" icon="el-icon-search"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/article/${scope.row.id}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ packageData.total }} 条</span>
          <span>，共 {{ packageData.pages }} 页</span>
          <span>，{{ packageData.pageSize }} 条/页</span>
        </div>

        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          :total="packageData.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog class="article-preview"
      title="文章预览"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-tabs type="border-card" >
        <el-tab-pane label="官网模式" class="pc-pane">
          <div class="pc-header">{{form.title}}</div>
          <div class="pc-time">{{form.pubTime|datefmt('YYYY-MM-DD HH:mm:ss')}}</div>
          <div class="pc-img">
            <img :src="form.coverImage" alt="">
          </div>
          <div v-html="form.content"></div>
        </el-tab-pane>
        <el-tab-pane label="手机模式" >
          <div class="iphone-pane">
            <div class="iphone-header">{{form.title}}</div>
            <div class="pc-time">{{form.pubTime|datefmt('YYYY-MM-DD HH:mm:ss')}}</div>
            <div class="iphone-img">
               <img :src="form.coverImage" alt="">
            </div>
            <div v-html="form.content"></div>
            <div style="height: 100px"></div>
          </div>

        </el-tab-pane>
      </el-tabs>

    </el-dialog>
  </div>
</template>

<script>
import request from "@/api/article"
export default {
  data() {
    return {
      searchKeyword: '',
      queryDate: '',
      query: {
        pageNum: 1,
        pageSize: 10,
        title: "", //标题
        summary: "", //摘要
        pubState: "", //发布状态
        pubTime: "" //发布时间
      },
      packageData: [],
      selectedPackage: [],
      centerDialogVisible: false,
      form: []
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    },
    queryDate: function(val) {
      this.query.startTime = val ? val[0] : ''
      this.query.endTime = val ? val[1] : ''
    }
  },
  filters: {
    pubState(val) {
      if (val === 0) {
        return "未发布"
      } else if (val === 1) {
        return "已发布"
      }
    }
  },
  created() {
    this.loadCoursePackage()
  },
  methods: {
    loadCoursePackage() {
      this.searchKeyword = ''
      request.list(this.query).then(res => {
        this.packageData = res.data
      })
    },
    handleReset() {
      this.queryDate = ""
      this.query.startTime = ""
      this.query.endTime = ""
      this.$refs["searchForm"].resetFields()
      this.loadCoursePackage()
    },
    // 修改分页显示数
    changePageSize(num) {
      this.query.pageSize = num
      this.loadCoursePackage()
    },
    // 切换分页
    changePageNum(page) {
      this.query.pageNum = page
      this.loadCoursePackage()
    },
    changeSelection(val) {
      this.selectedPackage = val
    },
    handleDelete(row) {
      this.$confirm(`是否确定删除以下文章？（${row.title}）`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      request.del(row.id).then(res => {
        if (res.returnMsg == "success") {
          this.$message({
            message: "文章删除成功",
            type: "success"
          })
          this.loadCoursePackage()
        } else {
          this.$message.error("文章删除失败")
        }
      }).catch(() => {})
    })

    },
    // 预览
    handlePreview(row) {
      this.centerDialogVisible = true
      request.detail(row.id).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.form = res.data
        }
      })
    },
    // 点击上下架
    upDown(row) {
      if (row.pubState == 0) {
        //上架
        this.$confirm(`是否确定上架以下文章？（${row.title}）`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          request.up(row.id).then(res => {
            if (res.returnCode == "ERR_0000") {
              this.$message({
                message: "文章上架成功",
                type: "success"
              })
              this.loadCoursePackage()
            }
          })
        }).catch(() => {})
      } else {
        //下架
        this.$confirm(`是否确定下架以下文章？（${row.title}）`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          request.down(row.id).then(res => {
            if (res.returnCode == "ERR_0000") {
               this.$message({
                message: "文章下架成功",
                type: "success"
              })
              this.loadCoursePackage()
            }
          })
        }).catch(() => {})
      }
    },
    handleDeleteSelected() {
      if (this.selectedAccount.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的所有文章?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = []
        this.selectedPackage.forEach(item => {
          ids.push(item.id)
        })
        request.delBatch({ ids: ids }).then(res => {
          if (res.returnMsg == "success") {
            this.$message({
              message: "文章删除成功",
              type: "success"
            })
            this.loadCoursePackage()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pc-pane > div {
  margin-bottom: 20px;
}
.pc-header {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}
.pc-time {
  text-align: right;
}
.pc-img {
  width: 100%;
  min-height: 300px;
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
.iphone-pane {
  width: 65%;
  margin: 0 auto;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.iphone-pane div {
  padding: 10px;
}
.iphone-header {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.iphone-img {
  width: 100%;
  min-height: 200px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="scss">
.article-preview {
  .el-tabs--border-card {
    box-shadow: none;
    border: none;
  }
  .el-tabs--border-card > .el-tabs__header{
    background: none;
    border-bottom: none;
  }
  .el-tabs__nav{
    background-color: #f5f7fa;
    border: 1px solid #e4e7ed;
  }
}
</style>
