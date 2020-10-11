<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>排课管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改排课</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form ref="ruleForm" label-width="100px" style="max-width: 600px">
        <el-form-item label="班级编号" required>
          {{ coursePlan.classCode }}
        </el-form-item>
        <el-form-item label="所属机构" required>
          {{ coursePlan.orgName }}
        </el-form-item>
        <el-form-item label="课程名称" required>
          {{ coursePlan.courseName }}
        </el-form-item>
        <el-form-item label="上课时间" required>
          <el-date-picker
            :editable="false"
            v-model="startTime"
            type="date"
            :picker-options="pickerBeginDateBefore"
            placeholder="选择日期"
            :clearable="false">
          </el-date-picker>
          <span> &nbsp; - &nbsp; </span>
          <el-time-picker
            :editable="false"
            v-model="startTime"
            placeholder="选择时间"
            :clearable="false">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="下课时间" required>
          <el-time-picker
            :editable="false"
            v-model="endTime"
            placeholder="选择时间"
            :clearable="false">
          </el-time-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="blue" v-if="coursePlan.classType != 1 && !isTimeExpire" @click="handleSubmit">保存提交</el-button>
          <el-button @click="$router.push({path: '/course-plan/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <span>上课记录（共{{ recordsList ? recordsList.length : 0 }}名学员）</span>
      </div>

      <el-table
        stripe
        :data="recordsList"
        style="width: 100%" >
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="studentCode"
          sortable
          label="学员编号">
        </el-table-column>
        <el-table-column
          prop="studentName"
          sortable
          label="学员姓名">
        </el-table-column>
        <el-table-column
          prop="attendance"
          sortable
          label="出勤情况">
          <template slot-scope="scope">
            {{ scope.row.attendance | filterAttendance }}
          </template>
        </el-table-column>
        <el-table-column
          prop="syncStatus"
          sortable
          label="预约状态">
          <template slot-scope="scope">
            <span v-if="scope.row.syncStatus == 1" class="label label-success">已预约</span>
            <span v-else class="label label-warning">未预约</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="teacherComment"
          sortable
          label="评价">
          <template slot-scope="scope">
            {{ scope.row.teacherComment ? scope.row.teacherComment : '暂无评价' }}
          </template>
        </el-table-column>
        <!-- 线上课，机构不可修改 classType: 1(线上) type: 0(系统) -->
        <el-table-column label="操作" width="80" v-if="$store.state.account.type == 0 || ($store.state.account.type != 0 && coursePlan.classType != 1)">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="出勤修改" placement="top">
              <el-button class="reset-icon" @click="handleAttendance(scope.row)" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="学员出勤修改"
      :visible.sync="attendanceDialogVisible"
      width="500px"
      center>
      <el-form :model="records" label-width="100px">
        <el-form-item label="学员：">
          {{ records.studentName }}
        </el-form-item>
        <el-form-item label="出勤情况：">
          <el-radio v-model="records.attendance" :label="1">已出勤</el-radio>
          <el-radio v-model="records.attendance" :label="2">请假</el-radio>
          <el-radio v-model="records.attendance" :label="0">缺勤</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="green" @click="handleUpdateAttendance">确 定</el-button>
        <el-button @click="attendanceDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { coursePlanDetail, attendanceRecords, updateAttendance, updateCoursePlan } from '@/api/course-plan'
export default {
  data() {
    return {
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() <= (Date.now())
        }
      },
      coursePlan: {},
      startTime: '',
      endTime: '',
      attendanceDialogVisible: false,
      records: {},
      recordsList: [],
      isTimeExpire: false
    }
  },
  filters: {
    filterAttendance: function(val) {
      if (val == 0) {
        return '缺勤'
      } else if (val == 1) {
        return '已出勤'
      } else if (val == 2) {
        return '请假'
      } else {
        return '未知'
      }
    }
  },
  created() {
    // 排课详情
    coursePlanDetail(this.$route.params.id).then(res => {
      this.coursePlan = res.data
      this.startTime = new Date(res.data.classTimeOn)
      this.endTime = new Date(res.data.classTimeOff)
      // 判断上课时间是否已过
      if (Date.now() >= res.data.classTimeOn) {
        this.isTimeExpire = true
      }
      // 监听上课时间
      this.$watch('startTime', this.changeTime)
    })

    this.loadAttendanceRecords()
  },
  methods: {
    loadAttendanceRecords() {
      // 上课记录
      attendanceRecords(this.$route.params.id).then(res => {
        this.recordsList = res.data
      })
    },
    handleSubmit() {
      // 转成时间戳,并赋值
      this.coursePlan.classTimeOn = new Date(this.startTime).getTime()
      this.coursePlan.classTimeOff = new Date(this.endTime).getTime()
      // 更新
      updateCoursePlan(this.coursePlan).then(res => {
        if(res.returnMsg == 'success') {
          this.$message({
            message: '排课信息修改成功',
            type: 'success'
          })
          this.$router.push({path: '/course-plan'})
        } else if (res.returnCode == 'ERR_0016' || res.returnCode == 'ERR_0017') {
          this.$message.error(res.returnMsg)
        } else {
          this.$message.error('排课信息修改失败')
        }
      })
    },
    changeTime() {
      // 监听修改上课时间,下课时间在此加上90分钟
      let date = new Date(this.startTime)
      date.setMinutes(date.getMinutes() + 90)
      this.endTime = date
    },
    handleAttendance(row) {
      this.records = {
        ...row
      }
      this.attendanceDialogVisible = true
    },
    handleUpdateAttendance() {
      if (this.records.attendance >= 0) {
        updateAttendance({
          id: this.records.id,
          attendance: this.records.attendance
        }).then(res => {
          if(res.returnMsg == 'success') {
            this.$message({
              message: '出勤情况更新成功',
              type: 'success'
            })
            this.attendanceDialogVisible = false
            this.loadAttendanceRecords()
          } else {
            let msg = res.returnMsg || '出勤情况更新失败'
            this.$message.error(msg)
          }
        })
      } else {
        this.$message.error('请选择出勤情况')
      }
    }
  }
}
</script>
