<template>
  <div>
    <h1>
      部门名称<span style="margin-right: 8px;"></span>
      <el-input v-model="departmentQuery.name" style="width: 140px; margin-right: 20px;" placeholder="请输入部门名称" />
      状态<span style="margin-right: 8px;"></span>
      <el-select v-model="departmentQuery.status" placeholder="部门状态" style="width: 140px; margin-right: 20px;">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" :icon="Search" @click="searchDepartments">搜索</el-button>
      <el-button :icon="RefreshLeft" @click="resetSearch">重置</el-button>
    </h1>
    <el-button type="primary" :icon="CirclePlus" @click="diaVisible=true" plain>新增</el-button>
    <el-button type="info" :icon="Sort" @click="toggleExpandCollapse" plain ><span>展开/折叠</span></el-button>
    
    <!-- 树形表格展示 -->
    <el-table
      scrollbar-always-on
      :data="filteredDepartments"
      style="width: 100%;"
      row-key="departmentID"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :expand-row-keys="expandedKeys"
    >
      <el-table-column prop="departmentName" label="名称" ></el-table-column>
      <el-table-column prop="departmentOrder" label="排序" ></el-table-column>
      <el-table-column prop="departmentState" label="状态" >
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.departmentState)" effect="light" size="medium">
            {{ row.departmentState }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" ></el-table-column>
      <el-table-column label="操作" >
        <template #default="scope">
          <el-button size="small" type="primary" :icon="EditPen" @click="editDepartment(scope.row)" plain>修改</el-button>
          <el-button size="small" type="primary" :icon="DeleteFilled" @click="deleteDepartment(scope.row)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="diaVisible" title="添加用户" width="650px">
      <DepartmentForm @submit3="handledialogSubmit"/>
    </el-dialog>

    <el-dialog v-model="logVisible" title="修改用户" width="650px">
      <DepartmentChange :formData="formData" @submit4="handlelogSubmit"/>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { DeleteFilled, Sort, Search, CirclePlus, RefreshLeft, EditPen } from '@element-plus/icons-vue';
import { type Department, type DepartmentQuery } from '@/types';
import DepartmentForm from './DepartmentForm.vue';
import DepartmentChange from './DepartmentChange.vue';
import axios from 'axios';

const diaVisible = ref(false);
const logVisible = ref(false);
const formData = ref<Department | null>(null);

const departmentQuery = ref<DepartmentQuery>({
  name: '',
  status: ''
});

const departments = ref<any[]>([]);
const filteredDepartments = ref<any[]>([]);
const expandedKeys = ref<number[]>([]);
let isExpanded = false;

const handledialogSubmit = (formData: any) => {
  diaVisible.value = false;
  console.log('接收到的表单数据', formData);
  axios.post('http://localhost:8888/department/addDepartment', formData).then(response => {
    if (response.data.isOK) {
      console.log('提交成功', response);
      ElMessage.success('提交成功');
      findAll();
    } else {
      console.error('提交失败', response);
      ElMessage.error('提交失败');
    }
  }).catch(error => {
    console.error('系统错误，请稍后重试', error);
    ElMessage.error('系统错误，请稍后重试');
  });
};

const handlelogSubmit = (formData: any) => {
  logVisible.value = false;
  console.log('接收到的表单数据', formData);
  axios.post('http://localhost:8888/department/upDateDepartment', formData).then(response => {
    if (response.data.isOK) {
      console.log('提交成功', response);
      ElMessage.success('提交成功');
      findAll();
    } else {
      console.error('提交失败', response);
      ElMessage.error('提交失败');
    }
  }).catch(error => {
    console.error('系统错误，请稍后重试', error);
    ElMessage.error('系统错误，请稍后重试');
  });
};

const getStatusTagType = (status: string) => {
  return status === '正常' ? 'success' : 'danger';
};

const searchDepartments = () => {
  filteredDepartments.value = filterData(departments.value);
};

const resetSearch = () => {
  departmentQuery.value.name = '';
  departmentQuery.value.status = '';
  searchDepartments();
};

const filterData = (data: any[]): any[] => {
  return data
    .map(item => {
      const children = item.children ? filterData(item.children) : [];
      if (
        (departmentQuery.value.name === '' || item.departmentName.includes(departmentQuery.value.name)) &&
        (departmentQuery.value.status === '' || item.departmentState === departmentQuery.value.status) ||
        children.length
      ) {
        return { ...item, children };
      }
    })
    .filter(item => item);
};

const findAll = () => {
  axios.get('http://localhost:8888/department/allDepartment')
    .then(response => {
      if (response.data) {
        departments.value = [response.data];  // 修改这里
        filteredDepartments.value = departments.value; // 更新筛选后的部门数据
      } else {
        ElMessage.error('获取部门数据失败');
      }
    })
    .catch(error => {
      console.error('系统错误，请稍后重试', error);
      ElMessage.error('系统错误，请稍后重试');
    });
};

const getAllDepartmentIds = (data: any[]): number[] => {
  let ids: number[] = [];
  data.forEach(item => {
    ids.push(item.departmentID);
    if (item.children && item.children.length > 0) {
      ids = ids.concat(getAllDepartmentIds(item.children));
    }
  });
  return ids;
};

const toggleExpandCollapse = () => {
  if (isExpanded) {
    expandedKeys.value = [];
  } else {
    expandedKeys.value = getAllDepartmentIds(filteredDepartments.value);
  }
  isExpanded = !isExpanded;
};

onMounted(() => {
  findAll();
});

const options = [
  {
    value: '正常',
    label: '正常',
  },
  {
    value: '停用',
    label: '停用',
  },
];

const editDepartment = (department: Department) => {
  formData.value = { ...department };
  logVisible.value = true;
};

const deleteDepartment = (department: Department) => {
  ElMessageBox.confirm('是否删除该部门？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.post('http://localhost:8888/department/delDepartment', { departmentID: department.departmentID, companyID: department.companyID })
      .then(response => {
        if (response.data.isOK) {
          departments.value = departments.value.filter(d => d.departmentID !== department.departmentID);
          ElMessage.success('部门删除成功');
          findAll();
        } else {
          console.error('删除失败', response);
          ElMessage.error('删除失败');
        }
      })
      .catch(error => {
        console.error('系统错误，请稍后重试', error);
        ElMessage.error('系统错误，请稍后重试');
      });
  }).catch(() => {
    ElMessage.info('取消删除');
  });
};
</script>

<style scoped>
.el-input, .el-select, .el-button {
  margin: 10px 0;
}
</style>
