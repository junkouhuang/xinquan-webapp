<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form label-width="80px" :model="accountData" ref="accountRef">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所属省份">
              <el-input placeholder="输入所属省份" v-model="accountData.provinceName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="城市名称">
              <el-input placeholder="输入城市名称" v-model="accountData.cityName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="修改人">
              <el-input placeholder="输入修改人" v-model="accountData.updator"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_city_list_query'" @click="searchAccount">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_city_add'" @click="addCountry">新增城市</el-button>
          <el-button type="danger" v-has="'res_city_batch_delete'" @click="handleDeleteSelected">删除城市</el-button>
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
          prop="cityName"
          sortable
          label="城市名称">
        </el-table-column>
        <el-table-column
          prop="cityNameEn"
          sortable
          label="城市英文名称">
          </el-table-column>
          <el-table-column
          prop="countryName"
          sortable
          label="所在国家">
        </el-table-column>
        <el-table-column
          prop="provinceName"
          sortable
          label="所在省份">
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
            <el-tooltip class="item" v-has="'res_city_edit'" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" v-has="'res_city_delete'" effect="dark" content="删除" placement="top">
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
        <el-pagination
          @current-change="pageChange"
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
    <el-dialog :title="state" :visible.sync="dialogFormVisible"  center   @close='closeDialog'>
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="城市名称" :label-width="formLabelWidth" prop="cityName">
          <el-input v-model="form.cityName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市英文名称" :label-width="formLabelWidth" prop="cityNameEn">
          <el-input v-model="form.cityNameEn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择国家" :label-width="formLabelWidth" prop="countryId">
          <el-select v-model="form.countryId" placeholder="请选择国家"  @change="countryChange" style="width:100%">
            <el-option v-for="(item,index) in countryData" :label="item.countryName" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择省份" :label-width="formLabelWidth" prop="provinceId">
          <el-select v-model="form.provinceId" placeholder="请选择省份"  style="width:100%">
            <el-option v-for="(item,index) in provinceData" :label="item.provinceName" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="green" v-has="'res_city_edit'" @click="submitClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import city from '@/api/city'
import {countryRequest,provinceRequest} from '@/api/org'
export default {
  data() {
    let validateCountry = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入城市英文名称'))
      }else if(!this.validate.english(value)){
        return callback(new Error('城市英文名称必须为字母'))
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
        cityName: '', //省份名称
        updator : '', //修改人
        provinceName: ''
      },
      selectedAccount: [],
      dialogFormVisible: false, //弹窗
      form: {
        cityName:'',
        cityNameEn:'',
        countryId:'',
        provinceId:''
      },
      formLabelWidth: '120px',
      countryData: [],
      provinceData: [],
      rules: {
        cityName: [
          {required: true, message: '请输入城市名称', trigger: 'blur'},
        ],
        cityNameEn: [
          {required: true, validator: validateCountry, trigger: 'blur'},
        ],
        countryId: [
          {required: true, message: '请选择国家', trigger: 'change'},
        ],
        provinceId: [
          {required: true, message: '请选择省份', trigger: 'change'},
        ],
      },
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  created(){
    this.searchRequest()
  },
  methods: {
    // 页面数据加载
    searchRequest(){
      this.searchKeyword = ''
      city.cityRequest(this.accountData).then(res => {
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
      this.$confirm(`是否确定删除该城市？（${row.cityName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        city.delCountry({'id':row.id})
          .then(res => {
            if(res.returnCode == "ERR_0000") {
              this.$message({
                message: '城市删除成功',
                type: 'success'
              })
              this.searchRequest()
            }
          })

      }).catch(() => { })
    },
    //批量删除
    handleDeleteSelected() {
      if (this.selectedAccount.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的城市?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let accountIds = []
          this.selectedAccount.forEach(item => {
            accountIds.push(item.id)
          })
          city.deleteBatch(accountIds)
            .then(res => {
              if(res.returnMsg == 'success') {
                this.$message({
                  message: '城市删除成功',
                  type: 'success'
                })
                this.searchRequest()
              }else{
                this.$message({
                  message: '城市删除失败',
                  type: 'error'
                })
              }
            })
        }).catch(() => { })
    },
    //点击重置
    handleReset() {
      this.accountData.updator = ''
      this.accountData.cityName = ''
      this.$refs['accountRef'].resetFields()
      this.searchRequest()
    },
    closeDialog(){
      this.$refs['formRef'].resetFields()
    },
    changeSelection(val) {
      this.selectedAccount = val
    },
     // 新增城市
    addCountry(){
      this.state = '添加城市'
      this.dialogFormVisible = true
      if(this.countryData.length==0){
        this.country()
      }
    },
    // 获取弹窗国家
    country(){
      countryRequest().then(res =>{
        if(res.returnCode == "ERR_0000") {
          this.countryData = res.data
        }
      })
    },
    // 查询省份
    province(country){
      provinceRequest(country).then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.provinceData = res.data
        }
      })
    },
    // 改变国家
    countryChange(val){
      this.form.provinceId = ''
      this.province(val)
    },
    submitClick(){
      if(this.state == '添加城市'){
        this.submit()
      }else{
        this.submit2()
      }
    },
     // 添加省份点击确定
    submit(){
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          city.addCountry(this.form).then(res =>{
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '城市添加成功',
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
      this.state = '编辑城市'
      this.dialogFormVisible = true
      if(this.countryData.length==0){
        this.country()
      }
      city.detailCountry({'id':row.id}).then(res =>{
        if(res.returnCode == 'ERR_0000') {
          this.form = res.data
          this.form.countryId = Number(res.data.countryId)
          this.form.provinceId = Number(res.data.provinceId)
          // this.country()
          this.province(this.form.countryId)
        }
      })
    },
    // 编辑省份点击提交
    submit2(){
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          city.editCountry(this.form).then(res =>{
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '城市修改成功',
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
