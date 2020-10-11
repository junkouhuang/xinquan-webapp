<template>
  <div>
    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="60px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="编码" prop="code">
              <el-input v-model="query.code" placeholder="请输入短网址编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="短网址" prop="dwz">
              <el-input v-model="query.dwz" placeholder="请输入短网址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="原网址" prop="url">
              <el-input v-model="query.url" placeholder="请输入原网址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadShortUrlList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="handleAddShortUrl">新增短网址</el-button>
          <el-button type="danger" @click="handleDeleteSelected">删除短址</el-button>
          <el-button type="green" @click="handleExports" v-if="shortUrlData.list && shortUrlData.list.length > 0">导出数据</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="shortUrlData.list"
        @selection-change="changeSelection"
        stripe
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="code"
          sortable
          label="短址编码">
        </el-table-column>
        <el-table-column
          prop="domain"
          sortable
          label="短址域名">
        </el-table-column>
        <el-table-column
          prop="dwz"
          sortable
          label="短网址">
        </el-table-column>
        <el-table-column
          prop="url"
          sortable
          label="原网址">
        </el-table-column>
        <el-table-column
          prop="type"
          sortable
          label="类型">
          <template slot-scope="scope">
            默认
          </template>
        </el-table-column>
        <el-table-column
          prop="ip"
          sortable
          label="来源IP">
        </el-table-column>
        <el-table-column
          prop="createBy"
          sortable
          label="创建者">
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
          prop="qrcode"
          label="二维码">
          <template slot-scope="scope">
            <img v-if="scope.row.qrcode" :src="scope.row.qrcode" @dblclick="handleQrcode(scope.row.qrcode)" width="50" height="50" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column label="操作" width="105">
          <template slot-scope="scope">
            <el-tooltip v-if="!scope.row.qrcode" class="item" effect="dark" content="生成二维码" placement="top">
              <el-button class="reset-icon" @click="handleCreateQrcode(scope.row)" type="text"><i class="iconfont">&#xe661;</i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="handleEditShortUrl(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ shortUrlData.total }} 条</span>
          <span>，共 {{ shortUrlData.pages }} 页</span>
          <span>，{{ shortUrlData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="shortUrlData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="shortUrlData.pageSize"
          :total="shortUrlData.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      title="添加短网址"
      :visible.sync="dialogVisible1"
      width="30%">
      <el-form ref="domainForm" :model="form" :rules="domainRules" label-width="80px">
        <el-form-item label="短址域名" prop="domainId">
          <el-select v-model="form.domainId" style="width: 100%">
            <el-option v-for="(item, index) in allDomainList" :key="index" :label="item.domain" :value="item.domainId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网址" prop="source">
          <el-input v-model="form.source"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="margin-bottom: 0px">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="green" @click="handleConfirmAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑短网址"
      :visible.sync="dialogVisible2"
      width="30%">
      <el-form ref="domainForm" :model="form" :rules="domainRules" label-width="80px">
        <el-form-item label="短网址">
          {{ form.dwz }}
        </el-form-item>
        <el-form-item label="原网址" prop="url" style="margin-bottom: 0px">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="green" @click="handleConfirmEdit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogImageVisible"
      top="-150px"
      class="qrcode-dialog">
      <div class="qrcode-image"><img :src="dialogImageUrl" width="300" height="300" alt=""></div>
      <p>趣乐短网址</p>
    </el-dialog>
  </div>
</template>

<script>
import { getAllDomainList, getShortUrl, getShortUrlList, deleteShortUrl, addShortUrl, updateShortUrl, exportsData, createDwzQrcode } from '@/api/url'
export default {
  data() {
    const validateURL = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入网址'))
      } else if (!this.validate.url(value)) {
        return callback(new Error('请输入正确的网址'))
      }
      callback()
    }
    return {
      searchKeyword: '',
      selectedShort: [],
      dialogVisible1: false,
      dialogVisible2: false,
      dialogImageVisible: false,
      dialogImageUrl: '',
      query: {
        pageNum: 1,
        pageSize: 10,
        dwz: '',
        url: '',
        code: ''
      },
      form: {
        remark: ''
      },
      allDomainList: [],
      shortUrlData: {},
      domainRules: {
        domainId: [
          { required: true, message: '请选择域名', trigger: 'blur' }
        ],
        source: [
          { required: true, validator: validateURL, trigger: 'change' }
        ],
        url: [
          { required: true, validator: validateURL, trigger: 'change' }
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
    getAllDomainList().then(res => {
      if (res.returnCode == 'ERR_0000') this.allDomainList = res.data
    })
    this.loadShortUrlList()
  },
  methods: {
    loadShortUrlList() {
      this.searchKeyword = ''
      getShortUrlList(this.query).then(res => {
        if (res.returnCode == 'ERR_0000') this.shortUrlData = res.data
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.loadShortUrlList()
    },
    handleAddShortUrl() {
      this.form = { remark: '' }
      this.dialogVisible1 = true
    },
    handleEditShortUrl(row) {
      getShortUrl(row.code).then(res => {
        this.form = {
          dwz: res.data.dwz || '',
          url: res.data.url || '',
          code: res.data.code || '',
          remark: res.data.remark || ''
        }
        this.dialogVisible2 = true
      })
    },
    handleDelete(row) {
      this.$confirm(`确定删除该短网址？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteShortUrl(row.code).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '短网址删除成功',
              type: 'success'
            })
            this.loadShortUrlList()
          } else {
            this.$message.error('短网址删除失败')
          }
        })
      }).catch(() => {})
    },
    changePageSize(num) {
      this.query.pageSize = num
      this.loadShortUrlList()
    },
    changePageNum(page) {
      this.query.pageNum = page
      this.loadShortUrlList()
    },
    handleConfirmAdd() {
      this.$refs['domainForm'].validate(valid => {
        if (!valid) return
        addShortUrl(this.form).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '短网址添加成功',
              type: 'success'
            })
            this.dialogVisible1 = false
            this.loadShortUrlList()
          } else if(res.returnCode == 'ERR_0002') {
            this.$message.error('网址无效')
          } else {
            this.$message.error('短网址添加失败')
          }
        })
      })
    },
    handleConfirmEdit() {
      this.$refs['domainForm'].validate(valid => {
        if (!valid) return
        updateShortUrl(this.form).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '短网址更新成功',
              type: 'success'
            })
            this.dialogVisible2 = false
            this.loadShortUrlList()
          } else if(res.returnCode == 'ERR_0002') {
            this.$message.error('网址无效')
          } else {
            this.$message.error('短网址更新失败')
          }
        })
      })
    },
    handleExports() {
      exportsData().then(res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let link = document.createElement('a')
        link.href = objectUrl
        link.style.display = 'none'
        link.download = 'DWZ_TRANS_' + new Date().getTime()
        link.click()
      })
    },
    handleDeleteSelected() {
      if (this.selectedShort.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm('确定要删除选中的短网址?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let codes = []
        this.selectedShort.forEach(item => {
          codes.push(item.code)
        })
        deleteShortUrl(codes).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '短网址删除成功',
              type: 'success'
            })
            this.loadShortUrlList()
          } else {
            this.$message.error('短网址删除失败')
          }
        })
      })
    },
    handleCreateQrcode(row) {
      createDwzQrcode(row.code).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.$message({
            message: '二维码生成成功',
            type: 'success'
          })
          this.loadShortUrlList()
        } else {
          this.$message.error('二维码生成失败')
        }
      })
    },
    changeSelection(val) {
      this.selectedShort = val
    },
    handleQrcode(url) {
      this.dialogImageVisible = true
      this.dialogImageUrl = url
    }
  }
}
</script>

<style lang="scss">
.v-modal {
  opacity: 0.8 !important;
}
.qrcode-dialog {
  .el-dialog {
    position: absolute;
    width: 300px;
    left: 0;
    right: 0;
    top: 50%;
    background: none;
    box-shadow: none;
    text-align: center;
    p {
      line-height: 1.8;
      color: #fff;
    }
  }
  .qrcode-image {
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    img {
      display: block;
    }
  }
  .el-dialog__header {
    position: fixed;
    right: 0;
    top: 0;
    .el-dialog__headerbtn .el-dialog__close {
      font-size: 26px;
      color: #fff;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
