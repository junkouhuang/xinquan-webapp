<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form label-width="80px" :model="accountData" ref="accountRef">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="省份名称">
              <el-input placeholder="输入省份名称" v-model="accountData.provinceName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="修改人">
              <el-input placeholder="输入修改人" v-model="accountData.updator"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_province_list_query'" @click="searchAccount">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_province_add'" @click="addCountry">新增省份</el-button>
          <el-button type="danger" v-has="'res_province_batch_delete'" @click="handleDeleteSelected">删除省份</el-button>
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
          prop="provinceName"
          sortable
          label="省份名称">
        </el-table-column>
        <el-table-column
          prop="provinceNameEn"
          sortable
          label="省份英文名称">
        </el-table-column>
        <el-table-column
          prop="countryName"
          sortable
          label="所在国家">
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
            <el-tooltip class="item" v-has="'res_province_edit'" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" v-has="'res_province_delete'" effect="dark" content="删除" placement="top">
              <el-button  class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
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
          :current-page=accountData.pageNum
          :page-sizes="[10,20,50,100]"
          :page-size=accountData.pageSize
          layout="sizes, prev, pager, next, jumper"
          :total="tableData.total"
          style="float: right">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="state" :visible.sync="dialogFormVisible" @close='closeDialog' center>
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="省份名称" :label-width="formLabelWidth" prop="provinceName">
          <el-input v-model="form.provinceName"  maxlength="30" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="省份英文名称" :label-width="formLabelWidth" prop="provinceNameEn">
          <el-input v-model="form.provinceNameEn" maxlength="60" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择国家" :label-width="formLabelWidth" prop="countryId">
          <el-select v-model="form.countryId" placeholder="请选择国家" style="width:100%">
            <el-option :label="item.countryName" :value="item.id" v-for="(item,index) in optionData" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="green" v-has="'res_province_edit'" @click="submitClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import utils from '@/utils'
import province from '@/api/province'
import {countryRequest} from '@/api/org'
export default {
  data() {
    let validateCountry = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入省份英文名称'))
      }else if(!this.validate.english(value)){
        return callback(new Error('省份英文名称必须为字母'))
      }else {
        callback();
      }
    }
    return {
      searchKeyword: '',
      state: '',
      tableData: [],
      accountData:{
        pageNum: 1,  //当前页
        pageSize: 10, //一页显示的条数
        provinceName: '', //省份名称
        updator : '' ,//修改人
      },
      selectedAccount: [],
      dialogFormVisible: false, //弹窗
      form: {},
      rules: {
          provinceName: [
            {required: true, message: '请输入省份名称', trigger: 'blur'},
          ],
          provinceNameEn: [
            {required: true, validator: validateCountry, trigger: 'blur'},
          ],
          countryId: [
            {required: true, message: '请选择国家', trigger: 'change'},
          ]
        },
      formLabelWidth: '120px',
      optionData: [],
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
      province.provinceRequest(this.accountData).then(res => {
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
    //删除一条
    handleDelete(row) {
      this.$confirm(`是否确定删除该省份？（${row.provinceName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        province.delCountry({'id':row.id})
          .then(res => {
            if(res.returnCode == "ERR_0000") {
              this.$message({
                message: '省份删除成功',
                type: 'success'
              })
              this.searchRequest()
            }
          })
           .catch(() => { })
      })
    },
    //批量删除
    handleDeleteSelected() {
      if (this.selectedAccount.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的省份?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let accountIds = []
          this.selectedAccount.forEach(item => {
            accountIds.push(item.id)
          })
          province.deleteBatch(accountIds)
            .then(res => {
              if(res.returnMsg == 'success') {
                this.$message({
                  message: '省份删除成功',
                  type: 'success'
                })
                this.searchRequest()
              }else{
                this.$message({
                  message: '省份删除失败',
                  type: 'error'
                })
              }
            })
        })
    },
    //点击重置
    handleReset() {
      this.accountData.updator = ''
      this.accountData.provinceName = ''
      this.$refs['accountRef'].resetFields()
      this.searchRequest()
    },
    changeSelection(val) {
      this.selectedAccount = val
    },
    // 获取弹窗国家
    country(){
      countryRequest().then(res =>{
        if(res.returnCode == "ERR_0000") {
          this.optionData = res.data
        }
      })
    },
    // 关闭弹窗
    closeDialog(){
      this.$refs['formRef'].resetFields()
    },
    // 新增省份
    addCountry(){
      this.state = '添加省份'
      this.dialogFormVisible = true
      console.log(this.optionData.length==0)
      if(this.optionData.length==0){
        this.country()
      }
    },
    submitClick(){
      if(this.state == '添加省份'){
        this.submit()
      }else{
        this.submit2()
      }
    },
    // 添加省份点击确定
    submit(){
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          province.addCountry(this.form).then(res =>{
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '省份添加成功',
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
      this.state = '修改省份'
      this.dialogFormVisible = true
      if(this.optionData.length==0){
        this.country()
      }
      province.detailCountry({'id':row.id}).then(res =>{
        if(res.returnCode == 'ERR_0000') {
          this.form = res.data
          this.form.countryId = Number(res.data.countryId)
          // this.country()
        }
      })
    },
    // 编辑省份点击提交
    submit2(){
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          province.editCountry(this.form).then(res =>{
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '省份修改成功',
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
