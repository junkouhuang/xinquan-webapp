<template>
    <div>
        <el-card shadow="never" class="mt20">
            <el-form label-width="80px" :model="accountData" ref="accountRef">
                <el-row :gutter="20">
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="关键字">
                            <el-input placeholder="请输入对方企业名称" v-model.trim="accountData.search" @keyup.enter.native="searchAccount" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="账单类型">
                            <el-select v-model="accountData.billType" placeholder="请选择" @change="currentSel" clearable style="width: 100%">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="充值" value="0"></el-option>
                                <el-option label="转账(收)" value="1"></el-option>
                                <el-option label="转账(支)" value="2"></el-option>
                                <el-option label="提现" value="3"></el-option>
                                <el-option label="支付" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 4}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="时间类型">
                            <el-select v-model="accountData.timeType" placeholder="请选择" @change="payTime" clearable style="width: 100%">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="支付时间" value="1"></el-option>
                                <el-option label="创建时间" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="">
                            <el-date-picker
                                    v-model="effectiveDate"
                                    type="daterange"
                                    align="left"
                                    unlink-panels
                                    value-format="yyyy-MM-dd"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-button type="blue" @click="searchAccount" v-has="'res_bill_list_query'">查 询</el-button>
                        <el-button @click="handleReset">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <el-card shadow="never" class="mt20">
            <div slot="header" class="clearfix">
                <div class="header-keywords-input pull-right">
                    <el-input placeholder="输入关键词搜索" v-model.trim="searchKeyword" >
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
                        prop="billType"
                        sortable
                        label="账单类型"
                >
                    <template slot-scope="scope">
                        {{scope.row.billType == 0?'充值':scope.row.billType == 1?'转账(收)':scope.row.billType == 2?'转账(支)':scope.row.billType == 3?'提现':scope.row.billType == 4?'支付':''}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="billStatus"
                        sortable
                        label="交易状态"
                >
                    <template slot-scope="scope">
                        {{scope.row.billStatus == 0?'处理中':
                          scope.row.billStatus == 1?'交易成功':
                          scope.row.billStatus == 2?'交易失败':
                          scope.row.billStatus == 3?'等待付款':
                          scope.row.billStatus == 4?'交易关闭':
                          scope.row.billStatus == 5?'等待确认收货':
                          scope.row.billStatus == 6?'等待发货':
                          scope.row.billStatus == 7?'退款待处理':
                          scope.row.billStatus == 8?'等待买家签收':
                          scope.row.billStatus == 9?'等待系统打款给卖家':
                          scope.row.billStatus == 10?'维权':
                          scope.row.billStatus == 12?'退款成功':''}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="totalAmount"
                        sortable
                        label="收入(￥)">
                    <template slot-scope="scope">
                        {{scope.row.totalAmount >0?'+'+scope.row.totalAmount:'--'}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="totalAmount"
                        sortable
                        label="支出(￥)">
                    <template slot-scope="scope">
                        {{scope.row.totalAmount <0?scope.row.totalAmount:'--'}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="paymentTime"
                        sortable
                        label="支付时间">
                    <template slot-scope="scope">
                        {{ scope.row.paymentTime | datefmt('YYYY-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="otherVirtualAccountName"
                        sortable
                        label="对方账户名称">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        sortable
                        label="创建时间">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | datefmt('YYYY-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
            <!--            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-has="'res_drug_update'">
                            <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
                        </el-tooltip>-->
                        <el-tooltip class="item" effect="dark" content="详情" placement="top" v-has="'res_enterprise_list_detail'">
                            <el-button class="reset-icon" @click="handleDetail(scope.row)" type="text" icon="el-icon-search"></el-button>
                        </el-tooltip>
                        <!--<div  v-for="(item1,index1) in $store.state.account.resources" :key="index1">
                            <div  v-if="item1.name == '药都荟'">
                                <div  v-for="(item2,index2) in item1.children" :key="index2">
                                    <div  v-if="item2.name == $route.name">
                                        <div  v-for="(item3,index3) in item2.children" :key="index3">
                                                <el-tooltip v-for="(item4,index4) in item3.children" :key="index4" class="item" effect="dark" v-bind:content="item4.name" placement="top">
                                                    <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
                                                </el-tooltip>
                                        </div>
                                    </div>
                                   &lt;!&ndash; <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-for="(item,index) in this.$store.state.account.resources[1]" :key="index">
                                        <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="详情" placement="top">
                                        <el-button class="reset-icon" @click="handleDetail(scope.row)" type="text" icon="el-icon-view"></el-button>
                                    </el-tooltip>&ndash;&gt;
                                </div>
                            </div>
                        </div>-->
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
            <h4>订单摘要</h4>
            <table   width="100%"
                     height="100px" cellspacing="0" border="1px" align="center">
                <tr>
                    <td>分类：交易</td>
                    <td>交易状态：{{form.billStatusDesc}}</td>
                </tr>
                <tr>
                    <td>操作</td>
                    <td>订单号：{{form.billTradeNo}}</td>
                </tr>
                <tr>
                    <td>备注</td>
                    <td>{{form.remark}}</td>
                </tr>
            </table>
            <h4>付款方信息</h4>
            <table   width="100%"
                     height="100px" cellspacing="0" border="1px" align="center">
                <tr>
                    <td>账户名称</td>
                    <td>鑫泉账户</td>
                    <td>账户类型</td>
                    <td>创建时间</td>
                    <td>付款时间</td>
                    <td>付款金额</td>
                </tr>
                <tr>
                    <td>{{form.virtualAccountName}}</td>
                    <td>{{form.account}}</td>
                    <td>{{form.virtualAccountType =='00'?'中间过渡户':form.virtualAccountType =='01'?'基本户':form.virtualAccountType =='02'?'保证金户':
                        form.virtualAccountType =='03'?'结算户':form.virtualAccountType =='04'?'只收不付':form.virtualAccountType =='05'?'融资专用户':'' }}</td>
                    <td>{{form.createTime | datefmt('YYYY-MM-DD')}}</td>
                    <td>{{form.paymentTime | datefmt('YYYY-MM-DD')}}</td>
                    <td>{{form.totalAmount}}</td>
                </tr>
            </table>
            <h4>收款方信息</h4>
            <table   width="100%"
                     height="100px" cellspacing="0" border="1px" align="center">
                <tr>
                    <td>账户名称</td>
                    <td>鑫泉账户</td>
                    <td>账户类型</td>
                </tr>
                <tr>
                    <td>{{form.otherVirtualAccountName}}</td>
                    <td>{{form.otherSide}}</td>
                    <td>{{form.otherVirtualAccountType =='00'?'中间过渡户':form.otherVirtualAccountType =='01'?'基本户':form.otherVirtualAccountType =='02'?'保证金户':
                        form.otherVirtualAccountType =='03'?'结算户':form.otherVirtualAccountType =='04'?'只收不付':form.otherVirtualAccountType =='05'?'融资专用户':'' }}</td>
                </tr>
            </table>
            <!--<div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible_detail_close">取 消</el-button>
            </div>-->
        </el-dialog>
        <el-dialog :title= "state" :visible.sync="dialogFormVisible_editor" @close='closeDialog' center>
            <el-form :model="form"  ref="formRef" :rules="rules">
                <el-form-item label="药品名" :label-width="formLabelWidth">
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
                <el-button type="blue" @click="submitClick">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import utils from '@/utils'
    import { getBillList,updateDrug,getBillDetails } from '@/api/bill'
    import uploadImage from "@/components/upload/image"

    export default {
        components: {
            "upload-image": uploadImage
        },
        data() {
            return {
                searchKeyword: '',
                state: '添加',
                tableData: [],
                effectiveDate:'',
                accountData:{
                    pageNum: 1,  //当前页
                    pageSize: 10, //一页显示的条数
                    search: '', //对方企业名称
                    billType :'' , //查询类型  0.充值 1.转账(收) 2.转账(支) 3.提现 4.支付
                    timeType:'', //时间查询类型0全部 1支付时间 2创建时间
                    beginDateTime:'', //开始时间
                    endDateTime:'', //结束时间
                },
                selectedAccount: [],
                dialogFormVisible_detail: false, //查看药品弹窗
                dialogFormVisible_editor: false, //修改药品弹窗
                dialogVisible:false, //修改药品图片放大
                form: {},
                rules: {
                    price: [
                        {required: true, message: '价格不能为空', trigger: 'blur'},
                    ],
                    imgUrl: [
                        {required: true, message: '请上传图片', trigger: 'blur'}
                    ],
                },
                formLabelWidth: '120px',
            }
        },
        watch: {
            searchKeyword: function(val) {
                utils.searchKeyword(val)
            },
            effectiveDate: function(val) {
                this.accountData.beginDateTime = val ? val[0] : ''
                this.accountData.endDateTime = val ? val[1] : ''
            }
        },
        created(){
            this.searchRequest();
        },
        methods: {
            // 页面数据加载
            searchRequest(){
                this.searchKeyword = ''
                getBillList(this.accountData).then(res => {
                    if(res.returnCode == 'ERR_0000'){
                        this.tableData = res.data || [];
                    }
                })
            },
            //购买方式
            currentSel(selVal){
                this.accountData["billType"] = selVal;
            },
            //支付时间
            payTime(selVal){
                this.accountData["timeType"] = selVal;
            },
            // 点击查询
            searchAccount() {
                this.accountData.pageNum = 1
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
            changeImage(url) {
                this.form.imgUrl = url
            },
            //点击重置
            handleReset() {
                this.accountData.search = ''
                this.accountData.billType = ''
                this.accountData.timeType = ''
                this.accountData.startTime = ''
                this.accountData.endTime = ''
                this.$refs['accountRef'].resetFields()
                this.searchRequest()
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
            // 修改药品确定
            submit2(){
                this.$refs['formRef'].validate(valid => {
                    if (valid) {
                        let {drugNo,price,imgUrl} = this.form;
                        updateDrug({drugNo,price,imgUrl}).then(res =>{
                            if(res.returnCode == 'ERR_0000') {
                                this.$message({
                                    message: '药品修改成功',
                                    type: 'success'
                                })
                                this.dialogFormVisible_editor = false
                                this.searchRequest()
                            }
                        })
                    }
                })
            },
            // 点击编辑
            handleEdit(row){
                this.state = '修改药品'
                this.dialogFormVisible_editor = true
                this.form = row;
            },
            //查看详情
            handleDetail(row){
                this.state = '账单详情'
                this.dialogFormVisible_detail = true;
                getBillDetails({'billsId':row.billsId}).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        this.form = res.data
                    }
                })
            },
        },
    }
</script>
