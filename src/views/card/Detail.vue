<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>卡券管理</el-breadcrumb-item>
      <el-breadcrumb-item>卡券列表</el-breadcrumb-item>
      <el-breadcrumb-item>卡券详细</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <!-- <el-form class="form-detail">
        <el-row>
          <el-col><el-form-item label="卡券名称："><h3 style="margin: 0px">{{ cardDetail.cardName }}</h3></el-form-item></el-col>
          <el-col :lg="{span: 8}" :sm="{span: 12}"><el-form-item label="卡券类型：">{{ cardDetail.type == 1 ? '体验卡' : (cardDetail == 2 ? '活动卡' : '') }}</el-form-item></el-col>
          <el-col :lg="{span: 8}" :sm="{span: 12}"><el-form-item label="关联课程包：">{{ cardDetail.packageName }}</el-form-item></el-col>
          <el-col :lg="{span: 8}" :sm="{span: 12}"><el-form-item label="状态：">{{ cardDetail.cardParentState == 1 ? '已过期' : '进行中' }}</el-form-item></el-col>
          <el-col :lg="{span: 8}" :sm="{span: 12}"><el-form-item label="有效期：">{{ cardDetail.effectiveStartDate | datefmt('YYYY-MM-DD') }} 至 {{ cardDetail.effectiveEndDate | datefmt('YYYY-MM-DD') }}</el-form-item></el-col>
          <el-col :lg="{span: 8}" :sm="{span: 12}"><el-form-item label="总库存：">{{ cardDetail.cardTotalNumber }}</el-form-item></el-col>
          <el-col :lg="{span: 8}" :sm="{span: 12}"><el-form-item label="剩余库存：">{{ cardDetail.cardFreeNumber }}</el-form-item></el-col>
        </el-row>
      </el-form> -->
      <el-table
        border
        :data="cardDetail"
        style="width: 100%">
        <el-table-column
          prop="cardName"
          label="卡券名称">
        </el-table-column>
        <el-table-column
          prop="type"
          label="卡券类型">
          <template slot-scope="scope">
            {{ scope.row.type == 1 ? '体验卡' : (scope.row.type == 2 ? '活动卡' : '') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="packageName"
          label="关联课程包">
        </el-table-column>
        <el-table-column
          prop="cardParentState"
          label="状态">
          <template slot-scope="scope">
            {{ scope.row.cardParentState == 1 ? '已过期' : '进行中' }}
          </template>
        </el-table-column>
        <el-table-column
          label="有效期">
          <template slot-scope="scope">
            {{ scope.row.effectiveStartDate | datefmt('YYYY-MM-DD') }}
            至
            {{ scope.row.effectiveEndDate | datefmt('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="cardTotalNumber"
          label="总库存">
        </el-table-column>
        <el-table-column
          prop="cardFreeNumber"
          label="剩余库存">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card shadow="never" class="head-search-card mt20">
      <el-form :inline="true" :model="query" ref="searchForm" style="margin-bottom: -22px">
        <el-form-item label="卡券号码" prop="cardNo">
          <el-input v-model="query.cardNo"></el-input>
        </el-form-item>
        <el-form-item label="关联课程包" prop="packageName">
          <el-input v-model="query.packageName"></el-input>
        </el-form-item>
        <el-form-item label="所属机构" prop="displayName">
          <el-input v-model="query.displayName"></el-input>
        </el-form-item>
        <el-form-item label="接收手机" prop="phoneNumber">
          <el-input v-model="query.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="当前状态" prop="usedState">
          <el-select v-model="query.usedState">
            <el-option label="未使用" :value="0"></el-option>
            <el-option label="已使用" :value="1"></el-option>
            <el-option label="已过期" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" @click="loadCouponList">查 询</el-button>
          <el-button @click="handleReset">重 置</el-button>
        </el-form-item>
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
        :data="couponData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="cardNo"
          sortable
          label="卡号">
        </el-table-column>
        <el-table-column
          prop="packageName"
          sortable
          label="关联课程包">
        </el-table-column>
        <el-table-column
          prop="displayName"
          sortable
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="cardDwz"
          sortable
          label="短链">
        </el-table-column>
        <el-table-column
          sortable
          label="发布时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          sortable
          label="接收手机号">
        </el-table-column>
        <el-table-column
          prop="sendTime"
          sortable
          label="发送时间">
          <template slot-scope="scope">
            {{ scope.row.sendTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="usedTime"
          sortable
          label="使用时间">
          <template slot-scope="scope">
            {{ scope.row.usedTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="userBy"
          sortable
          label="使用学员"
          width="100">
        </el-table-column>
        <el-table-column
          prop="sendState"
          sortable
          label="发送状态"
          width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.sendState == 0" class="label label-success">成功</span>
            <span v-else-if="scope.row.sendState == 1" class="label label-danger">失败</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="usedState"
          sortable
          label="状态"
          width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.usedState == 2" class="label label-danger">已过期</span>
            <span v-else-if="scope.row.usedState == 1">已使用</span>
            <span v-else-if="scope.row.usedState == 0" class="label label-success">未使用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.sendState == 1" class="item" effect="dark" content="重发" placement="top">
              <el-button class="reset-icon" @click="handleSendSms(scope.row)" type="text" icon="el-icon-refresh"></el-button>
            </el-tooltip>
            <el-tooltip v-if="!scope.row.cardDwz" class="item" effect="dark" content="生成短链" placement="top">
              <el-button class="reset-icon" @click="handleCreateDwz(scope.row)" type="text"><i class="iconfont">&#xe628;</i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ couponData.total }} 条</span>
          <span>，共 {{ couponData.pages }} 页</span>
          <span>，{{ couponData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          @current-change="pageChange"
          @size-change="sizeChange"
          :current-page="couponData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="couponData.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="couponData.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCardDetail, getCouponList, deleteCoupon, sendSms, createDwz } from '@/api/card'
export default {
  data() {
    return {
      cardDetail: [],
      searchKeyword: '',
      query: {
        couponParentId: this.$route.params.id,
        pageNum: 1,
        pageSize: 10
      },
      couponData: []
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  created() {
    // 卡券详情
    getCardDetail(this.$route.params.id).then(res => {
      this.cardDetail = [res.data]
    })

    this.loadCouponList()
  },
  methods: {
    loadCouponList() {
      this.searchKeyword = ''
      getCouponList(this.query).then(res => {
        if (res.returnMsg == 'success') this.couponData = res.data
      })
    },
    //改变每页条数
    sizeChange(val) {
      this.query.pageSize = val
      this.loadCouponList()
    },
    //改变页数
    pageChange(val) {
      this.query.pageNum = val
      this.loadCouponList()
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.loadCouponList()
    },
    handleDelete(row) {
      this.$confirm('是否确定删除该卡券？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCoupon(row.id).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '卡券删除成功',
              type: 'success'
            })
            this.loadCouponList()
          } else {
            this.$message.error('卡券删除失败')
          }
        })
      })
    },
    handleSendSms(row) {
      this.$confirm('确定重新发送该卡券？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        sendSms({
          cardDetailsId: row.cardDetailsId,
          phoneNumber: row.phoneNumber,
          dwz: row.cardDwz
        }).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
          } else {
            this.$message.error('提交失败')
          }
        })
      })
    },
    handleCreateDwz(row) {
      createDwz({
        id: row.id,
        cardNo: row.cardNo
      }).then(res => {
        if(res.returnMsg == 'success') {
          this.$message({
            message: '短链生成成功',
            type: 'success'
          })
          this.loadCouponList()
        } else {
          this.$message.error('短链生成失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.form-detail {
  .el-form-item {
    margin: 0 20px 0 0;
    &:last-child {
      margin: 0px;
    }
  }
  .el-form-item__label {
    padding-right: 0px;
  }
}
</style>
