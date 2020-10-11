<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>学员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form :model="query" ref="searchForm" label-width="90px">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}" v-if="$store.state.account.type == 0">
            <el-form-item label="机构名称" prop="orgName">
              <el-input v-model="query.orgName" placeholder="输入机构名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="学员编号" prop="studentCode">
              <el-input v-model="query.studentCode" placeholder="输入学员编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="学员英文名" prop="studentDisplayName">
              <el-input v-model="query.studentDisplayName" placeholder="输入监护人姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="学员姓名" prop="studentName">
              <el-input v-model="query.studentName" placeholder="输入学员姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="监护人手机" prop="phoneNumber">
              <el-input v-model="query.phoneNumber" placeholder="输入监护人手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="学员生日">
              <el-date-picker
                v-model="birthday"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="loadStudent">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="$router.push({path: '/student/add'})">新增学员</el-button>
          <el-button type="danger" @click="handleDeleteSelected">删除学员</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="studentData.list"
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
          prop="studentCode"
          sortable
          label="学员编号">
        </el-table-column>
        <el-table-column
          prop="studentName"
          sortable
          label="学员姓名">
        </el-table-column>
        <el-table-column
          prop="studentDisplayName"
          sortable
          label="学员英文名">
        </el-table-column>
        <el-table-column
          prop="birthday"
          sortable
          label="学员生日">
          <template slot-scope="scope">
            {{ scope.row.birthday | datefmt('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="sex"
          sortable
          label="性别">
          <template slot-scope="scope">
            {{ scope.row.sex == 1 ? '男孩' : '女孩' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          sortable
          label="易贝乐学号">
        </el-table-column>

        <el-table-column
          prop="phoneNumber"
          sortable
          label="监护人手机">
        </el-table-column>
        <el-table-column
          prop="orgName"
          sortable
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="syncStatus"
          sortable
          label="同步状态"
          v-if="$store.state.account.type == 0"> <!-- 同步状态只有系统账号可查看 -->
          <template slot-scope="scope">
            <span v-if="scope.row.syncStatus == 1" class="label label-success">已同步</span>
            <span v-else class="label label-warning">未同步</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          sortable
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1" class="label label-success">正常</span>
            <span v-else class="label label-danger">停用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable
          label="创建日期">
          <template slot-scope="scope">
            {{ scope.row.createTime | datefmt('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="135">
          <template slot-scope="scope">
            <template v-if="scope.row.syncStatus == 1">
              <el-tooltip class="item" effect="dark" content="发送账号" placement="top">
                <el-button class="reset-icon" @click="handleSendUserInfo(scope.row)" type="text" icon="el-icon-message">
                </el-button>
              </el-tooltip>
            </template>
            <el-tooltip v-if="scope.row.state == 1" class="item" effect="dark" content="停用" placement="top">
              <el-button class="reset-icon" @click="handleStop(scope.row)" type="text">
                <i class="iconfont">&#xe626;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip v-else class="item" effect="dark" content="启用" placement="top">
              <el-button class="reset-icon" @click="handleEnable(scope.row)" type="text">
                <i class="iconfont">&#xe625;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/student/${scope.row.id}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ studentData.total }} 条</span>
          <span>，共 {{ studentData.pages }} 页</span>
          <span>，{{ studentData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          :current-page="query.pageNum"
          layout="sizes, prev, pager, next, jumper"
          :total="studentData.total"
          @size-change="changePageSize"
          @current-change="changePageNum"
          style="float: right">
        </el-pagination>
      </div>

    </el-card>
  </div>
</template>

<script>
import request from '@/api/student'
export default {
  data() {
    return {
      searchKeyword: '',
      birthday: '',
      query: {
        pageNum: 1,
        pageSize: 10,
        studentCode: '',
        parentName: '',
        studentDisplayName: '',
        phoneNumber: ''
      },
      studentData: [],
      selectedStudent: []
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    },
    birthday: function(val) {
      this.query.birthdayStart = val ? val[0] : ''
      this.query.birthdayEnd = val ? val[1] : ''
    }
  },
  created() {
    this.loadStudent()
  },
  methods: {
    loadStudent() {
      this.searchKeyword = ''
      request.studentList(this.query)
        .then(res => {
          this.studentData = res.data
        })
    },
    handleReset() {
      this.birthday = ''
      this.query.birthdayStart = ''
      this.query.birthdayEnd = ''
      this.$refs.searchForm.resetFields()
      this.loadStudent()
    },
    handleEnable(row) {
      this.$confirm(`是否确定启用该学员？（${row.studentName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.enableStudent(row.id).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '学员启用成功',
              type: 'success'
            })
            this.loadStudent()
          } else {
            this.$message.error('学员启用失败')
          }
        })
      }).catch(() => {})
    },
    handleSendUserInfo(row) {
      this.$confirm(`是否确定给家长发送学员账号？（${row.studentName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.sendStudentInfo(row.id).then(res => {
          if (res.returnMsg == 'success') {
            this.$message({
              message: '发送成功',
              type: 'success'
            })
          }
        })
      }).catch(() => {})
    },
    handleStop(row) {
      this.$confirm(`是否确定停用该学员？（${row.studentName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.stopStudent(row.id).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '学员停用成功',
              type: 'success'
            })
            this.loadStudent()
          } else {
            this.$message.error('学员停用失败')
          }
        })
      }).catch(() => {})
    },
    handleDelete(row) {
      this.$confirm(`是否确定删除该学员？（${row.studentName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [ row.id ]
        request.deleteStudent(ids)
          .then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '学员删除成功',
                type: 'success'
              })
              this.loadStudent()
            } else {
              this.$message.error('学员删除失败')
            }
          })
      }).catch(() => {})
    },
    handleDeleteSelected() {
      if (this.selectedStudent.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的所有学员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = []
        this.selectedStudent.forEach(item => {
          ids.push(item.id)
        })
        request.deleteStudent(ids)
          .then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '学员删除成功',
                type: 'success'
              })
              this.loadStudent()
            } else {
              this.$message.error('学员删除失败')
            }
          })
      }).catch(() => {})
    },
    changeSelection(val) {
      this.selectedStudent = val
    },
    changePageSize(num) {
      // 修改分页显示数
      this.query.pageSize = num
      this.loadStudent()
    },
    changePageNum(page) {
      // 切换分页
      this.query.pageNum = page
      this.loadStudent()
    }
  }
}
</script>
