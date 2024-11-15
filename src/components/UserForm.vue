<template>
  <el-form
    :model="formData"
    ref="formDataRef"
    :rules="rules"
    label-width="100px"
    style="max-width: 600px; margin: auto;"
  >
    <div style="display: flex; justify-content: space-between;">
      <el-form-item label="用户昵称" prop="nickname" class="style1">
        <el-input v-model="formData.nickname" placeholder="请输入用户昵称" clearable></el-input>
      </el-form-item>
      <el-form-item label="归属部门" prop="department" class="style1">
        <el-input v-model="formData.department" placeholder="请输入用户部门" disabled></el-input>
      </el-form-item>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <el-form-item label="手机号码" prop="phone" class="style1">
        <el-input v-model="formData.phone" placeholder="请输入手机号码" clearable></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email" class="style1">
        <el-input v-model="formData.email" placeholder="请输入邮箱" clearable></el-input>
      </el-form-item>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名称" clearable style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入用户密码" clearable show-password style="width: 200px;"></el-input>
      </el-form-item>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <el-form-item label="用户性别" prop="gender" style="width: 300px;">
        <el-select v-model="formData.gender" placeholder="请选择用户性别">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="正常">正常</el-radio>
          <el-radio label="停用">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <el-form-item label="岗位" prop="position">
        <el-select v-model="formData.position" placeholder="请选择岗位" style="width: 200px;">
          <el-option label="岗位1" value="position1"></el-option>
          <el-option label="岗位2" value="position2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="formData.role" placeholder="请选择角色" style="width: 200px;">
          <el-option label="User" value="role1"></el-option>
          <el-option label="Admin" value="role2"></el-option>
        </el-select>
      </el-form-item>
      
    </div>
    <el-form-item label="备注">
      <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注信息"></el-input>
    </el-form-item>
  </el-form>

  <span style="margin-right: 450px;"></span>
  <el-button type="primary" @click="handleSubmit">提交</el-button>
  <el-button @click="handleReset">重置</el-button>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';

const formDataRef = ref<FormInstance | null>(null);

const props = defineProps({
  currentDepartment: {
    type: String,
    required: true
  },
  currentCompany: {
    type: String,
    required: true
  }
});

const formData = ref({
  nickname: '',
  phone: '',
  username: '',
  email: '',
  department: props.currentDepartment,
  password: '',
  gender: '女',
  position: '',
  role: '',
  status: '正常',
  remark: '',
  companyname: props.currentCompany
});

watch(
  () => props.currentDepartment,
  (newDepartment) => {
    formData.value.department = newDepartment;
  }
);

watch(
  () => props.currentCompany,
  (newCompany) => {
    formData.value.companyname = newCompany;
  }
);

const rules = ref({
  nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]
});

const emit = defineEmits(['submit2']);

const handleReset = () => {
  if (formDataRef.value) {
    formDataRef.value.resetFields();
  }
};

const handleSubmit = () => {
  if (formDataRef.value) {
    formDataRef.value.validate((valid) => {
      if (valid) {
        emit('submit2', formData.value);
      } else {
        ElMessage.error('请完善表单信息');
      }
    });
  }
};
</script>

<style scoped>
.style1 {
  width: 400px;
}
</style>
