<template>
    <div>
        <el-card shadow="never" class="mt20">
            <el-form label-width="80px" :model="accountData" ref="accountRef">
                <el-row :gutter="20">
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="生产企业">
                            <el-input placeholder="请输入生产企业" v-model.trim="accountData.producerName" @keyup.enter.native="searchAccount" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="批准文号">
                            <el-input placeholder="请输入批准文号" v-model.trim="accountData.licenseNo" @keyup.enter.native="searchAccount" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="药品名称">
                            <el-input placeholder="请输入药品名称" v-model.trim="accountData.name" @keyup.enter.native="searchAccount" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="配送企业">
                            <el-input placeholder="请输入配送企业" v-model.trim="accountData.enterpriseName" @keyup.enter.native="searchAccount" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-form-item label="购买方式">
                            <el-select v-model="accountData.retail" placeholder="请选择" @change="currentSel" clearable style="width: 100%">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="整件" value="0"></el-option>
                                <el-option label="拆零" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                        <el-button type="blue" @click="searchAccount" v-has="'res_drug_list_query'">查 询</el-button>
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
                        prop="drugNo"
                        sortable
                        label="商品编号"
                >
                </el-table-column>
                <el-table-column
                        prop="name"
                        sortable
                        label="商品名">
                </el-table-column>
                <el-table-column
                        prop="imgUrl"
                        sortable
                        label="商品图片">
                    <template slot-scope="scope">
                        <el-image
                                v-if="scope.row.imgUrl"
                                style="width: 80px; height: 80px"
                                :src="scope.row.imgUrl"
                                :preview-src-list="[`${scope.row.imgUrl}`]">
                        </el-image>
                        <el-image
                                v-else
                                style="width: 80px; text-align:center;height: 80px;line-height: 80px;font-size: 14px;background: #F5F7FA;color: #C0C4CC;">
                                <div slot="error" class="image-slot">
                                    <!--<i class="el-icon-picture-outline"></i>-->
                                    <span>暂无图片</span>
                                </div>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="drugTypeName"
                        sortable
                        label="类型">
                </el-table-column>
                <el-table-column
                        prop="price"
                        sortable
                        label="价格">
                    <template slot-scope="scope">
                        ￥{{scope.row.price}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="suggestPrice"
                        sortable
                        width="120"
                        label="建议零售价">
                    <template slot-scope="scope">
                        ￥{{scope.row.suggestPrice}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="enterpriseName"
                        sortable
                        label="配送企业">
                </el-table-column>
                <el-table-column
                        prop="producerName"
                        sortable
                        label="生产企业">
                </el-table-column>
                <el-table-column
                        prop="amount"
                        sortable
                        label="库存">
                </el-table-column>
                <el-table-column
                        prop="packageAmount"
                        sortable
                        label="起批量">
                </el-table-column>
                <el-table-column
                        prop="spec"
                        sortable
                        label="规格">
                </el-table-column>
                <el-table-column
                        prop="licenseNo"
                        sortable
                        label="批准文号">
                </el-table-column>
                <el-table-column
                        prop="batchNo"
                        sortable
                        label="批号">
                </el-table-column>
                <el-table-column
                        prop="validityDate"
                        sortable
                        label="有效期">
                    <template slot-scope="scope">
                        {{ scope.row.validityDate | datefmt('YYYY-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-has="'res_drug_update'">
                            <el-button class="reset-icon" @click="$router.push({ path: `/drug/editor/${scope.row.drugNo}` })" type="text" >
                                <i class="iconfont">&#xe71c;</i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="详情" placement="top" v-has="'res_drug_list_detail'">
                            <el-button class="reset-icon" @click="$router.push({ path: `/drug/detail/${scope.row.drugNo}` })" type="text" >
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
    import { getDrugList } from '@/api/drug'

    export default {

        data() {
            return {
                searchKeyword: '',
                tableData: [],
                accountData:{
                    pageNum: 1,  //当前页
                    pageSize: 10, //一页显示的条数
                    producerName: '', //生产产家
                    licenseNo:'',//批准文号
                    name:'',//药品名称
                    priceSort : '' , //价格排序(up:升序 down:降序)
                    retail:'', //0-整件   1-零售
                    drugTypeId:'', //药品二级类型id
                    keyWord:'', //搜索关键字，支持药品名、企业名称
                    enterpriseName:''
                },
                selectedAccount: [],
            }
        },
        watch: {
            searchKeyword: function(val) {
                utils.searchKeyword(val)
            }
        },
        activated(){
            this.searchRequest();
        },
        methods: {
            // 页面数据加载
            searchRequest(){
                this.searchKeyword = ''
                getDrugList(this.accountData).then(res => {
                    if(res.returnCode == 'ERR_0000'){
                        this.tableData = res.data || [];
                    }
                })
            },
            //购买方式
            currentSel(selVal){
                this.accountData["retail"] = selVal;
            },
            // 点击查询
            searchAccount() {
                //this.accountData.pageNum = 1
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
            //点击重置
            handleReset() {
                this.accountData.producerName = ''
                this.accountData.licenseNo = ''
                this.accountData.name = ''
                this.accountData.retail = ''
                this.accountData.enterpriseName = ''
                this.$refs['accountRef'].resetFields()
                this.searchRequest()
            },
        },
    }
</script>
