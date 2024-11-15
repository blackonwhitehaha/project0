<template>
  <div>
    <h1>
      租户标识<span style="margin-right: 8px;"></span><el-input v-model="tenantQuery.renterID" style="width: 140px ;margin-right: 20px;" placeholder="请输入租户标识" />
      联系人<span style="margin-right: 8px;"></span><el-input v-model="tenantQuery.renterContact" style="width: 140px ;margin-right: 20px;" placeholder="请输入联系人" />
      电话<span style="margin-right: 8px;"></span><el-input v-model="tenantQuery.renterPhoneNumber" style="width: 140px ;margin-right: 20px;" placeholder="请输入电话" />
      租户名称<span style="margin-right: 8px;"></span><el-input v-model="tenantQuery.renterName"  placeholder="请输入租户名称" style="width: 140px;margin-right: 20px;"></el-input>
      <el-button type="primary" :icon="Search" @click="searchTenants">搜索</el-button>
      <el-button :icon="RefreshLeft" @click="resetSearch">重置</el-button>
    </h1>
      <el-button type="primary" :icon="CirclePlus" @click="changeNew" plain>新增</el-button>
      <el-button type="success" :icon="EditPen" @click="editSelectedTenant" plain :disabled="!selectedTenant">修改</el-button>
      <el-button type="danger" :icon="DeleteFilled" @click="deleteTenants" plain :disabled="selectedTenants.length === 0">删除</el-button>
      <el-button type="warning" :icon="Download" @click="exportTenants" plain :disabled="selectedTenants.length === 0">导出</el-button>
    <el-table :data="filteredTenants" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column width="100px" type="selection" ></el-table-column>
      <el-table-column width="160px" prop="renterID" label="租户标识"></el-table-column>
      <el-table-column width="160px" prop="renterContact" label="联系人"></el-table-column>
      <el-table-column width="160px" prop="renterPhoneNumber" label="电话"></el-table-column>
      <el-table-column width="160px" prop="renterName" label="租户名称"></el-table-column>
      <el-table-column prop="renterAdmin" label="管理员"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" type="primary" :icon="EditPen" @click="editTenant(scope.row)" plain>修改</el-button>
          <el-button size="small" type="primary" :icon="DeleteFilled" @click="deleteTenant(scope.row)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[10, 20, 30, 40]"
        :size="size"
        :disabled="disabled"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalTenants"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="dialogVisible" title="增加租户" width="1000px">
      <TenantForm @submit="handleSubmit"/>
    </el-dialog>
    <el-dialog v-model="dialogVisible2" title="修改租户" width="1000px">
      <TenantChange :formData="formData" @submit="handleEditFormSubmit"/>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import TenantForm from './TenantForm.vue';
import TenantChange from './TenantChange.vue';
import { DeleteFilled, Download, Search, CirclePlus, RefreshLeft, EditPen } from '@element-plus/icons-vue';
import { type Tenant, type TenantQuery } from '@/types';
import type { ComponentSize } from 'element-plus';
import axios from 'axios';

const currentPage4 = ref(1);
const pageSize4 = ref(10);
const size = ref<ComponentSize>('default');
const filteredTenants = ref<Tenant[]>([]);
const disabled = ref(false);

const dialogVisible = ref(false);
const dialogVisible2 = ref(false);
const formData = ref<Tenant | null>(null);
const totalTenants = ref(0);
const tenants = ref<Tenant[]>([]);
const selectedTenant = ref<Tenant | null>(null);
const selectedTenants = ref<Tenant[]>([]);

const tenantQuery = ref<TenantQuery>({
  renterName: '',
  renterPhoneNumber: '',
  renterContact: '',
  renterID: undefined,
});

const changeNew = () => {
  dialogVisible.value = true;
};

const editTenant = (tenant: Tenant) => {
  formData.value = { ...tenant };
  dialogVisible2.value = true;
};

const editSelectedTenant = () => {
  if (selectedTenant.value) {
    formData.value = { ...selectedTenant.value };
    dialogVisible2.value = true;
  }
};

const handleSizeChange = (val: number) => {
  pageSize4.value = val;
  handleCurrentChange(currentPage4.value);
};

const handleCurrentChange = (val: number) => {
  currentPage4.value = val;
  getPaginatedTenants();
};

const getPaginatedTenants = () => {
  const start = (currentPage4.value - 1) * pageSize4.value;
  const end = start + pageSize4.value;
  filteredTenants.value = tenants.value.slice(start, end);
};

const handleEditFormSubmit = async (formData: any) => {
  dialogVisible2.value = false;
  delete formData.iconFile;
  try {
    const response = await axios.post('http://localhost:8888/renter/updateCompany', formData);
    if (response.data.isOK) {
      ElMessage.success('修改成功');
      findAll();  // 修改成功后刷新数据
    } else {
      ElMessage.error('修改失败');
    }
  } catch (error) {
    ElMessage.error('系统错误，请稍后重试');
  }
};

const searchTenants = computed(() => {
  const filtered = tenants.value.filter(tenant => {
    const nameMatch = tenant.renterName.includes(tenantQuery.value.renterName);
    const organizerMatch = tenant.renterPhoneNumber.includes(tenantQuery.value.renterPhoneNumber);
    const startTimeMatch = !tenantQuery.value.renterID || tenant.renterID === tenantQuery.value.renterID;
    const contactMatch = tenant.renterContact.includes(tenantQuery.value.renterContact);
    return nameMatch && organizerMatch && startTimeMatch && contactMatch;
  });
  totalTenants.value = filtered.length;
  filteredTenants.value = filtered.slice(0, pageSize4.value);
});

const resetSearch = () => {
  tenantQuery.value.renterName = '';
  tenantQuery.value.renterPhoneNumber = '';
  tenantQuery.value.renterID = undefined;
  tenantQuery.value.renterContact = '';
  searchTenants();
};

const findAll = async () => {
  try {
    const response = await axios.get('http://localhost:8888/renter/allRenter');
    tenants.value = response.data.renters;
    totalTenants.value = tenants.value.length;
    getPaginatedTenants();  // 初次加载数据后分页
  } catch (error) {
    ElMessage.error('系统错误，请稍后重试');
  }
};

onMounted(() => {
  findAll();
});

const handleSubmit = async (formData: any) => {
  dialogVisible.value = false;
  delete formData.iconFile;
  try {
    const response = await axios.post('http://localhost:8888/renter/addCompany', formData);
    if (response.data.isOK) {
      ElMessage.success(response.data.msg);
      findAll();
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('系统错误，请稍后重试');
  }
};

const deleteTenant = async (tenant: Tenant) => {
  try {
    await ElMessageBox.confirm('是否删除该租户？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const response = await axios.post('http://localhost:8888/renter/delCompany', { ids: [tenant.companyID] });
    if (response.data.isOK) {
      tenants.value = tenants.value.filter(u => u.renterID !== tenant.renterID);
      ElMessage.success('租户删除成功');
      findAll();
    } else {
      ElMessage.error('删除失败');
    }
  } catch {
    ElMessage.info('取消删除');
  }
};

const deleteTenants = async () => {
  if (selectedTenants.value.length === 0) {
    ElMessage.warning('请先选择租户');
    return;
  }
  try {
    await ElMessageBox.confirm('是否删除选中的租户？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const ids = selectedTenants.value.map(tenant => tenant.companyID);
    const response = await axios.post('http://localhost:8888/renter/delCompany', { ids });
    if (response.data.isOK) {
      tenants.value = tenants.value.filter(tenant => !ids.includes(tenant.companyID));
      selectedTenants.value = [];
      ElMessage.success('选中的租户删除成功');
      findAll();
    } else {
      ElMessage.error('删除失败');
    }
  } catch {
    ElMessage.info('取消删除');
  }
};

const exportTenants = () => {
  ElMessage.success('导出成功');
};

const handleSelectionChange = (val: Tenant[]) => {
  selectedTenants.value = val;
  selectedTenant.value = val.length === 1 ? val[0] : null;
};
</script>

<style scoped>
.el-input, .el-date-picker, .el-button {
  margin: 10px 0;
}
.demo-pagination-block {
  margin-top: 10px;
  margin-left: 60%;
}
</style>

