<template>
    <div>
        <el-card shadow="never" class="mt20">
            <el-form label-width="80px" :model="accountData" ref="accountRef">
                <el-row :gutter="20">
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="关键字">
                            <el-input placeholder="企业名称搜索" v-model.trim="accountData.enterpriseName" @keyup.enter.native="searchAccount" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-button type="blue" @click="searchAccount" v-has="'res_build_query'">查 询</el-button>
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
                        prop="enterpriseName"
                        sortable
                        label="企业名称"
                >
                </el-table-column>
              <el-table-column
                  prop="supplierName"
                  sortable
                  label="配送企业"
              >
              </el-table-column>
              <el-table-column
                  sortable
                  label="地址">
                <template slot-scope="scope">
                  {{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.district}}{{scope.row.location}}
                </template>
              </el-table-column>
                <el-table-column
                        prop="modeName"
                        sortable
                        label="经营方式">
                </el-table-column>
                <el-table-column
                        prop="contacts"
                        sortable
                        label="申请人姓名">
                </el-table-column>
                <el-table-column
                        prop="subMobileNumber"
                        sortable
                        label="申请人电话">
                </el-table-column>
                <el-table-column
                        prop="erpId"
                        sortable
                        label="企业备案号">
                    <template slot-scope="scope">
                        {{scope.row.erpId == 'null'?'':scope.row.erpId}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="location"
                        sortable
                        label="申请时间">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="status"
                        sortable
                        label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0" class="label label-warning">待审核</span>
                        <span v-if="scope.row.status == 1" class="label label-danger">审核不通过</span>
                        <span v-if="scope.row.status == 2" class="label label-success">审核通过</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="查看" placement="top" v-has="'res_build_detail'" >
                      <el-button class="reset-icon" @click="$router.push({ path: `/build/detail/${scope.row.enterpriseId}/${scope.row.id}` })" type="text" >
                        <i class="iconfont">&#xe605;</i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="修改备案号" placement="top" v-has="'res_erpid_update'" v-if="scope.row.status == 2">
                      <el-button class="reset-icon" @click="updErpId(scope.row.enterpriseId,scope.row.supplierId,scope.row.erpId)" type="text" >
                        <i class="iconfont">&#xe71c;</i>
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
    import { getByconditionFindList,credentialInfo,audit,getExamineCount ,updateErpId,updateAunread,getAunreadCount } from '@/api/build'


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
                    enterpriseName: '', //企业名称/搜索
                    status:''//查询状态 0-待审核 1-审核不通过 2-审核通过
                },
                selectedAccount: [],
                dialogFormVisible_detail: false, //查看药品弹窗
                dialogFormVisible_editor: false, //修改药品弹窗
                dialogVisible:false, //修改药品图片放大
                form: {},
                form3:{},
                statusQuantity:{},
                rules: {
                    auditOpinion: [
                        {required: true, message: '拒绝原因不能为空', trigger: 'blur'},
                    ],
                },
                formLabelWidth: '120px',
                currentIndex:-1
            }
        },
        watch: {
            searchKeyword: function(val) {
                utils.searchKeyword(val)
            }
        },

      created(){
           this.statusRequest();
           this.searchRequest();
           this.queryAunreadCount();
        },
        activated(){
            this.searchRequest();
        },
        methods: {
          queryAunreadCount(){
            getAunreadCount().then(res=>{
              if (res.returnCode == 'ERR_0000') {
                this.unreadNum=res.data;
              }
            })
          },
          isRead(){
            updateAunread().then(res=>{
              console.log(res);
              if (res.returnCode == 'ERR_0000') {
                this.queryAunreadCount();//清空完之后重新查信息是否有未读完消息
              }
            })
          },
            // 页面数据加载
            searchRequest(){
                this.searchKeyword = ''
                getByconditionFindList(this.accountData).then(res => {
                    if(res.returnCode == 'ERR_0000'){
                        this.tableData = res.data;
                    }
                })
            },
            //详情弹窗关闭
            dialogFormVisible_detail_close(){
                this.dialogFormVisible_detail = false;
                this.form = {}
            },
          //修改备案号
          updErpId(enterpriseId,supplierId,erpId){
            this.$prompt('请输入企业备案号', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputValue:erpId,
              inputPattern: /\S+/,
              inputErrorMessage: '企业备案号不能为空'
            }).then(({ value }) => {
              updateErpId({enterpriseId,supplierId,erpId:value}).then(res => {
                if(res.returnCode == 'ERR_0000'){
                  this.$message.success('修改成功');
                  this.searchRequest();

                }
              })
            }).catch(() => {

            });
          },
            //购买方式
            currentSel(selVal){
               this.accountData["status"] = selVal;
               this.searchRequest();
               this.statusRequest();
                },
            // 点击查询
            searchAccount() {
                this.accountData.pageNum = 1;
                this.searchRequest();
                this.statusRequest();
            },
            closeDialogFormVisible_detail(){
                this.currentIndex = -1;
                this.searchRequest();
            },
            seenImgs(index){
                this.currentIndex = index;
                this.form3 = this.form['qualificationsDTOList'][index];
            },
            //认证详情-审核通过
            pass(){
                this.currentIndex = -1;
                audit({id: this.form.id, enterpriseId:this.form.enterpriseId,hyErpId:this.form.hyErpId, status: 2,auditDesc:''}).then(res =>{
                    if(res.returnCode == 'ERR_0000'){
                        this.dialogFormVisible_detail = false;
                        this.form = {};
                        this.searchRequest();
                        this.statusRequest();
                    }
                })
            },
          //认证详情-拒绝审核
          reject(){
            this.currentIndex = -1;
            console.log(this.form)
            this.$refs['formRef'].validate(valid => {
              if(valid){
                audit({id: this.form.id, enterpriseId:this.form.enterpriseId,erpId:this.form.erpId,status: 1, auditOpinion: this.form.auditOpinion,}).then(res => {
                  if (res.returnCode == 'ERR_0000') {
                    this.dialogFormVisible_detail = false;
                    this.form = {};
                    this.searchRequest();
                    this.statusRequest();
                  }
                })
              }
            })
          },
             statusRequest(){
                 getExamineCount(this.accountData).then(res =>{
                     if(res.returnCode == 'ERR_0000'){
                         this.statusQuantity=res.data;
                     }
                 })
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
            changeImage(url) {
                this.form.imgUrl = url
            },
            //表格状态栏切换
            statusHandleClick(tab){
                this.accountData.status = tab.name == "first"?null:tab.name == "secode"?0:tab.name == "third"?1:tab.name=="four"?2:'';
              if (tab.name=='secode'){
                this.isRead();//当选中待审核时标注已读
              }
                this.searchRequest();
            },
            //点击重置
            handleReset() {
                this.accountData.enterpriseName = ''
                this.accountData.status = ''
                this.$refs['accountRef'].resetFields()
                this.searchRequest();
                this.statusRequest();
            },
            closeDialog(){
                this.$refs['formRef'].resetFields()
            },
            submitClick(){
                this.submit2()
            },
            // 点击编辑
            handleEdit(row){
                this.state = '修改药品'
                this.dialogFormVisible_editor = true
                this.form = row;
            },
        },
    }
</script>
<style>
.el-tabs__item{
  font-size: 17px !important;
}
.el-tabs__active-bar{
  height: 5px !important;
}
</style>