<template>
  <div>
    <el-row :gutter="20" class="mt20">
      <el-col :xl="{span: 6}" :lg="{span: 8}" :sm="{span: 12}" style="width:70%;">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>客户统计视图</span>
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
            <span>客户统计（累计客户总数）</span>
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

  </div>
</template>

<script>
import request from "@/api/home"
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
export default {
  data() {
    return {      
      account: {},   
      teamSales: {},    
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
    
  },
  filters: {
    
  },
  created() {
    this.queryTeamSales()
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
