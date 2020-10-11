<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form label-width="80px" :model="accountData" ref="accountRef">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="关键字">
              <el-input placeholder="联系人/手机号码" v-model.trim="accountData.search" @keyup.enter.native="searchAccount"
                        clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}" v-if="$store.state.account.type==0">
            <el-form-item label="所属企业">
              <el-input placeholder="请输入所属企业" v-model.trim="accountData.enterpriseName"
                        @keyup.enter.native="searchAccount" clearable></el-input>
            </el-form-item>
          </el-col>
          <!--<el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
              <el-form-item label="状态">
                  <el-select v-model="accountData.status" placeholder="请选择" @change="currentSel" clearable style="width: 100%;">
                      <el-option
                              v-for="(item,index) in statusData"
                              :key="index"
                              :label="item.name"
                              :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
          </el-col>-->
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}" v-if="$store.state.account.type==0">
            <el-form-item label="类型">
              <el-select v-model="accountData.partnerType" placeholder="请选择" @change="currentSel1" clearable
                         style="width: 100%;">
                <el-option
                    v-for="(item,index) in partnerTypeData"
                    :key="index"
                    :label="item.name"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" @click="searchAccount" v-has="'res_agent_query'">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix" style="padding: 10px 0;margin-bottom: -25px ;">
        <el-tabs v-model="activeName" @tab-click="statusHandleClick">
          <el-tab-pane :label="`全部(${statusQuantity.allCount })`" name="first" style="font-size: 60px">
          </el-tab-pane>
          <el-tab-pane :label="`待审核(${statusQuantity.toBeReviewedCount})`" name="secode">
              <span slot="label" v-if="unreadNum>0">待审核({{ statusQuantity.toBeReviewedCount }})<el-badge
                  :value="unreadNum"></el-badge></span>
          </el-tab-pane>
          <el-tab-pane :label="`审核不通过(${statusQuantity.auditNoPass})`" name="four"></el-tab-pane>
          <el-tab-pane :label="`审核通过(${statusQuantity.auditPass})`" name="third"></el-tab-pane>
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
            {{ ((accountData.pageNum - 1) * accountData.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
            prop="contacts"
            sortable
            label="名称"
        >
        </el-table-column>
        <el-table-column
            prop="subMobileNumber"
            sortable
            label="手机号">
        </el-table-column>
        <el-table-column
            prop="composeAddress"
            sortable
            label="地区">
        </el-table-column>
        <el-table-column
            prop="createTime"
            sortable
            label="申请时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
            v-if="$store.state.account.type==0"
            prop="enterpriseName"
            sortable
            label="所属企业">
          <template slot-scope="scope">
            {{ scope.row.enterpriseName || '鑫健康' }}
          </template>
        </el-table-column>
        <el-table-column
            prop="salesmanType"
            sortable
            label="合伙人级别">
          <template slot-scope="scope">
            {{ scope.row.salesmanType == 0 ? '区域代理' : scope.row.salesmanType == 1 ? '省代理' : scope.row.salesmanType == 2 ? '市代理' : scope.row.salesmanType == 3 ? '业务员' : '' }}
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            sortable
            label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" class="label label-warning">待审核</span>
            <span v-if="scope.row.status == 1" class="label label-success">审核通过</span>
            <span v-if="scope.row.status == 2" class="label label-danger">审核不通过</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="详情" placement="top" v-has="'res_partner_detail'">
              <el-button class="reset-icon" @click="$router.push({ path: `/agent/detail/${scope.row.applyId}` })"
                         type="text">
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
        <el-pagination @current-change="pageChange"
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
    <el-dialog :title="state" :visible.sync="dialogFormVisible_detail" center>
      <el-form :model="form" ref="formRef" :rules="rules">
        <h4>合伙人信息</h4>
        <el-form-item>
          <el-row :gutter="10">
            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
              ID:
            </el-col>
            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
              {{ form.applyId }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
              名称:
            </el-col>
            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
              {{ form.contacts }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
              电子邮件:
            </el-col>
            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
              {{ form.email }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
              身份证号:
            </el-col>
            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
              {{ form.idCode }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
              联系地址:
            </el-col>
            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
              {{ form.composeAddress }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
              合伙人级别:
            </el-col>
            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
              {{ form.salesmanType == 0 ? '区域代理' : form.salesmanType == 1 ? '省代理' : form.salesmanType == 2 ? '市代理' : form.salesmanType == 3 ? '业务员' : '未知' }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
              合伙人地区:
            </el-col>
            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
              {{ form.salesmanType == 0 ? form.region : form.salesmanType == 1 ? form.province : form.salesmanType == 2 ? form.city : form.salesmanType == 3 ? '全国' : '未知' }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
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
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
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
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
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
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" style="margin-top: 10px">
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
            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
              拒绝原因：
            </el-col>
            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
              <span style="color: red">{{ form.auditDesc }}</span>
            </el-col>
          </el-row>
          <el-row v-if="form.status == 1 || form.status == 2">
            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
              审核时间：
            </el-col>
            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
              {{ form.createTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
           <el-button @click="dialogFormVisible_detail_close">取 消</el-button>
       </div>-->
    </el-dialog>
    <el-dialog :title="state" :visible.sync="dialogFormVisible_editor" @close='closeDialog' center>
      <el-form :model="form" ref="formRef" :rules="rules">
        <h4>结算详情</h4>
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="form.name" maxlength="30" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
          <el-input v-model="form.price" maxlength="30"></el-input>
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
import {applyRecordList, partnerDetail, examine, getExamineCount, getEaunreadCount, updateEaunread} from '@/api/agent'
import uploadImage from "@/components/upload/image"

export default {
  components: {
    "upload-image": uploadImage
  },
  data() {
    let validateCountry = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入国家英文名称'))
      } else if (!this.validate.english(value)) {
        return callback(new Error('国家英文名称必须为字母'))
      } else {
        callback();
      }
    }
    return {
      unreadNum: 0,
      activeName: 'first',
      searchKeyword: '',
      state: '添加',
      tableData: [],
      accountData: {
        pageNum: 1,  //当前页
        pageSize: 10, //一页显示的条数
        search: '', //联系人/手机号码
        contact: '', //会员名
        status: '',//查询状态 0-待审核 1-审核不通过 2-审核通过
        partnerType: '',//类型 0-企业 1-个人
        enterpriseName: '',//所属企业
      },
      statusQuantity: {},
      statusData: [
        {
          name: '全部',
          value: ''
        },
        {
          name: '待审核',
          value: '0'
        },
        {
          name: '审核通过',
          value: '1'
        },
        {
          name: '审核不通过',
          value: '2'
        }
      ],
      partnerTypeData: [
        {
          name: '全部',
          value: ''
        },
        {
          name: '平台合伙人',
          value: '0'
        },
        {
          name: '企业合伙人',
          value: '1'
        },
      ],
      selectedAccount: [],
      dialogFormVisible_detail: false, //查看药品弹窗
      dialogFormVisible_editor: false, //修改药品弹窗
      dialogVisible: false, //修改药品图片放大
      form: {},
      rules: {
        auditDesc: [
          {required: true, message: '拒绝原因不能为空', trigger: 'blur'},
        ],
      },
      formLabelWidth: '120px',
    }
  },
  watch: {
    searchKeyword: function (val) {
      utils.searchKeyword(val)
    }
  },
  created() {
    this.searchRequest();
    this.statusRequest();
    this.querygetEaunreadCount();
  },
  methods: {
    // 页面数据加载
    searchRequest() {
      this.searchKeyword = ''
      applyRecordList(this.accountData).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.tableData = res.data || [];
        }
      })
    },
    querygetEaunreadCount() {
      getEaunreadCount().then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.unreadNum = res.data;
        }
      })
    },
    isRead() {
      updateEaunread().then(res => {
        console.log(res);
        if (res.returnCode == 'ERR_0000') {
          this.querygetEaunreadCount();//清空完之后重新查信息是否有未读完消息
        }
      })
    },
    //settlement
    settlement() {
      settlePayUrl({settlementId: this.form.settlementId, deviceType: this.deviceType,}).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.dialogFormVisible_detail = false;
          this.form = {};
          this.searchRequest()
        }
      })
    },
    statusRequest() {
      getExamineCount(this.accountData).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.statusQuantity = res.data;
        }
      })
    },
    //详情弹窗关闭
    dialogFormVisible_detail_close() {
      this.dialogFormVisible_detail = false;
      this.form = {}
    },
    //表格状态栏切换
    statusHandleClick(tab) {
      this.accountData.status = tab.name == "first" ? null : tab.name == "secode" ? 0 : tab.name == "third" ? 1 : tab.name == "four" ? 2 : '';
      if (tab.name == 'secode') {
        this.isRead();//当选中待审核时标注已读
      }
      this.searchRequest();
    },
    //状态
    currentSel(selVal) {
      this.accountData["status"] = selVal;
      this.searchRequest();
    },
    //类型
    currentSel1(selVal) {
      this.accountData["partnerType"] = selVal;
      this.searchRequest();
    },
    // 点击查询
    searchAccount() {
      this.accountData.pageNum = 1;
      this.searchRequest();
      this.statusRequest();
    },
    //认证详情-审核通过
    pass() {
      examine({applyId: this.form.applyId, status: 1, auditDesc: ''}).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.dialogFormVisible_detail = false;
          this.form = {};
          this.searchRequest();
          this.statusRequest();
        }
      })
    },
    //认证详情-拒绝审核
    reject() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          examine({applyId: this.form.applyId, status: 2, auditDesc: this.form.auditDesc,}).then(res => {
            if (res.returnCode == 'ERR_0000') {
              this.dialogFormVisible_detail = false;
              this.form = {};
              this.searchRequest();
              this.statusRequest();
            }
          })
        }
      })
    },
    /*            statusRequest(){
                    audit.statusRequest().then(res =>{
                        if(res.returnCode == 'ERR_0000'){
                            for(let i = 0 ,j = res.data.length; i< j; i++){
                                this.statusData.push(res.data[i])
                            }
                        }
                    })
                },*/
    //改变页数
    pageChange(val) {
      this.accountData.pageNum = val
      this.searchRequest()
    },
    //改变每页条数
    sizeChange(val) {
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
      this.accountData.enterpriseName = "";
      this.accountData.status = ''
      this.accountData.partnerType = "";
      this.$refs['accountRef'].resetFields()
      this.searchRequest();
      this.statusRequest();
    },
    closeDialog() {
      this.$refs['formRef'].resetFields()
    },
    submitClick() {
      this.submit2()
    },
    //详情弹窗关闭
    dialogFormVisible_detail_close() {
      this.dialogFormVisible_detail = false;
      this.form = {}
    },
    // 点击编辑
    handleEdit(row) {
      this.state = '修改药品'
      this.dialogFormVisible_editor = true
      this.form = row;
    },
    //查看详情
    handleDetail(row) {
      this.state = '合伙人详情'
      this.dialogFormVisible_detail = true;
      partnerDetail({'applyId': row.applyId}).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.form = res.data
        }
      })
    },
  },
}
</script>
<style>
.el-tabs__item {
  font-size: 17px !important;
}

.el-tabs__active-bar {
  height: 5px !important;
}
</style>