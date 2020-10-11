<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
        <h4>基本信息</h4>
        <el-form-item label="会员号:" required>{{form.authUserId}}</el-form-item>
        <el-form-item label="用户名:" required>{{form.authUserName}}</el-form-item>
        <el-form-item label="手机号:" required>{{form.authUserPhone}}</el-form-item>
        <el-form-item label="所属企业:" required><span v-for="(item,index) in form.enterpriseNameList" :key="index">{{item.enterpriseName}}<br/></span></el-form-item>
        <h4>实名认证信息</h4>
        <el-form-item label="提交时间:" required>{{form.authTime | datefmt('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
        <el-form-item label="真实姓名:" required>{{form.authRealName}}</el-form-item>
        <el-form-item label="身份证:" required>{{form.authIdCardNo}}</el-form-item>
        <el-form-item label="" required>
          <el-row>
            <el-col :xs="6" :sm="5" :md="4" :lg="3" :xl="2">
              <p>身份证正面照</p>
              <el-image
                      v-if="form.authIdCardFront"
                      style="width: 100px; height: 100px"
                      :src="form.authIdCardFront"
                      :preview-src-list="[`${form.authIdCardFront}`]">
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
            <el-col :xs="6" :sm="5" :md="4" :lg="3" :xl="2">
              <p>身份证背面照</p>
              <el-image
                      v-if="form.authIdCardBack"
                      style="width: 100px; height: 100px"
                      :src="form.authIdCardBack"
                      :preview-src-list="[`${form.authIdCardBack}`]">
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
            <el-col :xs="6" :sm="5" :md="4" :lg="3" :xl="2">
              <p>手持身份证照</p>
              <el-image
                      v-if="form.authIdCardHandheld"
                      style="width: 100px; height: 100px"
                      :src="form.authIdCardHandheld"
                      :preview-src-list="[`${form.authIdCardHandheld}`]">
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
        <el-form-item prop="description" v-if="form.status == 0">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" style="margin-top: 10px"  >
            <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入拒绝原因"
                    maxlength="50"
                    show-word-limit
                    v-model="form.description">
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <p  v-if="form.status == 2">拒绝原因：<span style="color: red">{{form.description}}</span></p>
          <p  v-if="form.status == 1 || form.status == 2">审核时间：{{form.auditTime | datefmt('YYYY-MM-DD HH:mm:ss') }}</p>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { findById,updateStatus} from '@/api/authentication'


export default {
  data() {
    return {
      form:{},
      rules: {
        description: [{required: true, message: '拒绝原因不能为空', trigger: 'blur'}],
      },
    }
  },
  created(){
    this.dataRequest(this.$route.params.authId);
  },
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    to.meta.keepAlive = false;
    next();
  },
  methods: {
    //认证详情-审核通过
    pass(){
      updateStatus({authId:this.form.authId,status:1,description:''}).then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.$router.go(-1)
        }
      })
    },
    //认证详情-拒绝审核
    reject(){
      this.$refs['ruleForm'].validate(valid => {
        if(valid){
          updateStatus({authId: this.form.authId, status: 2, description: this.form.description}).then(res => {
            if (res.returnCode == 'ERR_0000') {
              this.$router.go(-1)
            }
          })
        }
      })
    },
    //查看详情
    dataRequest(authId){
      this.state = '实名认证详情'
      this.dialogFormVisible_detail = true;
      findById({authId}).then(res =>{
        if(res.returnCode == 'ERR_0000') {
          this.form = res.data
        }
      })
    },
  },
}
</script>
