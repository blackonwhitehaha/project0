<template>
    <div>
      <el-card>
        <h2>资讯管理</h2>
        <NewsList />
      </el-card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import NewsList from '@/components/NewsList.vue';
  </script>
  
  <style scoped>
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  </style>
  