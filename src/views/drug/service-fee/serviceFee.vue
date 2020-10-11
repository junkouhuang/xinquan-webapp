<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form label-width="80px" :model="query" ref="searchForm">
        <el-row :gutter="20">
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="经营企业" prop="orgId">
              <el-select placeholder="输入经营企业" v-model="query.orgId" filterable clearable>
                <el-option
                  v-for="item in orgOptions"
                  :key="item.enterpriseId"
                  :label="item.enterpriseName"
                  :value="item.enterpriseId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="客户名称" prop="customerName">
              <el-input placeholder="输入客户名称" v-model="query.customerName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="服务类型" prop="serviceType">
              <el-select placeholder="请选择服务费类型" v-model="query.serviceType" style="width: 100%" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in serviceTypeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="商品批号" prop="batchNo">
              <el-input placeholder="输入商品批号" v-model="query.batchNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="商品编号" prop="drugId">
              <el-input placeholder="输入商品编号" v-model="query.drugId" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="商品名称" prop="name">
              <el-input placeholder="输入商品名称" v-model="query.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_drug_service_fee_search'" @click="getList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_drug_service_fee_setting'" @click="handleAdd">服务费设置</el-button>
          <el-button type="danger" v-has="'res_drug_service_fee_batch_delete'" @click="handleDeleteSelected">批量删除</el-button>
        </div>
        <div class="header-keywords-input pull-right">
          <el-input placeholder="输入关键词搜索" v-model="searchKeyword" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>

      <el-table
        stripe
        :data="tableData.list"
        @selection-change="changeSelection"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          width="80">
          <template slot-scope="scope">
            {{ tableData.total - scope.$index - ((query.pageNum - 1) * query.pageSize) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="enterpriseName"
          sortable
          label="经营企业">
        </el-table-column>
        <el-table-column
          prop="serviceType"
          sortable
          label="服务费类型">
          <template slot-scope="scope">
            {{ scope.row.serviceType | serviceType }}
          </template>
        </el-table-column>
        <el-table-column
          prop="serviceRate"
          sortable
          label="服务费率（%）">
          <template slot-scope="scope">
            <span style="color:#ff9b04;font-weight:bold;">
              {{ Math.floor(scope.row.serviceRate * 10000)/100 }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="customerName"
          sortable
          label="客户名称">
        </el-table-column>
        <el-table-column
          prop="drugId"
          sortable
          label="商品编号">
           <template slot-scope="scope">
            {{ scope.row.drugId }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          sortable
          label="商品">
           <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
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
          prop="spec"
          sortable
          label="规格">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          sortable
          label="更新时间" width="140">
          <template slot-scope="scope">
            {{ scope.row.updateTime | datefmt('YYYY-MM-DD HH:mm')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateBy"
          sortable
          label="维护人">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-has="'res_drug_service_fee_detail'" content="编辑" placement="top">
              <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_drug_service_fee_delete'" content="删除" placement="top">
              <el-button class="reset-icon" @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ tableData.total }} 条</span>
          <span>，共 {{ tableData.pages }} 页</span>
          <span>，{{ tableData.pageSize }} 条/页</span>
        </div>
        <el-pagination
          background
          @current-change="changePageNum"
          @size-change="changePageSize"
          :current-page="tableData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="tableData.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="tableData.total">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      :title="this.editvisiable ? '编辑服务费' : '服务费设置'"
      :visible.sync="dialogVisible"
      width="70%" style="margin-top:0px;">
      <el-form ref="serviceFeeForm" :model="form" :rules="serviceFeeRules" label-width="80px">
        <el-form-item label="经营企业" prop="orgId" style="max-width: 600px">
          <el-select placeholder="请选择经营企业" v-model="form.orgId" @change="orgChange" filterable clearable >
            <el-option
              v-for="item in orgOptions"
              :key="item.enterpriseId"
              :label="item.enterpriseName"
              :value="item.enterpriseId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="this.editvisiable" label="服务类型" prop="serviceType" style="max-width: 600px">
          <el-radio v-for="item in serviceTypeData" v-model="form.serviceType" @change="changeType" disabled 
                :key="item.id"
                :label="item.id"
                :value="item.id">
                {{item.name}}
          </el-radio>
        </el-form-item>
        <el-form-item v-else label="服务类型" prop="serviceType" style="max-width: 600px">
          <el-radio v-for="item in serviceTypeData" v-model="form.serviceType" @change="changeType"  
                :key="item.id"
                :label="item.id"
                :value="item.id">
                {{item.name}}
          </el-radio>
        </el-form-item>
        <el-form-item label="服务费率" prop="serviceRate" placeholder="请输入服务费率" style="max-width: 600px">
          <el-input-number v-model="serviceRate" :precision="2" 
          :step="0.01" :min="0.01" :max="20"></el-input-number>
          <span style="margin-left:10px;">% &nbsp;&nbsp;（比例值区间限制0-20）</span>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerId" style="max-width: 600px" v-if="this.customerVisible">
          <el-select placeholder="请输入客户名称" v-model="form.customerId" @change="customerChange" filterable clearable >
            <el-option
              v-for="item in customerOptions"
              :key="item.enterpriseId"
              :label="item.enterpriseName"
              :value="item.enterpriseId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择品种" prop="drugs" placeholder="" v-if="!this.editvisiable && this.drugVisible">
          <span style="color:#E6A23C;font-size:12px;">
            品种服务费每次最多可批量设置60条商品品种
          </span><br/>
          <el-card class="box-card" shadow="always">
            <div slot="header" class="clearfix">
              <div>
                <el-button @click="toggleSelection()">取消选择</el-button>
                <el-input placeholder="搜索您的商品（默认隐藏）" v-model="drugName" style="margin-left:10px;max-width: 210px" @keyup.enter.native="drugDataList" clearable></el-input>
                <i class="el-icon-search" style="margin-left:10px;" @click="drugDataList"></i>
              </div>
            </div>
            <div>
              <el-table ref="multipleTable"
                :data="drugData.list"
                tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="drugNo" label="商品编号" width="250"></el-table-column>
                <el-table-column prop="name" label="商品名称" width="250"></el-table-column>
                <el-table-column prop="enterpriseName" label="经营企业" width="250"> </el-table-column>
                <el-table-column prop="licenseNo" label="批准文号"></el-table-column>
                <el-table-column prop="batchNo" label="批号"></el-table-column>
                <el-table-column prop="spec" label="规格"></el-table-column>
              </el-table>
            </div>
            <div style="margin-top: 20px">
              <div class="pagination-count">
                <span>共 {{ drugData.total }} 条</span>
                <span>，共 {{ drugData.pages }} 页</span>
                <span>，{{ drugData.pageSize }} 条/页</span>
              </div>
              <el-pagination
                background
                @current-change="changeDrugPageNum"
                @size-change="changeDrugPageSize"
                :current-page="drugData.pageNum"
                :page-sizes="[6, 12, 30, 60]"
                :page-size="drugData.pageSize"
                layout="sizes, prev, pager, next, jumper"
                :total="drugData.total">
              </el-pagination>
            </div>
          </el-card>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="blue" v-if="this.editvisiable" v-has="'res_drug_service_fee_save'" @click="handleConfirm">确 定</el-button>
        <el-button type="blue" v-if="!this.editvisiable" v-has="'res_drug_service_fee_setting'" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
        drugId: '',
        name: '',
        orgId: '',
        batchNo: '',
        serviceType: '',
        customerName: '',
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        list: []
      },
      dialogVisible: false,
      form: {
        drugs: [],
      },
      serviceRate: 10,
      orgOptions: [] ,
      customerOptions: [],
      serviceTypeData: [],
      drugData: {
        list: []
      },
      pageNum: 1,
      pageSize: 6,
      drugName: '',
      drugVisible: true,
      customerVisible: true,
      selectedPackage: [],
      editvisiable: false,
      serviceFeeRules: {
        orgId: [
          { required: true, message: '请选择经营企业', trigger: 'change' }
        ],
        serviceType: [
          { required: true, message: '请选择服务费类型', trigger: 'blur' }
        ],
        customerId: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ]
      },  
      multipleSelection: []
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  filters: {
    serviceType(val) {
      if (val ===  0) {
        return "客户服务费";
      } else if (val === 1) {
        return "品种服务费";
      }
    },
  },
  created() {
    this.serviceTypeList()
    this.orgList()
    this.customerList()
    this.getList()
  },
  methods: {
    changeType(selVal) {
      if (selVal === 0) {
        this.drugVisible = false;
        this.customerVisible = true;
      } else if (selVal === 1) {
        this.drugVisible = true;
        this.customerVisible = false;
        this.form.customerId = '';
      }
    },
    orgChange(val) {
        if (val == '') {
          return;
        }
        this.form.orgName = this.orgOptions.find(val=>val.enterpriseId == this.form.orgId).enterpriseName;
        this.drugDataList()
    },
    customerChange(val) {
        if (val == '') {
          return;
        }
        this.form.customerName = this.customerOptions.find(val=>val.enterpriseId == this.form.customerId).enterpriseName;
    },
    drugDataList() {
      if (this.form.orgName == null || this.form.orgName == '') {
        this.$message.error('请选择经营企业')
      }
      let formData = new FormData()
      formData.append('name', this.drugName)
      formData.append('enterpriseName', this.form.orgName)
      formData.append('pageNum', this.pageNum)
      formData.append('pageSize', this.pageSize)
      this.axios.post('/ydh/drug/list', formData).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.drugData = res.data
        }
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.form.drugs = val;
    },
    serviceTypeList() {
      var params = {}
      this.axios.get('/common/service/fee/type',{params}).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.serviceTypeData = res.data
        }
      })
    },
    orgList() {
      var params = {
        pageNum: 1,
        pageSize: 100000
      }
      this.axios.get('/ydh/mall/enterprise/list', {params}).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.orgOptions = res.data.list
          }
      })
    },
    customerList() {
      var params = {
        pageNum: 1,
        pageSize: 100000
      }
      // TODO 展示所有的企业客户
      this.axios.get('/ydh/mall/enterprise/list', {params}).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.customerOptions = res.data.list
          }
      })
    },
    getList() {
      this.searchKeyword = ''
      let formData = new FormData()
      formData.append('drugId', this.query.drugId)
      formData.append('name', this.query.name)
      formData.append('orgId', this.query.orgId)
      formData.append('batchNo', this.query.batchNo)
      formData.append('serviceType', this.query.serviceType)
      formData.append('customerName', this.query.customerName)
      formData.append('pageNum', this.query.pageNum)
      formData.append('pageSize', this.query.pageSize)
      this.axios.post('/ydh/serviceRate/selectList', formData).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.tableData = res.data
        }
      })
    },
    handleAdd() {
      this.form = {
        enable: true
      }
      this.dialogType = 'add'
      this.dialogVisible = true
      this.editvisiable = false
    },
    handleEdit(row) {
      this.editvisiable = true
      let formData = new FormData()
      formData.append('id', row.id)
      this.axios.post('/ydh/serviceRate/preview', formData).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.dialogType = 'edit'
          this.dialogVisible = true
          this.form = {
            id: res.data.id,
            orgId: res.data.enterpriseId,
            orgName: res.data.enterpriseName,
            serviceType: res.data.serviceType,
            serviceRate: res.data.serviceRate * 100,
            customerId: res.data.customerId,
            customerName: res.data.customerName,
          }
          this.serviceRate = res.data.serviceRate * 100
          if (res.data.serviceType == 0) {
            this.customerVisible = true
            this.drugVisible = false
          } else if (res.data.serviceType == 1) {
            this.drugVisible = true
            this.customerVisible = false
            this.drugDataList()
          }
        }
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.getList()
    },
    changeSelection(val) {
      this.selectedPackage = val
    },
    handleConfirm() {
      this.editvisiable = false
      this.$refs['serviceFeeForm'].validate(valid => {
        if (!valid) return
        if (this.dialogType == 'add') {
          if (this.form.serviceType == 1 
            && (this.form.drugs == null || this.form.drugs.length < 1)) {
            this.$message.error('请选择商品品种')
            return;
          } 
          if (this.form.drugs != null && this.form.drugs.length > 60) {
            this.$message.error('品种服务费单次最多可批量设置60条商品品种')
            return;
          }
          let formData = {
            'enterpriseId': this.form.orgId,
            'enterpriseName': this.form.orgName,
            'serviceType': this.form.serviceType,
            'serviceRate': this.serviceRate,
            'customerId': this.form.customerId,
            'customerName': this.form.customerName,
            'drugs': this.form.drugs,
          }
          if (this.form.drugs == null || this.form.drugs.length < 1) {
            formData.drugs = []
          }
          this.axios.post('/ydh/serviceRate/add', formData).then(res => {
            if (res.returnCode == 'ERR_0000') {
              this.$message({
                message: '设置添加成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getList()
              this.$refs.multipleTable.clearSelection();
            } else if (res.returnCode == 'ERR_0001') {
              this.$message.error(res.returnMsg)
            } else {
              this.$message.error('设置添加失败')
            }
          })
        } else if (this.dialogType == 'edit') {          
          let formData = {
            'id': this.form.id,
            'enterpriseId': this.form.orgId,
            'enterpriseName': this.form.orgName,
            'serviceType': this.form.serviceType,
            'serviceRate': this.serviceRate,
            'customerId': this.form.customerId,
            'customerName': this.form.customerName,
          }
          this.axios.post('/ydh/serviceRate/update', formData).then(res => {
            if (res.returnCode == 'ERR_0000') {
              this.$message({
                message: '设置更新成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getList()
            } else {
              this.$message.error('设置更新失败')
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
      this.$confirm("确定要删除选中的服务费设置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = []
        this.selectedPackage.forEach(item => {
          ids.push(item.id)
        })
        this.axios.post('/ydh/serviceRate/deleteBatch', ids).then(res => {
          if (res.returnCode == "ERR_0000") {
            this.$message({
              message: "设置删除成功",
              type: "success"
            })
            this.getList()
          }
        })
      })
    },
    handleDelete(row) {
      this.$confirm(`确定删除该服务费设置？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        ids.push(row.id)
        this.axios.post('/ydh/serviceRate/deleteBatch', ids).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$message({
              message: '设置删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message.error('设置删除失败')
          }
        })
      }).catch(() => {})
    },
    handleCancel() {
      this.dialogVisible = false
      this.form = {}
    },
    changePageSize(num) {
      this.query.pageSize = num
      this.getList()
    },
    changePageNum(page) {
      this.query.pageNum = page
      this.getList()
    },
    changeDrugPageSize(num) {
      this.pageSize = num
      this.drugDataList()
    },
    changeDrugPageNum(page) {
      this.pageNum = page
      this.drugDataList()
    }
  }
}
</script>
