<template>
  <div>
    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="50px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="域名" prop="domain">
              <el-input v-model="query.domain" placeholder="请输入域名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadDomainList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="handleAddDomain">新增域名</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="domainData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="domainId"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="domain"
          sortable
          label="域名">
        </el-table-column>
        <el-table-column
          prop="updateBy"
          sortable
          label="修改人">
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
          prop="remark"
          sortable
          label="备注">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ domainData.total }} 条</span>
          <span>，共 {{ domainData.pages }} 页</span>
          <span>，{{ domainData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="domainData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="domainData.pageSize"
          :total="domainData.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      title="添加域名"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="domainForm" :model="form" :rules="domainRules" label-width="50px">
        <el-form-item label="域名" prop="domain">
          <el-input v-model="form.domain"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="margin-bottom: 0px">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="green" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDomainList, deleteDomain, addDomain } from '@/api/url'
export default {
  data() {
    const validateURL = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入域名'))
      } else if (!this.validate.url(value)) {
        return callback(new Error('请输入正确的域名'))
      }
      callback()
    }
    return {
      searchKeyword: '',
      dialogVisible: false,
      query: {
        domain: '',
        pageNum: 1,
        pageSize: 10
      },
      form: {
        domain: '',
        remark: ''
      },
      domainData: {
        list: []
      },
      domainRules: {
        domain: [
          { required: true, validator: validateURL, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  created() {
    this.loadDomainList()
  },
  methods: {
    loadDomainList() {
      this.searchKeyword = ''
      getDomainList(this.query).then(res => {
        if (res.returnMsg == 'success') this.domainData = res.data
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.loadDomainList()
    },
    changePageSize(num) {
      this.query.pageSize = num
      this.loadDomainList()
    },
    changePageNum(page) {
      this.query.pageNum = page
      this.loadDomainList()
    },
    handleDelete(row) {
      this.$confirm(`确定删除该域名？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDomain(row.domainId).then(res => {
          if (res.returnMsg == 'success') {
            this.$message({
              message: '域名删除成功',
              type: 'success'
            })
            this.loadDomainList()
          } else {
            this.$message.error('域名删除失败')
          }
        })
      }).catch(() => {})
    },
    handleAddDomain() {
      this.dialogVisible = true
    },
    handleCancel() {
      this.dialogVisible = false
      this.$refs['domainForm'].resetFields()
    },
    handleConfirm() {
      this.$refs['domainForm'].validate(valid => {
        if (!valid) return
        addDomain(this.form).then(res => {
          if (res.returnMsg == 'success') {
            this.$message({
              message: '域名添加成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.loadDomainList()
          } else if(res.returnCode == 'ERR_0002') {
            this.$message.error('域名无效')
          } else {
            this.$message.error('域名添加失败')
          }
        })
      })
    }
  }
}
</script>
