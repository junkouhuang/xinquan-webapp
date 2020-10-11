<template>
    <el-card shadow="never" class="mt20">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" >
            <el-form-item label="企业名称:">
                {{form.enterpriseName}}
            </el-form-item>
            <el-form-item label="企业地址:">
                {{form.provinceName}}{{form.cityName}}{{form.district}}{{form.location}}
            </el-form-item>
            <el-form-item label="申请人姓名:">
                {{form.userName}}
            </el-form-item>
            <el-form-item label="申请人电话:">
                {{form.mobileNumber}}
            </el-form-item>
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
                    <div class="enterpriseName"><div class="name"><span class="star">*</span>企业名称：</div>{{form.enterpriseName}}</div>
                    <el-form-item :prop="item.check==1?'qualificationsNumber':''" :label="`${item.nameInfo}：`"  label-width="110px" class="qualificationsNumber" v-if="item.nameId!=23">
                      <!--<el-input v-model="item.qualificationsNumber" :placeholder="`请输入${item.nameInfo}`" clearable style="width:400px"  :readonly="form.status == 0?false:true"></el-input>-->
                      {{item.qualificationsNumber}}
                    </el-form-item>
                    <div v-if="isChecked && item.nameId == 17" class="expiryDate"><div class="name"><span class="star">*</span>证书有效期：</div>证件长期有效</div>
                    <el-form-item label="证书有效期："  :prop="item.check == 1?'expiryDate':''" label-width="110px"  v-else>
                      {{item.expiryDate}}
                     <!-- <el-date-picker
                          :readonly="form.status == 0?false:true"
                          style="width: 400px"
                          v-model='item.expiryDate'
                          value-format="yyyy-MM-dd"
                          type="date"
                          clearable
                          placeholder="请选择证件有效期时间">
                      </el-date-picker>-->
                    </el-form-item>
                    <!--<el-form-item  label="有效期：" label-width="110px" v-if="item.nameId == 17">
                      <el-checkbox v-model="isChecked" @change="checkHandle(index)" :readonly="form.status == 0?false:true">证件长期有效</el-checkbox>
                    </el-form-item>-->
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
                  </el-form>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-form-item label="企业备案号：" style="width: 50%">
              <el-input placeholder="请输入企业备案号" v-model="form.erpId" :readonly="form.status == 0?false:true"></el-input>
            </el-form-item>
            <div v-if="form.status == 0" style="margin: 22px 0;">
              <el-button type="primary" @click="pass('enterprise')">通过</el-button>
              <el-button @click="reject('enterprise')">拒绝</el-button>
            </div>
            <el-form-item v-if="form.status == 1" label="拒绝原因：" style="width: 50%;">
              <span style="color: red">{{form.auditOpinion}}</span>
            </el-form-item>
            <el-form-item v-if="form.status != 0" label="审核时间：" >
              {{form.auditTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
            </el-form-item>
            <el-form-item v-if="form.status == 1" label="企业状态：" >
              企业入驻成功
            </el-form-item>
          </el-form><br>
          <el-button @click="$router.back(-1)" >返回</el-button>
    </el-card>
</template>

<script>
    import { credentialInfo,audit  } from '@/api/build'

    export default {
        data() {
            return {
                form: {},
                form3:{},
                rules: {
                    auditOpinion: [
                        {required: true, message: '拒绝原因不能为空', trigger: 'blur'},
                    ],
                },
                rulesForm: {
                  expiryDate: [
                    {required: true, message: '有效期不能为空', trigger: 'blur'},
                  ],
                  qualificationsNumber: [
                    {required: true, message: '统一社会信用代码不能为空', trigger: 'blur'},
                  ],
                },
                auditContent:'',
                enterpriseId:'',
                id:'',
                isChecked:false
            }
        },

        created(){
          this.enterpriseId = this.$route.params.enterpriseId;
          this.id = this.$route.params.id;
          this.dataRequest();
        },
        beforeRouteLeave(to, from, next) {
            // 设置下一个路由的 meta
            to.meta.keepAlive = false;
            next();
        },
        methods: {
            // 页面数据加载
            dataRequest(){
                credentialInfo({enterpriseId:this.enterpriseId,id:this.id}).then(res =>{
                    if(res.returnCode == 'ERR_0000') {
                      this.isChecked = res.data.qualificationsDTOList.some(item=>{
                        return item.expiryDate == null && item.nameId == 17
                      })
                      console.log(this.isChecked )
                      this.form = res.data
                    }
                })
            },

            //认证详情-审核通过
            pass(){
              // if(!this.form.erpId){
              //   this.$message.error('企业备案号不能为空');
              //   return false
              // }
              audit({id: this.form.id, enterpriseId:this.form.enterpriseId,erpId:this.form.erpId, status: 2}).then(res =>{
                if(res.returnCode == 'ERR_0000'){
                  this.$router.go(-1);
                }
              })
              /*this.$prompt('请输入企业备案号', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S+/,
                inputErrorMessage: '企业备案号不能为空'
              }).then(({ value }) => {
                audit({id: this.form.id, enterpriseId:this.form.enterpriseId,erpId:value, status: 2}).then(res =>{
                  if(res.returnCode == 'ERR_0000'){
                    this.$router.go(-1);
                  }
                })
              }).catch(() => {

              });*/
            },
            //认证详情-拒绝审核
            reject(){
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
                      id:'auditContent'
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
                    if (!this.auditContent) {
                      this.$message.error('拒绝原因不能为空');
                      return false
                    }else{
                      audit({
                          id: this.form.id,
                          enterpriseId:this.form.enterpriseId,
                          erpId:this.form.erpId,
                          status: 1,
                          auditOpinion: this.auditContent
                        }).then(res => {
                          console.log(res)
                          if (res.returnCode == 'ERR_0000') {
                           this.$router.go(-1);
                          }
                        })
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
              this.auditContent = document.getElementById("auditContent").value;
            },
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
