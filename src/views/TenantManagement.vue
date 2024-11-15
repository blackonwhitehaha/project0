<template>
  <div>
    <el-card>
      <h2>租户管理</h2>
      <TenantList />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import TenantList from '@/components/TenantList.vue';

</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
