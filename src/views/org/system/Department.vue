<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form label-width="80px" :model="query" ref="searchForm">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="部门名称" prop="name">
              <el-input placeholder="输入部门名称" v-model="query.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="状态" prop="status">
              <el-select placeholder="请选择状态" v-model="query.status" style="width: 100%" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in statusData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所属机构" prop="orgId">
              <el-select placeholder="请选择所属机构" v-model="query.orgId" filterable clearable>
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
            <el-button type="blue" v-has="'res_org_department_list_query'" @click="getList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_org_department_add'" @click="handleAdd">新增部门</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        stripe
        :data="tableData.list"
        style="width: 100%">
        <el-table-column
          label="序号"
          width="80">
          <template slot-scope="scope">
            {{ tableData.total - scope.$index - ((query.pageNum - 1) * query.pageSize) }}
          </template>
        </el-table-column>
        <!--
        <el-table-column
          prop="departmentId"
          label="编号"
          width="80">
        </el-table-column>-->
        <el-table-column
          prop="departmentName"
          sortable
          label="部门名称">
        </el-table-column>
        <el-table-column
          prop="status"
          sortable
          label="状态">
           <template slot-scope="scope">
            <span v-if="scope.row.status" class="label label-success">启用</span>
            <span v-else class="label label-danger">禁用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="organizationName"
          sortable
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable
          label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createBy"
          sortable
          label="创建人">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-has="'res_org_department_details'" content="编辑" placement="top">
              <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_org_department_delete'" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
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
          @current-change="changePageNum"
          @size-change="changePageSize"
          :current-page="tableData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="tableData.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="tableData.total">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      :title="this.editvisiable ? '编辑部门' : '添加部门'"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="departmentForm" :model="form" :rules="departmentRules" label-width="80px">
        <el-form-item label="所属机构" prop="orgId">
          <el-select placeholder="请选择所属机构" v-model="form.orgId" filterable clearable >
            <el-option
              v-for="item in orgOptions"
              :key="item.enterpriseId"
              :label="item.enterpriseName"
              :value="item.enterpriseId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="name" placeholder="请输入部门名称">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-radio v-model="form.enable" :label="true">是</el-radio>
          <el-radio v-model="form.enable" :label="false">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="blue" v-if="this.editvisiable" v-has="'res_org_department_edit'" @click="handleConfirm">确 定</el-button>
        <el-button type="blue" v-if="!this.editvisiable" v-has="'res_org_department_add'" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (!this.form.orgId) {
        return callback(new Error('请选择部门所属机构'))
      }
      if (!value) {
        return callback(new Error('请输入部门名称'))
      }
      let formData = new FormData()
      formData.append('name', value)
      formData.append('orgId', this.form.orgId)
      this.axios.post('/authorizes/department/validate', formData).then(res => {
        if (res) {
          callback(new Error('部门名称已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      searchKeyword: '',
      query: {
        name: '',
        status: '',
        orgId: '',
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        list: []
      },
      dialogVisible: false,
      form: {},
      orgOptions: [] ,//机构列表
      statusData: [] ,
      editvisiable: false,
      departmentRules: {
        orgId: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        name: [
          { required: true, validator: validateName, trigger: 'change' }
        ],
        enable: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
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
    this.statusList()
    this.orgList()
    this.getList()
  },
  methods: {
    statusList() {
      var params = {}
      this.axios.get('/common/department/status',{params}).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.statusData = res.data
        }
      })
    },
    orgList() {
      var params = {
        pageNum: 1,
        pageSize: 100000
      }
      this.axios.get('/ydh/mall/enterprise/list', {params}).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.orgOptions = res.data.list
          }
      })
    },
    getList() {
      this.searchKeyword = ''
      let formData = new FormData()
      formData.append('status', this.query.status)
      formData.append('name', this.query.name)
      formData.append('orgId', this.query.orgId)
      formData.append('pageNum', this.query.pageNum)
      formData.append('pageSize', this.query.pageSize)
      this.axios.post('/authorizes/simple/department/query', formData).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.tableData = res.data
        }
      })
    },
    handleAdd() {
      this.form = {
        enable: true
      }
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.editvisiable = true
      let formData = new FormData()
      formData.append('id', row.departmentId)
      this.axios.post('/authorizes/department/details', formData).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.dialogType = 'edit'
          this.dialogVisible = true
          this.form = {
            id: res.data.departmentId,
            name: res.data.departmentName,
            enable: res.data.status,
            orgId: res.data.organizationId
          }
        }
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.getList()
    },
    handleConfirm() {
      this.editvisiable = false
      this.$refs['departmentForm'].validate(valid => {
        console.log(valid);
        if (!valid) return
        if (this.dialogType == 'add') {
          let formData = new FormData()
          formData.append('orgId', this.form.orgId)
          formData.append('name', this.form.name)
          formData.append('enable', this.form.enable)
          this.axios.post('/authorizes/simple/department/create', formData).then(res => {
            if (res.returnCode == 'ERR_0000') {
              this.$message({
                message: '部门添加成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getList()
            } else {
              this.$message.error('部门添加失败')
            }
          })
        } else if (this.dialogType == 'edit') {
          let formData = new FormData()
          formData.append('id', this.form.id)
          formData.append('name', this.form.name)
          formData.append('enable', this.form.enable)
          this.axios.post('/authorizes/department/save', formData).then(res => {
            if (res.returnCode == 'ERR_0000') {
              this.$message({
                message: '部门更新成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getList()
            } else {
              this.$message.error('部门更新失败')
            }
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm(`确定删除该部门？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', row.departmentId)
        this.axios.post('/authorizes/department/delete', formData).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '部门删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message.error('部门删除失败')
          }
        })
      }).catch(() => {})
    },
    handleCancel() {
      this.dialogVisible = false
      this.form = {}
    },
    changePageSize(num) {
      this.query.pageSize = num
      this.getList()
    },
    changePageNum(page) {
      this.query.pageNum = page
      this.getList()
    }
  }
}
</script>
