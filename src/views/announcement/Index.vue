<template>
    <div>
        <el-card shadow="never" class="mt20">
            <el-form label-width="80px" :model="accountData" ref="accountRef">
                <el-row :gutter="20">
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="标题">
                            <el-input placeholder="请输入公告标题" v-model.trim="accountData.title" @keyup.enter.native="searchAccount" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="状态">
                            <el-select v-model="accountData.status" placeholder="请选择" @change="currentSel" clearable style="width: 100%">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="禁用" value="0"></el-option>
                                <el-option label="启用" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-button type="blue" @click="searchAccount" v-has="'res_announcement_list_query'">查 询</el-button>
                        <el-button @click="handleReset">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <el-card shadow="never" class="mt20">
            <div slot="header" class="clearfix">
                <div class="pull-left">
                    <el-button type="blue" @click="$router.push({path: '/announcement/add'})" v-has="'res_announcement_list_add'">新增</el-button>
                    <el-button type="danger" @click="handleDeleteSelected" v-has="'res_announcement_list_delete'">删除</el-button>
                </div>
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
                        prop="title"
                        sortable
                        label="标题"
                >
                </el-table-column>
                <el-table-column
                        prop="content"
                        sortable
                        label="内容">
                    <template slot-scope="scope">
                        <div v-html="scope.row.content"></div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        sortable
                        label="创建时间">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | datefmt('YYYY-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createBy"
                        sortable
                        label="创建人">
                </el-table-column>
                <el-table-column
										v-if="$store.state.account.type == 0"
                    prop="enterpriseName"
                    sortable
                    label="所属企业">
                  <template slot-scope="scope">
                    {{ scope.row.enterpriseName || '鑫健康'}}
                  </template>
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        sortable
                        label="修改时间">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | datefmt('YYYY-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="updateBy"
                        sortable
                        label="修改人">
                </el-table-column>
                <el-table-column
                        prop="status"
                        sortable
                        label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.status == 0?'禁用':scope.row.status == 1?'启用':''}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope" >
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-has="'res_announcement_list_editor'"  v-if="$store.state.account.accountName == 'root' || $store.state.account.type == 1 ">
                            <el-button class="reset-icon" @click="$router.push({ path: `/announcement/editor/${scope.row.id}` })" type="text" >
                                <i class="iconfont">&#xe71c;</i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查看" placement="top" v-has="'res_announcement_list_detail'" >
                            <el-button class="reset-icon" @click="$router.push({ path: `/announcement/detail/${scope.row.id}` })" type="text" >
                                <i class="iconfont">&#xe605;</i>
                            </el-button>
                        </el-tooltip>
                        <template v-if="$store.state.account.accountName == 'root' || $store.state.account.type == 1 ">
                            <el-tooltip class="item" effect="dark" content="启用" placement="top"  v-has="'res_announcement_status_editor'" v-if="scope.row.status==0">
                                <el-button class="reset-icon" @click="upDown(scope.row)"  type="text" >
                                    <i class="iconfont">&#xe60b;</i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="停用" placement="top" v-else v-has="'res_announcement_status_editor'">
                                <el-button class="reset-icon" @click="upDown(scope.row)"  type="text" >
                                    <i class="iconfont">&#xe673;</i>
                                </el-button>
                            </el-tooltip>
                        </template>
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
                <el-form-item>
                    <el-row :gutter="10">
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            药品编号:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.drugNo}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row :gutter="10">
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            药品名:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.name}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            图  片:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            <el-image
                                    v-if="form.imgUrl"
                                    style="width: 80px; height: 80px"
                                    :src="form.imgUrl"
                                    :preview-src-list="[`${form.imgUrl}`]">
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
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            价  格:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.price}}元
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            建议零售价:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.suggestPrice}}元
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            配送企业:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.enterpriseName}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            生产企业:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.producerName}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            批准文号:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.licenseNo}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            药品代码:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.producerMnemonic}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            库存:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.amount}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            规 格:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.spec}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            起批量:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.packageAmount}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            批号:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.batchNo}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            单位:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.unit}}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            有效期:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.validityDate | datefmt('YYYY-MM-DD ') }}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                            生产日期:
                        </el-col>
                        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                            {{form.productionDate | datefmt('YYYY-MM-DD ') }}
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
    import { getAnnouncementList,updateDrug,deleteAnnouncement,updateStatus } from '@/api/announcement'
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
                accountData:{
                    pageNum: 1,  //当前页
                    pageSize: 10, //一页显示的条数
                    title: '', //公告标题
                    status:'',//是否启用(0:禁用,1:启用)

                },
                selectedPackage: [],
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
        created(){
            this.searchRequest();
        },
        methods: {
            // 页面数据加载
            searchRequest(){
                this.searchKeyword = ''
                getAnnouncementList(this.accountData).then(res => {
                    if(res.returnCode == 'ERR_0000'){
                        this.tableData = res.data || [];
                    }
                })
            },
            //状态
            currentSel(selVal){
                this.accountData["status"] = selVal;
            },
            // 点击查询
            searchAccount() {
                this.accountData.pageNum = 1
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
                this.selectedPackage = val
            },
            changeImage(url) {
                this.form.imgUrl = url
            },
            //点击重置
            handleReset() {
                this.accountData.status = ''
                this.accountData.title = ''
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
            handleDeleteSelected() {
                if (this.selectedPackage.length <= 0) {
                    this.$message.error('请选择删除内容')
                    return
                }
                this.$confirm("确定要删除选中的所有公告?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let ids = []
                    this.selectedPackage.forEach(item => {
                        ids.push(item.id)
                    })
                    deleteAnnouncement(ids).then(res => {
                        if (res.returnCode == "ERR_0000") {
                            this.$message({
                                message: "公告删除成功",
                                type: "success"
                            })
                            this.searchRequest()
                        }
                    })
                })
            },
            // 点击上下架
            upDown(row) {
                if (row.status == 0) { //0:禁用 1：启用
                    //启用
                    this.$confirm(`确定启用该公告？（${row.title}）`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        updateStatus({id:row.id,status:1}).then(res => {
                            if (res.returnCode == "ERR_0000") {
                                this.$message({
                                    message: "公告启用成功",
                                    type: "success"
                                })
                                this.searchRequest()
                            }
                        })
                    }).catch(() => {})
                } else {
                    //停用
                    this.$confirm(`确定停用该公告？（${row.title}）`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        updateStatus({id:row.id,status:0}).then(res => {
                            if (res.returnCode == "ERR_0000") {
                                this.$message({
                                    message: "公告已停用",
                                    type: "success"
                                })
                                this.searchRequest()
                            }
                        })
                    }).catch(() => {})
                }
            },
        },
    }
</script>
