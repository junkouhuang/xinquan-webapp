<template>
  <div>
    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="75px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="订单号" prop="orderNo" >
              <el-input v-model="query.orderNo" onkeyup="value=value.replace(/[^\d]/g,'')" maxlength="19" show-word-limit placeholder="输入订单号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="会员号" prop="userId" >
              <el-input v-model="query.userId" placeholder="输入会员号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="会员名称" prop="userName" >
              <el-input v-model="query.userName" placeholder="输入会员用户名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="订单类型" prop="orderType">
              <el-select placeholder="请选择订单类型" v-model="query.orderType" style="width: 100%" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in orderTypesData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="抵扣方式" prop="deduction">
              <el-select placeholder="请选择抵扣方式" v-model="query.deduction" style="width: 100%" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in deductionTypesData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="支付方式" prop="paymentType">
              <el-select placeholder="请选择支付方式" v-model="query.paymentType" style="width: 100%" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in paymentWaysData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="订单状态" prop="status">
              <el-select placeholder="请选择订单状态" v-model="query.status" style="width: 100%" clearable >
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in orderStatusData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
           <el-form-item label="下单日期">
              <el-date-picker
                v-model="queryOrderDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
           <el-form-item label="支付日期">
              <el-date-picker
                v-model="queryPayDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
           <el-form-item label="发货日期">
              <el-date-picker
                v-model="queryDeliveryDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
           <el-form-item label="收货日期">
              <el-date-picker
                v-model="queryConfirmDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="收货人" prop="consigneeName" >
              <el-input v-model="query.consigneeName" placeholder="输入收货人姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="联系电话" prop="phone" >
              <el-input v-model="query.phone" placeholder="输入收货人联系电话" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="快递公司" prop="expressComName">
              <el-select placeholder="请选择快递公司" v-model="query.expressComName" style="width: 100%" clearable >
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in expressCompanyData"
                    :key="item.express"
                    :label="item.express"
                    :value="item.express"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_feedback_list'" @click="loadOrderPackage">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <!--<el-button type="blue" v-has="'res_feedback_add'" @click="$router.push({path: '/minle/order/add'})">新增反馈</el-button>-->
          <el-button type="danger" v-has="'res_feedback_delete'" @click="handleDeleteSelected">批量删除</el-button>
          <el-button type="green" v-has="'res_feedback_exports'" @click="handleExports">导出订单</el-button>
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
          width="60">
          <template slot-scope="scope">
            {{ packageData.total - scope.$index - ((query.pageNum - 1) * query.pageSize) }}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="orderNo"
          label="订单号">
        </el-table-column>
        <el-table-column
                prop="orderType"
                sortable
                label="订单类型">
                <template slot-scope="scope">
                  {{ scope.row.orderType | orderType }}
                </template>
        </el-table-column>
        <el-table-column
                prop="totalAmount"
                sortable
                label="总金额">
                <template slot-scope="scope">
                  ￥{{ scope.row.totalAmount }}
                </template>
        </el-table-column>
        <el-table-column
          prop="deduction"
          sortable
          label="抵扣方式">
          <template slot-scope="scope">
            {{ scope.row.deduction | deduction }}
          </template>
        </el-table-column>
        <el-table-column
          prop="deductionAmount"
          sortable
          label="抵扣金额">
          <template slot-scope="scope">
            ￥{{ scope.row.deductionAmount | deductionAmount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="postage"
          sortable
          label="邮费">
          <template slot-scope="scope">
            {{ scope.row.postage | postage }}
          </template>
        </el-table-column>
        <el-table-column
          prop="realpay"
          sortable
          label="实付金额">
          <template slot-scope="scope">
            ￥{{ scope.row.realpay }}
          </template>
        </el-table-column>
        <el-table-column
          prop="paymentType"
          sortable
          label="支付方式">
          <template slot-scope="scope">
            {{ scope.row.paymentType | paymentType }}
          </template>
        </el-table-column>
        <el-table-column
          prop="timePayment"
          sortable
          label="支付时间">
          <template slot-scope="scope">
           {{ scope.row.timePayment | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="userId"
          sortable
          label="会员号">
        </el-table-column>
        <el-table-column
                prop="userName"
                sortable
                label="会员名">
        </el-table-column>
        <el-table-column
                prop="status"
                sortable
                label="订单状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 0" class="label label-warning">{{ scope.row.status | status }}</span>
                  <span v-if="scope.row.status == 1" class="label label-success">{{ scope.row.status | status }}</span>
                  <span v-if="scope.row.status == 2" class="label label-info">{{ scope.row.status | status }}</span>
                  <span v-if="scope.row.status == 3" class="label label-default">{{ scope.row.status | status }}</span>
                  <span v-if="scope.row.status == 4" class="label label-primary">{{ scope.row.status | status }}</span>
                </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable
          label="下单时间">
          <template slot-scope="scope">
           {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
                prop="consigneeName"
                sortable
                label="收货人">
        </el-table-column>
        <el-table-column
                prop="phone"
                sortable
                label="联系电话">
        </el-table-column>
        <el-table-column
                prop="expressComName"
                sortable
                label="快递公司">
        </el-table-column>
        
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-has="'res_feedback_detail'" content="查看" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/minle/order/detail/${scope.row.id}` })"  type="text" >
                <i class="iconfont">&#xe605;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_feedback_edit'" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/minle/order/${scope.row.id}` })" type="text" >
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
import request from "@/api/minle/order"
export default {
  data() {
    return {
      searchKeyword: '',
      queryOrderDate: '',
      queryPayDate: '',
      queryDeliveryDate: '',
      queryConfirmDate: '',
      query: {
        orderNo:'',
        userId:'',
        userName:'',
        orderType:'',
        deduction:'',
        paymentType:'',
        status:'',
        createStartTime:'',
        createEndTime:'',
        payStartTime:'',
        payEndTime:'',
        deliveryStartTime:'',
        deliveryEndTime:'',
        confirmStartTime:'',
        confirmEndTime:'',
        consigneeName:'',
        phone:'',
        expressComName:'',
        pageNum: 1,
        pageSize: 10,
      },
      paymentWaysData: [],
      orderStatusData: [],
      orderTypesData: [],
      deductionTypesData: [],
      expressCompanyData: [],
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
    queryOrderDate: function(val) {
      this.query.createStartTime = val ? val[0] : ''
      this.query.createEndTime = val ? val[1] : ''
    },
    queryPayDate: function(val) {
      this.query.payStartTime = val ? val[0] : ''
      this.query.payEndTime = val ? val[1] : ''
    },
    queryDeliveryDate: function(val) {
      this.query.deliveryStartTime = val ? val[0] : ''
      this.query.deliveryEndTime = val ? val[1] : ''
    },
    queryConfirmDate: function(val) {
      this.query.confirmStartTime = val ? val[0] : ''
      this.query.confirmEndTime = val ? val[1] : ''
    },
  },
  filters: {
    orderType(val) {
      if (val === 0) {
        return "普通订单"
      } else if (val === 1) {
        return "代付订单"
      } else if (val === 2) {
        return "米铺订单"
      } else if (val === 3) {
        return "开通会员"
      } else if (val === 4) {
        return "米铺认证费"
      }
    },
    deduction(val){
      if (val === 0 || val === null) {
        return "无"
      } else if (val === 1) {
        return "米粒抵扣"
      } else if (val === 2) {
        return "免单优惠"
      } else if (val === 3) {
        return "钱包支付"
      }
    },
    deductionAmount(val){
      if (val === null || val === '') {
        return "0"
      } else {
        return val
      }
    },
    postage(val){
      if (val === null || val === '') {
        return "包邮"
      } else {
        return '￥' + val
      }
    },
    paymentType(val){
      if (val === 0) {
        return "微信支付"
      }
    },
    status(val){
      if (val === 0) {
        return "待付款"
      } else if (val === 1) {
        return "待发货"
      } else if (val === 2) {
        return "待收货"
      } else if (val === 3) {
        return "已完成"
      } else if (val === 4) {
        return "订单取消"
      }
    },
  },
  created() {
    this.loadOrderPackage()
    this.expressCompanyRequest()
    this.orderStatusRequest()
    this.paymentWaysRequest()
    this.orderTypesRequest()
    this.deductionTypesRequest()
  },
  methods: {
    loadOrderPackage() {
      this.searchKeyword = ''
      request.list(this.query).then(res => {
        this.packageData = res.data
      })
    },
    handleReset() {
      this.$refs["searchForm"].resetFields()
      this.queryDate = ''
      this.loadOrderPackage()
    },
    // 修改分页显示数
    changePageSize(num) {
      this.query.pageSize = num
      this.loadOrderPackage()
    },
    // 切换分页
    changePageNum(page) {
      this.query.pageNum = page
      this.loadOrderPackage()
    },
    changeSelection(val) {
      this.selectedPackage = val
    },
    handleDelete(row) {
      this.$confirm(`确定删除该订单，删除后将不可恢复？（单号：${row.orderNo}）`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      request.del(row.orderNo).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.$message({
            message: "订单删除成功",
            type: "success"
          })
          this.loadCoursePackage()
        } else {
          this.$message.error("订单删除失败")
        }
      }).catch(() => {})
    })
    },
    expressCompanyRequest() {
      request.expressCompany({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.expressCompanyData = res.data
        }
      })
    },
    orderStatusRequest() {
      request.orderStatus({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.orderStatusData = res.data
        }
      })
    },
    paymentWaysRequest() {
      request.paymentWays({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.paymentWaysData = res.data
        }
      })
    },
    orderTypesRequest() {
      request.orderTypes({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.orderTypesData = res.data
        }
      })
    },
    deductionTypesRequest() {
      request.deductionTypes({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.deductionTypesData = res.data
        }
      })
    },
    handleDeleteSelected() {
      if (this.selectedPackage.length <= 0) {
        this.$message.error('请选择删除订单')
        return
      }
      this.$confirm("确定要删除选中的订单，删除后将不可恢复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let orders = []
        this.selectedPackage.forEach(item => {
          orders.push(item.orderNo)
        })
        request.delBatch(orders).then(res => {
          if (res.returnCode == "ERR_0000") {
            this.$message({
              message: "订单删除成功",
              type: "success"
            })
            this.loadOrderPackage()
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
        link.download = 'ORDER_RD_' + new Date().getTime()
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
