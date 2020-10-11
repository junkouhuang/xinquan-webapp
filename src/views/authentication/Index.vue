<template>
  <div>
    <el-card shadow="never" class="head-search-card mt20">
      <el-form label-width="80px" :model="accountData" ref="accountRef">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="关键字" prop="phoneNumber">
              <el-input placeholder="用户名/会员号/手机号搜索" v-model="accountData.userKeyWord" @keyup.enter.native="searchAccount" clearable></el-input>
            </el-form-item>
          </el-col>
          <!--<el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="所属企业" prop="organizationName">
              <el-input placeholder="输入企业名称" v-model="accountData.enterpriseName" clearable></el-input>
            </el-form-item>
          </el-col>-->
         <!-- <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="状态" prop="state">
              <el-select placeholder="请选择状态" v-model="accountData.status" style="width: 100%" clearable>
                <el-option
                  v-for="(item,index) in statusData"
                  :key="index"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="searchAccount" v-has="'res_realname_authorize_query'">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix" style="padding: 10px 0;margin-bottom: -25px ;">
        <el-tabs v-model="activeName" @tab-click="statusHandleClick">
          <el-tab-pane :label="`全部(${statusQuantity.total})`" name="first" style="font-size: 60px">
          </el-tab-pane>
          <el-tab-pane :label="`待审核(${statusQuantity.auditingCount})`" name="secode" >
              <span slot="label" v-if="unreadNum>0">待审核({{statusQuantity.auditingCount}})<el-badge
                  :value="unreadNum"></el-badge></span>
          </el-tab-pane>
          <el-tab-pane :label="`审核不通过(${statusQuantity.refAuditCount})`" name="four" ></el-tab-pane>
          <el-tab-pane :label="`审核通过(${statusQuantity.approveCount})`" name="third"></el-tab-pane>
        </el-tabs>
        <div class="header-keywords-input pull-right" style="margin-top: -70px">
          <el-input placeholder="输入关键词搜索" v-model.trim="searchKeyword">
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
                type="index"
                width="50"
                label="序号">
          <template slot-scope="scope">
            {{((accountData.pageNum-1)  * accountData.pageSize) +scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
                prop="authUserId"
                sortable
                label="会员号">
        </el-table-column>
        <el-table-column
                prop="authUserName"
                sortable
                label="用户名">
        </el-table-column>
        <el-table-column
          prop="subMobileNumber"
          sortable
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="subIdCode"
          sortable
          label="身份证号">
        </el-table-column>
        <el-table-column
          prop="authTime"
          sortable
          label="申请时间">
          <template slot-scope="scope">
            {{ scope.row.authTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          sortable
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" class="label label-warning">待审核</span>
            <span v-if="scope.row.status == 1" class="label label-success">审核通过</span>
            <span v-if="scope.row.status == 2" class="label label-danger">审核不通过</span>
          </template>
        </el-table-column>
       <!-- <el-table-column
          prop="enterpriseNameList"
          sortable
          label="所属企业">
          <template slot-scope="scope">
            <div style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;line-clamp: 2;box-orient: vertical;">
              <span v-for="(item,index) in scope.row.enterpriseNameList" :key="index">{{item.enterpriseName}}<br/></span>
            </div>
          </template>
        </el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="详情" placement="top" v-has="'res_realname_authorize_detail'">
              <el-button class="reset-icon" @click="$router.push({ path: `/authentication/detail/${scope.row.authId}` })" type="text" >
                <i class="iconfont">&#xe605;</i>
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
          background
          :current-page="accountData.pageNum"
          :page-sizes="[10,20,50,100]"
          :page-size="accountData.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="total"
          style="float: right">
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>

<script>
import account from '@/api/account'
import { getAuthenticationList,findById,updateStatus,findCount,updateUaunread,getUaunreadCount} from '@/api/authentication'


export default {
  data() {
    return {
      activeName:'first',
      unreadNum:0,
      searchKeyword: '',
      tableData: [],
      form:{},
      accountData:{
        pageNum: 1,  //当前页
        pageSize: 10, //一页显示的条数
        status: null, //状态0-待审核 1-通过 2-拒绝
        enterpriseName:null, //企业名 搜索
        userKeyWord : null ,//会员号/用户名/手机号 搜索
      },
      statusData:[
        {
          name:'全部',
          value: ''
        },
        {
          name:'待审核',
          value: '0'
        },
        {
          name:'审核通过',
          value: '1'
        },
        {
          name:'审核不通过',
          value: '2'
        }
      ],
      selection: [],
      statusQuantity:{}
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  created(){
    this.statusRequest();
    this.searchRequest();
    this. queryUaunreadCount();
  },
  activated(){
    this.searchRequest();
  },
  methods: {
    typeRequest(){
      account.typeRequest().then(res =>{
        if(res.returnCode == 'ERR_0000'){
          for(let i = 0 ,j = res.data.length; i< j; i++){
          this.typeData.push(res.data[i])
          }
        }
      })
    },
    queryUaunreadCount(){
      getUaunreadCount().then(res=>{
        if (res.returnCode == 'ERR_0000') {
          this.unreadNum=res.data;
        }
      })
    },
    isRead(){
      updateUaunread().then(res=>{
        console.log(res);
        if (res.returnCode == 'ERR_0000') {
          this.queryUaunreadCount();//清空完之后重新查信息是否有未读完消息
        }
      })
    },
    // 页面数据加载
    searchRequest(){
      this.searchKeyword = ''
      getAuthenticationList(this.accountData).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.tableData = res.data;
          this.total = res.data.total;
        }
      })
    },
    //状态数量
    statusRequest(){
      findCount(this.accountData).then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.statusQuantity=res.data;
        }
      })
    },
    // 点击查询
    searchAccount() {
      this.accountData.pageNum = 1;
      this.searchRequest();
      this.statusRequest();
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

    //点击重置
    handleReset() {
      this.accountData.userKeyWord="";
      this.accountData.enterpriseName="";
      this.accountData.status="";
      this.$refs['accountRef'].resetFields()
      this.searchRequest();
      this.statusRequest();
    },
    changeSelection(val) {
      this.selectedAccount = val
    },
    //表格状态栏切换
    statusHandleClick(tab){
      console.log('切换tabs')
      this.accountData.status = tab.name == "first"?null:tab.name == "secode"?0:tab.name == "third"?1:tab.name=="four"?2:'';
      if (tab.name=='secode'){
        this.isRead();//当选中待审核时标注已读
      }
      this.searchRequest();
    },
  }
}
</script>
