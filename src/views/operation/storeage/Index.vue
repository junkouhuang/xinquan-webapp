<template>
  <div>
    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="75px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="资源名称" prop="name" >
              <el-input v-model="query.name" placeholder="输入资源名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="资源类型" prop="type">
              <el-select placeholder="请选择类型" v-model="query.type" style="max-width: 600px;" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in typesData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="资源分类" prop="category">
              <el-select placeholder="请选择分类" v-model="query.category" style="max-width: 600px;" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in categoryData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="资源状态" prop="status">
              <el-select placeholder="请选择资源状态" v-model="query.status" style="width: 100%" clearable >
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in statusData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="来源机构" prop="orgId">
              <el-select placeholder="请选择机构" v-model="query.orgId" filterable clearable>
                <el-option
                        v-for="item in orgOptions"
                        :key="item.enterpriseId"
                        :label="item.enterpriseName"
                        :value="item.enterpriseId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
           <el-form-item label="上传时间">
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
            <el-button type="blue" v-has="'res_media_resource_list'" @click="loadCoursePackage">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_media_resource_add'" @click="$router.push({path: '/operation/storeage/add'})">新增资源</el-button>
          <el-button type="danger" v-has="'res_media_resource_batch_delete'" @click="handleDeleteSelected">批量删除</el-button>
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
        style="width: 100%;">
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
        <!--
        <el-table-column
          sortable
          prop="id"
          label="编号"
          width="80">
        </el-table-column>-->
        <el-table-column
                prop="storageName"
                sortable
                label="资源名称" width="200">
                <template slot-scope="scope">
                  {{ scope.row.storageName }}
                </template>
        </el-table-column>
        <el-table-column
                prop="storageType"
                sortable
                label="资源类型">
                <template slot-scope="scope">
                  {{ scope.row.storageType | storageType }}
                </template>
        </el-table-column>
        <el-table-column
                prop="storageDetail"
                sortable
                label="资源详情" width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.storageType == 1">
                    <el-image :src="scope.row.storageDetail" style="width:80px;height:80px;" :preview-src-list="[`${scope.row.storageDetail}`]" lazy></el-image>
                  </span>
                  <span v-if="scope.row.storageType == 2">
                    <video controls="controls" width="140px" height="78px" playsinline="" webkit-playsinline="" x5-playsinline="">
                      <source :src="scope.row.storageDetail">
                    </video>
                  </span>
                  <span v-if="scope.row.storageType == 3" style="font-size:10px;width:180px;height:80px;">
                      <img src="./images/pdf.png" style="height:22px;vertical-align:middle;" lazy> {{ scope.row.storageName }}</img>
                  </span>
                  <span v-if="scope.row.storageType == 4" style="font-size:10px;width:180px;height:80px;">
                    <img src="./images/word3.png" style="height:22px;vertical-align:middle;" lazy> {{ scope.row.storageName}}</img>
                  </span>
                  <span v-if="scope.row.storageType == 5" style="width:180px;height:80px;">
                    <img src="./images/excel.png" style="height:22px;vertical-align:middle;" lazy> {{ scope.row.storageName }}</img>
                  </span>
                </template>
        </el-table-column>
        <el-table-column
                prop="storageCategory"
                sortable
                label="资源分类" >
                <template slot-scope="scope">
                  {{ scope.row.storageCategory | storageCategory }}
                </template>
        </el-table-column>
        <el-table-column
          prop="storageFormat"
          sortable
          label="资源格式">
        </el-table-column>
        <el-table-column
                prop="storageSize"
                sortable
                label="资源大小">
                <template slot-scope="scope">
                  {{ Math.ceil(scope.row.storageSize/1024) }} KB
                </template>
        </el-table-column>
        <el-table-column
                prop="storageStatus"
                sortable
                label="资源状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.storageStatus == 1" class="label label-success">{{ scope.row.storageStatus | storageStatus }}</span>
                  <span v-if="scope.row.storageStatus == 2" class="label label-danger">{{ scope.row.storageStatus | storageStatus }}</span>
                </template>
        </el-table-column>
        <el-table-column
                prop="storageContent"
                sortable
                label="资源简介" width="220">
        </el-table-column>
        <el-table-column
                prop="updateTime"
                sortable
                label="上传时间" width="150">
                <template slot-scope="scope">
                 {{ scope.row.updateTime | datefmt('YYYY-MM-DD HH:mm') }}
                </template>
        </el-table-column>
        <el-table-column
                prop="updateBy"
                sortable
                label="维护人" width="100">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip v-has="'res_media_resource_download'" class="item" effect="dark" content="下载" placement="top">
              <el-link type="default" :href="scope.row.storageDetail" :underline="false" target="_blank" style="padding-right:12px;">
                <i class="iconfont">&#xe665;</i>
              </el-link>
            </el-tooltip>
            <el-tooltip v-has="'res_media_resource_edit'" class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/operation/storeage/${scope.row.id}` })" type="text" >
                <i class="iconfont">&#xe71c;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip v-has="'res_media_resource_delete'" class="item" effect="dark" content="删除" placement="top">
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
import request from "@/api/storeage"
export default {
  data() {
    return {
      searchKeyword: '',
      queryDate: '',
      query: {
        name: '',
        type: '',
        category: '',
        status: '',
        orgId: '',
        start:'',
        end:'',
        source: 1,
        pageNum: 1,
        pageSize: 10,
      },
      statusData: [],
      typesData: [],
      categoryData: [],
      orgOptions: [] ,//机构列表
      packageData: [],
      selectedPackage: [],
      centerDialogVisible: false,
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
    storageType(val){
      if (val === 1) {
        return "图片"
      } else if (val === 2) {
        return "视频"
      } else if (val === 3) {
        return "PDF文档"
      } else if (val === 4) {
        return "Word文档"
      } else if (val === 5) {
        return "Excel文档"
      }
    },
    storageCategory(val) {
      if (val === 1) {
        return "药品图"
      } else if(val === 2) {
        return "商品图"
      } else if(val === 3) {
        return "轮播广告图"
      } else if(val === 4) {
        return "品种分类图标"
      } else if(val === 5) {
        return "活动推广图"
      } else if(val === 6) {
        return "海报物料"
      } else if(val === 7) {
        return "宣传画"
      } else if(val === 8) {
        return "素材图"
      } else if(val === 9) {
        return "短视频"
      } else if(val === 10) {
        return "培训视频"
      } else if(val === 11) {
        return "电子文档"
      }
    },
    storageStatus(val){
      if (val === 1) {
        return "启用"
      } else if (val === 2) {
        return "停用"
      }
    },
  },
  created() {
    this.loadCoursePackage()
    this.typesRequest()
    this.statusRequest()
    this.categoryRequest()
    this.orgList()
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
      this.$confirm(`确定删除该资源？（${row.storageName}）`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      request.del(row.id).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.$message({
            message: "资源删除成功",
            type: "success"
          })
          this.loadCoursePackage()
        } else {
          this.$message.error("资源删除失败")
        }
      }).catch(() => {})
    })
    },
    orgList(){
      request.queryOrgRequest({
        pageNum: 1,
        pageSize: 100000
      }).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.orgOptions = res.data.list
        }
      })
    },
    typesRequest() {
      request.typesData({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.typesData = res.data
        }
      })
    },
    statusRequest() {
      request.statusData({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.statusData = res.data
        }
      })
    },
    categoryRequest() {
      request.categoryData({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.categoryData = res.data
        }
      })
    },
    handleDeleteSelected() {
      if (this.selectedPackage.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的所有资源?", "提示", {
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
              message: "资源删除成功",
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
