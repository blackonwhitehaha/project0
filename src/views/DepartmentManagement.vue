<template>
  <div>
    <el-card>
      <h2>部门管理</h2>
      <DepartmentList />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import DepartmentList from '@/components/DepartmentList.vue';
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
