<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" >
        <el-form-item label="受理时间" prop="acceptTime">
          <el-date-picker
                v-model="form.acceptTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                clearable
                placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="受理类型" prop="acceptType" style="max-width: 320px">
          <el-select placeholder="选择受理类型" v-model="form.acceptType" clearable>
            <el-option v-for="item in acceptanceTypesData"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="受理人" prop="acceptPerson" style="max-width: 320px">
          <el-select placeholder="选择受理人" v-model="form.acceptPerson" filterable clearable>
            <el-option v-for="item in operatorData"
                :key="item.accountName"
                :label="item.realName"
                :value="item.accountName">
                <span style="float: left">{{ item.realName }}</span>
                <span style="float: left; padding-left:20px;color:#C0C4CC;font-size: 13px">{{ item.accountName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维护人" prop="operator" style="max-width: 320px">
          <el-select placeholder="选择维护人" v-model="form.operator" filterable clearable>
            <el-option v-for="item in operatorData"
                :key="item.accountName"
                :label="item.realName"
                :value="item.accountName">
                <span style="float: left">{{ item.realName }}</span>
                <span style="float: left; padding-left:20px;color:#C0C4CC;font-size: 13px">{{ item.accountName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型" prop="customerType" style="max-width: 600px">
          <el-select placeholder="选择客户类型" v-model="form.customerType" style="max-width: 600px;" filterable clearable>
            <el-option v-for="item in customerTypesData"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="customerName" style="max-width: 600px">
          <el-input v-model="form.customerName" type="text" maxlength="200" placeholder="输入联系人" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="customerPhone" style="max-width: 600px">
          <el-input v-model="form.customerPhone" maxlength="11" placeholder="输入联系方式" clearable></el-input>
        </el-form-item>
        <el-form-item label="反馈信息" prop="question" style="max-width: 600px">
          <el-input v-model="form.question" type="textarea" maxlength="200" placeholder="输入反馈信息" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否解决" prop="resolveStatus">
          <el-radio v-model="form.resolveStatus" :label="1">是</el-radio>
          <el-radio v-model="form.resolveStatus" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="处理方式" prop="solution" style="max-width: 600px">
          <el-input v-model="form.solution" type="textarea" maxlength="200" placeholder="输入处理方式" ></el-input>
        </el-form-item>
        <el-form-item label="处理时间" prop="dealTime">
          <el-date-picker
                  v-model="form.dealTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  clearable
                  placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务类型" prop="questionCategory" style="max-width: 600px">
          <el-select placeholder="选择任务类型" v-model="form.questionCategory" style="max-width: 220px;" clearable>
            <el-option v-for="item in problemCategoryData"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
          </el-select>
          <span style="margin-left:15px;">
            <el-radio v-for="item in problemLevelsData" prop="questionLevel" v-model="form.questionLevel"
                :key="item.id"
                :label="item.id"
                :value="item.value">
                {{item.name}}
            </el-radio>
          </span>
        </el-form-item>
        <el-form-item label="任务状态" prop="serviceStatus">
          <el-radio v-for="item in serviceStatusData" v-model="form.serviceStatus"
              :key="item.id"
              :label="item.id"
              :value="item.value">
              {{item.name}}
          </el-radio>
        </el-form-item>
        <el-form-item label="服务方式" prop="serviceMethod">
          <el-radio v-for="item in serviceMethodsData" v-model="form.serviceMethod"
              :key="item.id"
              :label="item.id"
              :value="item.value">
              {{item.name}}
          </el-radio>
        </el-form-item>
        <el-form-item label="完成时间" prop="finishTime">
          <el-date-picker
                  v-model="form.finishTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  clearable
                  placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item><br/><br/>
        <el-form-item>
          <el-button @click="$router.push({path: '/minle/order'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/api/minle/order"
export default {
  components: {

  },
  data() {
    return {
    form: {
      acceptTime: '',
      acceptType: '',
      acceptPerson: '',
      operator: '',
      customerType: '',
      customerName: '',
      customerPhone: '',
      question: '',
      resolveStatus: '',
      solution: '',
      dealTime: '',
      questionCategory: '',
      questionLevel: '',
      serviceStatus: '',
      serviceMethod: '',
      finishTime: '',
    },
    customerTypesData: [],
    serviceMethodsData: [],
    serviceStatusData: [],
    problemCategoryData: [],
    problemLevelsData: [],
    acceptanceTypesData: [],
    operatorData: [],
    };
  },
  created() {
    this.customerTypesRequest()
    this.serviceStatusRequest()
    this.serviceMethodsRequest()
    this.problemCategoryRequest()
    this.problemLevelsRequest()
    this.acceptanceTypesRequest()
    this.queryRequest()
    this.operatorRequest()
  },
  mounted() {

  },
  methods: {
    operatorRequest() {
      request.operatorFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.operatorData = res.data
        }
      })
    },
    customerTypesRequest() {
      request.customerTypesFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.customerTypesData = res.data
        }
      })
    },
    serviceStatusRequest() {
      request.serviceStatusFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.serviceStatusData = res.data
        }
      })
    },
    serviceMethodsRequest() {
      request.serviceMethodsFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.serviceMethodsData = res.data
        }
      })
    },
    problemCategoryRequest() {
      request.problemCategoryFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.problemCategoryData = res.data
        }
      })
    },
    problemLevelsRequest() {
      request.problemLevelsFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.problemLevelsData = res.data
        }
      })
    },
    acceptanceTypesRequest() {
      request.acceptanceTypesFB({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.acceptanceTypesData = res.data
        }
      })
    },
    queryRequest() {
      const that = this;
      request.detail(this.$route.params.id).then(res => {
        if (res.returnCode == "ERR_0000") {
          that.form = res.data
        }
      });
    },
  }
};
</script>
