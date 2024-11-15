<template>
  <el-form
    :model="formData"
    ref="formDataRef"
    :rules="rules"
    label-width="100px"
    style="max-width: 600px; margin: auto;"
  >
    <div style="display: flex; justify-content: space-between;">
      <el-form-item label="用户昵称" prop="userAccount" class="style1">
        <el-input v-model="formData.userAccount" placeholder="请输入用户昵称" clearable></el-input>
      </el-form-item>
      <el-form-item label="归属部门" prop="section" class="style1">
        <el-input v-model="formData.section" placeholder="请选择部门" clearable>
          <template #append>
            <el-button @click="showOrgTree = true" :icon="ArrowDown" class="append-el-button"></el-button>
          </template>
        </el-input>
      </el-form-item>
    </div>
    <el-dialog v-model="showOrgTree" title="选择部门" width="300px">
      <OrgList @update-current-org="updateOrg" />
    </el-dialog>
    <div style="display: flex; justify-content: space-between;">
      <el-form-item label="手机号码" prop="userPhoneNumber" class="style1">
        <el-input v-model="formData.userPhoneNumber" placeholder="请输入手机号码" clearable></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="userMail" class="style1">
        <el-input v-model="formData.userMail" placeholder="请输入邮箱" clearable></el-input>
      </el-form-item>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <el-form-item label="用户性别" prop="sexual" style="width: 300px;">
        <el-select v-model="formData.sexual" placeholder="请选择用户性别">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="userState">
        <el-radio-group v-model="formData.userState">
          <el-radio label="正常">正常</el-radio>
          <el-radio label="停用">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <el-form-item label="岗位" prop="userJob">
        <el-select v-model="formData.userJob" placeholder="请选择岗位" style="width: 200px;">
          <el-option v-for="position in positions" :key="position.value" :label="position.label" :value="position.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="userType">
        <el-select v-model="formData.userType" placeholder="请选择角色" style="width: 200px;">
          <el-option v-for="role in roles" :key="role.value" :label="role.label" :value="role.value"></el-option>
        </el-select>
      </el-form-item>
    </div>
    <el-form-item label="备注">
      <el-input v-model="formData.notes" type="textarea" :rows="2" placeholder="请输入备注信息"></el-input>
    </el-form-item>

    <span style="margin-right: 450px;"></span><el-button type="primary" @click="handleEditFormSubmit">提交</el-button>
    <el-button @click="handleReset">重置</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import OrgList from '@/components/OrgList.vue'; // 确保路径正确

interface Option {
  label: string;
  value: string;
}

interface user {
  normalUserID: string;
  userAccount: string;
  userName: string;
  userPhoneNumber: string;
  userState: string;
  createTime: string;
  section: string;
  userJob: string;
  userType: string;
  userMail: string;
  sexual: string;
  notes: string;
  companyName?: string;
}

const props = defineProps({
  initialFormData: {
    type: Object as () => Partial<user>,
    required: true
  },
  positions: {
    type: Array as () => Option[],
    required: true
  },
  roles: {
    type: Array as () => Option[],
    required: true
  },
  companyName: {
    type: String,
    required: true
  }
});

const formDataRef = ref<FormInstance | null>(null);
const emit = defineEmits(['submit']);

const formData = ref<Partial<user>>({ ...props.initialFormData });
const showOrgTree = ref(false);

watch(() => props.initialFormData, (newFormData) => {
  formData.value = { ...newFormData, companyName: props.companyName };
}, { immediate: true });

const updateOrg = (orgInfo: { root: string, company: string, department: string }) => {
  formData.value.section = orgInfo.department;
  formData.value.companyName = orgInfo.company;
  showOrgTree.value = false;
};

const handleEditFormSubmit = () => {
  if (formDataRef.value) {
    formDataRef.value.validate((valid) => {
      if (valid) {
        // 确保 companyName 始终有值
        formData.value.companyName = formData.value.companyName || props.companyName;
        emit('submit', formData.value);
      } else {
        ElMessage.error('请完善表单信息');
      }
    });
  }
};

const rules = ref({
  userAccount: [{ required: true, message: '请输入用户昵称', trigger: 'change' }]
});

// 重置
const handleReset = () => {
  if (formDataRef.value) {
    formDataRef.value.resetFields();
  }
};
</script>

<style scoped>
.style1 {
  width: 400px;
}
.append-el-button {
  border: none;
  margin: 1px;
  padding: 0;
}
</style>
