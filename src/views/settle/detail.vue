<template>
    <el-card shadow="never" class="mt20">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="110px" >
            <h4>结算详情</h4>
            <el-form-item label="名称:">
                {{form.contact}}
            </el-form-item>
            <el-form-item label="类型:">
                {{form.type == 0?'结算':''}}
            </el-form-item>
            <el-form-item label="金额:">
                ￥{{form.settlementPrice}}
            </el-form-item>
            <el-form-item label="结算时间:">
                {{form.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
            </el-form-item>
            <el-form-item label="结算单号:">
                {{form.settlementNo}}
            </el-form-item>
            <template  v-if="form.status == 0">
                <el-button type="primary" @click="pass">通过</el-button>
                <el-button @click="reject">拒绝</el-button>
            </template>
            <el-form-item prop="remark" v-if="form.status == 0" style="  margin-top: 10px;">
                <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入拒绝原因"
                        maxlength="50"
                        show-word-limit
                        v-model="form.remark">
                </el-input>
            </el-form-item>
            <el-form-item label="拒绝原因：" v-if="form.status == 2">
                <span style="color: red">{{form.remark}}</span>
            </el-form-item>
            <el-form-item label="审核时间："  v-if="form.status == 1 || form.status == 2">
                {{form.updateTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
            </el-form-item>
            <el-form-item label="付款时间："  v-if="form.status == 3">
                {{form.paymentTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
            </el-form-item>
            <el-form-item v-if="form.status == 1 && form.payStatus == 1" label="上传支付凭证：">
                <upload-image :imageUrl="form.confirmReceipt" @changeImage="changeImage"/>
            </el-form-item>
            <el-form-item v-if="form.status == 1 && form.payStatus == 2" label="支付凭证：" >
                <el-image
												v-if="form.confirmReceipt"
												v-for="(items,index) in form.confirmReceipt"
												:key="index"
												style="width: 100px;margin-right: 10px;"
												:src="items"
												:preview-src-list="form.confirmReceipt">
                </el-image>
                <el-image
                        v-else
                        style="width: 80px; text-align:center;height: 80px;line-height: 80px;font-size: 14px;background: #F5F7FA;color: #C0C4CC;">
                    <div slot="error" class="image-slot">
                        <!--<i class="el-icon-picture-outline"></i>-->
                        <span>暂无图片</span>
                    </div>
                </el-image>
            </el-form-item>
            <el-form-item>
                <el-button  type="primary" v-if="form.status == 1 && form.payStatus == 0" @click="settlement">支 付</el-button>
                <el-button  type="primary" v-if="form.status == 1 && form.payStatus == 1" @click="confirmReceiptHandle">确认提交</el-button>
                <el-button @click="$router.go(-1)">返回</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    import utils from '@/utils'
    import { settleDetail,audit,settlePayUrl,confirmReceipt } from '@/api/settle'
    import uploadImage from "@/components/upload/mult-image"

    export default {
        components: {
            "upload-image": uploadImage
        },
				inject:['reload'],
        data() {
            return {
								imgUrl:[],
                form: {},
                rules: {
                    remark: [
                        {required: true, message: '拒绝原因不能为空', trigger: 'blur'},
                    ],
                },
            }
        },
        watch: {
            searchKeyword: function(val) {
                utils.searchKeyword(val)
            }
        },
        created(){
            this.dataRequest(this.$route.params.settlementId);
        },
        methods: {
            // 页面数据加载
            dataRequest(settlementId){
                settleDetail({settlementId}).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        this.form = res.data;
												this.form.confirmReceipt = this.form.confirmReceipt.split(',')
												console.log(this.form.confirmReceipt)
                    }
                })
            },
            //结算
            settlement(){
                settlePayUrl({settlementId:this.form.settlementId,deviceType: this.deviceType,}).then(res =>{
                    if(res.returnCode == 'ERR_0000'){
                        this.reload();//刷新当前页面（推荐）
                    }
                })
            },
            //结算-确认提交
            confirmReceiptHandle(){
                if( this.imgUrl.length==0){
                    this.$message.error('请上传支付凭证')
										return;
                }
                confirmReceipt({settlementId:this.form.settlementId,confirmReceipt: this.imgUrl.toString()}).then(res =>{
                    if(res.returnCode == 'ERR_0000'){
                        this.$router.go(-1)
                    }
                })
            },
            //认证详情-审核通过
            pass(){
                audit({settlementId:this.form.settlementId,status:1,remark:''}).then(res =>{
                    if(res.returnCode == 'ERR_0000'){
                        this.$router.go(-1)
                    }
                })
            },
            //认证详情-拒绝审核
            reject(){
                this.$refs['formRef'].validate(valid => {
                    if(valid){
                        audit({settlementId: this.form.settlementId, status: 2, remark:this.form.remark}).then(res => {
                            if (res.returnCode == 'ERR_0000') {
                                this.$router.go(-1)
                            }
                        })
                    }
                })
            },
            changeImage(url) {
							//this.form.confirmReceipt = url
							this.imgUrl.push(url);
							console.log(this.imgUrl)
            },
        },
    }
</script>
<style scoped>
    >>>.el-form-item__content {
        margin-left: 0!important;
    }
</style>
