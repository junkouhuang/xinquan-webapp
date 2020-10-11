<template>
  <div>
    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="75px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
           <el-form-item label="受理时间">
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
            <el-form-item label="客户类型" prop="type">
              <el-select placeholder="输入客户类型" v-model="form.type" style="max-width: 600px;" filterable clearable>
                <el-option v-for="item in customerTypesData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="维护人" prop="operator">
              <el-select placeholder="输入维护人" v-model="query.operator" filterable clearable>
                <el-option v-for="item in operatorData"
                    :key="item.accountName"
                    :label="item.realName"
                    :value="item.accountName">
                    <span style="float: left">{{ item.realName }}</span>
                    <span style="float: left; padding-left:20px;color:#C0C4CC;font-size: 13px">{{ item.accountName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="受理类型" prop="accept">
              <el-select placeholder="请选择受理类型" v-model="query.accept" style="width: 100%" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in acceptanceTypesData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="问题级别" prop="level">
              <el-select placeholder="请选择问题级别" v-model="query.level" style="width: 100%" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in problemLevelsData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="问题类别" prop="category">
              <el-select placeholder="请选择问题类别" v-model="query.category" style="width: 100%" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in problemCategoryData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="服务方式" prop="method">
              <el-select placeholder="请选择服务方式" v-model="query.method" style="width: 100%" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in serviceMethodsData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="任务状态" prop="status">
              <el-select placeholder="请选择任务状态" v-model="query.status" style="width: 100%"
              clearable multiple allow-create defult-first-optio>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in serviceStatusData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_feedback_list'" @click="loadCoursePackage">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_feedback_add'" @click="$router.push({path: '/operation/feedback/add'})">新增反馈</el-button>
          <el-button type="danger" v-has="'res_feedback_delete'" @click="handleDeleteSelected">删除反馈</el-button>
          <el-button type="green" v-has="'res_feedback_exports'" @click="handleExports">导出记录</el-button>
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
          prop="acceptTime"
          sortable
          label="受理时间">
          <template slot-scope="scope">
           {{ scope.row.acceptTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
                prop="acceptType"
                sortable
                label="受理类型">
                <template slot-scope="scope">
                  {{ scope.row.acceptType | acceptType }}
                </template>
        </el-table-column>
        <el-table-column
          prop="customerType"
          sortable
          label="客户类型">
          <template slot-scope="scope">
            {{ scope.row.customerType | customerType }}
          </template>
        </el-table-column>
        <el-table-column
          prop="customerName"
          sortable
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="operator"
          sortable
          label="维护人">
        </el-table-column>
        <el-table-column
                prop="question"
                sortable
                label="反馈信息">
        </el-table-column>
        <el-table-column
                prop="questionLevel"
                sortable
                label="问题级别">
                <template slot-scope="scope">
                  {{ scope.row.questionLevel | questionLevel }}
                </template>
        </el-table-column>
        <el-table-column
                prop="serviceMethod"
                sortable
                label="服务方式">
                <template slot-scope="scope">
                  {{ scope.row.serviceMethod | serviceMethod }}
                </template>
        </el-table-column>
        <el-table-column
                prop="questionCategory"
                sortable
                label="任务类型">
                <template slot-scope="scope">
                  {{ scope.row.questionCategory | questionCategory }}
                </template>
        </el-table-column>
        <el-table-column
                prop="serviceStatus"
                sortable
                label="任务状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.serviceStatus == 1" class="label label-success">{{ scope.row.serviceStatus | serviceStatus }}</span>
                  <span v-if="scope.row.serviceStatus == 2" class="label label-warning">{{ scope.row.serviceStatus | serviceStatus }}</span>
                  <span v-if="scope.row.serviceStatus == 3" class="label label-default">{{ scope.row.serviceStatus | serviceStatus }}</span>
                  <span v-if="scope.row.serviceStatus == 4" class="label label-danger">{{ scope.row.serviceStatus | serviceStatus }}</span>
                  <span v-if="scope.row.serviceStatus == 5" class="label label-info">{{ scope.row.serviceStatus | serviceStatus }}</span>
                </template>
        </el-table-column>
        <el-table-column
                prop="finishTime"
                sortable
                label="最新处理时间">
        </el-table-column>
        <el-table-column label="操作" width="135">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-has="'res_feedback_detail'" content="查看" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/operation/feedback/detail/${scope.row.id}` })"  type="text" >
                <i class="iconfont">&#xe605;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_feedback_edit'" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/operation/feedback/${scope.row.id}` })" type="text" >
                <i class="iconfont">&#xe71c;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_feedback_delete'" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" >
                <i class="iconfont">&#xe614;</i>
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
import request from "@/api/feedback"
export default {
  data() {
    return {
      searchKeyword: '',
      queryDate: '',
      query: {
        start:'',
        end:'',
        type:'',
        operator:'',
        accept:'',
        level:'',
        category:'',
        method:'',
        status:[],
        pageNum: 1,
        pageSize: 10,
      },
      serviceMethodsData: [],
      serviceStatusData: [],
      problemCategoryData: [],
      problemLevelsData: [],
      acceptanceTypesData: [],
      customerTypesData: [],
      operatorData: [],
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
      this.query.start = val ? val[0] : ''
      this.query.end = val ? val[1] : ''
    },
  },
  filters: {
    acceptType(val) {
      if (val === 1) {
        return "微信"
      } else if (val === 2) {
        return "电话"
      }
    },
    serviceMethod(val){
      if (val === 1) {
        return "一般"
      } else if (val === 2) {
        return "紧急"
      }
    },
    questionCategory(val){
      if (val === 1) {
        return "操作问题"
      } else if (val === 2) {
        return "流程问题"
      } else if (val === 3) {
        return "系统问题"
      } else if (val === 4) {
        return "网络问题"
      } else if (val === 5) {
        return "业务问题"
      } else if (val === 6) {
        return "渤海银行(渤商赢)业务问题"
      }
    },
    questionLevel(val){
      if (val === 1) {
        return "轻微"
      } else if (val === 2) {
        return "一般"
      } else if (val === 3) {
        return "严重"
      }
    },
    serviceStatus(val){
      if (val === 1) {
        return "未解决"
      } else if (val === 2) {
        return "二次未解决"
      } else if (val === 3) {
        return "完成"
      } else if (val === 4) {
        return "超时未解决"
      } else if (val === 5) {
        return "超时完成"
      }
    },
    customerType(val){
      if (val === 1) {
        return "代理商"
      } else if (val === 2) {
        return "业务员"
      } else if (val === 3) {
        return "VIP会员"
      } else if (val === 4) {
        return "普通消费者"
      } else if (val === 5) {
        return "经营企业(批发)"
      } else if (val === 6) {
        return "第三终端客户(药店/诊所/卫生室)"
      } else if (val === 7) {
        return "生产企业"
      } else if (val === 8) {
        return "原辅料厂商"
      } else if (val === 9) {
        return "保理客户"
      } else if (val === 10) {
        return "供应商"
      } else if (val === 11) {
        return "零售实体店(个体经营户)"
      } else if (val === 12) {
        return "医药自然人"
      } else if (val === 13) {
        return "数据公司(DB) "
      } else if (val === 14) {
        return "连锁门店"
      } else if (val === 15) {
        return "普通用户"
      } else if (val === 16) {
        return "合作企业"
      } else if (val === 17) {
        return "第三方合作平台"
      }
    },
  },
  created() {
    this.loadCoursePackage()
    this.operatorRequest()
    this.customerTypesRequest()
    this.serviceStatusRequest()
    this.serviceMethodsRequest()
    this.problemCategoryRequest()
    this.problemLevelsRequest()
    this.acceptanceTypesRequest()
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
      this.queryDate = ''
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
      this.$confirm(`确定删除该反馈内容？（${row.question}）`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      request.del(row.id).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.$message({
            message: "反馈删除成功",
            type: "success"
          })
          this.loadCoursePackage()
        } else {
          this.$message.error("反馈删除失败")
        }
      }).catch(() => {})
    })
    },
    operatorRequest() {
      request.operatorFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.operatorData = res.data
        }
      })
    },
    customerTypesRequest() {
      request.customerTypesFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.customerTypesData = res.data
        }
      })
    },
    serviceStatusRequest() {
      request.serviceStatusFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.serviceStatusData = res.data
        }
      })
    },
    serviceMethodsRequest() {
      request.serviceMethodsFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.serviceMethodsData = res.data
        }
      })
    },
    problemCategoryRequest() {
      request.problemCategoryFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.problemCategoryData = res.data
        }
      })
    },
    problemLevelsRequest() {
      request.problemLevelsFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.problemLevelsData = res.data
        }
      })
    },
    acceptanceTypesRequest() {
      request.acceptanceTypesFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.acceptanceTypesData = res.data
        }
      })
    },
    handleDeleteSelected() {
      if (this.selectedPackage.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的所有反馈?", "提示", {
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
              message: "反馈删除成功",
              type: "success"
            })
            this.loadCoursePackage()
          }
        })
      })
    },
    handleExports(){
      request.exportsData().then(res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
        let objectUrl = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = objectUrl
        link.style.display = 'none'
        link.download = 'FEEDBACK_TR_' + new Date().getTime()
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
