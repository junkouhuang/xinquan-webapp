<template>
    <div v-if="this.levelList[1].meta.title != 'Home'">
        <div class="pull-right">
            <a class="el-link el-link--info" onclick="window.history.go(-1)">
                <i class="el-icon-d-arrow-left"></i><span class="el-link--inner">返回</span>
            </a>
        </div>
        <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <transition-group>
                    <el-breadcrumb-item  v-for="(item,index) in levelList" :key="index">
                        <span>{{ item.meta.title }}</span>
                    </el-breadcrumb-item>
                </transition-group>
            </el-breadcrumb>
        </div>
    </div>

</template>

<script>
    export default {
        name: "idnex",
        data(){
            return {
                levelList:[]
            }
        },
        created() {
            this.getBreadcrumb()
        },
        watch:{
            $route(){
                this.getBreadcrumb()
            }
        },
        methods:{
            getBreadcrumb(){
                this.levelList=this.$route.matched;
                console.log(this.levelList)
            }
        }
    }
</script>

<style lang="scss


</style>
