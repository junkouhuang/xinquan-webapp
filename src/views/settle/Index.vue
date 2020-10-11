<template>
    <div>
        <el-card shadow="never" class="mt20">
            <el-form label-width="80px" :model="accountData" ref="accountRef">
                <el-row :gutter="20">
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="关键字">
                            <el-input placeholder="输入会员名称/结算单号" v-model.trim="accountData.keyword" @keyup.enter.native="searchAccount" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="状态">
                            <el-select v-model="accountData.status" placeholder="请选择" @change="currentSel" clearable style="width: 100%">
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
                        <el-form-item label="付款状态">
                            <el-select v-model="accountData.payStatus" placeholder="请选择" @change="currentSel1" clearable style="width: 100%">
                                <el-option
                                        v-for="(item,index) in payStatusData"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-button type="blue" @click="searchAccount"  v-has="'res_settle_query'">查 询</el-button>
                        <el-button @click="handleReset">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

      <el-card shadow="never" class="mt20">
        <div slot="header" class="clearfix" style="padding: 10px 0;margin-bottom: -25px ;">
          <el-tabs v-model="activeName" @tab-click="statusHandleClick">
            <el-tab-pane :label="`全部(${statusQuantity.auditSettleCount})`" name="first" style="font-size: 60px">
            </el-tab-pane>
            <el-tab-pane :label="`待审核(${statusQuantity.waitAuditSettleCount})`" name="secode" >
              <span slot="label" v-if="unreadNum>0">待审核({{statusQuantity.waitAuditSettleCount}})<el-badge
                  :value="unreadNum"></el-badge></span>
            </el-tab-pane>
            <el-tab-pane :label="`审核不通过(${statusQuantity.alreadyRefuseSettleCount})`" name="four" ></el-tab-pane>
            <el-tab-pane :label="`审核通过(${statusQuantity.alreadyAgreeSettleCount})`" name="third"></el-tab-pane>
            <el-tab-pane :label="`已付款(${statusQuantity.alreadyPaySettleCount==null?0:statusQuantity.alreadyPaySettleCount})`" name="five"></el-tab-pane>
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
                        prop="contact"
                        sortable
                        label="会员名"
                >
                </el-table-column>
                <el-table-column
                        prop="settlementPrice"
                        sortable
                        label="结算金额">
                    <template slot-scope="scope">
                        ￥{{ scope.row.settlementPrice}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="settlementNo"
                        sortable
                        label="结算单号">
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
                        prop="status"
                        sortable
                        label="审核状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0" class="label label-warning">待审核</span>
                        <span v-if="scope.row.status == 1" class="label label-success">审核通过</span>
                        <span v-if="scope.row.status == 2" class="label label-danger">审核不通过</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="payStatus"
                        sortable
                        label="付款状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.payStatus == 0" class="label label-warning">未付款</span>
                        <span v-if="scope.row.payStatus == 1" class="label label-success">已付款</span>
                        <span v-if="scope.row.payStatus == 2" class="label label-danger">已完成</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                       <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
                        </el-tooltip>-->
                        <el-tooltip class="item" effect="dark" content="详情" placement="top" v-has="'res_drug_list_detail'">
                            <el-button class="reset-icon" @click="$router.push({ path: `/settle/detail/${scope.row.settlementId}` })" type="text" >
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
        <el-dialog :title= "state" :visible.sync="dialogFormVisible_detail"  center>
            <el-form :model="form" ref="formRef" :rules="rules">
                <h4>结算详情</h4>
                <!--<el-form-item>
                    <el-row :gutter="10">
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            ID:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.settlementId}}
                        </el-col>
                    </el-row>
                </el-form-item>-->
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            名称:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.contact}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            类型:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.type == 0?'结算':''}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            金额:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.settlementPrice}}元
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            结算时间:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            结算单号:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.settlementNo}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <!-- <el-form-item  v-if="form.status == 0">
                    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" style="margin-top: 10px"  >
                        <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请填写备注"
                                maxlength="50"
                                show-word-limit
                                v-model="form.remark">
                        </el-input>
                    </el-col>
                </el-form-item>-->
                <el-form-item v-if="form.status == 0">
                    <el-row>
                        <el-col>
                            <el-button type="primary" @click="pass">通过</el-button>
                            <el-button @click="reject">拒绝</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item prop="remark" v-if="form.status == 0">
                    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" style="margin-top: 10px"  >
                        <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入拒绝原因"
                                maxlength="50"
                                show-word-limit
                                v-model="form.remark">
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-row v-if="form.status == 2">
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            拒绝原因：
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            <span style="color: red">{{form.remark}}</span>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.status == 1 || form.status == 2">
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            审核时间：
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.updateTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
                        </el-col>
                    </el-row>
                   <!-- <el-row v-else>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            审核时间：
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            <span>{{form.updateTime | datefmt('YYYY-MM-DD HH:mm:ss') }}</span>
                        </el-col>
                    </el-row>-->
                    <el-row v-if="form.status == 3">
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            付款时间：
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.paymentTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item v-if="form.status == 1 && form.payStatus == 1" >
                    <el-row >
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            上传支付凭证：
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            <upload-image :imageUrl="form.imageUrl" @changeImage="changeImage"/>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item v-if="form.status == 1 && form.payStatus == 2" >
                    <el-row >
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            支付凭证：
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            <el-image
                                    v-if="form.confirmReceipt"
                                    style="width: 80px; height: 80px"
                                    :src="form.confirmReceipt"
                                    :preview-src-list="[`${form.confirmReceipt}`]">
                            </el-image>
                            <el-image
                                    v-else
                                    style="width: 80px; text-align:center;height: 80px;line-height: 80px;font-size: 14px;background: #F5F7FA;color: #C0C4CC;">
                                <div slot="error" class="image-slot">
                                    <!--<i class="el-icon-picture-outline"></i>-->
                                    <span>暂无图片</span>
                                </div>
                            </el-image>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogFormVisible_detail_close">取 消</el-button>-->
                <el-button  type="primary" v-if="form.status == 1 && form.payStatus == 0" @click="settlement">支 付</el-button>
                <el-button  type="primary" v-if="form.status == 1 && form.payStatus == 1" @click="confirmReceiptHandle">确认提交</el-button>
            </div>
        </el-dialog>
        <el-dialog :title= "state" :visible.sync="dialogFormVisible_editor" @close='closeDialog' center>
            <el-form :model="form"  ref="formRef" :rules="rules">
                <h4>结算详情</h4>
                <el-form-item label="ID" :label-width="formLabelWidth">
                    <el-input v-model="form.name" maxlength="30" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
                    <el-input v-model="form.price" maxlength="30" ></el-input>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth" prop="imgUrl" style="max-width: 600px">
                    <upload-image :imageUrl="form.imgUrl" @changeImage="changeImage"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible_editor = false">取 消</el-button>
                <el-button type="green" @click="submitClick">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import utils from '@/utils'
    import { settleList,settleDetail,audit,settlePayUrl,adminCountSettle,confirmReceipt,updateRunread,getRunreadCount } from '@/api/settle'
    import uploadImage from "@/components/upload/image"
    import {getAunreadCount, updateAunread} from "@/api/build";

    export default {
        components: {
            "upload-image": uploadImage
        },
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
                    keyword: '', //搜索关键字，查询生厂产家
                    startTime : '' , //开始时间
                    endTime:'', //结束时间
                    contact:'', //会员名
                    status:'',//状态0：待审核1：同意2：拒绝 3:已付款
                    payStatus:''//状态0：未付款 1：已付款 2：已完成
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
                    },
                    {
                        name:'已付款',
                        value: '3'
                    }
                ],
                payStatusData:[
                    {
                        name:'全部',
                        value: ''
                    },
                    {
                        name:'未付款',
                        value: '0'
                    },
                    {
                        name:'已付款',
                        value: '1'
                    },
                    {
                        name:'已完成',
                        value: '2'
                    },
                ],
                statusQuantity:{},
                selectedAccount: [],
                dialogFormVisible_detail: false, //查看药品弹窗
                dialogFormVisible_editor: false, //修改药品弹窗
                dialogVisible:false, //修改药品图片放大
                form: {},
                rules: {
                    remark: [
                        {required: true, message: '拒绝原因不能为空', trigger: 'blur'},
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
            this.searchRequest();
            this.statusRequest();
            this.queryRunreadCount();

        },
        methods: {
          queryRunreadCount(){
            getRunreadCount().then(res=>{
              if (res.returnCode == 'ERR_0000') {
                this.unreadNum=res.data;
              }
            })
          },
          isRead(){
            updateRunread().then(res=>{
              if (res.returnCode == 'ERR_0000') {
                this.queryRunreadCount();//清空完之后重新查信息是否有未读完消息
              }
            })
          },
            // 页面数据加载
            searchRequest(){
                this.searchKeyword = ''
                settleList(this.accountData).then(res => {
                    console.log(res.data || [])
                    if(res.returnCode == 'ERR_0000'){
                        this.tableData = res.data || [];
                    }
                })
            },
            //settlement
            settlement(){
                settlePayUrl({settlementId:this.form.settlementId,deviceType: this.deviceType,}).then(res =>{
                    if(res.returnCode == 'ERR_0000'){
                        this.dialogFormVisible_detail = false;
                        this.form = {};
                        this.searchRequest()
                    }
                })
            },
            //结算-确认提交
            confirmReceiptHandle(){
                confirmReceipt({settlementId:this.form.settlementId,confirmReceipt: this.form.imageUrl,}).then(res =>{
                    if(res.returnCode == 'ERR_0000'){
                        this.dialogFormVisible_detail = false;
                        this.form = {};
                        this.searchRequest()
                    }
                })
            },
            //表格状态栏切换
            statusHandleClick(tab){
                this.accountData.status = tab.name == "first"?null:tab.name == "secode"?0:tab.name == "third"?1:tab.name=="four"?2:tab.name=="five"?3:'';
              if (tab.name=='secode'){
                this.isRead();//当选中待审核时标注已读
              }
                this.searchRequest();
            },
            //详情弹窗关闭
            dialogFormVisible_detail_close(){
                this.dialogFormVisible_detail = false;
                this.form = {}
            },
            //购买方式
            currentSel(selVal){
                this.accountData["status"] = selVal;
            },
            currentSel1(selVal){
                this.accountData["payStatus"] = selVal;
            },
            // 点击查询
            searchAccount() {
                this.accountData.pageNum = 1;
                this.searchRequest();
                //this.statusRequest();
            },
            //认证详情-审核通过
            pass(){
                audit({settlementId:this.form.settlementId,status:1,remark:''}).then(res =>{
                    if(res.returnCode == 'ERR_0000'){
                        this.dialogFormVisible_detail = false;
                        this.form = {};
                        this.searchRequest();
                        //this.statusRequest();
                    }
                })
            },
            //认证详情-拒绝审核
            reject(){
                this.$refs['formRef'].validate(valid => {
                    if(valid){
                        audit({settlementId: this.form.settlementId, status: 2, remark:this.form.remark}).then(res => {
                            if (res.returnCode == 'ERR_0000') {
                                this.dialogFormVisible_detail = false;
                                this.form = {};
                                this.searchRequest();
                               // this.statusRequest();
                            }
                        })
                    }
                })
            },
            //adminCountSettle
            statusRequest(){
                adminCountSettle(this.accountData).then(res =>{
                    if(res.returnCode == 'ERR_0000'){
                        this.statusQuantity=res.data;
                        console.log(res.data)
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
                console.log(url)
                this.form.imageUrl = url
            },
            //点击重置
            handleReset() {
                this.accountData.keyword = ''
                this.accountData.status = ''
                this.accountData.payStatus = ''
                this.$refs['accountRef'].resetFields()
                this.searchRequest();
                //this.statusRequest();
            },
            closeDialog(){
                this.$refs['formRef'].resetFields()
            },
            submitClick(){
                this.submit2()
            },
            //详情弹窗关闭
            dialogFormVisible_detail_close(){
                this.dialogFormVisible_detail = false;
                this.form = {}
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
