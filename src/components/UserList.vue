<template>
  <div>
    用户名称<span style="margin-right: 8px;"></span>
    <el-input
      v-model="userQuery.name"
      style="width: 120px; margin-right: 10px;"
      placeholder="请输入用户名称"
    />
    手机号码<span style="margin-right: 8px;"></span>
    <el-input
      v-model="userQuery.phone"
      style="width: 120px; margin-right: 30px;"
      placeholder="请输入手机号码"
    />
    状态<span style="margin-right: 8px;"></span>
    <el-select
      style="width: 110px; margin-right: 8px;"
      v-model="userQuery.userState"
      placeholder="用户状态"
    >
      <el-option label="正常" value="正常"></el-option>
      <el-option label="停用" value="停用"></el-option>
    </el-select>
    创建时间<span style="margin-right: 8px;"></span>
    <el-date-picker
      style="width: 200px;"
      v-model="userQuery.createdAt"
      type="date"
      placeholder="请选择创建时间"
    ></el-date-picker>
    <br />
    <el-button type="primary" :icon="Search" @click="searchUsers">搜索</el-button>
    <el-button :icon="RefreshLeft" @click="resetSearch">重置</el-button>
    <br />
    <el-button type="primary" :icon="CirclePlus" plain @click="showAddUserDialog">新增</el-button>
    <el-button type="success" :icon="EditPen" @click="editSelectedUser" plain :disabled="!selectedUser">修改</el-button>
    <el-button type="danger" :icon="DeleteFilled" @click="deleteUsers" plain :disabled="selectedUsers.length === 0">删除</el-button>
    <el-upload
      class="upload-demo"
      :http-request="uploadUsers"
      :show-file-list="false"
      :on-change="handleFileChange"
    >
      <el-button type="info" :icon="Upload" plain>导入</el-button>
    </el-upload>
    <el-button type="warning" :icon="Download" @click="exportUsers" plain :disabled="selectedUsers.length === 0">导出</el-button>

    <el-table :data="filteredUsers" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column width="50px" type="selection"></el-table-column>
      <el-table-column width="60px" prop="userID" label="编号"></el-table-column>
      <el-table-column width="80px" prop="userAccount" label="用户名称"></el-table-column>
      <el-table-column width="80px" prop="userName" label="用户昵称"></el-table-column>
      <el-table-column width="80px" prop="section" label="部门"></el-table-column>
      <el-table-column width="110px" prop="userPhoneNumber" label="手机号码"></el-table-column>
      <el-table-column width="80px" prop="userState" label="状态">
        <template #default="scope">
          <el-switch
            v-model="scope.row.userState"
            :active-value="'正常'"
            :inactive-value="'停用'"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleSwitchChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column width="100px" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column width="400px" label="操作">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            :icon="EditPen"
            @click="editUser(scope.row)"
            plain
          >修改</el-button>
          <el-button
            size="small"
            type="primary"
            :icon="DeleteFilled"
            @click="deleteUser(scope.row)"
            plain
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible2" title="修改用户" width="650px">
      <UserChange :initialFormData="formData" :positions="positions" :roles="roles" @submit="handleEditFormSubmit" :current-root="currentRoot" :current-department="currentDepartment" :current-company="currentCompany" />
    </el-dialog>

    <!-- 新增用户对话框 -->
    <el-dialog v-model="dialogVisible" title="添加用户" width="650px">
      <UserForm :current-root="currentRoot" :current-department="currentDepartment" :current-company="currentCompany" @submit2="handleSubmit" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { useOrgStore } from '@/stores/orgStore';
import { ElMessageBox, ElMessage } from 'element-plus';
import { DeleteFilled, Download, Search, CirclePlus, RefreshLeft, EditPen, Upload } from '@element-plus/icons-vue';
import UserForm from '@/components/UserForm.vue';
import UserChange from './UserChange.vue';

interface Option {
  label: string;
  value: string;
}

const props = defineProps({
  currentRoot: {
    type: String,
    required: true
  },
  currentDepartment: {
    type: String,
    required: true
  },
  currentCompany: {
    type: String,
    required: true
  },
  initialUsers: {
    type: Array as () => User[],
    required: true
  }
});

const emit = defineEmits(['refreshUsers']);

const selectedUsers = ref<User[]>([]);
const selectedUser = ref<User | null>(null);
const dialogVisible = ref(false);
const dialogVisible2 = ref(false);
const formData = ref<Partial<User> | null>(null);
const userQuery = ref({
  name: '',
  phone: '',
  createdAt: null,
  userState: ''
});
const users = ref([...props.initialUsers]);
const orgStore = useOrgStore();

const filteredUsers = computed(() => {
  return users.value ? users.value.filter(user => {
    const nameMatch = userQuery.value.name ? user.userName.includes(userQuery.value.name) : true;
    const phoneMatch = userQuery.value.phone ? user.userPhoneNumber.includes(userQuery.value.phone) : true;
    const statusMatch = userQuery.value.userState ? user.userState === userQuery.value.userState : true;
    const createdAtMatch = userQuery.value.createdAt ? user.createTime.includes(userQuery.value.createdAt) : true;
    return nameMatch && phoneMatch && statusMatch && createdAtMatch;
  }) : [];
});

const positions = ref<Option[]>([{ label: '岗位1', value: 'position1' }, { label: '岗位2', value: 'position2' }]);
const roles = ref<Option[]>([{ label: 'User', value: 'role1' }, { label: 'Admin', value: 'role2' }]);

watch(() => props.initialUsers, (newUsers) => {
  users.value = [...newUsers];
}, { immediate: true });

const showAddUserDialog = () => {
  formData.value = {
    nickname: '',
    phone: '',
    username: '',
    email: '',
    department: props.currentDepartment,
    password: '',
    gender: '',
    position: '',
    role: '',
    status: '',
    remark: '',
    companyname: props.currentCompany,
    root: props.currentRoot
  };
  dialogVisible.value = true;
};

const editUser = (user: User) => {
  console.log('编辑用户:', user);
  formData.value = { ...user, companyName: user.companyName || props.currentCompany, section: user.section || props.currentDepartment };
  dialogVisible2.value = true;
};

const editSelectedUser = () => {
  if (selectedUser.value) {
    console.log('编辑选中的用户:', selectedUser.value);
    formData.value = { ...selectedUser.value, companyName: selectedUser.value.companyName || props.currentCompany, section: selectedUser.value.section || props.currentDepartment };
    dialogVisible2.value = true;
  }
};

const handleSelectionChange = (selection: User[]) => {
  selectedUser.value = selection.length === 1 ? selection[0] : null;
  selectedUsers.value = selection;
};

const handleSubmit = async (formData: Partial<User>) => {
  dialogVisible.value = false;
  formData.companyName = props.currentCompany;
  formData.section = props.currentDepartment;
  try {
    const response = await axios.post('http://localhost:8888/user/addNormalUser', formData);
    if (response.data.isOK) {
      ElMessage.success('提交成功');
      emit('refreshUsers');
      await handleUserChange();
    } else {
      ElMessage.error('提交失败');
    }
  } catch (error) {
    ElMessage.error('系统错误，请稍后重试');
  }
};

const handleEditFormSubmit = async (formData: Partial<User>) => {
  formData.companyName = formData.companyName || props.currentCompany;
  formData.section = formData.section || props.currentDepartment;

  dialogVisible2.value = false;
  try {
    const response = await axios.post('http://localhost:8888/user/updateNormalUser', formData);
    if (response.data.isOK) {
      ElMessage.success('修改成功');
      emit('refreshUsers');
      await handleUserChange();
    } else {
      ElMessage.error('修改失败');
    }
  } catch (error) {
    ElMessage.error('系统错误，请稍后重试');
  }
};

const handleSwitchChange = async (row: User) => {
  const newState = row.userState === '正常' ? '停用' : '正常';
  try {
    const response = await axios.post('http://localhost:8888/user/updateState', { userID: row.userID, newState });
    if (response.data.isOK) {
      ElMessage.success('状态更新成功');
      row.userState = newState;
      emit('refreshUsers');
      await handleUserChange();
    } else {
      throw new Error(response.data.message || '状态更新失败');
    }
  } catch (error) {
    if (typeof error === 'string') {
      ElMessage.info(error);
    } else if (error instanceof Error) {
      ElMessage.error(error.message || '状态更新时发生错误');
    } else {
      ElMessage.error('状态更新时发生未知错误');
    }
  }
};

const searchUsers = () => {
  // 已经通过 computed 属性实现自动过滤
};

const deleteUsers = async () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请先选择用户');
    return;
  }

  try {
    await ElMessageBox.confirm('是否删除选中的用户？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const ids = selectedUsers.value.map(user => user.userID);
    const response = await axios.post('http://localhost:8888/user/delNormalUser', { ids });

    if (response.data.isOK) {
      users.value = users.value.filter(user => !ids.includes(user.userID));
      selectedUsers.value = [];
      ElMessage.success('用户删除成功');
      emit('refreshUsers');
      await handleUserChange();
    } else {
      throw new Error(response.data.message || '删除用户时发生错误');
    }
  } catch (error) {
    if (typeof error === 'string') {
      ElMessage.info(error);
    } else if (error instanceof Error) {
      ElMessage.error(error.message || '删除用户时发生错误');
    } else {
      ElMessage.error('删除用户时发生未知错误');
    }
  }
};

const uploadUsers = async (options: any) => {
  const formData = new FormData();
  formData.append('file', options.file);

  try {
    const response = await axios.post('http://localhost:8888/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.isOK) {
      const importResponse = await axios.post('http://localhost:8888/file/importUsers', {
        fileName: response.data.fileName,
        companyName: props.currentCompany,
        departmentName: props.currentDepartment
      });

      if (importResponse.data.isOK) {
        ElMessage.success(importResponse.data.msg);
        emit('refreshUsers');
        await handleUserChange();
      } else {
        ElMessage.error(importResponse.data.msg);
      }
    } else {
      ElMessage.error('文件上传失败');
    }
  } catch (error) {
    ElMessage.error('系统错误，请稍后重试');
  }
};

const handleFileChange = (file: File) => {
  console.log('文件选择变化', file);
};

const exportUsers = async () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请先选择用户');
    return;
  }
  const dataStr = JSON.stringify(selectedUsers.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  document.body.appendChild(link);
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // 发送数据到后端接口
  try {
    const response = await axios.post('http://localhost:8888/file/exportUsers', dataStr, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.data.isOK) {
      ElMessage.success('数据成功发送到后端');
      downloadAndDeleteFile(response.data.fileName);
    } else {
      ElMessage.error('发送数据到后端失败');
    }
  } catch (error) {
    console.error('Error sending data to backend:', error);
    ElMessage.error('发送数据到后端失败');
  }
};

const downloadAndDeleteFile = async (filename: string) => {
  const json = { fileName: filename };

  try {
    const response = await axios.post('http://localhost:8888/file/download', json, {
      responseType: 'blob' // 指定响应类型为 blob
    });

    if (response.status === 200) {
      // 创建一个新的 Blob 对象来保存文件
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      ElMessage.success('文件下载成功');

      console.log(json)
      // 调用删除文件接口
      try {
        const deleteResponse = await axios.post('http://localhost:8888/file/delFile', json  , {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (deleteResponse.data.isOK) {
          ElMessage.success('文件删除成功');
        } else {
          ElMessage.error('文件删除失败: ' + deleteResponse.data.msg);
        }
      } catch (deleteError) {
        console.error('删除文件时系统错误，请稍后重试', deleteError);
        ElMessage.error('删除文件时系统错误，请稍后重试');
      }
    } else {
      ElMessage.error('获取文件数据失败');
    }
  } catch (error) {
    console.error('系统错误，请稍后重试', error);
    ElMessage.error('系统错误，请稍后重试');
  }
};

const resetSearch = () => {
  userQuery.value.name = '';
  userQuery.value.phone = '';
  userQuery.value.createdAt = null;
  userQuery.value.userState = '';
};

const deleteUser = (user: User) => {
  ElMessageBox.confirm('是否删除该用户？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const response = await axios.post('http://localhost:8888/user/delNormalUser', { ids: [user.userID] });
      if (response.data.isOK) {
        users.value = users.value.filter(u => u.userID !== user.userID);
        ElMessage.success('用户删除成功');
        emit('refreshUsers');
        await handleUserChange();
      } else {
        console.error('删除失败', response);
        ElMessage.error('删除失败');
      }
    } catch (error) {
      console.error('系统错误，请稍后重试', error);
      ElMessage.error('系统错误，请稍后重试');
    }
  }).catch(() => {
    ElMessage.info('取消删除');
  });
};

const handleUserChange = async () => {
  await orgStore.fetchOrgData();
};

onMounted(async () => {
  await handleUserChange();
  const res = await axios.get('http://localhost:8888/user/getUserInfo');
  const userType = res.data.userType;
  if (users.value.length === 0 && userType === 'SuperAdmin')  {
    const response = await axios.get('http://localhost:8888/user/allList');
    const associations = response.data.associations;

    // 提取所有用户
    const allUsers = associations.flatMap(association => 
      association.companies.flatMap(company => 
        company.departments.flatMap(department => 
          department.users
        )
      )
    );

    users.value = allUsers;
  }
});
</script>

<style scoped>
.el-input,
.el-date-picker,
.el-select,
.el-button {
  margin: 10px 0;
}
.upload-demo {
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: -10px;
  position: relative;
}
</style>
