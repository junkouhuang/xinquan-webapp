<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教研管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程包管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="90px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="课程包名称" prop="packageName">
              <el-input v-model="query.packageName" placeholder="输入课程包名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="总课时数" prop="totalHours">
              <el-input v-model="query.totalHours" placeholder="输入总课时数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="课程包简介" prop="description">
              <el-input v-model="query.description" placeholder="输入课程包简介内容" :autosize="{ minRows: 4, maxRows: 4 }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="线上课时数" prop="onHours">
              <el-input v-model="query.onHours" placeholder="输入课时数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="线下课时数" prop="underHours">
              <el-input v-model="query.underHours" placeholder="输入课时数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadCoursePackage">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="$router.push({path: '/course-package/add'})">新增课程包</el-button>
          <el-button type="danger" @click="handleDeleteSelected">删除课程包</el-button>
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
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="packageName"
          sortable
          label="名称">
        </el-table-column>
        <el-table-column
          prop="packageCode"
          sortable
          label="编号">
        </el-table-column>
        <el-table-column
          prop="level"
          sortable
          label="级别">
          <template slot-scope="scope">
            {{ packageLevelFormat(scope.row.level) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          sortable
          label="类型">
          <template slot-scope="scope">
            {{ packageTypeFormat(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="teachingTypes"
          sortable
          label="教学类型">
          <template slot-scope="scope">
            {{ teachingTypeFormat(scope.row.teachingTypes) }}
          </template>
        </el-table-column>
        
        <el-table-column
          prop="description"
          sortable
          label="简介">
        </el-table-column>
        <el-table-column
          prop="totalHours"
          sortable
          label="总课时">
        </el-table-column>
        <el-table-column
          prop="underHours"
          sortable
          label="线下课时">
        </el-table-column>
        <el-table-column
          prop="onHours"
          sortable
          label="线上课时">
        </el-table-column>
        <el-table-column
          prop="qkidsName"
          sortable
          label="久趣课程包">
        </el-table-column>
        
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.usedFlag == 1" class="item" effect="dark" content="查看" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/course-package/${scope.row.id}` })" type="text" icon="el-icon-search"></el-button>
            </el-tooltip>
            <el-tooltip v-else class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/course-package/${scope.row.id}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.usedFlag != 1" class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
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
import request from '@/api/course-package'
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
        pageNum: 1,
        pageSize: 10,
        packageName: '',
        description: '',
        totalHours: '',
        onHours: '',
        underHours: ''
      },
      packageData: [],
      selectedPackage: [],
      packageLevel: [],
      packageTypes: [],
      teachingTypes: []
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  created() {
    // 课程包级别
    request.getPackageLevel().then(res => {
      this.packageLevel = res.data
    })
    // 课程包类型
    request.getPackageTypes().then(res => {
      this.packageTypes = res.data
    })
    // 教学类型
    request.getTeachingTypes().then(res => {
      this.teachingTypes = res.data
    })

    this.loadCoursePackage()
  },
  methods: {
    loadCoursePackage() {
      this.searchKeyword = ''
      request.packageList(this.query).then(res => {
        if (res.returnMsg == 'success') this.packageData = res.data
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
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
    // 格式化课程级别
    packageLevelFormat(id) {
      if (this.packageLevel && this.packageLevel.length > 0 && id >= 0) {
        let row = this.packageLevel.find(item => item.id == id)
        if (!row) return ''
        return row.name
      }
    },
    // 格式化课程包类型
    packageTypeFormat(id) {
      if (this.packageTypes && this.packageTypes.length > 0 && id >= 0) {
        let row = this.packageTypes.find(item => item.id == id)
        if (!row) return ''
        return row.name
      }
    },
    // 格式化教学类型
    teachingTypeFormat(id) {
      if (this.teachingTypes && this.teachingTypes.length > 0 && id >= 0) {
        let row = this.teachingTypes.find(item => item.id == id)
        if (!row) return ''
        return row.name
      }
    },
    handleDelete(row) {
      this.$confirm(`是否确定删除以下课程？（${row.packageName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.deletePackage(row.id)
          .then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '课程包删除成功',
                type: 'success'
              })
              this.loadCoursePackage()
            } else {
              this.$message.error('课程包删除失败')
            }
          })
      }).catch(() => {})
    },
    handleDeleteSelected() {
      if (this.selectedPackage.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的所有课程包?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = []
        this.selectedPackage.forEach(item => {
          ids.push(item.id)
        })
        request.deletePackageBatch(ids.toString())
          .then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '课程包删除成功',
                type: 'success'
              })
              this.loadCoursePackage()
            }
          })
      }).catch(() => {})
    }
  }
}
</script>
