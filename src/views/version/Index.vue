<template>
  <div>
    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="75px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="APP名称" prop="appName">
              <el-input v-model="query.appName" placeholder="输入APP名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="类型" prop="type">
              <el-select placeholder="选择类型" v-model="query.type" style="max-width: 600px;" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in appTypesData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_version_app_list_query'" @click="loadCoursePackage">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_version_app_add'" @click="$router.push({path: '/version/app/add'})">新增APP版本</el-button>
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
        style="width: 100%" class="vForm">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table @selection-change="changeSelection" style="width:100%"
            stripe
            v-if="props.row.children.length>0"
            :data="props.row.children" class="vForm2">
              <el-table-column type="expand">
              </el-table-column>
              <el-table-column
                sortable
                prop="id"
                label="编号"
                width="100">
              </el-table-column>
              <el-table-column
                prop="appName"
                sortable
                label="APP名称"  width="150">
              </el-table-column>
              <el-table-column
                      prop="appDescription"
                      sortable
                      label="APP描述" width="180">
              </el-table-column>
              <el-table-column
                prop="type"
                sortable
                label="类型" width="100">
                <template slot-scope="scope">
                  {{ scope.row.type | type }}
                </template>
              </el-table-column>
              <el-table-column
                prop="versionCode"
                sortable
                label="版本号" width="100">
              </el-table-column>
              <el-table-column
                prop="versionName"
                sortable
                label="版本名称" width="120">
              </el-table-column>
              <el-table-column
                      prop="forceUpdate"
                      sortable
                      label="强制" width="80">
                      <template slot-scope="scope">
                        <span v-if="scope.row.forceUpdate" class="label label-success">Yes</span>
                        <span v-else class="label label-danger">No</span>
                      </template>
              </el-table-column>
              <el-table-column
                      prop="autoUpdate"
                      sortable
                      label="自动" width="80">
                      <template slot-scope="scope">
                        <span v-if="scope.row.autoUpdate" class="label label-success">Yes</span>
                        <span v-else class="label label-danger">No</span>
                      </template>
              </el-table-column>
              <el-table-column
                      prop="run"
                      sortable
                      label="启用" width="80">
                      <template slot-scope="scope">
                        <span v-if="scope.row.run" class="label label-success">Yes</span>
                        <span v-else class="label label-danger">No</span>
                      </template>
              </el-table-column>
              <el-table-column
                      prop="apkUrl"
                      sortable
                      label="应用包" width="100">
                      <template slot-scope="scope">
                        <el-link v-if="scope.row.apkUrl" type="default" :href="scope.row.apkUrl" :underline="false" >
                          <i class="el-icon-link" style="font-size:22px;"></i>
                        </el-link>
                      </template>
              </el-table-column>
              <el-table-column
                      prop="incrementalUrl"
                      sortable
                      label="增量包"  width="100">
                      <template slot-scope="scope">
                        <el-link v-if="scope.row.incrementalUrl" type="default" :href="scope.row.incrementalUrl" :underline="false" >
                           <i class="el-icon-link" style="font-size:22px;"></i>
                        </el-link>
                      </template>
              </el-table-column>
              <el-table-column
                      prop="createTime"
                      sortable
                      label="添加时间">
                      <template slot-scope="scope">
                       {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
                      </template>
              </el-table-column>
              <el-table-column
                      prop="discarded"
                      sortable
                      label="废弃" width="80">
                      <template slot-scope="scope">
                        <span v-if="scope.row.discarded" class="label label-success">Yes</span>
                        <span v-else class="label label-danger">No</span>
                      </template>
              </el-table-column>
              <el-table-column
                    prop="qrcode"
                    sortable
                    label="二维码" style="text-align:center;">
                    <template slot-scope="scope">
                      <img v-if="scope.row.qrcode" :src="scope.row.qrcode" @dblclick="handleQrcode(scope.row.qrcode)" width="50" height="50" alt="">
                    </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" v-has="'res_version_app_detail'" content="查看" placement="top">
                    <el-button class="reset-icon" @click="$router.push({ path: `/version/app/detail/${scope.row.id}` })"  type="text" >
                      <i class="iconfont">&#xe605;</i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" v-has="'res_version_app_edit'" content="编辑" placement="top">
                    <el-button class="reset-icon" @click="$router.push({ path: `/version/app/${scope.row.id}` })" type="text" >
                      <i class="iconfont">&#xe71c;</i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" v-has="'res_version_app_delete'" content="删除" placement="top">
                    <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" >
                      <i class="iconfont">&#xe614;</i>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="id"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="appName"
          sortable
          label="APP名称"  width="150">
        </el-table-column>
        <el-table-column
                prop="appDescription"
                sortable
                label="APP描述" width="180">
        </el-table-column>
        <el-table-column
          prop="type"
          sortable
          label="类型" width="100">
          <template slot-scope="scope">
            {{ scope.row.type | type }}
          </template>
        </el-table-column>
        <el-table-column
          prop="versionCode"
          sortable
          label="版本号" width="100">
        </el-table-column>
        <el-table-column
          prop="versionName"
          sortable
          label="版本名称" width="120">
        </el-table-column>
        <el-table-column
                prop="forceUpdate"
                sortable
                label="强制" width="80">
                <template slot-scope="scope">
                  <span v-if="scope.row.forceUpdate" class="label label-success" >Yes</span>
                  <span v-else class="label label-danger">No</span>
                </template>
        </el-table-column>
        <el-table-column
                prop="autoUpdate"
                sortable
                label="自动" width="80">
                <template slot-scope="scope">
                  <span v-if="scope.row.autoUpdate" class="label label-success">Yes</span>
                  <span v-else class="label label-danger">No</span>
                </template>
        </el-table-column>
        <el-table-column
                prop="run"
                sortable
                label="启用" width="80">
                <template slot-scope="scope">
                  <span v-if="scope.row.run" class="label label-success">Yes</span>
                  <span v-else class="label label-danger">No</span>
                </template>
        </el-table-column>
        <el-table-column
                prop="apkUrl"
                sortable
                label="应用包" width="100">
                <template slot-scope="scope">
                  <el-link v-if="scope.row.apkUrl" type="default" :href="scope.row.apkUrl" :underline="false" >
                     <i class="el-icon-link" style="font-size:22px;"></i>
                  </el-link>
                </template>
        </el-table-column>
        <el-table-column
                prop="incrementalUrl"
                sortable
                label="增量包"  width="100">
                <template slot-scope="scope">
                  <el-link v-if="scope.row.incrementalUrl" type="default" :href="scope.row.incrementalUrl" :underline="false" >
                    <i class="el-icon-link" style="font-size:22px;"></i>
                  </el-link>
                </template>
        </el-table-column>
        <el-table-column
                prop="createTime"
                sortable
                label="添加时间">
                <template slot-scope="scope">
                 {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
                </template>
        </el-table-column>
        <el-table-column
                prop="discarded"
                sortable
                label="废弃" width="80">
                <template slot-scope="scope">
                  <span v-if="scope.row.discarded" class="label label-success">Yes</span>
                  <span v-else class="label label-danger">No</span>
                </template>
        </el-table-column>
        <el-table-column
              prop="qrcode"
              sortable
              label="二维码" style="text-align:center;">
              <template slot-scope="scope">
                <img v-if="scope.row.qrcode" :src="scope.row.qrcode" @dblclick="handleQrcode(scope.row.qrcode)" width="50" height="50" alt="">
              </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" v-has="'res_version_app_detail'" effect="dark" content="查看" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/version/app/detail/${scope.row.id}` })"  type="text" >
                <i class="iconfont">&#xe605;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" v-has="'res_version_app_edit'" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/version/app/${scope.row.id}` })" type="text" >
                <i class="iconfont">&#xe71c;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" v-has="'res_version_app_delete'" effect="dark" content="删除" placement="top">
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

    <el-dialog
      :visible.sync="dialogImageVisible"
      top="-150px"
      class="qrcode-dialog">
      <div class="qrcode-image"><img :src="dialogImageUrl" width="300" height="300" alt=""></div>
      <p>扫一扫 下载手机APP</p>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/api/version"
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
        appName:'',
        type:'',
        pageNum: 1,
        pageSize: 10,
      },
      appTypesData: [],
      packageData: [],
      selectedPackage: [],
      centerDialogVisible: false,
      form: [],
      dialogImageVisible: false,
      dialogImageUrl: '',
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    },
  },
  filters: {
    type(val){
      if (val === 1) {
        return "安卓"
      } else if (val === 2) {
        return "IOS"
      } else if (val === 3) {
        return "H5"
      }
    },
  },
  created() {
    this.loadCoursePackage()
    this.appTypesRequest()
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
      this.$confirm(`删除后将不可恢复，确定删除该APP版本吗？（${row.appName} V${row.versionCode}.${row.versionName}）`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      request.del(row.id).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.$message({
            message: "APP版本删除成功",
            type: "success"
          })
          this.loadCoursePackage()
        } else {
          this.$message.error("APP版本删除失败")
        }
      }).catch(() => {})
    })
    },
    appTypesRequest() {
      request.appTypes({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.appTypesData = res.data
        }
      })
    },
    handleQrcode(url) {
      this.dialogImageVisible = true
      this.dialogImageUrl = url
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
.vForm {
  .el-table__expand-icon>.el-icon {
      border-left: 6px solid #999;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
  }
  .el-icon-arrow-right:before {
     content: '';
  }

  .el-table__expand-icon {
    margin-left:15px;
  }
  .el-table__expanded-cell[class*=cell] {
    padding: 0px;
  }
  .el-table__body .el-table__row td:nth-child(2) .cell{
    padding-left: 10px;
  }
}
.vForm2 {
  .has-gutter{
    display: none;
  }
  .el-table__expanded-cell[class*=cell] {
    padding: 0px;
  }
  .el-table__expand-icon {
    display: none;
    margin-left:30px;
  }
  .el-table__body .el-table__row td:nth-child(2) .cell{
    padding-left: 30px;
  }
}
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
