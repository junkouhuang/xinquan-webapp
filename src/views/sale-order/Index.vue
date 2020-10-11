<template>
    <div>
        <el-card shadow="never" class="mt20">
            <el-form label-width="80px" :model="accountData" ref="accountRef">
                <el-row :gutter="20">
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="关键字">
                            <el-input placeholder="订单号/客户名称" v-model.trim="accountData.search" @keyup.enter.native="searchAccount" clearable></el-input>
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
                        <el-button type="blue" @click="searchAccount" v-has="'res_sale_list_query'">查 询</el-button>
                        <el-button @click="handleReset">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
     <!-- 0-待付款 1-待确认付款 2-已付款 3-待退款 4-已完成 5-已取消，6-待审核 ,不传为全部数据-->
      <el-card shadow="never" class="mt20">
        <div slot="header" class="clearfix" style="padding: 10px 0;margin-bottom: -25px ;">
          <el-tabs v-model="activeName" @tab-click="statusHandleClick">
            <el-tab-pane :label="`全部(${statusQuantity.allCount})`" name="first" style="font-size: 60px">
            </el-tab-pane>
            <el-tab-pane :label="`待审核(${statusQuantity.secodeCount})`" name="secode" >
              <span slot="label" v-if="unreadNum>0">待审核({{statusQuantity.secodeCount}})<el-badge
                  :value="unreadNum"></el-badge></span>
            </el-tab-pane>
            <el-tab-pane :label="`待付款(${statusQuantity.tobepaidCount})`" name="tobepaid" ></el-tab-pane>
            <el-tab-pane :label="`待确认付款(${statusQuantity.paymentCount})`" name="payment"></el-tab-pane>
            <el-tab-pane :label="`已付款(${statusQuantity.paidCount})`" name="paid"></el-tab-pane>
            <el-tab-pane :label="`待退款(${statusQuantity.refundedCount})`" name="refunded"></el-tab-pane>
            <el-tab-pane :label="`已完成(${statusQuantity.completedCount})`" name="completed"></el-tab-pane>
            <el-tab-pane :label="`已取消(${statusQuantity.cancelledCount})`" name="cancelled"></el-tab-pane>
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
											 style="width: 100%"
                      >
                <el-table-column
                        type="selection"
                        >
                </el-table-column>
                <el-table-column
                        type="index"
                        label="序号">
                    <template slot-scope="scope">
                        {{((accountData.pageNum-1)  * accountData.pageSize) +scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="customerName"
                        sortable
                        label="客户"
                >
                </el-table-column>
                <el-table-column
                        prop="salesOrderNo"
                        sortable
                        label="订单号">
                </el-table-column>
                <el-table-column
                        prop="creator"
                        sortable
                        label="开单人">
                </el-table-column>
              <el-table-column
									v-if="$store.state.account.type == 0"
                  prop="enterpriseName"
                  sortable
                  label="供应商">
              </el-table-column>
                <el-table-column
                        prop="consignee"
                        sortable
                        label="收货人">
                </el-table-column>
                <el-table-column
                        prop="consigneePhone"
                        sortable
                        label="手机号">
                </el-table-column>
                <el-table-column
                        prop="shippingAddress"
                        sortable
                        label="收货地址">
                </el-table-column>
                <el-table-column
                        prop="amountWithTax"
                        sortable
                        label="订单金额">
                    <template slot-scope="scope">
                        ￥{{ scope.row.amountWithTax}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="thirdOrderId"
                        sortable
                        v-if="$store.state.account.organizationId==1 && $store.state.account.type == 1 "
                        label="记账序列号">
                    <template slot-scope="scope">
                        {{ scope.row.thirdOrderId == 'null' || scope.row.thirdOrderId == null?'':scope.row.thirdOrderId}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        sortable
                        label="自动取消订单时间">
                        <template slot-scope="scope">
                            {{ scope.row.cancelTime }}
                        </template>
                </el-table-column>
								<el-table-column
								        prop="createTime"
								        sortable
								        label="自动支付订单时间">
								        <template slot-scope="scope">
								            {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
								        </template>
								</el-table-column>
                <el-table-column
                    prop="createTime"
                    sortable
                    label="开单时间">
                  <template slot-scope="scope">
                    {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
                  </template>
                </el-table-column>
                <el-table-column
                        prop="status"
                        sortable
                        label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0" class="label label-warning">待付款</span>
                        <span v-if="scope.row.status == 1" class="label label-danger">待确认付款</span>
                        <span v-if="scope.row.status == 2" class="label label-success">已付款</span>
                        <span v-if="scope.row.status == 3" class="label label-success">待退款</span>
                        <span v-if="scope.row.status == 4" class="label label-success">已完成</span>
                        <span v-if="scope.row.status == 5" class="label label-success">已取消</span>
                        <span v-if="scope.row.status == 6" class="label label-success">待审核</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  >
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="取消订单" placement="top" v-has="'res_sale_list_cancel'" v-if="scope.row.status == 0">
                            <el-button class="reset-icon" @click="cancelOrder(scope.row)" type="text"><i class="iconfont">&#xe6a6;</i></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="取消订单并退款" placement="top" v-has="'res_sale_list_cancelorderrefund'" v-if="scope.row.status == 1">
                            <el-button class="reset-icon" @click="cancelOrderRefund(scope.row)" type="text"><i class="iconfont">&#xe712;</i></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="确认退款" placement="top" v-has="'res_sale_list_auditrefundapply'" v-if="scope.row.status == 3">
                            <el-button class="reset-icon" @click="auditRefundApply(scope.row,true)" type="text"><i class="iconfont">&#xe608;</i></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="拒绝退款" placement="top" v-has="'res_sale_list_auditrefundapplys'" v-if="scope.row.status == 3">
                            <el-button class="reset-icon" @click="auditRefundApply(scope.row,false)" type="text"><i class="iconfont">&#xe7c2;</i></el-button>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" content="详情" placement="top" v-has="'res_sale_list_detail'">
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
            <el-form>
                <h4>订单基本信息</h4>
                <el-form-item>
                    <el-row :gutter="10">
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            销售订单号:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.salesOrderNo}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row :gutter="10">
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            订单金额:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            ￥{{form.amountWithTax}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row :gutter="10">
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            开单人:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.creator}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            开单时间:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.createTime | datefmt('YYYY-MM-DD ') }}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            订单状态:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.status == 0?'待付款':
                              form.status == 1?'待确认付款':
                              form.status == 2?'已付款':
                              form.status == 3?'待退款':
                              form.status == 4?'已完成':
                              form.status == 5?'已取消':''}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            收货人:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.consignee}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            手机号:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.consigneePhone}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            地址:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.shippingAddress}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <h4>订单商品</h4>
                <el-form-item>
                    <el-row  v-for="(item,index) in form.details" :key="index"
                             style="background: #F5F7FA;margin-bottom: 10px;padding: 10px;width: 50%;">
                        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                            <el-image
                                    v-if="item.imgUrl"
                                    style="width: 100px; height: 100px"
                                    :src="item.imgUrl"
                                    :preview-src-list="[`${item.imgUrl}`]">
                            </el-image>
                            <el-image
                                    v-else
                                    style="width:100px; text-align:center;height: 100px;line-height: 100px;font-size: 14px;background: #F5F7FA;color: #C0C4CC;">
                                <div slot="error" class="image-slot">
                                    <!--<i class="el-icon-picture-outline"></i>-->
                                    <span>暂无图片</span>
                                </div>
                            </el-image>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <div>{{item.productName}}</div>
                            <div>{{item.manufacturer}}</div>
                            <div>{{item.spec}}</div>
                            <el-row>
                                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">采购数量{{item.quantity}}{{item.salesUnit}}</el-col>
                            </el-row>
                            <el-row>
                                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">小计{{item.amountWithTax}}</el-col>
                            </el-row>
                        </el-col>
                        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                            <el-button @click="auditDrug(item.salesOrderDetailId)">审核</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
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
    import filter from '@/utils/filter'
    import { findSalesOrderList,findSalesOrderDetail,cancelOrder,cancelOrderRefund,auditRefundApply,checkOrder,getExamineCount,updateSunread,getSunreadCount } from '@/api/saleOrder'
    import {getAunreadCount, updateAunread} from "@/api/build";
    export default {
        data() {
            return {
              unreadNum:0,
              activeName:'first',
							timer:0,
							searchKeyword: '',
							state: '添加',
							tableData: [],
							accountData:{
									pageNum: 1,  //当前页
									pageSize: 10, //一页显示的条数
									search: '', //查询条件
									status : '' , //0-待付款 1-待确认付款 2-已付款 3-待退款 4-已完成 5-已取消 ,不传为全部数据

							},
							statusData:[
                    {
                        name:'全部',
                        value: ''
                    },
                    {
                        name:'待审核',
                        value: '6'
                    },
                    {
                        name:'待付款',
                        value: '0'
                    },
                    {
                        name:'待确认付款',
                        value: '1'
                    },
                    {
                        name:'已付款',
                        value: '2'
                    },
                    {
                        name:'待退款',
                        value: '3'
                    },
                    {
                        name:'已完成',
                        value: '4'
                    },
                    {
                        name:'已取消',
                        value: '5'
                    }
                ],
              statusQuantity:{},
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
            }
        },
				filters: {
				  // const timeDown = unixtime => {
						// if(unixtime == 0) return '--'
				  //   // 小时
				  //   var hr = Math.floor(unixtime / 3600 % 24);
				  //   // 分钟
				  //   var min = Math.floor(unixtime / 60 % 60);
				  //   // 秒
				  //   var sec = Math.floor(unixtime % 60);
				  //   return  hr + "小时" + min + "分钟" + sec + "秒";
				  
				  // }
				},
        created(){
            this.searchRequest();
            this.statusRequest();
            this.querySunreadCount();
        },
        methods: {
          querySunreadCount(){
            getSunreadCount().then(res=>{
              if (res.returnCode == 'ERR_0000') {
                this.unreadNum=res.data;
              }
            })
          },
          isRead(){
            updateSunread().then(res=>{
              if (res.returnCode == 'ERR_0000') {
                this.querySunreadCount();//清空完之后重新查信息是否有未读完消息
              }
            })
          },
            // 页面数据加载
            searchRequest(){
                this.searchKeyword = ''
                findSalesOrderList(this.accountData).then(res => {
                    if(res.returnCode == 'ERR_0000'){
                      this.tableData = res.data || [];
                      if (this.accountData.status == "" || this.accountData.status == 0) { 
												this.timer = setInterval(()=>{
													//this.shengTime();
												},1000)
                      } else {
                        clearInterval(this.timer);
                      }
                    }
                })
            },

          shengTime() {
						for (let i in this.tableData) {
							if (this.tableData[i].cancelTime > 0) {
								this.tableData[i].autoCancelTime = --this.tableData[i].cancelTime;
								if (this.tableData[i].status == 0) {
									this.tableData[i].shengTime = filter.timeDown(this.tableData[i].cancelTime); //list[i].autoCancelTime
								}
							} else {
								this.tableData[i].cancelTime = '--'
								//if (this.data.ruleForm.status == 0) {
									//this.data.orderId = this.data.source == "purchase_order" ? this.data.list[i].purchaseOrderId : this.data.source == "sale_order" ? this.data.list[i].salesOrderId : '';
									//this.autoCancelOrder()
								//}
							}
						}
						this.setData({
							list: this.data.list,
						})
          },
					
            //购买方式
            currentSel(selVal){
                this.accountData["status"] = selVal;
								this.searchRequest();
								this.statusRequest();
            },
            // 点击查询
            searchAccount() {
                this.accountData.pageNum = 1
								this.searchRequest();
								this.statusRequest();
            },
            //改变页数
            pageChange(val){
                this.accountData.pageNum = val
                this.searchRequest()
            },
            //取消订单
            async cancelOrder(row){
                const result = await this.$confirm('取消订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                if (!result) return;
                cancelOrder({salesOrderId:row.salesOrderId,remark:''}).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        })
                        this.dialogFormVisible_editor = false
                        this.searchRequest()
                    }
                })
            },
            //取消订单并退款
            async cancelOrderRefund(row){
                const result = await this.$confirm('取消订单并退款?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                if (!result) return;
                cancelOrderRefund({salesOrderId:row.salesOrderId,remark:''}).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        })
                        this.dialogFormVisible_editor = false
                        this.searchRequest()
                    }
                })
            },
            //确认退款&&拒绝退款
            auditRefundApply(row,flag){
                console.log(flag)
                if(flag){
                    this.$confirm('确认退款?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                       this.tk(row,flag);
                    });
                }else{
                    this.$confirm('拒绝退款?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.tk(row,flag);
                    });
                }
            },
            tk(row,flag){
                auditRefundApply({salesOrderId:row.salesOrderId,remark:'',flag}).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        })
                        this.dialogFormVisible_editor = false
                        this.searchRequest()
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
            //改变每页条数
            sizeChange(val){
                this.accountData.pageSize = val
                this.searchRequest();
              this.searchRequest();
            },
            changeSelection(val) {
                this.selectedAccount = val
            },
            changeImage(url) {
                this.form.imgUrl = url
            },
          //表格状态栏切换
          statusHandleClick(tab){
            this.accountData.status = tab.name == "first"?null:tab.name == "secode"?6:tab.name == "tobepaid"?0:tab.name=="payment"?1:tab.name=="paid"?2:tab.name=="refunded"?3:tab.name=="completed"?4:tab.name=="cancelled"?5:'';
            if (tab.name=='secode'){
              this.isRead();//当选中待审核时标注已读
            }
            this.searchRequest();
          },
            //点击重置
            handleReset() {
                this.accountData.search = ''
                this.accountData.status = ''
                this.$refs['accountRef'].resetFields()
                this.searchRequest()
                this.statusRequest();
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
                        findSalesOrderDetail({drugNo,price,imgUrl}).then(res =>{
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
                console.log(row.salesOrderId)
                this.$router.push({path: `/sale/detail/${row.salesOrderId}`})
                //this.state = '销售订单详情'
                //this.dialogFormVisible_detail = true;
                //findSalesOrderDetail({'salesOrderId':row.salesOrderId}).then(res =>{
                    //if(res.returnCode == 'ERR_0000') {
                        //this.form = res.data
                    //}
               // })
            },
            //审核药品
            auditDrug(salesOrderDetailId){
                let paramData = {
                    salesOrderDetailId:salesOrderDetailId,
                    isPass:'',
                    errorMessage:'',
                    salesOrderId:''
                }
                checkOrder(paramData).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        this.form = res.data
                    }
                })
            }
        },
    }
</script>
<style scoped>
.el-tabs__item{
  font-size: 17px !important;
}
.el-tabs__active-bar{
  height: 5px !important;
}
</style>