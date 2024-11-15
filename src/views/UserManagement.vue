<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="5">
          <OrgList @update-current-org="handleUpdateCurrentOrg" />
        </el-col>
        <el-col :span="19">
          <UserList :current-root="currentRoot" :current-department="currentDepartment" :current-company="currentCompany" :initial-users="currentUsers"  />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref,onMounted } from 'vue';
import OrgList from '@/components/OrgList.vue';
import UserList from '@/components/UserList.vue';
import axios from 'axios';

interface OrgData {
  root: string;
  company: string;
  department: string;
  users: any[];
}

const currentRoot = ref<string>('');
const currentDepartment = ref<string>('');
const currentCompany = ref<string>('');
const currentUsers = ref<any[]>([]);


const handleUpdateCurrentOrg = (data: OrgData) => {
  currentRoot.value = data.root;
  currentDepartment.value = data.department;
  currentCompany.value = data.company;
  currentUsers.value = data.users;
};

</script>

<style scoped>
.user-management {
  padding: 20px;
}
.el-card {
  margin-top: 20px;
}
</style>
