<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="head-search-card mt20">
      <el-form label-width="80px" :model="orgData" ref="orgRef">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="机构名称" prop="displayName">
              <el-input placeholder="输入机构名称" v-model="orgData.displayName" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所在城市" prop="cityName">
              <el-input placeholder="输入所在城市"  v-model="orgData.cityName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="机构地址" prop="address">
              <el-input placeholder="输入搜索的地址"  v-model="orgData.address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所属区域" prop="area">
              <el-select placeholder="请选择所属区域" v-model="orgData.area" style="width: 100%">
                <el-option label="全部" value="" id=""></el-option>
                <el-option
                v-for="item in addressData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="机构编码" prop="code">
              <el-input placeholder="输入机构的编码" v-model="orgData.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="机构类别" prop="type">
              <el-select placeholder="请选择机构类别" v-model="orgData.type" style="width: 100%">
                <el-option label="全部" value="" id=""></el-option>
                <el-option
                v-for="item in classData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="searchOrg">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" @click="$router.push({path: '/org/add'})">新增机构</el-button>
          <el-button type="danger" @click="handleDeleteSelected">删除机构</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table @selection-change="changeSelection"
        :data="tableData.list"
        stripe
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号"
          width="80"
          >
        </el-table-column>
        <el-table-column
          prop="displayName"
          sortable
          label="机构名称">
        </el-table-column>
        <el-table-column
          prop="code"
          sortable
          label="编码">
        </el-table-column>
        <el-table-column
          prop="cityName"
          sortable
          width="120"
          label="城市">
        </el-table-column>
        <el-table-column
          prop="address"
          sortable
          label="机构地址">
        </el-table-column>
        <el-table-column
          prop="contact"
          sortable
          label="联系方式">
        </el-table-column>
        <el-table-column
          sortable
          label="位置">
           <template slot-scope="scope">
            <span v-if="scope.row.longitude||scope.row.latitude">{{scope.row.longitude}},{{scope.row.latitude}}</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="area"
          sortable
          width="120"
          label="所属区域">
           <template slot-scope="scope">
            <span>{{areaFilter(scope.row.area)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          sortable
          width="120"
          label="机构类别">
          <template slot-scope="scope">
            <span>{{typeFilter(scope.row.type)}}</span>
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

        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button class="reset-icon" v-if="scope.row.id != 1" @click="$router.push({ path: `/org/${scope.row.id}` })" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button class="reset-icon" v-if="scope.row.id != 1" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
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
          background
          :current-page="orgData.pageNum"
          :page-sizes="[10,20,50,100]"
          :page-size="orgData.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="tableData.total"
          style="float: right">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import org from '@/api/org'
export default {
  data() {
    return {
      searchKeyword: '',
      tableData: [],
      addressData: [],
      classData: [],
        orgData:{
          pageNum: 1,  //当前页
          pageSize: 10, //一页显示的条数
          displayName: '', //机构名称
          address: '', //地址
          code: '', //机构编码
          cityName: '', //城市
          area: '',  //所属区域 0华北; 1华东; 2华南; 3其它
          type: ''  //机构类别 0直营店；1加盟店；2直盟店；3其它
        },
        selectedOrg: [] , //选中的机构
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  created(){
    this.searchRequest()
    this.areaQuest()
    this.typeQuest()
  },
  methods: {
    areaFilter(id){
      if(this.addressData.length){
        let row = this.addressData.find(item => item.id === id)
        if (!row) return ''
        return row.name
      }
    },
    typeFilter(id){
      if(this.classData.length){
        let row = this.classData.find(item => item.id == id)
        if (!row) return ''
        return row.name
      }
    },
    areaQuest(){
      org.areaRequest().then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.addressData = res.data
        }
      })
    },
    typeQuest(){
      org.typeRequest().then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.classData = res.data
        }
      })
    },
    // 查询机构
    searchRequest() {
      this.searchKeyword = ''
      org.searchRequest(this.orgData).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.tableData = res.data
        }
      })
    },
    //点击查询
    searchOrg(){
      this.searchRequest()
    },
    //点击重置
    handleReset() {
      this.$refs['orgRef'].resetFields()
      this.searchRequest()
    },
    //改变页数
    pageChange(val){
      this.orgData.pageNum = val
      this.searchRequest()
    },
    //改变每页条数
    sizeChange(val){
      this.orgData.pageSize = val
      this.searchRequest()
    },
    //删除一条机构
    handleDelete(row) {
      this.$confirm(`是否确定删除该机构列表？（${row.displayName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        org.delRequest(row.id)
          .then(res => {
            if(res.returnMsg == 'success') {
              this.$message({
                message: '机构删除成功',
                type: 'success'
              })
              this.searchRequest()
            }
          }).catch(() => {})
      })
    },
    //批量删除机构
    handleDeleteSelected() {
      if (this.selectedOrg.length <= 0) {
        this.$message.error('请选择删除内容')
        return
      }
      this.$confirm("确定要删除选中的机构?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let orgIds = []
          this.selectedOrg.forEach(item => {
            orgIds.push(item.id)
          })
          org.delAllRequest(orgIds)
            .then(res => {
              if(res.returnMsg == 'success') {
                this.$message({
                  message: '机构删除成功',
                  type: 'success'
                })
                this.searchRequest()
              }
            })
        })
    },
    changeSelection(val) {
      this.selectedOrg = val
    },
  },
}
</script>
