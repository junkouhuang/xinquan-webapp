<template>
    <el-card shadow="never" class="mt20">
        <el-form label-width="100px">
            <el-form-item label="药品编号：">
                {{form.drugNo}}
            </el-form-item>
            <el-form-item label="药品名：">
                {{form.name}}
            </el-form-item>
            <el-form-item label="价格：">
                ￥{{form.price}}
            </el-form-item>
            <el-form-item label="图片：">
                <el-image
                        v-if="form.imgUrl"
                        style="width: 100px; "
                        :src="form.imgUrl"
                        :preview-src-list="[`${form.imgUrl}`]">
                </el-image>
                <el-image
                        v-else
                        style="width: 100px; text-align:center;height: 100px;line-height: 100px;font-size: 14px;background: #F5F7FA;color: #C0C4CC;">
                    <div slot="error" class="image-slot">
                        <span>暂无图片</span>
                    </div>
                </el-image>
            </el-form-item>
            <el-form-item label="建议零售价：">
                ￥{{form.suggestPrice}}
            </el-form-item>
            <el-form-item label="配送企业：">
                {{form.enterpriseName}}
            </el-form-item>
            <el-form-item label="生产企业：">
                {{form.producerName}}
            </el-form-item>
            <el-form-item label="批准文号：">
                {{form.licenseNo}}
            </el-form-item>
            <el-form-item label="药品代码：">
                {{form.producerMnemonic}}
            </el-form-item>
            <el-form-item label="库存：">
                {{form.amount}}
            </el-form-item>
            <el-form-item label="规格：">
                {{form.spec}}
            </el-form-item>
            <el-form-item label="起批量：">
                {{form.packageAmount}}
            </el-form-item>
            <el-form-item label="批号：">
                {{form.batchNo}}
            </el-form-item>
            <el-form-item label="单位：">
                {{form.unit}}
            </el-form-item>
            <el-form-item label="有效期：">
                {{form.validityDate | datefmt('YYYY-MM-DD ') }}
            </el-form-item>
            <el-form-item label="生产日期：">
                {{form.productionDate | datefmt('YYYY-MM-DD ') }}
            </el-form-item>
            <el-form-item>
                <el-button @click="$router.go(-1)">返回</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    import {detailDrug} from '@/api/drug'

    export default {
        name: 'editor',
        data() {
            return {
                form: {},
            };
        },
        created() {
            this.dataRequest(this.$route.params.drugNo)
        },
        beforeRouteLeave(to, from, next) {
            // 设置下一个路由的 meta
            to.meta.keepAlive = false;
            next();
        },
        methods: {
            //药品info
            dataRequest(drugNo) {
                detailDrug({drugNo}).then(res => {
                    if (res.returnCode == 'ERR_0000') {
                        this.form = res.data
                    }
                })
            },
        }
    };
</script>
