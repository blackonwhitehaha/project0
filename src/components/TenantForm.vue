<template>
  <el-form :model="localFormData"
   ref="formRef" 
   label-width="120px"
    :rules="rules"
    
   >
    <el-form-item v-if="localFormData" label="租户名称" prop="renterName">
      <el-input v-model="localFormData.renterName" placeholder="请输入租户名称"></el-input>
    </el-form-item>

    <el-form-item v-if="localFormData" label="租户图标" prop="fileName">
      <el-upload
        action="http://localhost:8888/file/upload"
        list-type="picture-card"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="localFormData.iconFile"
        :limit="1"
        :on-exceed="handleExceed"
        :before-upload="beforeCoverUpload"
        :on-success="handleUploadSuccess"
      >
        <el-icon name="plus"/>
      </el-upload>
      <br>
      <div slot="tip" class="el-upload__tip">(上传图片格式不超过5MB格式可为png/jpg/jpeg)</div>
    </el-form-item>

    <el-form-item v-if="localFormData" label="联系人" prop="renterContact">
      <el-input v-model="localFormData.renterContact" placeholder="请输入联系人"></el-input>
    </el-form-item>

    <el-form-item v-if="localFormData" label="电话" prop="renterPhoneNumber">
      <el-input v-model="localFormData.renterPhoneNumber" placeholder="请输入电话"></el-input>
    </el-form-item>
    
    <el-form-item v-if="localFormData" label="管理员" prop="renterAdmin">
      <el-input v-model="localFormData.renterAdmin" placeholder="请输入管理员"></el-input>
    </el-form-item>
    <el-form-item v-if="localFormData" label="备注" prop="notes">
    <MyEditor @change="(html:any) => { html为更新值 }" :html="localFormData.notes" />

    </el-form-item>

    <span style="margin-right: 800px;"></span><el-button v-if="localFormData" type="primary" @click="handleSubmit">提交</el-button>
    <el-button v-if="localFormData" @click="handleReset">重置</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted,watch } from 'vue';
import { type FormInstance,ElMessage, ElUpload, ElButton, ElFormItem, ElInput, ElDatePicker, ElIcon } from 'element-plus';
import MyEditor from './MyEditor.vue';
const formDataRef = ref<FormInstance | null>(null);
const emit = defineEmits(['submit']);
interface TenantFormData {
renterID?: number;
renterName?: string;
renterContact?: string;
renterPhoneNumber?: string;
renterAdmin?: string;
renterIcon?: string;
notes?: string;
fileName?: string;
iconFile?: any[];
}
const props = defineProps({
formData: {
  type: Object as () => TenantFormData | null,
  default: () => ({})
}
});
const localFormData = ref<TenantFormData | undefined>(props.formData ? { ...props.formData } : undefined);

watch(() => props.formData, (newVal) => {
localFormData.value = newVal ? { ...newVal } : undefined;
});


const formRef = ref();

const rules = ref({
  renterName: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
  renterContact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  renterPhoneNumber: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
  renterAdmin: [{ required: true, message: '请输入管理员', trigger: 'blur' }]
    });

const handlePreview = (file: any) => {
  console.log('preview', file);
};

const handleRemove = (file: any, fileList: any) => {
  console.log('remove', file, fileList);
};

const handleExceed = (files: any, fileList: any) => {
  ElMessage.warning(`最多只能上传一个文件`);
};

const beforeCoverUpload = (file: any) => {
  const isImage = file.type.startsWith('image/');
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isImage) {
    ElMessage.error('上传文件必须是图片!');
  }
  if (!isLt10M) {
    ElMessage.error('上传图片大小不能超过 10MB!');
  }
  return isImage && isLt10M;
};

// const handleSubmit = () => {
//   formRef.value.validate((valid: boolean) => {
//     if (valid) {
//       emit('submit', localFormData.value);
//       // 实际项目中可以将 form.value 数据提交给后端
//     } else {
//       ElMessage.error('请完善表单信息');
//       return false;
//     }
//   });
// };
const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid && localFormData.value) {
      emit('submit', localFormData.value);
    } else {
      ElMessage.error('请完善表单信息');
      return false;
    }
  });
};
const handleUploadSuccess = (response: any, file: any) => {
// response 是后端返回的响应数据
console.log('Upload success:', response);

// 假设后端返回的响应中包含了文件名 FileName
const fileName = response.fileName;

if (localFormData.value) {
  localFormData.value.renterIcon = fileName;
}

// 可以根据需要显示成功消息
ElMessage.success('文件上传成功！');
};

const handleReset = () => {
if (formDataRef.value) {
  formDataRef.value.resetFields();
}
};
</script>

<style scoped>
/* 在这里可以添加样式来美化表单 */
</style>
