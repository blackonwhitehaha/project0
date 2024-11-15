<template>
  <div>
    <el-input v-model="query" placeholder="请输入部门名称" style="width: 200px;">
      <template #prefix>
        <el-button :icon="Search" class="prefix-el-button"></el-button>
      </template>
    </el-input>
    <el-tree
      style="width: 200px;"
      :data="filteredOrgData"
      node-key="id"
      default-expand-all
      :props="defaultProps"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useOrgStore } from '@/stores/orgStore';
import { Search } from '@element-plus/icons-vue';

const query = ref('');
const orgStore = useOrgStore();

const defaultProps = ref({
  children: 'children',
  label: 'label'
});

const emit = defineEmits(['update-current-org']);

const handleNodeClick = (data: any, node: any) => {
  console.log('点击了节点:', data);
  let department = '';
  let company = '';
  let root = '';
  let users: any[] = [];

  if (node.level === 3) {
    department = data.label;
    company = node.parent.data.label;
    root = node.parent.parent.data.label;
    users = data.users.map((user: any) => ({ ...user, section: department }));
  } else if (node.level === 2) {
    company = data.label;
    root = node.parent.data.label;
    users = data.children.flatMap((dept: any) => dept.users.map((user: any) => ({ ...user, section: dept.label })));
  } else if (node.level === 1) {
    root = data.label;
    users = data.children.flatMap((comp: any) =>
      comp.children.flatMap((dept: any) => dept.users.map((user: any) => ({ ...user, section: dept.label })))
    );
  }

  emit('update-current-org', { root, company, department, users });
  orgStore.setUsers(users);
};

onMounted(() => {
  orgStore.fetchOrgData();
});

const filteredOrgData = computed(() => {
  if (!query.value) {
    return orgStore.orgData;
  }

  const filterData = (data: any[]): any[] => {
    return data
      .map(item => {
        const children = item.children ? filterData(item.children) : [];
        if (item.label.includes(query.value) || children.length) {
          return { ...item, children };
        }
      })
      .filter(item => item);
  };

  return filterData(orgStore.orgData);
});
</script>

<style scoped>
.el-input {
  margin-bottom: 10px;
}
.prefix-el-button {
  border: none;
  margin: 1px;
  padding: 0;
}
</style>
