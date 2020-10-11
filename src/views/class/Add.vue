<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加班级</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="ruleForm" :rules="rules" ref="classForm" label-width="100px" style="max-width: 600px" >
        <el-form-item label="所属机构" prop="organizationId">
          <select-org @change="changeOrg" style="width: 100%"></select-org>
        </el-form-item>
        <!-- <el-form-item label="班级名称" prop="className">
          <el-input v-model="ruleForm.className" placeholder="请输入班级名称"></el-input>
        </el-form-item> -->
        <el-form-item label="课程包选择" prop="packageName">
          <el-row :gutter="10" style="overflow: hidden">
            <el-col :span="18"><el-input placeholder="课程包名称" v-model="ruleForm.packageName" disabled></el-input></el-col>
            <el-col :span="6"><el-button @click="handleSelectPackage">选择课程包</el-button></el-col>
          </el-row>
        </el-form-item>
        <!-- <el-form-item label="班主任" prop="accountName1">
          <el-input placeholder="班主任老师的名字" v-model="ruleForm.accountName1"></el-input>
        </el-form-item> -->
        <el-form-item label="中教老师" prop="chineseTchAccountName">
          <el-input placeholder="中教老师的名字" v-model="ruleForm.chineseTchAccountName"></el-input>
        </el-form-item>
        <el-form-item label="班主任" prop="accountName">
          <el-input placeholder="班主任老师的名字" v-model="ruleForm.accountName"></el-input>
        </el-form-item>
        <el-form-item label="预开班日期" prop="startDate">
          <el-date-picker
            type="date"
            :picker-options="pickerBeginDateBefore"
            v-model="ruleForm.startDate"
            placeholder="请选择日期">
          </el-date-picker>
          <div style="color: #909399">此日期为预开班日期，在提交开班申请前可以根据实际情况进行修改</div>
        </el-form-item>
        <el-form-item label="上课频率" required>
          <el-input placeholder="次数" style="width: 100px" v-model="ruleForm.count" disabled></el-input> 次/周
          <div v-for="(item,index) in ruleForm.count" :key="index" class="mt20">
            第{{ index + 1 }}次上课：
            <el-select v-model="weekDay[index]" placeholder="选择日期" style="width: 115px">
              <el-option label="星期一" :value="1"></el-option>
              <el-option label="星期二" :value="2"></el-option>
              <el-option label="星期三" :value="3"></el-option>
              <el-option label="星期四" :value="4"></el-option>
              <el-option label="星期五" :value="5"></el-option>
              <el-option label="星期六" :value="6"></el-option>
              <el-option label="星期天" :value="7"></el-option>
            </el-select>
            &nbsp;
            <el-time-picker
              v-model="startTime[index]"
              placeholder="选择时间"
              value-format="HH:mm"
              style="width: 120px">
            </el-time-picker>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" @click="submit">保存提交</el-button>
          <el-button @click="$router.push({path: '/class/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 课程包弹窗 -->
    <el-dialog title="选择课程包" top="15px" :visible.sync="dialogTableVisible">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="quickValue" placeholder="输入课程包名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="quickSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="gridData.list"  stripe ref="packageRef" @row-click="rowClick">
        <el-table-column label="课程包">
          <template slot-scope="scope">
            <el-radio :label="scope.row" v-model="selection">{{ scope.row.packageName }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="totalHours" label="总课时"></el-table-column>
        <el-table-column prop="description" label="简介"></el-table-column>
      </el-table>
      <!-- 页码 -->
      <div class="clearfix mt20">
        <el-pagination @current-change="pageChange"
          background
          :current-page="gridData.pageNum"
          :page-size="gridData.pageSize"
          layout="total, prev, pager, next"
          :total="gridData.total"
          style="float: right">
        </el-pagination>
      </div>
      <div slot="footer" style="text-align:center">
        <el-button type="green" @click="packageSubmit">确定</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import selectOrg from '@/components/common/select-org'
import { getOrgPackageList } from '@/api/course-package'
import { addClass } from '@/api/class'
export default {
  components: {
    'select-org': selectOrg
  },
  data() {
    return {
      pickerBeginDateBefore: {
        disabledDate(time) {
          let date = new Date()
          let month = date.getMonth() + 1 + 3 // 三个月后
          let year = date.getFullYear()
          if (month > 12) {
            year += 1
            month -= 12
          }
          date.setYear(year)
          date.setMonth(month, 1)
          date.setHours(0, 0, 0, 0)
          return time.getTime() < (Date.now() + (6 * 24 * 60 * 60 * 1000)) || time.getTime() >= date.getTime()
        }
      },
      dialogTableVisible: false, //课程包弹窗
      packageData: {
        organizationId: this.$store.state.account.organizationId || '',
        pageNum: 1,
        pageSize: 10,
        packageName: ''
      },
      gridData: [],
      quickValue: "",
      ruleForm: {
        chineseTchAccountName: "",
        organizationId: "", //机构ID
        packageName: "", //课程名字
        startDate: "", //开班日期
        accountName: "", //班主任名称
        coursePackageId: "", // 课程包ID
        list: [], //上课频次
        classCount: "", //课时数
        count: "", //次数
        classOrder: ""
      },
      weekDay: [],
      startTime: [],
      rules: {
        // className: [
        //   { required: true, message: '请输入班级名称', trigger: 'blur' }
        // ],
        organizationId: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ],
        packageName: [
          { required: true, message: "请选择课程包", trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "请选择开班日期", trigger: "blur" }
        ],
        chineseTchAccountName: [
          { required: true, message: "请输入中教老师的名称", trigger: "blur" }
        ],
        list: [{ required: true, message: "请选择上课频率", trigger: "blur" }]
      },
      selection: 0
    }
  },
  methods: {
    changeOrg(val) {
      this.ruleForm.packageName = ''
      this.ruleForm.coursePackageId = ''
      this.ruleForm.organizationId = val
      this.packageData.organizationId = val
    },
    handleSelectPackage() {
      if (this.packageData.organizationId) {
        // 获得课程包
        this.classpackage()
      } else {
        this.$message.error('请选择机构')
      }
    },
    // 获得课程包
    classpackage() {
      getOrgPackageList(this.packageData).then(res => {
        if (res.returnCode == "ERR_0000") {
          this.gridData = res.data
          this.dialogTableVisible = true
        }
      })
    },
    //改变页数
    pageChange(val) {
      this.packageData.pageNum = val
      this.classpackage()
    },
    // 点击搜索
    quickSearch() {
      this.packageData.packageName = this.quickValue
      this.classpackage()
    },
    rowClick(row) {
      this.selection = row
    },
    // 课程表弹窗点击确定
    packageSubmit() {
      let sel = this.selection
      this.dialogTableVisible = false
      this.ruleForm.packageName = sel.packageName
      this.ruleForm.coursePackageId = sel.id
      this.ruleForm.count = sel.classTimes
    },
    submit() {
      this.$refs['classForm'].validate(valid => {
        if (!valid) return
        let count = this.ruleForm.count
        if (this.weekDay.length < count || this.startTime.length < count) {
          this.$message.error('请选择上课的时间')
          return
        }
        let distanceDay = 0
        this.ruleForm.list = []
        for (let i = 0; i < this.weekDay.length; i++) {
          this.ruleForm.list.push({
            displayOrder: i + 1,
            type: this.ruleForm.classOrder[i],
            weekDay: this.weekDay[i],
            startTime: this.startTime[i]
          })
          // 判断上课日期的顺序周期
          if (i > 0) {
            let day1 = this.weekDay[i - 1]
            let day2 = this.weekDay[i]
            if (day2 >= day1) {
              let d = day2 - day1
              distanceDay += d
            } else {
              let d = (parseInt(day2) + 7) - parseInt(day1)
              distanceDay += d
            }
            if (distanceDay >= 7) {
              this.$message.error('上课时间冲突')
              return
            }

            // 判断上课日期和时间是否重叠
            if (day2 == day1) {
              let time1 = this.startTime[i - 1].split(':')
              let time2 = this.startTime[i].split(':')

              let date = new Date()
              let t1 = date.setHours(time1[0], time1[1])
              let t2 = date.setHours(time2[0], time2[1])

              // 一节课40分钟
              let duration = 40 * 60 * 1000
              if ((t1 + duration) >= t2) {
                this.$message.error('上课时间冲突')
                return
              }
            }
          }

          // 判断上课日期和时间是否重叠
          // for (let j = 0; j < this.weekDay.length; j++) {
          //   if (i != j && this.weekDay[i] == this.weekDay[j]) {
          //     let date2 = new Date(this.startTime[j])
          //     // let classOrder = this.ruleForm.classOrder
          //     let time1 = date1.getTime()
          //     let time2 = date2.getTime()
          //     if (time2 < time1) continue

          //     let duration = 40 * 60 * 1000
          //     if ((time1 + duration) >= time2) {
          //       this.$message.error('上课时间冲突')
          //       return
          //     }
          //   }
          // }
        }
        addClass(this.ruleForm).then(res => {
          if (res.returnMsg == 'success' && res.data) {
            this.$confirm('是否继续关联学员？', '班级添加成功', {
              confirmButtonText: '现在去关联',
              cancelButtonText: '稍后关联',
              type: 'warning',
              showClose: false,
              closeOnClickModal: false
            }).then(() => {
              this.$router.push({path: `/class/student/${res.data}`})
            }).catch(() => {
              this.$router.push({path: '/class'})
            })
          } else {
            this.$message.error('班级添加失败')
          }
        })
      })
    }
  }
}
</script>
