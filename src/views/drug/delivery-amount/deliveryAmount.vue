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
            <el-form-item label="配送省份" prop="provinceId">
               <el-select placeholder="请选择配送省份" v-model="query.provinceId" @change="provinceChange"  filterable clearable>
                <el-option
                        v-for="item in provinceOptions"
                        :key="item.id"
                        :label="item.provinceName"
                        :value="item.id">
                </el-option>
               </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item label="配送城市" prop="cityId">
               <el-select placeholder="请选择配送城市" v-model="query.cityId" @change="cityChange" filterable clearable>
                <el-option
                        v-for="item in cityOptions"
                        :key="item.id"
                        :label="item.cityName"
                        :value="item.id">
                </el-option>
               </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-form-item  label="配送地区" prop="regionId">
               <el-select placeholder="请选择配送地区（区县）" v-model="query.regionId" filterable clearable>
                <el-option
                        v-for="item in areaOptions"
                        :key="item.id"
                        :label="item.district"
                        :value="item.id">
                </el-option>
               </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
            <el-button type="blue" v-has="'res_drug_delivery_amt_search'" @click="getList">查 询</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <div class="pull-left">
          <el-button type="blue" v-has="'res_drug_delivery_amt_setting'" @click="handleAdd">配送金额设置</el-button>
          <el-button type="danger" v-has="'res_drug_delivery_amt_batch_delete'" @click="handleDeleteSelected">批量删除</el-button>
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
          label="经营企业" width="260">
        </el-table-column>
        <el-table-column
          prop="type"
          sortable
          label="收费类型">
          <template slot-scope="scope">
            {{ scope.row.type | type}}
          </template>
        </el-table-column>
        <el-table-column
          prop="minimumPurchasePrice"
          sortable
          label="起配送金额（最低）" >
          <template slot-scope="scope">
            <span style="color:#ff9b04;font-weight:bold;">
              RMB {{ scope.row.minimumPurchasePrice }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="province"
          sortable
          label="配送省份">
        </el-table-column>
        <el-table-column
          prop="city"
          sortable
          label="配送城市">
        </el-table-column>
        <el-table-column
          prop="region"
          sortable
          label="配送地区（区县）">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          sortable
          label="更新时间">
          <template slot-scope="scope">
            {{ scope.row.updateTime | datefmt('YYYY-MM-DD HH:mm')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateBy"
          sortable
          label="维护人">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-has="'res_drug_delivery_amt_detail'" content="编辑" placement="top">
              <el-button class="reset-icon" @click="handleEdit(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-has="'res_drug_delivery_amt_delete'" content="删除" placement="top">
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
      :title="this.editvisiable ? '编辑配送金额' : '配送金额设置'"
      :visible.sync="dialogVisible"
      width="35%" style="margin-top:0px;">
      <el-form ref="deliveryAmtForm" :model="form" :rules="deliveryAmtRules" label-width="80px">
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
        <el-form-item label="收费类型" prop="type">
          <el-radio v-for="item in serviceTypeData" v-model="form.type" @change="changeType" 
                :key="item.id"
                :label="item.id"
                :value="item.id">
                {{item.name}}
          </el-radio>
        </el-form-item>
        <el-form-item label="配送省份" prop="provinceId" v-if="selArea" style="max-width: 600px">
           <el-input v-if="this.editvisiable" placeholder="" v-model="form.province" clearable disabled></el-input>
           <el-select v-else placeholder="请选择配送省份" v-model="form.provinceId"  @change="provinceChange"  filterable clearable>
            <el-option
                    v-for="item in provinceOptions"
                    :key="item.id"
                    :label="item.provinceName"
                    :value="item.id">
            </el-option>
           </el-select>
        </el-form-item>
        <el-form-item label="配送城市" prop="cityId" v-if="selArea" style="max-width: 600px">
           <el-input v-if="this.editvisiable" placeholder="" v-model="form.city" clearable disabled></el-input>
           <el-select v-else placeholder="请选择配送城市" v-model="form.cityId" @change="cityChange" filterable clearable>
            <el-option
                    v-for="item in cityOptions"
                    :key="item.id"
                    :label="item.cityName"
                    :value="item.id">
            </el-option>
           </el-select>
        </el-form-item>     
        <el-form-item  label="配送地区" prop="regionId" v-if="selArea" style="max-width: 600px">
           <el-input v-if="this.editvisiable" placeholder="" v-model="form.region" clearable disabled></el-input>
           <el-select v-else placeholder="请选择配送地区（区县）" v-model="form.regionId" @change="regionChange" filterable clearable>
            <el-option
                    v-for="item in areaOptions"
                    :key="item.id"
                    :label="item.district"
                    :value="item.id">
            </el-option>
           </el-select>
        </el-form-item>
        <el-form-item label="起配金额" prop="deliveryAmount" placeholder="请输入最低起配金额" style="max-width: 600px">
          <el-input-number v-model="deliveryAmount" :precision="2" 
          :step="1" :min="0" :max="100000"></el-input-number>
          <span style="margin-left:10px;"> &nbsp;&nbsp;（起配送金额范围限制 0-100000）</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="blue" v-if="this.editvisiable" v-has="'res_drug_delivery_amt_save'" @click="handleConfirm">确 定</el-button>
        <el-button type="blue" v-if="!this.editvisiable" v-has="'res_drug_delivery_amt_setting'" @click="handleConfirm">确 定</el-button>
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
        orgId: '',
        provinceId: '',
        cityId: '',
        regionId: '',
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        list: []
      },
      dialogVisible: false,
      form: {
        
      },
      deliveryAmount: 1000,
      orgOptions: [] ,
      selectedPackage: [],
      editvisiable: false,
      provinceOptions: [],
      cityOptions: [],
      areaOptions: [],
      serviceTypeData: [],
      selArea: true,
      deliveryAmtRules: {
        orgId: [
          { required: true, message: '请选择经营企业', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择配送费类型', trigger: 'change' }
        ],
      },  
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    }
  },
  filters: {
    type(val) {
      if (val ===  0) {
        return "默认配送费（缺省区域）";
      } else if (val === 1) {
        return "区域配送费";
      }
    },
  },
  created() {
    this.orgList()
    this.provinceRequest()
    this.getList()
    this.serviceTypeList() 
  },
  methods: {
    serviceTypeList() {
      var params = {}
      this.axios.get('/common/delivery/amt/types',{params}).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.serviceTypeData = res.data
        }
      })
    },
    changeType(selVal) {
      if (selVal === 0) {
        this.selArea = false
      } else if (selVal === 1) {
        this.selArea = true
      }
    },
    orgChange(val) {
        if (val == '') {
          return;
        }
        this.form.orgName = this.orgOptions.find(val=>val.enterpriseId == this.form.orgId).enterpriseName;
    },
    provinceRequest() {
      var params = {
        'country': 1
      }
      this.axios.get('/common/province/display', {params}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.provinceOptions = res.data
        }
      })
    }, 
    cityRequest(province) {
      var params = {
        'country': 1,
        'province': province
      }
      this.axios.get('/common/city/display', {params}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.cityOptions = res.data        
        }
      })
    }, 
    areaRequest(city) {
      var params = {
        'city': city
      }
      this.axios.get('/common/area/display', {params}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.areaOptions = res.data
        }
      })
    }, 
    // 改变省份
    provinceChange(val){
      if (val == '') {
        return;
      }
      this.form.province = this.provinceOptions.find(val=>val.id == this.form.provinceId).provinceName;
      this.cityRequest(val)
    },
    cityChange(val){
      if (val == '') {
        return;
      }
      this.form.city = this.cityOptions.find(val=>val.id == this.form.cityId).cityName;
      this.areaRequest(val)
    },  
    regionChange(val) {
      if (val == '') {
        return;
      }
      this.form.region = this.areaOptions.find(val=>val.id == this.form.regionId).district;
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
    getList() {
      this.searchKeyword = ''
      let formData = new FormData()
      formData.append('enterpriseId', this.query.orgId)
      formData.append('provinceId', this.query.provinceId)
      formData.append('cityId', this.query.cityId)
      formData.append('regionId', this.query.regionId)
      formData.append('pageNum', this.query.pageNum)
      formData.append('pageSize', this.query.pageSize)
      this.axios.post('/ydh/shop/findList', formData).then(res => {
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
    },
    handleEdit(row) {
      this.editvisiable = true
      let formData = new FormData()
      formData.append('id', row.shopId)
      this.axios.post('/ydh/shop/preview', formData).then(res => {
        if (res.returnCode == 'ERR_0000') {
          this.dialogType = 'edit'
          this.dialogVisible = true
          this.form = {
            id: res.data.shopId,
            orgId: res.data.enterpriseId,
            provinceId: res.data.provinceId,
            province: res.data.province,
            cityId: res.data.cityId,
            city: res.data.city,
            regionId: res.data.regionId,
            region: res.data.region,
            deliveryAmount: res.data.deliveryAmount,
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
      this.form.deliveryAmount = this.deliveryAmount
      this.$refs['deliveryAmtForm'].validate(valid => {
        if (!valid) return
        if (this.dialogType == 'add') {  
          if (this.deliveryAmount == null || this.deliveryAmount == '' || this.deliveryAmount < 0) {
            this.$message.error('请设置最低起配送金额')
            return;
          }
          if (this.form.type == 1 && (this.form.provinceId == null && this.form.cityId == null && this.form.regionId == null)) {
            this.$message.error('请选择配送区域省、市或区县')
            return;
          }       
          let formData = {
            'enterpriseId': this.form.orgId,
            'enterpriseName': this.form.orgName,
            'provinceId': this.form.provinceId,
            'province': this.form.province,
            'cityId': this.form.cityId,
            'city': this.form.city,
            'regionId': this.form.regionId,
            'region': this.form.region,
            'minimumPurchasePrice': this.deliveryAmount,
            'type': this.form.type,
          }
          this.axios.post('/ydh/shop/add', formData).then(res => {
            if (res.returnCode == 'ERR_0000') {
              this.$message({
                message: '设置添加成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.selArea = true
              this.getList()
            } else if (res.returnCode == 'ERR_0001') {
              if (!formData.type) {
                this.$message.error(formData.enterpriseName+ ' 默认起配送金额已配置，请勿重复设置')
              } else if (formData.type) {
                this.$message.error(formData.enterpriseName +' 该区域起配送金额已配置，请勿重复设置')
              }
            } else {
              this.$message.error('设置添加失败')
            }
          })
        } else if (this.dialogType == 'edit') {        
          if (this.deliveryAmount == null || this.deliveryAmount == '' || this.deliveryAmount < 0) {
            this.$message.error('请设置最低起配送金额')
            return;
          }  
          let formData = {
            'shopId': this.form.id,
            'minimumPurchasePrice': this.deliveryAmount,
          }
          this.axios.post('/ydh/shop/update', formData).then(res => {
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
      this.$confirm("确定要删除选中的配送费设置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = []
        this.selectedPackage.forEach(item => {
          ids.push(item.shopId)
        })
        this.axios.post('/ydh/shop/deleteBatch', ids).then(res => {
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
      this.$confirm(`确定删除该地区配送费设置？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        ids.push(row.shopId)
        this.axios.post('/ydh/shop/deleteBatch', ids).then(res => {
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
  }
}
</script>
