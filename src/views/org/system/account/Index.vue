<template>
  <div>
    <el-card shadow="never" class="head-search-card mt20">
      <el-form label-width="80px" :model="accountData" ref="accountRef">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="账号名" prop="accountName">
              <el-input placeholder="输入账号名" v-model="accountData.accountName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="账号类别" prop="category">
              <el-select placeholder="请选择账号类别" v-model="accountData.category" style="width: 100%" clearable>
                <el-option
                        v-for="item in categoryData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input placeholder="输入手机号码" v-model="accountData.phoneNumber" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所属机构" prop="organizationId">
              <el-select placeholder="输入机构名称" v-model="accountData.organizationId" filterable clearable>
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
            <el-form-item label="真实姓名" prop="realName">
              <el-input placeholder="输入真实姓名" v-model="accountData.realName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="状态" prop="state">
              <el-select placeholder="请选择状态" v-model="accountData.state" style="width: 100%" clearable>
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
            <el-button type="blue" v-has="'res_org_account_list_query'" @click="searchAccount">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_org_account_add'" @click="$router.push({path: '/organization/account/add'})">新增账号</el-button>
          <el-button type="danger" v-has="'res_org_account_batch_delete'" @click="handleDeleteSelected">删除账号</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table @selection-change="changeSelection"
        stripe
        :data="tableData.list"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          width="80">
          <template slot-scope="scope">
            {{ tableData.total - scope.$index - ((accountData.pageNum - 1) * accountData.pageSize) }}
          </template>
        </el-table-column>
        <!--
        <el-table-column
          prop="id"
          sortable
          label="编号"
          width="80">
        </el-table-column>-->
        <el-table-column
          prop="accountName"
          sortable
          label="账号名">
        </el-table-column>
        <el-table-column
          prop="roleName"
          sortable
          label="账号角色">
        </el-table-column>
        <el-table-column
          prop="departmentName"
          sortable
          label="所属部门">
        </el-table-column>
        <el-table-column
          prop="realName"
          sortable
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          sortable
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="mail"
          sortable
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="category"
          sortable
          label="账号类别">
          <template slot-scope="scope">
            {{ scope.row.category | category }}
          </template>
        </el-table-column>
        <el-table-column
          prop="organizationName"
          sortable
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="state"
          sortable
          label="状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1" class="label label-success">启用</span>
            <span v-else-if="scope.row.state == 2" class="label label-warning" v-has="'res_org_account_release'" @click="headleRelease(scope.row)">锁定</span>
            <span v-else-if="scope.row.state == 0" class="label label-danger">禁用</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          sortable
          label="创建时间" width="150">
          <template slot-scope="scope">
            <div>
              {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createBy"
          sortable
          label="创建人">
          <template slot-scope="scope">
              {{ scope.row.createBy  }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-has="'res_org_account_reset'" content="重置密码" placement="top">
              <el-button class="reset-icon" @click="resetPwd(scope.row)" type="text" >
                <i class="iconfont">&#xe641;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_org_account_detail'" content="编辑" placement="top">
              <el-button class="reset-icon" @click="$router.push({ path: `/organization/account/${scope.row.accountName}` })" type="text" >
                <i class="iconfont">&#xe71c;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_org_account_delete'" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text">
                <i class="iconfont">&#xe614;</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_org_account_permission'" content="分配角色" placement="top">
              <el-button class="reset-icon" @click="handleAllot(scope.row)" type="text">
                <i class="iconfont">&#xe645;</i>
              </el-button>
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
          @current-change="pageChange"
          @size-change="sizeChange"
          :background="true"
          :current-page="accountData.pageNum"
          :page-sizes="[10,20,50,100]"
          :page-size="accountData.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="total"
          style="float: right">
        </el-pagination>
      </div>
    </el-card>
     <!-- 分配角色弹窗 -->
    <el-dialog title="选择角色" :visible.sync="dialogTableVisible">
      <div style="margin-top:-20px;">
        <p>账号名：{{ accountDetail.accountName }}</p>
        <p>账号角色：{{ accountDetail.roleName }}</p>
      </div>
      <el-table :data="rolesData" @selection-change="changeSelectionRoles" stripe ref="date" @row-click="rowClick" class="mt20">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="角色ID">
          <template slot-scope="scope">
            <!-- <el-checkbox :label="scope.row.id" v-model="selection">{{scope.row.id}}</el-checkbox> -->
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="角色"></el-table-column>
        <el-table-column prop="roleKey" label="角色key"></el-table-column>
        <el-table-column prop="enable" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.enable" class="label label-success">启用</span>
            <span v-else>禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
      </el-table>
      <div slot="footer" style="text-align:center">
        <el-button type="blue" v-has="'res_org_account_roles_permission'" @click="roleSubmit">确定</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import account from '@/api/org/system/account'
import { createRole } from '@/api/org/system/roles'
export default {
  data() {
    return {
      dialogTableVisible: false,
      searchKeyword: '',
      tableData: [],
      accountData:{
        pageNum: 1,  //当前页
        pageSize: 10, //一页显示的条数
        phoneNumber: '', //手机号码
        accountName: '', //昵称
        realName : '' ,//真实姓名
        organizationId: '',//机构ID
        state: '',
        category: '',
      },
      categoryData:[
        {
          name:'全部',
          id: '',
          value: ''
        }
      ],
      statusData:[
        {
          name:'全部',
          id: '',
          value: ''
        }
      ],
      total: null,
      selectedAccount: [],
      quickValue: "",
      selection: [],
      query: {
        pageNum: 1,
        pageSize: 10,
        accountId: ''
      },
      accountDetail: {},
      rolesData: [],
      accountId: '',
      selectedRoles: [], // 选中的角色
      orgOptions: [] ,//机构列表
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  filters: {
    category(val){
      if (val === 0) {
        return "管理账号"
      } else if (val === 1) {
        return "子账号"
      }
    },
  },
  created(){
    this.orgList();
    this.searchRequest();
    this.categoryRequest();
    this.statusRequest();
  },
  methods: {
    // 机构列表
    orgList(){
      account.queryOrgRequest({
        pageNum: 1,
        pageSize: 100000
      }).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.orgOptions = res.data.list
        }
      })
    },
    categoryRequest(){
      account.categoryRequest().then(res =>{
        if(res.returnCode == 'ERR_0000'){
          for(let i = 0 ,j = res.data.length; i< j; i++){
          this.categoryData.push(res.data[i])
          }
        }
      })
    },
    statusRequest(){
      account.statusRequest().then(res =>{
        if(res.returnCode == 'ERR_0000'){
          for(let i = 0 ,j = res.data.length; i< j; i++){
            this.statusData.push(res.data[i])
          }
        }
      })
    },
    // 页面数据加载
    searchRequest(){
      this.searchKeyword = ''
      account.searchRequest(this.accountData).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.tableData = res.data
          this.total = res.data.total
        }
      })
    },
    headleRelease(row) {
      this.$confirm('是否确定解除账号锁定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        account.releaseAccount(row.accountName, row.state).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '解锁成功',
              type: 'success'
            })
            this.searchRequest()
          } else {
            this.$message.error('解锁失败')
          }
        })
      })
    },
    // 点击查询
    searchAccount() {
      this.searchRequest()
    },
    //改变页数
    pageChange(val){
      this.accountData.pageNum = val
      this.searchRequest()
    },
    //改变每页条数
    sizeChange(val){
      this.accountData.pageSize = val
      this.searchRequest()
    },
    //删除一条机构
    handleDelete(row) {
      this.$confirm(`是否确定删除该账号？（${row.accountName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        account.delRequest(row.accountName)
          .then(res => {
            if(res.returnCode == "ERR_0000") {
              this.$message({
                message: '账号删除成功',
                type: 'success'
              })
              this.searchRequest()
            }
          })
           .catch(() => {
             this.$message({
               message: '您的权限级别不够，暂无法删除',
               type: 'error'
             })
             this.searchRequest()
           })
      })
    },
    //批量删除机构
    handleDeleteSelected() {
      if (this.selectedAccount.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          let names = []
          this.selectedAccount.forEach(item => {
            names.push(item.accountName)
          })
          account.delRequest(names).then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '账号删除成功',
                type: 'success'
              })
              this.searchRequest()
            }else{
              this.$message({
                message: '账号删除失败',
                type: 'error'
              })
            }
          })
        })
    },
    // 重置密码
    resetPwd(row){
      this.$confirm('是否确定重置为初始密码？(初始密码为88888888)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        account.pwdResetRequest({'accountName': row.accountName})
          .then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '密码重置成功',
                type: 'success'
              })
            }else{
               this.$message({
                message: res.returnMsg,
                type: 'error'
              })
            }
          })
      }).catch(() => {})
    },
    //点击重置
    handleReset() {
      this.$refs['accountRef'].resetFields()
      this.searchRequest()
    },
    changeSelection(val) {
      this.selectedAccount = val
    },
    // 点击分配角色
    handleAllot(row) {
      account.detailRequest({
        accountName: row.accountName
      }).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.accountDetail = res.data
        }
      })
      // console.log(row);
      this.selection = []
      this.accountId = row.id
      this.dialogTableVisible = true
      this.query.accountId = row.id
      account.getAccountRoles(row.organizationId).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.rolesData = res.data
          // this.rolesData.forEach(item =>{
          //   if(item.existsFlag == 1){
          //     this.selection.push(item.id)
          //   }
          // })
        }
      })
      // console.log(this.selection);
    },
    changeSelectionRoles(val) {
      this.selectedRoles = val
    },
    // 弹窗
    // 点击搜索
    // quickSearch() {
    //   this.packageData.packageName = this.quickValue
    //   this.classpackage()
    // },
    rowClick(row) {
      if(this.selection.indexOf(row.id)==-1){
        this.selection.push(row.id)
      }else{
        let len = this.selection.indexOf(row.id)
        this.selection.splice(len,1)
      }
    },
    // 角色表弹窗点击确定
    roleSubmit() {
       if (this.selectedRoles.length==0) {
        this.$message.error('请选择角色')
        return
      }
      // let sel = this.selectedRoles.join(',')
      let keys = []
      this.selectedRoles.forEach(item => {
        keys.push(item.roleKey)
      })
      createRole({'name': this.accountDetail.accountName, 'keys': keys.toString()}).then(res =>{
        if (res.returnCode == 'ERR_0000') {
          this.dialogTableVisible = false
          this.$message({
            message: '角色分配成功',
            type: 'success'
          })
          this.searchRequest()
        }else{
          this.$message({
            message: res.returnMsg,
            type: 'error'
          })
        }
      })

    },

  },
}
</script>
