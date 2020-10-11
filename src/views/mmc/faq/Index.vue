<template>
  <div>
    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="75px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="标题" prop="title">
              <el-input v-model="query.title" placeholder="输入标题" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="问题类型" prop="type">
              <el-select placeholder="请选择问题类型" v-model="query.type" style="width: 100%" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in typeData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="状态" prop="status">
              <el-select placeholder="请选择状态" v-model="query.status" style="width: 100%" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in statusData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_mmc_faq_list'" @click="loadCoursePackage">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_mmc_faq_add'" @click="$router.push({path: '/mmc/faq/add'})">新增问题</el-button>
          <el-button type="danger" v-has="'res_mmc_faq_batch_delete'" @click="handleDeleteSelected">删除问题</el-button>
          <el-button type="green" v-has="'res_mmc_faq_exports'" @click="handleExports">导出数据</el-button>
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
          label="序号"
          width="80">
          <template slot-scope="scope">
            {{ packageData.total - scope.$index - ((query.pageNum - 1) * query.pageSize) }}
          </template>
        </el-table-column>
        <!--
        <el-table-column
          sortable
          prop="id"
          label="编号"
          width="80">
        </el-table-column>-->
        <el-table-column
          prop="questionTitle"
          sortable
          label="问题">
        </el-table-column>
        <el-table-column
                prop="questionType"
                sortable
                label="问题类型">
                <template slot-scope="scope">
                 {{ scope.row.questionType === 1 ? '常见问题' : '异常问题'}}
               </template>
        </el-table-column>
        <el-table-column
          prop="questionContent"
          sortable
          label="解决方法">
          <template slot-scope="scope">
            <div v-html="scope.row.questionContent"></div>
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
          prop="createBy"
          sortable
          label="创建人">
        </el-table-column>
        <el-table-column
                prop="updateTime"
                sortable
                label="修改时间">
          <template slot-scope="scope">
            {{ scope.row.updateTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
                prop="updateBy"
                sortable
                label="修改人">
        </el-table-column>
        <el-table-column
                prop="status"
                sortable
                label="状态">
          <template slot-scope="scope">
            {{scope.row.status===1 ? '启用':'禁用'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="135">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-has="'res_mmc_faq_detail'" content="查看" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/mmc/faq/detail/${scope.row.id}` })"  type="text" >
                <i class="iconfont">&#xe605;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_mmc_faq_edit'" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/mmc/faq/${scope.row.id}` })" type="text" >
                <i class="iconfont">&#xe71c;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_mmc_faq_detete'" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" >
                <i class="iconfont">&#xe614;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_mmc_faq_enable'" content="启用" placement="top" v-if="scope.row.status==2">
             <el-button class="reset-icon" @click="upDown(scope.row)"  type="text" >
              <i class="iconfont">&#xe60b;</i>
             </el-button>
           </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_minle_faq_disabled'" content="停用" placement="top" v-else>
             <el-button class="reset-icon" @click="upDown(scope.row)"  type="text" >
                <i class="iconfont">&#xe673;</i>
             </el-button>
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

  </div>
</template>

<script>
import request from "@/api/mmc/faq"
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
        title:'',
        source:0,
        type:'',
        status:'',
        pageNum: 1,
        pageSize: 10,
      },
      typeData: [],
      statusData: [],
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
  },
  filters: {

  },
  created() {
    this.loadCoursePackage()
    this.typeRequest()
    this.statusRequest()
  },
  methods: {
    loadCoursePackage() {
      this.searchKeyword = ''
      request.list(this.query).then(res => {
        this.packageData = res.data
      })
    },
    handleReset() {
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
      this.$confirm(`是否确定删除该条问题？（${row.questionTitle}）`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      request.del(row.id).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.$message({
            message: "问题删除成功",
            type: "success"
          })
          this.loadCoursePackage()
        } else {
          this.$message.error("问题删除失败")
        }
      }).catch(() => {})
    })

    },
    // 点击上下架
    upDown(row) {
      if (row.status == 2) {
        //启用
        this.$confirm(`确定启用该问题？（${row.questionTitle}）`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          request.enable(row.id).then(res => {
            if (res.returnCode == "ERR_0000") {
              this.$message({
                message: "问题启用成功",
                type: "success"
              })
              this.loadCoursePackage()
            }
          })
        }).catch(() => {})
      } else {
        //停用
        this.$confirm(`确定停用该问题？（${row.questionTitle}）`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          request.disable(row.id).then(res => {
            if (res.returnCode == "ERR_0000") {
               this.$message({
                message: "问题已停用",
                type: "success"
              })
              this.loadCoursePackage()
            }
          })
        }).catch(() => {})
      }
    },
    statusRequest() {
      request.statusFAQ({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.statusData = res.data
        }
      })
    },
    typeRequest() {
      request.typeFAQ({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.typeData = res.data
        }
      })
    },
    handleDeleteSelected() {
      if (this.selectedPackage.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的所有问题?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = []
        this.selectedPackage.forEach(item => {
          ids.push(item.id)
        })
        request.delBatch(ids).then(res => {
          if (res.returnCode == "ERR_0000") {
            this.$message({
              message: "问题删除成功",
              type: "success"
            })
            this.loadCoursePackage()
          }
        })
      })
    },
    handleExports(){
      request.exportsData({'source':2}).then(res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
        let objectUrl = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = objectUrl
        link.style.display = 'none'
        link.download = 'FAQ_TR_' + new Date().getTime()
        link.click()
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
