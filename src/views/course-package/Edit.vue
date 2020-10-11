<template>
  <div class="package-wraper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教研管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程包管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ showAlertUsed ? '查看课程包' : '修改课程包' }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="mt20">
      <el-alert
        v-if="showAlertUsed"
        title="课程包已被使用，不能修改"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" style="max-width: 600px">
        <el-form-item label="课程包名称">
          {{ form.packageName }}
        </el-form-item>
        <el-form-item label="课程包编号">
          {{ form.packageCode }}
        </el-form-item>
        <el-form-item label="课程包级别" prop="level">
          <el-select v-model="form.level" placeholder="选择课程包级别" style="width: 100%">
            <el-option v-for="(item, index) in packageLevel" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程包类型" prop="type">
          <el-select v-model="form.type" placeholder="选择课程包类型" style="width: 100%">
            <el-option v-for="(item, index) in packageTypes" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程包介绍">
          <el-input v-model="form.description" type="textarea" rows="5" placeholder="输入课程包的介绍信息"></el-input>
        </el-form-item>
        <el-form-item label="缩略图" prop="imageUrl">
          <upload-image :imageUrl="form.imageUrl" @changeImage="changeImage" />
        </el-form-item>
        <el-form-item label="上课次数" prop="classTimes">
          <el-input-number v-model="form.classTimes" controls-position="right" :min="0" :max="100"></el-input-number>
          次/每周
        </el-form-item>
        <el-form-item label="教学类型" prop="teachingTypes">
          <el-radio v-for="(item, index) in teachingList" :key="index" :label="item.id" v-model="form.teachingTypes">{{ item.name }}</el-radio>
        </el-form-item>
        <el-form-item label="教研类型" prop="teachingResearchTypes">
          <el-select placeholder="请选择" v-model="form.teachingResearchTypes">
            <el-option v-for="(item, index) in researchList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="QKid关联" v-if="qKidRelation" prop="qkidsId">
          <el-select v-model="form.qkidsId" @change="changePackageHandler" style="width: 100%" placeholder="请选择关联课程包" filterable>
            <el-option v-for="(item, index) in qKidPackageList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="总课时">
          {{ form.totalHours }}课时（线下{{ form.underHours }}课时+线上{{ form.onHours }}课时）
        </el-form-item>

        <el-form-item>
          <el-button type="blue" v-if="form.used" @click="submitForm">保存提交</el-button>
          <el-button @click="$router.push({path: '/course-package/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header" class="clearfix">
        <span class="pull-left" :style="form.used ? 'margin-top: 12px' : ''">关联课程列表</span>
        <div class="pull-right">
          <el-button type="blue" v-if="form.used" @click="$router.push({path: `/course-package/course/${$route.params.id}`})">关联课程</el-button>
        </div>
      </div>

      <el-table
        :data="relationCourse.list"
        stripe
        style="width: 100%">
        <el-table-column
          sortable
          prop="displayOrder"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="courseName"
          sortable
          label="课程名称">
        </el-table-column>
        <el-table-column
          prop="classHour"
          sortable
          label="消耗课时">
        </el-table-column>
        <el-table-column
          prop="classType"
          sortable
          label="课程类型">
          <template slot-scope="scope">
            {{ scope.row.classType ? '线上' : '线下' }}
          </template>
        </el-table-column>
      </el-table>

      <div class="clearfix mt20">
        <div class="pagination-count">
          <span>共 {{ relationCourse.total }} 条</span>
          <span>，{{ relationCourse.pages }} 页</span>
        </div>
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          :current-page="relationCourse.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="relationCourse.pageSize"
          :total="relationCourse.total"
          @size-change="changePageSize"
          @current-change="changePageNum">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from '@/api/course-package'
import { getCoursePackageList } from '@/api/qkids'
import uploadImage from '@/components/upload/image'
export default {
  components: {
    'upload-image': uploadImage
  },
  // watch: {
  //   'form.teachingResearchTypes': function(value) {
  //     let research = this.researchList.find(item => item.id === value)
  //     if (research && research.value === 'Qkids Cooperation') {
  //       this.qKidRelation = true
  //     } else {
  //       this.qKidRelation = false
  //       this.form.qkidsId = ''
  //       this.form.qkidsName = ''
  //     }
  //   }
  // },
  computed: {
    qKidRelation: function() {
      if (this.researchList.length <= 0) return false
      let research = this.researchList.find(item => item.id === this.form.teachingResearchTypes)
      return research && research.value === 'Qkids Cooperation'
    }
  },
  data() {
    const validateImage = (rule, value, callback) => {
      if (!this.form.imageUrl) {
        return callback(new Error('请上传课程包缩略图'))
      }
      callback()
    }
    return {
      showAlertUsed: false,
      courseA: 0,
      courseB: 0,
      form: {},
      query: {
        id: this.$route.params.id,
        pageNum: 1,
        pageSize: 10
      },
      relationCourse: {
        list: []
      },
      rules: {
        type: [
          { required: true, message: '请选择课程包类型', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, validator: validateImage, trigger: 'blur' }
        ],
        classTimes: [
          { required: true, message: '请选择上课次数', trigger: 'blur' }
        ],
        qkidsId: [
          { required: true, message: '请选择关联课程包', trigger: 'change' }
        ]
      },
      teachingList: [], // 教学类型
      researchList: [],  // 教研类型
      // qKidRelation: false,
      qKidPackageList: [],
      packageLevel: [],
      packageTypes: []
    }
  },
  created() {
    // 课程包级别
    request.getPackageLevel().then(res => {
      this.packageLevel = res.data
    })
    // 课程包类型
    request.getPackageTypes().then(res => {
      this.packageTypes = res.data
    })
    // 教学类型
    request.getTeachingTypes().then(res => {
      this.teachingList = res.data
    })
    // 教研类型
    request.getResearchTypes().then(res => {
      this.researchList = res.data
    })
    // 久趣课程包
    getCoursePackageList().then(res => {
      this.qKidPackageList = res.data
    })

    // 课程包详情
    this.loadCoursePackage()
    // 关联的课程
    this.loadRelationCourse()
  },
  methods: {
    loadCoursePackage() {
      request.packageDetail(this.$route.params.id)
        .then(res => {
          this.form = res.data
          if (res.data.qkidsId) {
            this.form.qkidsId = parseInt(res.data.qkidsId)
          }
          // 课程包是否被使用
          this.showAlertUsed = !this.form.used
        })
    },
    // 关联的课程
    loadRelationCourse() {
      request.relationCourse(this.query)
        .then(res => {
          if (res.returnMsg == 'success') this.relationCourse = res.data
        })
    },
    // 修改分页显示数
    changePageSize(num) {
      this.query.pageSize = num
      this.loadRelationCourse()
    },
    // 切换分页
    changePageNum(page) {
      this.query.pageNum = page
      this.loadRelationCourse()
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          request.updatePackage(this.form)
            .then(res => {
              if(res.returnMsg == 'success' && this.form.id) {
                this.$confirm('是否继续关联课程？', '课程包修改成功', {
                  confirmButtonText: '现在去关联',
                  cancelButtonText: '稍后关联',
                  type: 'warning',
                  showClose: false,
                  closeOnClickModal: false
                }).then(() => {
                  this.$router.push({path: `/course-package/course/${this.form.id}`})
                }).catch(() => {
                  this.$router.push({path: '/course-package'})
                })
              } else if(res.returnCode == '40000068') {
                this.$message.error('课程包已被使用，不能修改')
              } else {
                this.$message.error('课程包修改失败')
              }
            })
        }
      })
    },
    changeImage(url) {
      this.form.imageUrl = url
    },
    changePackageHandler(id) {
      if (!id) return
      let item = this.qKidPackageList.find(item => item.id === id)
      this.form.qkidsName = item.name
    }
  }
}
</script>
