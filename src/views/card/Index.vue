<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>卡券管理</el-breadcrumb-item>
      <el-breadcrumb-item>卡券列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="85px">
        <el-row :gutter="20">
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
            <el-form-item label="有效期">
              <el-date-picker
                v-model="queryEffectiveDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="剩余库存">
              <el-row style="overflow: hidden">
                <el-col :span="11"><el-input-number v-model="query.stockStartNum" :controls="false" style="width: 100%"></el-input-number></el-col>
                <el-col :span="2" style="text-align: center">-</el-col>
                <el-col :span="11"><el-input-number v-model="query.stockEndNum" :controls="false" style="width: 100%"></el-input-number></el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="卡券状态" prop="cardParentState">
              <el-select v-model="query.cardParentState" placeholder="" style="width: 100%">
                <el-option label="未过期" :value="0"></el-option>
                <el-option label="已过期" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadCardList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="$router.push({path: '/card/add'})">新增卡券</el-button>
          <el-button type="green" @click="$router.push({path: '/card/release'})">卡券发布</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="cradData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="cardName"
          sortable
          label="卡券名称">
        </el-table-column>
        <el-table-column
          prop="type"
          sortable
          label="卡券类型">
          <template slot-scope="scope">
            {{ scope.row.type == 1 ? '体验卡' : (scope.row.type == 2 ? '活动卡' : '') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="packageName"
          sortable
          label="关联课程包">
        </el-table-column>
        <el-table-column
          sortable
          label="有效期">
          <template slot-scope="scope">
            {{ scope.row.effectiveStartDate | datefmt('YYYY-MM-DD') }} 至 {{ scope.row.effectiveEndDate | datefmt('YYYY-MM-DD') }}
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
          prop="cardTotalNumber"
          sortable
          label="总库存">
        </el-table-column>
        <el-table-column
          prop="cardFreeNumber"
          sortable
          label="剩余库存">
        </el-table-column>
        <el-table-column
          prop="cardParentState"
          sortable
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.cardParentState == 1" class="label label-danger">已过期</span>
            <span v-else class="label label-warning">进行中</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="135">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="生成卡券" placement="top">
              <el-button class="reset-icon" @click="handleGenerateCoupon(scope.row)" type="text"><i class="iconfont">&#xe879;</i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/card/${scope.row.id}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/card/${scope.row.id}/list` })" type="text" icon="el-icon-search"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ cradData.total }} 条</span>
          <span>，共 {{ cradData.pages }} 页</span>
          <span>，{{ cradData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          @current-change="pageChange"
          @size-change="sizeChange"
          :current-page="cradData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="cradData.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="cradData.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCardList, deleteCards, addCardCoupon } from '@/api/card'
export default {
  data() {
    return {
      searchKeyword: '',
      queryEffectiveDate: '',
      query: {
        pageNum: 1,
        pageSize: 10
      },
      cradData: {}
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    },
    queryEffectiveDate: function(val) {
      this.query.startTime = val ? val[0] : ''
      this.query.endTime = val ? val[1] : ''
    }
  },
  created() {
    this.loadCardList()
  },
  methods: {
    loadCardList() {
      this.searchKeyword = ''
      getCardList(this.query).then(res => {
        if (res.returnMsg == 'success') this.cradData = res.data
      })
    },
    handleReset() {
      this.queryEffectiveDate = ''
      // this.query.startTime = ''
      // this.query.endTime = ''
      // this.query.stockStartNum = ''
      // this.query.stockEndNum = ''
      delete this.query.startTime
      delete this.query.endTime
      delete this.query.stockStartNum
      delete this.query.stockEndNum
      this.$refs['searchForm'].resetFields()
      this.loadCardList()
    },
    //改变每页条数
    sizeChange(val) {
      this.query.pageSize = val
      this.loadCardList()
    },
    //改变页数
    pageChange(val) {
      this.query.pageNum = val
      this.loadCardList()
    },
    handleGenerateCoupon(row) {
      this.$prompt('请输入此次需要生成的卡券数量', '生成卡券', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '输入正整数，最大数量不超过100',
        inputValidator: function(value) {
          if (!(/(^[1-9]\d*$)/.test(value))) {
            return '请输入正整数'
          } else if (value > 100) {
            return '最大数量不能超过100'
          }
          return true
        }
      }).then(({ value }) => {
        addCardCoupon({
          cardMakeNum: value,
          couponParentId: row.id
        }).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '卡券生成成功',
              type: 'success'
            })
          } else if (res.returnCode == '40000077') {
            this.$message.error('卡券已经过期')
          } else {
            this.$message.error('卡券生成失败')
          }
        })
      }).catch(() => {     
      })
    },
    handleDelete(row) {
      this.$confirm('是否确定删除该卡券？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCards(row.id).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '卡券删除成功',
              type: 'success'
            })
            this.loadCardList()
          } else {
            this.$message.error('卡券删除失败')
          }
        })
      })
    }
  }
}
</script>
