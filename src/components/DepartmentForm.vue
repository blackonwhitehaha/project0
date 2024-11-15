<template>
  <el-form
    :model="formData"
    ref="formDataRef"
    :rules="rules"
    label-width="100px"
    style="max-width: 600px; margin: auto;"
  >
    <el-form-item label="上级部门" prop="companyName" >
      <el-select v-model="formData.companyName" placeholder="请选择上级部门">
        <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      </el-select>
    </el-form-item>
    <div style="display: flex; justify-content: space-between;">
    <el-form-item label="部门名称"  prop="departmentName" >
      <el-input v-model="formData.departmentName" placeholder="请输入部门名称" style="width: 200px;"clearable></el-input>
    </el-form-item>
    <el-form-item label="显示排序" prop="departmentOrder">
      <el-input-number v-model="formData.departmentOrder" direction="vertical" style="width: 200px;">
      <template #decrease-icon >
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
    <el-form-item label="负责人"  prop="departmentContact" class="style1">
      <el-input v-model="formData.departmentContact" placeholder="请输入负责人" clearable></el-input>
    </el-form-item>
    <el-form-item label="联系电话" prop="departmentPhoneNumber" class="style1">
      <el-input v-model="formData.departmentPhoneNumber" placeholder="请输入联系电话" clearable></el-input>
    </el-form-item>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <el-form-item label="邮箱" prop="departmentMail" style="width: 300px;">
        <el-input v-model="formData.departmentMail" placeholder="请输入邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="部门状态" prop="departmentState">
        <el-radio-group v-model="formData.departmentState">
          <el-radio label="正常">正常</el-radio>
          <el-radio label="停用">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
  </el-form>

  <span style="margin-right: 450px;"></span><el-button type="primary" @click="handledialogSubmit">提交</el-button>
  <el-button @click="handleReset">重置</el-button>
</template>

<script lang="ts" setup>
import { ref,defineEmits } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const formDataRef = ref<FormInstance | null>(null);

const formData = ref({
  companyName: '',
  departmentPhoneNumber: '',
  departmentName: '',
  departmentMail: '',
  departmentContact: '',
  departmentOrder: '',
  departmentState: '',
});

const rules = ref({
  companyName: [{ required: true, message: '请输入上级部门', trigger: 'blur' }],
  departmentName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  departmentOrder: [{ required: true,trigger: 'blur' }]
});

const options = [
  {
    value: '深圳总公司',
    label: '深圳总公司',
  },
  {
    value: '长沙分公司',
    label: '长沙分公司',
  },
]

    //重置
const handleReset = () => {
  if (formDataRef.value) {
    formDataRef.value.resetFields();
  }
};

const emit = defineEmits(['submit3']);

  const handledialogSubmit = () => {
  if (formDataRef.value) {
    formDataRef.value.validate((valid) => {
      if (valid) {
        emit('submit3', formData.value);
      } else {
        ElMessage.error('请完善表单信息');
      }
    });
  }
};

</script>



<style scoped>
.style1{
  width : 400px;
}
</style>
 