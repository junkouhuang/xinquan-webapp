<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form label-width="80px" :model="accountData" ref="accountRef">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="国家名称">
              <el-input placeholder="输入国家名称" v-model="accountData.countryName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="修改人">
              <el-input placeholder="输入修改人" v-model="accountData.updator"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_country_list_query'" @click="searchAccount">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_country_add'" @click="addCountry">新增国家</el-button>
          <el-button type="danger" v-has="'res_country_batch_delete'" @click="handleDeleteSelected">删除国家</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
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
          prop="id"
          sortable
          label="编号"
          width="80"
          >
        </el-table-column>
        <el-table-column
          prop="countryName"
          sortable
          label="国家名称">
        </el-table-column>
        <el-table-column
          prop="countryNameEn"
          sortable
          label="国家英文名称">
        </el-table-column>
        <el-table-column
          prop="updator"
          sortable
          label="修改人">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          sortable
          label="修改时间">
          <template slot-scope="scope">
            {{ scope.row.updateTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" v-has="'res_country_edit'" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" v-has="'res_country_delete'" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ tableData.total }} 条</span>
          <span>，{{ tableData.pages }} 页</span>
          <span>，{{ tableData.pageSize }} 条/页</span>
        </div>
        <el-pagination  @current-change="pageChange"
        @size-change="sizeChange"
          background
          :current-page="accountData.pageNum"
          :page-sizes="[10,20,50,100]"
          :page-size="accountData.pageSize"
          layout="sizes, prev, pager, next , jumper"
          :total="tableData.total"
          style="float: right">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title= "state" :visible.sync="dialogFormVisible" @close='closeDialog' center>
      <el-form :model="form"  ref="formRef" :rules="rules">
        <el-form-item label="国家名称" :label-width="formLabelWidth" prop="countryName">
          <el-input v-model="form.countryName" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="国家英文名称" :label-width="formLabelWidth" prop="countryNameEn">
          <el-input v-model="form.countryNameEn" maxlength="60" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="green" v-has="'res_country_edit'" @click="submitClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import utils from '@/utils'
import country from '@/api/country'
export default {
  data() {
     let validateCountry = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入国家英文名称'))
      }else if(!this.validate.english(value)){
        return callback(new Error('国家英文名称必须为字母'))
      }else {
        callback();
      }
     }
    return {
      searchKeyword: '',
      state: '添加',
      tableData: [],
      accountData:{
        pageNum: 1,  //当前页
        pageSize: 10, //一页显示的条数
        countryName: '', //国家名字
        updator : '' ,//修改人
      },
      selectedAccount: [],
      dialogFormVisible: false, //添加国家弹窗
      form: {},
      rules: {
          countryName: [
            {required: true, message: '请输入国家名称', trigger: 'blur'},
          ],
          countryNameEn: [
            {required: true, validator: validateCountry, trigger: 'blur'}
          ],
        },
      formLabelWidth: '120px',
    }
  },
  watch: {
    searchKeyword: function(val) {
      utils.searchKeyword(val)
    }
  },
  created(){
    this.searchRequest()
  },
  methods: {
    // 页面数据加载
    searchRequest(){
      this.searchKeyword = ''
      country.countryRequest(this.accountData).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.tableData = res.data
        }
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
    changeSelection(val) {
      this.selectedAccount = val
    },

    //删除一条国家
    handleDelete(row) {
      this.$confirm(`是否确定删除该国家？（${row.countryName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        country.delCountry({'id':row.id})
          .then(res => {
            if(res.returnCode == "ERR_0000") {
              this.$message({
                message: '国家删除成功',
                type: 'success'
              })
              this.searchRequest()
            }
          })
      }) .catch(() => { })
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
      })
        .then(() => {
          let accountIds = []
          this.selectedAccount.forEach(item => {
            accountIds.push(item.id)
          })
          country.deleteBatch(accountIds)
            .then(res => {
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
    //点击重置
    handleReset() {
      this.accountData.updator = ''
      this.accountData.countryName = ''
      this.$refs['accountRef'].resetFields()
      this.searchRequest()
    },
     closeDialog(){
      this.$refs['formRef'].resetFields()
    },
    // 新增国家
    addCountry(){
      this.state = '添加国家'
      this.dialogFormVisible = true
    },
    submitClick(){
      if(this.state == '添加国家'){
        this.submit()
      }else{
        this.submit2()
      }
    },
    // 添加国家点击确定
    submit(){
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          console.log(this.form)
          country.addCountry(this.form).then(res =>{
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '国家添加成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.searchRequest()
            }
          })
        }
      })
    },
    // 点击编辑
    handleEdit(row){
      this.state = '修改国家'
      this.dialogFormVisible = true
      country.detailCountry({'id':row.id}).then(res =>{
        if(res.returnCode == 'ERR_0000') {
          this.form = res.data
        }
      })
    },
    // 编辑国家点击提交
    submit2(){
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          country.editCountry(this.form).then(res =>{
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '国家修改成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.searchRequest()
            }
          })
        }
      })
    },
  },
}
</script>
