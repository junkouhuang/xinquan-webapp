<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form label-width="80px" :model="accountData" ref="accountRef">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所属省份">
              <el-input placeholder="输入省份名称" v-model="accountData.province"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所属城市">
              <el-input placeholder="输入城市名称" v-model="accountData.city"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="区县名称">
              <el-input placeholder="输入区县名称" v-model="accountData.district"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_district_list_query'" @click="searchAccount">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="pull-left">
          <el-button type="blue" v-has="'res_district_add'" @click="addErea">新增区县</el-button>
          <el-button type="danger" v-has="'res_district_bah_delete'" @click="handleDeleteSelected">删除区县</el-button>
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
          prop="district"
          sortable
          label="区县名称">
        </el-table-column>
          <el-table-column
          prop="country"
          sortable
          label="所在国家">
        </el-table-column>
        <el-table-column
          prop="province"
          sortable
          label="所在省份">
        </el-table-column>
        <el-table-column
          prop="city"
          sortable
          label="所在城市">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          sortable
          label="修改时间">
          <template slot-scope="scope">
            {{ scope.row.updateTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          sortable
          label="状态">
          <template slot-scope="scope">
            {{scope.row.status===1 ? '未上架':'上架'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope="scope">
             <el-tooltip class="item" v-has="'res_district_up'" effect="dark" content="上架" placement="top" v-if="scope.row.status===1">
              <el-button class="reset-icon" @click="upDown(scope.row)" type="text" icon="el-icon-upload2"></el-button>
            </el-tooltip>
             <el-tooltip class="item" v-has="'res_district_down'" effect="dark" content="下架" placement="top" v-else>
              <el-button class="reset-icon" @click="upDown(scope.row)" type="text" icon="el-icon-download"></el-button>
            </el-tooltip>
            <el-tooltip class="item" v-has="'res_district_edit'" effect="dark" content="编辑" placement="top" style="color: #69c3dc">
              <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" v-has="'res_district_delete'" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete" ></el-button>
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
          layout="sizes, prev, pager, next, jumper"
          :total="tableData.total"
          style="float: right">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="state" :visible.sync="dialogFormVisible"  center  @close='closeDialog'>
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="区县名称" :label-width="formLabelWidth" prop="district">
          <el-input v-model="form.district" autocomplete="off"></el-input>
        </el-form-item>
          <el-form-item label="选择国家" :label-width="formLabelWidth" prop="areaCode">
          <el-select v-model="form.areaCode" placeholder="请选择国家"  @change="countryChange" style="width:100%">
            <el-option v-for="(item,index) in countryData" :key="index" :label="item.countryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择省份" :label-width="formLabelWidth" prop="areaCode1">
          <el-select v-model="form.areaCode1" placeholder="请选择省份"  style="width:100%" @change="proChange">
            <el-option v-for="(item,index) in provinceData" :key="index" :label="item.provinceName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="选择城市" :label-width="formLabelWidth" prop="areaCode2">
        <el-select v-model="form.areaCode2" placeholder="请选择城市"  style="width:100%"  @change="cityChange">
          <el-option v-for="(item,index) in cityData" :key="index" :label="item.cityName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="green" v-has="'res_district_edit'" @click="submitClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import area from '@/api/area'
import {countryRequest,provinceRequest,cityRequest} from '@/api/org'
export default {
  data() {
    return {
      searchKeyword: '',
      state: '',
      tableData: [],
      accountData:{
        pageNum: 1,  //当前页
        pageSize: 10, //一页显示的条数
        city: '', //区县名称
        country: '',
        province: '',
        district: ''
      },
      selectedAccount: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      form: {
        cityName: '',
        country:'',
        province:'',
        city:'',
        district:'',
        areaCode:'',
        areaCode1:'',
        areaCode2:'',
        remark:'',
        updator:''},
      formLabelWidth: '120px',
      countryData:[],
      cityData: [],
      provinceData: [],
      rules: {
        district: [
          {required: true, message: '请输入城市名称', trigger: 'blur'},
        ],
        areaCode: [
          {required: true, message: '请选择国家', trigger: 'blur'},
        ],
        areaCode1: [
          {required: true, message: '请选择省份', trigger: 'blur'},
        ],
        areaCode2: [
          {required: true, message: '请选择城市', trigger: 'blur'},
        ],
      },
    }
  },
  created(){
    this.searchRequest()
    // this.country()
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  methods: {
    // 页面数据加载
    searchRequest(){
      this.searchKeyword = ''
      area.areaRequest(this.accountData).then(res => {
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
    //删除一条区县
    handleDelete(row) {
      this.$confirm(`是否确定删除该区县？（${row.district}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        area.delCountry({'id':row.id})
          .then(res => {
            if(res.returnCode == "ERR_0000") {
              this.$message({
                message: '区县删除成功',
                type: 'success'
              })
              this.searchRequest()
            }
          })
      }) .catch(() => { })
    },
    //批量删除区县
    handleDeleteSelected() {
      if (this.selectedAccount.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的区县?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let accountIds = []
          this.selectedAccount.forEach(item => {
            accountIds.push(item.id)
          })
          area.deleteBatch(accountIds)
            .then(res => {
              if(res.returnMsg == 'success') {
                this.$message({
                  message: '区县删除成功',
                  type: 'success'
                })
                this.searchRequest()
              }else{
                this.$message({
                  message: '区县删除失败',
                  type: 'error'
                })
              }
            })
        }).catch(() => { })
    },
    //点击重置
    handleReset() {
      this.accountData.district = ''
      this.$refs['accountRef'].resetFields()
      this.searchRequest()
    },
    changeSelection(val) {
      this.selectedAccount = val
    },
    addErea(){
      this.dialogFormVisible = true
      this.state = '添加区县'
      if(this.countryData.length==0){
        this.country()
      }
    },
    closeDialog(){
      this.$refs['formRef'].resetFields()
    },
    submitClick(){
      if(this.state == '添加区县'){
        this.submit()
      }else{
        this.submit2()
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
    province(value){
      provinceRequest(value).then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.provinceData = res.data
        }
      })
    },
    // 查询城市
    city(country,value){
      cityRequest({'country': country, 'province':value}).then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.cityData = res.data
        }
      })
    },
    // 改变国家
    countryChange(val){
      this.form.areaCode1 = ''
      this.form.areaCode2 = ''
      this.province(val)
      let obj = {};
      obj = this.countryData.find((item)=>{
        return item.id === val
      });
      this.form.country = obj.countryName
    },
    // 改变省份
    proChange(val){
      this.form.areaCode2 = ''
      this.city(this.form.areaCode,val)
      let obj = {};
      obj = this.provinceData.find((item)=>{
        return item.id === val
      });
      this.form.province = obj.provinceName
    },
    cityChange(val){
      let obj2 = {};
      obj2 = this.cityData.find((item)=>{
        return item.id === val
      });
      this.form.city = obj2.cityName
    },
      // 添加省份点击确定
    submit(){
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          area.addCountry(this.form).then(res =>{
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
      this.dialogFormVisible = true
      this.state = '修改区县'
      if(this.countryData.length==0){
        this.country()
      }
      area.detailCountry({'id':row.id}).then(res =>{
        if(res.returnCode == 'ERR_0000') {
         this.form = res.data
         this.form.areaCode = res.data.areaCode-0
         this.form.areaCode1 =res.data.areaCode1-0
         this.form.areaCode2 = res.data.areaCode2-0
        //  this.country()
         this.province(this.form.areaCode)
         this.city(this.form.areaCode,this.form.areaCode1)
        }
      })
    },
     // 编辑省份点击提交
    submit2(){
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          area.editCountry(this.form).then(res =>{
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '省份修改成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.searchRequest()
            }
          })
        }else{
          return false
        }
      })
    },
     // 点击上下架
    upDown(row) {
      if (row.status == 1) {
        //上架
        this.$confirm(`是否确定上架该区县？（${row.district}）`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          area.editCountry({'id':row.id,'status':2}).then(res => {
            if (res.returnCode == "ERR_0000") {
              this.$message({
                message: "区县上架成功",
                type: "success"
              })
              this.searchRequest()
            }
          })
        }).catch(() => {})
      } else {
        //下架
        this.$confirm(`是否确定下架以下区县？（${row.district}）`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          area.editCountry({'id':row.id,'status':1}).then(res => {
            if (res.returnCode == "ERR_0000") {
               this.$message({
                message: "区县下架成功",
                type: "success"
              })
              this.searchRequest()
            }
          })
        }).catch(() => {})
      }
    },
  },
}
</script>
