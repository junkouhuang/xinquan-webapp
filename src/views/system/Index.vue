<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form label-width="45px" :model="accountData" ref="accountRef">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="名称">
              <el-input placeholder="输入名称" v-model="accountData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_system_setting_list_query'" @click="searchAccount">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_system_setting_add'" @click="addCountry">新增系统参数</el-button>
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
          label="序号"
          width="80">
          <template slot-scope="scope">
            {{ tableData.total - scope.$index - ((accountData.pageNum - 1) * accountData.pageSize) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          sortable
          label="名称">
        </el-table-column>
        <el-table-column
          prop="value"
          width="400"
          sortable
          label="值">
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable
          label="添加时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
         <el-table-column
          prop="remark"
          sortable
          label="描述">
           <template slot-scope="scope">
            {{ scope.row.remark=="undefined" ? '': scope.row.remark}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" v-has="'res_system_setting_edit'" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" v-has="'res_system_setting_delete'" effect="dark" content="删除" placement="top">
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
    <el-dialog title="添加系统参数" :visible.sync="dialogFormVisible"  center>
      <el-form :model="form"  ref="formRef" :rules="rules">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth" prop="value">
          <el-input type="textarea" rows="5" v-model="form.value"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="green" v-has="'res_system_setting_add'" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
     <el-dialog title="修改系统参数" :visible.sync="dialogFormVisible2"  center>
      <el-form :model="form2"  ref="formRef2" :rules="rules2">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <div>{{form2.name}}</div>
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth" prop="value">
          <el-input type="textarea" rows="5" v-model="form2.value"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form2.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="green" v-has="'res_system_setting_edit'" @click="submit2">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import utils from '@/utils'
import system from '@/api/system'
export default {
  data() {
     let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入名称'))
      }else {
        system.nameExist({'name':value}).then(res =>{
          if(res.returnCode != 'ERR_0000'){
            return callback(new Error('名称已存在'))
          }else{
            callback();
          }
        })
      }
     }
    return {
      searchKeyword: '',
      tableData: [],
      accountData:{
        pageNum: 1,  //当前页
        pageSize: 10, //一页显示的条数
        name: '', //名字
      },
      selectedAccount: [],
      dialogFormVisible: false, //添加弹窗
      form: {},
      rules: {
          name: [
            {required: true, validator: validateName, trigger: 'blur'},
          ],
          value: [
            {required: true, message: '输入的值不为空', trigger: 'blur'}
          ],
        },
      rules2: {
          value: [
            {required: true, message: '输入的值不为空', trigger: 'blur'}
          ],
        },
      formLabelWidth: '120px',
      dialogFormVisible2: false, //修改弹窗
      form2: {},
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
      system.countryRequest(this.accountData).then(res => {
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

    //删除一条
    handleDelete(row) {
      this.$confirm(`是否确定删除该系统参数？（${row.name}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        system.delCountry({'name':row.name})
          .then(res => {
            if(res.returnCode == "ERR_0000") {
              this.$message({
                message: '系统参数删除成功',
                type: 'success'
              })
              this.searchRequest()
            }
          })
      }) .catch(() => { })
    },
    //点击重置
    handleReset() {
      this.accountData.name = ''
      this.$refs['accountRef'].resetFields()
      this.searchRequest()
    },
    // 新增
    addCountry(){
      this.dialogFormVisible = true
    },
    // 添加点击确定
    submit(){
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          system.addCountry(this.form).then(res =>{
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '系统参数添加成功',
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
      this.dialogFormVisible2 = true
      system.detailCountry({'name':row.name}).then(res =>{
        if(res.returnCode == 'ERR_0000') {
          this.form2 = res.data
        }
      })
    },
    // 编辑国家点击提交
    submit2(){
      this.$refs['formRef2'].validate(valid => {
        if (valid) {
          system.editCountry(this.form2).then(res =>{
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '系统参数修改成功',
                type: 'success'
              })
              this.dialogFormVisible2 = false
              this.searchRequest()
            }
          })
        }
      })
    },
  },
}
</script>
