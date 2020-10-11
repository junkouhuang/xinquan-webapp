<template>
  <div>
    <el-row :gutter="10" style="overflow: hidden">
      <el-col :span="18"><el-input placeholder="课程包名称" v-model="packageName" disabled></el-input></el-col>
      <el-col :span="6"><el-button @click="handleSelect">选择</el-button></el-col>
    </el-row>

    <el-dialog title="选择课程包" top="15px" :visible.sync="dialogVisible">
      <div slot="title">
        <span style="font-size: 18px;margin-right: 10px">选择课程包</span>
        <el-input v-model="query.packageName" style="width: 200px" placeholder="搜索课程包">
          <el-button slot="append" icon="el-icon-search" @click="loadPackageList"></el-button>
        </el-input>
      </div>
      <el-table :data="packageData.list" stripe @row-click="rowClick">
        <el-table-column label="课程包">
          <template slot-scope="scope">
            <el-radio :label="scope.row" v-model="selected">{{ scope.row.packageName }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="totalHours" label="总课时"></el-table-column>
        <el-table-column prop="description" label="简介"></el-table-column>
      </el-table>
      <!-- 页码 -->
      <div class="clearfix mt20">
        <el-pagination @current-change="pageChange" 
          background
          :current-page="packageData.pageNum"
          :page-size="packageData.pageSize"
          layout="total, prev, pager, next"
          :total="packageData.total">
        </el-pagination>
      </div>
      <div slot="footer" style="text-align:center">
        <el-button type="green" @click="handleEnter">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { packageList } from '@/api/course-package'
export default {
  props: {
    packageName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      selected: '',
      query: {
        state: 1,
        pageNum: 1,
        pageSize: 10,
        packageName: '',
        classRelationPackage: true
      },
      quickValue: '',
      packageData: []
    }
  },
  // watch: {
  //   packageName: function(val) {
  //     console.log(val);
  //   }
  // },
  methods: {
    loadPackageList() {
      packageList(this.query).then(res => {
        this.packageData = res.data
      })
    },
    handleSelect() {
      this.dialogVisible = true
      if (!this.packageData.list) {
        this.loadPackageList()
      }
    },
    rowClick(row) {
      this.selected = row
    },
    handleEnter() {
      if (!this.selected) {
        this.$message.error('请选择课程包')
        return
      }
      this.dialogVisible = false
      this.$emit('change', this.selected)
    },
    pageChange(num) {
      this.query.pageNum = num
      this.loadPackageList()
    }
  }
}
</script>
