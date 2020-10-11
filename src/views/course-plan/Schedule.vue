<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>排课管理</el-breadcrumb-item>
      <el-breadcrumb-item>排课表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-form label-width="100px" style="max-width: 800px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构名称" required>
              {{ scheduleData.orgName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预开班日期" required>
              {{ scheduleData.preStartClassDate }}
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="班级编号" required>
              {{ scheduleData.classCode }}
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="预结班日期" required>
              {{ scheduleData.preEndClassDate }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程包名称" required>
              {{ scheduleData.coursePackageName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="mt20 clearfix">
        <el-button @click="handleExport" type="success" style="float: right">导出排课表</el-button>
      </div>
      <el-table
        :data="scheduleData.list"
        border
        stripe
        style="width: 100%;margin-top: 5px">
        <el-table-column
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          prop="courseName"
          sortable
          label="课程名称">
        </el-table-column>
        <el-table-column
          prop="courseType"
          sortable
          label="课程类型">
        </el-table-column>
        <el-table-column
          prop="classHour"
          sortable
          label="课时">
        </el-table-column>
        <el-table-column
          prop="classDate"
          sortable
          label="上课日期">
        </el-table-column>
        <el-table-column
          prop="classTime"
          sortable
          label="上课时间">
        </el-table-column>
        <el-table-column
          prop="weekDay"
          sortable
          label="星期几">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { queryPrePlan, exportPrePlan } from '@/api/course-plan'
export default {
  data() {
    return {
      scheduleData: {
        list: []
      }
    }
  },
  created() {
    queryPrePlan(this.$route.params.id).then(res => {
      this.scheduleData = res.data
    })
  },
  methods: {
    handleExport() {
      exportPrePlan(this.$route.params.id).then(res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let link = document.createElement('a')
        link.href = objectUrl
        link.style.display = 'none'
        link.download = '预排课表_' + new Date().getTime()
        link.click()
      })
    }
  }
}
</script>
