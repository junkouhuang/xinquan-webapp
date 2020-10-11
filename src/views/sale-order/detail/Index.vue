<template>
    <el-card shadow="never" class="mt20" >
        <el-form label-width="100px">
            <h4>订单基本信息</h4>
            <el-form-item label="销售订单号：">
                {{form.salesOrderNo}}
            </el-form-item>
            <el-form-item label="订单金额：">
                {{form.amountWithTax}}
            </el-form-item>
            <el-form-item label="开单人：">
                {{form.creator}}
            </el-form-item>
            <el-form-item label="开单时间：">
                {{form.createTime | datefmt('YYYY-MM-DD ') }}
            </el-form-item>
            <el-form-item label="订单状态：">
                {{form.status == 0?'待付款':
                form.status == 1?'待确认付款':
                form.status == 2?'已付款':
                form.status == 3?'待退款':
                form.status == 4?'已完成':
                form.status == 5?'已取消':''}}
            </el-form-item>
            <el-form-item label="收货人：">
                {{form.consignee}}
            </el-form-item>
            <el-form-item label="手机号：">
                {{form.consigneePhone}}
            </el-form-item>
            <el-form-item label="地址：">
                {{form.shippingAddress}}
            </el-form-item>
            <h4>订单商品</h4>
            <el-row  v-for="(item,index) in form.details" :key="index" class="ordersp">
                <el-col :span="20" >
                    <el-row class="elRow">
                        <el-col :xs="7" :sm="6" :md="5" :lg="4" :xl="2" class="spimg">
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
                        <el-col :xs="17" :sm="18" :md="19" :lg="20" :xl="22">
                            <p class="item">{{item.productName}}</p>
                            <p class="item">{{item.manufacturer}}</p>
                            <p class="item">{{item.spec}}</p>
                            <p class="item">采购数量：{{item.quantity}}{{item.salesUnit}}</p>
                            <p class="item">小计：{{item.amountWithTax}}</p>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4"  class="auditBtn">
                    <template v-if="$store.state.account.organizationId!=1 && $store.state.account.type == 1 && form.status == 6">
                        <template v-if="item.isPass == null">
                            <el-button type="primary" @click="audit(item.salesOrderDetailId,1)">审核通过</el-button>
                            <el-button @click="audit(item.salesOrderDetailId,0)">拒绝</el-button>
                        </template>
                        <template v-if="item.isPass == 0">
                            <div class="reject">
                                <p>拒绝原因：{{item.errorMessage}}</p>
                                <el-button @click="anew(index)">重新审核</el-button>
                            </div>
                        </template>
                        <template v-if="item.isPass == 1">
                            <div class="anew">
                                <p><i class="el-icon-success"></i>&nbsp;&nbsp;已通过</p>
                                <el-button @click="anew(index)">重新审核</el-button>
                            </div>
                        </template>
                    </template>
                </el-col>
            </el-row>
            <el-button type="primary" @click="confirm(form.salesOrderId)" v-if="$store.state.account.organizationId!=1 && $store.state.account.type == 1 && form.status == 6">确认订单</el-button>
            <el-button @click="$router.go(-1)">返回</el-button>
        </el-form>

    </el-card>
</template>

<script>
    import { findSalesOrderDetail,checkOrder,artificialCheckOrderEnd } from '@/api/saleOrder'

    export default {
        data() {
            return {
                form: {},
                id:''
            }
        },
        created(){
            this.id = this.$route.params.id;
            this.searchRequest(this.$route.params.id);
        },
        methods: {
            // 页面数据加载
            searchRequest(salesOrderId){
                findSalesOrderDetail({'salesOrderId':salesOrderId}).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        this.form = res.data
                    }
                })
            },

            //审核药品-通过
            audit(salesOrderDetailId,isPass){
                if(isPass == 0){
                    this.$prompt('请输入拒绝原因', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        let paramData = {
                            salesOrderDetailId,
                            isPass,
                            errorMessage:value,
                            salesOrderId:''
                        }
                        this.checkOrder(paramData,isPass);
                    }).catch(() => {

                    });
                }else{
                    let paramData = {
                        salesOrderDetailId,
                        isPass,
                        errorMessage:'',
                        salesOrderId:''
                    }
                    this.checkOrder(paramData,isPass);
                }
            },

            //重新审核
            anew(index){
                this.form.details[index].isPass=null;
            },

            checkOrder(paramData,isPass){
                checkOrder(paramData).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        isPass == 0?this.$message.error('已拒绝'):isPass == 1?this.$message.success('审核通过'):''
                        this.searchRequest(this.id);
                    }else{
                        this.$message.error(res.returnMsg);
                    }
                })
            },

            //确认订单
            confirm(salesOrderId){
                console.log(this.form)
                let some = this.form.details.some(item=>{
                    return item.isPass == null;
                })
                if(some){
                    this.$message.warning('还有待审核订单，请审核');
                    return;
                }
                artificialCheckOrderEnd({salesOrderId}).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        this.$router.go(-1);
                    }else{
                        this.$message.error(res.returnMsg);
                    }
                })

            }
        },
    }
</script>

<style scoped lang="scss">
    .ordersp {
        background: #f2f2f2;
        margin-bottom: 6px;
        padding: 10px;
        display: flex;
        .elRow {
            display: flex;
            justify-content: center;
            align-items: center;
            .spimg {
                text-align: center;
            }
            .item {
                line-height: 10px;
            }
        }
        .auditBtn {
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .reject {
            text-align: right;
            p {
                color: red;
            }
        }
        .anew {
            display: flex;
            justify-content: center;
            flex-direction: column;
            i {
                font-size: 20px;
                color: #3996E1
            }
        }
    }

</style>
