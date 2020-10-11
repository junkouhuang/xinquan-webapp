<template>
  <div>
    <div v-if="tempList"></div>
    <el-select v-if="type === 0" @change="changeSelect" v-model="orgid" placeholder="请选择机构" style="width: 100%" filterable>
      <el-option v-for="(item, index) in orglist" :key="index" :label="item.displayName" :value="item.id"></el-option>
    </el-select>
    <div v-else-if="org.id && org.name" style="color: #909399">{{ org.name }}</div>
  </div>
</template>

<script>
import orgRequest from '@/api/org'
export default {
  props: ['id'],
  data() {
    return {
      orgid: '',
      orglist: []
    }
  },
  computed: {
    type () {
      return this.$store.state.account.type
    },
    org () {
      let orgId = this.$store.state.account.organizationId
      let orgName = this.$store.state.account.organizationName
      if (orgId && parseInt(orgId) > 0) {
        this.$emit('change', orgId)
      }
      return {
        id: orgId || 0,
        name: orgName
      }
    },
    tempList () {
      let orgId = this.$store.state.account.organizationId
      if (orgId == 0) {
        orgRequest.searchRequest({
          pageNum: 1,
          pageSize: 200
        }).then(res => {
          this.orglist = res.data.list
          // return res.data.list
        })
      }
      return false
    }
  },
  watch: {
    id: function(val) {
      this.orgid = this.id || ''
    }
  },
  methods: {
    changeSelect(val) {
      console.log('changeSelect');
      this.$emit('change', val)
    }
  }
}
</script>
