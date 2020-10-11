<template>
    <div>
        <el-card shadow="never" class="mt20">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" >
                <el-form-item label="药品名：" prop="name">
                    <el-input v-model="form.name" type="textarea" maxlength="200" placeholder="输入公告标题" ></el-input>
                </el-form-item>
                <el-form-item label="价格：" prop="price">
                    <el-input v-model="form.price" maxlength="30" clearable></el-input>
                </el-form-item>
                <el-form-item label="图片："  prop="imgUrl">
                    <upload-image :imageUrl="form.imgUrl" @changeImage="changeImage"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="blue" @click="submitForm">保存提交</el-button>
                    <el-button @click="$router.go(-1)">返回</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import { detailDrug,updateDrug } from '@/api/drug'
    import uploadImage from "@/components/upload/image"
    export default {
        name: 'editor',
        components: {
            "upload-image": uploadImage
        },
        data() {
            return {
                form: {},
                rules: {
                    name: [{ required: true, message: "请输入药品名", trigger: "blur" }],
                    price: [{ required: true, message: "请输入价格", trigger: "blur" }],
                    imgUrl: [{ required: true, message: "请上传图片", trigger: "blur" }]
                },
            };
        },
        created() {
            this.dataRequest(this.$route.params.drugNo)
        },
        methods: {
            //药品info
            dataRequest(drugNo){
                detailDrug({drugNo}).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                        this.form = res.data
                    }
                })
            },
            // 保存
            submitForm(){
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        let {drugNo,price,imgUrl} = this.form;
                        updateDrug({drugNo,price,imgUrl}).then(res =>{
                            if(res.returnCode == 'ERR_0000') {
                                this.$message({
                                    message: '修改药品成功',
                                    type: 'success'
                                })
                                this.$router.go(-1)
                            } else {
                                this.$message({
                                    message: "修改药品失败",
                                    type: "error"
                                })
                            }
                        })
                    }
                })
            },
            // 上传图片
            changeImage(url) {
                this.form.imgUrl = url
            },
        }
    };
</script>
