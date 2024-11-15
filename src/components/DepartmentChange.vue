<template>
  <el-form
    :model="localFormData"
    ref="formDataRef"
    :rules="rules"
    label-width="100px"
    style="max-width: 600px; margin: auto;"
  >
    <el-form-item v-if="localFormData" label="上级部门" prop="companyName">
      <el-select v-model="localFormData.companyName" placeholder="请选择上级部门">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <div style="display: flex; justify-content: space-between;">
      <el-form-item v-if="localFormData" label="部门名称" prop="departmentName">
        <el-input v-model="localFormData.departmentName" placeholder="请输入部门名称" style="width: 200px;" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="localFormData" label="显示排序" prop="departmentOrder">
        <el-input-number v-model="localFormData.departmentOrder"  controls-position="right" style="width: 200px;">
          <template #decrease-icon>
            <el-icon>
              <ArrowDown />
            </el-icon>
          </template>
          <template #increase-icon>
            <el-icon>
              <ArrowUp />
            </el-icon>
          </template>
        </el-input-number>
      </el-form-item>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <el-form-item v-if="localFormData" label="负责人" prop="departmentContact" class="style1">
        <el-input v-model="localFormData.departmentContact" placeholder="请输入负责人" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="localFormData" label="联系电话" prop="departmentPhoneNumber" class="style1">
        <el-input v-model="localFormData.departmentPhoneNumber" placeholder="请输入联系电话" clearable></el-input>
      </el-form-item>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <el-form-item v-if="localFormData" label="邮箱" prop="departmentMail" style="width: 300px;">
        <el-input v-model="localFormData.departmentMail" placeholder="请输入邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="localFormData" label="部门状态" prop="departmentState">
        <el-radio-group v-model="localFormData.departmentState">
          <el-radio label="正常">正常</el-radio>
          <el-radio label="停用">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
  </el-form>

  <span style="margin-right: 450px;"></span><el-button type="primary" @click="handlelogSubmit">提交</el-button>
  <el-button @click="handleReset">重置</el-button>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { type Department } from '@/types';

const options = [
  {
    value: '深圳总公司',
    label: '深圳总公司',
  },
  {
    value: '长沙分公司',
    label: '长沙分公司',
  },
];

const props = defineProps({
  formData: {
    type: Object as () => Department| null,
    default: () => ({}),
  },
});

const localFormData = ref<Department| undefined>(props.formData ? { ...props.formData } : undefined)

watch(() => props.formData, (newVal) => {
  localFormData.value = newVal ? { ...newVal } : undefined;
});


const rules = ref({
  companyName: [{ required: true, message: '请选择上级部门', trigger: 'blur' }],
  departmentName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  deparmentOrder: [{ required: true, message: '请输入排序', trigger: 'blur' }],
});

const emit = defineEmits(['submit4']);

const formDataRef = ref<FormInstance | null>(null);

const handlelogSubmit = () => {
  if (formDataRef.value) {
    formDataRef.value.validate((valid) => {
      if (valid) {
        emit('submit4', localFormData.value);
      } else {
        ElMessage.error('请完善表单信息');
      }
    });
  }
};

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
</style>
