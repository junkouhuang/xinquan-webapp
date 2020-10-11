<template>
    <div>
        <el-card shadow="never" class="mt20">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" >
								<el-form-item label="所属企业："  v-if="$store.state.account.type == 0" :prop="$store.state.account.type == 0?'enterpriseId':''" style="max-width: 600px">
								    <el-select placeholder="请选择所属企业" v-model="form.enterpriseId" style="width: 100%" clearable>
								      <el-option
								              v-for="item in enterpriseList"
								              :key="item.enterpriseId"
								              :label="item.enterpriseName"
								              :value="item.enterpriseId">
								      </el-option>
								    </el-select>
								</el-form-item>
                <el-form-item label="标题：" prop="title" style="max-width: 600px">
                    <el-input v-model="form.title" type="textarea" maxlength="200" placeholder="输入公告标题" readonly></el-input>
                </el-form-item>
                <el-form-item label="公告内容：" prop="content" style="max-width:900px;">
                    <div ref="editor" style="text-align:left"></div>
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                    <el-radio v-model="form.status" :label="0">禁用</el-radio>
                    <el-radio v-model="form.status" :label="1">启用</el-radio>
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
    import uploadImage from "@/components/upload/image"
    import { getEnterpriseList,addAnnouncementList } from '@/api/announcement'
    import E from "wangeditor"
    export default {
        name: 'editor',
        components: {
            "upload-image": uploadImage
        },
        data() {
            return {
								enterpriseList:[],
                form: {
										enterpriseId:'',
                    title: "公告",
                    content: "",
                    status: ""
                },
                typeData: [],
                rules: {
										enterpriseId:[{required: true, message: '请选择供应商', trigger: 'change'}],
                    title: [{ required: true, message: "请填写公告标题", trigger: "blur" }],
                    content: [
                        { required: true, message: "请输入公告内容", trigger: "blur" }
                    ],
                    status: [
                        { required: true, message: "请选择状态", trigger: "change" }
                    ]
                },
                editor:''
            };
        },
        created() {
					console.log(this.$store.state.account.type)
					console.log("=============");
					this.getEnterpriseListData();
        },
        mounted() {
            this.uploadImage()
        },
        methods: {
            // 上传图片
            uploadImage() {
                const that = this;
                this.editor = new E(this.$refs.editor);
                this.editor.customConfig.menus = [
                    'head',  // 标题
                    'bold',  // 粗体
                    'fontSize',  // 字号
                    'fontName',  // 字体
                    'foreColor',  // 文字颜色
                    'backColor',  // 背景颜色
                    'list',  // 列表
                    'justify',  // 对齐方式
                    'image',  // 插入图片
                    'undo',  // 撤销
                    'redo'  // 重复
                ]
                this.editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024;
                this.editor.customConfig.uploadImgShowBase64 = true;
                this.editor.customConfig.onchange = html => {
                    this.form.content = html
                }
                this.editor.create();
            },
            submitForm() {
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        addAnnouncementList(this.form).then(res => {
                            if (res.returnCode == "ERR_0000") {
                                if(res.data){
                                    this.$message({
                                        message: "新增公告成功",
                                        type: "success"
                                    })
                                    this.$router.go(-1)
                                }else{
                                    this.$message({
                                        message: "已存在一条数据",
                                        type: "success"
                                    })
                                    //console.log("已存在一条数据")
                                }
                            } else {
                                this.$message({
                                    message: "新增公告失败",
                                    type: "error"
                                })
                            }
                        })
                    }
                })
            },
						getEnterpriseListData(){
							getEnterpriseList({keyWord:''}).then(res => {
							    if(res.returnCode == 'ERR_0000'){
										this.enterpriseList = res.data || [];
										if(this.$store.state.account.type == 1){
											this.form.enterpriseId = this.enterpriseList[0].enterpriseId;
										}
							    }
							})
						}
        }
    };
</script>
