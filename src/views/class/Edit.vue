<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改班级</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form :model="schoolClass" :rules="rules" ref="classForm" label-width="100px" style="max-width: 600px">
        <el-form-item label="所属机构" required>
          {{ schoolClass.displayName }}
        </el-form-item>
        <!-- <el-form-item label="班级名称" prop="className">
          <el-input v-model="schoolClass.className" placeholder="请输入班级名称"></el-input>
        </el-form-item> -->
        <el-form-item label="课程包" required>
          <el-input v-model="schoolClass.packageName" disabled></el-input>
        </el-form-item>
        <el-form-item label="中教老师" prop="chineseTchAccountName">
          <el-input placeholder="中教老师的名字" v-model="schoolClass.chineseTchAccountName"></el-input>
        </el-form-item>
        <el-form-item label="班主任" prop="accountName">
          <el-input v-model="schoolClass.accountName" placeholder="班主任老师的名字"></el-input>
        </el-form-item>
        <el-form-item :label="schoolClass.preState == 1 ? '开班日期' : '预开班日期'" required>
          <template v-if="schoolClass.preState >= 1">
            {{ schoolClass.startDate | datefmt('YYYY-MM-DD') }}
          </template>
          <el-date-picker
            v-else
            v-model="schoolClass.startDate"
            :picker-options="pickerBeginDateBefore"
            type="date"
            placeholder="请选择日期">
          </el-date-picker>
          <div v-if="schoolClass.preState < 1" style="color: #909399">此日期为预开班日期，在提交开班申请前可以根据实际情况进行修改</div>
        </el-form-item>
        <el-form-item label="上课频率" required>
          <el-input placeholder="次数" style="width: 100px" v-model="schoolClass.classTimes" disabled></el-input> 次/周
          <div v-for="(itemOrder,index) in schoolClass.list" :key="index" class="mt20">
            第{{ index + 1 }}次上课：
            <el-select v-model="itemOrder.weekDay" placeholder="选择日期" style="width: 115px" :disabled="schoolClass.preState == 1">
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
              v-model="itemOrder.startTime"
              :clearable="false"
              value-format="HH:mm"
              placeholder="选择时间"
              style="width: 120px"
              :disabled="schoolClass.preState == 1">
            </el-time-picker>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="blue" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/class/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <span style="display: inline-block;margin-top: 12px">班级学员名单</span>
        <div class="pull-right">
          <el-button type="blue" @click="$router.push({path: `/class/student/${$route.params.id}`})">关联学员</el-button>
        </div>
      </div>

      <el-table
        :data="tableData.list"
        style="width: 100%">
        <el-table-column
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          prop="studentName"
          sortable
          label="学员名称">
        </el-table-column>
        <el-table-column
          prop="classHourTotal"
          sortable
          label="总课时数">
        </el-table-column>
        <el-table-column
          prop="intoDate"
          sortable
          label="进班时间">
          <template slot-scope="scope">
            {{ scope.row.intoDate | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="classHourOver"
          sortable
          label="剩余课时">
        </el-table-column>
        <el-table-column
          prop="syncStatus"
          sortable
          label="同步状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.syncStatus == 1" size="small" type="success">已同步</el-tag>
            <el-tag v-else  size="small" type="warning">未同步</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="退出" placement="top">
              <el-button class="reset-icon" @click="handleDeleteStudent(scope.row)" type="text">
                <i class="iconfont">&#xe627;</i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page="tableData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="tableData.pageSize"
          :total="tableData.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>

    <el-card shadow="never" class="mt20" v-if="classHistoryData.list && classHistoryData.list.length">
      <div slot="header" class="clearfix">
        <span>班级操作记录</span>
      </div>

      <el-table
        :data="classHistoryData.list"
        style="width: 100%">
        <el-table-column
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          prop="studentName"
          sortable
          label="学员名称">
        </el-table-column>
        <el-table-column
          prop="inOut"
          sortable
          label="加入/退出">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.inOut == 0" size="small" type="success">加入</el-tag>
            <el-tag v-else-if="scope.row.inOut == 1"  size="small" type="warning">退出</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          sortable
          label="类型">
          <template slot-scope="scope">
            {{ operateTypeFormat(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="operateTime"
          sortable
          label="操作时间">
          <template slot-scope="scope">
            {{ scope.row.operateTime | datefmt('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="operateBy"
          sortable
          label="操作人">
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page="classHistoryData.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="classHistoryData.pageSize"
          :total="classHistoryData.total"
          @size-change="changeHistoryPageSize"
          @current-change="changeHistoryPageNum">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { detailClass, modifyClass, classStudent, delStudent, getClassOperateTypes, getClassHistoryList } from '@/api/class'
export default {
  data() {
    return {
      pickerBeginDateBefore: {
        disabledDate(time) {
          let date = new Date()
          let month = date.getMonth() + 1 + 3  // 三个月后
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
      schoolClass: {
        list: []
      },
      weekDay: [],
      startTime: [],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      classHistoryQuery: {
        schoolClassId: this.$route.params.id,
        pageNum: 1,
        pageSize: 10
      },
      classHistoryData: {},
      operateTypes: [],
      rules: {
        // className: [
        //   { required: true, message: '请输入班级名称', trigger: 'blur' }
        // ],
        chineseTchAccountName: [
          { required: true, message: '请输入中教老师的名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    let id = parseInt(this.$route.params.id)
    // 班级详情
    detailClass(id).then(res => {
      this.schoolClass = res.data
      // 计算课时数
      // let classCount = 0
      // if (res.data.list) {
      //   res.data.list.forEach(ele => {
      //     classCount += ele.type == 'A' ? 2 : 1
      //   })
      // }
      // this.schoolClass.classCount = classCount
    })
    // 操作类型
    getClassOperateTypes().then(res => {
      if (res.returnCode == 'ERR_0000') this.operateTypes = res.data
    })
    this.loadClassStudent()
    this.loadClassHistory()
  },
  methods: {
    loadClassStudent() {
      let id = parseInt(this.$route.params.id)
      // 班级学员名单
      classStudent({ id, pageNum: this.pageNum, pageSize: this.pageSize }).then(res=> {
        this.tableData = res.data
      })
    },
    loadClassHistory() {
      getClassHistoryList(this.classHistoryQuery).then(res => {
        if (res.returnCode == 'ERR_0000') this.classHistoryData = res.data
      })
    },
    // 格式化操作类型
    operateTypeFormat(id) {
      if (!this.operateTypes || this.operateTypes.length <= 0) return ''
      let row = this.operateTypes.find(row => row.id == id)
      return row.name
    },
    handleSubmit() {
      this.$refs['classForm'].validate(valid => {
        if (!valid) return
        let list = this.schoolClass.list
        // console.log(list)
        let distanceDay = 0
        for (let i = 0; i < list.length; i++) {
          if (i > 0) {
            // 判断上课日期的顺序周期
            let day1 = list[i - 1].weekDay
            let day2 = list[i].weekDay
            if (day2 >= day1) {
              let d = day2 - day1
              distanceDay += d
            } else {
              let d = (day2 + 7) - day1
              distanceDay += d
            }
            if (distanceDay >= 7) {
              this.$message.error('上课时间冲突')
              return
            }

            // 判断上课日期和时间是否重叠
            if (day2 == day1) {
              let time1 = list[i - 1].startTime.split(':')
              let time2 = list[i].startTime.split(':')

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
          // for (let j = 0; j < list.length; j++) {
          //   if (i != j && list[i].weekDay == list[j].weekDay) {
          //     let t1 = list[i].startTime.split(':')
          //     let t2 = list[j].startTime.split(':')

          //     let date = new Date()
          //     let s1 = date.setHours(t1[0], t1[1])
          //     let s2 = date.setHours(t2[0], t2[1])

          //     if (s2 < s1) continue
          //     // 一节课40分钟
          //     let duration = 40 * 60 * 1000
          //     if ((s1 + duration) >= s2) {
          //       this.$message.error('上课时间冲突')
          //       return
          //     }
          //   }
          // }
        }

        modifyClass({
          id: this.schoolClass.id,
          // className: this.schoolClass.className,
          accountName: this.schoolClass.accountName,
          startDate: this.schoolClass.startDate,
          chineseTchAccountName: this.schoolClass.chineseTchAccountName,
          list: this.schoolClass.list
        }).then(res => {
          if (res.returnCode == 'ERR_0000') {
            this.$confirm('是否继续关联学员？', '班级修改成功', {
              confirmButtonText: '现在去关联',
              cancelButtonText: '稍后关联',
              type: 'warning',
              showClose: false,
              closeOnClickModal: false
            }).then(() => {
              this.$router.push({path: `/class/student/${this.schoolClass.id}`})
            }).catch(() => {
              this.$router.push({path: '/class'})
            })
          } else {
            this.$message.error('班级修改失败')
          }
        })
      })
    },
    handleDeleteStudent(row) {
      this.$confirm(`是否确定删除该班级学员？（${row.studentName}）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delStudent({
          id: row.id,
          teamId: row.teamId,
          schoolClassId: row.schoolClassId
        }).then(res => {
          if(res.returnCode == 'ERR_0000') {
            this.$message({
              message: '班级学员删除成功',
              type: 'success'
            })
            this.loadClassStudent()
          } else {
            this.$message.error('班级学员删除失败')
          }
        })
      })
    },
    changePageNum(val) {
      this.pageNum = val
      this.loadClassStudent()
    },
    changePageSize(val) {
      this.pageSize = val
      this.loadClassStudent()
    },
    changeHistoryPageNum(val) {
      this.classHistoryQuery.pageNum = val
      this.loadClassHistory()
    },
    changeHistoryPageSize(val) {
      this.classHistoryQuery.pageSize = val
      this.loadClassHistory()
    }
  }
}
</script>
