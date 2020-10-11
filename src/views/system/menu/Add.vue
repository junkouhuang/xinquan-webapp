<template>
  <div>
    <el-card shadow="never" class="mt20">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" style="max-width: 600px">
        <el-form-item label="名称"  prop="name">
          <el-input v-model="form.name" placeholder="输入名称"></el-input>
        </el-form-item>
        <el-form-item label="排序"  prop="sort">
          <el-input v-model="form.sort"  placeholder="输入排序值"></el-input>
        </el-form-item>
        <el-form-item label="resKey"  prop="resKey">
          <el-input v-model="form.resKey"  placeholder="输入resKey"></el-input>
        </el-form-item>
        <el-form-item  label="选择父类"  class="choseParent">
          <el-cascader
            :options="options"
            :props="{
              value: 'id',
              label: 'name',
            }"
            v-model="selectedOptions"
            change-on-select
            @change = "selectedValue">
          </el-cascader>
        </el-form-item>
        <el-form-item label="icon"  prop="iconfont" >
          <el-row :gutter="10" style="overflow: hidden">
            <el-col :span="18"><el-input placeholder="请选择图标" v-model="form.iconfont" disabled></el-input></el-col>
            <el-col :span="6"><el-button @click="choseIcon">选择图标</el-button></el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="类型"  prop="type">
          <el-select placeholder="输入类型" style="width: 100%" v-model="form.type" @change="typeChange" >
            <el-option
              v-for="item in typeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
             >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Url"  prop="resUrl">
          <el-input v-model="form.resUrl"  placeholder="输入Url"></el-input>
        </el-form-item>
        <el-form-item label="描述"  prop="description">
          <el-input v-model="form.description" placeholder="输入描述"></el-input>
        </el-form-item>

        <el-form-item >
          <el-button type="blue" v-has="'res_menu_add'" @click="submit">保存提交</el-button>
          <el-button @click="$router.push({path: '/system/menu/index'})">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
      title="选择图标" center
      :visible.sync="dialogVisible"
      width="30%"
      >
      <span class="menu-iconfont" :class="[iconIndex==index ? 'active': '']" v-for="(item,index) in iconList" :key="index" @click="choseActive(item,index)">
        <i class="iconfont" v-html="item.value"></i>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import menu from '@/api/menu'
export default {
  data() {
    let validateKey = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入resKey'))
      }else {
        menu.nameExist({'name':'',resKey:value}).then(res =>{
          if(res){
            return callback(new Error('resKey已存在'))
          }
          callback();
        })
      }
    };
    return {
      dialogVisible: false,
      rules: {
        name: [
          {required: true, trigger: 'blur'}
        ],

        resKey: [
          {required: true, validator: validateKey, trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请输入类型', trigger: 'blur'}
        ],
        resUrl: [
          {required: true, message: '请输入Url', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序值', trigger: 'blur'}
        ],
      },
      form: {
        'name': '',
        'parentId': 0,
        'resKey': '',
        'type': '',
        'resUrl': '',
        'sort':'',
        'level': '',
        'description': '',
        'iconfont': '',
      },
      selectedOptions: [],
      typeData: [],
      options: [{}],
      menuData:{
        name: '', //名字
      },
      iconList:[],
      iconIndex: -1
    }
  },
  created(){
    this.typeQuery()
    let parentId = this.$route.query.id
    if(parentId){
      this.form.parentId = parentId
      this.searchRequest(parentId)
    }else{
      this.searchRequest()
    }
  },
  methods: {
    typeQuery(){
      menu.typeMenu().then(res =>{
        if(res.returnCode == 'ERR_0000'){
          this.typeData = res.data
        }
      })
    },
    searchRequest(id){
      menu.queryParentMenu().then(res => {
        if(res.returnCode == 'ERR_0000'){
          this.options = res.data
          let options = res.data
          options.forEach(item =>{
            if(id&&item.id == id){
              this.selectedOptions.push(item.id)
            }
            item.children&&item.children.forEach(item2 =>{
              if(id&&item2.id == id){
                this.selectedOptions.push(item.id,item2.id)
              }
              item2.children&&item2.children.forEach(item3 =>{
                if(id&&item3.id == id){
                  this.selectedOptions.push(item.id,item2.id,item3.id)
                }
                item3.children&&item3.children.forEach(item4 =>{
                  item4.disabled = true
                })
              })
            })
          })
          this.options = options
        }
      })
    },
    choseIcon(){
      this.dialogVisible = true
      menu.iconMenu().then(res =>{
        this.iconList = res.data
      })
    },
    choseActive(item,index){
      this.iconIndex = index
      this.form.iconfont = item.value
    },
    typeChange(val){
      this.form.level = val
    },
    selectedValue(val){
      this.form.parentId = val[val.length-1]
    },
    // 提交
    submit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          menu.addMenu(this.form).then(res =>{
            console.log(res);
            if(res.returnCode == 'ERR_0000') {
              this.$message({
                message: '菜单添加成功',
                type: 'success'
              })
              this.$router.push({path: '/system/menu/index'})
            }else{
               this.$message({
                message: '菜单添加失败',
                type: 'error'
              })
            }
          })
        }
      })
    },
  }
};
</script>
<style lang="scss">
.choseParent{
  .el-cascader{
    width: 100%;
  }
}
.menu-iconfont{
  display: inline-block;
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 10px;
  &.active{
    background: rgba(128,128,128,0.2);
  }
  i{
    font-size: 20px;
  }
 }
</style>
