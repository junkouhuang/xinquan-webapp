<template>
    <el-card shadow="never" class="mt20">
        <h2>企业审核</h2>
        <el-form>
            <h3>基本信息</h3>
            <el-form-item label="企业名称：" >{{ form.enterpriseName }}</el-form-item>
            <el-form-item label="企业类型：" >{{ form.modeName }}</el-form-item>
            <el-form-item label="企业地址：" >{{ form.provinceName }}{{ form.cityName }}{{ form.district }}{{ form.location }}</el-form-item>
            <el-form-item label="入驻时间：" >{{ form.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
            <h3>企业资质</h3>
            <el-collapse accordion style="width: 50%;margin-bottom: 22px" v-if="form.qualificationsDTOList">
              <el-collapse-item v-for="(item,index) in form.qualificationsDTOList" :key="index">
                <template slot="title">
                  {{item.qualificationsName}}
                  <span style="color: red;flex: 1;">{{ item.check?'*':'' }}</span>
                  <div v-if="item.extraInfo!=null" style="display: flex;align-items: center">
                    <el-image
                        class="min_icon"
                        :src="form.qualificationsDTOList[index].qualificationsPath[0]"></el-image>
                    <span>
                      {{item.status == 0?'待审核':item.status == 1?'审核通过':item.status == 2?'审核不通过':''}}
                    </span>
                    <i class="el-icon-success right_icon"></i>
                  </div>
                </template>
                <div  style="background-color: #f5f5f5;padding:10px;color: #606266">
                  <el-form  :model="item" ref="refForms" :rules="rulesForm">
                    <div class="enterpriseName"><span class="star">*</span><span>企业名称：</span>{{form.enterpriseName}}</div>
                    <el-form-item :prop="item.check==1?'qualificationsNumber':''" :label="`${item.nameInfo}：`"  label-width="110px" class="qualificationsNumber" v-if="item.nameId!=23">
											<span v-if="item.status == 1">{{item.qualificationsNumber}}</span>
                      <el-input v-model="item.qualificationsNumber" :placeholder="`请输入${item.nameInfo}`" clearable style="width:400px"  v-else></el-input>
                    </el-form-item>
                    <div v-if="isChecked && item.nameId == 17" class="expiryDate"><div class="name"><span class="star">*</span>证书有效期：</div>证件长期有效</div>
										<el-form-item label="证书有效期："  :prop="item.check==1?'expiryDate':''" label-width="110px"  v-else>
											<span v-if="item.status == 1">
												{{item.expiryDate}}
											</span>
											<el-date-picker
													v-else
													:readonly="item.status == 1?true:false"
													style="width: 400px"
													v-model='item.expiryDate'
													value-format="yyyy-MM-dd"
													type="date"
													clearable
													placeholder="请选择证件有效期时间">
											</el-date-picker>
										</el-form-item>
                    <el-form-item  label="有效期：" label-width="110px" v-if="item.nameId == 17 && item.status == 0 || item.status == 2">
                      <el-checkbox v-model="isChecked" @change="checkHandle(index)" :disabled="item.status == 1?true:false">证件长期有效</el-checkbox>
                    </el-form-item>
                    <el-form-item label="资质证书：" label-width="110px">
                      <template v-if="item.qualificationsPath.length>0">
                        <el-image
                            v-for="(items,index) in item.qualificationsPath"
                            :key="index"
                            style="width: 100px;margin-right: 10px;"
                            :src="items"
                            :preview-src-list="item.qualificationsPath">
                        </el-image>
                      </template>
                      <el-image
                          v-else
                          style="width: 100px; text-align:center;height: 100px;line-height: 100px;font-size: 18px;background: #F5F7FA;color: #C0C4CC;;position: absolute;top: 0;margin-left: 20px">
                        <div slot="error" class="image-slot">
                          &nbsp;<i class="el-icon-picture-outline"></i>&nbsp;
                          <span>暂无图片</span>
                        </div>
                      </el-image>
                    </el-form-item>
                    <div style="margin-top: 10px;margin-left: 110px;">
                      <el-button type="primary" @click="updateEnterpriseInfo(item.expiryDate,item.qualificationsNumber,item.valueId,index)" v-if="item.status != 1">保存</el-button>
                    </div>
                  </el-form>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div v-if="form.status == 0" style="margin: 22px 0;">
              <el-button type="primary" @click="pass('enterprise')">通过</el-button>
              <el-button @click="reject('enterprise')">拒绝</el-button>
            </div>
            <el-form-item v-if="form.status == 2" label="拒绝原因：">
              <span style="color: red">{{form.content}}</span>
            </el-form-item>
            <el-form-item v-if="form.status != 0" label="审核时间：" >
              {{form.auditTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
            </el-form-item>
            <el-form-item v-if="form.status == 1" label="企业状态：" >
              企业入驻成功
            </el-form-item>
        </el-form><br>
        <h2 v-if="form.bindApply!=undefined && form.bindApply.length>0">法人/负责人</h2>
        <div  v-for="(item,index) in form.bindApply" :key="index">
          <el-row>
            <el-col :span="22">
              <div><span>姓名：</span>{{ item.contacts }}</div><br>
              <div><span>手机号：</span>{{ item.mobileNumber }}</div><br>
              <div><span>身份证：</span>{{ item.idCode }}</div><br>
              <div><span>申请时间：</span>{{ item.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}</div>
            </el-col>
            <el-col :span="2">
              <el-button  type="primary"  :disabled="form.status == 1?false:true" @click="form.status == 1?frAudit(item.bindApplyId):''" v-if="item.status == 0">通过</el-button>
            </el-col>
          </el-row>
          <el-divider/>
        </div>
      <el-button @click="$router.back(-1)" >返回</el-button>
    </el-card>
</template>

<script>
    import {credentialsInfo,auditEnterprise,auditBindEnterprise,updateEnterpriseInfo } from '@/api/enterprise'
    export default {
        data() {
            return {
                form:{},
                rulesForm: {
                  expiryDate: [
                    {required: true, message: '有效期不能为空', trigger: 'blur'},
                  ],
                  qualificationsNumber: [
                    {required: true, message: '统一社会信用代码不能为空', trigger: 'blur'},
                  ],
                },
                rulesReject2: {
                  auditContent: [
                    {required: true, message: '拒绝原因不能为空', trigger: 'blur'},
                  ],
                },

              isChecked:false
            }
        },
        created(){
            this.enterpriseId = this.$route.params.enterpriseId;
            this.dataRequest();
        },
        beforeRouteLeave(to, from, next) {
            // 设置下一个路由的 meta
            to.meta.keepAlive = false;
            next();
        },
        methods: {
          // 页面数据加载
          dataRequest (){
              credentialsInfo({enterpriseId:this.enterpriseId}).then(res =>{
                  if(res.returnCode == 'ERR_0000') {
                    this.isChecked = res.data.qualificationsDTOList.some(item=>{
                      return item.expiryDate == null && item.nameId == 17
                    })
                    console.log(this.isChecked )
                    this.form = res.data;
                  }
              })
          },
          //证件长期有效-check
          checkHandle(index) {
            this.form.qualificationsDTOList[index].expiryDate= this.isChecked ? "":this.form.qualificationsDTOList[index].expiryDate;
          },
          //企业编号有效期更改
          updateEnterpriseInfo(expiryDate,qualificationsNumber,valueId,index){
              this.$refs['refForms'][index].validate(valid => {
                  if (valid) {
                      updateEnterpriseInfo({
                        expiryDate,qualificationsNumber,valueId
                      }).then(res => {
                        this.$message({
                          message: '已保存',
                          type: 'success'
                        });
                        this.dataRequest();
                      })
                  }
              })
          },
          //认证详情-审核通过
          pass(val){
              if(val == "enterprise"){
                  auditEnterprise({enterpriseId:this.form.enterpriseId,auditStatus:1,auditContent: ''}).then(res =>{
                      if(res.returnCode == 'ERR_0000'){
                          //this.$router.go(-1)
                          this.dataRequest();
                      }
                  })
              }
          },
          //认证详情-拒绝审核
          reject(val){
            const that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: '拒绝原因',
                message: h('div', {
                  attrs: {
                    class: 'el-textarea',
                  },
                }, [
                  h('textarea', {
                  attrs: {
                    class: 'el-textarea__inner',
                    autocomplete: 'off',
                    maxlength:"50",
                    rows: 4,
                    id:'commentContent'
                  },
                  on: { input: that.onCommentInputChange }
                })
              ]),
              dangerouslyUseHTMLString: true,
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  if (!this.form.auditContent) {
                    this.$message.error('拒绝原因不能为空');
                    return false
                  }else{
                    if(val == "enterprise") {
                      auditEnterprise({
                        enterpriseId: this.form.enterpriseId,
                        auditStatus: 2,
                        auditContent: this.form.auditContent
                      }).then(res => {
                        console.log(res)
                        if (res.returnCode == 'ERR_0000') {
                          this.dataRequest();
                          done();
                          this.form.auditContent =""
                        }
                      })
                    }
                  }
                  document.getElementById("auditContent").value = ""
                }else{
                  console.log("弹出框已关闭")
                  done()
                  document.getElementById("auditContent").value = ""
                }
              }
            });
          },
          onCommentInputChange() {
            this.form.auditContent = document.getElementById("commentContent").value;
          },
          //查看详情
          handleDetail(row){
              this.state = '企业详情'
              this.dialogFormVisible_detail = true;
                  credentialsInfo({'enterpriseId':row.enterpriseId}).then(res =>{
                      if(res.returnCode == 'ERR_0000') {
                          this.form = res.data;
                      }
                  })
          },
          //法人审核
          frAudit(bindApplyId){
            this.$confirm('确定通过该申请人?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              auditBindEnterprise({bindApplyId,auditStatus:1,auditContent:''}).then(res =>{
                if(res.returnCode == 'ERR_0000') {
                  this.dataRequest()
                }
              })
            }).catch(() => {
              console.log("取消操作")
            });

          }
        },
    }
</script>
<style scoped>
>>>.el-form-item__content {
  margin-left: 0!important;
}
>>>.el-image-viewer__wrapper {
  left: 50%!important;
}
>>>.el-form-item__content {
  margin-right: 0!important;
  margin-left: 0!important;
  display: flex;
  align-items: center;
}
>>>.qualificationsNumber {
  display: flex;
  align-items: center;
}
>>>.qualificationsNumber .el-form-item__label {
  line-height: 20px;
}
>>>.el-row {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 20px;
}
.min_icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 6px;
}
.right_icon {
  font-size: 16px;
  color: #10B3FB;
  float:right;
  margin-right: 6px;
  margin-left: 6px;
}
.expiryDate {
  color: #333;
  margin-bottom: 22px;
}
 .star {
  color: #f56c6c;
  margin-right: 4px;
}
.expiryDate .name {
  width: 100px;
  display: inline-block;
  text-align: right;
  color: #606266;
  margin: 0 12px 0 0;
}
.enterpriseName {
  margin-bottom: 22px;
}
.enterpriseName .name {
  display: inline-block;
  width: 110px;
  padding: 0 12px 0 0;
  text-align: right;
}
</style>