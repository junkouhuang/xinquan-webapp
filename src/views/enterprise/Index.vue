<template>
    <div>
        <el-card shadow="never" class="mt20">
            <el-form label-width="80px" :model="accountData" ref="accountRef">
                <el-row :gutter="20">
                    <el-col :xl="{span: 5}" :lg="{span: 8}" :md="{span: 12}" :sm="{span: 12}">
                        <el-form-item label="关键字">
                            <el-input placeholder="输入企业/客户名称" v-model.trim="accountData.search" @keyup.enter.native="searchAccount" clearable></el-input>
                        </el-form-item>
                    </el-col>
                   <!--<el-col :xl="{span: 5}" :lg="{span: 8}" :md="{span: 12}" :sm="{span: 12}">
                        <el-form-item label="状态">
                            <el-select v-model="accountData.realStatus" placeholder="请选择" @change="currentSel" clearable>
                                <el-option label="全部" value="null"></el-option>
                                <el-option label="企业待审核" value="0"></el-option>
                                <el-option label="企业审核不通过" value="2"></el-option>
                                <el-option label="法人/负责人待审核" value="3"></el-option>
                                <el-option label="企业审核通过" value="4"></el-option>
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
                        <el-button type="blue" @click="searchAccount" v-has="'res_enterprise_query'">查 询</el-button>
                        <el-button @click="handleReset">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <el-card shadow="never" class="mt20">
            <div slot="header" class="clearfix" style="padding: 10px 0;margin-bottom: -25px ;">
              <el-tabs v-model="activeName" @tab-click="statusHandleClick">
                <el-tab-pane :label="`全部(${statusQuantity.allCount?statusQuantity.allCount:0})`" name="first" style="font-size: 60px">
                </el-tab-pane>
                <el-tab-pane :label="`企业待审核(${statusQuantity.companyToAuditCount?statusQuantity.companyToAuditCount:0})`" name="secode" >
              <span slot="label" v-if="unreadNum>0">待审核({{statusQuantity.companyToAuditCount?statusQuantity.companyToAuditCount:0}})<el-badge
                  :value="unreadNum"></el-badge></span>
                </el-tab-pane>
                <el-tab-pane :label="`企业审核不通过(${statusQuantity.auditNoPass?statusQuantity.auditNoPass:0})`" name="third" ></el-tab-pane>
                <el-tab-pane :label="`法人/负责人待审核(${statusQuantity.principalToAuditCount?statusQuantity.principalToAuditCount:0})`" name="four"></el-tab-pane>
                <el-tab-pane :label="`企业审核通过(${statusQuantity.auditPass?statusQuantity.auditPass:0})`" name="adopt"></el-tab-pane>
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
                        sortable
                        label="企业类型">
                </el-table-column>
                <el-table-column
                        prop="location"
                        sortable
                        label="地区">
                  <template slot-scope="scope">
                    {{ scope.row.province}}{{ scope.row.city}}{{ scope.row.region}}{{ scope.row.location}}
                  </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        sortable
                        label="申请时间">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="realStatus"
                        sortable
                        label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.realStatus == 0" class="label label-info">企业待审核</span>
                        <span v-if="scope.row.realStatus == 2" class="label label-danger">企业审核不通过</span>
                        <span v-if="scope.row.realStatus == 3" class="label label-info">法人/负责人待审核</span>
                        <span v-if="scope.row.realStatus == 4" class="label label-success">企业审核通过</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                       <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
                        </el-tooltip>-->
                        <el-tooltip class="item" effect="dark" content="查看" placement="top" v-has="'res_enterprise_detail'" >
                            <el-button class="reset-icon" @click="$router.push({ path: `/enterprise/detail/${scope.row.enterpriseId}` })" type="text" >
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
    import { getAuditList,credentialsInfo,auditEnterprise,getEnterpriseBindRecordUnAudited,auditBindEnterprise,updateEnterpriseInfo,getEunreadCount,updateEunread,getEnterpriseCount } from '@/api/enterprise'


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
                    search: '', //根据企业名查找
                    realStatus : '' , //审核状态 0 待审核  3 已审核  不传为全部列表
                    startTime : '' , //开始时间
                    endTime:'', //结束时间
                    provinceId:'', //省id
                    cityId:'',//市Id
                    enterpriseId:'',//根据企业id查询企业地址信息(共用接口参数,和列表查询无关)
                },
                modeList: ['', '生产企业', '经营企业', '连锁总部', '连锁门店', '零售企业', '医疗机构（盈利）', '医疗机构(非盈利)', '', '数据服务公司', '经营企业(医疗器械)'],
                selectedAccount: [],
                dialogFormVisible_detail: false, //查看药品弹窗
                dialogFormVisible_editor: false, //修改药品弹窗
                dialogVisible:false, //修改药品图片放大
                form: {},
                form2: {
                    contacts:'',
                    mobileNumber:'',
                    idCode:'',
                    createTime:'',
                    status:'',
                    auditContent:'',
                    remark:'',
                    auditTime:''
                },
                form3:{
                    valueId:'',
                    qualificationsNumber:'',
                    expiryDate:''
                },
                qualificationsNumber:'',
                oldForm:{},
                rules1: {
                    auditContent: [
                        {required: true, message: '拒绝原因不能为空', trigger: 'blur'},
                    ],
                },
                rules2: {
                    auditContent: [
                        {required: true, message: '拒绝原因不能为空', trigger: 'blur'},
                    ],
                },
                rules3: {
                    qualificationsNumber: [
                        {required: true, message: '证件编号不能为空', trigger: 'blur'},
                    ],
                    expiryDate: [
                        {required: true, message: '有效期不能为空', trigger: 'blur'},
                    ],
                },
                formLabelWidth: '120px',
                currentIndex:-1,
                statusQuantity:{},
                isFirstEnter:false // 定义变量来判断是否第一次进入，默认false
            }
        },
        watch: {
            searchKeyword: function(val) {
                utils.searchKeyword(val)
            },
        },
        created(){
          this.searchRequest(); // 重新加载
          this.queryAunreadCount();//查询未读数量
          this.statusRequest();
        },
        activated() {
          this.searchRequest(); // 重新加载
          this.statusRequest();
        },
        methods: {
          queryAunreadCount(){
            getEunreadCount().then(res=>{
              if (res.returnCode == 'ERR_0000') {
                this.unreadNum=res.data;
              }
            })
          },
          isRead(){
            updateEunread().then(res=>{
              console.log(res);
              if (res.returnCode == 'ERR_0000') {
                this.queryAunreadCount();//清空完之后重新查信息是否有未读完消息
              }
            })
          },
            // 页面数据加载
            searchRequest(){
                this.searchKeyword = ''
                //this.accountData.pageNum = this.pageNum;
                getAuditList(this.accountData).then(res => {
                    if(res.returnCode == 'ERR_0000'){
                        this.tableData = res.data || [];
                    }
                })
            },
            seenImgs(index){
                this.form3 = this.form['qualificationsDTOList'][index];
                this.currentIndex = index;
                this.qualificationsNumber = this.form['qualificationsDTOList'][index]['qualificationsName'];
            },
            //企业审核-绑定审核切换
            handleClick(tab){
               if(tab.index == 0){
                   this.form = this.oldForm;
               }
                if(tab.index == 1){
                    this.BindRecord();
                }
            },
            //绑定审核
            BindRecord(){
                this.oldForm = this.form;
                getEnterpriseBindRecordUnAudited({'enterpriseId': this.form.enterpriseId,status:this.form.status}).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        this.form2 = res.data[0] || {};
                    }
                })
            },
            //状态
            currentSel(selVal){
                this.accountData["realStatus"] = selVal;
                this.searchRequest();
            },
            //企业编号有效期更改
            updateEnterpriseInfo(){
                this.$refs['formRef3'].validate(valid => {
                    if (valid) {
                        updateEnterpriseInfo({
                            valueId: this.form3.valueId,
                            qualificationsNumber: this.form3.qualificationsNumber,
                            expiryDate: this.form3.expiryDate
                        }).then(res => {
                            if (res.returnCode == 'ERR_0000') {
                                this.currentIndex = -1
                            }
                        })
                    }
                })
            },
            cancleHandle(){
                this.currentIndex = -1;
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
            //认证详情-审核通过
            pass(val){
                this.currentIndex = -1;
                if(val == "enterprise"){
                    auditEnterprise({enterpriseId:this.form.enterpriseId,auditStatus:1,auditContent: this.form.auditContent,}).then(res =>{
                        if(res.returnCode == 'ERR_0000'){
                            this.activeName = 'second';
                            this.BindRecord();
                        }
                    })
                }
                if(val == "band"){
                    auditBindEnterprise({bindApplyId:this.form2.bindApplyId,auditStatus:1,auditContent: this.form2.auditContent,}).then(res =>{
                        if(res.returnCode == 'ERR_0000'){
                            this.dialogFormVisible_detail = false;
                            this.form = {};
                            this.searchRequest();
                        }
                    })
                }
            },
            //认证详情-拒绝审核
            reject(val){
               this.currentIndex = -1;
               if(val == "enterprise") {
                   this.$refs['formRef1'].validate(valid => {
                       if (valid) {
                         auditEnterprise({
                               enterpriseId: this.form.enterpriseId,
                               auditStatus: 2,
                               auditContent: this.form.auditContent,
                           }).then(res => {
                               if (res.returnCode == 'ERR_0000') {
                                   this.dialogFormVisible_detail = false;
                                   this.form = {};
                                   this.searchRequest();
                               }
                           })
                       }
                   })
               }
               if(val == "band") {
                    this.$refs['formRef2'].validate(valid => {
                        if (valid) {
                            auditBindEnterprise({
                                bindApplyId: this.form2.bindApplyId,
                                auditStatus: 2,
                                auditContent: this.form2.auditContent,
                            }).then(res => {
                                if (res.returnCode == 'ERR_0000') {
                                    this.dialogFormVisible_detail = false;
                                    this.form = {};
                                    this.searchRequest();
                                }
                            })
                        }
                    })
                }
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
            this.accountData.realStatus = tab.name == "first"?null:tab.name == "secode"?0:tab.name == "third"?2:tab.name=="four"?3:tab.name=="adopt"?4:'';
            if (tab.name=='secode'){
              this.isRead();//当选中待审核时标注已读
            }
            this.searchRequest();
          },
          statusRequest(){
            getEnterpriseCount(this.accountData).then(res =>{
              if(res.returnCode == 'ERR_0000'){
                this.statusQuantity=res.data;
              }
            })
          },
            //点击重置
            handleReset() {
                this.accountData.search = ''
                this.accountData.auditStatus = ''
                this.accountData.startTime = ''
                this.accountData.endTime = ''
                this.$refs['accountRef'].resetFields()
                this.searchRequest();
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
            //查看详情
            handleDetail(row){
                this.state = '企业详情'
                this.dialogFormVisible_detail = true;
                    credentialsInfo({'enterpriseId':row.enterpriseId}).then(res =>{
                        if(res.returnCode == 'ERR_0000') {
                            this.form = res.data;
                        }
                    })
            },
        },
    }
</script>
<style scoped>
    .el-image-viewer__wrapper {
        right: 60%!important;
    }
    .el-tabs__item{
      font-size: 17px !important;
    }
    .el-tabs__active-bar{
      height: 5px !important;
    }
</style>
