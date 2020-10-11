<template>
    <el-card shadow="never" class="mt20">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" >
            <h4>合伙人信息</h4>
            <el-form-item label="ID:">
                {{form.applyId}}
            </el-form-item>
            <el-form-item label="名称:">
                {{form.contacts}}
            </el-form-item>
            <el-form-item label="电子邮件:">
                {{form.email}}
            </el-form-item>
            <el-form-item label="身份证号:">
                {{form.idCode}}
            </el-form-item>
            <el-form-item label="联系地址:">
                {{form.composeAddress}}
            </el-form-item>
            <el-form-item label="合伙人级别:">
                {{form.salesmanType == 0?'区域代理':form.salesmanType == 1?'省代理':form.salesmanType == 2?'市代理' :form.salesmanType == 3?'业务员':'未知'}}
            </el-form-item>
            <el-form-item label="合伙人地区:">
                {{form.salesmanType == 0?form.region:form.salesmanType == 1?form.province:form.salesmanType == 2?form.city :form.salesmanType == 3?'全国':'未知'}}
            </el-form-item>
            <el-form-item>
                <el-row>
                    <el-col :xs="4" :sm="4" :md="4" :lg="3" :xl="3">
                        <p>身份证正面照</p>
                        <el-image
                                v-if="form.idCardFrontPath"
                                style="width: 100px; height: 100px"
                                :src="form.idCardFrontPath"
                                :preview-src-list="[`${form.idCardFrontPath}`]">
                        </el-image>
                        <el-image
                                v-else
                                style="width: 100px; text-align:center;height: 100px;line-height: 100px;font-size: 14px;background: #F5F7FA;color: #C0C4CC;">
                            <div slot="error" class="image-slot">
                                <!--<i class="el-icon-picture-outline"></i>-->
                                <span>暂无图片</span>
                            </div>
                        </el-image>
                    </el-col>
                    <el-col :xs="4" :sm="4" :md="4" :lg="3" :xl="3">
                        <p>身份证背面照</p>
                        <el-image
                                v-if="form.idCardBackPath"
                                style="width: 100px; height: 100px"
                                :src="form.idCardBackPath"
                                :preview-src-list="[`${form.idCardBackPath}`]">
                        </el-image>
                        <el-image
                                v-else
                                style="width: 100px; text-align:center;height: 100px;line-height: 100px;font-size: 14px;background: #F5F7FA;color: #C0C4CC;">
                            <div slot="error" class="image-slot">
                                <!--<i class="el-icon-picture-outline"></i>-->
                                <span>暂无图片</span>
                            </div>
                        </el-image>
                    </el-col>
                    <el-col :xs="4" :sm="4" :md="4" :lg="3" :xl="3">
                        <p>上传保单/社保卡</p>
                        <el-image
                                v-if="form.policyPath"
                                style="width: 100px; height: 100px"
                                :src="form.policyPath"
                                :preview-src-list="[`${form.policyPath}`]">
                        </el-image>
                        <el-image
                                v-else
                                style="width: 100px; text-align:center;height: 100px;line-height: 100px;font-size: 14px;background: #F5F7FA;color: #C0C4CC;">
                            <div slot="error" class="image-slot">
                                <!--<i class="el-icon-picture-outline"></i>-->
                                <span>暂无图片</span>
                            </div>
                        </el-image>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item v-if="form.status == 0">
                <el-row>
                    <el-col>
                        <el-button type="primary" @click="pass">通过</el-button>
                        <el-button @click="reject">拒绝</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item prop="auditDesc" v-if="form.status == 0">
                <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" style="margin-top: 10px"  >
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入拒绝原因"
                            maxlength="50"
                            show-word-limit
                            v-model="form.auditDesc">
                    </el-input>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-row v-if="form.status == 2">
                    <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="2">
                        拒绝原因：
                    </el-col>
                    <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="22">
                        <span style="color: red">{{form.auditDesc}}</span>
                    </el-col>
                </el-row>
                <el-row v-if="form.status == 1 || form.status == 2">
                    <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="2">
                        审核时间：
                    </el-col>
                    <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="22">
                        {{form.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-button @click="$router.go(-1)">返回</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    import { partnerDetail,examine } from '@/api/agent'

    export default {

        data() {
            return {
                form: {},
                rules: {
                    auditDesc: [
                        {required: true, message: '拒绝原因不能为空', trigger: 'blur'},
                    ],
                },
            }
        },
        created(){
            this.dataRequest(this.$route.params.applyId);
        },
        methods: {
            // 页面数据加载
            dataRequest(applyId){
                partnerDetail({applyId}).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        this.form = res.data
                    }
                })
            },

            //认证详情-审核通过
            pass(){
                examine({applyId:this.form.applyId,status:1,auditDesc:''}).then(res =>{
                    if(res.returnCode == 'ERR_0000'){
                        this.$router.go(-1)
                        //this.statusRequest();
                    }
                })
            },
            //认证详情-拒绝审核
            reject(){
                this.$refs['formRef'].validate(valid => {
                    if(valid){
                        examine({applyId: this.form.applyId, status: 2, auditDesc: this.form.auditDesc,}).then(res => {
                            if (res.returnCode == 'ERR_0000') {
                               this.$router.go(-1)
                               // this.statusRequest();
                            }
                        })
                    }
                })
            },
            changeImage(url) {
                this.form.imgUrl = url
            },

        },
    }
</script>
