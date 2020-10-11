<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>卡券管理</el-breadcrumb-item>
      <el-breadcrumb-item>卡券明细</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form label-width="90px" :model="query" ref="searchForm">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}" v-if="$store.state.account.type == 0">
            <el-form-item label="机构名称" prop="displayName">
              <el-input v-model="query.displayName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="卡券号码" prop="cardNo">
              <el-input v-model="query.cardNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="卡券名称" prop="cardName">
              <el-input v-model="query.cardName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="关联课程包" prop="packageName">
              <el-input v-model="query.packageName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="发送状态" prop="sendState">
              <el-select v-model="query.sendState" placeholder="" style="width: 100%">
                <el-option label="成功" :value="0"></el-option>
                <el-option label="失败" :value="1"></el-option>
                <el-option label="未发送" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="使用状态" prop="usedState">
              <el-select v-model="query.usedState" placeholder="" style="width: 100%">
                <el-option label="未使用" :value="0"></el-option>
                <el-option label="已使用" :value="1"></el-option>
                <el-option label="已过期" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadCouponList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="green" @click="$router.push({path: '/card/send'})">卡券发送</el-button>
        </div>
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
          prop="cardName"
          sortable
          label="卡券名称">
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
            <span v-else-if="scope.row.sendState == 2">未发送</span>
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
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="重发短信" placement="top">
              <el-button class="reset-icon" @click="handleSendSms(scope.row)" type="text" icon="el-icon-refresh"></el-button>
            </el-tooltip>
            <el-tooltip v-if="!scope.row.cardDwz" class="item" effect="dark" content="生成短链" placement="top">
              <el-button class="reset-icon" @click="handleCreateDwz(scope.row)" type="text"><i class="iconfont">&#xe628;</i></el-button>
            </el-tooltip>
            <!-- 只能系统账号可删除 -->
            <template v-if="$store.state.account.type == 0">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
              </el-tooltip>
            </template>
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
import { getCouponList, deleteCoupon, sendSms, createDwz } from '@/api/card'
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
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
    this.loadCouponList()
  },
  methods: {
    loadCouponList() {
      this.searchKeyword = ''
      getCouponList(this.query).then(res => {
        if (res.returnMsg == 'success') this.couponData = res.data
      })
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
      }).catch(() => {})
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
    }
  }
}
</script>
