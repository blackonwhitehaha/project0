<template>
  <div>
    <h2>会议管理</h2>
    <MeetingList />
  </div>
</template>

<script lang="ts" setup>
import MeetingList from '@/components/MeetingList.vue';
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
