<template>
  <div>
    <el-row :gutter="20" class="mt20">
      <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}" style="width:70%;">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>业绩视图（客户统计）</span>
            <el-button v-if="account.type == 1" style="float: right; padding: 3px 0; color:#C0C4CC;" type="text">{{ account.organizationName}}</el-button>
            <el-button v-else style="float: right; padding: 3px 0" type="text">客户统计图表</el-button>
          </div>
          <div>
            <highcharts :options="chartOptions"></highcharts>
          </div>
        </el-card>
      </el-col>
      <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}" style="width:30%;">
        <el-card class="box-card" shadow="never" style="height:300px;">
          <div slot="header" class="clearfix">
            <span>业绩统计（累计客户总数）</span>
            <el-button v-if="account.type == 1" style="float: right; padding: 3px 0;color:#C0C4CC;" type="text">{{ account.organizationName}}</el-button>
            <el-button v-else style="float: right; padding: 3px 0" type="text">客户统计数</el-button>
          </div>
          <div>
            <el-row :gutter="12">   
              <el-col :span="12">
                <el-card shadow="hover" class="sales">
                  <span class="sales-label">今日业绩</span>
                  <span class="sales-number today">{{ this.teamSales.todayNumber }}</span>
                </el-card>
              </el-col>          
              <el-col :span="12">
                <el-card shadow="hover" class="sales">
                  <span class="sales-label">昨日业绩</span>
                  <span class="sales-number yesterday">{{ this.teamSales.yesterdayNumber }}</span>
                </el-card>
              </el-col> 
              <el-col :span="12">
                <el-card shadow="hover" style="margin-top:10px;" class="sales">
                  <span class="sales-label">本周业绩</span>
                  <span class="sales-number week">{{ this.teamSales.weekNumber }}</span>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card shadow="hover" style="margin-top:10px;" class="sales">
                  <span class="sales-label">本月业绩</span>
                  <span class="sales-number month">{{ this.teamSales.monthNumber }}</span>
                </el-card>
              </el-col>    
              <el-col :span="12">
                <el-card shadow="hover" style="margin-top:10px;" class="sales">
                  <span class="sales-label">总业绩</span>
                  <span class="sales-number total">{{ this.teamSales.total }}</span>
                </el-card>
              </el-col>   
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card" shadow="never" style="height:230px;margin-top:10px;">
          <div slot="header" class="clearfix">
            <span>合伙人统计（总）</span>
            <el-button v-if="account.type == 1" style="float: right; padding: 3px 0;color:#C0C4CC;" type="text">{{ account.organizationName}}</el-button>
            <el-button v-else style="float: right; padding: 3px 0" type="text">合伙人统计数</el-button>
          </div>
          <div>
            <el-row :gutter="12">   
              <el-col :span="12">
                <el-card shadow="hover" class="sales">
                  <span class="sales-label">区域合伙人</span>
                  <span class="sales-number total">{{ this.partnerData[0] }}</span>
                </el-card>
              </el-col>          
              <el-col :span="12">
                <el-card shadow="hover" class="sales">
                  <span class="sales-label">省级合伙人</span>
                  <span class="sales-number total">{{ this.partnerData[1] }}</span>
                </el-card>
              </el-col> 
              <el-col :span="12">
                <el-card shadow="hover" style="margin-top:10px;" class="sales">
                  <span class="sales-label">市级合伙人</span>
                  <span class="sales-number total">{{ this.partnerData[2] }}</span>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card shadow="hover" style="margin-top:10px;" class="sales">
                  <span class="sales-label">业务推广员</span>
                  <span class="sales-number today">{{ this.partnerData[3] }}</span>
                </el-card>
              </el-col> 
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card shadow="never" class="mt20" >
      <div slot="header" class="clearfix" >
        <div class="pull-left">
          <el-form :model="query" ref="searchForm" label-width="75px">
            <el-row :gutter="20">
              <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                <el-form-item label="业务员" prop="partnerName" >
                  <el-input v-model="query.partnerName" placeholder="输入业务员姓名" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                <el-form-item label="手机号" prop="mobilePhone" >
                  <el-input v-model="query.mobilePhone" placeholder="输入业务员手机号" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                <el-form-item label="代理级别" prop="salesmanType">
                  <el-select placeholder="请选择合伙人代理级别" v-model="query.salesmanType" style="max-width: 600px;" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in levelData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}">
                <el-form-item label="经营企业" prop="orgId">
                  <el-select placeholder="请选择经营企业" v-model="query.orgId" style="max-width: 600px;"  filterable clearable>
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
                <el-form-item label="选择省份" prop="provinceId">
                   <el-select placeholder="请选择省份" v-model="query.provinceId" @change="provinceChange"  filterable clearable>
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
                <el-form-item label="选择城市" prop="cityId">
                   <el-select placeholder="请选择城市" v-model="query.cityId" @change="cityChange" filterable clearable>
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
                <el-form-item  label="选择地区" prop="regionId">
                   <el-select placeholder="请选择地区" v-model="query.regionId" filterable clearable>
                    <el-option
                            v-for="item in areaOptions"
                            :key="item.id"
                            :label="item.district"
                            :value="item.id">
                    </el-option>
                   </el-select>
                </el-form-item>
              </el-col>
              <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}" >
                <el-form-item label="关键词" >
                  <el-input placeholder="输入关键词搜索" v-model="searchKeyword">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xl="{span: 5}" :lg="{span: 8}" :sm="{span: 12}" >
                <el-button type="blue" v-has="'res_partner_sales_search'" @click="loadCoursePackage">查 询</el-button>
                <el-button type="green" v-has="'res_partner_sales_export'" @click="handleExports">导出业绩</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <el-table
        :data="packageData.list"
        stripe
        @selection-change="changeSelection"
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          width="60">
          <template slot-scope="scope">
            {{ packageData.total - scope.$index - ((query.pageNum - 1) * query.pageSize) }}
          </template>
        </el-table-column>
        <el-table-column
                prop="partnerName"
                label="业务员">
        </el-table-column>
        <el-table-column
                prop="partnerMobile"
                label="手机号">
        </el-table-column>
        <el-table-column
                prop="partnerType"
                label="合伙人类型" >
                <template slot-scope="scope">
                  {{ scope.row.partnerType | partnerType }}
                </template>
        </el-table-column>
        <el-table-column
          prop="enterpriseName"          
          label="经营企业">
        </el-table-column>
        <el-table-column
                prop="salesmanType"           
                label="代理级别" >
                <template slot-scope="scope">
                  {{ scope.row.salesmanType | salesmanType }}
                </template>
        </el-table-column>
        <el-table-column
                prop="partnerAddress"
                label="区域" >
        </el-table-column>
        <el-table-column
          prop="yesterdayNumber"
          sortable
          label="昨日业绩">
          <template slot-scope="scope">
            <span v-if="scope.row.yesterdayNumber" class="sale-number">{{ scope.row.yesterdayNumber }}</span>
            <span v-else>{{ scope.row.yesterdayNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="todayNumber"
          sortable
          label="今日业绩">
          <template slot-scope="scope">
            <span v-if="scope.row.todayNumber" class="sale-number">{{ scope.row.todayNumber }}</span>
            <span v-else>{{ scope.row.todayNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="weekNumber"
          sortable
          label="本周业绩">
          <template slot-scope="scope">
            <span v-if="scope.row.weekNumber" class="sale-number">{{ scope.row.weekNumber }}</span>
            <span v-else>{{ scope.row.weekNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="monthNumber"
          sortable
          label="本月业绩">
          <template slot-scope="scope">
            <span v-if="scope.row.monthNumber" class="sale-number">{{ scope.row.monthNumber }}</span>
            <span v-else>{{ scope.row.monthNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          sortable
          label="总业绩（累计）">
          <template slot-scope="scope">
            <span v-if="scope.row.total" class="sale-number">{{ scope.row.total }}</span>
            <span v-else>{{ scope.row.total }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ packageData.total }} 条</span>
          <span>，共 {{ packageData.pages }} 页</span>
          <span>，{{ packageData.pageSize }} 条/页</span>
        </div>

        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          :total="packageData.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>

<script>
import request from "@/api/agent/sales"
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
export default {
  data() {
    return {
      searchKeyword: '',
      query: {
        partnerName: '',
        mobilePhone: '',
        salesmanType: '',
        orgId: '',
        orgName: '',
        provinceId: '',
        cityId: '',
        regionId: '',
        pageNum: 1,
        pageSize: 10,
      },
      account: {},
      levelData: [],
      orgOptions: [] ,//机构列表
      provinceOptions: [],
      cityOptions: [],
      areaOptions: [],
      teamSales: {},
      packageData: [],
      selectedPackage: [],
      partnerData: [],
      chartOptions: {
        chart: {
          type: 'line',
          height: 440,
          zoomType: 'xy',
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          title: {
            text: '客户统计（总）'
          }
        },
        legend: { //调整分类
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        },
        tooltip: { //提示信息
          crosshairs: true,
          shared: true
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          line: {
            marker: {
              radius: 4,
              //lineColor: '#666666',
              lineWidth: 1
            },
            dataLabels: {
              // 开启数据标签
              enabled: true          
            },
            // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            enableMouseTracking: true
          }
        },
        series: [{
          name: '区域合伙人',
          data: []
        }, {
          name: '省级合伙人',
          data: []
        },{
          name: '市级合伙人',
          data: []
        },{
          name: '业务推广员',
          data: []
        }],
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      },
    }
  },
  watch: {
    searchKeyword: function(val) {
      this.utils.searchKeyword(val)
    },
  },
  filters: {
    partnerType(val){
      if (val === '0') {
        return "平台合伙人"
      } else if (val === '1') {
        return "企业合伙人"
      }
    },
    salesmanType(val){
      if (val === '0') {
        return "区域合伙人"
      } else if (val === '1') {
        return "省级合伙人"
      } else if (val === '2') {
        return "市级合伙人"
      } else if (val === '3') {
        return "业务推广员"
      } 
    },
  },
  created() {
    this.queryTeamSales()
    this.loadCoursePackage()
    this.levelRequest()
    this.orgList()
    this.provinceRequest()
    this.queryAccount()
    this.querySalesData()
    Highcharts.setOptions({
      lang: {
        printChart: '打印图表',
        downloadPNG: '导出 PNG图片',
        downloadJPEG: '导出 JPEG图片',
        downloadPDF: '导出 PDF文档',
        downloadSVG: '导出 SVG矢量图',
        resetZoom: '重置缩放比例',
      }
    });
  },
  mounted(){
    exportingInit(Highcharts)
  },
  methods: {
    queryTeamSales() {
      request.queryTeamSales({}).then(res => {
        this.teamSales = res.data
      })
    },
    loadCoursePackage() {
      this.searchKeyword = ''
      request.list(this.query).then(res => {
        this.packageData = res.data
        this.queryTeamSales()
      })
    },
    querySalesData() {
      request.salesData({}).then(res => {
        this.chartOptions.series[0].data = res.data.region
        this.chartOptions.series[1].data = res.data.province
        this.chartOptions.series[2].data = res.data.city
        this.chartOptions.series[3].data = res.data.salesman
        this.chartOptions.xAxis.categories = res.data.month
        this.partnerData = res.data.partners
      })
    },
    queryAccount() {
      // 获取账号信息
      this.$store.dispatch('fetchAccountInfo').then(res => {
        this.account = res
      })
    },
    handleReset() {
      this.$refs["searchForm"].resetFields()
      this.queryDate = ''
      this.loadCoursePackage()
    },
    // 修改分页显示数
    changePageSize(num) {
      this.query.pageSize = num
      this.loadCoursePackage()
    },
    // 切换分页
    changePageNum(page) {
      this.query.pageNum = page
      this.loadCoursePackage()
    },
    changeSelection(val) {
      this.selectedPackage = val
    },
    orgList(){
      request.queryOrgRequest({
        pageNum: 1,
        pageSize: 100000
      }).then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.orgOptions = res.data.list
        }
      })
    },
    levelRequest() {
      request.levelData({}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.levelData = res.data
        }
      })
    },  
    provinceRequest() {
      request.queryProvinceRequest({'country':1}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.provinceOptions = res.data
        }
      })
    }, 
    cityRequest(province) {
      request.queryCityRequest({'country':1, 'province': province}).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.cityOptions = res.data        
        }
      })
    }, 
    areaRequest(city) {
      request.queryAreaRequest({'city':city}).then(res => {
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
      this.cityRequest(val)
    },
    cityChange(val){
      if (val == '') {
        return;
      }
      this.areaRequest(val)
    },
    handleClick(tab, event) {
        
    },
    handleExports(){
      request.exportsData({'orgId':this.query.orgId}).then(res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
        let objectUrl = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = objectUrl
        link.style.display = 'none'
        link.download = 'AGT_SALES_TR_' + new Date().getTime()
        link.click()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pc-pane > div {
  margin-bottom: 20px;
}
.pc-header {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}
.pc-time {
  text-align: right;
}
.pc-img {
  width: 100%;
  min-height: 300px;
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
.iphone-pane {
  width: 65%;
  margin: 0 auto;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.iphone-pane div {
  padding: 10px;
}
.iphone-header {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.iphone-img {
  width: 100%;
  min-height: 200px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="scss">
.article-preview {
  .el-tabs--border-card {
    box-shadow: none;
    border: none;
  }
  .el-tabs--border-card > .el-tabs__header{
    background: none;
    border-bottom: none;
  }
  .el-tabs__nav{
    background-color: #f5f7fa;
    border: 1px solid #e4e7ed;
  }
}
.sales {
  .sales-label {
    width:30%;
    color:#606266;
  }
  .sales-number {
    float:right;
    text-align:right;
    font-weight:bold;
    font-size:18px;
  }
  .today {
    color:#F56C6C;
  }
  .week {
    color:#409EFF;
  }
  .month {
    color:#E6A23C;
  }
  .yesterday {
    color:#67C23A;
  }
  .total {
    color:#606266;
  }
}
.sale-number {
    font-weight:bold;
  }
</style>
