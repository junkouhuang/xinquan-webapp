<template>
    <el-card shadow="never" class="mt20">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="证件审核" name="first">
          <el-form>
              <h3>企业信息</h3>
              <el-form-item label="企业名称：" >{{ form.enterpriseName }}</el-form-item>
              <el-form-item label="企业类型：" >{{ form.modeName }}</el-form-item>
              <el-form-item label="企业地址：" >{{form.provinceName}}{{form.cityName}}{{form.district}}{{ form.location }}</el-form-item>
              <el-form-item label="入驻时间：" >{{ form.auditTime | datefmt('YYYY-MM-DD HH:mm')}}</el-form-item>
              <h3>法人/负责人</h3>
              <div v-for="(item,index) in form.bindApply" :key="index">
                <el-form-item label="姓名：" >{{ item.contacts }}</el-form-item>
                <el-form-item label="手机号：" >{{ item.mobileNumber }}</el-form-item>
                <el-form-item label="身份证：" >{{ item.idCode }}</el-form-item>
                <el-form-item label="申请时间：" >{{ item.createTime | datefmt('YYYY-MM-DD HH:mm')}}</el-form-item>
              </div>
              <h3>企业资质</h3>
              <el-collapse accordion style="width: 50%;margin-bottom: 22px" v-if="form.qualificationsDTOList">
                <el-collapse-item v-for="(item,index) in form.arr1" :key="index">
                  <template slot="title">
                    {{item.qualificationsName}}
                    <span style="color: red;flex: 1;">{{ item.check == 1?'*':'' }}</span>
                    <div style="display: flex;align-items: center">
                      <el-image
                          class="min_icon"
                          :src="item.qualificationsPath[0]"></el-image>
                      <span v-if="item.status==1 && item.expiryStatus==0">
                        <!--状态通常只用两种，审核通过或者已过期-->
                        审核通过
                      </span>
                      <span v-else-if="item.status==1 && item.expiryStatus==1" style="color: red">
                        <!--状态通常只用两种，审核通过或者已过期-->
                        已&nbsp;&nbsp;过&nbsp;期
                      </span>
                      <span v-else>
                        <!--状态通常只用两种，审核通过或者已过期-->
                        状态有误
                      </span>
                      <i class="el-icon-success right_icon"></i>
                    </div>
                  </template>
                  <div  style="background-color: #f5f5f5;padding:10px;color: #606266">
                    <el-form  :model="item" ref="refForms" :rules="rulesForm">
                      <div class="enterpriseName"><div class="name"><span class="star">*</span>企业名称：</div>{{form.enterpriseName}}</div>
                      <el-form-item :prop="item.check==1?'qualificationsNumber':''" :label="`${item.nameInfo}：`"  label-width="110px" class="qualificationsNumber" v-if="item.nameId !=23">
                        {{item.qualificationsNumber}}
                      </el-form-item>
                      <div v-if="isChecked && item.nameId == 17" class="expiryDate"><div class="name"><span class="star">*</span>证书有效期：</div>证件长期有效</div>
                      <el-form-item label="证书有效期："  :prop="item.check == 1?'expiryDate':''" label-width="110px"  v-else>
                        {{item.expiryDate | datefmt('YYYY-MM-DD') }}
                      </el-form-item>
                      <el-form-item label="资质证书：" label-width="110px">
                        <template v-if="item.qualificationsPath">
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
              <h4 v-if="form.arr2!==undefined && form.arr2.length>0">证件变更待审核</h4>
              <el-collapse accordion style="width: 50%;margin-bottom: 22px" v-if="form.arr2">
                <el-collapse-item v-for="(item,index) in form.arr2" :key="index">
                  <template slot="title">
                    {{item.qualificationsName}}
                    <span style="color: red;flex: 1;">{{ item.check == 1?'*':'' }}</span>
                    <div  style="display: flex;align-items: center">
                      <el-image
                          class="min_icon"
                          :src="item.qualificationsPath[0]"></el-image>
                      <span>
                          <!--状态通常只用两种，审核通过或者已过期-->
                          {{item.status==0?'待审核':item.status==1?'审核通过':item.status==2?'审核不通过':item.status==3?'已过期':'状态有误'}}
                        </span>
                      <i class="el-icon-success right_icon"></i>
                    </div>
                  </template>
                  <div  style="background-color: #f5f5f5;padding:10px;color: #606266">
                    <el-form  :model="item" ref="refForms" :rules="rulesForm">
                      <div class="enterpriseName"><div class="name"><span class="star">*</span>企业名称：</div>{{form.enterpriseName}}</div>
                      <el-form-item :prop="item.check==1?'qualificationsNumber':''" :label="`${item.nameInfo}：`"  label-width="110px" class="qualificationsNumber">
                        <el-input v-model="item.qualificationsNumber" :placeholder="`请输入${item.nameInfo}`" clearable style="width:400px" :disabled="item.status==1?true:false"></el-input>
                      </el-form-item>
                      <div v-if="isChecked2" class="expiryDate"><div class="name"><span class="star">*</span>证书有效期：</div>证件长期有效</div>
                      <el-form-item label="证书有效期："  :prop="item.check == 1?isChecked?'':'expiryDate':''" label-width="110px"  v-else>
                        <el-date-picker
                            style="width: 400px"
                            v-model='item.expiryDate'
                            value-format="yyyy-MM-dd"
                            type="date"
                            clearable
                            :prop="isChecked?'':'expiryDate'"
                            placeholder="请选择证件有效期时间">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item  label="有效期：" label-width="110px" v-if="item.nameId == 17">
                        <el-checkbox v-model="isChecked2" @change="checkHandle(index)">证件长期有效</el-checkbox>
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
                      <div style="margin-top: 10px;margin-left: 110px;" v-if="item.status ==0">
                        <el-button type="primary" @click="auditCredentials(item,index)" >通过</el-button>
                        <el-button @click="reject(item.id,item.enterpriseId,item.expiryDate,item.qualificationsNumber,index)" >拒绝</el-button>
                      </div>
                    </el-form>
                  </div>
                </el-collapse-item>
              </el-collapse>
          </el-form>
          <!--<el-button type="primary" @click="passFun" v-if="form.arr2.length>0">通过</el-button>-->
          <!--<el-button @click="reject" v-if="form.arr2.length>0">拒绝</el-button>-->
        </el-tab-pane>
        <el-tab-pane label="证件变更记录" name="second">
          <el-button :type="status == 1 ?'primary':''" @click="passHandle(1)">通过</el-button>
          <el-button :type="status == 2 ?'primary':''" @click="passHandle(2)">不通过</el-button>
          <el-collapse accordion style="width: 50%;margin-bottom: 22px;margin-top: 22px" v-if="auditList.length>0" class="record">
            <el-collapse-item v-for="(item,index) in auditList" :key="index">
              <template slot="title">
                <div style="display: flex;flex-direction: row;width: 100%;">
                  <span>{{item.qualificationsName}}</span><!--<span style="float: right;flex: 1;margin-right: 100px">提交时间：{{item.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}</span>-->
                  <span style="color: red;flex: 1;">{{ item.check?'*':'' }}</span>
                  <div style="display: flex;align-items: center;flex:1;justify-content: flex-end;">
                    <el-image
                        class="min_icon"
                        :src="item.imgUrlList[0]"></el-image>
                    <template v-if="item.status==1">
                      审核通过
                    </template>
                    <span v-if="item.status==2" style="color: red">
                      不通过
                    </span>
                    <i class="el-icon-success right_icon"></i>
                  </div>
                </div>
                <div style="position: absolute;bottom: 10px;">
                  提交时间：{{item.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}
                </div>
              </template>
              <div  style="background-color: #f5f5f5;padding:10px;color: #606266">
                <el-form  :model="item" ref="refForms" :rules="rulesForm">
                  <div class="enterpriseName"><div class="name"><span class="star">*</span>企业名称：</div>{{form.enterpriseName}}</div>
                  <el-form-item :prop="item.check==1?'qualificationsNumber':''" :label="`${item.nameInfo}：`"  label-width="110px" class="qualificationsNumber">
                    {{item.qualificationsNumber}}
                  </el-form-item>
                  <div v-if="item.nameId == 17 && !item.expiryDate" class="expiryDate"><div class="name"><span class="star">*</span>证书有效期：</div>证件长期有效</div>
                  <el-form-item label="证书有效期："  label-width="110px"  v-else>
                    {{ item.expiryDate | datefmt('YYYY-MM-DD')}}
                  </el-form-item>
                  <el-form-item label="资质证书图片：" label-width="110px">
                    <template v-if="item.imgUrlList.length>0">
                      <el-image
                          v-for="(items,index) in item.imgUrlList"
                          :key="index"
                          style="width: 100px;margin-right: 10px;"
                          :src="items"
                          :preview-src-list="item.imgUrlList">
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
                  <el-form-item label="拒绝原因："  label-width="110px"  v-if="item.status == 2">
                    <span  style="color: red">{{item.remark}}</span>
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>

          <el-pagination  @current-change="pageChange"
                          @size-change="sizeChange"
                          background
                          :current-page="pageNum"
                          :page-sizes="[10,20,50,100]"
                          :page-size="pageSize"
                          layout="sizes, prev, pager, next , jumper"
                          :total="total"
                          style="float: right">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
      <br/>
      <el-button @click="$router.back(-1)" >返回</el-button>
    </el-card>
</template>

<script>
    import {changeTheDetails,auditCredentials,list } from '@/api/credentials'
    export default {
      data() {
        return {
          activeName: 'first',
          form: {},
          auditList: {},
          pageSize: 10,
          pageNum: 1,
          status: 1,
          total: 0,
          auditContent: '',
          rulesForm: {
            expiryDate: [
              {required: true, message: '有效期不能为空', trigger: 'blur'},
            ],
            qualificationsNumber: [
              {required: true, message: '统一社会信用代码不能为空', trigger: 'blur'},
            ],
          },
          isChecked: false,
          isChecked2:false,
        }
      },
      created() {
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
        dataRequest() {
          changeTheDetails({enterpriseId: this.enterpriseId}).then(res => {
            if (res.returnCode == 'ERR_0000') {
              let arr1 = new Array();
              let arr2 = new Array();
              res.data.qualificationsDTOList.forEach(item => {
                if (item.id) {
                  arr2.push(item)
                  let some = arr2.some(item=>{
                    return item.nameId == 17 && !item.expiryDate
                  })
                  this.isChecked2 = some;
                } else {
                  arr1.push(item)
                  let some = arr1.some(item=>{
                    return item.nameId == 17 && !item.expiryDate
                  })
                  this.isChecked = some;
                }
              })
              res.data.arr1 = arr1;
              res.data.arr2 = arr2;
              this.form = res.data;
            }
          })
        },
        //审核记录列表
        listHandle() {
          list({
            enterpriseId: this.enterpriseId,
            pageSize: this.pageSize,
            pageNum: this.pageNum,
            status: this.status
          }).then(res => {
            if (res.returnCode == 'ERR_0000') {
              this.auditList = res.data.list;
              this.total = res.data.total;
            }
          })
        },
        //通过/不通过
        passHandle(status) {
          this.status = status;
          this.listHandle();
        },
        //改变页数
        pageChange(val) {
          this.pageNum = val
          this.listHandle()
        },
        //改变每页条数
        sizeChange(val) {
          this.pageSize = val
          this.listHandle()
        },
        //证件长期有效-check
        checkHandle(index) {
          this.form.qualificationsDTOList[index].expiryDate = this.isChecked2 ? "" : this.form.qualificationsDTOList[index].expiryDate;
        },
        //tab切换
        handleClick(e) {
          if (e.index == 0) {
            this.dataRequest();
          }
          if (e.index == 1) {
            this.listHandle();
          }
        },
        //企业编号有效期审核-通过
        auditCredentials(item, index) {
          let {id, enterpriseId, expiryDate, qualificationsNumber} = item;//.id,item.enterpriseId,item.expiryDate,item.qualificationsNumber
          this.$refs['refForms'][index].validate(valid => {
            console.log(valid)
            if (valid) {
              auditCredentials({
                id, enterpriseId, expiryDate, qualificationsNumber, remark: '', auditStatus: 1
              }).then(res => {
                if (res.returnCode == "ERR_0000") {
                  this.$message({
                    message: '已通过',
                    type: 'success'
                  });
                  this.dataRequest();
                }else{
                  this.$message.error(res.returnMsg)
                }
              })
            }
          })
        },
        ////企业编号有效期审核-拒绝
        reject(id, enterpriseId, expiryDate, qualificationsNumber, index) {
          console.log("-----")
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
                  maxlength: "50",
                  rows: 4,
                  id: 'auditContent'
                },
                on: {input: that.onCommentInputChange}
              })
            ]),
            dangerouslyUseHTMLString: true,
            inputPlaceholder:'请输入拒绝原因',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S+/,
            inputErrorMessage: '拒绝原因不能为空',
            beforeClose: (action, instance, done) => {
              debugger
              if (action === 'confirm') {
                if (!this.auditContent) {
                  this.$message.error('拒绝原因不能为空');
                  document.getElementById("auditContent").value = "";
                  return false
                } else {
                  this.$refs['refForms'][index].validate(valid => {
                    if (valid) {
                      auditCredentials({
                        id, enterpriseId, expiryDate, qualificationsNumber, remark: this.auditContent, auditStatus: 2
                      }).then(res => {
                        if (res.returnCode == "ERR_0000") {
                          this.$message({
                            message: '已拒绝',
                            type: 'success'
                          });
                          this.dataRequest();
                          done();
                        }else{
                          this.$message.error(res.returnMsg);
                          done();
                        }
                      })
                    }
                  })
                }

              } else {
                done()
                document.getElementById("auditContent").value = "";
              }
            }
          });
        },
        onCommentInputChange() {
          this.auditContent = document.getElementById("auditContent").value;
          console.log(this.auditContent)
        },
      }
    }
</script>
<style scoped>
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
      color: #606266;
      margin-bottom: 22px;
    }
    .expiryDate .star {
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
    .star {
      color: #f56c6c;
      margin-right: 4px;
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
    >>>.el-collapse {
      border: none;
    }
    >>>.record .el-collapse-item__header {
      height: 70px;
      line-height: 24px;
      position: relative;
    }
</style>
