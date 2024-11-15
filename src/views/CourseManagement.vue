<template>
    <div>
      <el-card>
        <h2>课程管理</h2>
        <CourseList />
      </el-card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import CourseList from '@/components/CourseList.vue';
  </script>
  
<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
  