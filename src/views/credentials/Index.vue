<template>
    <div>
        <el-card shadow="never" class="mt20">
            <el-form label-width="80px" :model="accountData" ref="accountRef">
                <el-row :gutter="20">
                    <el-col :xl="{span: 5}" :lg="{span: 8}" :md="{span: 12}" :sm="{span: 12}">
                        <el-form-item label="关键字">
                            <el-input placeholder="输入企业/客户名称" v-model.trim="accountData.enterpriseName" @keyup.enter.native="searchAccount" clearable></el-input>
                        </el-form-item>
                    </el-col>
                   <!--<el-col :xl="{span: 5}" :lg="{span: 8}" :md="{span: 12}" :sm="{span: 12}">
                        <el-form-item label="状态">
                            <el-select v-model="accountData.status" placeholder="请选择" @change="currentSel" clearable>
                                <el-option label="全部" value=""></el-option>
                                <el-option label="待审核" value="0"></el-option>
                                <el-option label="审核通过" value="1"></el-option>
                                <el-option label="审核不通过" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>-->
                    <el-col :xl="{span: 8}" :lg="{span: 14}" :md="{span: 18}" :sm="{span: 19}">
                        <el-form-item label="申请时间">
                            <el-date-picker
                                    v-model="accountData.startTime"
                                    type="date"
                                    clearable
                                    value-format="yyyy-MM-dd"
                                    placeholder="开始时间">
                            </el-date-picker>
                            <span>-</span>
                            <el-date-picker
                                    v-model="accountData.endTime"
                                    type="date"
                                    clearable
                                    value-format="yyyy-MM-dd"
                                    placeholder="结束时间">
                            </el-date-picker>
                            <!--<el-date-picker
                                    clearable
                                    v-model="time"
                                    type="daterange"
                                    range-separator="至"
                                    value-format=" yyyy-MM-dd"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间">
                            </el-date-picker>-->
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :md="{span: 7}" :sm="{span: 7}">
                        <el-button type="blue" @click="searchAccount" v-has="'res_credentials_query'">查 询</el-button>
                        <el-button @click="handleReset">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <el-card shadow="never" class="mt20">
            <div slot="header" class="clearfix" style="padding: 10px 0;margin-bottom: -25px ;">
              <el-tabs v-model="activeName" @tab-click="statusHandleClick">
                <el-tab-pane :label="`全部(${statusQuantity.allCount })`" name="first" style="font-size: 60px">
                </el-tab-pane>
                <el-tab-pane :label="`待审核(${statusQuantity.toBeReviewedCount})`" name="secode" >
              <span slot="label" v-if="unreadNum>0">待审核({{statusQuantity.toBeReviewedCount}})<el-badge
                  :value="unreadNum"></el-badge></span>
                </el-tab-pane>
                <el-tab-pane :label="`审核不通过(${statusQuantity.auditNoPass})`" name="third" ></el-tab-pane>
                <el-tab-pane :label="`审核通过(${statusQuantity.auditPass})`" name="four"></el-tab-pane>
              </el-tabs>
                <div class="header-keywords-input pull-right" style="margin-top: -70px">
                    <el-input placeholder="输入关键字搜索" v-model.trim="searchKeyword" >
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
                        width="80"
                        label="序号">
                    <template slot-scope="scope">
                        {{((accountData.pageNum-1)  * accountData.pageSize) +scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="enterpriseName"
                        sortable
                        label="企业名称"
                >
                </el-table-column>
                <el-table-column
                        prop="modeName"
                        label="企业类型">
                </el-table-column>
                <el-table-column
                        prop="location"
                        sortable
                        label="地区">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createTime"
                        sortable
                        label="证件变更时间">
                    <template slot-scope="scope">
                        <div style="width: 100%;" >
                          {{scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="status"
                        sortable
                        label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0" class="label label-info">待审核</span>
                        <span v-if="scope.row.status == 1" class="label label-success">审核通过</span>
                        <span v-if="scope.row.status == 2" class="label label-danger">审核不通过</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                       <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
                        </el-tooltip>-->
                        <el-tooltip class="item" effect="dark" content="查看" placement="top" v-has="'res_credentials_detail'" >
                            <el-button class="reset-icon" @click="$router.push({ path: `/credentials/detail/${scope.row.enterpriseId}` })" type="text" >
                                <i class="iconfont">&#xe605;</i>
                            </el-button>
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
    </div>
</template>
<script>
    import utils from '@/utils'
    import { getCredentialsList,updateEpunread,getEpunreadCount,getDocumentsCount} from '@/api/credentials'


    export default {
        data() {
            return {
                unreadNum:0,
                activeName:'first',
                searchKeyword: '',
                state: '添加',
                tableData: [],
                accountData:{
                    pageNum: 1,  //当前页
                    pageSize: 10, //一页显示的条数
                    enterpriseName: '', //企业名筛选
                    status : '' , //状态筛选 (0待审核,3已审核,1审核通过,2审核不通过)
                    startTime : '' , //开始时间
                    endTime:'', //结束时间
                },
              statusQuantity:{},
            }
        },
        watch: {
            searchKeyword: function(val) {
                utils.searchKeyword(val)
            },
        },
        created(){
          this.searchRequest(); // 重新加载
          this.queryAunreadCount();
          this.statusRequest();
        },
        activated() {
          //this.searchRequest(); // 重新加载
          console.log("====**======")
        },

        methods: {
          queryAunreadCount(){
            getEpunreadCount().then(res=>{
              if (res.returnCode == 'ERR_0000') {
                this.unreadNum=res.data;
              }
            })
          },
          statusRequest(){
            getDocumentsCount(this.accountData).then(res =>{
              if(res.returnCode == 'ERR_0000'){
                this.statusQuantity=res.data;
              }
            });
          },
          isRead(){
            updateEpunread().then(res=>{
              if (res.returnCode == 'ERR_0000') {
                this.queryAunreadCount();//清空完之后重新查信息是否有未读完消息
              }
            })
          },
            // 页面数据加载
            searchRequest(){
              getCredentialsList(this.accountData).then(res => {
                    if(res.returnCode == 'ERR_0000'){
                        this.tableData = res.data || [];
                    }
                })
            },
            //状态
            currentSel(selVal){
                this.accountData["status"] = selVal;
                this.searchRequest();
            },
            // 点击查询
            searchAccount() {
                if(this.accountData.startTime<=this.accountData.endTime){
                    this.accountData.pageNum = 1;
                    this.searchRequest();
                }else{
                    this.$message({
                        message: '开始时间不能大于结束时间',
                        type: 'warning'
                    });
                }
            },
          //表格状态栏切换
          statusHandleClick(tab){
            this.accountData.status = tab.name == "first"?"":tab.name == "secode"?0:tab.name == "third"?2:tab.name=="four"?1:'';
            if (tab.name=='secode'){
              this.isRead();//当选中待审核时标注已读
            }
            this.searchRequest();
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
            //点击重置
            handleReset() {
                this.accountData.enterpriseName = ''
                this.accountData.status = ''
                this.accountData.startTime = ''
                this.accountData.endTime = ''
                this.$refs['accountRef'].resetFields()
                this.searchRequest();
            },
        },
    }
</script>
<style scoped>
    >>>.el-image-viewer__wrapper {
        right: 60%!important;
    }
</style>
