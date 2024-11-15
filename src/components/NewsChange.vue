<template>
  <el-form :model="localFormData" ref="formRef" label-width="120px" :rules="rules">
    <el-form-item v-if="localFormData" label="新闻标题" prop="newsTitle">
      <el-input  v-model="localFormData.newsTitle" placeholder="请输入新闻标题"></el-input>
    </el-form-item>

    <el-form-item v-if="localFormData" label="新闻图片" prop="fileName1">
      <el-upload
        action="http://localhost:8888/file/upload"
        list-type="picture-card"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="localFormData.picFile"
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

    <el-form-item v-if="localFormData" label="新闻内容" prop="newsContent">
      <MyEditor @change="(html:any) => { html为更新值 }" :html="localFormData.newsContent" />

      </el-form-item>

    <el-form-item v-if="localFormData" label="作者" prop="newsAuthor">
      <el-input v-model="localFormData.newsAuthor" placeholder="请输入作者"></el-input>
    </el-form-item>

    <el-form-item v-if="localFormData" label="新闻简介" prop="newsInfo">
      <el-input v-model="localFormData.newsInfo" type="textarea" :rows="2" placeholder="请输入新闻简介"></el-input>
    </el-form-item>

    <el-form-item v-if="localFormData" label="租户" prop="newsRenter">
      <el-input v-model="localFormData.newsRenter" placeholder="请输入租户"></el-input>
    </el-form-item>

    <span style="margin-right: 800px;"></span><el-button v-if="localFormData" type="primary" @click="handleEditFormSubmit">提交</el-button>
    <el-button v-if="localFormData" @click="handleReset">重置</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted,watch } from 'vue';
import { ElMessage, ElUpload, ElButton, ElFormItem, ElInput, ElDatePicker, ElIcon } from 'element-plus';

import MyEditor from './MyEditor.vue';

const emit = defineEmits(['submit']);

interface NewsFormData {
newsID?: number;
newsTitle?: string;
newsInfo?: string;
newsRenter?: string;
newsContent?: string;
newsPic?: string;
newsAuthor?:string;
fileName1?: string;
picFile?:any[];
}
const rules = ref({
  newsTitle: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
  // newsContent: [{ required: true, message: '请输入新闻内容', trigger: 'blur' }],
  newsInfo: [{ required: true, message: '请输入新闻简介', trigger: 'blur' }],
  newsPic: [{ required: true, message: '请上传新闻图片', trigger: 'change' }]
});
const props = defineProps({
formData: {
  type: Object as () => NewsFormData | null,
  default: () => ({})
}
});

const localFormData = ref<NewsFormData | undefined>(props.formData ? { ...props.formData } : undefined);

watch(() => props.formData, (newVal) => {
localFormData.value = newVal ? { ...newVal } : undefined;
});
const formRef = ref();


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

const handleEditFormSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      emit('submit', localFormData.value);
      // 实际项目中可以将 form.value 数据提交给后端
    } else {
      ElMessage.error('请完善表单信息');
      return false;
    }
  });
};

const handleReset = () => {
  formRef.value.resetFields();
};
const handleUploadSuccess = (response: any, file: any) => {
// response 是后端返回的响应数据
console.log('Upload success:', response);

// 假设后端返回的响应中包含了文件名 FileName
const fileName1 = response.fileName1;

localFormData.value.newsPic = fileName1;
// 可以根据需要显示成功消息
ElMessage.success('文件上传成功！');
};
</script>

<style scoped>
/* 在这里可以添加样式来美化表单 */
</style>
