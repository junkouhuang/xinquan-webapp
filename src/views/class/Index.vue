<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form label-width="90px" :model="classData" ref="classRef">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="班级编号" prop="classCode">
              <el-input placeholder="输入班级编号" v-model="classData.classCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="班主任名字" prop="accountName">
              <el-input placeholder="输入班主任名字" v-model="classData.accountName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="课程包名称" prop="packageName">
              <el-input placeholder="输入课程包名称" v-model="classData.packageName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="开班日期">
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
            <el-form-item label="班级状态" prop="preState">
              <el-select placeholder="请选择班级状态" v-model="classData.preState" style="width: 100%">
                <el-option label="全部" value=""></el-option>
                <el-option label="预开班" :value="0"></el-option>
                <el-option label="已开班" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="审核状态" prop="auditState">
              <el-select placeholder="请选择审核状态" v-model="classData.auditState" style="width: 100%">
                <el-option label="全部" value=""></el-option>
                <el-option label="未申请" :value="0"></el-option>
                <el-option label="申请中" :value="1"></el-option>
                <el-option label="审核中" :value="2"></el-option>
                <el-option label="通过" :value="3"></el-option>
                <el-option label="不通过" :value="4"></el-option>
                <el-option label="驳回" :value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="classRequest">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="$router.push({path: '/class/add'})">新增班级</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        :data="tableData.list"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="classCode"
          sortable
          label="班级编号">
          <template slot-scope="scope">
            {{ scope.row.preState == 1 ? scope.row.classCode : '' }}
          </template>
        </el-table-column>
          <el-table-column
          prop="classNumber"
          sortable
          label="人数">
        </el-table-column>
        <el-table-column
          prop="packageName"
          sortable
          label="课程包">
        </el-table-column>
        <el-table-column
          prop="startDate"
          sortable
          label="开班日期">
          <template slot-scope="scope">
            {{ scope.row.startDate | datefmt('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="chineseTchAccountName"
          sortable
          label="中教老师">
        </el-table-column>
        <el-table-column
          prop="preState"
          sortable
          label="班级状态">
          <template slot-scope="scope">
            <span v-if="scope.row.preState == 1" class="label label-success">已开班</span>
            <span v-else class="label label-warning">预开班</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          sortable
          label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.auditState == 0" class="label label-default">未申请</span>
            <span v-else-if="scope.row.auditState == 1" class="label label-info">申请中</span>
            <span v-else-if="scope.row.auditState == 2" class="label label-info">审核中</span>
            <span v-else-if="scope.row.auditState == 3" class="label label-success">通过</span>
            <span v-else-if="scope.row.auditState == 3" class="label label-success">通过</span>
            <span v-else-if="scope.row.auditState == 4" class="label label-danger">不通过</span>
            <span v-else-if="scope.row.auditState == 5" class="label label-warning">驳回</span>
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.preState == 0 && scope.row.auditState == 0 || scope.row.auditState == 4 || scope.row.auditState == 5" class="item" effect="dark" content="申请开班" placement="top">
              <el-button class="reset-icon" @click="handleAuditDialog(scope.row)" type="text" icon="el-icon-circle-plus-outline"></el-button>
            </el-tooltip>
            <template v-if="$store.state.account.type == 0">
              <el-tooltip v-if="scope.row.preState == 1 && scope.row.auditState == 3 && scope.row.status == 0" class="item" effect="dark" content="启用" placement="top">
                <el-button class="reset-icon" @click="handleReopen(scope.row)" type="text">
                  <i class="iconfont">&#xe625;</i>
                </el-button>
              </el-tooltip>
              <el-tooltip v-if="scope.row.preState == 1 && scope.row.auditState == 3 && scope.row.status == 1" class="item" effect="dark" content="停用" placement="top">
                <el-button class="reset-icon" @click="handleStop(scope.row)" type="text">
                  <i class="iconfont">&#xe626;</i>
                </el-button>
              </el-tooltip>
            </template>
            <el-tooltip v-if="scope.row.auditState != 1 && scope.row.auditState != 2" class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon"  @click="$router.push({ path: `/class/${scope.row.id}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <template v-if="$store.state.account.type == 0 || scope.row.preState == 0">
              <el-tooltip v-if="scope.row.auditState != 1 && scope.row.auditState != 2 && scope.row.status != 1" class="item" effect="dark" content="删除" placement="top">
                <el-button class="reset-icon"  @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
              </el-tooltip>
            </template>

            <el-tooltip v-if="scope.row.preState == 0" class="item" effect="dark" content="排课表" placement="top">
              <el-button class="reset-icon" @click="$router.push({path: `/course-plan/schedule/${scope.row.id}`})" type="text" icon="el-icon-tickets"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ tableData.total }} 条</span>
          <span>，共 {{ tableData.pages }} 页</span>
          <span>，{{ tableData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          @current-change="pageChange"
          @size-change="sizeChange"
          :current-page="tableData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="tableData.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="tableData.total">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog title="填写申请备注" :visible.sync="auditFormVisible">
      <el-form :model="auditForm" :rules="auditRules" ref="auditForm">
        <el-form-item prop="remark">
          <el-input v-model="auditForm.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAudit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import classfy from '@/api/class'
export default {
  data() {
    return {
      searchKeyword: '',
      auditFormVisible: false,
      auditForm: {
        id: 0,
        remark: ''
      },
      auditRules: {
        remark: [{ required: true, message: '请填写申请备注', trigger: 'blur' }]
      },
      tableData: [],
      queryDate: '',
      classData:{
        pageNum: 1,  //当前页
        pageSize: 10, //一页显示的条数
        preState: '', // 班级状态
        auditState: '', // 审核状态
        classCode: '', //班级编号
        accountName: '',//班主任名称
        packageName: '', //课程包名称
        startDate: '', //开班日期
      }
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    },
    queryDate: function(val) {
      this.classData.startTime = val ? val[0] : ''
      this.classData.endTime = val ? val[1] : ''
    }
  },
  created() {
    this.classRequest()
  },
  methods: {
    classRequest() {
      this.searchKeyword = ''
      classfy.queryClass(this.classData).then(res =>{
         if(res.returnCode == 'ERR_0000'){
          this.tableData = res.data
        }
      })
    },
    // 点击重置
    handleReset() {
      this.queryDate = ''
      this.classData.startTime = ''
      this.classData.endTime = ''
      this.$refs['classRef'].resetFields()
      this.classRequest()
    },
    handleDelete(row) {
      let message = row.preState == 1 && row.classCode ? `是否确定删除该班级？（班级编号：${row.classCode}）` : '是否确定删除该班级？'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classfy.delClass(row.id).then(res => {
          if (res.returnMsg == 'success') {
            this.$message({
              message: '班级删除成功',
              type: 'success'
            })
            this.classRequest()
          } else {
            this.$message.error('班级删除失败')
          }
        })
      }).catch(() => {
      })
    },
    handleStop(row) {
      let message = row.preState == 1 && row.classCode ? `是否确定停用该班级？（班级编号：${row.classCode}）` : '是否确定停用该班级？'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classfy.stopClass(row.id).then(res => {
          if (res.returnMsg == 'success') {
            this.$message({
              message: '班级停用成功',
              type: 'success'
            })
            this.classRequest()
          } else {
            this.$message.error('班级停用失败')
          }
        })
      }).catch(() => {
      })
    },
    handleReopen(row) {
      let message = row.preState == 1 && row.classCode ? `是否确定启用该班级？（班级编号：${row.classCode}）` : '是否确定启用该班级？'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classfy.reopenClass(row.id).then(res => {
          if (res.returnMsg == 'success') {
            this.$message({
              message: '班级启用成功',
              type: 'success'
            })
            this.classRequest()
          } else {
            this.$message.error('班级启用失败')
          }
        })
      }).catch(() => {
      })
    },
    handleAuditDialog(row) {
      this.auditForm.id = row.id
      this.auditFormVisible = true
    },
    handleAudit() {
      this.$refs['auditForm'].validate(valid => {
        if (!valid) return
        classfy.openClass({
          id: this.auditForm.id,
          createRemark: this.auditForm.remark
        }).then(res => {
          if (res.returnMsg == 'success') {
            this.$message({
              message: '申请成功，请等待审核！',
              type: 'success'
            })
            this.classRequest()
            this.auditFormVisible = false
          } else if(res.returnCode == '40000069') {
            this.$message.error('该班级没有学员')
          } else {
            this.$message.error('申请失败')
          }
        })
      })
    },
    //改变每页条数
    sizeChange(val){
      this.classData.pageSize = val
      this.classRequest()
    },
    //改变页数
    pageChange(val){
      this.classData.pageNum = val
      this.classRequest()
    }
  }
}
</script>
